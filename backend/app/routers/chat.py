"""
SUNDAE Backend — RAG Chat Router (Task 6.6.2)

The main endpoint that triggers the full RAG pipeline:
  1. Encode user query → embedding
  2. Vector search → Top-K child chunks → parent mapping
  3. Rerank parent chunks
  4. Generate grounded response via LLM

SECURITY:
    organization_id is passed to EVERY service call.
    The backend uses Service Role Key (bypasses RLS), so explicit
    org filtering is the primary multi-tenant isolation mechanism.
"""

from __future__ import annotations

import logging
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import get_supabase
from app.services.ai_models import get_embedding_service, get_reranker_service
from app.services.llm_generator import generate_response
from app.services.vector_search import search_parent_chunks

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat"])


# ── Request / Response Models ────────────────────────────────────


class ChatRequest(BaseModel):
    """Request schema for the RAG chat endpoint."""

    user_query: str = Field(..., min_length=1, description="The user's question")
    organization_id: str = Field(..., description="UUID of the tenant organization")
    session_id: Optional[str] = Field(
        None, description="Optional chat session ID for conversation continuity"
    )


class SourceChunk(BaseModel):
    """A source chunk used to generate the answer."""

    document_id: str
    chunk_index: int
    score: float


class ChatResponse(BaseModel):
    """Response schema for the RAG chat endpoint."""

    answer: str
    session_id: Optional[str] = None
    sources: list[SourceChunk] = []


# ── Endpoint ─────────────────────────────────────────────────────


@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest) -> ChatResponse:
    """Process a user question through the full RAG pipeline.

    Steps:
      1. Encode the query into a 1024-dim embedding
      2. Vector search for the Top-20 child chunks → map to parents
      3. Rerank parent chunks (threshold = 0.3)
      4. Generate a grounded Thai response via Qwen LLM
      5. Optionally log the conversation to chat_sessions/chat_messages

    Args:
        request: ChatRequest with user_query, organization_id, session_id.

    Returns:
        ChatResponse with the AI answer, session_id, and source references.

    Raises:
        HTTPException 400: Empty or invalid query.
        HTTPException 500: Pipeline processing failure.
    """
    user_query = request.user_query.strip()
    organization_id = request.organization_id
    session_id = request.session_id

    if not user_query:
        raise HTTPException(status_code=400, detail="user_query must not be empty.")

    try:
        # ── Step 1: Encode query ────────────────────────────────
        embedder = get_embedding_service()
        query_embedding = await embedder.embed_query(user_query)

        logger.info("Query embedded (org=%s, query_len=%d)", organization_id, len(user_query))

        # ── Step 2: Vector search (child → parent mapping) ──────
        parent_results = await search_parent_chunks(
            query_embedding=query_embedding,
            organization_id=organization_id,
        )

        logger.info(
            "Vector search returned %d parent chunks (org=%s)",
            len(parent_results),
            organization_id,
        )

        # ── Step 3: Rerank parent chunks ────────────────────────
        if parent_results:
            reranker = get_reranker_service()
            parent_texts = [p.text for p in parent_results]

            rerank_results = await reranker.rerank(
                query=user_query,
                passages=parent_texts,
                score_threshold=0.3,
            )

            surviving_texts = [r.text for r in rerank_results]

            # Build source references from reranked results
            sources: list[SourceChunk] = []
            for rr in rerank_results:
                original_parent = parent_results[rr.original_index]
                sources.append(
                    SourceChunk(
                        document_id=original_parent.document_id,
                        chunk_index=original_parent.chunk_index,
                        score=round(rr.score, 4),
                    )
                )

            logger.info(
                "Reranking: %d → %d survived (org=%s)",
                len(parent_results),
                len(rerank_results),
                organization_id,
            )
        else:
            surviving_texts = []
            sources = []

        # ── Step 4: Generate response via LLM ───────────────────
        answer = await generate_response(
            user_query=user_query,
            retrieved_contexts=surviving_texts,
        )

        logger.info(
            "LLM response generated (org=%s, answer_len=%d)",
            organization_id,
            len(answer),
        )

        # ── Step 5: Log conversation (if session_id provided) ───
        if session_id:
            try:
                supabase = get_supabase()

                # Upsert chat session (update last_message_at)
                session_row = {
                    "id": session_id,
                    "organization_id": organization_id,
                    "channel": "api",
                    "last_message_at": "now()",
                }
                await (
                    supabase.table("chat_sessions")
                    .upsert(session_row, on_conflict="id")
                ).execute()

                # Insert user message
                user_msg = {
                    "id": str(uuid.uuid4()),
                    "session_id": session_id,
                    "organization_id": organization_id,
                    "role": "user",
                    "content": user_query,
                }
                await (supabase.table("chat_messages").insert(user_msg)).execute()

                # Insert assistant message with source metadata
                assistant_msg = {
                    "id": str(uuid.uuid4()),
                    "session_id": session_id,
                    "organization_id": organization_id,
                    "role": "assistant",
                    "content": answer,
                    "metadata": {
                        "sources": [s.model_dump() for s in sources],
                        "reranked_count": len(sources),
                    },
                }
                await (supabase.table("chat_messages").insert(assistant_msg)).execute()

                logger.info("Chat logged to session %s (org=%s)", session_id, organization_id)

            except Exception as log_exc:
                # Chat logging failure should NOT block the response
                logger.warning(
                    "Failed to log chat (session=%s): %s", session_id, log_exc
                )

        return ChatResponse(
            answer=answer,
            session_id=session_id,
            sources=sources,
        )

    except HTTPException:
        raise

    except Exception as exc:
        logger.error("RAG pipeline failed (org=%s): %s", organization_id, exc)
        raise HTTPException(
            status_code=500,
            detail=f"RAG pipeline processing failed: {exc}",
        )
