/**
 * Servicio de gestión de usuarios
 * Maneja todas las operaciones CRUD de usuarios
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";

/**
 * Interfaz para el detalle del rol
 */
export interface RolDetalle {
  idRol: number;
  nombre: string;
  descripcion: string;
}

/**
 * Interfaz completa de Usuario
 */
export interface Usuario {
  idUsuario: number;
  username: string; // El servidor envía 'username' en lugar de 'nombre'
  nombre?: string; // Opcional por compatibilidad
  email: string;
  telefono?: string;
  direccion?: string;
  ci?: string;
  fcmToken?: string | null;
  activo: boolean;
  rol: number;
  rol_detalle?: RolDetalle; // Opcional porque puede no venir
  nombre_rol?: string; // Opcional porque puede no venir
  fecha_creacion?: string; // Opcional porque puede no venir
  fecha_modificacion?: string; // Opcional porque puede no venir
}

/**
 * Interfaz para crear un nuevo usuario
 */
export interface CrearUsuarioDTO {
  username: string; // El backend espera 'username', no 'nombre'
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  ci?: string;
  idRol: number; // El backend espera 'idRol', no 'rol'
}

/**
 * Interfaz para actualizar usuario completo (PUT)
 */
export interface ActualizarUsuarioDTO {
  username: string; // El backend espera 'username', no 'nombre'
  email: string;
  telefono?: string;
  direccion?: string;
  ci?: string;
  idRol: number; // El backend espera 'idRol', no 'rol'
}

/**
 * Interfaz para actualizar usuario parcial (PATCH)
 */
export interface ActualizarUsuarioParcialDTO {
  username?: string; // El backend espera 'username', no 'nombre'
  email?: string;
  telefono?: string;
  direccion?: string;
  ci?: string;
  idRol?: number; // El backend espera 'idRol', no 'rol'
}

/**
 * Interfaz para cambiar contraseña
 */
export interface CambiarPasswordDTO {
  password_actual: string;
  password_nueva: string;
}

/**
 * Interfaz para respuesta de mensajes
 */
export interface MensajeResponse {
  mensaje?: string;
  error?: string;
}

/**
 * Servicio de Usuarios
 */
export const UsuarioService = {
  /**
   * 1️⃣ Listar todos los usuarios
   * GET /api/usuarios/
   */
  listar: async (): Promise<Usuario[]> => {
    return await apiGet<Usuario[]>("/api/usuarios/");
  },

  /**
   * 2️⃣ Crear un nuevo usuario
   * POST /api/usuarios/
   */
  crear: async (data: CrearUsuarioDTO): Promise<Usuario> => {
    return await apiPost<Usuario>("/api/usuarios/", data);
  },

  /**
   * 3️⃣ Obtener un usuario por ID
   * GET /api/usuarios/{id}/
   */
  obtener: async (id: number): Promise<Usuario> => {
    return await apiGet<Usuario>(`/api/usuarios/${id}/`);
  },

  /**
   * 4️⃣ Actualizar usuario completo (requiere todos los campos)
   * PUT /api/usuarios/{id}/
   */
  actualizar: async (
    id: number,
    data: ActualizarUsuarioDTO
  ): Promise<Usuario> => {
    return await apiPut<Usuario>(`/api/usuarios/${id}/`, data);
  },

  /**
   * 5️⃣ Actualizar usuario parcial (solo campos específicos)
   * PATCH /api/usuarios/{id}/
   */
  actualizarParcial: async (
    id: number,
    data: ActualizarUsuarioParcialDTO
  ): Promise<Usuario> => {
    return await apiPatch<Usuario>(`/api/usuarios/${id}/`, data);
  },

  /**
   * 6️⃣ Desactivar usuario (Soft Delete)
   * DELETE /api/usuarios/{id}/
   * Nota: No elimina el registro, solo marca activo = false
   */
  desactivar: async (id: number): Promise<MensajeResponse> => {
    return await apiDelete<MensajeResponse>(`/api/usuarios/${id}/`);
  },

  /**
   * 7️⃣ Eliminar usuario permanentemente (Hard Delete)
   * DELETE /api/usuarios/{id}/permanente/
   * ⚠️ PELIGRO: Elimina el registro de la base de datos permanentemente
   */
  eliminarPermanente: async (id: number): Promise<MensajeResponse> => {
    return await apiDelete<MensajeResponse>(`/api/usuarios/${id}/permanente/`);
  },

  /**
   * 8️⃣ Cambiar contraseña del usuario autenticado
   * POST /api/usuarios/cambiar-password/
   */
  cambiarPassword: async (
    data: CambiarPasswordDTO
  ): Promise<MensajeResponse> => {
    return await apiPost<MensajeResponse>(
      "/api/usuarios/cambiar-password/",
      data
    );
  },

  /**
   * 9️⃣ Buscar usuarios por término
   * GET /api/usuarios/buscar/?q={query}
   * Busca en: nombre, email, teléfono, CI
   */
  buscar: async (query: string): Promise<Usuario[]> => {
    const encodedQuery = encodeURIComponent(query);
    return await apiGet<Usuario[]>(`/api/usuarios/buscar/?q=${encodedQuery}`);
  },
};

