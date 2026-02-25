/**
 * SUNDAE Frontend — Axios Client with Supabase JWT Interceptor
 *
 * Now uses the Supabase client directly to get the current token,
 * instead of manually parsing localStorage.
 */

import axios from "axios";
import { supabase } from "./supabaseClient";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// ── Request Interceptor: Attach JWT Token ───────────────────────
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle Auth Errors ────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired — attempt to refresh
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                // Refresh failed — sign out and redirect
                await supabase.auth.signOut();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
