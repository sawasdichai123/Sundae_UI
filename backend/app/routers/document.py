"""
SUNDAE Backend — Document Upload Router (Task 6.6.1)

Handles PDF upload, text extraction, chunking, embedding, and storage.
This is the ingestion pipeline that prepares documents for RAG retrieval.

Flow:
  1. Accept PDF via multipart form upload
  2. Extract text using PyMuPDF
  3. Split into Parent-Child chunks (Thai-aware)
  4. Embed child chunks using BAAI/bge-m3
  5. Store everything in Supabase with organization_id isolation

SECURITY:
    Every database insert MUST include organization_id.
    The backend uses Service Role Key (bypasses RLS).
"""

from __future__ import annotations

import logging
import uuid
from typing import Optional

import fitz  # PyMuPDF
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.core.auth import CurrentUser, require_approved
from app.core.database import get_supabase
from app.services.ai_models import get_embedding_service
from app.services.chunking import create_parent_child_chunks
from app.services.vector_search import store_parent_chunks, store_child_chunks

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/documents", tags=["Documents"])


# ── Response Models ──────────────────────────────────────────────


class UploadResponse(BaseModel):
    """Response schema for a successful document upload."""

    document_id: str
    filename: str
    total_parent_chunks: int
    total_child_chunks: int
    status: str


# ── Helper Functions ─────────────────────────────────────────────


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract all text from a PDF file using PyMuPDF.

    Args:
        pdf_bytes: Raw bytes of the PDF file.

    Returns:
        Concatenated text from all pages.

    Raises:
        ValueError: If the PDF contains no extractable text.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages: list[str] = []

    for page in doc:
        text = page.get_text("text")
        if text and text.strip():
            pages.append(text.strip())

    doc.close()

    full_text = "\n\n".join(pages)
    if not full_text.strip():
        raise ValueError("PDF contains no extractable text.")

    return full_text


# ── Endpoint ─────────────────────────────────────────────────────


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    organization_id: str = Form(...),
    bot_id: Optional[str] = Form(None),
    user: CurrentUser = Depends(require_approved),
) -> UploadResponse:
    """Upload a PDF document and process it through the RAG pipeline.

    Accepts a PDF file via multipart form data, extracts text, splits
    it into Parent-Child chunks using the Thai-aware splitter, embeds
    child chunks, and stores everything in Supabase.

    Args:
        file:            PDF file to upload.
        organization_id: UUID of the tenant organization.
        bot_id:          Optional UUID of the bot to associate with.

    Returns:
        UploadResponse with document ID and chunk counts.

    Raises:
        HTTPException 400: Invalid file type or empty PDF.
        HTTPException 500: Processing or storage failure.
    """
    # ── 1. Validate file type ────────────────────────────────────
    if file.content_type not in ("application/pdf",):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Only PDF files are accepted.",
        )

    document_id = str(uuid.uuid4())
    supabase = get_supabase()

    try:
        # ── 2. Insert document record (status = processing) ──────
        doc_bytes = await file.read()
        file_size = len(doc_bytes)

        doc_row = {
            "id": document_id,
            "organization_id": organization_id,
            "bot_id": bot_id,
            "name": file.filename or "untitled.pdf",
            "file_size_bytes": file_size,
            "mime_type": "application/pdf",
            "status": "processing",
        }
        await (supabase.table("documents").insert(doc_row)).execute()
        logger.info(
            "Document record created: %s (org=%s)", document_id, organization_id
        )

        # ── 3. Extract text from PDF ────────────────────────────
        try:
            full_text = extract_text_from_pdf(doc_bytes)
        except ValueError as exc:
            # Update status to error and return 400
            await (
                supabase.table("documents")
                .update({"status": "error"})
                .eq("id", document_id)
                .eq("organization_id", organization_id)
            ).execute()
            raise HTTPException(status_code=400, detail=str(exc))

        logger.info(
            "Extracted %d characters from PDF '%s'",
            len(full_text),
            file.filename,
        )

        # ── 4. Chunk text (Parent-Child) ────────────────────────
        parent_chunks = create_parent_child_chunks(
            text=full_text,
            document_id=document_id,
        )

        total_parent = len(parent_chunks)
        total_child = sum(len(p.children) for p in parent_chunks)

        logger.info(
            "Chunked into %d parents, %d children (doc=%s)",
            total_parent,
            total_child,
            document_id,
        )

        # ── 5. Embed child chunks ───────────────────────────────
        embedder = get_embedding_service()

        # Collect all child texts for batch embedding
        all_child_texts: list[str] = []
        for parent in parent_chunks:
            for child in parent.children:
                all_child_texts.append(child.text)

        if all_child_texts:
            all_embeddings = await embedder.embed_texts(all_child_texts)
        else:
            all_embeddings = []

        logger.info("Embedded %d child chunks (doc=%s)", len(all_embeddings), document_id)

        # ── 6. Store parent chunks ──────────────────────────────
        parent_rows = [
            {
                "id": p.id,
                "document_id": p.document_id,
                "chunk_index": p.chunk_index,
                "text": p.text,
            }
            for p in parent_chunks
        ]
        await store_parent_chunks(parent_rows, organization_id)

        # ── 7. Store child chunks (with embeddings) ─────────────
        embedding_idx = 0
        child_rows: list[dict] = []
        for parent in parent_chunks:
            for child in parent.children:
                child_rows.append(
                    {
                        "id": child.id,
                        "parent_id": child.parent_id,
                        "document_id": document_id,
                        "chunk_index": child.chunk_index,
                        "text": child.text,
                        "embedding": all_embeddings[embedding_idx],
                    }
                )
                embedding_idx += 1

        await store_child_chunks(child_rows, organization_id)

        # ── 8. Update document status to ready ──────────────────
        await (
            supabase.table("documents")
            .update({"status": "ready"})
            .eq("id", document_id)
            .eq("organization_id", organization_id)
        ).execute()

        logger.info("Document processing complete: %s (org=%s)", document_id, organization_id)

        return UploadResponse(
            document_id=document_id,
            filename=file.filename or "untitled.pdf",
            total_parent_chunks=total_parent,
            total_child_chunks=total_child,
            status="ready",
        )

    except HTTPException:
        # Re-raise HTTP exceptions without wrapping
        raise

    except Exception as exc:
        logger.error("Document processing failed (doc=%s): %s", document_id, exc)

        # Attempt to update document status to error
        try:
            await (
                supabase.table("documents")
                .update({"status": "error"})
                .eq("id", document_id)
                .eq("organization_id", organization_id)
            ).execute()
        except Exception:
            pass  # Best-effort cleanup

        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {exc}",
        )
