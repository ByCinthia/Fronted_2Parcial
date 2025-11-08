const BASE = import.meta.env.VITE_API_URL || "";

function authHeaders(isForm = false) {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string,string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

type ProductPayload = FormData | Record<string, unknown>;

export async function listProducts() {
  const res = await fetch(`${BASE}/productos`, { headers: authHeaders() });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getProduct(id: string | number) {
  const res = await fetch(`${BASE}/productos/${id}`, { headers: authHeaders() });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createProduct(payload: ProductPayload) {
  // payload puede ser FormData (si incluye imagen) o JSON
  const isForm = payload instanceof FormData;
  const res = await fetch(`${BASE}/productos`, {
    method: "POST",
    headers: authHeaders(isForm),
    body: isForm ? payload : JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateProduct(id: string | number, payload: ProductPayload) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: "PUT",
    headers: authHeaders(isForm),
    body: isForm ? payload : JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteProduct(id: string | number) {
  const res = await fetch(`${BASE}/productos/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw await res.json();
  return res.json();
}