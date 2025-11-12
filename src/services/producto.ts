// ============================================================
// 📦 SERVICIO DE PRODUCTOS
// ============================================================
// Servicio completo para gestión de productos
// con métodos CRUD, manejo de imágenes, stock y helpers
// ============================================================

import { apiGet, apiPatch, apiDelete } from "./api";

// ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================

/**
 * Interfaz de Categoría (referencia dentro de Producto)
 */
export interface CategoriaRef {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

/**
 * Interfaz principal del modelo Producto
 */
export interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen?: string | null;
  imagen_url?: string | null;
  categoria: CategoriaRef;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

/**
 * DTO para crear un nuevo producto
 * Se usa FormData para soportar subida de imágenes
 */
export interface CrearProductoDTO {
  nombre: string;
  precio: number;
  stock: number;
  idCategoria: number;
  imagen?: File | null;
}

/**
 * DTO para actualizar un producto completamente (PUT)
 * Requiere todos los campos principales
 */
export interface ActualizarProductoDTO {
  nombre: string;
  precio: number;
  stock: number;
  idCategoria: number;
  imagen?: File | null;
}

/**
 * DTO para actualizar un producto parcialmente (PATCH)
 * Todos los campos son opcionales
 */
export interface ActualizarProductoParcialDTO {
  nombre?: string;
  precio?: number;
  stock?: number;
  idCategoria?: number;
  imagen?: File | null;
}

/**
 * DTO para actualizar stock de forma específica
 */
export interface ActualizarStockDTO {
  cantidad: number; // Positivo: incrementa, Negativo: decrementa
}

/**
 * Respuesta de eliminación exitosa
 */
export interface EliminarProductoResponse {
  mensaje: string;
}

// ============================================================
// 🔧 SERVICIO DE PRODUCTOS
// ============================================================

export const ProductoService = {
  /**
   * 📋 Listar todos los productos
   * @returns Promise<Producto[]>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/
   * @description Obtiene listado completo de productos con sus categorías
   *
   * @example
   * const productos = await ProductoService.listar();
   * console.log(productos); // [{ idProducto: 1, nombre: "Laptop HP", ... }]
   */
  listar: async (): Promise<Producto[]> => {
    try {
      const response = await apiGet("/api/productos/");
      return response as Producto[];
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * ➕ Crear un nuevo producto
   * @param data - Datos del producto a crear (incluye imagen opcional)
   * @returns Promise<Producto>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint POST /api/productos/
   * @description Crea un nuevo producto. Soporta subida de imagen (multipart/form-data)
   *
   * @example
   * const nuevoProducto = await ProductoService.crear({
   *   nombre: "Laptop HP",
   *   precio: 5000,
   *   stock: 10,
   *   idCategoria: 1,
   *   imagen: archivoImagen // File object
   * });
   * console.log(nuevoProducto.idProducto); // 2
   */
  crear: async (data: CrearProductoDTO): Promise<Producto> => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("precio", data.precio.toString());
      formData.append("stock", data.stock.toString());
      formData.append("idCategoria", data.idCategoria.toString());

      if (data.imagen) {
        formData.append("imagen", data.imagen);
      }

      // Usar fetch directamente para FormData
      const token = localStorage.getItem("auth_token");
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const response = await fetch(`${BASE_URL}/api/productos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type, FormData lo hace automáticamente
        },
        body: formData,
      });

      const text = await response.text();
      const responseData = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw { status: response.status, data: responseData };
      }

      return responseData as Producto;
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 🔍 Obtener un producto por ID
   * @param id - ID del producto a obtener
   * @returns Promise<Producto>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/{id}/
   * @description Obtiene los detalles completos de un producto específico
   *
   * @example
   * const producto = await ProductoService.obtenerPorId(1);
   * console.log(producto.nombre); // "Laptop HP"
   */
  obtenerPorId: async (id: number): Promise<Producto> => {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de producto inválido");
      }

      const response = await apiGet(`/api/productos/${id}/`);
      return response as Producto;
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * ✏️ Actualizar un producto completamente (PUT)
   * @param id - ID del producto a actualizar
   * @param data - Datos completos del producto (requiere todos los campos)
   * @returns Promise<Producto>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PUT /api/productos/{id}/
   * @description Actualiza todos los campos del producto. Soporta actualización de imagen.
   *
   * @example
   * const productoActualizado = await ProductoService.actualizar(1, {
   *   nombre: "Laptop HP Pavilion",
   *   precio: 5500,
   *   stock: 15,
   *   idCategoria: 1,
   *   imagen: nuevaImagen // opcional
   * });
   */
  actualizar: async (
    id: number,
    data: ActualizarProductoDTO
  ): Promise<Producto> => {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de producto inválido");
      }

      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("precio", data.precio.toString());
      formData.append("stock", data.stock.toString());
      formData.append("idCategoria", data.idCategoria.toString());

      if (data.imagen) {
        formData.append("imagen", data.imagen);
      }

      // Usar fetch directamente para FormData
      const token = localStorage.getItem("auth_token");
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const response = await fetch(`${BASE_URL}/api/productos/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type, FormData lo hace automáticamente
        },
        body: formData,
      });

      const text = await response.text();
      const responseData = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw { status: response.status, data: responseData };
      }

