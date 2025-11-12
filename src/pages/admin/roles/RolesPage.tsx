// ============================================================
// 🎭 PÁGINA DE ROLES
// ============================================================
// Componente principal para gestión de roles del sistema
// Incluye: listado, búsqueda, filtros, y acciones CRUD
// ============================================================

import { useState, useEffect } from "react";
import {
  MdSecurity,
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RolService, RolHelpers } from "../../../services/rol";
import type { Rol } from "../../../services/rol";
import RolFormModal from "./RolFormModal";
import RolDetalleModal from "./RolDetalleModal";
import "../../../Styles/roles.css";

/**
 * Página principal de gestión de roles
 * Características:
 * - Listado con cards visuales
 * - Búsqueda en tiempo real
 * - Estadísticas en header
 * - Acciones: crear, editar, ver, eliminar
 * - Loading states con Skeleton
 * - Manejo de errores
 */
export default function RolesPage() {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Cargar roles al montar el componente
   */
  useEffect(() => {
    cargarRoles();
  }, []);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Carga todos los roles desde el servidor
   */
  const cargarRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await RolService.listar();
      console.log("Roles recibidos del servidor:", data);

      // Normalizar datos (aplicar valores por defecto)
      const rolesNormalizados = data.map((rol) =>
        RolHelpers.normalizarRol(rol)
      );

      console.log("Roles normalizados:", rolesNormalizados);
      setRoles(rolesNormalizados);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al cargar roles";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la búsqueda en tiempo real (sin debounce por ser pocos roles)
   */
  const handleBuscar = (query: string) => {
    setBusqueda(query);
  };

  /**
   * Filtra roles según la búsqueda
   */
  const rolesFiltrados = (): Rol[] => {
    if (!busqueda.trim()) return roles;

    return RolHelpers.filtrarRoles(roles, busqueda);
  };

  /**
   * Abre modal para crear nuevo rol
   */
  const handleCrear = () => {
    setRolSeleccionado(null);
    setModalCrearAbierto(true);
  };

  /**
   * Abre modal para editar rol existente
   */
  const handleEditar = (rol: Rol) => {
    setRolSeleccionado(rol);
    setModalEditarAbierto(true);
  };

  /**
   * Abre modal para ver detalles del rol
   */
  const handleVerDetalle = (rol: Rol) => {
    setRolSeleccionado(rol);
    setModalDetalleAbierto(true);
  };

  /**
   * Elimina un rol con confirmación
   */
  const handleEliminar = async (rol: Rol) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el rol "${rol.nombre}"?\n\n⚠️ Esta acción no se puede deshacer.\n⚠️ El rol no debe tener usuarios asociados.`
    );

    if (!confirmacion) return;

    try {
      await RolService.eliminar(rol.idRol);
      alert("✅ Rol eliminado exitosamente");
      cargarRoles(); // Recargar lista
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      const mensaje = err instanceof Error ? err.message : "Error al eliminar";
      alert(`❌ ${mensaje}`);
    }
  };

  /**
   * Callback cuando se crea/edita exitosamente
   */
  const handleExito = () => {
    cargarRoles(); // Recargar lista
  };

  // ============================================================
  // 📊 ESTADÍSTICAS
  // ============================================================

  const totalRoles = roles.length;
  const rolesConDescripcion = roles.filter(
    (r) => r.descripcion && r.descripcion.trim() !== ""
  ).length;

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="roles-page">
      {/* ============================================================ */}
      {/* HEADER CON ESTADÍSTICAS Y BÚSQUEDA */}
      {/* ============================================================ */}
      <div className="roles-header-wrapper">
        <div className="roles-header">
          <div className="roles-header-left">
            <div className="roles-title-section">
              <MdSecurity className="roles-page-icon" />
              <div>
                <h1 className="roles-page-title">Gestión de Roles</h1>
                <p className="roles-page-subtitle">
                  Administra los roles y permisos del sistema
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            {!loading && !error && (
              <div className="roles-stats">
                <div className="stat-item">
                  <span className="stat-value">{totalRoles}</span>
                  <span className="stat-label">Total Roles</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{rolesConDescripcion}</span>
                  <span className="stat-label">Con Descripción</span>
                </div>
              </div>
            )}
          </div>

          <button className="btn-crear-rol" onClick={handleCrear}>
            <MdAdd size={20} />
            Nuevo Rol
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="roles-search-wrapper">
          <div className="roles-search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="roles-search-input"
              placeholder="Buscar por nombre o descripción..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="roles-content">
        {/* Estado: Cargando */}
        {loading && (
          <div className="roles-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rol-card">
                <div className="rol-card-header">
                  <Skeleton circle width={60} height={60} />
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <Skeleton width="60%" height={24} />
                    <Skeleton
                      width="80%"
                      height={16}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
                <div className="rol-card-footer">
                  <Skeleton width={100} height={36} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Skeleton width={38} height={38} />
                    <Skeleton width={38} height={38} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div className="roles-error-state">
            <MdSecurity size={64} />
            <h2>Error al cargar roles</h2>
            <p>{error}</p>
            <button className="btn-reintentar" onClick={cargarRoles}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados en búsqueda */}
        {!loading && !error && busqueda && rolesFiltrados().length === 0 && (
          <div className="roles-empty-state">
            <MdSearch size={64} />
            <h2>No se encontraron resultados</h2>
            <p>No hay roles que coincidan con "{busqueda}"</p>
            <button className="btn-limpiar" onClick={() => setBusqueda("")}>
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Estado: Lista vacía */}
        {!loading && !error && !busqueda && roles.length === 0 && (
          <div className="roles-empty-state">
            <MdSecurity size={64} />
            <h2>No hay roles registrados</h2>
            <p>Comienza creando el primer rol del sistema</p>
            <button className="btn-crear-primero" onClick={handleCrear}>
              <MdAdd size={20} />
              Crear Primer Rol
            </button>
          </div>
        )}

        {/* Estado: Lista con datos */}
        {!loading && !error && rolesFiltrados().length > 0 && (
          <div className="roles-grid">
            {rolesFiltrados().map((rol) => (
              <div key={rol.idRol} className="rol-card">
                {/* Header del card */}
                <div className="rol-card-header">
                  <div
                    className="rol-avatar"
                    style={{
                      backgroundColor: RolHelpers.obtenerColorRol(rol.nombre),
                    }}
                  >
                    {RolHelpers.obtenerInicialesRol(rol)}
                  </div>
                  <div className="rol-info">
                    <h3 className="rol-nombre">{rol.nombre}</h3>
                    <p className="rol-descripcion">
                      {RolHelpers.obtenerDescripcion(rol)}
                    </p>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="rol-card-footer">
                  <button
                    className="btn-ver-detalle"
                    onClick={() => handleVerDetalle(rol)}
                  >
                    <MdVisibility size={16} />
                    Ver Detalles
                  </button>

                  <div className="rol-actions">
                    <button
                      className="rol-action-btn"
                      onClick={() => handleEditar(rol)}
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="rol-action-btn danger"
                      onClick={() => handleEliminar(rol)}
                      title="Eliminar"
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

      {/* ============================================================ */}
      {/* MODALES */}
      {/* ============================================================ */}

      {/* Modal Crear */}
      {modalCrearAbierto && (
        <RolFormModal
          onClose={() => setModalCrearAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Editar */}
      {modalEditarAbierto && rolSeleccionado && (
        <RolFormModal
          rol={rolSeleccionado}
          onClose={() => setModalEditarAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Detalle */}
      {modalDetalleAbierto && rolSeleccionado && (
        <RolDetalleModal
          rol={rolSeleccionado}
          onClose={() => setModalDetalleAbierto(false)}
          onEditar={handleEditar}
        />
      )}
    </div>
  );
}
