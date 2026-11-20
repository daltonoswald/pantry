export const API_URL = import.meta.env.VITE_API_URL ?? `http://localhost:3000`;

export async function apiGet(path, { token, signal } = {}) {
    const response = await fetch (`${API_URL}${path}`, {
        headers: token ? {
            Authorization: `Bearer ${token}`
        } : {},
        signal,
    });
    if (!response.ok) throw new Error(`Request to ${path} failed (${response.status})`);
    return response.json();
}