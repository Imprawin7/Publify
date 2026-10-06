"use client";

/**
 * Client-side auth + authenticated fetch for the admin panel.
 * Tokens live in localStorage (this is a browser-only module — never imported
 * by a server component). On a 401, we try exactly one silent refresh before
 * giving up and forcing re-login, so a session doesn't die on every token expiry.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ACCESS_KEY = "publify_access_token";
const REFRESH_KEY = "publify_refresh_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Invalid email or password");
  }
  const data = await res.json();
  storeTokens(data.accessToken, data.refreshToken);
  return data;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;

  const data = await res.json();
  storeTokens(data.accessToken, data.refreshToken);
  return true;
}

/** Authenticated fetch for any admin CRUD call. Throws with a readable message on failure. */
export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const doFetch = () =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        // Only JSON bodies get a content type; FormData (uploads) must let the browser set the multipart boundary.
        ...(typeof options.body === "string" ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    } else {
      logout();
      throw new Error("Session expired — please log in again.");
    }
  }

  return res;
}

/** Generic CRUD helpers used by ResourceManager for the simple, list-shaped content types. */
export async function listResource<T>(path: string): Promise<T[]> {
  const res = await authFetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export async function createResource<T>(path: string, body: unknown): Promise<T> {
  const res = await authFetch(path, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Failed to create item in ${path}`);
  return res.json();
}

export async function updateResource<T>(path: string, id: number | string, body: unknown): Promise<T> {
  const res = await authFetch(`${path}/${id}`, { method: "PUT", body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Failed to update item in ${path}`);
  return res.json();
}

export async function deleteResource(path: string, id: number | string): Promise<void> {
  const res = await authFetch(`${path}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete item in ${path}`);
}

export { API_BASE };
