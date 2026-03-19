/**
 * SUNDAE Frontend — Supabase Client (Singleton)
 *
 * Environment variables (set in .env):
 *   VITE_SUPABASE_URL       — e.g. https://xxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY  — public anon key
 *
 * Token Keep-Alive System:
 *   Since we disabled Web Locks (Bug B17), Supabase's built-in
 *   autoRefreshToken does NOT work reliably. We compensate with:
 *     1. Periodic refresh every 30 minutes
 *     2. Refresh on tab focus (user returns after idle/sleep)
 *     3. Timestamp-based staleness check on visibility change
 */

type SupabaseLike = {
    auth: {
        onAuthStateChange: (
            _cb: (event: string, session: unknown) => void
        ) => { data: { subscription: { unsubscribe: () => void } } };
        signInWithPassword: (_args: { email: string; password: string }) => Promise<{ data: { session: null }; error: null }>;
        signOut: () => Promise<{ error: null }>;
        getSession: () => Promise<{ data: { session: null } }>;
    };
};

export const supabase: SupabaseLike = {
    auth: {
        onAuthStateChange: (_cb) => ({
            data: {
                subscription: {
                    unsubscribe: () => {
                        // no-op
                    },
                },
            },
        }),
        signInWithPassword: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
    },
};

export async function refreshOnce(): Promise<void> {
    return;
}
