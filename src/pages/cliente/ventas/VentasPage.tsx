// ============================================================
// 📦 PÁGINA DE MIS VENTAS Y CUOTAS
// ============================================================
// Página para ver el historial de compras y gestionar cuotas:
// - Ver todas mis compras
// - Ver detalles de cada compra
// - Listar todas mis cuotas
// - Pagar cuotas pendientes
// - Filtrar cuotas por estado
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdShoppingBag,
  MdReceipt,
  MdPayment,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdArrowBack,
  MdExpandMore,
  MdExpandLess,
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast";
import VentaClienteService, {
  VentaHelpers,
  type Venta,
  type Cuota,
} from "../../../services/ventaCliente";
import "../../../Styles/ventas.css";

type Vista = "ventas" | "cuotas";
type FiltroCuotas = "todas" | "pendientes" | "pagadas" | "vencidas";

export default function VentasPage() {
  const navigate = useNavigate();

  // Estado
  const [vista, setVista] = useState<Vista>("ventas");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ventaExpandida, setVentaExpandida] = useState<number | null>(null);
  const [filtroCuotas, setFiltroCuotas] = useState<FiltroCuotas>("todas");
  const [procesandoPago, setProcesandoPago] = useState<number | null>(null);

  // Cargar datos
  useEffect(() => {
    if (vista === "ventas") {
      cargarVentas();
    } else {
      cargarCuotas();
    }
  }, [vista]);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VentaClienteService.listarMisVentas();
      setVentas(data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setError("Error al cargar las ventas. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const cargarCuotas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VentaClienteService.listarMisCuotas();
      setCuotas(data);
    } catch (err) {
      console.error("Error al cargar cuotas:", err);
      setError("Error al cargar las cuotas. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePagarCuota = async (idCuota: number) => {
    try {
      setProcesandoPago(idCuota);
      const respuesta = await VentaClienteService.generarLinkPagoCuota(idCuota);
      toast.loading("Generando link de pago...", {
        position: "top-center",
        duration: 2000,
      });
      setTimeout(() => {
        window.location.href = respuesta.checkout_url;
      }, 1500);
    } catch (err: unknown) {
      console.error("Error al generar link de pago:", err);
      toast.error("Error al generar el link de pago. Intente nuevamente.", {
        position: "top-center",
        duration: 4000,
      });
      setProcesandoPago(null);
    }
  };

  // Filtrar cuotas
  const cuotasFiltradas = () => {
    const agrupadas = VentaHelpers.agruparCuotasPorEstado(cuotas);
    switch (filtroCuotas) {
      case "pendientes":
        return [...agrupadas.pendientes, ...agrupadas.porVencer];
      case "pagadas":
        return agrupadas.pagadas;
      case "vencidas":
        return agrupadas.vencidas;
      default:
        return cuotas;
    }
  };

  // Estadísticas de cuotas
  const estadisticas = VentaHelpers.calcularEstadisticasCuotas(cuotas);

  return (
    <div className="ventas-page">
      {/* Header */}
      <div className="ventas-header">
        <div className="ventas-header-content">
          <button className="btn-back" onClick={() => navigate("/catalogo")}>
            <MdArrowBack size={24} />
            Volver
          </button>
          <h1 className="ventas-title">
            <MdShoppingBag />
            Mis Compras y Cuotas
          </h1>
        </div>
      </div>

      {/* Navegación de vistas */}
      <div className="ventas-nav">
        <div className="ventas-nav-content">
          <button
            className={`nav-tab ${vista === "ventas" ? "active" : ""}`}
            onClick={() => setVista("ventas")}
          >
            <MdReceipt size={22} />
            <div>
              <span>Mis Compras</span>
              <small>{ventas.length} compras</small>
            </div>
          </button>
          <button
            className={`nav-tab ${vista === "cuotas" ? "active" : ""}`}
            onClick={() => setVista("cuotas")}
          >
            <MdPayment size={22} />
            <div>
              <span>Mis Cuotas</span>
              <small>
                {estadisticas.pendientes} pendientes de {estadisticas.total}
              </small>
            </div>
          </button>
        </div>
      </div>

      <div className="ventas-content">
        {/* ============================================================ */}
        {/* VISTA DE VENTAS */}
        {/* ============================================================ */}
        {vista === "ventas" && (
          <>
            {/* Loading */}
            {loading && (
              <div className="ventas-lista">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="venta-card">
                    <Skeleton height={150} />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="ventas-error">
                <MdError size={64} />
                <h3>Error al cargar compras</h3>
                <p>{error}</p>
                <button className="btn-retry" onClick={cargarVentas}>
                  Reintentar
                </button>
              </div>
            )}

            {/* Sin ventas */}
            {!loading && !error && ventas.length === 0 && (
              <div className="ventas-vacio">
                <MdShoppingBag size={80} />
                <h3>No tienes compras aún</h3>
                <p>Explora nuestro catálogo y realiza tu primera compra</p>
                <button
                  className="btn-catalogo"
                  onClick={() => navigate("/catalogo")}
                >
                  Ir al Catálogo
                </button>
              </div>
            )}

            {/* Lista de ventas */}
            {!loading && !error && ventas.length > 0 && (
              <div className="ventas-lista">
                {ventas.map((venta) => {
                  const progreso = VentaHelpers.calcularProgresoPago(venta);
                  const completada =
                    VentaHelpers.ventaCompletamentePagada(venta);

                  return (
                    <div key={venta.idVenta} className="venta-card">
                      {/* Header de la venta */}
                      <div className="venta-header">
                        <div className="venta-info">
                          <div className="venta-numero">
                            <MdReceipt size={24} />
                            Compra #{venta.idVenta}
                          </div>
                          <div className="venta-fecha">
                            {VentaHelpers.formatearFecha(venta.fecha_venta)}
                          </div>
                        </div>
                        <div className="venta-estado">
                          {completada ? (
                            <span className="badge badge-success">
                              <MdCheckCircle size={16} />
                              Pagada
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              <MdWarning size={16} />
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detalles básicos */}
                      <div className="venta-detalles">
                        <div className="detalle-item">
                          <span className="detalle-label">Productos</span>
                          <span className="detalle-value">
                            {venta.cantidad_productos}
                          </span>
                        </div>
                        <div className="detalle-item">
                          <span className="detalle-label">Subtotal</span>
                          <span className="detalle-value">
                            {VentaHelpers.formatearPrecio(venta.subtotal)}
                          </span>
                        </div>
                        {parseFloat(venta.interes) > 0 && (
                          <div className="detalle-item">
                            <span className="detalle-label">Interés</span>
                            <span className="detalle-value interes">
                              +{VentaHelpers.formatearPrecio(venta.interes)}
                            </span>
                          </div>
                        )}
                        <div className="detalle-item total">
                          <span className="detalle-label">Total</span>
                          <span className="detalle-value">
                            {VentaHelpers.formatearPrecio(venta.total)}
                          </span>
                        </div>
                      </div>

                      {/* Método de pago */}
                      <div className="venta-metodo">
                        <MdPayment size={18} />
                        {VentaHelpers.obtenerDescripcionMetodoPago(
                          venta.nrocuotas
                        )}
                      </div>

                      {/* Progreso de pago (si hay cuotas) */}
                      {venta.cuotas && venta.cuotas.length > 0 && (
                        <div className="venta-progreso">
                          <div className="progreso-header">
                            <span>Progreso de Pago</span>
                            <span>{progreso}%</span>
                          </div>
                          <div className="progreso-bar">
                            <div
                              className="progreso-fill"
                              style={{ width: `${progreso}%` }}
                            ></div>
                          </div>
                          <div className="progreso-info">
                            {venta.cuotas.filter((c) => c.pagada).length} de{" "}
                            {venta.cuotas.length} cuotas pagadas
                          </div>
                        </div>
                      )}

                      {/* Botón expandir */}
                      <button
                        className="btn-expandir"
                        onClick={() =>
                          setVentaExpandida(
                            ventaExpandida === venta.idVenta
                              ? null
                              : venta.idVenta
                          )
                        }
                      >
                        {ventaExpandida === venta.idVenta ? (
                          <>
                            <MdExpandLess size={20} />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <MdExpandMore size={20} />
                            Ver detalles
                          </>
                        )}
                      </button>

                      {/* Contenido expandido */}
                      {ventaExpandida === venta.idVenta && (
                        <div className="venta-expandida">
                          {/* Productos comprados */}
                          <div className="seccion-expandida">
                            <h4>Productos Comprados</h4>
                            <div className="productos-comprados">
                              {venta.detalles.map((detalle) => (
                                <div
                                  key={detalle.idDetalleVenta}
                                  className="producto-comprado"
                                >
                                  <div className="producto-nombre">
                                    {detalle.nombre_producto}
                                  </div>
                                  <div className="producto-cantidad">
                                    Cantidad: {detalle.cantidad}
                                  </div>
                                  <div className="producto-precio">
                                    {VentaHelpers.formatearPrecio(
                                      detalle.precio
                                    )}{" "}
                                    c/u
                                  </div>
                                  <div className="producto-subtotal">
                                    {VentaHelpers.formatearPrecio(
                                      detalle.subtotal
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cuotas */}
                          {venta.cuotas && venta.cuotas.length > 0 && (
                            <div className="seccion-expandida">
                              <h4>Cuotas de Pago</h4>
                              <div className="cuotas-lista-mini">
                                {VentaHelpers.ordenarCuotasPorVencimiento(
                                  venta.cuotas
                                ).map((cuota) => {
                                  const estado =
                                    VentaHelpers.obtenerEstadoCuota(cuota);
                                  return (
                                    <div
                                      key={cuota.idCuota}
                                      className={`cuota-mini ${
                                        cuota.pagada ? "pagada" : ""
                                      }`}
                                    >
                                      <div className="cuota-numero">
                                        Cuota {cuota.numero_cuota}
                                      </div>
                                      <div className="cuota-monto">
                                        {VentaHelpers.formatearPrecio(
                                          cuota.monto
                                        )}
                                      </div>
                                      <div className="cuota-vencimiento">
                                        {VentaHelpers.formatearFecha(
                                          cuota.fecha_vencimiento
                                        )}
                                      </div>
                                      <span
                                        className={`cuota-estado badge-${estado.badge}`}
                                      >
                                        {estado.texto}
                                      </span>
                                      {!cuota.pagada && (
                                        <button
                                          className="btn-pagar-mini"
                                          onClick={() =>
                                            handlePagarCuota(cuota.idCuota)
                                          }
                                          disabled={
                                            procesandoPago === cuota.idCuota
                                          }
                                        >
                                          {procesandoPago === cuota.idCuota
                                            ? "Procesando..."
                                            : "Pagar"}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============================================================ */}
        {/* VISTA DE CUOTAS */}
        {/* ============================================================ */}
        {vista === "cuotas" && (
          <>
            {/* Estadísticas */}
            {!loading && cuotas.length > 0 && (
              <div className="cuotas-estadisticas">
                <div className="stat-card">
                  <div className="stat-icon">
                    <MdReceipt />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Cuotas</span>
                    <span className="stat-value">{estadisticas.total}</span>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">
                    <MdWarning />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Pendientes</span>
                    <span className="stat-value">
                      {estadisticas.pendientes}
                    </span>
                  </div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">
                    <MdCheckCircle />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Pagadas</span>
                    <span className="stat-value">{estadisticas.pagadas}</span>
                  </div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-icon">
                    <MdError />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Vencidas</span>
                    <span className="stat-value">{estadisticas.vencidas}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Filtros */}
            {!loading && cuotas.length > 0 && (
              <div className="cuotas-filtros">
                <button
                  className={`filtro-btn ${
                    filtroCuotas === "todas" ? "active" : ""
                  }`}
                  onClick={() => setFiltroCuotas("todas")}
                >
                  Todas
                </button>
                <button
                  className={`filtro-btn ${
                    filtroCuotas === "pendientes" ? "active" : ""
                  }`}
                  onClick={() => setFiltroCuotas("pendientes")}
                >
                  Pendientes
                </button>
                <button
                  className={`filtro-btn ${
                    filtroCuotas === "pagadas" ? "active" : ""
                  }`}
                  onClick={() => setFiltroCuotas("pagadas")}
                >
                  Pagadas
                </button>
                <button
                  className={`filtro-btn ${
                    filtroCuotas === "vencidas" ? "active" : ""
                  }`}
                  onClick={() => setFiltroCuotas("vencidas")}
                >
                  Vencidas
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="cuotas-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="cuota-card">
                    <Skeleton height={200} />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="ventas-error">
                <MdError size={64} />
                <h3>Error al cargar cuotas</h3>
                <p>{error}</p>
                <button className="btn-retry" onClick={cargarCuotas}>
                  Reintentar
                </button>
              </div>
            )}

            {/* Sin cuotas */}
            {!loading && !error && cuotas.length === 0 && (
              <div className="ventas-vacio">
                <MdPayment size={80} />
                <h3>No tienes cuotas registradas</h3>
                <p>
                  Las cuotas aparecerán cuando realices compras con
                  financiamiento
                </p>
              </div>
            )}

            {/* Lista de cuotas */}
            {!loading && !error && cuotasFiltradas().length > 0 && (
              <div className="cuotas-grid">
                {cuotasFiltradas().map((cuota) => {
                  const estado = VentaHelpers.obtenerEstadoCuota(cuota);
                  const dias = VentaHelpers.diasParaVencimiento(cuota);

                  return (
                    <div
                      key={cuota.idCuota}
                      className={`cuota-card ${cuota.pagada ? "pagada" : ""} ${
                        VentaHelpers.estaVencida(cuota) ? "vencida" : ""
                      }`}
                    >
                      <div className="cuota-header-card">
                        <div className="cuota-numero-badge">
                          <MdReceipt size={20} />
                          Cuota #{cuota.numero_cuota}
                        </div>
                        <span className={`badge badge-${estado.badge}`}>
                          {estado.texto}
                        </span>
                      </div>

                      <div className="cuota-monto-grande">
                        <MdAttachMoney size={32} />
                        {VentaHelpers.formatearPrecio(cuota.monto)}
                      </div>

                      <div className="cuota-detalles-card">
                        <div className="cuota-detalle-row">
                          <MdCalendarToday size={18} />
                          <div>
                            <span className="label">Vence:</span>
                            <span className="value">
                              {VentaHelpers.formatearFecha(
                                cuota.fecha_vencimiento
                              )}
                            </span>
                          </div>
                        </div>

                        {!cuota.pagada && dias > 0 && (
                          <div className="cuota-dias-restantes">
                            {dias} días restantes
                          </div>
                        )}

                        {cuota.pagada && cuota.fecha_pago && (
                          <div className="cuota-detalle-row">
                            <MdCheckCircle size={18} />
                            <div>
                              <span className="label">Pagada el:</span>
                              <span className="value">
                                {VentaHelpers.formatearFecha(cuota.fecha_pago)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!cuota.pagada && (
                        <button
                          className="btn-pagar-cuota"
                          onClick={() => handlePagarCuota(cuota.idCuota)}
                          disabled={procesandoPago === cuota.idCuota}
                        >
                          {procesandoPago === cuota.idCuota ? (
                            "Procesando..."
                          ) : (
                            <>
                              <MdPayment size={20} />
                              Pagar Ahora
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sin resultados con filtro */}
            {!loading &&
              !error &&
              cuotas.length > 0 &&
              cuotasFiltradas().length === 0 && (
                <div className="ventas-vacio">
                  <MdPayment size={80} />
                  <h3>No hay cuotas {filtroCuotas}</h3>
                  <p>Prueba con otro filtro</p>
                </div>
              )}
          </>
        )}
      </div>

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  );
}
