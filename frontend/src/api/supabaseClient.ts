/**
 * SUNDAE Frontend — Supabase Client (Mock for Prototype)
 *
 * Replaces real Supabase with no-op mocks so the app works
 * without any backend connection.
 */

import { MOCK_SESSION, MOCK_ORG, MOCK_PENDING_USERS, MOCK_APPROVED_USERS } from "../mock/mockData";
import type { UserProfile } from "../types";

// ── In-memory state for Supabase table mocks ────────────────────
let mockPendingUsers = [...MOCK_PENDING_USERS];
let mockApprovedUsers = [...MOCK_APPROVED_USERS];

// ── Mock Auth ───────────────────────────────────────────────────

type AuthCallback = (event: string, session: any) => void;

const mockAuth = {
    signInWithPassword: async (_creds: { email: string; password: string }) => ({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
    }),

    signUp: async (_opts: any) => ({
        data: { user: MOCK_SESSION.user, session: null },
        error: null as any,
    }),

    getSession: async () => ({
        data: { session: MOCK_SESSION },
        error: null,
    }),

    refreshSession: async () => ({
        data: { session: MOCK_SESSION },
        error: null,
    }),

    signOut: async () => ({ error: null }),

    onAuthStateChange: (callback: AuthCallback) => {
        // Fire INITIAL_SESSION immediately (simulates Supabase behavior)
        setTimeout(() => {
            callback("INITIAL_SESSION", MOCK_SESSION);
        }, 50);
        return {
            data: {
                subscription: {
                    unsubscribe: () => { /* no-op */ },
                },
            },
        };
    },
};

// ── Mock Query Builder (for .from().select()...) ────────────────

interface MockQueryResult {
    data: any;
    error: null;
    count?: number;
}

function createQueryBuilder(tableName: string) {
    let filters: Array<{ column: string; value: any }> = [];
    let limitCount: number | null = null;
    let isHead = false;
    let isCountExact = false;
    let isSingle = false;
    let updatePayload: any = null;

    const getTableData = (): UserProfile[] => {
        if (tableName === "user_profiles") {
            return [...mockPendingUsers, ...mockApprovedUsers] as UserProfile[];
        }
        if (tableName === "organizations") {
            return [MOCK_ORG] as any[];
        }
        return [];
    };

    const applyFilters = (data: any[]): any[] => {
        let result = data;
        for (const f of filters) {
            result = result.filter((item) => item[f.column] === f.value);
        }
        return result;
    };

    const builder: any = {
        select: (_cols?: string, opts?: { count?: string; head?: boolean }) => {
            if (opts?.head) isHead = true;
            if (opts?.count === "exact") isCountExact = true;
            return builder;
        },
        eq: (column: string, value: any) => {
            filters.push({ column, value });
            return builder;
        },
        order: (_col: string, _opts?: any) => builder,
        limit: (n: number) => {
            limitCount = n;
            return builder;
        },
        single: () => {
            isSingle = true;
            return builder;
        },
        update: (payload: any) => {
            updatePayload = payload;
            return builder;
        },
        then: (resolve: (result: MockQueryResult) => void) => {
            let data = getTableData();
            data = applyFilters(data);

            // Handle update
            if (updatePayload !== null) {
                if (tableName === "user_profiles" && updatePayload.is_approved === true) {
                    const userId = filters.find((f) => f.column === "id")?.value;
                    if (userId) {
                        const idx = mockPendingUsers.findIndex((u) => u.id === userId);
                        if (idx !== -1) {
                            const user = { ...mockPendingUsers[idx], is_approved: true };
                            mockPendingUsers.splice(idx, 1);
                            mockApprovedUsers.unshift(user);
                            resolve({ data: [{ id: userId, is_approved: true }], error: null });
                            return;
                        }
                    }
                }
                resolve({ data: [], error: null });
                return;
            }

            if (isHead && isCountExact) {
                resolve({ data: null, error: null, count: data.length });
                return;
            }

            if (limitCount !== null) {
                data = data.slice(0, limitCount);
            }

            if (isSingle) {
                resolve({ data: data[0] || null, error: data[0] ? null : null });
                return;
            }

            resolve({ data, error: null });
        },
    };

    // Make builder thenable (works with await)
    builder[Symbol.toStringTag] = "Promise";
    builder.catch = (fn: any) => Promise.resolve(builder).catch(fn);
    builder.finally = (fn: any) => Promise.resolve(builder).finally(fn);

    return builder;
}

// ── Exported supabase mock ──────────────────────────────────────

export const supabase = {
    auth: mockAuth,
    from: (tableName: string) => createQueryBuilder(tableName),
};
