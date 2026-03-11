/**
 * SUNDAE Frontend — API Endpoints (Mock for Prototype)
 *
 * All API functions operate on in-memory mock data.
 * No real HTTP requests are made.
 */

import type {
    Bot,
    Document,
    PlatformSource,
} from "../types";
import {
    MOCK_BOTS,
    MOCK_DOCUMENTS,
    MOCK_SESSIONS,
    MOCK_MESSAGES,
    MOCK_SESSION_USER_NAMES,
    MOCK_AI_RESPONSES,
    MOCK_ORG,
} from "../mock/mockData";

// ── Mutable In-Memory State ─────────────────────────────────────

let bots = [...MOCK_BOTS];
let documents = [...MOCK_DOCUMENTS];
let sessions = [...MOCK_SESSIONS];
let messagesDb: Record<string, any[]> = JSON.parse(JSON.stringify(MOCK_MESSAGES));

// ── Helper ──────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function wrap<T>(data: T) {
    return { data };
}

// ── Documents ───────────────────────────────────────────────────

export const documentsApi = {
    upload: async (_file: File, _botId: string | null, _organizationId: string) => {
        await delay(800);
        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            organization_id: MOCK_ORG.id,
            bot_id: _botId || null,
            name: _file.name || `เอกสารใหม่_${Date.now()}.pdf`,
            file_path: `/uploads/doc-${Date.now()}.pdf`,
            file_size_bytes: _file.size || 1_500_000,
            mime_type: "application/pdf",
            status: "ready",
            created_at: new Date().toISOString(),
        };
        documents.unshift(newDoc);
        return wrap({
            document_id: newDoc.id,
            filename: newDoc.name,
            total_parent_chunks: 12,
            total_child_chunks: 48,
            status: "ready",
        });
    },

    list: async (_organizationId: string) => {
        await delay(300);
        return wrap(documents);
    },

    getStatus: async (documentId: string, _organizationId: string) => {
        await delay(100);
        const doc = documents.find((d) => d.id === documentId);
        return wrap(doc || documents[0]);
    },

    delete: async (documentId: string, _organizationId: string) => {
        await delay(300);
        documents = documents.filter((d) => d.id !== documentId);
        return wrap({ success: true });
    },

    linkBot: async (documentId: string, _organizationId: string, botId: string | null) => {
        await delay(200);
        documents = documents.map((d) =>
            d.id === documentId ? { ...d, bot_id: botId } : d
        );
        return wrap({ success: true });
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
    const q = query.toLowerCase();
    if (q.includes("ลา") || q.includes("หยุด") || q.includes("leave")) return MOCK_AI_RESPONSES.leave;
    if (q.includes("สวัสดิการ") || q.includes("benefit") || q.includes("ประกัน")) return MOCK_AI_RESPONSES.benefit;
    if (q.includes("เบิก") || q.includes("ค่าใช้จ่าย") || q.includes("expense")) return MOCK_AI_RESPONSES.expense;
    return MOCK_AI_RESPONSES.default;
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

        // Ensure session exists in messagesDb
        const sid = params.sessionId || "mock-session";
        if (!messagesDb[sid]) messagesDb[sid] = [];

        // Store user message
        messagesDb[sid].push({
            id: crypto.randomUUID(),
            session_id: sid,
            organization_id: params.organizationId,
            role: "user",
            content: params.userQuery,
            metadata: {},
            created_at: new Date().toISOString(),
        });

        // Ensure session exists in sessions list
        if (!sessions.find((s) => s.id === sid)) {
            sessions.unshift({
                id: sid,
                organization_id: params.organizationId,
                bot_id: params.botId,
                platform_user_id: params.platformUserId,
                platform_source: params.platformSource || "web",
                status: "active",
                started_at: new Date().toISOString(),
                last_message_at: new Date().toISOString(),
            });
        }

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
            messagesDb[sid].push({
                id: crypto.randomUUID(),
                session_id: sid,
                organization_id: params.organizationId,
                role: "assistant",
                content: response,
                metadata: {},
                created_at: new Date().toISOString(),
            });

            // Update session last_message_at
            sessions = sessions.map((s) =>
                s.id === sid ? { ...s, last_message_at: new Date().toISOString() } : s
            );

            onDone();
        })();

        return controller;
    },

    requestHuman: async (_sessionId: string, _organizationId: string, _botId: string) => {
        await delay(300);
        // Update session status
        sessions = sessions.map((s) =>
            s.id === _sessionId ? { ...s, status: "active" } : s
        );
        return wrap({ success: true });
    },

    sendMessage: async (_sessionId: string, _organizationId: string, content: string) => {
        await delay(200);
        const msg = {
            id: crypto.randomUUID(),
            session_id: _sessionId,
            organization_id: _organizationId,
            role: "user",
            content,
            metadata: {},
            created_at: new Date().toISOString(),
        };
        if (!messagesDb[_sessionId]) messagesDb[_sessionId] = [];
        messagesDb[_sessionId].push(msg);
        return wrap(msg);
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
        const newBot: Bot = {
            id: `bot-${Date.now()}`,
            organization_id: data.organization_id,
            name: data.name,
            description: data.description || null,
            prompt: data.system_prompt || "",
            system_prompt: data.system_prompt || null,
            line_access_token: null,
            is_active: true,
            is_web_enabled: data.is_web_enabled ?? true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        bots.unshift(newBot);
        return wrap(newBot);
    },

    list: async (_organizationId: string) => {
        await delay(300);
        return wrap(bots);
    },

    get: async (botId: string, _organizationId: string) => {
        await delay(100);
        const bot = bots.find((b) => b.id === botId);
        return wrap(bot || bots[0]);
    },

    update: async (botId: string, _organizationId: string, data: Partial<Bot>) => {
        await delay(300);
        bots = bots.map((b) =>
            b.id === botId
                ? { ...b, ...data, updated_at: new Date().toISOString() }
                : b
        );
        const updated = bots.find((b) => b.id === botId);
        return wrap(updated || bots[0]);
    },

    delete: async (botId: string, _organizationId: string) => {
        await delay(300);
        bots = bots.filter((b) => b.id !== botId);
        return wrap({ success: true });
    },
};

