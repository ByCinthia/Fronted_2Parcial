import React, { useState, useEffect } from "react";
import {
  MdSettings,
  MdSearch,
  MdAdd,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdEdit,
  MdDelete,
  MdPerson,
  MdCalendarToday,
  MdCheckCircle,
  MdError,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../Styles/usuarios.css";
import {
  UsuarioService,
  UsuarioHelpers,
  manejarErrorUsuario,
} from "../../../services/usuarios";
import type { Usuario } from "../../../services/usuarios";
import UsuarioDetalleModal from "./UsuarioDetalleModal.tsx";
import UsuarioFormModal from "./UsuarioFormModal.tsx";

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "activos" | "inactivos">(
    "todos"
  );
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "edit" | "view" | "delete"
  >("view");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UsuarioService.listar();
      console.log("Usuarios recibidos del servidor:", data);

      // Validar que data sea un array
      if (!Array.isArray(data)) {
        console.error("La respuesta no es un array:", data);
        setError(
          "Error: La respuesta del servidor no tiene el formato esperado"
        );
        setUsuarios([]);
        return;
      }

      // Normalizar datos: asegurar valores por defecto
      const usuariosNormalizados = data.map((u) => ({
        ...u,
        activo: u.activo !== undefined ? u.activo : true,
        nombre_rol: u.nombre_rol || "Usuario",
      }));

      console.log("Usuarios normalizados:", usuariosNormalizados);
      setUsuarios(usuariosNormalizados);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError(manejarErrorUsuario(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (query: string) => {
    setBusqueda(query);
    if (query.trim() === "") {
      cargarUsuarios();
      return;
    }

    try {
      setLoading(true);
      const data = await UsuarioService.buscar(query);
      setUsuarios(data);
    } catch (err) {
      setError(manejarErrorUsuario(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async (id: number) => {
    if (!window.confirm("¿Estás seguro de desactivar este usuario?")) return;

    try {
      await UsuarioService.desactivar(id);
      cargarUsuarios();
      setShowModal(false);
    } catch (err) {
      setError(manejarErrorUsuario(err));
    }
  };

  const usuariosFiltrados = () => {
    let resultado = usuarios;

    // Filtrar usuarios con datos válidos (acepta nombre o username)
    resultado = resultado.filter(
      (u) => u && (u.nombre || u.username) && u.email
    );

    if (filtro === "activos") {
      resultado = UsuarioHelpers.filtrarActivos(resultado);
    } else if (filtro === "inactivos") {
      resultado = UsuarioHelpers.filtrarInactivos(resultado);
    }

    return resultado;
  };

  const openModal = (
    type: typeof modalType,
    usuario: Usuario | null = null
  ) => {
    setModalType(type);
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUsuario(null);
  };

  const totales = {
    total: usuarios.length,
    activos: UsuarioHelpers.filtrarActivos(usuarios).length,
    inactivos: UsuarioHelpers.filtrarInactivos(usuarios).length,
  };

  return (
    <div className="usuarios-container">
      {/* Header con búsqueda y filtros */}
      <div className="usuarios-header-wrapper">
        <div className="usuarios-header-content">
          <div className="usuarios-header-top">
            <div className="usuarios-title-section">
              <div className="usuarios-title-icon">
                <MdSettings />
              </div>
              <div>
                <h1>Gestión de Usuarios</h1>
              </div>
            </div>

            <div className="usuarios-stats">
              <div className="usuarios-stat-item">
                <div className="usuarios-stat-value">{totales.total}</div>
                <div className="usuarios-stat-label">Total</div>
              </div>
              <div className="usuarios-stat-item">
                <div className="usuarios-stat-value">{totales.activos}</div>
                <div className="usuarios-stat-label">Activos</div>
              </div>
              <div className="usuarios-stat-item">
                <div className="usuarios-stat-value">{totales.inactivos}</div>
                <div className="usuarios-stat-label">Inactivos</div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => openModal("create")}
            >
              <MdAdd size={20} />
              Nuevo Usuario
            </button>
          </div>

          <div className="usuarios-search-section">
            <div className="usuarios-search-box">
              <MdSearch className="usuarios-search-icon" />
              <input
                type="text"
                className="usuarios-search-input"
                placeholder="Buscar por nombre, email, teléfono o CI..."
                value={busqueda}
                onChange={(e) => handleBuscar(e.target.value)}
              />
            </div>

            <div className="usuarios-filters">
              <button
                className={`filter-chip ${filtro === "todos" ? "active" : ""}`}
                onClick={() => setFiltro("todos")}
              >
                Todos
                <span className="filter-chip-count">{totales.total}</span>
              </button>
              <button
                className={`filter-chip ${
                  filtro === "activos" ? "active" : ""
                }`}
                onClick={() => setFiltro("activos")}
              >
                <MdCheckCircle size={16} />
                Activos
                <span className="filter-chip-count">{totales.activos}</span>
              </button>
              <button
                className={`filter-chip ${
                  filtro === "inactivos" ? "active" : ""
                }`}
                onClick={() => setFiltro("inactivos")}
              >
                <MdError size={16} />
                Inactivos
                <span className="filter-chip-count">{totales.inactivos}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="usuarios-content">
        {error && (
          <div
            style={{
              padding: "16px",
              background: "#fee",
              color: "#c00",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="usuarios-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card">
                <div style={{ display: "flex", gap: "16px" }}>
                  <Skeleton width={64} height={64} borderRadius={12} />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="70%" height={20} />
                    <Skeleton
                      width="50%"
                      height={16}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
                <Skeleton count={3} height={16} style={{ marginTop: 20 }} />
              </div>
            ))}
          </div>
        ) : usuariosFiltrados().length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MdPerson />
            </div>
            <h2 className="empty-state-title">No hay usuarios</h2>
            <p className="empty-state-description">
              {busqueda
                ? "No se encontraron usuarios con ese criterio de búsqueda"
                : "Comienza agregando tu primer usuario al sistema"}
            </p>
            {!busqueda && (
              <button
                className="btn btn-primary"
                onClick={() => openModal("create")}
              >
                <MdAdd size={20} />
                Crear Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="usuarios-grid">
            {usuariosFiltrados().map((usuario) => (
              <div
                key={usuario.idUsuario}
                className="usuario-card"
                onClick={() => openModal("view", usuario)}
              >
                <div className="usuario-card-header">
                  <div
                    className="usuario-avatar"
                    style={{
                      background: UsuarioHelpers.obtenerColorRol(
                        usuario.nombre_rol
                      ),
                    }}
                  >
                    {UsuarioHelpers.obtenerInicialesUsuario(usuario)}
                  </div>
                  <div className="usuario-main-info">
                    <h3 className="usuario-name">
                      {UsuarioHelpers.obtenerNombre(usuario)}
                    </h3>
                    <div className="usuario-badges">
                      <span
                        className="usuario-badge badge-rol"
                        style={{
                          background: UsuarioHelpers.obtenerColorRol(
                            usuario.nombre_rol
                          ),
                        }}
                      >
                        {usuario.nombre_rol || "Sin rol"}
                      </span>
                      <span
                        className={`usuario-badge badge-status ${
                          !usuario.activo ? "inactivo" : ""
                        }`}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="usuario-id">
                      ID: {usuario.idUsuario || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="usuario-card-body">
                  <div className="usuario-info-item">
                    <MdEmail className="usuario-info-icon" />
                    <span className="usuario-info-text">
                      {usuario.email || "Sin email"}
                    </span>
                  </div>
                  {usuario.telefono && (
                    <div className="usuario-info-item">
                      <MdPhone className="usuario-info-icon" />
                      <span className="usuario-info-text">
                        {usuario.telefono}
                      </span>
                    </div>
                  )}
                  {usuario.direccion && (
                    <div className="usuario-info-item">
                      <MdLocationOn className="usuario-info-icon" />
                      <span className="usuario-info-text">
                        {usuario.direccion}
                      </span>
                    </div>
                  )}
                </div>

                <div className="usuario-card-footer">
                  <div className="usuario-date">
                    <MdCalendarToday size={14} />
                    {usuario.fecha_creacion
                      ? new Date(usuario.fecha_creacion).toLocaleDateString(
                          "es-ES",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      : "Sin fecha"}
                  </div>
                  <div
                    className="usuario-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="usuario-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("edit", usuario);
                      }}
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="usuario-action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDesactivar(usuario.idUsuario);
                      }}
                      title="Desactivar"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {showModal && modalType === "view" && selectedUsuario && (
        <UsuarioDetalleModal usuario={selectedUsuario} onClose={closeModal} />
      )}
      {showModal && modalType === "create" && (
        <UsuarioFormModal onClose={closeModal} onSuccess={cargarUsuarios} />
      )}
      {showModal && modalType === "edit" && selectedUsuario && (
        <UsuarioFormModal
          usuario={selectedUsuario}
          onClose={closeModal}
          onSuccess={cargarUsuarios}
        />
      )}
    </div>
  );
};

export default UsuariosPage;
