/**
 * Prototype Mode: network client is disabled.
 *
 * Endpoints should use mockDb instead of calling real backend.
 * We keep exports for compatibility.
 */

export async function refreshTokenOnce(): Promise<string | null> {
    return null;
}

export async function getValidToken(): Promise<string | null> {
    return null;
}

type ApiResponse<T> = { data: T };

const notAvailable = async () => {
    throw new Error("Prototype Mode: apiClient is disabled");
};

const apiClient = {
    get: notAvailable,
    post: notAvailable,
    put: notAvailable,
    patch: notAvailable,
    delete: notAvailable,
} as unknown as {
    get: <T = unknown>(_url: string, _config?: unknown) => Promise<ApiResponse<T>>;
    post: <T = unknown>(_url: string, _data?: unknown, _config?: unknown) => Promise<ApiResponse<T>>;
    put: <T = unknown>(_url: string, _data?: unknown, _config?: unknown) => Promise<ApiResponse<T>>;
    patch: <T = unknown>(_url: string, _data?: unknown, _config?: unknown) => Promise<ApiResponse<T>>;
    delete: <T = unknown>(_url: string, _config?: unknown) => Promise<ApiResponse<T>>;
};

export default apiClient;
