// ============================================================
// 🎭 SERVICIO DE ROLES
// ============================================================
// Servicio completo para gestión de roles con métodos CRUD,
// helpers de utilidad y manejo de errores consistente
// ============================================================

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";

// ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================

/**
 * Interfaz principal del modelo Rol
 */
export interface Rol {
  idRol: number;
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para crear un nuevo rol
 * El idRol se genera automáticamente en el backend
 */
export interface CrearRolDTO {
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para actualizar un rol completamente (PUT)
 * Requiere todos los campos
 */
export interface ActualizarRolDTO {
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para actualizar un rol parcialmente (PATCH)
 * Todos los campos son opcionales
 */
export interface ActualizarRolParcialDTO {
  nombre?: string;
  descripcion?: string;
}

/**
 * Respuesta de eliminación exitosa
 */
export interface EliminarRolResponse {
  mensaje: string;
}

// ============================================================
// 🔧 SERVICIO DE ROLES
// ============================================================

export const RolService = {
  /**
   * 📋 Listar todos los roles
   * @returns Promise<Rol[]>
   * @auth No requiere autenticación (público)
   * @endpoint GET /api/usuarios/roles/
   * @description Obtiene listado completo de roles ordenados por nombre
   *
   * @example
   * const roles = await RolService.listar();
   * console.log(roles); // [{ idRol: 1, nombre: "Administrador", ... }]
   */
  listar: async (): Promise<Rol[]> => {
    try {
      const response = await apiGet<Rol[]>("/api/usuarios/roles/");
      console.log("✅ Roles obtenidos:", response);
      return response;
    } catch (error) {
      console.error("❌ Error al listar roles:", error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * ➕ Crear un nuevo rol
   * @param data - Datos del rol a crear (nombre requerido, descripcion opcional)
   * @returns Promise<Rol>
   * @auth No requiere autenticación (público)
   * @endpoint POST /api/usuarios/roles/
   * @description Crea un nuevo rol. El nombre debe ser único.
   *
   * @example
   * const nuevoRol = await RolService.crear({
   *   nombre: "Gerente",
   *   descripcion: "Usuario gerente con permisos administrativos"
   * });
   * console.log(nuevoRol.idRol); // 4
   */
  crear: async (data: CrearRolDTO): Promise<Rol> => {
    try {
      console.log("📤 Creando rol con datos:", data);
      const response = await apiPost<Rol>("/api/usuarios/roles/", data);
      console.log("✅ Rol creado exitosamente:", response);
      return response;
    } catch (error) {
      console.error("❌ Error al crear rol:", error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * 🔍 Obtener un rol por ID
   * @param id - ID del rol a obtener
   * @returns Promise<Rol>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/usuarios/roles/{id}/
   * @description Obtiene los detalles completos de un rol específico
   *
   * @example
   * const rol = await RolService.obtenerPorId(1);
   * console.log(rol.nombre); // "Administrador"
   */
  obtenerPorId: async (id: number): Promise<Rol> => {
    try {
      const response = await apiGet<Rol>(`/api/usuarios/roles/${id}/`);
      console.log("✅ Rol obtenido:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al obtener rol con ID ${id}:`, error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * ✏️ Actualizar un rol completamente (PUT)
   * @param id - ID del rol a actualizar
   * @param data - Datos completos del rol (requiere nombre)
   * @returns Promise<Rol>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PUT /api/usuarios/roles/{id}/
   * @description Actualiza todos los campos del rol. Requiere enviar todos los datos.
   *
   * @example
   * const rolActualizado = await RolService.actualizar(1, {
   *   nombre: "Administrador General",
   *   descripcion: "Usuario administrador con acceso total al sistema"
   * });
   */
  actualizar: async (id: number, data: ActualizarRolDTO): Promise<Rol> => {
    try {
      console.log(`📤 Actualizando rol ${id} con datos:`, data);
      const response = await apiPut<Rol>(`/api/usuarios/roles/${id}/`, data);
      console.log("✅ Rol actualizado exitosamente:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al actualizar rol ${id}:`, error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * 📝 Actualizar un rol parcialmente (PATCH)
   * @param id - ID del rol a actualizar
   * @param data - Datos parciales del rol (solo los campos a cambiar)
   * @returns Promise<Rol>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PATCH /api/usuarios/roles/{id}/
   * @description Actualiza solo los campos enviados. Más flexible que PUT.
   *
   * @example
   * // Actualizar solo la descripción
   * const rolActualizado = await RolService.actualizarParcial(1, {
   *   descripcion: "Nueva descripción"
   * });
   *
   * // Actualizar solo el nombre
   * const rolActualizado2 = await RolService.actualizarParcial(2, {
   *   nombre: "Super Admin"
   * });
   */
  actualizarParcial: async (
    id: number,
    data: ActualizarRolParcialDTO
  ): Promise<Rol> => {
    try {
      console.log(`📤 Actualizando parcialmente rol ${id} con datos:`, data);
      const response = await apiPatch<Rol>(`/api/usuarios/roles/${id}/`, data);
      console.log("✅ Rol actualizado parcialmente:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al actualizar parcialmente rol ${id}:`, error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * 🗑️ Eliminar un rol permanentemente
   * @param id - ID del rol a eliminar
   * @returns Promise<EliminarRolResponse>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint DELETE /api/usuarios/roles/{id}/
   * @description Elimina permanentemente un rol (hard delete).
   *              ⚠️ NO se puede eliminar si tiene usuarios asociados.
   *
   * @throws Error si el rol tiene usuarios asociados
   * @throws Error si el rol no existe
   *
   * @example
   * try {
   *   const response = await RolService.eliminar(3);
   *   console.log(response.mensaje); // "Rol eliminado exitosamente"
   * } catch (error) {
   *   console.error(error.message); // "No se puede eliminar el rol porque tiene usuarios asociados"
   * }
   */
  eliminar: async (id: number): Promise<EliminarRolResponse> => {
    try {
      console.log(`🗑️ Eliminando rol ${id}...`);
      const response = await apiDelete<EliminarRolResponse>(
        `/api/usuarios/roles/${id}/`
      );
      console.log("✅ Rol eliminado exitosamente:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al eliminar rol ${id}:`, error);
      throw new Error(manejarErrorRol(error));
    }
  },

  /**
   * 🔎 Buscar un rol por nombre exacto
   * @param nombre - Nombre exacto del rol a buscar (case-sensitive)
   * @returns Promise<Rol>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/usuarios/roles/buscar/?nombre={nombre}
   * @description Busca un rol por nombre exacto. Distingue mayúsculas/minúsculas.
   *
   * @throws Error si no se proporciona el nombre
   * @throws Error si no se encuentra el rol
   *
   * @example
   * const admin = await RolService.buscarPorNombre("Administrador");
   * console.log(admin.idRol); // 1
   *
   * const cliente = await RolService.buscarPorNombre("Cliente");
   * console.log(cliente.descripcion); // "Usuario cliente del sistema"
   */
  buscarPorNombre: async (nombre: string): Promise<Rol> => {
    try {
      if (!nombre || nombre.trim() === "") {
        throw new Error("Debe proporcionar un nombre para buscar");
      }

      console.log(`🔍 Buscando rol con nombre: "${nombre}"`);
      const encodedNombre = encodeURIComponent(nombre);
      const response = await apiGet<Rol>(
        `/api/usuarios/roles/buscar/?nombre=${encodedNombre}`
      );
      console.log("✅ Rol encontrado:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al buscar rol "${nombre}":`, error);
      throw new Error(manejarErrorRol(error));
    }
  },
};

// ============================================================
// 🛠️ HELPERS DE UTILIDAD
// ============================================================

export const RolHelpers = {
  /**
   * 📝 Obtener nombre del rol de forma segura
   * @param rol - Objeto rol (puede ser null/undefined)
   * @returns string - Nombre del rol o texto por defecto
   *
   * @example
   * RolHelpers.obtenerNombre(rol); // "Administrador"
   * RolHelpers.obtenerNombre(null); // "Sin rol"
   */
  obtenerNombre: (rol: Rol | null | undefined): string => {
    if (!rol) return "Sin rol";
    return rol.nombre || "Rol sin nombre";
  },

  /**
   * 📝 Obtener descripción del rol de forma segura
   * @param rol - Objeto rol (puede ser null/undefined)
   * @returns string - Descripción del rol o texto por defecto
   *
   * @example
   * RolHelpers.obtenerDescripcion(rol); // "Usuario con permisos completos"
   * RolHelpers.obtenerDescripcion(null); // "Sin descripción"
   */
  obtenerDescripcion: (rol: Rol | null | undefined): string => {
    if (!rol) return "Sin descripción";
    return rol.descripcion || "Sin descripción";
  },

  /**
   * 🔤 Obtener iniciales del nombre del rol
   * @param nombre - Nombre del rol
   * @returns string - Iniciales (máximo 2 caracteres)
   *
   * @example
   * RolHelpers.obtenerIniciales("Administrador"); // "AD"
   * RolHelpers.obtenerIniciales("Super Admin"); // "SA"
   * RolHelpers.obtenerIniciales("Cliente"); // "CL"
   * RolHelpers.obtenerIniciales(""); // "??"
   */
  obtenerIniciales: (nombre: string | null | undefined): string => {
    if (!nombre || nombre.trim() === "") return "??";

    const palabras = nombre.trim().split(/\s+/);

    if (palabras.length === 1) {
      // Una palabra: tomar primeras 2 letras
      return palabras[0].substring(0, 2).toUpperCase();
    } else {
      // Múltiples palabras: tomar primera letra de las dos primeras palabras
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
  },

  /**
   * 🔤 Obtener iniciales de un objeto Rol de forma segura
   * @param rol - Objeto rol (puede ser null/undefined)
   * @returns string - Iniciales del rol
   *
   * @example
   * RolHelpers.obtenerInicialesRol(rol); // "AD"
   * RolHelpers.obtenerInicialesRol(null); // "??"
   */
  obtenerInicialesRol: (rol: Rol | null | undefined): string => {
    if (!rol) return "??";
    return RolHelpers.obtenerIniciales(rol.nombre);
  },

  /**
   * 🎨 Obtener color asociado al rol
   * @param nombreRol - Nombre del rol
   * @returns string - Código de color hexadecimal
   * @description Asigna colores distintivos a roles comunes
   *
   * @example
   * RolHelpers.obtenerColorRol("Administrador"); // "#610C27" (wine)
   * RolHelpers.obtenerColorRol("Cliente"); // "#AC9C8D" (beige)
   * RolHelpers.obtenerColorRol("Vendedor"); // "#d4af37" (gold)
   */
  obtenerColorRol: (nombreRol: string | null | undefined): string => {
    if (!nombreRol) return "#999999"; // Gris por defecto

    const nombre = nombreRol.toLowerCase();

    // Roles administrativos -> Wine (rojo vino)
    if (
      nombre.includes("admin") ||
      nombre.includes("administrador") ||
      nombre.includes("super")
    ) {
      return "#610C27"; // --wine
    }

    // Roles de ventas/gerencia -> Gold (dorado)
    if (
      nombre.includes("vendedor") ||
      nombre.includes("gerente") ||
      nombre.includes("supervisor")
    ) {
      return "#d4af37"; // --gold
    }

    // Clientes -> Beige
    if (nombre.includes("cliente")) {
      return "#AC9C8D"; // --beige
    }

    // Empleados -> Soft Pink
    if (nombre.includes("empleado") || nombre.includes("staff")) {
      return "#E3C1B4"; // --soft-pink
    }

    // Por defecto -> Gris
    return "#999999";
  },

  /**
   * ✅ Validar nombre de rol
   * @param nombre - Nombre del rol a validar
   * @returns boolean - true si es válido
   * @description Verifica que el nombre no esté vacío y tenga máximo 100 caracteres
   *
   * @example
   * RolHelpers.validarNombre("Administrador"); // true
   * RolHelpers.validarNombre(""); // false
   * RolHelpers.validarNombre("a".repeat(101)); // false
   */
  validarNombre: (nombre: string | null | undefined): boolean => {
    if (!nombre || nombre.trim() === "") return false;
    if (nombre.trim().length > 100) return false;
    return true;
  },

  /**
   * ✅ Validar descripción de rol
   * @param descripcion - Descripción del rol a validar
   * @returns boolean - true si es válida (o está vacía)
   * @description Verifica que la descripción tenga máximo 255 caracteres
   *
   * @example
   * RolHelpers.validarDescripcion("Usuario admin"); // true
   * RolHelpers.validarDescripcion(""); // true (es opcional)
   * RolHelpers.validarDescripcion("a".repeat(256)); // false
   */
  validarDescripcion: (descripcion: string | null | undefined): boolean => {
    if (!descripcion || descripcion.trim() === "") return true; // Opcional
    if (descripcion.trim().length > 255) return false;
    return true;
  },

  /**
   * 🔢 Validar datos completos para crear/actualizar rol
   * @param data - Datos del rol a validar
   * @returns object - { valido: boolean, errores: string[] }
   * @description Valida todos los campos según las reglas del backend
   *
   * @example
   * const validacion = RolHelpers.validarDatosRol({
   *   nombre: "Admin",
   *   descripcion: "Usuario administrador"
   * });
   * console.log(validacion); // { valido: true, errores: [] }
   */
  validarDatosRol: (
    data: CrearRolDTO | ActualizarRolDTO
  ): { valido: boolean; errores: string[] } => {
    const errores: string[] = [];

    // Validar nombre (requerido)
    if (!RolHelpers.validarNombre(data.nombre)) {
      if (!data.nombre || data.nombre.trim() === "") {
        errores.push("El nombre es requerido");
      } else {
        errores.push("El nombre no puede tener más de 100 caracteres");
      }
    }

    // Validar descripción (opcional)
    if (!RolHelpers.validarDescripcion(data.descripcion)) {
      errores.push("La descripción no puede tener más de 255 caracteres");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  },

  /**
   * 📊 Filtrar roles por búsqueda (cliente-side)
   * @param roles - Array de roles
   * @param busqueda - Término de búsqueda
   * @returns Rol[] - Roles filtrados
   * @description Busca en nombre y descripción (case-insensitive)
   *
   * @example
   * const resultados = RolHelpers.filtrarRoles(roles, "admin");
   * // Retorna roles que contengan "admin" en nombre o descripción
   */
  filtrarRoles: (roles: Rol[], busqueda: string): Rol[] => {
    if (!busqueda || busqueda.trim() === "") return roles;

    const termino = busqueda.toLowerCase().trim();

    return roles.filter((rol) => {
      const nombre = (rol.nombre || "").toLowerCase();
      const descripcion = (rol.descripcion || "").toLowerCase();

      return nombre.includes(termino) || descripcion.includes(termino);
    });
  },

  /**
   * 📊 Ordenar roles por nombre alfabéticamente
   * @param roles - Array de roles
   * @param ascendente - true para A-Z, false para Z-A
   * @returns Rol[] - Roles ordenados
   *
   * @example
   * const ordenados = RolHelpers.ordenarPorNombre(roles, true);
   * // ["Administrador", "Cliente", "Vendedor"]
   */
  ordenarPorNombre: (roles: Rol[], ascendente: boolean = true): Rol[] => {
    return [...roles].sort((a, b) => {
      const nombreA = (a.nombre || "").toLowerCase();
      const nombreB = (b.nombre || "").toLowerCase();

      if (ascendente) {
        return nombreA.localeCompare(nombreB);
      } else {
        return nombreB.localeCompare(nombreA);
      }
    });
  },

  /**
   * 🔄 Normalizar datos de rol del servidor
   * @param rol - Rol recibido del servidor
   * @returns Rol - Rol con valores por defecto aplicados
   * @description Asegura que los campos opcionales tengan valores por defecto
   *
   * @example
   * const rolNormalizado = RolHelpers.normalizarRol(rolDelServidor);
   */
  normalizarRol: (rol: Rol): Rol => {
    return {
      ...rol,
      descripcion: rol.descripcion || "",
    };
  },
};

// ============================================================
// 🚨 MANEJO DE ERRORES
// ============================================================

/**
 * Extrae y formatea mensajes de error de las respuestas de la API
 * @param error - Error capturado
 * @returns string - Mensaje de error legible para el usuario
 *
 * @description Maneja diferentes formatos de error del backend:
 * - Errores con error.response.data.error
 * - Errores con error.response.data.nombre[0]
 * - Errores con error.message
 * - Errores desconocidos
 */
export const manejarErrorRol = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      response?: {
        data?: {
          error?: string;
          nombre?: string[];
          descripcion?: string[];
          detail?: string;
        };
        status?: number;
      };
      message?: string;
    };

    // Error con mensaje específico del servidor
    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    // Error de validación en campo nombre
    if (err.response?.data?.nombre && Array.isArray(err.response.data.nombre)) {
      return `Nombre: ${err.response.data.nombre[0]}`;
    }

    // Error de validación en campo descripcion
    if (
      err.response?.data?.descripcion &&
      Array.isArray(err.response.data.descripcion)
    ) {
      return `Descripción: ${err.response.data.descripcion[0]}`;
    }

    // Error de detalle genérico
    if (err.response?.data?.detail) {
      return err.response.data.detail;
    }

    // Error de autenticación
    if (err.response?.status === 401) {
      return "No tiene permisos para realizar esta acción. Inicie sesión nuevamente.";
    }

    // Error 404
    if (err.response?.status === 404) {
      return "Rol no encontrado";
    }

    // Mensaje de error genérico
    if (err.message) {
      return err.message;
    }
  }

  return "Error desconocido al procesar la solicitud de roles";
};

// ============================================================
// 📤 EXPORTACIÓN POR DEFECTO
// ============================================================

export default RolService;
