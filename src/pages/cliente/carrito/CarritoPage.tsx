// ============================================================
// 🛒 PÁGINA DE CARRITO DE COMPRAS
// ============================================================
// Carrito de compras con funcionalidades completas:
// - Ver productos agregados
// - Modificar cantidades
// - Eliminar productos
// - Seleccionar método de pago (al contado o cuotas)
// - Procesar compra con Stripe
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdShoppingCart,
  MdDelete,
  MdAdd,
  MdRemove,
  MdArrowBack,
  MdPayment,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";
import { useCart } from "../../../context/CartContext";
import VentaClienteService, {
  VentaHelpers,
  type CrearCompraDTO,
  type RespuestaCompraContado,
  type RespuestaCompraCuotas,
} from "../../../services/ventaCliente";
import toast, { Toaster } from "react-hot-toast";
import "../../../Styles/carrito.css";

type MetodoPago = 1 | 3 | 6 | 12;

export default function CarritoPage() {
  const navigate = useNavigate();
  const { items, remove, clear, add } = useCart();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(1);

  // Calcular totales con intereses
  const preciosMap = new Map(
    items.map((item) => [parseInt(item.id), item.price])
  );
  const detalles = items.map((item) => ({
    producto: parseInt(item.id),
    cantidad: item.qty || 1,
  }));

  const {
    subtotal,
    interes,
    total: totalConInteres,
  } = VentaHelpers.calcularTotalCompra(detalles, preciosMap, metodoPago);

  // Funciones para manejar cantidad
  const handleIncrementarCantidad = (item: (typeof items)[0]) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1,
    });
  };

  const handleDecrementarCantidad = (item: (typeof items)[0]) => {
    if ((item.qty || 1) <= 1) {
      remove(item.id);
    } else {
      add({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: -1,
      });
    }
  };

  // Procesar compra
  const handleProcesarCompra = async () => {
    if (items.length === 0) {
      toast.error("El carrito está vacío", {
        position: "top-center",
      });
      return;
    }

    try {
      setProcesando(true);
      setError(null);

      const compra: CrearCompraDTO = {
        metodoPago: 1, // 1 = Tarjeta
        nrocuotas: metodoPago,
        detalles: items.map((item) => ({
          producto: parseInt(item.id),
          cantidad: item.qty || 1,
        })),
      };

      // Validar antes de enviar
      const validacion = VentaHelpers.validarDatosCompra(compra);
      if (!validacion.valido) {
        toast.error(validacion.error || "Error en los datos de compra", {
          position: "top-center",
        });
        return;
      }

      const respuesta = await VentaClienteService.crearCompra(compra);

      // Si es al contado (1 cuota), redirigir a Stripe
      if (metodoPago === 1) {
        const resp = respuesta as RespuestaCompraContado;
        toast.loading("Redirigiendo a la pasarela de pago...", {
          position: "top-center",
          duration: 2000,
        });
        setTimeout(() => {
          window.location.href = resp.checkout_url;
        }, 1500);
      } else {
        // Si es con cuotas, mostrar confirmación
        const resp = respuesta as RespuestaCompraCuotas;
        toast.success(
          `¡Compra exitosa! Se generaron ${
            resp.cuotas_generadas
          } cuotas de ${VentaHelpers.formatearPrecio(
            resp.monto_por_cuota
          )} cada una.`,
          {
            duration: 4000,
            position: "top-center",
            icon: "🎉",
          }
        );
        clear();
        setTimeout(() => navigate("/ventas"), 2000);
      }
    } catch (err: any) {
      console.error("Error al procesar compra:", err);
      const errorMsg =
        err.response?.data?.error ||
        "Error al procesar la compra. Intente nuevamente.";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="carrito-page">
      {/* Header */}
      <div className="carrito-header">
        <div className="carrito-header-content">
          <button className="btn-back" onClick={() => navigate("/catalogo")}>
            <MdArrowBack size={24} />
            Volver al Catálogo
          </button>
          <h1 className="carrito-title">
            <MdShoppingCart />
            Mi Carrito
          </h1>
          <div className="carrito-badge">{items.length} productos</div>
        </div>
      </div>

      <div className="carrito-content">
        {/* Carrito vacío */}
        {items.length === 0 && (
          <div className="carrito-vacio">
            <MdShoppingCart size={80} />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos desde el catálogo para comenzar tu compra</p>
            <button
              className="btn-catalogo"
              onClick={() => navigate("/catalogo")}
            >
              Ir al Catálogo
            </button>
          </div>
        )}

        {/* Contenido del carrito */}
        {items.length > 0 && (
          <div className="carrito-grid">
            {/* Lista de productos */}
            <div className="productos-section">
              <div className="productos-header">
                <h2>Productos ({items.length})</h2>
                <button className="btn-clear" onClick={clear}>
                  <MdDelete size={20} />
                  Vaciar Carrito
                </button>
              </div>

              <div className="productos-lista">
                {items.map((item) => (
                  <div key={item.id} className="producto-item">
                    <div className="producto-imagen">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                      />
                    </div>

                    <div className="producto-info">
                      <h3>{item.name}</h3>
                      <p className="producto-precio">
                        {VentaHelpers.formatearPrecio(item.price)}
                      </p>
                    </div>

                    <div className="producto-cantidad">
                      <button
                        className="btn-qty"
                        onClick={() => handleDecrementarCantidad(item)}
                        title="Disminuir cantidad"
                      >
                        <MdRemove size={18} />
                      </button>
                      <span className="qty-value">{item.qty || 1}</span>
                      <button
                        className="btn-qty"
                        onClick={() => handleIncrementarCantidad(item)}
                        title="Aumentar cantidad"
                      >
                        <MdAdd size={18} />
                      </button>
                    </div>

                    <div className="producto-subtotal">
                      <p className="subtotal-label">Subtotal</p>
                      <p className="subtotal-value">
                        {VentaHelpers.formatearPrecio(
                          item.price * (item.qty || 1)
                        )}
                      </p>
                    </div>

                    <button
                      className="btn-eliminar"
                      onClick={() => remove(item.id)}
                      title="Eliminar producto"
                    >
                      <MdDelete size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen y pago */}
            <div className="resumen-section">
              <div className="resumen-card">
                <h2>Resumen de Compra</h2>

                {/* Método de pago */}
                <div className="metodo-pago-section">
                  <h3>
                    <MdPayment size={20} />
                    Método de Pago
                  </h3>
                  <div className="metodos-lista">
                    <button
                      className={`metodo-btn ${
                        metodoPago === 1 ? "active" : ""
                      }`}
                      onClick={() => setMetodoPago(1)}
                    >
                      <MdCheckCircle size={20} />
                      <div>
                        <strong>Al Contado</strong>
                        <span>Sin interés</span>
                      </div>
                    </button>
                    <button
                      className={`metodo-btn ${
                        metodoPago === 3 ? "active" : ""
                      }`}
                      onClick={() => setMetodoPago(3)}
                    >
                      <MdCheckCircle size={20} />
                      <div>
                        <strong>3 Cuotas</strong>
                        <span>19% de interés</span>
                      </div>
                    </button>
                    <button
                      className={`metodo-btn ${
                        metodoPago === 6 ? "active" : ""
                      }`}
                      onClick={() => setMetodoPago(6)}
                    >
                      <MdCheckCircle size={20} />
                      <div>
                        <strong>6 Cuotas</strong>
                        <span>15% de interés</span>
                      </div>
                    </button>
                    <button
                      className={`metodo-btn ${
                        metodoPago === 12 ? "active" : ""
                      }`}
                      onClick={() => setMetodoPago(12)}
                    >
                      <MdCheckCircle size={20} />
                      <div>
                        <strong>12 Cuotas</strong>
                        <span>12% de interés</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Detalle de costos */}
                <div className="resumen-detalle">
                  <div className="resumen-row">
                    <span>Subtotal ({items.length} productos)</span>
                    <strong>{VentaHelpers.formatearPrecio(subtotal)}</strong>
                  </div>
                  {interes > 0 && (
                    <div className="resumen-row interes">
                      <span>Interés ({metodoPago} cuotas)</span>
                      <strong>{VentaHelpers.formatearPrecio(interes)}</strong>
                    </div>
                  )}
                  <div className="resumen-divider"></div>
                  <div className="resumen-row total">
                    <span>Total a Pagar</span>
                    <strong className="total-value">
                      {VentaHelpers.formatearPrecio(totalConInteres)}
                    </strong>
                  </div>
                  {metodoPago > 1 && (
                    <div className="resumen-row cuotas-info">
                      <span>Monto por cuota</span>
                      <strong>
                        {VentaHelpers.formatearPrecio(
                          totalConInteres / metodoPago
                        )}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="error-message">
                    <MdClose size={20} />
                    {error}
                  </div>
                )}

                {/* Botón de compra */}
                <button
                  className="btn-comprar"
                  onClick={handleProcesarCompra}
                  disabled={procesando}
                >
                  {procesando ? (
                    <>Procesando...</>
                  ) : metodoPago === 1 ? (
                    <>Proceder al Pago</>
                  ) : (
                    <>Confirmar Compra con Cuotas</>
                  )}
                </button>

                <p className="nota-pago">
                  {metodoPago === 1
                    ? "Serás redirigido a Stripe para completar el pago de forma segura."
                    : `Se creará la compra y podrás pagar las ${metodoPago} cuotas individualmente desde tu historial.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  );
}
