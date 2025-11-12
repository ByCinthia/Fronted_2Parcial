/* ============================================================ */
/* 📦 SERVICIO DE PROVEEDORES */
/* ============================================================ */
/* Servicio para gestionar operaciones CRUD de proveedores */
/* Incluye validaciones, helpers y manejo de errores */
/* ============================================================ */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";

/* ============================================================ */
/* 📋 INTERFACES Y TIPOS */
/* ============================================================ */

/**
 * Interface del Proveedor - Modelo completo
 */
export interface Proveedor {
  idProveedor: number;
  nombre: string;
  telefono: string;
  email: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

/**
 * Interface para crear un nuevo proveedor
 */
export interface ProveedorCreateData {
  nombre: string;
  telefono?: string;
  email?: string;
}

/**
 * Interface para actualizar proveedor (completo)
 */
export interface ProveedorUpdateData {
  nombre: string;
  telefono?: string;
  email?: string;
}

/**
 * Interface para actualización parcial
 */
export interface ProveedorPatchData {
  nombre?: string;
  telefono?: string;
  email?: string;
}

/**
 * Interface de respuesta de eliminación
 */
export interface ProveedorDeleteResponse {
  mensaje: string;
}

/**
 * Interface de respuesta de error
 */
export interface ProveedorErrorResponse {
  error: string;
  [key: string]: string | string[] | unknown; // Para errores de validación de campos específicos
}

/* ============================================================ */
/* 🔧 CLASE DE SERVICIO PRINCIPAL */
/* ============================================================ */

/**
 * Servicio para gestionar proveedores
 * Maneja todas las operaciones CRUD con el backend
 */
class ProveedorService {
  private readonly baseURL = "/api/compras/proveedores";

  /**
   * 1. Obtener listado completo de proveedores
   * @returns Promise con array de proveedores
   * @throws Error si falla la petición
   */
  async listarProveedores(): Promise<Proveedor[]> {
    try {
      const data = await apiGet<Proveedor[]>(`${this.baseURL}/`);
      return data;
    } catch (error: unknown) {
      console.error("❌ Error al listar proveedores:", error);
      const err = error as { status?: number; data?: { error?: string } };
      throw new Error(
        err.data?.error || "Error al obtener listado de proveedores"
      );
    }
  }

  /**
   * 2. Crear un nuevo proveedor
   * @param data Datos del proveedor a crear
   * @returns Promise con el proveedor creado
   * @throws Error si falla la validación o creación
   */
  async crearProveedor(data: ProveedorCreateData): Promise<Proveedor> {
    try {
      // Validación básica antes de enviar
      if (!data.nombre || data.nombre.trim() === "") {
        throw new Error("El nombre del proveedor es requerido");
      }

      const result = await apiPost<Proveedor>(`${this.baseURL}/`, data);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error al crear proveedor:", error);
      const err = error as {
        status?: number;
        data?: Record<string, unknown> & { error?: string };
      };

      // Manejo de errores de validación del backend
      if (err.status === 400 && err.data) {
        const errorMessages = Object.entries(err.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(", ");
        throw new Error(errorMessages || "Error de validación");
      }

      throw new Error(err.data?.error || "Error al crear proveedor");
    }
  }

  /**
   * 3. Buscar proveedores por nombre o email
   * @param query Texto a buscar
   * @returns Promise con array de proveedores encontrados
   * @throws Error si falla la búsqueda
   */
  async buscarProveedores(query: string): Promise<Proveedor[]> {
    try {
      if (!query || query.trim() === "") {
        throw new Error("El parámetro de búsqueda 'q' es requerido");
      }

      const data = await apiGet<Proveedor[]>(
        `${this.baseURL}/buscar/?q=${encodeURIComponent(query.trim())}`
      );
      return data;
    } catch (error: unknown) {
      console.error("❌ Error al buscar proveedores:", error);
      const err = error as { status?: number; data?: { error?: string } };
      throw new Error(err.data?.error || "Error al buscar proveedores");
    }
  }

  /**
   * 4. Obtener un proveedor por ID
   * @param id ID del proveedor
   * @returns Promise con el proveedor encontrado
   * @throws Error si no existe o falla la petición
   */
  async obtenerProveedor(id: number): Promise<Proveedor> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de proveedor inválido");
      }

