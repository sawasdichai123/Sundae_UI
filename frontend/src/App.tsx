/**
 * SUNDAE Frontend — App.tsx (Role-Based Routing + Auth Lifecycle)
 *
 * AuthProvider wraps the app and listens to Supabase onAuthStateChange.
 * On mount, restores the session from localStorage if present.
 */

import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { initPrototypeAuthFromStorage, useAuthStore } from "./store/authStore";

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

// ── Auth Lifecycle Provider ─────────────────────────────────────

function AuthProvider({ children }: { children: ReactNode }) {
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        // Safety timeout — never block longer than 5 seconds (accounts for slow networks)
        const timeout = setTimeout(() => {
            console.warn("[Auth] Session check timed out — proceeding without auth");
            setLoading(false);
        }, 5000);

        initPrototypeAuthFromStorage();
        clearTimeout(timeout);
        setLoading(false);

        return () => {
            clearTimeout(timeout);
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

function RoleHome() {
    const role = useAuthStore((s) => s.user?.role);

    if (role === "admin") {
        return <DashboardPage />;
    }

    if (role === "support") {
        return <Navigate to="/approvals" replace />;
    }

    return <Navigate to="/chat" replace />;
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
                                <Route path="/" element={<RoleHome />} />

                                {/* Web Chat — all roles */}
                                <Route path="/chat" element={<WebChatPage />} />

                                {/* Admin only */}
                                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                                    <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                                    <Route path="/bots" element={<BotsPage />} />
                                    <Route path="/inbox" element={<InboxPage />} />
                                    <Route path="/integration" element={<IntegrationPage />} />
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
