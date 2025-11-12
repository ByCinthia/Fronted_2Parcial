// ============================================================
// 📦 PÁGINA DE PRODUCTOS
// ============================================================
// Componente principal para gestión de productos del sistema
// Incluye: listado, búsqueda, filtros por categoría, y acciones CRUD
// Soporta imágenes, stock, precios y categorización
// ============================================================

import { useState, useEffect } from "react";
import {
  MdShoppingCart,
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdFilterList,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductoService, ProductoHelpers } from "../../../services/producto";
import { CategoriaService } from "../../../services/categoria";
import type { Producto } from "../../../services/producto";
import type { Categoria } from "../../../services/categoria";
import ProductoFormModal from "./ProductoFormModal";
import ProductoDetalleModal from "./ProductoDetalleModal";
import "../../../Styles/productos.css";

/**
 * Página principal de gestión de productos
 * Características:
 * - Listado con cards visuales (incluye imagen)
 * - Búsqueda en tiempo real
 * - Filtro por categoría
 * - Estadísticas en header
 * - Acciones: crear, editar, ver, eliminar
 * - Loading states con Skeleton
 * - Manejo de errores
 * - Indicadores de stock
 */
export default function ProductosPage() {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);

  // Estados de modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Cargar productos y categorías al montar el componente
   */
  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Carga productos y categorías desde el servidor
   */
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar en paralelo
      const [productosData, categoriasData] = await Promise.all([
        ProductoService.listar(),
        CategoriaService.listar(),
      ]);

      console.log("Productos recibidos:", productosData);
      console.log("Categorías recibidas:", categoriasData);

      // Normalizar productos
      const productosNormalizados = productosData.map((producto) =>
        ProductoHelpers.normalizarProducto(producto)
      );

      setProductos(productosNormalizados);
      setCategorias(categoriasData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al cargar productos";
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
   * Maneja el filtro por categoría
   */
  const handleFiltrarCategoria = (idCategoria: number | null) => {
    setCategoriaFiltro(idCategoria);
  };

  /**
   * Filtra productos según búsqueda y categoría
   */
  const productosFiltrados = (): Producto[] => {
    let resultado = productos;

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      resultado = ProductoHelpers.filtrarProductos(resultado, busqueda);
    }

    // Filtrar por categoría
    if (categoriaFiltro !== null) {
      resultado = resultado.filter(
        (p) => p.categoria.idCategoria === categoriaFiltro
      );
    }

    return resultado;
  };

  /**
   * Abre modal para crear nuevo producto
   */
  const handleCrear = () => {
    setProductoSeleccionado(null);
    setModalCrearAbierto(true);
  };

  /**
   * Abre modal para editar producto existente
   */
  const handleEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalEditarAbierto(true);
  };

  /**
   * Abre modal para ver detalles del producto
   */
  const handleVerDetalle = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalDetalleAbierto(true);
  };

  /**
   * Elimina un producto con confirmación
   */
  const handleEliminar = async (producto: Producto) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el producto "${producto.nombre}"?\n\n⚠️ Esta acción no se puede deshacer.\n⚠️ La imagen también será eliminada.`
    );

    if (!confirmacion) return;

    try {
      await ProductoService.eliminar(producto.idProducto);
      alert("✅ Producto eliminado exitosamente");
      cargarDatos(); // Recargar lista
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      const mensaje = err instanceof Error ? err.message : "Error al eliminar";
      alert(`❌ ${mensaje}`);
    }
  };

  /**
   * Callback cuando se crea/edita exitosamente
   */
  const handleExito = () => {
    cargarDatos(); // Recargar lista
  };

  // ============================================================
  // 📊 ESTADÍSTICAS
  // ============================================================

  const totalProductos = productos.length;
  const productosDisponibles = productos.filter((p) => p.stock > 0).length;
  const productosAgotados = productos.filter((p) => p.stock === 0).length;
  const valorInventario = productos.reduce(
    (total, p) => total + p.precio * p.stock,
    0
  );

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="productos-page">
      {/* ============================================================ */}
      {/* HEADER CON ESTADÍSTICAS Y BÚSQUEDA */}
      {/* ============================================================ */}
      <div className="productos-header-wrapper">
        <div className="productos-header">
          <div className="productos-header-left">
            <div className="productos-title-section">
              <MdShoppingCart className="productos-page-icon" />
              <div>
                <h1 className="productos-page-title">Gestión de Productos</h1>
                <p className="productos-page-subtitle">
                  Administra el inventario y catálogo de productos
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            {!loading && !error && (
              <div className="productos-stats">
                <div className="stat-item">
                  <span className="stat-value">{totalProductos}</span>
                  <span className="stat-label">Total Productos</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{productosDisponibles}</span>
                  <span className="stat-label">Disponibles</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{productosAgotados}</span>
                  <span className="stat-label">Agotados</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">
                    {ProductoHelpers.formatearPrecio(valorInventario)}
                  </span>
                  <span className="stat-label">Valor Inventario</span>
                </div>
              </div>
            )}
          </div>

          <button className="btn-crear-producto" onClick={handleCrear}>
            <MdAdd size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="productos-search-wrapper">
          <div className="productos-search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="productos-search-input"
              placeholder="Buscar por nombre de producto..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </div>

          <div className="productos-filter-container">
            <MdFilterList className="filter-icon" />
            <select
              className="productos-filter-select"
              value={categoriaFiltro || ""}
              onChange={(e) =>
                handleFiltrarCategoria(
                  e.target.value ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="productos-content">
        {/* Estado: Cargando */}
        {loading && (
          <div className="productos-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="producto-card">
                <Skeleton height={200} />
                <div style={{ padding: "16px" }}>
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
                  <Skeleton width="40%" height={24} style={{ marginTop: 12 }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <Skeleton width={80} height={32} />
                    <Skeleton width={80} height={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div className="productos-error-state">
            <MdShoppingCart size={64} />
            <h2>Error al cargar productos</h2>
            <p>{error}</p>
            <button className="btn-reintentar" onClick={cargarDatos}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados en búsqueda/filtro */}
        {!loading &&
          !error &&
          (busqueda || categoriaFiltro !== null) &&
          productosFiltrados().length === 0 && (
            <div className="productos-empty-state">
              <MdSearch size={64} />
              <h2>No se encontraron resultados</h2>
              <p>
                No hay productos que coincidan con los criterios de búsqueda
              </p>
              <button
                className="btn-limpiar"
                onClick={() => {
                  setBusqueda("");
                  setCategoriaFiltro(null);
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

        {/* Estado: Lista vacía */}
        {!loading &&
          !error &&
          !busqueda &&
          categoriaFiltro === null &&
          productos.length === 0 && (
            <div className="productos-empty-state">
              <MdShoppingCart size={64} />
              <h2>No hay productos registrados</h2>
              <p>Comienza creando el primer producto del inventario</p>
              <button className="btn-crear-primero" onClick={handleCrear}>
                <MdAdd size={20} />
                Crear Primer Producto
              </button>
            </div>
          )}

        {/* Estado: Lista con datos */}
        {!loading && !error && productosFiltrados().length > 0 && (
          <div className="productos-grid">
            {productosFiltrados().map((producto) => {
              const estadoStock = ProductoHelpers.obtenerEstadoStock(
                producto.stock
              );

              return (
                <div key={producto.idProducto} className="producto-card">
                  {/* Imagen del producto */}
                  <div className="producto-imagen-container">
                    <img
                      src={ProductoHelpers.obtenerImagenUrl(producto)}
                      alt={producto.nombre}
                      className="producto-imagen"
                    />
                    {/* Badge de stock */}
                    <div
                      className="producto-stock-badge"
                      style={{ backgroundColor: estadoStock.color }}
                    >
                      {estadoStock.texto}
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-categoria">
                      {ProductoHelpers.obtenerNombreCategoria(producto)}
                    </p>

                    {/* Precio y Stock */}
                    <div className="producto-detalles">
                      <div className="producto-precio">
                        {ProductoHelpers.formatearPrecio(producto.precio)}
                      </div>
                      <div className="producto-stock">
                        Stock: <strong>{producto.stock}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Footer con acciones */}
                  <div className="producto-card-footer">
                    <button
                      className="btn-ver-detalle"
                      onClick={() => handleVerDetalle(producto)}
                    >
                      <MdVisibility size={16} />
                      Ver Detalles
                    </button>

                    <div className="producto-actions">
                      <button
                        className="producto-action-btn"
                        onClick={() => handleEditar(producto)}
                        title="Editar"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        className="producto-action-btn danger"
                        onClick={() => handleEliminar(producto)}
                        title="Eliminar"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODALES */}
      {/* ============================================================ */}

      {/* Modal Crear */}
      {modalCrearAbierto && (
        <ProductoFormModal
          categorias={categorias}
          onClose={() => setModalCrearAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Editar */}
      {modalEditarAbierto && productoSeleccionado && (
        <ProductoFormModal
          producto={productoSeleccionado}
          categorias={categorias}
          onClose={() => setModalEditarAbierto(false)}
          onExito={handleExito}
        />
      )}

      {/* Modal Detalle */}
      {modalDetalleAbierto && productoSeleccionado && (
        <ProductoDetalleModal
          producto={productoSeleccionado}
          onClose={() => setModalDetalleAbierto(false)}
          onEditar={handleEditar}
        />
      )}
    </div>
  );
}
