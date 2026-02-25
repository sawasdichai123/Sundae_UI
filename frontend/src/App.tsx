/**
 * SUNDAE Frontend — App.tsx (Role-Based Routing + Auth Lifecycle)
 *
 * AuthProvider wraps the app and listens to Supabase onAuthStateChange.
 * On mount, restores the session from localStorage if present.
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./api/supabaseClient";
import { useAuthStore } from "./store/authStore";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import BotsPage from "./pages/BotsPage";
import InboxPage from "./pages/InboxPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import WebChatPage from "./pages/WebChatPage";

// ── Auth Lifecycle Provider ─────────────────────────────────────

function AuthProvider({ children }: { children: React.ReactNode }) {
    const setSession = useAuthStore((s) => s.setSession);
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        // Safety timeout — never block longer than 5 seconds
        const timeout = setTimeout(() => {
            console.warn("[Auth] Session check timed out — proceeding without auth");
            setLoading(false);
        }, 5000);

        // 1. Restore existing session on mount
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                console.log("[Auth] getSession:", session ? "found" : "none");
                setSession(session);
                if (session?.user) {
                    return fetchProfile(session.user.id);
                }
            })
            .catch((err) => {
                console.error("[Auth] getSession error:", err);
            })
            .finally(() => {
                clearTimeout(timeout);
                setLoading(false);
            });

        // 2. Listen to auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <>{children}</>;
}

// ── Loading Screen ──────────────────────────────────────────────

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-steel-50 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-400 flex items-center justify-center text-steel-900 text-lg font-bold shadow-md animate-pulse">
                S
            </div>
            <p className="text-sm text-steel-400">กำลังตรวจสอบเซสชัน...</p>
        </div>
    );
}

// ── App ─────────────────────────────────────────────────────────

export default function App() {
    const isLoading = useAuthStore((s) => s.isLoading);

    return (
        <AuthProvider>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <BrowserRouter>
                    <Routes>
                        {/* ── Public Routes ──────────────────────────── */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<LoginPage />} />
                        </Route>

                        {/* ── Public Web Chat (no auth) ──────────────── */}
                        <Route path="/chat" element={<WebChatPage />} />

                        {/* ── Protected Routes (all roles) ───────────── */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/" element={<DashboardPage />} />

                                {/* User + Admin only */}
                                <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
                                    <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                                    <Route path="/bots" element={<BotsPage />} />
                                    <Route path="/inbox" element={<InboxPage />} />
                                </Route>

                                {/* Support + Admin only */}
                                <Route element={<ProtectedRoute allowedRoles={["support", "admin"]} />}>
                                    <Route path="/approvals" element={<ApprovalsPage />} />
                                </Route>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            )}
        </AuthProvider>
    );
}
