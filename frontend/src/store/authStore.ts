/**
 * SUNDAE Frontend — Auth Store (Mock for Prototype)
 *
 * Uses mock data instead of real Supabase authentication.
 * All role-based selectors and navigation logic remain unchanged.
 */

import { create } from "zustand";
import type { UserProfile, Organization } from "../types";
import { MOCK_USER, MOCK_ORG } from "../mock/mockData";

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

        set({
            user: { ...MOCK_USER },
            organization: { ...MOCK_ORG },
            isAuthenticated: true,
            isLoading: false,
            authError: null,
        });
    },

    signOut: async () => {
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

        set({
            user: { ...MOCK_USER },
            organization: { ...MOCK_ORG },
            isAuthenticated: true,
            isLoading: false,
        });
    },

    setSession: (_session: any) => {
        // When AuthProvider receives a session event, immediately authenticate
        set({
            user: { ...MOCK_USER },
            organization: { ...MOCK_ORG },
            isAuthenticated: true,
            isLoading: false,
        });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    clearError: () => set({ authError: null }),
}));

// ── Selectors ─────────────────────────────────────────────────

export const selectIsSupport = (state: AuthState) =>
    state.user?.role === "support" || state.user?.role === "admin";
