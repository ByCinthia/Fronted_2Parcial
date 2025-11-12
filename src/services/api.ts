/**
 * Cliente HTTP para comunicación con el backend
 * Maneja tokens JWT y peticiones autenticadas
 */

// Base URL del API - usar variable de entorno o valor por defecto
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Interfaz para la respuesta del login
 */
export interface LoginResponse {
  refresh: string;
  access: string;
  usuario: {
    idUsuario: number;
    username: string;
    email: string;
    fcmToken: string | null;
    rol: {
      idRol: number;
      nombre: string; // "Admin" o "Cliente"
      descripcion: string;
    };
    fecha_creacion: string;
    fecha_actualizacion: string;
    activo: boolean;
  };
}

/**
 * Interfaz para el usuario almacenado
 */
export interface User {
  idUsuario: number;
  username: string;
  email: string;
  rol: {
    idRol: number;
    nombre: string;
    descripcion: string;
  };
}

/**
 * Guarda el token de acceso en localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

/**
 * Obtiene el token de acceso desde localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

/**
 * Guarda el token de refresco en localStorage
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem("refresh_token", token);
}

/**
 * Obtiene el token de refresco desde localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

/**
 * Guarda el usuario en localStorage
 */
export function setUser(user: User): void {
  localStorage.setItem("current_user", JSON.stringify(user));
  // Guardar el rol por separado para fácil acceso
  localStorage.setItem("user_role", user.rol.nombre);
}

/**
 * Obtiene el usuario desde localStorage
 */
export function getUser(): User | null {
  const userStr = localStorage.getItem("current_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Obtiene el rol del usuario desde localStorage
 */
export function getUserRole(): string | null {
  return localStorage.getItem("user_role");
}

/**
 * Limpia todos los tokens y datos de usuario
 */
export function clearTokens(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("current_user");
  localStorage.removeItem("user_role");
}

/**
 * Obtiene los headers para peticiones autenticadas
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Realiza petición GET autenticada
 */
export async function apiGet<T = unknown>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data as T;
}

/**
 * Realiza petición POST autenticada
 */
export async function apiPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data as T;
}

/**
 * Realiza petición PUT autenticada
 */
export async function apiPut<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data as T;
}

/**
 * Realiza petición PATCH autenticada
 */
export async function apiPatch<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data as T;
}

/**
 * Realiza petición DELETE autenticada
 */
export async function apiDelete<T = unknown>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data as T;
}

/**
 * Realiza login y guarda los tokens y datos del usuario
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const url = `${BASE_URL}/api/usuarios/login/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      data: errorData,
    };
  }

  const data: LoginResponse = await response.json();

  // Guardar tokens
  setToken(data.access);
  setRefreshToken(data.refresh);

  // Guardar usuario y rol
  setUser({
    idUsuario: data.usuario.idUsuario,
    username: data.usuario.username,
    email: data.usuario.email,
    rol: data.usuario.rol,
  });

  return data;
}

/**
 * Refresca el token de acceso usando el refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const url = `${BASE_URL}/api/token/refresh/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    if (data.access) {
      setToken(data.access);
      return true;
    }

    return false;
  } catch {
    clearTokens();
    return false;
  }
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function fetchProfile(): Promise<User> {
  return apiGet<User>("/api/usuarios/me/");
}
