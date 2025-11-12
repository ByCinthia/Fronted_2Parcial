// ============================================================
// 📁 SERVICIO DE CATEGORÍAS
// ============================================================
// Servicio completo para gestión de categorías de productos
// con métodos CRUD, helpers de utilidad y manejo de errores
// ============================================================

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";

// ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================

/**
 * Interfaz principal del modelo Categoría
 */
export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

/**
 * DTO para crear una nueva categoría
 * El idCategoria se genera automáticamente en el backend
 */
export interface CrearCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para actualizar una categoría completamente (PUT)
 * Requiere todos los campos
 */
export interface ActualizarCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para actualizar una categoría parcialmente (PATCH)
 * Todos los campos son opcionales
 */
export interface ActualizarCategoriaParcialDTO {
  nombre?: string;
  descripcion?: string;
}

/**
 * Respuesta de eliminación exitosa
 */
export interface EliminarCategoriaResponse {
  mensaje: string;
}

// ============================================================
// 🔧 SERVICIO DE CATEGORÍAS
// ============================================================

export const CategoriaService = {
  /**
   * 📋 Listar todas las categorías
   * @returns Promise<Categoria[]>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/categorias/
   * @description Obtiene listado completo de categorías ordenadas
   *
   * @example
   * const categorias = await CategoriaService.listar();
   * console.log(categorias); // [{ idCategoria: 1, nombre: "Electrónica", ... }]
   */
  listar: async (): Promise<Categoria[]> => {
    try {
      const response = await apiGet<Categoria[]>("/api/productos/categorias/");
      console.log("✅ Categorías obtenidas:", response);
      return response;
    } catch (error) {
      console.error("❌ Error al listar categorías:", error);
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * ➕ Crear una nueva categoría
   * @param data - Datos de la categoría a crear (nombre requerido, descripcion opcional)
   * @returns Promise<Categoria>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint POST /api/productos/categorias/
   * @description Crea una nueva categoría. El nombre debe ser único.
   *
   * @example
   * const nuevaCategoria = await CategoriaService.crear({
   *   nombre: "Ropa",
   *   descripcion: "Prendas de vestir"
   * });
   * console.log(nuevaCategoria.idCategoria); // 2
   */
  crear: async (data: CrearCategoriaDTO): Promise<Categoria> => {
    try {
      console.log("📤 Creando categoría con datos:", data);
      const response = await apiPost<Categoria>(
        "/api/productos/categorias/",
        data
      );
      console.log("✅ Categoría creada exitosamente:", response);
      return response;
    } catch (error) {
      console.error("❌ Error al crear categoría:", error);
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * 🔍 Obtener una categoría por ID
   * @param id - ID de la categoría a obtener
   * @returns Promise<Categoria>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/categorias/{id}/
   * @description Obtiene los detalles completos de una categoría específica
   *
   * @example
   * const categoria = await CategoriaService.obtenerPorId(1);
   * console.log(categoria.nombre); // "Electrónica"
   */
  obtenerPorId: async (id: number): Promise<Categoria> => {
    try {
      const response = await apiGet<Categoria>(
        `/api/productos/categorias/${id}/`
      );
      console.log("✅ Categoría obtenida:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al obtener categoría con ID ${id}:`, error);
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * ✏️ Actualizar una categoría completamente (PUT)
   * @param id - ID de la categoría a actualizar
   * @param data - Datos completos de la categoría (requiere nombre)
   * @returns Promise<Categoria>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PUT /api/productos/categorias/{id}/
   * @description Actualiza todos los campos de la categoría. Requiere enviar todos los datos.
   *
   * @example
   * const categoriaActualizada = await CategoriaService.actualizar(1, {
   *   nombre: "Electrónica Avanzada",
   *   descripcion: "Productos electrónicos de alta gama"
   * });
   */
  actualizar: async (
    id: number,
    data: ActualizarCategoriaDTO
  ): Promise<Categoria> => {
    try {
      console.log(`📤 Actualizando categoría ${id} con datos:`, data);
      const response = await apiPut<Categoria>(
        `/api/productos/categorias/${id}/`,
        data
      );
      console.log("✅ Categoría actualizada exitosamente:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al actualizar categoría ${id}:`, error);
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * 📝 Actualizar una categoría parcialmente (PATCH)
   * @param id - ID de la categoría a actualizar
   * @param data - Datos parciales de la categoría (solo los campos a cambiar)
   * @returns Promise<Categoria>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PATCH /api/productos/categorias/{id}/
   * @description Actualiza solo los campos enviados. Más flexible que PUT.
   *
   * @example
   * // Actualizar solo la descripción
   * const categoriaActualizada = await CategoriaService.actualizarParcial(1, {
   *   descripcion: "Nueva descripción"
   * });
   *
   * // Actualizar solo el nombre
   * const categoriaActualizada2 = await CategoriaService.actualizarParcial(2, {
   *   nombre: "Tecnología"
   * });
   */
  actualizarParcial: async (
    id: number,
    data: ActualizarCategoriaParcialDTO
  ): Promise<Categoria> => {
    try {
      console.log(
        `📤 Actualizando parcialmente categoría ${id} con datos:`,
        data
      );
      const response = await apiPatch<Categoria>(
        `/api/productos/categorias/${id}/`,
        data
      );
      console.log("✅ Categoría actualizada parcialmente:", response);
      return response;
    } catch (error) {
      console.error(
        `❌ Error al actualizar parcialmente categoría ${id}:`,
        error
      );
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * 🗑️ Eliminar una categoría permanentemente
   * @param id - ID de la categoría a eliminar
   * @returns Promise<EliminarCategoriaResponse>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint DELETE /api/productos/categorias/{id}/
   * @description Elimina permanentemente una categoría (hard delete).
   *              ⚠️ NO se puede eliminar si tiene productos asociados.
   *
   * @throws Error si la categoría tiene productos asociados
   * @throws Error si la categoría no existe
   *
   * @example
   * try {
   *   const response = await CategoriaService.eliminar(3);
   *   console.log(response.mensaje); // "Categoría eliminada correctamente"
   * } catch (error) {
   *   console.error(error.message); // "No se puede eliminar la categoría porque tiene productos asociados"
   * }
   */
  eliminar: async (id: number): Promise<EliminarCategoriaResponse> => {
    try {
      console.log(`🗑️ Eliminando categoría ${id}...`);
      const response = await apiDelete<EliminarCategoriaResponse>(
        `/api/productos/categorias/${id}/`
      );
      console.log("✅ Categoría eliminada exitosamente:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al eliminar categoría ${id}:`, error);
      throw new Error(manejarErrorCategoria(error));
    }
  },

  /**
   * 🔎 Buscar una categoría por nombre
   * @param nombre - Nombre de la categoría a buscar (case-insensitive)
   * @returns Promise<Categoria>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/categorias/buscar/?nombre={nombre}
   * @description Busca una categoría por nombre. La búsqueda es case-insensitive.
   *
   * @throws Error si no se proporciona el nombre
   * @throws Error si no se encuentra la categoría
   *
   * @example
   * const electronica = await CategoriaService.buscarPorNombre("Electrónica");
   * console.log(electronica.idCategoria); // 1
   *
   * const ropa = await CategoriaService.buscarPorNombre("ropa"); // case-insensitive
   * console.log(ropa.descripcion); // "Prendas de vestir"
   */
  buscarPorNombre: async (nombre: string): Promise<Categoria> => {
    try {
      if (!nombre || nombre.trim() === "") {
        throw new Error("Debe proporcionar un nombre para buscar");
      }

      console.log(`🔍 Buscando categoría con nombre: "${nombre}"`);
      const encodedNombre = encodeURIComponent(nombre);
      const response = await apiGet<Categoria>(
        `/api/productos/categorias/buscar/?nombre=${encodedNombre}`
      );
      console.log("✅ Categoría encontrada:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error al buscar categoría "${nombre}":`, error);
      throw new Error(manejarErrorCategoria(error));
    }
  },
};

// ============================================================
// 🛠️ HELPERS DE UTILIDAD
// ============================================================

export const CategoriaHelpers = {
  /**
   * 📝 Obtener nombre de la categoría de forma segura
   * @param categoria - Objeto categoría (puede ser null/undefined)
   * @returns string - Nombre de la categoría o texto por defecto
   *
   * @example
   * CategoriaHelpers.obtenerNombre(categoria); // "Electrónica"
   * CategoriaHelpers.obtenerNombre(null); // "Sin categoría"
   */
  obtenerNombre: (categoria: Categoria | null | undefined): string => {
    if (!categoria) return "Sin categoría";
    return categoria.nombre || "Categoría sin nombre";
  },

  /**
   * 📝 Obtener descripción de la categoría de forma segura
   * @param categoria - Objeto categoría (puede ser null/undefined)
   * @returns string - Descripción de la categoría o texto por defecto
   *
   * @example
   * CategoriaHelpers.obtenerDescripcion(categoria); // "Productos electrónicos"
   * CategoriaHelpers.obtenerDescripcion(null); // "Sin descripción"
   */
  obtenerDescripcion: (categoria: Categoria | null | undefined): string => {
    if (!categoria) return "Sin descripción";
    return categoria.descripcion || "Sin descripción";
  },

  /**
   * 🔤 Obtener iniciales del nombre de la categoría
   * @param nombre - Nombre de la categoría
   * @returns string - Iniciales (máximo 2 caracteres)
   *
   * @example
   * CategoriaHelpers.obtenerIniciales("Electrónica"); // "EL"
   * CategoriaHelpers.obtenerIniciales("Ropa Deportiva"); // "RD"
   * CategoriaHelpers.obtenerIniciales("Hogar"); // "HO"
   * CategoriaHelpers.obtenerIniciales(""); // "??"
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
   * 🔤 Obtener iniciales de un objeto Categoría de forma segura
   * @param categoria - Objeto categoría (puede ser null/undefined)
   * @returns string - Iniciales de la categoría
   *
   * @example
   * CategoriaHelpers.obtenerInicialesCategoria(categoria); // "EL"
   * CategoriaHelpers.obtenerInicialesCategoria(null); // "??"
   */
  obtenerInicialesCategoria: (
    categoria: Categoria | null | undefined
  ): string => {
    if (!categoria) return "??";
    return CategoriaHelpers.obtenerIniciales(categoria.nombre);
  },

  /**
   * 🎨 Obtener color asociado a la categoría
   * @param nombreCategoria - Nombre de la categoría
   * @returns string - Código de color hexadecimal
   * @description Asigna colores distintivos a categorías comunes
   *
   * @example
   * CategoriaHelpers.obtenerColorCategoria("Electrónica"); // "#610C27" (wine)
   * CategoriaHelpers.obtenerColorCategoria("Ropa"); // "#AC9C8D" (beige)
   * CategoriaHelpers.obtenerColorCategoria("Alimentos"); // "#d4af37" (gold)
   */
  obtenerColorCategoria: (
    nombreCategoria: string | null | undefined
  ): string => {
    if (!nombreCategoria) return "#999999"; // Gris por defecto

    const nombre = nombreCategoria.toLowerCase();

    // Electrónica/Tecnología -> Wine (rojo vino)
    if (
      nombre.includes("electr") ||
      nombre.includes("tecnolog") ||
      nombre.includes("informát") ||
      nombre.includes("comput")
    ) {
      return "#610C27"; // --wine
    }

    // Alimentos/Bebidas -> Gold (dorado)
    if (
      nombre.includes("aliment") ||
      nombre.includes("comida") ||
      nombre.includes("bebida") ||
      nombre.includes("restaurante")
    ) {
      return "#d4af37"; // --gold
    }

    // Ropa/Moda/Calzado -> Beige
    if (
      nombre.includes("ropa") ||
      nombre.includes("moda") ||
      nombre.includes("vest") ||
      nombre.includes("calzado") ||
      nombre.includes("zapato")
    ) {
      return "#AC9C8D"; // --beige
    }

    // Hogar/Muebles/Decoración -> Soft Pink
    if (
      nombre.includes("hogar") ||
      nombre.includes("mueble") ||
      nombre.includes("decorac") ||
      nombre.includes("casa")
    ) {
      return "#E3C1B4"; // --soft-pink
    }

    // Deportes/Fitness -> Verde
    if (
      nombre.includes("deport") ||
      nombre.includes("fitness") ||
      nombre.includes("gym") ||
      nombre.includes("ejercicio")
    ) {
      return "#2ecc71"; // Verde
    }

    // Libros/Educación -> Azul
    if (
      nombre.includes("libro") ||
      nombre.includes("educac") ||
      nombre.includes("escolar") ||
      nombre.includes("estudio")
    ) {
      return "#3498db"; // Azul
    }

    // Juguetes/Niños -> Rosa
    if (
      nombre.includes("juguete") ||
      nombre.includes("niño") ||
      nombre.includes("infantil") ||
      nombre.includes("bebé")
    ) {
      return "#e91e63"; // Rosa
    }

    // Salud/Belleza -> Púrpura
    if (
      nombre.includes("salud") ||
      nombre.includes("belleza") ||
      nombre.includes("cosmétic") ||
      nombre.includes("farmac")
    ) {
      return "#9b59b6"; // Púrpura
    }

    // Por defecto -> Gris
    return "#999999";
  },

  /**
   * 📅 Formatear fecha de creación/modificación
   * @param fecha - String de fecha en formato ISO
   * @returns string - Fecha formateada o texto por defecto
   *
   * @example
   * CategoriaHelpers.formatearFecha("2025-11-11T10:00:00Z"); // "11/11/2025 10:00"
   * CategoriaHelpers.formatearFecha(null); // "Fecha no disponible"
   */
  formatearFecha: (fecha: string | null | undefined): string => {
    if (!fecha) return "Fecha no disponible";

    try {
      const date = new Date(fecha);
      const dia = date.getDate().toString().padStart(2, "0");
      const mes = (date.getMonth() + 1).toString().padStart(2, "0");
      const año = date.getFullYear();
      const hora = date.getHours().toString().padStart(2, "0");
      const minutos = date.getMinutes().toString().padStart(2, "0");

      return `${dia}/${mes}/${año} ${hora}:${minutos}`;
    } catch {
      return "Fecha inválida";
    }
  },

  /**
   * ✅ Validar nombre de categoría
   * @param nombre - Nombre de la categoría a validar
   * @returns boolean - true si es válido
   * @description Verifica que el nombre no esté vacío y tenga máximo 100 caracteres
   *
   * @example
   * CategoriaHelpers.validarNombre("Electrónica"); // true
   * CategoriaHelpers.validarNombre(""); // false
   * CategoriaHelpers.validarNombre("a".repeat(101)); // false
   */
  validarNombre: (nombre: string | null | undefined): boolean => {
    if (!nombre || nombre.trim() === "") return false;
    if (nombre.trim().length > 100) return false;
    return true;
  },

  /**
   * ✅ Validar descripción de categoría
   * @param descripcion - Descripción de la categoría a validar
   * @returns boolean - true si es válida (o está vacía)
   * @description Verifica que la descripción tenga máximo 255 caracteres
   *
   * @example
   * CategoriaHelpers.validarDescripcion("Productos electrónicos"); // true
   * CategoriaHelpers.validarDescripcion(""); // true (es opcional)
   * CategoriaHelpers.validarDescripcion("a".repeat(256)); // false
   */
  validarDescripcion: (descripcion: string | null | undefined): boolean => {
    if (!descripcion || descripcion.trim() === "") return true; // Opcional
    if (descripcion.trim().length > 255) return false;
    return true;
  },

  /**
   * 🔢 Validar datos completos para crear/actualizar categoría
   * @param data - Datos de la categoría a validar
   * @returns object - { valido: boolean, errores: string[] }
   * @description Valida todos los campos según las reglas del backend
   *
   * @example
   * const validacion = CategoriaHelpers.validarDatosCategoria({
   *   nombre: "Electrónica",
   *   descripcion: "Productos electrónicos"
   * });
   * console.log(validacion); // { valido: true, errores: [] }
   */
  validarDatosCategoria: (
    data: CrearCategoriaDTO | ActualizarCategoriaDTO
  ): { valido: boolean; errores: string[] } => {
    const errores: string[] = [];

    // Validar nombre (requerido)
    if (!CategoriaHelpers.validarNombre(data.nombre)) {
      if (!data.nombre || data.nombre.trim() === "") {
        errores.push("El nombre es requerido");
      } else {
        errores.push("El nombre no puede tener más de 100 caracteres");
      }
    }

    // Validar descripción (opcional)
    if (!CategoriaHelpers.validarDescripcion(data.descripcion)) {
      errores.push("La descripción no puede tener más de 255 caracteres");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  },

  /**
   * 📊 Filtrar categorías por búsqueda (cliente-side)
   * @param categorias - Array de categorías
   * @param busqueda - Término de búsqueda
   * @returns Categoria[] - Categorías filtradas
   * @description Busca en nombre y descripción (case-insensitive)
   *
   * @example
   * const resultados = CategoriaHelpers.filtrarCategorias(categorias, "electr");
   * // Retorna categorías que contengan "electr" en nombre o descripción
   */
  filtrarCategorias: (
    categorias: Categoria[],
    busqueda: string
  ): Categoria[] => {
    if (!busqueda || busqueda.trim() === "") return categorias;

    const termino = busqueda.toLowerCase().trim();

    return categorias.filter((categoria) => {
      const nombre = (categoria.nombre || "").toLowerCase();
      const descripcion = (categoria.descripcion || "").toLowerCase();

      return nombre.includes(termino) || descripcion.includes(termino);
    });
  },

  /**
   * 📊 Ordenar categorías por nombre alfabéticamente
   * @param categorias - Array de categorías
   * @param ascendente - true para A-Z, false para Z-A
   * @returns Categoria[] - Categorías ordenadas
   *
   * @example
   * const ordenadas = CategoriaHelpers.ordenarPorNombre(categorias, true);
   * // ["Alimentos", "Electrónica", "Ropa"]
   */
  ordenarPorNombre: (
    categorias: Categoria[],
    ascendente: boolean = true
  ): Categoria[] => {
    return [...categorias].sort((a, b) => {
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
   * 📊 Ordenar categorías por fecha de creación
   * @param categorias - Array de categorías
   * @param ascendente - true para más antiguas primero, false para más recientes primero
   * @returns Categoria[] - Categorías ordenadas
   *
   * @example
   * const ordenadas = CategoriaHelpers.ordenarPorFecha(categorias, false);
   * // Más recientes primero
   */
  ordenarPorFecha: (
    categorias: Categoria[],
    ascendente: boolean = false
  ): Categoria[] => {
    return [...categorias].sort((a, b) => {
      const fechaA = a.fecha_creacion
        ? new Date(a.fecha_creacion).getTime()
        : 0;
      const fechaB = b.fecha_creacion
        ? new Date(b.fecha_creacion).getTime()
        : 0;

      if (ascendente) {
        return fechaA - fechaB;
      } else {
        return fechaB - fechaA;
      }
    });
  },

  /**
   * 🔄 Normalizar datos de categoría del servidor
   * @param categoria - Categoría recibida del servidor
   * @returns Categoria - Categoría con valores por defecto aplicados
   * @description Asegura que los campos opcionales tengan valores por defecto
   *
   * @example
   * const categoriaNormalizada = CategoriaHelpers.normalizarCategoria(categoriaDelServidor);
   */
  normalizarCategoria: (categoria: Categoria): Categoria => {
    return {
      ...categoria,
      descripcion: categoria.descripcion || "",
      fecha_creacion: categoria.fecha_creacion || "",
      fecha_modificacion: categoria.fecha_modificacion || "",
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
export const manejarErrorCategoria = (error: unknown): string => {
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
      return "Categoría no encontrada";
    }

    // Mensaje de error genérico
    if (err.message) {
      return err.message;
    }
  }

  return "Error desconocido al procesar la solicitud de categorías";
};

// ============================================================
// 📤 EXPORTACIÓN POR DEFECTO
// ============================================================

export default CategoriaService;
