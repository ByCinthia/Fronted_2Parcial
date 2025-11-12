// ============================================================
// 🛍️ SERVICIO DE CATÁLOGO PÚBLICO
// ============================================================
// Servicio para el catálogo público de productos
// NO requiere autenticación - Acceso público para clientes
// Solo muestra productos con stock disponible
// ============================================================

import { apiGet } from "./api";

// ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================

/**
 * Interfaz de Categoría en el catálogo
 */
export interface CategoriaPublica {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
}

/**
 * Interfaz de Producto en el catálogo público
 */
export interface ProductoCatalogo {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number; // Viene como number desde el backend
  stock: number;
  imagen?: string | null; // Cloudinary path (ej: "image/upload/v1762898384/...")
  imagen_url?: string | null; // URL completa de Cloudinary
  fecha_creacion?: string;
  categoria: CategoriaPublica;
}

/**
 * Respuesta de error del catálogo
 */
export interface ErrorCatalogo {
  error: string;
}

// ============================================================
// 🔧 SERVICIO DE CATÁLOGO
// ============================================================

export const CatalogoService = {
  /**
   * 📋 Listar todos los productos disponibles (con stock)
   * @returns Promise<ProductoCatalogo[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/
   * @description Obtiene todos los productos que tienen stock disponible
   *
   * @example
   * const productos = await CatalogoService.listarProductos();
   * console.log(productos); // [{ idProducto: 1, nombre: "Laptop HP", stock: 15, ... }]
   */
  listarProductos: async (): Promise<ProductoCatalogo[]> => {
    try {
      const data = await apiGet<ProductoCatalogo[]>("/api/catalogo/productos/");
      console.log("✅ Productos del catálogo cargados:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al cargar productos del catálogo:", error);
      throw error;
    }
  },

  /**
   * 🔎 Filtrar productos por categoría
   * @param idCategoria - ID de la categoría
   * @returns Promise<ProductoCatalogo[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/?categoria={id}
   * @description Obtiene productos filtrados por categoría (solo con stock)
   *
   * @throws Error si el ID de categoría es inválido
   *
   * @example
   * const productosElectronica = await CatalogoService.listarPorCategoria(1);
   * console.log(productosElectronica.length); // 5
   */
  listarPorCategoria: async (
    idCategoria: number
  ): Promise<ProductoCatalogo[]> => {
    try {
      if (!idCategoria || idCategoria <= 0) {
        throw new Error("ID de categoría inválido");
      }

      const data = await apiGet<ProductoCatalogo[]>(
        `/api/catalogo/productos/?categoria=${idCategoria}`
      );
      console.log(`✅ Productos de categoría ${idCategoria} cargados:`, data);
      return data;
    } catch (error) {
      console.error(
        `❌ Error al cargar productos de categoría ${idCategoria}:`,
        error
      );
      throw error;
    }
  },

  /**
   * 📦 Obtener detalles de un producto específico
   * @param idProducto - ID del producto
   * @returns Promise<ProductoCatalogo>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/{id_producto}/
   * @description Obtiene información detallada de un producto (solo si tiene stock)
   *
   * @throws Error si el producto no existe o no tiene stock
   *
   * @example
   * const producto = await CatalogoService.obtenerProducto(1);
   * console.log(producto.nombre); // "Laptop HP"
   * console.log(producto.stock); // 15
   */
  obtenerProducto: async (idProducto: number): Promise<ProductoCatalogo> => {
    try {
      if (!idProducto || idProducto <= 0) {
        throw new Error("ID de producto inválido");
      }

      const data = await apiGet<ProductoCatalogo>(
        `/api/catalogo/productos/${idProducto}/`
      );
      console.log(`✅ Producto ${idProducto} cargado:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error al cargar producto ${idProducto}:`, error);
      throw error;
    }
  },

  /**
   * 📂 Listar categorías con productos disponibles
   * @returns Promise<CategoriaPublica[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/categorias/
   * @description Obtiene categorías que tienen al menos un producto con stock
   *
   * @example
   * const categorias = await CatalogoService.listarCategorias();
   * console.log(categorias); // [{ idCategoria: 1, nombre: "Electrónica", ... }]
   */
  listarCategorias: async (): Promise<CategoriaPublica[]> => {
    try {
      const data = await apiGet<CategoriaPublica[]>(
        "/api/catalogo/categorias/"
      );
      console.log("✅ Categorías del catálogo cargadas:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al cargar categorías del catálogo:", error);
      throw error;
    }
  },

  /**
   * ⭐ Obtener productos destacados
   * @returns Promise<ProductoCatalogo[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/destacados/
   * @description Obtiene los 10 productos con mayor stock (más populares)
   *
   * @example
   * const destacados = await CatalogoService.obtenerDestacados();
   * console.log(destacados.length); // Máximo 10
   * console.log(destacados[0].stock); // 100 (el de mayor stock)
   */
  obtenerDestacados: async (): Promise<ProductoCatalogo[]> => {
    try {
      const data = await apiGet<ProductoCatalogo[]>(
        "/api/catalogo/productos/destacados/"
      );
      console.log("✅ Productos destacados cargados:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al cargar productos destacados:", error);
      throw error;
    }
  },

  /**
   * 🆕 Obtener productos nuevos
   * @returns Promise<ProductoCatalogo[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/nuevos/
   * @description Obtiene los 10 productos más recientes ordenados por fecha de creación
   *
   * @example
   * const nuevos = await CatalogoService.obtenerNuevos();
   * console.log(nuevos.length); // Máximo 10
   * console.log(nuevos[0].fecha_creacion); // "2025-02-01T16:45:00Z" (más reciente)
   */
  obtenerNuevos: async (): Promise<ProductoCatalogo[]> => {
    try {
      const data = await apiGet<ProductoCatalogo[]>(
        "/api/catalogo/productos/nuevos/"
      );
      console.log("✅ Productos nuevos cargados:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al cargar productos nuevos:", error);
      throw error;
    }
  },

  /**
   * 🔥 Obtener productos más vendidos
   * @returns Promise<ProductoCatalogo[]>
   * @auth NO requiere autenticación (público)
   * @endpoint GET /api/catalogo/productos/mas-vendidos/
   * @description Obtiene los 10 productos más vendidos (stock bajo <= 20)
   *
   * @example
   * const masVendidos = await CatalogoService.obtenerMasVendidos();
   * console.log(masVendidos.length); // Máximo 10
   * console.log(masVendidos[0].stock); // 5 (stock más bajo = más vendido)
   */
  obtenerMasVendidos: async (): Promise<ProductoCatalogo[]> => {
    try {
      const data = await apiGet<ProductoCatalogo[]>(
        "/api/catalogo/productos/mas-vendidos/"
      );
      console.log("✅ Productos más vendidos cargados:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al cargar productos más vendidos:", error);
      throw error;
    }
  },
};

