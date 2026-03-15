/**
 * SUNDAE Frontend — Auth Store (Mock for Prototype)
 *
 * Uses mock data instead of real Supabase authentication.
 * All role-based selectors and navigation logic remain unchanged.
 */

import { create } from "zustand";
import type { UserProfile, Organization } from "../types";
import { MOCK_ORG } from "../mocks/mockData";
import { mockDb } from "../api/mockDb";

const PROTO_USER_KEY = "sundae_proto_user";
const PROTO_ORG_KEY = "sundae_proto_org";

interface AuthState {
    user: UserProfile | null;
    organization: Organization | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;

    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchProfile: (userId: string) => Promise<void>;
    setSession: (session: any) => void;
    setLoading: (loading: boolean) => void;
    clearError: () => void;
}

export function initPrototypeAuthFromStorage() {
    try {
        const rawUser = localStorage.getItem(PROTO_USER_KEY);
        const rawOrg = localStorage.getItem(PROTO_ORG_KEY);
        if (!rawUser || !rawOrg) return;

        const user = JSON.parse(rawUser) as UserProfile;
        const organization = JSON.parse(rawOrg) as Organization;

        useAuthStore.setState({
            user,
            organization,
            isAuthenticated: true,
            isLoading: false,
            authError: null,
        });
    } catch {
        // Ignore corrupted storage
    }
}

export const useAuthStore = create<AuthState>((set) => ({
    // ── Initial State ─────────────────────────────────────────────
    user: null,
    organization: null,
    isAuthenticated: false,
    isLoading: false,
    authError: null,

    // ── Actions ───────────────────────────────────────────────────

    signIn: async (_email: string, _password: string) => {
        set({ isLoading: true, authError: null });

        // Simulate tiny delay
        await new Promise((r) => setTimeout(r, 300));

        const email = (_email || "").trim().toLowerCase();

        const approved = mockDb
            .listApprovedUsers()
            .find((u) => (u.email || "").trim().toLowerCase() === email);
        const pending = mockDb
            .listPendingUsers()
            .find((u) => (u.email || "").trim().toLowerCase() === email);

        const user: UserProfile = approved || pending || {
            id: `user-${Date.now()}`,
            organization_id: MOCK_ORG.id,
            email: email || "guest@sundae.demo",
            full_name: email ? email.split("@")[0] : "Guest",
            role: "user",
            is_approved: true,
            created_at: new Date().toISOString(),
        };

        const organization = { ...MOCK_ORG };

        try {
            localStorage.setItem(PROTO_USER_KEY, JSON.stringify(user));
            localStorage.setItem(PROTO_ORG_KEY, JSON.stringify(organization));
        } catch {
            // ignore
        }

        set({ user, organization, isAuthenticated: true, isLoading: false, authError: null });
    },

    signOut: async () => {
        try {
            localStorage.removeItem(PROTO_USER_KEY);
            localStorage.removeItem(PROTO_ORG_KEY);
        } catch {
            // ignore
        }
        set({
            user: null,
            organization: null,
            isAuthenticated: false,
            isLoading: false,
            authError: null,
        });
    },

    fetchProfile: async (_userId: string) => {
        set({ isLoading: true });

        // Simulate tiny delay
        await new Promise((r) => setTimeout(r, 200));

        try {
            const rawUser = localStorage.getItem(PROTO_USER_KEY);
            const rawOrg = localStorage.getItem(PROTO_ORG_KEY);
            if (rawUser && rawOrg) {
                set({
                    user: JSON.parse(rawUser) as UserProfile,
                    organization: JSON.parse(rawOrg) as Organization,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return;
            }
        } catch {
            // ignore
        }

        set({
            user: null,
            organization: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    setSession: (_session: any) => {
        try {
            const rawUser = localStorage.getItem(PROTO_USER_KEY);
            const rawOrg = localStorage.getItem(PROTO_ORG_KEY);
            if (rawUser && rawOrg) {
                set({
                    user: JSON.parse(rawUser) as UserProfile,
                    organization: JSON.parse(rawOrg) as Organization,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return;
            }
        } catch {
            // ignore
        }

        set({
            user: null,
            organization: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    clearError: () => set({ authError: null }),
}));

// ── Selectors ─────────────────────────────────────────────────

export const selectRole = (state: AuthState): UserProfile["role"] =>
    state.user?.role ?? "user";

export const selectIsApproved = (state: AuthState): boolean =>
    state.user?.is_approved ?? false;

export const selectCanManageContent = (state: AuthState): boolean => {
    const role = state.user?.role;
    return (role === "user" || role === "support" || role === "admin") && (state.user?.is_approved ?? false);
};

export const selectIsSupport = (state: AuthState): boolean =>
    state.user?.role === "support" || state.user?.role === "admin";

export const selectIsAdmin = (state: AuthState): boolean =>
    state.user?.role === "admin";
