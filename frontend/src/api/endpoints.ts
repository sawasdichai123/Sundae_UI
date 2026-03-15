/**
 * SUNDAE Frontend — API Endpoints (Mock for Prototype)
 *
 * All API functions operate on in-memory mock data.
 * No real HTTP requests are made.
 */

import type {
    Bot,
    PlatformSource,
} from "../types";
import type { ChatMessage } from "../types";
import { mockDb } from "./mockDb";

// ── Helper ──────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function wrap<T>(data: T) {
    return { data };
}

// ── Documents ───────────────────────────────────────────────────

export const documentsApi = {
    upload: async (_file: File, _botId: string | null, _organizationId: string) => {
        await delay(800);
        return wrap(mockDb.uploadDocument(_file, _botId, _organizationId));
    },

    list: async (_organizationId: string) => {
        await delay(300);
        return wrap(mockDb.listDocuments(_organizationId));
    },

    getStatus: async (documentId: string, _organizationId: string) => {
        await delay(100);
        const docs = mockDb.listDocuments(_organizationId);
        const doc = docs.find((d) => d.id === documentId);
        return wrap(doc || docs[0]);
    },

    delete: async (documentId: string, _organizationId: string) => {
        await delay(300);
        return wrap(mockDb.deleteDocument(documentId));
    },

    linkBot: async (documentId: string, _organizationId: string, botId: string | null) => {
        await delay(200);
        return wrap(mockDb.linkDocumentToBot(documentId, botId));
    },
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

function pickMockResponse(query: string): string {
    return mockDb.pickMockAnswer(query);
}

export const chatApi = {
    ask: async (params: ChatAskParams) => {
        await delay(1000);
        const answer = pickMockResponse(params.userQuery);
        return wrap({
            answer,
            sources: [
                { document_id: "doc-001", chunk_index: 3, score: 0.92 },
                { document_id: "doc-002", chunk_index: 1, score: 0.85 },
            ],
            session_id: params.sessionId || null,
        });
    },

    askStream: (
        params: ChatAskParams,
        onToken: (token: string) => void,
        onSources: (sources: Array<{ document_id: string; chunk_index: number; score: number }>) => void,
        onDone: () => void,
        _onError: (error: string) => void,
    ): AbortController => {
        const controller = new AbortController();
        const response = pickMockResponse(params.userQuery);

        const sid = params.sessionId || "mock-session";

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            session_id: sid,
            organization_id: params.organizationId,
            role: "user",
            content: params.userQuery,
            metadata: {},
            created_at: new Date().toISOString(),
        };
        mockDb.appendMessage(sid, userMsg);

        mockDb.ensureSession({
            id: sid,
            organization_id: params.organizationId,
            bot_id: params.botId,
            platform_user_id: params.platformUserId,
            platform_source: params.platformSource || "web",
            status: "active",
            started_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
        });

        // Simulate streaming — character by character with delay
        (async () => {
            // Initial "thinking" delay
            await delay(800);

            const chars = response.split("");
            let i = 0;
            const chunkSize = 3; // Send 3 characters at a time for speed

            while (i < chars.length) {
                if (controller.signal.aborted) return;
                const chunk = chars.slice(i, i + chunkSize).join("");
                onToken(chunk);
                i += chunkSize;
                await delay(20); // 20ms per chunk for realistic typing
            }

            // Send sources after text
            onSources([
                { document_id: "doc-001", chunk_index: 3, score: 0.92 },
                { document_id: "doc-002", chunk_index: 1, score: 0.85 },
            ]);

            // Store assistant message
            const assistantMsg: ChatMessage = {
                id: crypto.randomUUID(),
                session_id: sid,
                organization_id: params.organizationId,
                role: "assistant",
                content: response,
                metadata: {},
                created_at: new Date().toISOString(),
            };
            mockDb.appendMessage(sid, assistantMsg);

            onDone();
        })();

        return controller;
    },

    requestHuman: async (_sessionId: string, _organizationId: string, _botId: string) => {
        await delay(300);
        return wrap(mockDb.updateSessionStatus(_sessionId, "active"));
    },

    sendMessage: async (_sessionId: string, _organizationId: string, content: string) => {
        await delay(200);
        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            session_id: _sessionId,
            organization_id: _organizationId,
            role: "user",
            content,
            metadata: {},
            created_at: new Date().toISOString(),
        };
        return wrap(mockDb.appendMessage(_sessionId, msg));
    },
};

// ── Bots ────────────────────────────────────────────────────────

export const botsApi = {
    create: async (data: {
        name: string;
        organization_id: string;
        description?: string;
        system_prompt?: string;
        is_web_enabled?: boolean;
    }) => {
        await delay(400);
        return wrap(mockDb.createBot(data));
    },

    list: async (_organizationId: string) => {
        await delay(300);
        return wrap(mockDb.listBots(_organizationId));
    },

    get: async (botId: string, _organizationId: string) => {
        await delay(100);
        const bot = mockDb.getBot(botId);
        const botsList = mockDb.listBots(_organizationId);
        return wrap(bot || botsList[0]);
    },

    update: async (botId: string, _organizationId: string, data: Partial<Bot>) => {
        await delay(300);
        const updated = mockDb.updateBot(botId, data);
        const botsList = mockDb.listBots(_organizationId);
        return wrap(updated || botsList[0]);
    },

    delete: async (botId: string, _organizationId: string) => {
        await delay(300);
        return wrap(mockDb.deleteBot(botId));
    },
};

// ── Inbox ───────────────────────────────────────────────────────

export const inboxApi = {
    listSessions: async (_organizationId: string) => {
        await delay(200);
        return wrap(mockDb.listSessions(_organizationId));
    },

    getMessages: async (sessionId: string, _organizationId: string) => {
        await delay(200);
        return wrap(mockDb.getMessages(sessionId));
    },

    updateStatus: async (sessionId: string, _organizationId: string, status: string) => {
        await delay(200);
        return wrap(mockDb.updateSessionStatus(sessionId, status as any));
    },

    sendMessage: async (sessionId: string, organizationId: string, content: string) => {
        await delay(200);
        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            session_id: sessionId,
            organization_id: organizationId,
            role: "admin",
            content,
            metadata: {},
            created_at: new Date().toISOString(),
        };
        return wrap(mockDb.appendMessage(sessionId, msg));
    },

    getNewMessages: async (sessionId: string, _organizationId: string, after: string) => {
        await delay(100);
        return wrap(mockDb.getNewMessages(sessionId, after));
    },

    mySessions: async (_organizationId: string) => {
        await delay(200);
        return wrap(mockDb.mySessions(_organizationId));
    },
};
