// ============================================================
// 🛒 SERVICIO DE VENTAS Y CUOTAS - CLIENTE
// ============================================================
// Servicio para gestionar compras, ventas y cuotas desde el lado del cliente
// Incluye:
// - Crear compras (al contado o con cuotas)
// - Listar mis compras/ventas
// - Ver detalles de compras
// - Gestionar cuotas (listar, pagar, consultar)
// - Integración con Stripe para pagos
// ============================================================

import { apiGet, apiPost } from "./api";

// ============================================================
// 🎯 TIPOS Y INTERFACES
// ============================================================

/**
 * Detalle de producto en una compra
 */
export interface DetalleCompra {
  producto: number;
  cantidad: number;
}

/**
 * Datos para crear una compra
 */
export interface CrearCompraDTO {
  metodoPago: number; // ID del método de pago (1 = Tarjeta)
  nrocuotas: 1 | 3 | 6 | 12; // Número de cuotas
  detalles: DetalleCompra[]; // Productos a comprar
}

/**
 * Información de producto en detalle de venta
 */
export interface ProductoDetalle {
  idProducto: number;
  nombre: string;
  precio: string;
  stock: number;
}

/**
 * Detalle de venta (producto comprado)
 */
export interface DetalleVenta {
  idDetalleVenta: number;
  producto: number;
  producto_detalle: ProductoDetalle;
  nombre_producto: string;
  cantidad: number;
  precio: string;
  subtotal: string;
  fecha_creacion: string;
}

/**
 * Información de una cuota
 */
export interface Cuota {
  idCuota: number;
  numero_cuota: number;
  monto: string;
  pagada: boolean;
  fecha_vencimiento: string;
  fecha_pago: string | null;
  esta_vencida: boolean;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  fecha_creacion: string;
}

/**
 * Información completa de una venta
 */
export interface Venta {
  idVenta: number;
  usuario: number;
  metodoPago: number;
  nombre_metodo_pago: string;
  subtotal: string;
  interes: string;
  total: string;
  nrocuotas: number;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  fecha_venta: string;
  fecha_modificacion: string;
  detalles: DetalleVenta[];
  cuotas: Cuota[];
  cantidad_productos: number;
}

/**
 * Respuesta al crear compra al contado (1 cuota)
 */
export interface RespuestaCompraContado {
  mensaje: string;
  checkout_url: string;
  session_id: string;
  total: number;
  subtotal: number;
  interes: number;
  nrocuotas: number;
  nota: string;
}

/**
 * Respuesta al crear compra con cuotas
 */
export interface RespuestaCompraCuotas {
  mensaje: string;
  venta: Venta;
  productos_comprados: number;
  cuotas_generadas: number;
  monto_por_cuota: number;
  nota: string;
}

/**
 * Respuesta al generar link de pago para cuota
 */
export interface RespuestaLinkPago {
  url: string;
  session_id: string;
  monto: number;
  cuota: Cuota;
}

/**
 * Estadísticas de cuotas
 */
export interface EstadisticasCuotas {
  total: number;
  pendientes: number;
  pagadas: number;
  vencidas: number;
  monto_total_pendiente: number;
  monto_total_pagado: number;
}

// ============================================================
// 🛒 SERVICIO DE VENTAS Y COMPRAS
// ============================================================

export class VentaClienteService {
  /**
   * Crear una nueva compra (al contado o con cuotas)
   *
   * @param compra - Datos de la compra
   * @returns Respuesta según el tipo de compra
   *
   * - Si nrocuotas = 1: Retorna checkout_url de Stripe
   * - Si nrocuotas > 1: Crea la venta y retorna detalles con cuotas
   */
  static async crearCompra(
    compra: CrearCompraDTO
  ): Promise<RespuestaCompraContado | RespuestaCompraCuotas> {
    return await apiPost<RespuestaCompraContado | RespuestaCompraCuotas>(
      "/api/ventas/",
      compra
    );
  }

  /**
   * Listar todas mis compras/ventas
   *
   * @returns Lista de ventas del usuario autenticado
   */
  static async listarMisVentas(): Promise<Venta[]> {
    return await apiGet<Venta[]>("/api/ventas/mis-ventas/");
  }

  /**
   * Obtener detalle completo de una venta
   *
   * @param idVenta - ID de la venta
   * @returns Información completa de la venta
   */
  static async obtenerDetalleVenta(idVenta: number): Promise<Venta> {
    return await apiGet<Venta>(`/api/ventas/${idVenta}/`);
  }

  /**
   * Listar las cuotas de una venta específica
   *
   * @param idVenta - ID de la venta
   * @returns Lista de cuotas de la venta
   */
  static async listarCuotasDeVenta(idVenta: number): Promise<Cuota[]> {
    return await apiGet<Cuota[]>(`/api/ventas/${idVenta}/cuotas/`);
  }

  /**
   * Listar todas mis cuotas
   *
   * @returns Lista de todas las cuotas del usuario
   */
  static async listarMisCuotas(): Promise<Cuota[]> {
    return await apiGet<Cuota[]>("/api/ventas/mis-cuotas/");
  }

