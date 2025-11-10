// Use the API base (prefer VITE_API_URL, otherwise default to localhost:8000 with /api prefix)
const BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : "http://localhost:8000") + "/api";

function authHeaders(isForm = false) {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string,string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

type CategoryPayload = FormData | Record<string, unknown>;

async function safeParse(res: Response) {
  const txt = await res.text();
  let data: any = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {
    // not JSON (probably HTML error page)
    data = txt;
  }
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function listCategories() {
  const res = await fetch(`${BASE}/categorias/`, { headers: authHeaders() });
  return safeParse(res);
}

export async function getCategory(id: string | number) {
  const res = await fetch(`${BASE}/categorias/${id}/`, { headers: authHeaders() });
  return safeParse(res);
}

export async function createCategory(payload: CategoryPayload) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`${BASE}/categorias/`, {
    method: "POST",
    headers: authHeaders(isForm),
    body: isForm ? payload : JSON.stringify(payload),
  });
  return safeParse(res);
}

export async function updateCategory(id: string | number, payload: CategoryPayload) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`${BASE}/categorias/${id}/`, {
    method: "PUT",
    headers: authHeaders(isForm),
    body: isForm ? payload : JSON.stringify(payload),
  });
  return safeParse(res);
}

export async function deleteCategory(id: string | number) {
  const res = await fetch(`${BASE}/categorias/${id}/`, { method: "DELETE", headers: authHeaders() });
  return safeParse(res);
}
