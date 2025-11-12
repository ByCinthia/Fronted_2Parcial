// ============================================================
// 📦 PÁGINA DE CATEGORÍAS
// ============================================================
// Componente principal para gestión de categorías de productos
// Incluye: listado, búsqueda, filtros, y acciones CRUD
// ============================================================

import { useState, useEffect } from "react";
import {
  MdCategory,
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CategoriaService,
  CategoriaHelpers,
} from "../../../services/categoria";
import type { Categoria } from "../../../services/categoria";
import CategoriaFormModal from "./CategoriaFormModal";
import CategoriaDetalleModal from "./CategoriaDetalleModal";
import "../../../Styles/categorias.css";

/**
 * Página principal de gestión de categorías
 * Características:
 * - Listado con cards visuales
 * - Búsqueda en tiempo real
 * - Estadísticas en header
 * - Acciones: crear, editar, ver, eliminar
 * - Loading states con Skeleton
 * - Manejo de errores
 */
export default function CategoriasPage() {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Cargar categorías al montar el componente
   */
  useEffect(() => {
    cargarCategorias();
  }, []);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Carga todas las categorías desde el servidor
   */
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await CategoriaService.listar();
      console.log("Categorías recibidas del servidor:", data);

      // Normalizar datos (aplicar valores por defecto)
      const categoriasNormalizadas = data.map((categoria) =>
        CategoriaHelpers.normalizarCategoria(categoria)
      );

      console.log("Categorías normalizadas:", categoriasNormalizadas);
      setCategorias(categoriasNormalizadas);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al cargar categorías";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la búsqueda en tiempo real
   */
  const handleBuscar = (query: string) => {
    setBusqueda(query);
  };

  /**
   * Filtra categorías según la búsqueda
   */
  const categoriasFiltradas = (): Categoria[] => {
    if (!busqueda.trim()) return categorias;

    return CategoriaHelpers.filtrarCategorias(categorias, busqueda);
  };

  /**
   * Abre modal para crear nueva categoría
   */
  const handleCrear = () => {
    setCategoriaSeleccionada(null);
    setModalCrearAbierto(true);
  };

  /**
   * Abre modal para editar categoría existente
   */
  const handleEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalEditarAbierto(true);
  };

  /**
   * Abre modal para ver detalles de la categoría
   */
  const handleVerDetalle = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalDetalleAbierto(true);
  };

  /**
   * Elimina una categoría con confirmación
   */
  const handleEliminar = async (categoria: Categoria) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?\n\n⚠️ Esta acción no se puede deshacer.\n⚠️ La categoría no debe tener productos asociados.`
    );

    if (!confirmacion) return;

    try {
      await CategoriaService.eliminar(categoria.idCategoria);
      alert("✅ Categoría eliminada exitosamente");
      cargarCategorias(); // Recargar lista
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      const mensaje = err instanceof Error ? err.message : "Error al eliminar";
      alert(`❌ ${mensaje}`);
    }
  };

  /**
   * Callback cuando se crea/edita exitosamente
   */
  const handleExito = () => {
    cargarCategorias(); // Recargar lista
  };

  // ============================================================
  // 📊 ESTADÍSTICAS
  // ============================================================

  const totalCategorias = categorias.length;
  const categoriasConDescripcion = categorias.filter(
    (c) => c.descripcion && c.descripcion.trim() !== ""
  ).length;

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="categorias-page">
      {/* ============================================================ */}
      {/* HEADER CON ESTADÍSTICAS Y BÚSQUEDA */}
      {/* ============================================================ */}
      <div className="categorias-header-wrapper">
        <div className="categorias-header">
          <div className="categorias-header-left">
            <div className="categorias-title-section">
              <MdCategory className="categorias-page-icon" />
              <div>
                <h1 className="categorias-page-title">Gestión de Categorías</h1>
                <p className="categorias-page-subtitle">
                  Administra las categorías de productos del sistema
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            {!loading && !error && (
              <div className="categorias-stats">
                <div className="stat-item">
                  <span className="stat-value">{totalCategorias}</span>
                  <span className="stat-label">Total Categorías</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{categoriasConDescripcion}</span>
                  <span className="stat-label">Con Descripción</span>
                </div>
              </div>
            )}
          </div>

          <button className="btn-crear-categoria" onClick={handleCrear}>
            <MdAdd size={20} />
            Nueva Categoría
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="categorias-search-wrapper">
          <div className="categorias-search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="categorias-search-input"
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
      <div className="categorias-content">
        {/* Estado: Cargando */}
        {loading && (
          <div className="categorias-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="categoria-card">
                <div className="categoria-card-header">
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
                <div className="categoria-card-footer">
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
          <div className="categorias-error-state">
            <MdCategory size={64} />
            <h2>Error al cargar categorías</h2>
            <p>{error}</p>
            <button className="btn-reintentar" onClick={cargarCategorias}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados en búsqueda */}
        {!loading &&
          !error &&
          busqueda &&
          categoriasFiltradas().length === 0 && (
            <div className="categorias-empty-state">
              <MdSearch size={64} />
              <h2>No se encontraron resultados</h2>
              <p>No hay categorías que coincidan con "{busqueda}"</p>
              <button className="btn-limpiar" onClick={() => setBusqueda("")}>
                Limpiar búsqueda
              </button>
            </div>
          )}

        {/* Estado: Lista vacía */}
        {!loading && !error && !busqueda && categorias.length === 0 && (
          <div className="categorias-empty-state">
            <MdCategory size={64} />
            <h2>No hay categorías registradas</h2>
            <p>Comienza creando la primera categoría del sistema</p>
            <button className="btn-crear-primero" onClick={handleCrear}>
              <MdAdd size={20} />
              Crear Primera Categoría
            </button>
          </div>
        )}

        {/* Estado: Lista con datos */}
        {!loading && !error && categoriasFiltradas().length > 0 && (
          <div className="categorias-grid">
            {categoriasFiltradas().map((categoria) => (
              <div key={categoria.idCategoria} className="categoria-card">
                {/* Header del card */}
                <div className="categoria-card-header">
                  <div
                    className="categoria-avatar"
                    style={{
                      backgroundColor: CategoriaHelpers.obtenerColorCategoria(
                        categoria.nombre
                      ),
                    }}
                  >
                    {CategoriaHelpers.obtenerInicialesCategoria(categoria)}
                  </div>
                  <div className="categoria-info">
                    <h3 className="categoria-nombre">{categoria.nombre}</h3>
                    <p className="categoria-descripcion">
                      {CategoriaHelpers.obtenerDescripcion(categoria)}
                    </p>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="categoria-card-footer">
                  <button
                    className="btn-ver-detalle"
                    onClick={() => handleVerDetalle(categoria)}
                  >
                    <MdVisibility size={16} />
                    Ver Detalles
                  </button>

                  <div className="categoria-actions">
                    <button
                      className="categoria-action-btn"
                      onClick={() => handleEditar(categoria)}
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="categoria-action-btn danger"
                      onClick={() => handleEliminar(categoria)}
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
        <CategoriaFormModal
          onClose={() => setModalCrearAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Editar */}
      {modalEditarAbierto && categoriaSeleccionada && (
        <CategoriaFormModal
          categoria={categoriaSeleccionada}
          onClose={() => setModalEditarAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Detalle */}
      {modalDetalleAbierto && categoriaSeleccionada && (
        <CategoriaDetalleModal
          categoria={categoriaSeleccionada}
          onClose={() => setModalDetalleAbierto(false)}
          onEditar={handleEditar}
        />
      )}
    </div>
  );
}
