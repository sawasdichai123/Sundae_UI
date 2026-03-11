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
 *     1. Periodic refresh every 4 minutes
 *     2. Refresh on tab focus (user returns after idle/sleep)
 *     3. Timestamp-based staleness check on visibility change
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "[SUNDAE] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n" +
        "Auth will not work until these are set in your .env file."
    );
}

export const supabase = createClient(
    supabaseUrl || "http://localhost:54321",
    supabaseAnonKey || "placeholder-key",
    {
        auth: {
            // No-op lock function — prevents "Acquiring an exclusive Navigator Lock… timed out"
            // deadlock that blocks the entire app (Bug B17).
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lock: (async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
                return await fn();
            }) as any,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);

// ═══════════════════════════════════════════════════════════════════
// Token Keep-Alive System
// ═══════════════════════════════════════════════════════════════════

// Track the last successful refresh time
let lastRefreshTime = Date.now();

async function refreshIfNeeded() {
    try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;

        const expiresAt = data.session.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);
        const remainingSec = expiresAt - now;

        // Refresh if less than 10 minutes remaining
        if (remainingSec < 600) {
            const { error } = await supabase.auth.refreshSession();
            if (error) {
                console.warn("[Auth] Periodic refresh failed:", error.message);
            } else {
                lastRefreshTime = Date.now();
            }
        }
    } catch { /* silent */ }
}

// 1. Periodic refresh — every 4 minutes
setInterval(refreshIfNeeded, 4 * 60 * 1000);

// 2. Refresh on tab focus — handles idle/sleep/tab-switch scenarios
//    Also checks if we've been away for more than 5 minutes (sleep/hibernate)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        const timeSinceLastRefresh = Date.now() - lastRefreshTime;
        const fiveMinutes = 5 * 60 * 1000;

        if (timeSinceLastRefresh > fiveMinutes) {
            // We've been away for a while — force refresh immediately
            refreshIfNeeded();
        }
    }
});
