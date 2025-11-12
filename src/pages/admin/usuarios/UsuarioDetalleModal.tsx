import React from "react";
import {
  MdClose,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBadge,
  MdCalendarToday,
  MdCheckCircle,
  MdError,
  MdPerson,
} from "react-icons/md";
import { UsuarioHelpers } from "../../../services/usuarios";
import type { Usuario } from "../../../services/usuarios";
import "../../../Styles/usuarios.css";

interface UsuarioDetalleModalProps {
  usuario: Usuario;
  onClose: () => void;
}

const UsuarioDetalleModal: React.FC<UsuarioDetalleModalProps> = ({
  usuario,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <MdPerson size={28} />
            Detalles del Usuario
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="modal-body">
          {/* Avatar y nombre */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              className="usuario-avatar"
              style={{
                width: "100px",
                height: "100px",
                fontSize: "2.5rem",
                margin: "0 auto 16px",
                background: UsuarioHelpers.obtenerColorRol(usuario.nombre_rol),
              }}
            >
              {UsuarioHelpers.obtenerInicialesUsuario(usuario)}
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "1.5rem",
                color: "var(--text-dark)",
              }}
            >
              {UsuarioHelpers.obtenerNombre(usuario)}
            </h3>
            <div
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <span
                className="usuario-badge badge-rol"
                style={{
                  background: UsuarioHelpers.obtenerColorRol(
                    usuario.nombre_rol
                  ),
                }}
              >
                {usuario.nombre_rol}
              </span>
              <span
                className={`usuario-badge badge-status ${
                  !usuario.activo ? "inactivo" : ""
                }`}
              >
                {usuario.activo ? (
                  <>
                    <MdCheckCircle size={14} /> Activo
                  </>
                ) : (
                  <>
                    <MdError size={14} /> Inactivo
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Información de contacto */}
          <div
            style={{
              background: "var(--input-bg)",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "var(--wine)",
                fontSize: "1.1rem",
              }}
            >
              Información de Contacto
            </h4>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="usuario-info-item">
                <MdEmail className="usuario-info-icon" />
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    Email
                  </div>
                  <div style={{ fontWeight: 600 }}>{usuario.email}</div>
                </div>
              </div>

              {usuario.telefono && (
                <div className="usuario-info-item">
                  <MdPhone className="usuario-info-icon" />
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      Teléfono
                    </div>
                    <div style={{ fontWeight: 600 }}>{usuario.telefono}</div>
                  </div>
                </div>
              )}

              {usuario.direccion && (
                <div className="usuario-info-item">
                  <MdLocationOn className="usuario-info-icon" />
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      Dirección
                    </div>
                    <div style={{ fontWeight: 600 }}>{usuario.direccion}</div>
                  </div>
                </div>
              )}

              {usuario.ci && (
                <div className="usuario-info-item">
                  <MdBadge className="usuario-info-icon" />
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      CI/Documento
                    </div>
                    <div style={{ fontWeight: 600 }}>{usuario.ci}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del sistema */}
          <div
            style={{
              background: "var(--input-bg)",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "var(--wine)",
                fontSize: "1.1rem",
              }}
            >
              Información del Sistema
            </h4>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="usuario-info-item">
                <MdBadge className="usuario-info-icon" />
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    ID de Usuario
                  </div>
                  <div style={{ fontWeight: 600 }}>{usuario.idUsuario}</div>
                </div>
              </div>

              <div className="usuario-info-item">
                <MdCalendarToday className="usuario-info-icon" />
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    Fecha de Creación
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {UsuarioHelpers.formatearFecha(usuario.fecha_creacion)}
                  </div>
                </div>
              </div>

              <div className="usuario-info-item">
                <MdCalendarToday className="usuario-info-icon" />
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    Última Modificación
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {UsuarioHelpers.formatearFecha(usuario.fecha_modificacion)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            <MdClose size={20} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;
