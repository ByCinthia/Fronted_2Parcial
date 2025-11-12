// ============================================================
// 👁️ MODAL DE DETALLE DE ROL
// ============================================================
// Modal para visualizar información completa de un rol
// Características:
// - Vista de solo lectura
// - Información organizada en secciones
// - Avatar con color y iniciales
// - Botón rápido para editar
// ============================================================

import { MdClose, MdEdit, MdSecurity } from "react-icons/md";
import { RolHelpers } from "../../../services/rol";
import type { Rol } from "../../../services/rol";

/**
 * Props del modal de detalle
 */
interface RolDetalleModalProps {
  rol: Rol;
  onClose: () => void;
  onEditar: (rol: Rol) => void;
}

/**
 * Modal de visualización de detalles del rol
 */
export default function RolDetalleModal({
  rol,
  onClose,
  onEditar,
}: RolDetalleModalProps) {
  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Abre el modal de edición
   */
  const handleEditar = () => {
    onClose(); // Cerrar este modal
    onEditar(rol); // Abrir modal de edición
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
            <MdSecurity className="modal-icon" />
            <h2>Detalles del Rol</h2>
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
                backgroundColor: RolHelpers.obtenerColorRol(rol.nombre),
              }}
            >
              {RolHelpers.obtenerInicialesRol(rol)}
            </div>
            <div className="detalle-header-info">
              <h3 className="detalle-nombre">{rol.nombre}</h3>
              <p className="detalle-descripcion">
                {RolHelpers.obtenerDescripcion(rol)}
              </p>
            </div>
          </div>

          {/* Información básica */}
          <div className="detalle-section">
            <h4 className="section-title">Información Básica</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">ID del Rol:</span>
                <span className="detalle-value">{rol.idRol}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Nombre:</span>
                <span className="detalle-value">{rol.nombre}</span>
              </div>
            </div>
          </div>

          {/* Descripción extendida */}
          <div className="detalle-section">
            <h4 className="section-title">Descripción</h4>
            <div className="detalle-descripcion-box">
              {rol.descripcion && rol.descripcion.trim() !== "" ? (
                <p>{rol.descripcion}</p>
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
                      backgroundColor: RolHelpers.obtenerColorRol(rol.nombre),
                    }}
                  ></div>
                  <span className="detalle-value">
                    {RolHelpers.obtenerColorRol(rol.nombre)}
                  </span>
                </div>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Iniciales:</span>
                <span className="detalle-value">
                  {RolHelpers.obtenerInicialesRol(rol)}
                </span>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="info-box">
            <MdSecurity size={20} />
            <div>
              <p className="info-title">Sobre este rol</p>
              <p className="info-text">
                Este rol puede ser asignado a usuarios del sistema. Asegúrate de
                que el nombre y descripción sean claros para facilitar la
                gestión de permisos.
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
            Editar Rol
          </button>
        </div>
      </div>
    </div>
  );
}
