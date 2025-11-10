// Cliente API genérico y tipado
export type ApiError = { status?: number; data?: unknown; message?: string };

const BASE = import.meta.env.VITE_API_URL ?? "";

let _token: string | null = localStorage.getItem("auth_token");

export function setToken(token: string | null) {
  _token = token;
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
}

async function parseResponse(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

async function request<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = { ...(opts.headers as Record<string,string> || {}) };
  if (!("Content-Type" in headers) && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await parseResponse(res);
  if (!res.ok) {
    const err: ApiError = { status: res.status, data, message: (data && (data).message) ?? res.statusText };
    throw err;
  }
  return data as T;
}

export async function apiGet<T = unknown>(path: string) { return request<T>(path, { method: "GET" }); }
export async function apiPost<T = unknown>(path: string, body?: unknown) {
  const opts: RequestInit = { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) };
  return request<T>(path, opts);
}
export async function apiPut<T = unknown>(path: string, body?: unknown) {
  const opts: RequestInit = { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) };
  return request<T>(path, opts);
}
export async function apiDelete<T = unknown>(path: string) { return request<T>(path, { method: "DELETE" }); }