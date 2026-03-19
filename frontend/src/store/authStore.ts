/**
 * SUNDAE Frontend — Auth Store (Zustand + Supabase)
 *
 * Manages real Supabase auth session lifecycle:
 *   - signIn / signOut via Supabase
 *   - onAuthStateChange listener (called from AuthProvider)
 *   - Fetches user_profiles row for role & is_approved
 *   - Triggers orgStore.fetchOrgs() after profile load
 */

import { create } from "zustand";
import { mockDb } from "../api/mockDb";
import { useOrgStore } from "./orgStore";
import type { UserProfile, Organization, UserRole } from "../types";

type ProtoSession = {
    user: {
        id: string;
        email: string;
    };
};

const STORAGE_KEYS = {
    user: "sundae_proto_user",
    org: "sundae_proto_org",
    session: "sundae_proto_session",
} as const;

interface AuthState {
    // State
    user: UserProfile | null;
    organization: Organization | null;
    session: ProtoSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;       // true while checking initial session
    authError: string | null;

    // Actions
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    setSession: (session: ProtoSession | null) => void;
    fetchProfile: (userId: string) => Promise<void>;
    setLoading: (v: boolean) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    organization: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,  // starts true until initial check
    authError: null,

    // ── Sign In (Prototype) ─────────────────────────────────────
    signIn: async (email, _password) => {
        set({ authError: null, isLoading: true, user: null, organization: null });
        try {
            const found = mockDb.findUserByEmail(email);
            if (!found) {
                set({ authError: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
                return;
            }

            const org = mockDb.getPrimaryOrg();
            const session: ProtoSession = { user: { id: found.id, email: found.email } };

            set({ session, isAuthenticated: true, user: found, organization: org });
            try {
                localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(found));
                localStorage.setItem(STORAGE_KEYS.org, JSON.stringify(org));
                localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
            } catch {
                // ignore
            }

            if (found.is_approved) {
                useOrgStore.getState().fetchOrgs();
            }
        } finally {
            set({ isLoading: false });
        }
    },

    // ── Sign Out (Prototype) ────────────────────────────────────
    signOut: async () => {
        // Clear local state FIRST — never block the user waiting for the API.
        set({
            user: null,
            organization: null,
            session: null,
            isAuthenticated: false,
            authError: null,
        });
        // Clear org store
        useOrgStore.getState().clearOrgs();
        try {
            localStorage.removeItem(STORAGE_KEYS.user);
            localStorage.removeItem(STORAGE_KEYS.org);
            localStorage.removeItem(STORAGE_KEYS.session);
        } catch {
            // ignore
        }
    },

    // ── Set Session (from onAuthStateChange) ────────────────────
    setSession: (session) => {
        if (session) {
            set({ session, isAuthenticated: true });
        } else {
            set({
                session: null,
                isAuthenticated: false,
                user: null,
                organization: null,
            });
        }
    },

    // ── Fetch Profile (Prototype) ───────────────────────────────
    fetchProfile: async (userId: string) => {
        const profile = mockDb.getUserById(userId);
        if (!profile) {
            set({ authError: "ไม่พบโปรไฟล์ผู้ใช้ (Prototype)", isLoading: false });
            return;
        }
        const org = mockDb.getPrimaryOrg();
        set({ user: profile, organization: org });

        if (profile.is_approved) {
            useOrgStore.getState().fetchOrgs();
        }
    },

    setLoading: (v) => set({ isLoading: v }),
    clearError: () => set({ authError: null }),
}));

// ── Role Selectors ──────────────────────────────────────────────

export const selectRole = (state: AuthState): UserRole =>
    state.user?.role ?? "user";

export const selectIsApproved = (state: AuthState): boolean =>
    state.user?.is_approved ?? false;

export const selectCanManageContent = (state: AuthState): boolean => {
    const role = state.user?.role;
    return (role === "user" || role === "support" || role === "admin") && (state.user?.is_approved ?? false);
};

export const selectIsSupport = (state: AuthState): boolean =>
    state.user?.role === "support";

export const selectIsAdmin = (state: AuthState): boolean =>
    state.user?.role === "admin";
