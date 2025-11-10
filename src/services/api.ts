/**
 * Cliente HTTP ligero con refresco automático de token.
 * - Usa import.meta.env.VITE_API_URL como base.
 * - Provee helpers apiGet/apiPost/... y endpoints de usuarios/roles.
 * - Guarda tokens en localStorage: "auth_token" y "refresh_token".
 */

// Preferir VITE_API_URL; si no existe, usar rutas relativas para aprovechar el proxy de Vite en dev.
const BASE = (import.meta.env.VITE_API_URL as string) || "";

// helpers de tokens / tipos usados por el módulo

export interface LoginResponse {
  access?: string;
  refresh?: string;
  tokens?: { access?: string; refresh?: string };
  token?: string;
  usuario?: unknown;
}

export function setToken(access: string | null, refresh?: string | null) {
  if (access) localStorage.setItem("auth_token", access);
  else localStorage.removeItem("auth_token");
  if (typeof refresh !== "undefined") {
    if (refresh) localStorage.setItem("refresh_token", refresh);
    else localStorage.removeItem("refresh_token");
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function clearTokens() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("current_user");
}

// cabecera con Authorization si hay token
function getAuthHeaders(): Record<string,string> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string,string> = { "Content-Type": "application/json", "Accept": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function apiGet<T = unknown>(path: string) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function apiPost<T = unknown>(path: string, body?: unknown) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  console.debug("[apiPost] POST", url);
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function apiPut<T = unknown>(path: string, body?: unknown) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function apiPatch<T = unknown>(path: string, body?: unknown) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export async function apiDelete<T = unknown>(path: string) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { method: "DELETE", headers: getAuthHeaders() });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

/* ---------- Auth / endpoints específicos ---------- */

/**
 * loginUser:
 * - Hace POST directo sin usar callApi (evita Authorization header automático)
 * - Soporta tanto { username, password } como { email, password }
 * - Guarda access/refresh según la respuesta del backend
 */
export async function loginUser(identifier: string, password: string) {
  const path = "/api/usuarios/login/";
  const url = `${BASE.replace(/\/+$/, "")}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ username: identifier, email: identifier, password }),
    });
  } catch (networkErr) {
    console.error("[loginUser] network error:", networkErr);
    throw { status: 0, data: "Network error or blocked by CORS" };
  }

  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) throw { status: res.status, data: payload };

  // guardar tokens y usuario
  const access = payload?.access ?? payload?.tokens?.access ?? payload?.token ?? null;
  const refresh = payload?.refresh ?? payload?.tokens?.refresh ?? null;
  if (access) {
    localStorage.setItem("auth_token", String(access));
    if (refresh) localStorage.setItem("refresh_token", String(refresh));
  }
  if (payload?.usuario) {
    localStorage.setItem("current_user", JSON.stringify(payload.usuario));
  }

  return payload;
}

/** refresh token: POST /api/token/refresh/ */
export async function refreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) throw new Error("refresh failed");
    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    const access = data?.access ?? null;
    if (access) {
      setToken(String(access), refresh);
      return true;
    }
    return false;
  } catch {
    clearTokens();
    return false;
  }
}


/* --------- Usuarios / Roles helpers --------- */

/* Roles */
export async function listRoles() {
  return apiGet<Array<{ idRol: number; nombre: string; descripcion?: string }>>("/api/usuarios/roles/");
}
export async function createRole(payload: { nombre: string; descripcion?: string }) {
  return apiPost("/api/usuarios/roles/", payload);
}

/* Usuarios */
export async function listUsers() {
  return apiGet<unknown[]>("/api/usuarios/");
}
export async function createUser(payload: { username: string; email?: string; password: string; rol: number }) {
  return apiPost("/api/usuarios/", payload);
}
export async function getUser(id: number | string) {
  return apiGet(`/api/usuarios/${id}/`);
}
export async function updateUser(id: number | string, payload: Partial<Record<string, unknown>>) {
  return apiPatch(`/api/usuarios/${id}/`, payload);
}
export async function changePassword(payload: { id_usuario: number; password_actual: string; password_nueva: string }) {
  return apiPost("/api/usuarios/cambiar-password/", payload);
}
export async function fetchProfile() {
  return apiGet("/api/usuarios/me/");
}

/* Registrar cliente (endpoint público) */
export async function registerClient(payload: {
  username: string;
  email: string;
  password: string;
  fcmToken?: string;
}) {
  // POST /api/usuarios/registrar/
  return apiPost("/api/usuarios/registrar/", payload);
}

/* Buscar usuarios (ruta pública/auth según back) */
export async function searchUsers(query: string) {
  return apiGet(`/api/usuarios/buscar/?q=${encodeURIComponent(query)}`);
}

/* Actualizar FCM token */
export async function updateFcmToken(id: number | string, fcmToken: string) {
  return apiPatch(`/api/usuarios/${id}/fcm-token/`, { fcmToken });
}

/* Eliminar permanentemente (admin) */
export async function deleteUserPermanent(id: number | string) {
  return apiDelete(`/api/usuarios/${id}/permanent/`);
}

/* Buscar roles por query (si tu API tiene /roles/buscar/) */
export async function searchRoles(q: string) {
  return apiGet(`/api/usuarios/roles/buscar/?q=${encodeURIComponent(q)}`);
}