      const data = await apiGet<Proveedor>(`${this.baseURL}/${id}/`);
      return data;
    } catch (error: unknown) {
      console.error(`❌ Error al obtener proveedor ${id}:`, error);
      const err = error as { status?: number; data?: { error?: string } };

      if (err.status === 404) {
        throw new Error("Proveedor no encontrado");
      }

      throw new Error(err.data?.error || "Error al obtener proveedor");
    }
  }

  /**
   * 5. Actualizar proveedor completo (PUT)
   * @param id ID del proveedor
   * @param data Datos completos del proveedor
   * @returns Promise con el proveedor actualizado
   * @throws Error si falla la validación o actualización
   */
  async actualizarProveedor(
    id: number,
    data: ProveedorUpdateData
  ): Promise<Proveedor> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de proveedor inválido");
      }

      if (!data.nombre || data.nombre.trim() === "") {
        throw new Error("El nombre del proveedor es requerido");
      }

      const result = await apiPut<Proveedor>(`${this.baseURL}/${id}/`, data);
      return result;
    } catch (error: unknown) {
      console.error(`❌ Error al actualizar proveedor ${id}:`, error);
      const err = error as {
        status?: number;
        data?: Record<string, unknown> & { error?: string };
      };

      if (err.status === 404) {
        throw new Error("Proveedor no encontrado");
      }

      if (err.status === 400 && err.data) {
        const errorMessages = Object.entries(err.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(", ");
        throw new Error(errorMessages || "Error de validación");
      }

      throw new Error(err.data?.error || "Error al actualizar proveedor");
    }
  }

  /**
   * 6. Actualizar proveedor parcialmente (PATCH)
   * @param id ID del proveedor
   * @param data Datos parciales a actualizar
   * @returns Promise con el proveedor actualizado
   * @throws Error si falla la validación o actualización
   */
  async actualizarProveedorParcial(
    id: number,
    data: ProveedorPatchData
  ): Promise<Proveedor> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de proveedor inválido");
      }

      if (Object.keys(data).length === 0) {
        throw new Error("Debe proporcionar al menos un campo para actualizar");
      }

      const result = await apiPatch<Proveedor>(`${this.baseURL}/${id}/`, data);
      return result;
    } catch (error: unknown) {
      console.error(
        `❌ Error al actualizar parcialmente proveedor ${id}:`,
        error
      );
      const err = error as {
        status?: number;
        data?: Record<string, unknown> & { error?: string };
      };

      if (err.status === 404) {
        throw new Error("Proveedor no encontrado");
      }

      if (err.status === 400 && err.data) {
        const errorMessages = Object.entries(err.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(", ");
        throw new Error(errorMessages || "Error de validación");
      }

      throw new Error(err.data?.error || "Error al actualizar proveedor");
    }
  }

  /**
   * 7. Eliminar un proveedor
   * @param id ID del proveedor
   * @returns Promise con mensaje de confirmación
   * @throws Error si el proveedor tiene compras asociadas o no existe
   */
  async eliminarProveedor(id: number): Promise<ProveedorDeleteResponse> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de proveedor inválido");
      }

      const data = await apiDelete<ProveedorDeleteResponse>(
        `${this.baseURL}/${id}/`
      );
      return data;
    } catch (error: unknown) {
      console.error(`❌ Error al eliminar proveedor ${id}:`, error);
      const err = error as { status?: number; data?: { error?: string } };

      if (err.status === 404) {
        throw new Error("Proveedor no encontrado");
      }

      if (err.status === 400) {
        throw new Error(
          err.data?.error ||
            "No se puede eliminar el proveedor porque tiene compras asociadas"
        );
      }

      throw new Error(err.data?.error || "Error al eliminar proveedor");
    }
  }
}

/* ============================================================ */
/* 🛠️ HELPERS Y UTILIDADES */
/* ============================================================ */

/**
 * Clase con métodos de ayuda para proveedores
 */