// ============================================================
// 🛠️ HELPERS DE UTILIDAD PARA CATÁLOGO
// ============================================================

export const CatalogoHelpers = {
  /**
   * 💰 Formatear precio del catálogo a número
   * @param precio - Precio en formato number o string desde el backend
   * @returns number - Precio como número
   *
   * @example
   * CatalogoHelpers.parsearPrecio(850.00); // 850.00
   * CatalogoHelpers.parsearPrecio("25.50"); // 25.5
   */
  parsearPrecio: (precio: number | string | null | undefined): number => {
    if (!precio) return 0;
    const precioNum = typeof precio === "string" ? parseFloat(precio) : precio;
    return isNaN(precioNum) ? 0 : precioNum;
  },

  /**
   * 💵 Formatear precio para mostrar con símbolo USD
   * @param precio - Precio en formato string o number
   * @returns string - Precio formateado con símbolo $
   *
   * @example
   * CatalogoHelpers.formatearPrecio(850.00); // "$850.00"
   * CatalogoHelpers.formatearPrecio(25.5); // "$25.50"
   */
  formatearPrecio: (precio: string | number | null | undefined): string => {
    if (!precio) return "$0.00";

    const precioNum = typeof precio === "string" ? parseFloat(precio) : precio;

    if (isNaN(precioNum)) return "$0.00";

    return `$${precioNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  /**
   * 📦 Verificar si un producto tiene stock disponible
   * @param producto - Producto del catálogo
   * @returns boolean - true si tiene stock
   *
   * @example
   * CatalogoHelpers.tieneStock(producto); // true
   * CatalogoHelpers.tieneStock(productoAgotado); // false
   */
  tieneStock: (producto: ProductoCatalogo | null | undefined): boolean => {
    if (!producto) return false;
    return producto.stock > 0;
  },

  /**
   * 🏷️ Obtener badge de stock para UI
   * @param stock - Cantidad en stock
   * @returns object - { texto, color, disponible }
   *
   * @example
   * CatalogoHelpers.obtenerBadgeStock(50); // { texto: "Disponible", color: "#28a745", disponible: true }
   * CatalogoHelpers.obtenerBadgeStock(5); // { texto: "¡Últimas unidades!", color: "#ffc107", disponible: true }
   * CatalogoHelpers.obtenerBadgeStock(0); // { texto: "Agotado", color: "#dc3545", disponible: false }
   */
  obtenerBadgeStock: (
    stock: number | null | undefined
  ): { texto: string; color: string; disponible: boolean } => {
    if (stock === null || stock === undefined || stock <= 0) {
      return { texto: "Agotado", color: "#dc3545", disponible: false };
    }

    if (stock <= 5) {
      return {
        texto: "¡Últimas unidades!",
        color: "#dc3545",
        disponible: true,
      };
    }

    if (stock <= 10) {
      return {
        texto: "¡Pocas unidades!",
        color: "#ffc107",
        disponible: true,
      };
    }

    if (stock <= 20) {
      return { texto: "Stock limitado", color: "#fd7e14", disponible: true };
    }

    return { texto: "Disponible", color: "#28a745", disponible: true };
  },

  /**
   * 🖼️ Obtener URL de imagen o placeholder
   * @param producto - Producto del catálogo
   * @returns string - URL de la imagen
   *
   * @example
   * CatalogoHelpers.obtenerImagenUrl(producto); // "http://res.cloudinary.com/.../laptop.jpg"
   * CatalogoHelpers.obtenerImagenUrl(productoSinImagen); // URL placeholder
   */
  obtenerImagenUrl: (producto: ProductoCatalogo | null | undefined): string => {
    if (!producto) {
      return "https://via.placeholder.com/400x400?text=Sin+Imagen";
    }

    return (
      producto.imagen_url ||
      "https://via.placeholder.com/400x400?text=Sin+Imagen"
    );
  },

  /**
   * 📝 Obtener descripción o texto por defecto
   * @param producto - Producto del catálogo
   * @returns string - Descripción del producto
   *
   * @example
   * CatalogoHelpers.obtenerDescripcion(producto); // "Laptop HP 15.6 pulgadas"
   * CatalogoHelpers.obtenerDescripcion(productoSinDesc); // "Sin descripción disponible"
   */
  obtenerDescripcion: (
    producto: ProductoCatalogo | null | undefined
  ): string => {
    if (!producto) return "Sin descripción disponible";

    return (
      producto.descripcion || producto.nombre || "Sin descripción disponible"
    );
  },

  /**
   * 🏷️ Obtener nombre de categoría
   * @param producto - Producto del catálogo
   * @returns string - Nombre de la categoría
   *
   * @example
   * CatalogoHelpers.obtenerNombreCategoria(producto); // "Electrónica"
   */
  obtenerNombreCategoria: (
    producto: ProductoCatalogo | null | undefined
  ): string => {
    if (!producto || !producto.categoria) return "Sin categoría";
    return producto.categoria.nombre || "Sin categoría";
  },

  /**
   * 🆕 Verificar si un producto es nuevo (creado en últimos 30 días)
   * @param producto - Producto del catálogo
   * @returns boolean - true si es nuevo
   *
   * @example
   * CatalogoHelpers.esNuevo(producto); // true
   */
  esNuevo: (producto: ProductoCatalogo | null | undefined): boolean => {
    if (!producto || !producto.fecha_creacion) return false;

    const fechaCreacion = new Date(producto.fecha_creacion);
    const hoy = new Date();
    const diasTranscurridos = Math.floor(
      (hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diasTranscurridos <= 30;
  },

  /**
   * 🔥 Verificar si un producto es popular (stock alto)
   * @param producto - Producto del catálogo
   * @returns boolean - true si es popular
   *
   * @example
   * CatalogoHelpers.esPopular(producto); // true si stock > 50
   */
  esPopular: (producto: ProductoCatalogo | null | undefined): boolean => {
    if (!producto) return false;
    return producto.stock > 50;
  },

  /**
   * 🔥 Verificar si un producto es más vendido (stock bajo)
   * @param producto - Producto del catálogo
   * @returns boolean - true si es más vendido
   *
   * @example
   * CatalogoHelpers.esMasVendido(producto); // true si stock <= 20
   */
  esMasVendido: (producto: ProductoCatalogo | null | undefined): boolean => {
    if (!producto) return false;
    return producto.stock > 0 && producto.stock <= 20;
  },

  /**
   * 🔍 Filtrar productos por búsqueda (nombre o descripción)
   * @param productos - Array de productos
   * @param busqueda - Término de búsqueda
   * @returns ProductoCatalogo[] - Productos filtrados
   *
   * @example
   * const resultados = CatalogoHelpers.filtrarPorBusqueda(productos, "laptop");
   * console.log(resultados.length); // 3
   */
  filtrarPorBusqueda: (
    productos: ProductoCatalogo[],
    busqueda: string
  ): ProductoCatalogo[] => {
    if (!busqueda || busqueda.trim() === "") return productos;

    const busquedaLower = busqueda.toLowerCase().trim();

    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(busquedaLower) ||
        producto.descripcion?.toLowerCase().includes(busquedaLower) ||
        producto.categoria.nombre.toLowerCase().includes(busquedaLower)
    );
  },

  /**
   * 💲 Filtrar productos por rango de precio
   * @param productos - Array de productos
   * @param precioMin - Precio mínimo
   * @param precioMax - Precio máximo
   * @returns ProductoCatalogo[] - Productos filtrados
   *
   * @example
   * const filtrados = CatalogoHelpers.filtrarPorPrecio(productos, 50, 200);
   * console.log(filtrados); // Productos entre $50 y $200
   */
  filtrarPorPrecio: (
    productos: ProductoCatalogo[],
    precioMin?: number,
    precioMax?: number
  ): ProductoCatalogo[] => {
    return productos.filter((producto) => {
      const precio = CatalogoHelpers.parsearPrecio(producto.precio);

      if (precioMin !== undefined && precio < precioMin) return false;
      if (precioMax !== undefined && precio > precioMax) return false;

      return true;
    });
  },

  /**
   * 🔢 Ordenar productos por precio
   * @param productos - Array de productos
   * @param ascendente - true = menor a mayor, false = mayor a menor
   * @returns ProductoCatalogo[] - Productos ordenados
   *
   * @example
   * const ordenados = CatalogoHelpers.ordenarPorPrecio(productos, true);
   * console.log(ordenados[0].precio); // El más barato
   */
  ordenarPorPrecio: (
    productos: ProductoCatalogo[],
    ascendente: boolean = true
  ): ProductoCatalogo[] => {
    return [...productos].sort((a, b) => {
      const precioA = CatalogoHelpers.parsearPrecio(a.precio);
      const precioB = CatalogoHelpers.parsearPrecio(b.precio);

      return ascendente ? precioA - precioB : precioB - precioA;
    });
  },

  /**
   * 📅 Ordenar productos por fecha
   * @param productos - Array de productos
   * @param ascendente - true = más antiguos primero, false = más recientes primero
   * @returns ProductoCatalogo[] - Productos ordenados
   *
   * @example
   * const ordenados = CatalogoHelpers.ordenarPorFecha(productos, false);
   * console.log(ordenados[0].fecha_creacion); // El más reciente
   */
  ordenarPorFecha: (
    productos: ProductoCatalogo[],
    ascendente: boolean = false
  ): ProductoCatalogo[] => {
    return [...productos].sort((a, b) => {
      const fechaA = new Date(a.fecha_creacion || 0).getTime();
      const fechaB = new Date(b.fecha_creacion || 0).getTime();

      return ascendente ? fechaA - fechaB : fechaB - fechaA;
    });
  },

  /**
   * 📊 Obtener estadísticas del catálogo
   * @param productos - Array de productos
   * @returns object - Estadísticas del catálogo
   *
   * @example
   * const stats = CatalogoHelpers.obtenerEstadisticas(productos);
   * console.log(stats); // { total: 50, disponibles: 45, nuevos: 10, ... }
   */
  obtenerEstadisticas: (
    productos: ProductoCatalogo[]
  ): {
    total: number;
    disponibles: number;
    nuevos: number;
    populares: number;
    masVendidos: number;
    precioPromedio: number;
    precioMinimo: number;
    precioMaximo: number;
  } => {
    const disponibles = productos.filter((p) =>
      CatalogoHelpers.tieneStock(p)
    ).length;
    const nuevos = productos.filter((p) => CatalogoHelpers.esNuevo(p)).length;
    const populares = productos.filter((p) =>
      CatalogoHelpers.esPopular(p)
    ).length;
    const masVendidos = productos.filter((p) =>
      CatalogoHelpers.esMasVendido(p)
    ).length;

    const precios = productos.map((p) =>
      CatalogoHelpers.parsearPrecio(p.precio)
    );
    const precioPromedio =
      precios.length > 0
        ? precios.reduce((sum, p) => sum + p, 0) / precios.length
        : 0;
    const precioMinimo = precios.length > 0 ? Math.min(...precios) : 0;
    const precioMaximo = precios.length > 0 ? Math.max(...precios) : 0;

    return {
      total: productos.length,
      disponibles,
      nuevos,
      populares,
      masVendidos,
      precioPromedio,
      precioMinimo,
      precioMaximo,
    };
  },
};

// ============================================================
// 🚨 MANEJO DE ERRORES
// ============================================================

/**
 * Extrae y formatea mensajes de error del catálogo
 * @param error - Error capturado
 * @returns string - Mensaje de error legible
 */
export const manejarErrorCatalogo = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const errorObj = error as { error?: string; message?: string };

    if (errorObj.error) {
      return errorObj.error;
    }

    if (errorObj.message) {
      return errorObj.message;
    }
  }

  return "Error al cargar el catálogo. Por favor, intenta nuevamente.";
};

// ============================================================
// 📤 EXPORTACIÓN POR DEFECTO
// ============================================================

export default CatalogoService;