      return responseData as Producto;
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 📝 Actualizar un producto parcialmente (PATCH)
   * @param id - ID del producto a actualizar
   * @param data - Datos parciales del producto (solo los campos a cambiar)
   * @returns Promise<Producto>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PATCH /api/productos/{id}/
   * @description Actualiza solo los campos enviados. Más flexible que PUT.
   *
   * @example
   * // Actualizar solo precio y stock
   * const productoActualizado = await ProductoService.actualizarParcial(1, {
   *   precio: 4800,
   *   stock: 20
   * });
   *
   * // Actualizar solo imagen
   * const productoActualizado2 = await ProductoService.actualizarParcial(2, {
   *   imagen: nuevaImagen
   * });
   */
  actualizarParcial: async (
    id: number,
    data: ActualizarProductoParcialDTO
  ): Promise<Producto> => {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de producto inválido");
      }

      // Si solo hay imagen o datos sin imagen, usar FormData
      const hayImagen = data.imagen !== undefined;
      const hayOtrosDatos =
        data.nombre !== undefined ||
        data.precio !== undefined ||
        data.stock !== undefined ||
        data.idCategoria !== undefined;

      if (hayImagen || hayOtrosDatos) {
        const formData = new FormData();

        if (data.nombre !== undefined) {
          formData.append("nombre", data.nombre);
        }
        if (data.precio !== undefined) {
          formData.append("precio", data.precio.toString());
        }
        if (data.stock !== undefined) {
          formData.append("stock", data.stock.toString());
        }
        if (data.idCategoria !== undefined) {
          formData.append("idCategoria", data.idCategoria.toString());
        }
        if (data.imagen) {
          formData.append("imagen", data.imagen);
        }

        // Usar fetch directamente para FormData
        const token = localStorage.getItem("auth_token");
        const BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:8000";

        const response = await fetch(`${BASE_URL}/api/productos/${id}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            // No establecer Content-Type, FormData lo hace automáticamente
          },
          body: formData,
        });

        const text = await response.text();
        const responseData = text ? JSON.parse(text) : null;

        if (!response.ok) {
          throw { status: response.status, data: responseData };
        }

        return responseData as Producto;
      }

      throw new Error("Debe proporcionar al menos un campo a actualizar");
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 🗑️ Eliminar un producto permanentemente
   * @param id - ID del producto a eliminar
   * @returns Promise<EliminarProductoResponse>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint DELETE /api/productos/{id}/
   * @description Elimina permanentemente un producto (hard delete).
   *              La imagen en Cloudinary también se elimina automáticamente.
   *
   * @throws Error si el producto no existe
   *
   * @example
   * try {
   *   const response = await ProductoService.eliminar(3);
   *   console.log(response.mensaje); // "Producto 'Laptop HP' eliminado correctamente"
   * } catch (error) {
   *   console.error(error.message); // "Producto no encontrado"
   * }
   */
  eliminar: async (id: number): Promise<EliminarProductoResponse> => {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de producto inválido");
      }

      const response = await apiDelete(`/api/productos/${id}/`);
      return response as EliminarProductoResponse;
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 🔎 Buscar productos por término de búsqueda
   * @param query - Término de búsqueda (busca en nombre)
   * @returns Promise<Producto[]>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/buscar/?q={query}
   * @description Busca productos por nombre. La búsqueda es case-insensitive.
   *
   * @throws Error si no se proporciona el término de búsqueda
   *
   * @example
   * const laptops = await ProductoService.buscarPorNombre("laptop");
   * console.log(laptops.length); // 3
   *
   * const hp = await ProductoService.buscarPorNombre("hp"); // case-insensitive
   * console.log(hp[0].nombre); // "Laptop HP"
   */
  buscarPorNombre: async (query: string): Promise<Producto[]> => {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Debe proporcionar un término de búsqueda");
      }

      const response = await apiGet(
        `/api/productos/buscar/?q=${encodeURIComponent(query)}`
      );
      return response as Producto[];
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 📂 Obtener productos por categoría
   * @param idCategoria - ID de la categoría
   * @returns Promise<Producto[]>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint GET /api/productos/categoria/{id_categoria}/
   * @description Obtiene todos los productos de una categoría específica
   *
   * @throws Error si la categoría no existe
   *
   * @example
   * const electronicos = await ProductoService.listarPorCategoria(1);
   * console.log(electronicos[0].categoria.nombre); // "Electrónica"
   */
  listarPorCategoria: async (idCategoria: number): Promise<Producto[]> => {
    try {
      if (!idCategoria || idCategoria <= 0) {
        throw new Error("ID de categoría inválido");
      }

      const response = await apiGet(`/api/productos/categoria/${idCategoria}/`);
      return response as Producto[];
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },

  /**
   * 📦 Actualizar stock de un producto
   * @param id - ID del producto
   * @param cantidad - Cantidad a sumar/restar del stock actual
   * @returns Promise<Producto>
   * @auth Requiere autenticación (Bearer Token)
   * @endpoint PATCH /api/productos/{id}/stock/
   * @description Incrementa o decrementa el stock. Cantidad positiva incrementa, negativa decrementa.
   *              El stock resultante no puede ser negativo.
   *
   * @throws Error si el stock resultante sería negativo
   * @throws Error si la cantidad no es un número entero
   *
   * @example
   * // Incrementar stock
   * const producto = await ProductoService.actualizarStock(1, 10);
   * console.log(producto.stock); // stock anterior + 10
   *
   * // Decrementar stock (venta)
   * const producto2 = await ProductoService.actualizarStock(1, -5);
   * console.log(producto2.stock); // stock anterior - 5
   */
  actualizarStock: async (id: number, cantidad: number): Promise<Producto> => {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de producto inválido");
      }

      if (cantidad === undefined || cantidad === null) {
        throw new Error("Debe proporcionar la cantidad");
      }

      if (!Number.isInteger(cantidad)) {
        throw new Error("La cantidad debe ser un número entero");
      }

      const data: ActualizarStockDTO = { cantidad };
      const response = await apiPatch(`/api/productos/${id}/stock/`, data);
      return response as Producto;
    } catch (error) {
      throw new Error(manejarErrorProducto(error));
    }
  },
};

// ============================================================
// 🛠️ HELPERS DE UTILIDAD
// ============================================================

export const ProductoHelpers = {
  /**
   * 📝 Obtener nombre del producto de forma segura
   * @param producto - Objeto producto (puede ser null/undefined)
   * @returns string - Nombre del producto o texto por defecto
   *
   * @example
   * ProductoHelpers.obtenerNombre(producto); // "Laptop HP"
   * ProductoHelpers.obtenerNombre(null); // "Sin nombre"
   */
  obtenerNombre: (producto: Producto | null | undefined): string => {
    if (!producto) return "Sin nombre";
    return producto.nombre || "Producto sin nombre";
  },

  /**
   * 💰 Formatear precio con símbolo de moneda
   * @param precio - Precio a formatear
   * @param simbolo - Símbolo de moneda (default: "$")
   * @returns string - Precio formateado
   *
   * @example
   * ProductoHelpers.formatearPrecio(5000); // "$5,000.00"
   * ProductoHelpers.formatearPrecio(1234.5); // "$1,234.50"
   */
  formatearPrecio: (
    precio: number | null | undefined,
    simbolo: string = "$"
  ): string => {
    if (precio === null || precio === undefined) return `${simbolo}0.00`;

    return `${simbolo}${precio.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  /**
   * 📦 Obtener estado del stock
   * @param stock - Cantidad en stock
   * @returns object - { estado, color, texto }
   *
   * @example
   * ProductoHelpers.obtenerEstadoStock(0); // { estado: "agotado", color: "#dc3545", texto: "Agotado" }
   * ProductoHelpers.obtenerEstadoStock(5); // { estado: "bajo", color: "#ffc107", texto: "Stock Bajo" }
   * ProductoHelpers.obtenerEstadoStock(50); // { estado: "disponible", color: "#28a745", texto: "Disponible" }
   */
  obtenerEstadoStock: (
    stock: number | null | undefined
  ): { estado: string; color: string; texto: string } => {
    if (stock === null || stock === undefined || stock <= 0) {
      return { estado: "agotado", color: "#dc3545", texto: "Agotado" };
    }

    if (stock <= 10) {
      return { estado: "bajo", color: "#ffc107", texto: "Stock Bajo" };
    }

    return { estado: "disponible", color: "#28a745", texto: "Disponible" };
  },

  /**
   * 🖼️ Obtener URL de imagen o imagen por defecto
   * @param producto - Objeto producto
   * @returns string - URL de la imagen o placeholder
   *
   * @example
   * ProductoHelpers.obtenerImagenUrl(producto); // "https://res.cloudinary.com/.../imagen.jpg"
   * ProductoHelpers.obtenerImagenUrl(productoSinImagen); // URL placeholder
   */
  obtenerImagenUrl: (producto: Producto | null | undefined): string => {
    if (!producto) {
      return "https://via.placeholder.com/300x300?text=Sin+Imagen";
    }

    return (
      producto.imagen_url ||
      producto.imagen ||
      "https://via.placeholder.com/300x300?text=Sin+Imagen"
    );
  },

  /**
   * 🔤 Obtener iniciales del nombre del producto
   * @param nombre - Nombre del producto
   * @returns string - Iniciales (máximo 2 caracteres)
   *
   * @example
   * ProductoHelpers.obtenerIniciales("Laptop HP"); // "LH"
   * ProductoHelpers.obtenerIniciales("Mouse"); // "MO"
   * ProductoHelpers.obtenerIniciales(""); // "??"
   */
  obtenerIniciales: (nombre: string | null | undefined): string => {
    if (!nombre || nombre.trim() === "") return "??";

    const palabras = nombre.trim().split(/\s+/);

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    } else {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
  },

  /**
   * 📂 Obtener nombre de la categoría del producto
   * @param producto - Objeto producto
   * @returns string - Nombre de la categoría
   *
   * @example
   * ProductoHelpers.obtenerNombreCategoria(producto); // "Electrónica"
   * ProductoHelpers.obtenerNombreCategoria(null); // "Sin categoría"
   */
  obtenerNombreCategoria: (producto: Producto | null | undefined): string => {
    if (!producto || !producto.categoria) return "Sin categoría";
    return producto.categoria.nombre || "Sin categoría";
  },

  /**
   * 📅 Formatear fecha de creación/modificación
   * @param fecha - String de fecha en formato ISO
   * @returns string - Fecha formateada o texto por defecto
   *
   * @example
   * ProductoHelpers.formatearFecha("2025-11-11T10:00:00Z"); // "11/11/2025 10:00"
   * ProductoHelpers.formatearFecha(null); // "Fecha no disponible"
   */
  formatearFecha: (fecha: string | null | undefined): string => {
    if (!fecha) return "Fecha no disponible";

    try {
      const date = new Date(fecha);
      const dia = date.getDate().toString().padStart(2, "0");
      const mes = (date.getMonth() + 1).toString().padStart(2, "0");
      const año = date.getFullYear();
      const horas = date.getHours().toString().padStart(2, "0");
      const minutos = date.getMinutes().toString().padStart(2, "0");

      return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    } catch {
      return "Fecha no disponible";
    }
  },

  /**
   * ✅ Validar nombre de producto
   * @param nombre - Nombre del producto a validar
   * @returns boolean - true si es válido
   * @description Verifica que el nombre no esté vacío y tenga máximo 200 caracteres
   *
   * @example
   * ProductoHelpers.validarNombre("Laptop HP"); // true
   * ProductoHelpers.validarNombre(""); // false
   * ProductoHelpers.validarNombre("a".repeat(201)); // false
   */
  validarNombre: (nombre: string | null | undefined): boolean => {
    if (!nombre || nombre.trim() === "") return false;
    if (nombre.trim().length > 200) return false;
    return true;
  },

  /**
   * ✅ Validar precio
   * @param precio - Precio a validar
   * @returns boolean - true si es válido
   * @description Verifica que el precio sea positivo
   *
   * @example
   * ProductoHelpers.validarPrecio(100); // true
   * ProductoHelpers.validarPrecio(-5); // false
   * ProductoHelpers.validarPrecio(0); // false
   */
  validarPrecio: (precio: number | null | undefined): boolean => {
    if (precio === null || precio === undefined) return false;
    if (precio <= 0) return false;
    return true;
  },

  /**
   * ✅ Validar stock
   * @param stock - Cantidad de stock a validar
   * @returns boolean - true si es válido
   * @description Verifica que el stock sea >= 0 y sea entero
   *
   * @example
   * ProductoHelpers.validarStock(10); // true
   * ProductoHelpers.validarStock(0); // true (agotado pero válido)
   * ProductoHelpers.validarStock(-1); // false
   * ProductoHelpers.validarStock(5.5); // false (debe ser entero)
   */
  validarStock: (stock: number | null | undefined): boolean => {
    if (stock === null || stock === undefined) return false;
    if (stock < 0) return false;
    if (!Number.isInteger(stock)) return false;
    return true;
  },

  /**
   * ✅ Validar imagen
   * @param imagen - Archivo de imagen
   * @returns boolean - true si es válido
   * @description Verifica que sea un archivo de imagen válido (< 5MB, formato permitido)
   *
   * @example
   * ProductoHelpers.validarImagen(archivoJpg); // true
   * ProductoHelpers.validarImagen(archivoPdf); // false
   */
  validarImagen: (imagen: File | null | undefined): boolean => {
    if (!imagen) return true; // Opcional

    const tiposPermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!tiposPermitidos.includes(imagen.type)) {
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imagen.size > maxSize) {
      return false;
    }

    return true;
  },

  /**
   * 🔢 Validar datos completos para crear/actualizar producto
   * @param data - Datos del producto a validar
   * @returns object - { valido: boolean, errores: string[] }
   * @description Valida todos los campos según las reglas del backend
   *
   * @example
   * const validacion = ProductoHelpers.validarDatosProducto({
   *   nombre: "Laptop HP",
   *   precio: 5000,
   *   stock: 10,
   *   idCategoria: 1
   * });
   * console.log(validacion); // { valido: true, errores: [] }
   */
  validarDatosProducto: (
    data: CrearProductoDTO | ActualizarProductoDTO
  ): { valido: boolean; errores: string[] } => {
    const errores: string[] = [];

    // Validar nombre (requerido)
    if (!ProductoHelpers.validarNombre(data.nombre)) {
      if (!data.nombre || data.nombre.trim() === "") {
        errores.push("El nombre es requerido");
      } else {
        errores.push("El nombre no puede exceder 200 caracteres");
      }
    }

    // Validar precio (requerido, positivo)
    if (!ProductoHelpers.validarPrecio(data.precio)) {
      if (data.precio === null || data.precio === undefined) {
        errores.push("El precio es requerido");
      } else {
        errores.push("El precio debe ser mayor a 0");
      }
    }

    // Validar stock (requerido, >= 0, entero)
    if (!ProductoHelpers.validarStock(data.stock)) {
      if (data.stock === null || data.stock === undefined) {
        errores.push("El stock es requerido");
      } else if (data.stock < 0) {
        errores.push("El stock no puede ser negativo");
      } else {
        errores.push("El stock debe ser un número entero");
      }
    }

    // Validar categoría (requerido)
    if (!data.idCategoria || data.idCategoria <= 0) {
      errores.push("Debe seleccionar una categoría válida");
    }

    // Validar imagen (opcional)
    if (data.imagen && !ProductoHelpers.validarImagen(data.imagen)) {
      errores.push("La imagen debe ser JPG, PNG o WEBP y no exceder 5MB");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  },

  /**
   * 📊 Filtrar productos por búsqueda (cliente-side)
   * @param productos - Array de productos
   * @param busqueda - Término de búsqueda
   * @returns Producto[] - Productos filtrados
   * @description Busca en nombre y categoría (case-insensitive)
   *
   * @example
   * const resultados = ProductoHelpers.filtrarProductos(productos, "laptop");
   * // Retorna productos que contengan "laptop" en nombre o categoría
   */
  filtrarProductos: (productos: Producto[], busqueda: string): Producto[] => {
    if (!busqueda || busqueda.trim() === "") return productos;

    const termino = busqueda.toLowerCase().trim();

    return productos.filter((producto) => {
      const nombre = producto.nombre?.toLowerCase() || "";
      const categoria = producto.categoria?.nombre?.toLowerCase() || "";

      return nombre.includes(termino) || categoria.includes(termino);
    });
  },

  /**
   * 📊 Ordenar productos por nombre alfabéticamente
   * @param productos - Array de productos
   * @param ascendente - true para A-Z, false para Z-A
   * @returns Producto[] - Productos ordenados
   *
   * @example
   * const ordenados = ProductoHelpers.ordenarPorNombre(productos, true);
   * // ["Laptop HP", "Mouse Logitech", "Teclado Mecánico"]
   */
  ordenarPorNombre: (
    productos: Producto[],
    ascendente: boolean = true
  ): Producto[] => {
    return [...productos].sort((a, b) => {
      const nombreA = a.nombre?.toLowerCase() || "";
      const nombreB = b.nombre?.toLowerCase() || "";

      if (ascendente) {
        return nombreA.localeCompare(nombreB);
      } else {
        return nombreB.localeCompare(nombreA);
      }
    });
  },

  /**
   * 📊 Ordenar productos por precio
   * @param productos - Array de productos
   * @param ascendente - true para menor a mayor, false para mayor a menor
   * @returns Producto[] - Productos ordenados
   *
   * @example
   * const ordenados = ProductoHelpers.ordenarPorPrecio(productos, false);
   * // Más caros primero
   */
  ordenarPorPrecio: (
    productos: Producto[],
    ascendente: boolean = true
  ): Producto[] => {
    return [...productos].sort((a, b) => {
      const precioA = a.precio || 0;
      const precioB = b.precio || 0;

      if (ascendente) {
        return precioA - precioB;
      } else {
        return precioB - precioA;
      }
    });
  },

  /**
   * 📊 Ordenar productos por stock
   * @param productos - Array de productos
   * @param ascendente - true para menor a mayor, false para mayor a menor
   * @returns Producto[] - Productos ordenados
   *
   * @example
   * const ordenados = ProductoHelpers.ordenarPorStock(productos, true);
   * // Productos con menos stock primero
   */
  ordenarPorStock: (
    productos: Producto[],
    ascendente: boolean = true
  ): Producto[] => {
    return [...productos].sort((a, b) => {
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;

      if (ascendente) {
        return stockA - stockB;
      } else {
        return stockB - stockA;
      }
    });
  },

  /**
   * 🔄 Normalizar datos de producto del servidor
   * @param producto - Producto recibido del servidor
   * @returns Producto - Producto con valores por defecto aplicados
   * @description Asegura que los campos opcionales tengan valores por defecto
   *
   * @example
   * const productoNormalizado = ProductoHelpers.normalizarProducto(productoDelServidor);
   */
  normalizarProducto: (producto: Producto): Producto => {
    return {
      ...producto,
      imagen: producto.imagen || null,
      imagen_url: producto.imagen_url || producto.imagen || null,
      fecha_creacion: producto.fecha_creacion || "",
      fecha_modificacion: producto.fecha_modificacion || "",
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
 * - Errores con error.response.data.idCategoria[0]
 * - Errores con error.message
 * - Errores desconocidos
 */
export const manejarErrorProducto = (error: unknown): string => {
  // Si es un string, retornarlo directamente
  if (typeof error === "string") {
    return error;
  }

  // Si es un objeto Error de JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Si es un objeto con estructura de respuesta de API
  if (typeof error === "object" && error !== null) {
    const err = error as {
      response?: {
        data?: {
          error?: string;
          nombre?: string[];
          precio?: string[];
          stock?: string[];
          idCategoria?: string[];
          imagen?: string[];
          cantidad?: string[];
          detail?: string;
        };
        status?: number;
      };
      message?: string;
    };

    // Respuesta con data.error
    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    // Respuesta con data.detail
    if (err.response?.data?.detail) {
      return err.response.data.detail;
    }

    // Respuesta con errores de validación por campo
    if (err.response?.data) {
      const data = err.response.data;

      // Error en nombre
      if (data.nombre && Array.isArray(data.nombre) && data.nombre.length > 0) {
        return `Nombre: ${data.nombre[0]}`;
      }

      // Error en precio
      if (data.precio && Array.isArray(data.precio) && data.precio.length > 0) {
        return `Precio: ${data.precio[0]}`;
      }

      // Error en stock
      if (data.stock && Array.isArray(data.stock) && data.stock.length > 0) {
        return `Stock: ${data.stock[0]}`;
      }

      // Error en categoría
      if (
        data.idCategoria &&
        Array.isArray(data.idCategoria) &&
        data.idCategoria.length > 0
      ) {
        return `Categoría: ${data.idCategoria[0]}`;
      }

      // Error en imagen
      if (data.imagen && Array.isArray(data.imagen) && data.imagen.length > 0) {
        return `Imagen: ${data.imagen[0]}`;
      }

      // Error en cantidad (actualizar stock)
      if (
        data.cantidad &&
        Array.isArray(data.cantidad) &&
        data.cantidad.length > 0
      ) {
        return `Cantidad: ${data.cantidad[0]}`;
      }
    }

    // Mensaje genérico del error
    if (err.message) {
      return err.message;
    }

    // Error de red o sin respuesta
    if (!err.response) {
      return "Error de conexión. Verifica tu conexión a internet.";
    }

    // Error por código de estado HTTP
    if (err.response?.status) {
      switch (err.response.status) {
        case 400:
          return "Datos inválidos. Verifica la información ingresada.";
        case 401:
          return "No autorizado. Inicia sesión nuevamente.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "Producto no encontrado.";
        case 500:
          return "Error del servidor. Intenta nuevamente más tarde.";
        default:
          return `Error ${err.response.status}. Intenta nuevamente.`;
      }
    }
  }

  // Error desconocido
  return "Ocurrió un error inesperado. Intenta nuevamente.";
};

// ============================================================
// 📤 EXPORTACIÓN POR DEFECTO
// ============================================================

export default ProductoService;