  /**
   * Listar solo mis cuotas pendientes de pago
   *
   * @returns Lista de cuotas no pagadas
   */
  static async listarCuotasPendientes(): Promise<Cuota[]> {
    return await apiGet<Cuota[]>("/api/ventas/mis-cuotas/pendientes/");
  }

  /**
   * Obtener detalle de una cuota específica
   *
   * @param idCuota - ID de la cuota
   * @returns Información de la cuota
   */
  static async obtenerDetalleCuota(idCuota: number): Promise<Cuota> {
    return await apiGet<Cuota>(`/api/ventas/cuotas/${idCuota}/`);
  }

  /**
   * Generar link de pago de Stripe para una cuota
   *
   * @param idCuota - ID de la cuota a pagar
   * @returns URL de checkout de Stripe y session_id
   */
  static async generarLinkPagoCuota(
    idCuota: number
  ): Promise<RespuestaLinkPago> {
    return await apiPost<RespuestaLinkPago>(
      `/api/ventas/cuotas/${idCuota}/generar-link-pago/`,
      {}
    );
  }
}

// ============================================================
// 🧮 HELPERS Y UTILIDADES
// ============================================================

export class VentaHelpers {
  /**
   * Calcular el total de una compra antes de crearla
   *
   * @param detalles - Detalles de la compra
   * @param preciosProductos - Map con precios de productos
   * @param nrocuotas - Número de cuotas
   * @returns Objeto con subtotal, interés y total
   */
  static calcularTotalCompra(
    detalles: DetalleCompra[],
    preciosProductos: Map<number, number>,
    nrocuotas: 1 | 3 | 6 | 12
  ): { subtotal: number; interes: number; total: number } {
    // Calcular subtotal
    const subtotal = detalles.reduce((acc, detalle) => {
      const precio = preciosProductos.get(detalle.producto) || 0;
      return acc + precio * detalle.cantidad;
    }, 0);

    // Calcular interés según número de cuotas
    const tasasInteres: Record<number, number> = {
      1: 0, // 0% - Al contado
      3: 0.19, // 19% anual
      6: 0.15, // 15% anual
      12: 0.12, // 12% anual
    };

    const tasaInteres = tasasInteres[nrocuotas] || 0;
    const interes = subtotal * tasaInteres;
    const total = subtotal + interes;

    return { subtotal, interes, total };
  }

  /**
   * Formatear precio en formato de moneda
   *
   * @param precio - Precio a formatear
   * @returns Precio formateado
   */
  static formatearPrecio(precio: string | number): string {
    const precioNum = typeof precio === "string" ? parseFloat(precio) : precio;
    return `$${precioNum.toFixed(2)}`;
  }

