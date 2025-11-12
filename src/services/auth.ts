/**
 * Servicio de autenticación
 * Maneja login, logout y verificación de autenticación
 */

import {
  loginUser as apiLoginUser,
  clearTokens,
  getToken,
  getUserRole,
  fetchProfile,
  type LoginResponse,
} from "./api";

/**
 * Realiza el login del usuario
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Datos del usuario y tokens
 */
export async function signIn(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await apiLoginUser(email, password);
    return response;
  } catch (error) {
    console.error("Error en signIn:", error);
    throw error;
  }
}

/**
 * Cierra la sesión del usuario
 * Limpia todos los tokens y datos almacenados
 */
export function signOut(): void {
  clearTokens();
}

/**
 * Verifica si el usuario está autenticado
 * @returns true si hay un token válido, false en caso contrario
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * Obtiene el rol del usuario actual
 * @returns El rol del usuario ("Admin", "Cliente", etc.) o null si no está autenticado
 */
export function getUserRoleName(): string | null {
  return getUserRole();
}

/**
 * Verifica si el usuario es Admin
 * @returns true si el usuario tiene rol de Admin
 */
export function isAdmin(): boolean {
  const role = getUserRole();
  return role === "Admin";
}

/**
 * Verifica si el usuario es Cliente
 * @returns true si el usuario tiene rol de Cliente
 */
export function isClient(): boolean {
  const role = getUserRole();
  return role === "Cliente";
}

/**
 * Obtiene el perfil completo del usuario autenticado
 * @returns Datos del perfil del usuario
 */
export async function getProfile() {
  try {
    return await fetchProfile();
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    throw error;
  }
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param requiredRole - Rol requerido
 * @returns true si el usuario tiene el rol especificado
 */
export function hasRole(requiredRole: string): boolean {
  const userRole = getUserRole();
  return userRole === requiredRole;
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 * @param allowedRoles - Array de roles permitidos
 * @returns true si el usuario tiene alguno de los roles
 */
export function hasAnyRole(allowedRoles: string[]): boolean {
  const userRole = getUserRole();
  return userRole ? allowedRoles.includes(userRole) : false;
}
