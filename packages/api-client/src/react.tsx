"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import useSWR, { SWRConfig, useSWRConfig, type SWRConfiguration } from "swr";
import type { ApiClient } from "./client";
import type { Me } from "./types";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: Me }
  | { status: "anonymous"; user: null };

type ApiContextValue = { api: ApiClient; auth: AuthState };

const ApiContext = createContext<ApiContextValue | null>(null);

/**
 * Provides the API client, restores the session from the refresh cookie on first load,
 * and makes every `useApiQuery` use the client as its fetcher.
 */
export function ApiProvider({ api, children }: { api: ApiClient; children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading", user: null });

  useEffect(() => {
    const off = api.onAuthChange((user) => setAuth(user ? { status: "authenticated", user } : { status: "anonymous", user: null }));
    void api.refresh();
    return off;
  }, [api]);

  const value = useMemo(() => ({ api, auth }), [api, auth]);
  const fetcher = useCallback((path: string) => api.get(path), [api]);

  return (
    <ApiContext.Provider value={value}>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false, shouldRetryOnError: false }}>
        <SessionCacheReset status={auth.status} />
        {children}
      </SWRConfig>
    </ApiContext.Provider>
  );
}

/** Drops cached responses when the user signs out, so the next account never sees the last one's data. */
function SessionCacheReset({ status }: { status: AuthState["status"] }) {
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (status === "anonymous") void mutate(() => true, undefined, { revalidate: false });
  }, [status, mutate]);
  return null;
}

function useApiContext() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("ApiProvider is missing");
  return ctx;
}

export const useApi = () => useApiContext().api;

export function useAuth() {
  const { api, auth } = useApiContext();
  return { ...auth, setSession: api.setSession, setUser: api.setUser, logout: api.logout };
}

/** `useApiQuery<WorkspaceCard[]>("/workspaces")`. Pass null to skip. */
export function useApiQuery<T>(path: string | null, config?: SWRConfiguration<T>) {
  return useSWR<T>(path, config);
}

/** Revalidates every cached query whose path starts with one of the prefixes. */
export function useInvalidate() {
  const { mutate } = useSWRConfig();
  return useCallback(
    (...prefixes: string[]) => mutate((key) => typeof key === "string" && prefixes.some((p) => key.startsWith(p))),
    [mutate],
  );
}

/** Builds "/path?a=1&b=2", skipping empty values and repeating arrays (?trade=a&trade=b). */
export function withQuery(path: string, params: Record<string, string | number | boolean | string[] | null | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) value.forEach((v) => search.append(key, v));
    else search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
