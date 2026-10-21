import "server-only";
import { cookies, headers } from "next/headers";

const apiOrigin = process.env.NEXT_BACKEND_URL ?? "http://127.0.0.1:4000";

export class BackendApiError extends Error {
  constructor(public readonly status: number, public readonly code: string) {
    super(code);
  }
}

export async function backendRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieJar = await cookies();
  const requestHeaders = await headers();
  const outgoing = new Headers(init.headers);
  outgoing.set("cookie", cookieJar.toString());
  const origin = requestHeaders.get("origin") ?? requestHeaders.get("referer")?.replace(/\/$/, "");
  if (origin) outgoing.set("origin", origin);
  if (init.body && !outgoing.has("content-type")) outgoing.set("content-type", "application/json");

  const response = await fetch(new URL(path, apiOrigin), {
    ...init,
    headers: outgoing,
    cache: "no-store",
  });

  const setCookies = response.headers.getSetCookie();
  for (const setCookie of setCookies) {
    const [pair, ...attributes] = setCookie.split(";");
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    const options: { path: string; httpOnly: boolean; secure: boolean; sameSite: "lax"; maxAge?: number } = {
      path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    };
    const maxAge = attributes.find((part) => part.trim().toLowerCase().startsWith("max-age="));
    if (maxAge) options.maxAge = Number(maxAge.split("=")[1]);
    if (name) cookieJar.set(name, value, options);
  }

  const body = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new BackendApiError(response.status, body.error ?? "backend_error");
  return body as T;
}

export function backendGet<T>(path: string) {
  return backendRequest<T>(path);
}

export function backendPost<T>(path: string, body: unknown) {
  return backendRequest<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function backendPatch<T>(path: string, body: unknown) {
  return backendRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}