  /**
   * Formatear fecha en formato legible
   *
   * @param fecha - Fecha ISO string
   * @returns Fecha formateada
   */
  static formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Formatear fecha y hora
   *
   * @param fecha - Fecha ISO string
   * @returns Fecha y hora formateadas
   */
  static formatearFechaHora(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Verificar si una cuota está vencida
   *
   * @param cuota - Cuota a verificar
   * @returns true si está vencida
   */
  static estaVencida(cuota: Cuota): boolean {
    if (cuota.pagada) return false;
    const hoy = new Date();
    const fechaVencimiento = new Date(cuota.fecha_vencimiento);
    return fechaVencimiento < hoy;
  }

  /**
   * Obtener días para el vencimiento de una cuota
   *
   * @param cuota - Cuota a verificar
   * @returns Número de días (negativo si ya venció)
   */
  static diasParaVencimiento(cuota: Cuota): number {
    if (cuota.pagada) return 0;
    const hoy = new Date();
    const fechaVencimiento = new Date(cuota.fecha_vencimiento);
    const diferencia = fechaVencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtener estado de una cuota con estilo
   *
   * @param cuota - Cuota a evaluar
   * @returns Objeto con texto y color
   */
  static obtenerEstadoCuota(cuota: Cuota): {
    texto: string;
    color: string;
    badge: "success" | "warning" | "danger" | "info";
  } {
    if (cuota.pagada) {
      return {
        texto: "Pagada",
        color: "#28a745",
        badge: "success",
      };
    }

    const dias = this.diasParaVencimiento(cuota);

    if (dias < 0) {
      return {
        texto: `Vencida (${Math.abs(dias)} días)`,
        color: "#dc3545",
        badge: "danger",
      };
    }

    if (dias <= 7) {
      return {
        texto: `Vence en ${dias} días`,
        color: "#ffc107",
        badge: "warning",
      };
    }

    return {
      texto: "Pendiente",
      color: "#17a2b8",
      badge: "info",
    };
  }

  /**
   * Calcular estadísticas de cuotas
   *
   * @param cuotas - Lista de cuotas
   * @returns Estadísticas calculadas
   */
  static calcularEstadisticasCuotas(cuotas: Cuota[]): EstadisticasCuotas {
    const pendientes = cuotas.filter((c) => !c.pagada);
    const pagadas = cuotas.filter((c) => c.pagada);
    const vencidas = cuotas.filter((c) => !c.pagada && this.estaVencida(c));

    const monto_total_pendiente = pendientes.reduce(
      (acc, c) => acc + parseFloat(c.monto),
      0
    );

    const monto_total_pagado = pagadas.reduce(
      (acc, c) => acc + parseFloat(c.monto),
      0
    );

    return {
      total: cuotas.length,
      pendientes: pendientes.length,
      pagadas: pagadas.length,
      vencidas: vencidas.length,
      monto_total_pendiente,
      monto_total_pagado,
    };
  }

  /**
   * Obtener progreso de pago de una venta
   *
   * @param venta - Venta a evaluar
   * @returns Porcentaje de cuotas pagadas
   */
  static calcularProgresoPago(venta: Venta): number {
    if (!venta.cuotas || venta.cuotas.length === 0) return 100;
    const pagadas = venta.cuotas.filter((c) => c.pagada).length;
    return Math.round((pagadas / venta.cuotas.length) * 100);
  }

  /**
   * Verificar si una venta está completamente pagada
   *
   * @param venta - Venta a verificar
   * @returns true si todas las cuotas están pagadas
   */
  static ventaCompletamentePagada(venta: Venta): boolean {
    if (!venta.cuotas || venta.cuotas.length === 0) return true;
    return venta.cuotas.every((c) => c.pagada);
  }

  /**
   * Obtener el método de pago en formato legible
   *
   * @param nrocuotas - Número de cuotas
   * @returns Descripción del método de pago
   */
  static obtenerDescripcionMetodoPago(nrocuotas: number): string {
    switch (nrocuotas) {
      case 1:
        return "Pago al Contado";
      case 3:
        return "3 Cuotas (19% interés)";
      case 6:
        return "6 Cuotas (15% interés)";
      case 12:
        return "12 Cuotas (12% interés)";
      default:
        return `${nrocuotas} Cuotas`;
    }
  }

  /**
   * Ordenar cuotas por fecha de vencimiento
   *
   * @param cuotas - Lista de cuotas
   * @returns Cuotas ordenadas
   */
  static ordenarCuotasPorVencimiento(cuotas: Cuota[]): Cuota[] {
    return [...cuotas].sort((a, b) => {
      const fechaA = new Date(a.fecha_vencimiento).getTime();
      const fechaB = new Date(b.fecha_vencimiento).getTime();
      return fechaA - fechaB;
    });
  }

  /**
   * Agrupar cuotas por estado
   *
   * @param cuotas - Lista de cuotas
   * @returns Cuotas agrupadas
   */
  static agruparCuotasPorEstado(cuotas: Cuota[]): {
    pendientes: Cuota[];
    vencidas: Cuota[];
    pagadas: Cuota[];
    porVencer: Cuota[];
  } {
    const pendientes: Cuota[] = [];
    const vencidas: Cuota[] = [];
    const pagadas: Cuota[] = [];
    const porVencer: Cuota[] = [];

    cuotas.forEach((cuota) => {
      if (cuota.pagada) {
        pagadas.push(cuota);
      } else if (this.estaVencida(cuota)) {
        vencidas.push(cuota);
      } else if (this.diasParaVencimiento(cuota) <= 7) {
        porVencer.push(cuota);
      } else {
        pendientes.push(cuota);
      }
    });

    return { pendientes, vencidas, pagadas, porVencer };
  }

  /**
   * Validar datos de compra antes de enviar
   *
   * @param compra - Datos de compra a validar
   * @returns Objeto con validación y mensaje de error
   */
  static validarDatosCompra(compra: CrearCompraDTO): {
    valido: boolean;
    error?: string;
  } {
    // Validar método de pago
    if (!compra.metodoPago || compra.metodoPago <= 0) {
      return {
        valido: false,
        error: "Debe seleccionar un método de pago válido",
      };
    }

    // Validar número de cuotas
    const cuotasValidas: number[] = [1, 3, 6, 12];
    if (!cuotasValidas.includes(compra.nrocuotas)) {
      return {
        valido: false,
        error: "El número de cuotas debe ser 1, 3, 6 o 12",
      };
    }

    // Validar detalles
    if (!compra.detalles || compra.detalles.length === 0) {
      return {
        valido: false,
        error: "Debe agregar al menos un producto a la compra",
      };
    }

    // Validar cada detalle
    for (const detalle of compra.detalles) {
      if (!detalle.producto || detalle.producto <= 0) {
        return {
          valido: false,
          error: "ID de producto inválido en los detalles",
        };
      }

      if (!detalle.cantidad || detalle.cantidad <= 0) {
        return {
          valido: false,
          error: "La cantidad debe ser mayor a 0",
        };
      }
    }

    return { valido: true };
  }
}

// ============================================================
// 📤 EXPORTACIONES
// ============================================================

export default VentaClienteService;
