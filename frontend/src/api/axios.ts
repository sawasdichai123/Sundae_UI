/**
 * SUNDAE Frontend — Axios Client (Mock for Prototype)
 *
 * No real HTTP requests. Provides mock token functions
 * that other modules depend on.
 */

export async function refreshTokenOnce(): Promise<string | null> {
    return "mock-access-token";
}

export async function getValidToken(): Promise<string | null> {
    return "mock-access-token";
}

// Dummy apiClient — should not be called directly in prototype mode,
// but exported for compatibility with imports (e.g. DashboardPage health check).
const apiClient = {
    get: async (_url: string, _config?: any) => ({ data: { services: { backend: true, ollama: true, supabase: true } } }),
    post: async (_url: string, _data?: any, _config?: any) => ({ data: {} }),
    put: async (_url: string, _data?: any, _config?: any) => ({ data: {} }),
    patch: async (_url: string, _data?: any, _config?: any) => ({ data: {} }),
    delete: async (_url: string, _config?: any) => ({ data: {} }),
    request: async (_config: any) => ({ data: {} }),
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} },
    },
};

export default apiClient;
