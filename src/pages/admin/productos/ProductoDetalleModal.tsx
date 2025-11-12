// ============================================================
// 👁️ MODAL DE DETALLE DE PRODUCTO
// ============================================================
// Modal para visualizar información completa de un producto
// Características:
// - Vista de solo lectura
// - Información organizada en secciones
// - Imagen del producto
// - Indicadores de stock con colores
// - Información de categoría
// - Fechas de creación y modificación
// - Botón rápido para editar
// ============================================================

import { MdClose, MdEdit, MdShoppingCart, MdCategory } from "react-icons/md";
import { ProductoHelpers } from "../../../services/producto";
import type { Producto } from "../../../services/producto";

/**
 * Props del modal de detalle
 */
interface ProductoDetalleModalProps {
  producto: Producto;
  onClose: () => void;
  onEditar: (producto: Producto) => void;
}

/**
 * Modal de visualización de detalles del producto
 */
export default function ProductoDetalleModal({
  producto,
  onClose,
  onEditar,
}: ProductoDetalleModalProps) {
  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Abre el modal de edición
   */
  const handleEditar = () => {
    onClose(); // Cerrar este modal
    onEditar(producto); // Abrir modal de edición
  };

  /**
   * Obtener estado del stock
   */
  const estadoStock = ProductoHelpers.obtenerEstadoStock(producto.stock);

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-detalle modal-producto-detalle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <MdShoppingCart className="modal-icon" />
            <h2>Detalles del Producto</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Imagen y nombre principal */}
          <div className="detalle-header detalle-header-producto">
            <div className="detalle-imagen-wrapper">
              <img
                src={ProductoHelpers.obtenerImagenUrl(producto)}
                alt={producto.nombre}
                className="detalle-imagen"
              />
            </div>
            <div className="detalle-header-info">
              <h3 className="detalle-nombre">{producto.nombre}</h3>
              <div className="detalle-categoria-badge">
                <MdCategory size={16} />
                {ProductoHelpers.obtenerNombreCategoria(producto)}
              </div>
              <div className="detalle-precio-grande">
                {ProductoHelpers.formatearPrecio(producto.precio)}
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="detalle-section">
            <h4 className="section-title">Información Básica</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">ID del Producto:</span>
                <span className="detalle-value">{producto.idProducto}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Nombre:</span>
                <span className="detalle-value">{producto.nombre}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Precio:</span>
                <span className="detalle-value">
                  {ProductoHelpers.formatearPrecio(producto.precio)}
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Stock Actual:</span>
                <span className="detalle-value">
                  <span
                    className="stock-inline-badge"
                    style={{ backgroundColor: estadoStock.color }}
                  >
                    {producto.stock} unidades - {estadoStock.texto}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Información de categoría */}
          <div className="detalle-section">
            <h4 className="section-title">Categoría</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">ID Categoría:</span>
                <span className="detalle-value">
                  {producto.categoria.idCategoria}
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Nombre Categoría:</span>
                <span className="detalle-value">
                  {producto.categoria.nombre}
                </span>
              </div>
              {producto.categoria.descripcion && (
                <div className="detalle-item detalle-item-full">
                  <span className="detalle-label">
                    Descripción de Categoría:
                  </span>
                  <span className="detalle-value">
                    {producto.categoria.descripcion}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información de inventario */}
          <div className="detalle-section">
            <h4 className="section-title">Inventario</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Estado de Stock:</span>
                <span className="detalle-value">
                  <span
                    className="stock-inline-badge"
                    style={{ backgroundColor: estadoStock.color }}
                  >
                    {estadoStock.texto}
                  </span>
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Cantidad Disponible:</span>
                <span className="detalle-value">{producto.stock} unidades</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Valor en Inventario:</span>
                <span className="detalle-value">
                  {ProductoHelpers.formatearPrecio(
                    producto.precio * producto.stock
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="detalle-section">
            <h4 className="section-title">Fechas</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Fecha de Creación:</span>
                <span className="detalle-value">
                  {ProductoHelpers.formatearFecha(producto.fecha_creacion)}
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Última Modificación:</span>
                <span className="detalle-value">
                  {ProductoHelpers.formatearFecha(producto.fecha_modificacion)}
                </span>
              </div>
            </div>
          </div>

          {/* Información de imagen */}
          {producto.imagen && (
            <div className="detalle-section">
              <h4 className="section-title">Imagen</h4>
              <div className="detalle-grid">
                <div className="detalle-item detalle-item-full">
                  <span className="detalle-label">URL de Imagen:</span>
                  <span className="detalle-value detalle-value-url">
                    {producto.imagen_url || producto.imagen}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Nota informativa */}
          <div className="info-box">
            <MdShoppingCart size={20} />
            <div>
              <p className="info-title">Sobre este producto</p>
              <p className="info-text">
                Este producto pertenece a la categoría{" "}
                <strong>{producto.categoria.nombre}</strong>. El stock actual es
                de <strong>{producto.stock} unidades</strong> con un valor total
                de inventario de{" "}
                <strong>
                  {ProductoHelpers.formatearPrecio(
                    producto.precio * producto.stock
                  )}
                </strong>
                .{" "}
                {producto.stock === 0
                  ? "⚠️ Producto agotado. Considera reabastecer."
                  : producto.stock <= 10
                  ? "⚠️ Stock bajo. Considera reabastecer pronto."
                  : "✅ Stock suficiente."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn-editar" onClick={handleEditar}>
            <MdEdit size={20} />
            Editar Producto
          </button>
        </div>
      </div>
    </div>
  );
}
