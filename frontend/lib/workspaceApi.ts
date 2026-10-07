export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
};

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  websiteUrl?: string | null;
  role: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ACCESS_TOKEN_KEY = "publify_workspace_access_token";
const REFRESH_TOKEN_KEY = "publify_workspace_refresh_token";
const EMAIL_KEY = "publify_workspace_email";
const ROLE_KEY = "publify_workspace_role";

function saveSession(data: AuthResponse) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(EMAIL_KEY, data.email);
  localStorage.setItem(ROLE_KEY, data.role);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredEmail() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(ROLE_KEY);
}

async function parseError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return body.error || "Something went wrong";
}

export async function register(
  email: string,
  password: string,
  workspaceName: string
) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      workspaceName,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as AuthResponse;
  saveSession(data);

  return data;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as AuthResponse;
  saveSession(data);

  return data;
}

async function refreshSession() {
  if (typeof window === "undefined") return false;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    clearSession();
    return false;
  }

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!response.ok) {
    clearSession();
    return false;
  }

  const data = (await response.json()) as AuthResponse;
  saveSession(data);

  return true;
}

export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  const makeRequest = (accessToken: string | null) =>
    fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

  let response = await makeRequest(token);

  if (response.status === 401) {
    const refreshed = await refreshSession();

    if (!refreshed) {
      return response;
    }

    response = await makeRequest(getAccessToken());
  }

  return response;
}

export async function getCurrentWorkspace(): Promise<Workspace> {
  const response = await authFetch("/workspace/me");

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Workspace;
}

export async function logout() {
  clearSession();
}
