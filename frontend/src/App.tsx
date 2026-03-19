/**
 * SUNDAE Frontend — App.tsx (Role-Based Routing + Auth Lifecycle)
 *
 * AuthProvider wraps the app and listens to Supabase onAuthStateChange.
 * On mount, restores the session from localStorage if present.
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

// Global UI
import ToastContainer from "./components/ToastContainer";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import BotsPage from "./pages/BotsPage";
import InboxPage from "./pages/InboxPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import WebChatPage from "./pages/WebChatPage";
import IntegrationPage from "./pages/IntegrationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateOrgPage from "./pages/CreateOrgPage";
import OrganizationPage from "./pages/OrganizationPage";
import ProfilePage from "./pages/ProfilePage";

// ── Auth Lifecycle Provider ─────────────────────────────────────

function AuthProvider({ children }: { children: React.ReactNode }) {
    const setSession = useAuthStore((s) => s.setSession);
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        try {
            const rawSession = localStorage.getItem("sundae_proto_session");
            const rawUser = localStorage.getItem("sundae_proto_user");

            if (rawSession) {
                setSession(JSON.parse(rawSession));
            }
            if (rawUser) {
                const user = JSON.parse(rawUser);
                if (user?.id) {
                    fetchProfile(user.id);
                }
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
        return;
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

// ── Role-based Home Redirect ─────────────────────────────────────

function HomeRedirect() {
    const role = useAuthStore((s) => s.user?.role);
    // Regular users go straight to chatbot; support/admin go to dashboard
    if (role === "user") {
        return <Navigate to="/chat" replace />;
    }
    return <DashboardPage />;
}

// ── App ─────────────────────────────────────────────────────────

export default function App() {
    const isLoading = useAuthStore((s) => s.isLoading);

    // BrowserRouter is ALWAYS mounted so React Router context is never lost.
    // Only the Routes (and LoadingScreen) are conditionally rendered.
    return (
        <BrowserRouter>
            <AuthProvider>
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <Routes>
                        {/* ── Public Routes ──────────────────────────── */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                        </Route>

                        {/* ── Protected Routes (all roles) ───────────── */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/" element={<HomeRedirect />} />

                                {/* Web Chat — all roles */}
                                <Route path="/chat" element={<WebChatPage />} />

                                {/* Create org — for approved users with no orgs */}
                                <Route path="/create-org" element={<CreateOrgPage />} />

                                {/* Profile — all roles */}
                                <Route path="/profile" element={<ProfilePage />} />

                                {/* Admin + User (owner) — content management pages */}
                                <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
                                    <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                                    <Route path="/bots" element={<BotsPage />} />
                                    <Route path="/inbox" element={<InboxPage />} />
                                    <Route path="/integration" element={<IntegrationPage />} />
                                </Route>

                                {/* Organization settings — all roles */}
                                <Route element={<ProtectedRoute allowedRoles={["user", "support", "admin"]} />}>
                                    <Route path="/organization" element={<OrganizationPage />} />
                                </Route>

                                {/* Support + Admin only */}
                                <Route element={<ProtectedRoute allowedRoles={["support", "admin"]} />}>
                                    <Route path="/approvals" element={<ApprovalsPage />} />
                                </Route>
                            </Route>
                        </Route>

                        {/* Catch-all: redirect unknown URLs to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                )}
                <ToastContainer />
            </AuthProvider>
        </BrowserRouter>
    );
}
