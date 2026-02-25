/**
 * SUNDAE Frontend — API Endpoint Definitions
 *
 * Centralized API calls matching the FastAPI backend endpoints.
 * Updated for Omnichannel support (Web + LINE).
 */

import apiClient from "./axios";
import type {
    ChatAskResponse,
    Document,
    DocumentUploadResponse,
    PlatformSource,
} from "../types";

// ── Documents ───────────────────────────────────────────────────

export const documentsApi = {
    /** Upload a PDF document for processing. */
    upload: (file: File, botId: string, organizationId: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bot_id", botId);
        formData.append("organization_id", organizationId);

        return apiClient.post<DocumentUploadResponse>(
            "/api/documents/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /** List all documents for an organization. */
    list: (organizationId: string) =>
        apiClient.get<Document[]>("/api/documents", {
            params: { organization_id: organizationId },
        }),

    /** Get document status by ID. */
    getStatus: (documentId: string) =>
        apiClient.get<Document>(`/api/documents/${documentId}`),

    /** Delete a document. */
    delete: (documentId: string) =>
        apiClient.delete(`/api/documents/${documentId}`),
};

// ── Chat (Omnichannel) ──────────────────────────────────────────

export interface ChatAskParams {
    userQuery: string;
    organizationId: string;
    botId: string;
    platformUserId: string;
    platformSource?: PlatformSource;
    sessionId?: string;
}

export const chatApi = {
    /** Send a question to the RAG pipeline (omnichannel). */
    ask: ({
        userQuery,
        organizationId,
        botId,
        platformUserId,
        platformSource = "web",
        sessionId,
    }: ChatAskParams) =>
        apiClient.post<ChatAskResponse>("/api/chat/ask", {
            user_query: userQuery,
            organization_id: organizationId,
            bot_id: botId,
            platform_user_id: platformUserId,
            platform_source: platformSource,
            session_id: sessionId,
        }),
};
