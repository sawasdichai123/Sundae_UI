import type { Bot, ChatMessage, ChatSession, Document, Organization, UserProfile } from "../types";
import {
    MOCK_AI_RESPONSES,
    MOCK_APPROVED_USERS,
    MOCK_BOTS,
    MOCK_DOCUMENTS,
    MOCK_MESSAGES,
    MOCK_ORG,
    MOCK_PENDING_USERS,
    MOCK_SESSIONS,
    MOCK_SESSION_USER_NAMES,
} from "../mocks/mockData";

type MockDbSnapshot = {
    org: Organization;
    bots: Bot[];
    documents: Document[];
    sessions: Array<ChatSession & { user_name?: string | null }>; // enriched
    messages: Record<string, ChatMessage[]>;
    pendingUsers: UserProfile[];
    approvedUsers: UserProfile[];
};

const STORAGE_KEY = "sundae_mockdb_v1";

function deepClone<T>(v: T): T {
    return JSON.parse(JSON.stringify(v)) as T;
}

function buildSeed(): MockDbSnapshot {
    return {
        org: deepClone(MOCK_ORG),
        bots: deepClone(MOCK_BOTS),
        documents: deepClone(MOCK_DOCUMENTS),
        sessions: deepClone(MOCK_SESSIONS).map((s) => ({
            ...s,
            user_name: MOCK_SESSION_USER_NAMES[s.id] ?? null,
        })),
        messages: deepClone(MOCK_MESSAGES),
        pendingUsers: deepClone(MOCK_PENDING_USERS),
        approvedUsers: deepClone(MOCK_APPROVED_USERS),
    };
}

function load(): MockDbSnapshot {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return buildSeed();
        const parsed = JSON.parse(raw) as MockDbSnapshot;
        if (!parsed || !parsed.org || !Array.isArray(parsed.bots)) return buildSeed();
        return parsed;
    } catch {
        return buildSeed();
    }
}

function save(snap: MockDbSnapshot) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {
        // ignore
    }
}

function update(mutator: (snap: MockDbSnapshot) => void): MockDbSnapshot {
    const snap = load();
    mutator(snap);
    save(snap);
    return snap;
}

function nowIso() {
    return new Date().toISOString();
}