export class ProveedorHelpers {
  /**
   * Valida formato de email
   */
  static validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida formato de teléfono (permite varios formatos)
   */
  static validarTelefono(telefono: string): boolean {
    // Acepta formatos: 555-1234, (555) 1234, 5551234, +52 555 1234, etc.
    const telefonoRegex = /^[\d\s\-()+ ]+$/;
    return telefonoRegex.test(telefono) && telefono.length >= 7;
  }

  /**
   * Formatea nombre (capitaliza primera letra de cada palabra)
   */
  static formatearNombre(nombre: string): string {
    return nombre
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Valida datos de proveedor antes de crear/actualizar
   */
  static validarDatosProveedor(
    data: ProveedorCreateData | ProveedorUpdateData
  ): {
    valido: boolean;
    errores: string[];
  } {
    const errores: string[] = [];

    // Validar nombre
    if (!data.nombre || data.nombre.trim() === "") {
      errores.push("El nombre es requerido");
    } else if (data.nombre.length > 200) {
      errores.push("El nombre no puede exceder 200 caracteres");
    }

    // Validar email (opcional)
    if (data.email) {
      if (!this.validarEmail(data.email)) {
        errores.push("El formato del email es inválido");
      } else if (data.email.length > 255) {
        errores.push("El email no puede exceder 255 caracteres");
      }
    }

    // Validar teléfono (opcional)
    if (data.telefono) {
      if (!this.validarTelefono(data.telefono)) {
        errores.push("El formato del teléfono es inválido");
      } else if (data.telefono.length > 20) {
        errores.push("El teléfono no puede exceder 20 caracteres");
      }
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  /**
   * Formatea fecha ISO a formato legible
   */
  static formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Obtiene las iniciales del proveedor para avatares
   */
  static obtenerIniciales(nombre: string): string {
    return nombre
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Genera información de contacto formateada
   */
  static formatearContacto(proveedor: Proveedor): string {
    const partes = [];

    if (proveedor.telefono) {
      partes.push(`Tel: ${proveedor.telefono}`);
    }

    if (proveedor.email) {
      partes.push(`Email: ${proveedor.email}`);
    }

    return partes.join(" | ") || "Sin información de contacto";
  }

  /**
   * Filtra proveedores por término de búsqueda (local)
   */
  static filtrarProveedoresLocal(
    proveedores: Proveedor[],
    termino: string
  ): Proveedor[] {
    const terminoLower = termino.toLowerCase().trim();

    if (!terminoLower) return proveedores;

    return proveedores.filter(
      (p) =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.email?.toLowerCase().includes(terminoLower) ||
        p.telefono?.includes(terminoLower)
    );
  }

  /**
   * Ordena proveedores por nombre alfabéticamente
   */
  static ordenarPorNombre(proveedores: Proveedor[]): Proveedor[] {
    return [...proveedores].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );
  }

  /**
   * Ordena proveedores por fecha de creación (más recientes primero)
   */
  static ordenarPorFechaCreacion(proveedores: Proveedor[]): Proveedor[] {
    return [...proveedores].sort(
      (a, b) =>
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
    );
  }

  /**
   * Verifica si un proveedor tiene información de contacto completa
   */
  static tieneContactoCompleto(proveedor: Proveedor): boolean {
    return !!(proveedor.telefono && proveedor.email);
  }

  /**
   * Genera un resumen del proveedor para mostrar en cards
   */
  static generarResumen(proveedor: Proveedor): {
    titulo: string;
    subtitulo: string;
    contacto: string;
    iniciales: string;
  } {
    return {
      titulo: proveedor.nombre,
      subtitulo: `Proveedor #${proveedor.idProveedor}`,
      contacto: this.formatearContacto(proveedor),
      iniciales: this.obtenerIniciales(proveedor.nombre),
    };
  }
}

/* ============================================================ */
/* 📤 EXPORTACIÓN */
/* ============================================================ */

// Instancia única del servicio (Singleton pattern)
export const proveedorService = new ProveedorService();

// Exportar también la clase por si se necesita crear instancias personalizadas
export default ProveedorService;
