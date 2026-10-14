// Browser client for apps/api. Keeps the short-lived access token in memory and silently renews it
// with the httpOnly refresh cookie, so pages just call `api.get("/workspaces")`.

import type { Me, Session } from "./types";

export type Scope = "app" | "admin";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Listener = (user: Me | null) => void;
type RequestOptions = { signal?: AbortSignal; headers?: Record<string, string> };

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient({ baseUrl, scope }: { baseUrl: string; scope: Scope }) {
  const base = baseUrl.replace(/\/$/, "");
  const authPath = scope === "admin" ? "/auth/admin" : "/auth";
  let token: string | null = null;
  let refreshing: Promise<Me | null> | null = null;
  const listeners = new Set<Listener>();
  const emit = (user: Me | null) => listeners.forEach((l) => l(user));

  /** Trades the refresh cookie for a new access token. Concurrent callers share one request. */
  function refresh(): Promise<Me | null> {
    refreshing ??= (async () => {
      try {
        const res = await fetch(`${base}${authPath}/refresh`, { method: "POST", credentials: "include" });
        if (!res.ok) {
          token = null;
          emit(null);
          return null;
        }
        const session = (await res.json()) as Session;
        token = session.accessToken;
        emit(session.user);
        return session.user;
      } catch {
        // Network error: keep whatever state we had; the next request will try again.
        return null;
      } finally {
        refreshing = null;
      }
    })();
    return refreshing;
  }

  async function send(method: string, path: string, body: unknown, opts: RequestOptions, retried = false): Promise<unknown> {
    if (!token && !retried) await refresh();
    const headers: Record<string, string> = { ...opts.headers };
    if (token) headers.authorization = `Bearer ${token}`;
    let payload: BodyInit | undefined;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) {
      headers["content-type"] = "application/json";
      payload = JSON.stringify(body);
    }

    const res = await fetch(`${base}${path}`, { method, headers, body: payload, credentials: "include", signal: opts.signal });
    if (res.status === 401 && !retried && !path.startsWith("/auth/")) {
      const user = await refresh();
      if (user) return send(method, path, body, opts, true);
    }
    if (res.status === 204) return undefined;
    const text = await res.text();
    const data = text ? safeJson(text) : undefined;
    if (!res.ok) {
      const err = data as { message?: string | string[]; code?: string } | undefined;
      const message = Array.isArray(err?.message) ? err.message.join(". ") : (err?.message ?? res.statusText);
      throw new ApiError(res.status, capitalize(message), err?.code);
    }
    return data;
  }

  const client = {
    baseUrl: base,
    scope,
    get: <T>(path: string, opts: RequestOptions = {}) => send("GET", path, undefined, opts) as Promise<T>,
    post: <T>(path: string, body: unknown = {}, opts: RequestOptions = {}) => send("POST", path, body, opts) as Promise<T>,
    put: <T>(path: string, body: unknown, opts: RequestOptions = {}) => send("PUT", path, body, opts) as Promise<T>,
    patch: <T>(path: string, body: unknown, opts: RequestOptions = {}) => send("PATCH", path, body, opts) as Promise<T>,
    del: <T = void>(path: string, opts: RequestOptions = {}) => send("DELETE", path, undefined, opts) as Promise<T>,

    /** GET a non-JSON response (e.g. a CSV export) as text, with the same auth handling. */
    async text(path: string) {
      if (!token) await refresh();
      const doFetch = () =>
        fetch(`${base}${path}`, { headers: token ? { authorization: `Bearer ${token}` } : {}, credentials: "include" });
      let res = await doFetch();
      if (res.status === 401 && (await refresh())) res = await doFetch();
      if (!res.ok) throw new ApiError(res.status, res.statusText);
      return res.text();
    },

    /** Uploads one file and returns its public URL. */
    async upload(file: File) {
      const form = new FormData();
      form.append("file", file);
      return (await send("POST", "/uploads", form, {})) as { id: string; url: string; name: string; mimeType: string; sizeBytes: number };
    },

    /** Call with the body of any response that started a session (login, verify, signup...). */
    setSession(session: Session) {
      token = session.accessToken;
      emit(session.user);
    },
    /** Re-broadcasts the user after a profile change so every `useAuth()` sees it. */
    setUser(user: Me) {
      emit(user);
    },
    refresh,
    async logout() {
      try {
        await fetch(`${base}${authPath}/logout`, { method: "POST", credentials: "include" });
      } finally {
        token = null;
        emit(null);
      }
    },
    onAuthChange(listener: Listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
  return client;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** "Something went wrong" fallback for catch blocks. */
export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "Can't reach the server. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