export const mockDb = {
    reset: () => {
        const seed = buildSeed();
        save(seed);
        return seed;
    },

    getOrg: () => load().org,

    // ── Bots ────────────────────────────────────────────────────
    listBots: (_organizationId: string) => load().bots,

    getBot: (botId: string) => load().bots.find((b) => b.id === botId) ?? null,

    createBot: (data: {
        name: string;
        organization_id: string;
        description?: string;
        system_prompt?: string;
        is_web_enabled?: boolean;
    }) => {
        const bot: Bot = {
            id: `bot-${Date.now()}`,
            organization_id: data.organization_id,
            name: data.name,
            description: data.description ?? null,
            system_prompt: data.system_prompt ?? null,
            is_active: true,
            is_web_enabled: data.is_web_enabled ?? true,
            created_at: nowIso(),
            updated_at: nowIso(),
        };

        update((s) => {
            s.bots.unshift(bot);
        });

        return bot;
    },

    updateBot: (botId: string, patch: Partial<Bot>) => {
        let updated: Bot | null = null;
        update((s) => {
            s.bots = s.bots.map((b) => {
                if (b.id !== botId) return b;
                updated = { ...b, ...patch, updated_at: nowIso() };
                return updated;
            });
        });
        return updated;
    },

    deleteBot: (botId: string) => {
        update((s) => {
            s.bots = s.bots.filter((b) => b.id !== botId);
            // Unlink documents
            s.documents = s.documents.map((d) => (d.bot_id === botId ? { ...d, bot_id: null } : d));
        });
        return { success: true } as const;
    },

    // ── Documents ───────────────────────────────────────────────
    listDocuments: (_organizationId: string) => load().documents,

    uploadDocument: (file: File, botId: string | null, organizationId: string) => {
        const id = `doc-${Date.now()}`;
        const doc: Document = {
            id,
            organization_id: organizationId,
            bot_id: botId,
            name: file.name || `เอกสารใหม่_${Date.now()}.pdf`,
            file_path: `/uploads/${id}.pdf`,
            file_size_bytes: file.size || 1_500_000,
            mime_type: file.type || "application/pdf",
            status: "ready",
            created_at: nowIso(),
        };

        update((s) => {
            s.documents.unshift(doc);
        });

        return {
            document_id: doc.id,
            filename: doc.name,
            total_parent_chunks: 12,
            total_child_chunks: 48,
            status: "ready",
        };
    },

    deleteDocument: (documentId: string) => {
        update((s) => {
            s.documents = s.documents.filter((d) => d.id !== documentId);
        });
        return { success: true } as const;
    },

    linkDocumentToBot: (documentId: string, botId: string | null) => {
        update((s) => {
            s.documents = s.documents.map((d) => (d.id === documentId ? { ...d, bot_id: botId } : d));
        });
        return { success: true } as const;
    },

    // ── Inbox / Sessions / Messages ─────────────────────────────
    listSessions: (_organizationId: string) => load().sessions,

    mySessions: (_organizationId: string) => {
        const snap = load();
        return snap.sessions.map((s) => ({
            id: s.id,
            bot_id: s.bot_id,
            bot_name: snap.bots.find((b) => b.id === s.bot_id)?.name || null,
            status: s.status,
            last_message_at: s.last_message_at,
        }));
    },

    getMessages: (sessionId: string) => load().messages[sessionId] || [],

    appendMessage: (sessionId: string, msg: ChatMessage) => {
        update((s) => {
            if (!s.messages[sessionId]) s.messages[sessionId] = [];
            s.messages[sessionId].push(msg);

            // Update session timestamps
            s.sessions = s.sessions.map((sess) =>
                sess.id === sessionId ? { ...sess, last_message_at: msg.created_at } : sess
            );
        });
        return msg;
    },

    ensureSession: (session: ChatSession) => {
        update((s) => {
            if (!s.sessions.find((x) => x.id === session.id)) {
                s.sessions.unshift({
                    ...session,
                    user_name: MOCK_SESSION_USER_NAMES[session.id] ?? null,
                });
            }
        });
        return { success: true } as const;
    },

    updateSessionStatus: (sessionId: string, status: ChatSession["status"]) => {
        update((s) => {
            s.sessions = s.sessions.map((sess) => (sess.id === sessionId ? { ...sess, status } : sess));
        });
        return { success: true } as const;
    },

    getNewMessages: (sessionId: string, afterIso: string) => {
        const msgs = load().messages[sessionId] || [];
        const afterTs = new Date(afterIso).getTime();
        const newMsgs = msgs.filter((m) => new Date(m.created_at).getTime() > afterTs);
        const sess = load().sessions.find((s) => s.id === sessionId);
        return {
            messages: newMsgs,
            session_status: sess?.status || "active",
        };
    },

    // ── Support approvals mock ──────────────────────────────────
    listPendingUsers: () => load().pendingUsers,

    listApprovedUsers: () => load().approvedUsers,

    approveUser: (userId: string) => {
        let moved: UserProfile | null = null;
        update((s) => {
            const idx = s.pendingUsers.findIndex((u) => u.id === userId);
            if (idx === -1) return;
            moved = { ...s.pendingUsers[idx], is_approved: true };
            s.pendingUsers.splice(idx, 1);
            s.approvedUsers.unshift(moved);
        });
        return moved;
    },

    // ── AI response helper ──────────────────────────────────────
    pickMockAnswer: (query: string) => {
        const q = query.toLowerCase();
        if (q.includes("ลา") || q.includes("หยุด") || q.includes("leave")) return MOCK_AI_RESPONSES.leave;
        if (q.includes("สวัสดิการ") || q.includes("benefit") || q.includes("ประกัน")) return MOCK_AI_RESPONSES.benefit;
        if (q.includes("เบิก") || q.includes("ค่าใช้จ่าย") || q.includes("expense")) return MOCK_AI_RESPONSES.expense;
        return MOCK_AI_RESPONSES.default;
    },
};
