import { loginUser as apiLogin, fetchProfile, clearTokens } from "./api";

/**
 * signIn: llama a la API de login y retorna el objeto completo que devuelve el backend.
 * El helper apiLogin ya guarda tokens si vienen.
 */
export async function signIn(identifier: string, password: string) {
  return apiLogin(identifier, password);
}

/** signOut: limpia tokens locales */
export function signOut() {
  clearTokens();
}

/** Recuperar perfil del usuario autenticado */
export async function getProfile() {
  return fetchProfile();
}

/** Utilitario simple */
export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("auth_token"));
}