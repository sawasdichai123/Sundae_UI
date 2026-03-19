/**
 * SUNDAE Frontend — API Endpoint Definitions (Prototype Mode)
 *
 * All endpoints are backed by localStorage-based mockDb.
 */

import { mockDb } from "./mockDb";
import type {
    Bot,
    ChatAskResponse,
    DocumentUploadResponse,
    ChatSession,
    OrgInvitation,
    OrgMember,
    OrgMembership,
    MyInvitation,
    PendingUser,
    PlatformSource,
} from "../types";

type ApiOk<T> = { data: T };

function wrap<T>(data: T): ApiOk<T> {
    return { data };
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

// ── Documents ───────────────────────────────────────────────────

export const documentsApi = {
    upload: async (file: File, botId: string | null, organizationId: string) => {
        await delay(650);
        const res = mockDb.uploadDocument(file, botId, organizationId);
        return wrap<DocumentUploadResponse>(res);
    },

    list: async (organizationId: string) => {
        await delay(250);
        return wrap(mockDb.listDocuments(organizationId));
    },

    getStatus: async (documentId: string, organizationId: string) => {
        await delay(200);
        const doc = mockDb.listDocuments(organizationId).find((d) => d.id === documentId) ?? null;
        return wrap(doc as any);
    },

    delete: async (documentId: string, organizationId: string) => {
        await delay(200);
        void organizationId;
        mockDb.deleteDocument(documentId);
        return wrap({ ok: true } as any);
    },

    linkBot: async (documentId: string, organizationId: string, botId: string | null) => {
        await delay(200);
        void organizationId;
        mockDb.linkDocumentToBot(documentId, botId);
        return wrap({ ok: true } as any);
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

export const chatApi = {
    ask: async ({ userQuery, organizationId, sessionId }: ChatAskParams) => {
        await delay(400);
        void organizationId;
        const answer = mockDb.pickMockAnswer(userQuery);
        return wrap<ChatAskResponse>({
            answer,
            sources: [
                {
                    document_id: "doc-001",
                    chunk_index: 0,
                    score: 0.83,
                },
            ],
            session_id: sessionId ?? mockDb.ensureWebSession().id,
        });
    },

    askStream: (
        params: ChatAskParams,
        onToken: (token: string) => void,
        onSources: (sources: Array<{ document_id: string; chunk_index: number; score: number }>) => void,
        onDone: () => void,
        onError: (error: string) => void,
    ): AbortController => {
        const controller = new AbortController();

        (async () => {
            try {
                await delay(200);
                if (controller.signal.aborted) return;

                onSources([
                    {
                        document_id: "doc-001",
                        chunk_index: 0,
                        score: 0.83,
                    },
                ]);

                const full = mockDb.pickMockAnswer(params.userQuery);
                const tokens = full.split(/\s+/);
                for (const t of tokens) {
                    if (controller.signal.aborted) return;
                    onToken(t + " ");
                    await delay(40);
                }

                onDone();
            } catch (e) {
                console.error(e);
                onError("เกิดข้อผิดพลาด (Prototype)");
            }
        })();

        return controller;
    },

    requestHuman: async (sessionId: string, organizationId: string, botId: string) => {
        await delay(200);
        void organizationId;
        void botId;
        mockDb.requestHumanTakeover(sessionId);
        return wrap({ ok: true } as any);
    },

    sendMessage: async (sessionId: string, organizationId: string, content: string) => {
        await delay(150);
        mockDb.appendUserMessage(sessionId, organizationId, content);
        return wrap({ ok: true } as any);
    },
};

// ── Bots ────────────────────────────────────────────────────────

export const botsApi = {
    create: async (data: { name: string; organization_id: string; description?: string; system_prompt?: string; is_web_enabled?: boolean }) => {
        await delay(250);
        return wrap<Bot>(mockDb.createBot(data));
    },

    list: async (organizationId: string) => {
        await delay(200);
        return wrap(mockDb.listBots(organizationId));
    },

    get: async (botId: string, organizationId: string) => {
        await delay(150);
        void organizationId;
        return wrap(mockDb.getBot(botId));
    },

    update: async (botId: string, organizationId: string, data: Partial<Bot>) => {
        await delay(200);
        void organizationId;
        return wrap(mockDb.updateBot(botId, data));
    },

    delete: async (botId: string, organizationId: string) => {
        await delay(150);
        void organizationId;
        mockDb.deleteBot(botId);
        return wrap({ ok: true } as any);
    },
};

// ── Inbox ───────────────────────────────────────────────────────

export const inboxApi = {
    listSessions: async (organizationId: string) => {
        await delay(250);
        return wrap(mockDb.listSessions(organizationId));
    },

    getMessages: async (sessionId: string, organizationId: string) => {
        await delay(200);
        void organizationId;
        return wrap(mockDb.getMessages(sessionId));
    },

    updateStatus: async (sessionId: string, organizationId: string, status: string) => {
        await delay(150);
        void organizationId;
        mockDb.updateSessionStatus(sessionId, status as ChatSession["status"]);
        return wrap({ ok: true } as any);
    },

    sendMessage: async (sessionId: string, organizationId: string, content: string) => {
        await delay(150);
        mockDb.appendAgentMessage(sessionId, organizationId, content);
        return wrap({ ok: true } as any);
    },

    getNewMessages: async (sessionId: string, organizationId: string, after: string) => {
        await delay(150);
        void organizationId;
        return wrap(mockDb.getNewMessages(sessionId, after));
    },

    mySessions: async (organizationId: string) => {
        await delay(200);
        return wrap(mockDb.mySessions(organizationId));
    },
};

// ── Admin (User Approval) ───────────────────────────────────────

export const adminApi = {
    listPending: async () => {
        await delay(200);
        return wrap<PendingUser[]>(mockDb.listPendingForAdminApi());
    },

    approve: async (userId: string) => {
        await delay(200);
        mockDb.approveUser(userId);
        return wrap({ message: "approved", user_id: userId });
    },

    reject: async (userId: string) => {
        await delay(200);
        mockDb.rejectUser(userId);
        return wrap({ message: "rejected", user_id: userId });
    },
};

// ── Organizations (Multi-tenant) ────────────────────────────────

export const orgApi = {
    create: async (name: string) => {
        await delay(250);
        const org = mockDb.createOrg(name);
        return wrap({ id: org.id, name: org.name, slug: org.slug ?? org.id });
    },

    list: async () => {
        await delay(200);
        return wrap<OrgMembership[]>(mockDb.listOrgs());
    },

    get: async (orgId: string) => {
        await delay(150);
        const org = mockDb.getOrgDetails(orgId);
        return wrap(org as any);
    },

    update: async (orgId: string, name: string) => {
        await delay(200);
        mockDb.updateOrg(orgId, name);
        return wrap({ ok: true } as any);
    },

    requestDeletion: async (_orgId: string) => {
        await delay(250);
        return wrap({ ok: true } as any);
    },

    confirmDeletion: async (_orgId: string) => {
        await delay(250);
        return wrap({ ok: true } as any);
    },

    listMembers: async (orgId: string) => {
        await delay(200);
        return wrap<OrgMember[]>(mockDb.listMembers(orgId));
    },

    invite: async (orgId: string, email: string) => {
        await delay(250);
        return wrap<OrgInvitation>(mockDb.invite(orgId, email));
    },

    removeMember: async (orgId: string, userId: string) => {
        await delay(200);
        mockDb.removeMember(orgId, userId);
        return wrap({ ok: true } as any);
    },

    myInvitations: async () => {
        await delay(200);
        return wrap<MyInvitation[]>(mockDb.myInvitations() as any);
    },

    acceptInvitation: async (invitationId: string) => {
        await delay(200);
        mockDb.acceptInvitation(invitationId);
        return wrap({ ok: true } as any);
    },

    declineInvitation: async (_invitationId: string) => {
        await delay(200);
        return wrap({ ok: true } as any);
    },

    leave: async (_orgId: string) => {
        await delay(200);
        return wrap({ ok: true } as any);
    },
};