/**
 * Funciones helper para validaciones y transformaciones
 */
export const UsuarioHelpers = {
  /**
   * Valida si un email tiene formato correcto
   */
  validarEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida si una contraseña cumple requisitos mínimos
   */
  validarPassword: (
    password: string
  ): {
    valido: boolean;
    errores: string[];
  } => {
    const errores: string[] = [];

    if (password.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  },

  /**
   * Formatea la fecha de creación/modificación
   */
  formatearFecha: (fecha?: string): string => {
    if (!fecha) return "Fecha no disponible";
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  },

  /**
   * Obtiene el badge de color según el rol
   */
  obtenerColorRol: (nombreRol?: string): string => {
    if (!nombreRol || typeof nombreRol !== "string") {
      return "#999";
    }
    const colores: { [key: string]: string } = {
      Administrador: "#610C27",
      Admin: "#610C27",
      Cliente: "#d4af37",
      Usuario: "#AC9C8D",
    };
    return colores[nombreRol] || "#999";
  },

  /**
   * Filtra usuarios activos
   */
  filtrarActivos: (usuarios: Usuario[]): Usuario[] => {
    return usuarios.filter((u) => u.activo);
  },

  /**
   * Filtra usuarios inactivos
   */
  filtrarInactivos: (usuarios: Usuario[]): Usuario[] => {
    return usuarios.filter((u) => !u.activo);
  },

  /**
   * Filtra usuarios por rol
   */
  filtrarPorRol: (usuarios: Usuario[], nombreRol: string): Usuario[] => {
    return usuarios.filter((u) => u.nombre_rol === nombreRol);
  },

  /**
   * Obtiene el nombre de usuario (prioriza nombre, luego username)
   */
  obtenerNombre: (usuario: Usuario): string => {
    return usuario.nombre || usuario.username || "Usuario sin nombre";
  },

  /**
   * Obtiene iniciales del nombre para avatar
   */
  obtenerIniciales: (nombre: string): string => {
    if (!nombre || typeof nombre !== "string") {
      return "??";
    }
    const partes = nombre.trim().split(" ");
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  },

  /**
   * Obtiene iniciales de un usuario (maneja username o nombre)
   */
  obtenerInicialesUsuario: (usuario: Usuario): string => {
    const nombre = UsuarioHelpers.obtenerNombre(usuario);
    return UsuarioHelpers.obtenerIniciales(nombre);
  },
};

/**
 * Hook personalizado para manejo de errores de API
 */
export const manejarErrorUsuario = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      data?: {
        error?: string;
        email?: string[];
        password?: string[];
        nombre?: string[];
        detail?: string;
      };
      status?: number;
    };

    // Error específico del servidor
    if (err.data?.error) {
      return err.data.error;
    }

    // Errores de validación de campos
    if (err.data?.email) {
      return Array.isArray(err.data.email) ? err.data.email[0] : err.data.email;
    }

    if (err.data?.password) {
      return Array.isArray(err.data.password)
        ? err.data.password[0]
        : err.data.password;
    }

    if (err.data?.nombre) {
      return Array.isArray(err.data.nombre)
        ? err.data.nombre[0]
        : err.data.nombre;
    }

    if (err.data?.detail) {
      return err.data.detail;
    }

    // Errores por código de estado
    if (err.status === 404) {
      return "Usuario no encontrado";
    }

    if (err.status === 401) {
      return "No autorizado. Por favor inicia sesión nuevamente";
    }

    if (err.status === 403) {
      return "No tienes permisos para realizar esta acción";
    }

    if (err.status === 400) {
      return "Datos inválidos. Verifica la información enviada";
    }
  }

  return "Error al procesar la solicitud. Intenta nuevamente";
};

/**
 * Exportar todo como default también
 */
export default UsuarioService;