// ── Inbox ───────────────────────────────────────────────────────

export const inboxApi = {
    listSessions: async (_organizationId: string) => {
        await delay(200);
        const enriched = sessions.map((s) => ({
            ...s,
            user_name: MOCK_SESSION_USER_NAMES[s.id] || null,
        }));
        return wrap(enriched);
    },

    getMessages: async (sessionId: string, _organizationId: string) => {
        await delay(200);
        return wrap(messagesDb[sessionId] || []);
    },

    updateStatus: async (sessionId: string, _organizationId: string, status: string) => {
        await delay(200);
        sessions = sessions.map((s) =>
            s.id === sessionId ? { ...s, status: status as any } : s
        );
        return wrap({ success: true });
    },

    sendMessage: async (sessionId: string, organizationId: string, content: string) => {
        await delay(200);
        const msg = {
            id: crypto.randomUUID(),
            session_id: sessionId,
            organization_id: organizationId,
            role: "admin",
            content,
            metadata: {},
            created_at: new Date().toISOString(),
        };
        if (!messagesDb[sessionId]) messagesDb[sessionId] = [];
        messagesDb[sessionId].push(msg);
        // Update session last_message_at
        sessions = sessions.map((s) =>
            s.id === sessionId ? { ...s, last_message_at: new Date().toISOString() } : s
        );
        return wrap(msg);
    },

    getNewMessages: async (sessionId: string, _organizationId: string, after: string) => {
        await delay(100);
        const allMsgs = messagesDb[sessionId] || [];
        const afterDate = new Date(after).getTime();
        const newMsgs = allMsgs.filter(
            (m: any) => new Date(m.created_at).getTime() > afterDate
        );
        const session = sessions.find((s) => s.id === sessionId);
        return wrap({
            messages: newMsgs,
            session_status: session?.status || "active",
        });
    },

    mySessions: async (_organizationId: string) => {
        await delay(200);
        const mySessions = sessions.map((s) => ({
            id: s.id,
            bot_id: s.bot_id,
            bot_name: bots.find((b) => b.id === s.bot_id)?.name || null,
            status: s.status,
            last_message_at: s.last_message_at,
        }));
        return wrap(mySessions);
    },
};
