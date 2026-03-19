import type { Bot, ChatMessage, ChatSession, Document, OrgInvitation, OrgMember, OrgMembership, Organization, PendingUser, UserProfile } from "../types";
import {
    MOCK_AI_RESPONSES,
    MOCK_APPROVED_USERS,
    MOCK_BOTS,
    MOCK_DOCUMENTS,
    MOCK_MESSAGES,
    MOCK_MY_INVITATIONS,
    MOCK_ORG,
    MOCK_ORG_INVITATIONS,
    MOCK_ORG_MEMBERS,
    MOCK_ORG_MEMBERSHIPS,
    MOCK_PENDING_USERS,
    MOCK_SESSIONS,
    MOCK_SESSION_USER_NAMES,
} from "../mocks/mockData";

type MockDbSnapshot = {
    org: Organization;
    orgs: OrgMembership[];
    orgMembers: Record<string, OrgMember[]>;
    orgInvitations: OrgInvitation[];
    myInvitations: Array<{
        id: string;
        organization_id: string;
        org_name: string;
        invited_email: string;
        status: "pending" | "accepted" | "revoked";
        created_at: string;
    }>;

    pendingUsers: UserProfile[];
    approvedUsers: UserProfile[];

    bots: Bot[];
    documents: Document[];

    sessions: Array<ChatSession & { user_name?: string | null }>;
    messages: Record<string, ChatMessage[]>;
};


function buildSeed(): MockDbSnapshot {
    return {
        org: MOCK_ORG,
        orgs: MOCK_ORG_MEMBERSHIPS,
        orgMembers: MOCK_ORG_MEMBERS,
        orgInvitations: MOCK_ORG_INVITATIONS,
        myInvitations: MOCK_MY_INVITATIONS,

        pendingUsers: MOCK_PENDING_USERS,
        approvedUsers: MOCK_APPROVED_USERS,

        bots: MOCK_BOTS,
        documents: MOCK_DOCUMENTS,

        sessions: MOCK_SESSIONS.map((s) => ({ ...s, user_name: MOCK_SESSION_USER_NAMES[s.id] ?? null })),
        messages: MOCK_MESSAGES,
    };
}

let memoryDb: MockDbSnapshot | null = null;

function load(): MockDbSnapshot {
    if (!memoryDb) {
        memoryDb = buildSeed();
    }
    return memoryDb;
}

