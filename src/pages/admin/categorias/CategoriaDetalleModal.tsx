// ============================================================
// 👁️ MODAL DE DETALLE DE CATEGORÍA
// ============================================================
// Modal para visualizar información completa de una categoría
// Características:
// - Vista de solo lectura
// - Información organizada en secciones
// - Avatar con color y iniciales
// - Fechas de creación y modificación
// - Botón rápido para editar
// ============================================================

import { MdClose, MdEdit, MdCategory } from "react-icons/md";
import { CategoriaHelpers } from "../../../services/categoria";
import type { Categoria } from "../../../services/categoria";

/**
 * Props del modal de detalle
 */
interface CategoriaDetalleModalProps {
  categoria: Categoria;
  onClose: () => void;
  onEditar: (categoria: Categoria) => void;
}

/**
 * Modal de visualización de detalles de la categoría
 */
export default function CategoriaDetalleModal({
  categoria,
  onClose,
  onEditar,
}: CategoriaDetalleModalProps) {
  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Abre el modal de edición
   */
  const handleEditar = () => {
    onClose(); // Cerrar este modal
    onEditar(categoria); // Abrir modal de edición
  };

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-detalle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <MdCategory className="modal-icon" />
            <h2>Detalles de la Categoría</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Avatar y nombre principal */}
          <div className="detalle-header">
            <div
              className="detalle-avatar"
              style={{
                backgroundColor: CategoriaHelpers.obtenerColorCategoria(
                  categoria.nombre
                ),
              }}
            >
              {CategoriaHelpers.obtenerInicialesCategoria(categoria)}
            </div>
            <div className="detalle-header-info">
              <h3 className="detalle-nombre">{categoria.nombre}</h3>
              <p className="detalle-descripcion">
                {CategoriaHelpers.obtenerDescripcion(categoria)}
              </p>
            </div>
          </div>

          {/* Información básica */}
          <div className="detalle-section">
            <h4 className="section-title">Información Básica</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">ID de la Categoría:</span>
                <span className="detalle-value">{categoria.idCategoria}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Nombre:</span>
                <span className="detalle-value">{categoria.nombre}</span>
              </div>
            </div>
          </div>

          {/* Descripción extendida */}
          <div className="detalle-section">
            <h4 className="section-title">Descripción</h4>
            <div className="detalle-descripcion-box">
              {categoria.descripcion && categoria.descripcion.trim() !== "" ? (
                <p>{categoria.descripcion}</p>
              ) : (
                <p className="sin-datos">Sin descripción proporcionada</p>
              )}
            </div>
          </div>

          {/* Información del color */}
          <div className="detalle-section">
            <h4 className="section-title">Apariencia</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Color Asignado:</span>
                <div className="color-preview">
                  <div
                    className="color-circle"
                    style={{
                      backgroundColor: CategoriaHelpers.obtenerColorCategoria(
                        categoria.nombre
                      ),
                    }}
                  ></div>
                  <span className="detalle-value">
                    {CategoriaHelpers.obtenerColorCategoria(categoria.nombre)}
                  </span>
                </div>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Iniciales:</span>
                <span className="detalle-value">
                  {CategoriaHelpers.obtenerInicialesCategoria(categoria)}
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
                  {CategoriaHelpers.formatearFecha(categoria.fecha_creacion)}
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Última Modificación:</span>
                <span className="detalle-value">
                  {CategoriaHelpers.formatearFecha(
                    categoria.fecha_modificacion
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="info-box">
            <MdCategory size={20} />
            <div>
              <p className="info-title">Sobre esta categoría</p>
              <p className="info-text">
                Esta categoría agrupa productos relacionados. No se puede
                eliminar si tiene productos asociados. Asegúrate de que el
                nombre y descripción sean claros para los usuarios.
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
            Editar Categoría
          </button>
        </div>
      </div>
    </div>
  );
}