function save(snap: MockDbSnapshot) {
    memoryDb = snap;
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
    getPrimaryOrg: () => load().org,

    findUserByEmail: (email: string) => {
        const e = email.trim().toLowerCase();
        const snap = load();
        return (
            snap.approvedUsers.find((u) => u.email.toLowerCase() === e) ??
            snap.pendingUsers.find((u) => u.email.toLowerCase() === e) ??
            null
        );
    },

    getUserById: (userId: string) => {
        const snap = load();
        return (
            snap.approvedUsers.find((u) => u.id === userId) ??
            snap.pendingUsers.find((u) => u.id === userId) ??
            null
        );
    },

    // ── Users / Approvals ───────────────────────────────────────
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

    rejectUser: (userId: string) => {
        let removed: UserProfile | null = null;
        update((s) => {
            const idx = s.pendingUsers.findIndex((u) => u.id === userId);
            if (idx === -1) return;
            removed = s.pendingUsers[idx];
            s.pendingUsers.splice(idx, 1);
        });
        return removed;
    },

    listPendingForAdminApi: (): PendingUser[] =>
        load().pendingUsers.map((u) => ({
            id: u.id,
            email: u.email,
            full_name: u.full_name,
            role: u.role,
            is_approved: u.is_approved,
            created_at: u.created_at,
        })),

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
            s.sessions = s.sessions.map((sess) => (sess.id === sessionId ? { ...sess, last_message_at: msg.created_at } : sess));
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

    ensureWebSession: () => {
        const snap = load();
        const existing = snap.sessions.find((s) => s.platform_source === "web");
        if (existing) return existing;

        const session: ChatSession = {
            id: `sess-${Date.now()}`,
            organization_id: snap.org.id,
            bot_id: snap.bots[0]?.id ?? null,
            platform_user_id: "web-user",
            platform_source: "web",
            status: "active",
            started_at: nowIso(),
            last_message_at: nowIso(),
        };
        mockDb.ensureSession(session);
        return session;
    },

    updateSessionStatus: (sessionId: string, status: ChatSession["status"]) => {
        update((s) => {
            s.sessions = s.sessions.map((sess) => (sess.id === sessionId ? { ...sess, status } : sess));
        });
        return { success: true } as const;
    },

    requestHumanTakeover: (sessionId: string) => {
        return mockDb.updateSessionStatus(sessionId, "human_takeover");
    },

    appendUserMessage: (sessionId: string, organizationId: string, content: string) => {
        const msg: ChatMessage = {
            id: `msg-${Date.now()}`,
            session_id: sessionId,
            organization_id: organizationId,
            role: "user",
            content,
            metadata: {},
            created_at: nowIso(),
        };
        return mockDb.appendMessage(sessionId, msg);
    },

    appendAgentMessage: (sessionId: string, organizationId: string, content: string) => {
        const msg: ChatMessage = {
            id: `msg-${Date.now()}`,
            session_id: sessionId,
            organization_id: organizationId,
            role: "admin",
            content,
            metadata: {},
            created_at: nowIso(),
        };
        return mockDb.appendMessage(sessionId, msg);
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

    // ── Organizations (multi-tenant UI) ─────────────────────────
    listOrgs: () => {
        const base = load().orgs;
        try {
            const rawUser = localStorage.getItem("sundae_proto_user");
            const user = rawUser ? (JSON.parse(rawUser) as { id?: string; role?: string; email?: string; organization_id?: string | null }) : null;
            if (!user) return base;

            // Approved user with no organization → return empty (triggers create-org page)
            if (user.organization_id === null) {
                return [];
            }

            const platformRole = user.role;

            // Admins can manage the org as owner.
            if (platformRole === "admin") {
                return base.map((o) => ({ ...o, org_role: "owner" as const }));
            }

            // Check if user is an org owner via org_members
            const snap = load();
            const members = snap.orgMembers["org-001"] || [];
            const memberEntry = members.find((m) => m.user_id === user.id);
            if (memberEntry) {
                return base.map((o) => ({ ...o, org_role: memberEntry.org_role }));
            }

            // Default: treat as member
            return base.map((o) => ({ ...o, org_role: "member" as const }));
        } catch {
            return base;
        }
    },

    createOrg: (name: string) => {
        const orgId = `org-${Date.now()}`;
        const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
        const created_at = nowIso();
        const membership: OrgMembership = {
            id: orgId,
            name,
            slug,
            org_role: "owner",
            created_at,
        };
        update((s) => {
            s.orgs.unshift(membership);
            s.orgMembers[orgId] = [];
            s.org = { id: orgId, name, created_at };
        });
        return membership;
    },

    getOrgDetails: (orgId: string) => {
        const org = load().orgs.find((o) => o.id === orgId);
        return org ? { id: org.id, name: org.name, slug: org.slug ?? null, status: "active", created_at: org.created_at } : null;
    },

    updateOrg: (orgId: string, name: string) => {
        update((s) => {
            s.orgs = s.orgs.map((o) => (o.id === orgId ? { ...o, name } : o));
        });
        return { success: true } as const;
    },

    listMembers: (orgId: string) => load().orgMembers[orgId] || [],

    inviteMember: (orgId: string, email: string) => {
        const inv: OrgInvitation = {
            id: `inv-${Date.now()}`,
            organization_id: orgId,
            invited_email: email,
            invited_by: "user-admin-001",
            status: "pending",
            created_at: nowIso(),
        };
        update((s) => {
            s.orgInvitations.unshift(inv);
        });
        return inv;
    },

    invite: (orgId: string, email: string) => mockDb.inviteMember(orgId, email),

    removeMember: (orgId: string, userId: string) => {
        update((s) => {
            s.orgMembers[orgId] = (s.orgMembers[orgId] || []).filter((m) => m.user_id !== userId);
        });
        return { success: true } as const;
    },

    myInvitations: () => {
        try {
            const rawUser = localStorage.getItem("sundae_proto_user");
            const user = rawUser ? (JSON.parse(rawUser) as { email?: string }) : null;
            if (!user?.email) return load().myInvitations;
            return load().myInvitations.filter((i) => i.invited_email.toLowerCase() === user.email!.toLowerCase());
        } catch {
            return load().myInvitations;
        }
    },

    acceptInvitation: (invitationId: string) => {
        update((s) => {
            const inv = s.myInvitations.find((i) => i.id === invitationId);
            if (!inv) return;

            // Mark invitation as accepted
            s.myInvitations = s.myInvitations.map((i) => (i.id === invitationId ? { ...i, status: "accepted" } : i));

            // Add user to org members
            try {
                const rawUser = localStorage.getItem("sundae_proto_user");
                const user = rawUser ? JSON.parse(rawUser) as { id?: string; email?: string; full_name?: string | null } : null;
                if (user?.id) {
                    const orgId = inv.organization_id;
                    if (!s.orgMembers[orgId]) s.orgMembers[orgId] = [];
                    if (!s.orgMembers[orgId].find((m) => m.user_id === user.id)) {
                        s.orgMembers[orgId].push({
                            user_id: user.id,
                            email: user.email || "",
                            full_name: user.full_name || null,
                            org_role: "member",
                            joined_at: nowIso(),
                        });
                    }

                    // Update user's organization_id in approved users
                    s.approvedUsers = s.approvedUsers.map((u) =>
                        u.id === user.id ? { ...u, organization_id: orgId } : u
                    );

                    // Update localStorage so listOrgs() picks up the change
                    const updatedUser = s.approvedUsers.find((u) => u.id === user.id);
                    if (updatedUser) {
                        localStorage.setItem("sundae_proto_user", JSON.stringify(updatedUser));
                    }
                }
            } catch {
                // ignore
            }
        });
        return { success: true } as const;
    },

    // ── AI helper ───────────────────────────────────────────────
    pickMockAnswer: (query: string) => {
        const q = query.toLowerCase();
        if (q.includes("ลา") || q.includes("หยุด") || q.includes("leave")) return MOCK_AI_RESPONSES.leave;
        if (q.includes("สวัสดิการ") || q.includes("benefit") || q.includes("ประกัน") || q.includes("กองทุน")) return MOCK_AI_RESPONSES.benefit;
        if (q.includes("เบิก") || q.includes("ค่าใช้จ่าย") || q.includes("expense") || q.includes("ใบเสร็จ")) return MOCK_AI_RESPONSES.expense;
        if (q.includes("vpn") || q.includes("อีเมล") || q.includes("email") || q.includes("ระบบ") || q.includes("เข้าไม่ได้")) return MOCK_AI_RESPONSES.vpn;
        return MOCK_AI_RESPONSES.default;
    },
};
