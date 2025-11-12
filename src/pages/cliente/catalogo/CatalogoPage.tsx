// ============================================================
// 🛍️ PÁGINA DE CATÁLOGO PÚBLICO
// ============================================================
// Catálogo moderno para clientes con filtros, búsqueda y secciones
// Características:
// - Vista de productos con stock disponible
// - Filtrado por categorías
// - Búsqueda en tiempo real
// - Secciones: Destacados, Nuevos, Más Vendidos
// - Diseño moderno y responsivo
// - Loading states con Skeleton
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/catalogo.css";
import {
  MdShoppingCart,
  MdSearch,
  MdFilterList,
  MdStar,
  MdNewReleases,
  MdLocalFireDepartment,
  MdGridView,
  MdViewList,
  MdClose,
  MdLogout,
  MdPerson,
  MdReceipt,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CatalogoService,
  CatalogoHelpers,
  type ProductoCatalogo,
  type CategoriaPublica,
} from "../../../services/catalogo";
import { signOut } from "../../../services/auth";
import { useCart } from "../../../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

/**
 * Tipo de vista del catálogo
 */
type Vista = "grid" | "list";

/**
 * Tipo de sección activa
 */
type Seccion = "todos" | "destacados" | "nuevos" | "mas-vendidos";

/**
 * Página principal del catálogo público
 */
export default function CatalogoPage() {
  // Cart
  const { add } = useCart();
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const navigate = useNavigate();
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros y búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("todos");
  const [vista, setVista] = useState<Vista>("grid");

  // Modal de producto
  const [productoDetalle, setProductoDetalle] =
    useState<ProductoCatalogo | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Cargar productos según sección activa
   */
  useEffect(() => {
    cargarProductosSeccion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccionActiva]);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Carga datos iniciales (categorías)
   */
  const cargarDatos = async () => {
    try {
      const categoriasData = await CatalogoService.listarCategorias();
      setCategorias(categoriasData);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  /**
   * Carga productos según la sección activa
   */
  const cargarProductosSeccion = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: ProductoCatalogo[] = [];

      switch (seccionActiva) {
        case "destacados":
          data = await CatalogoService.obtenerDestacados();
          break;
        case "nuevos":
          data = await CatalogoService.obtenerNuevos();
          break;
        case "mas-vendidos":
          data = await CatalogoService.obtenerMasVendidos();
          break;
        default:
          data = await CatalogoService.listarProductos();
      }

      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar productos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar productos por categoría
   */
  const handleFiltrarCategoria = async (idCategoria: number | null) => {
    setCategoriaSeleccionada(idCategoria);

    if (idCategoria === null) {
      cargarProductosSeccion();
      return;
    }

    try {
      setLoading(true);
      const data = await CatalogoService.listarPorCategoria(idCategoria);
      setProductos(data);
    } catch (err) {
      console.error("Error al filtrar por categoría:", err);
      setError("Error al filtrar productos.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar sección activa
   */
  const handleCambiarSeccion = (seccion: Seccion) => {
    setSeccionActiva(seccion);
    setCategoriaSeleccionada(null);
    setBusqueda("");
  };

  /**
   * Cerrar sesión
   */
  const handleCerrarSesion = () => {
    signOut();
    navigate("/login");
  };

  /**
   * Obtener productos filtrados
   */
  const productosFiltrados = (): ProductoCatalogo[] => {
    let resultado = productos;

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      resultado = CatalogoHelpers.filtrarPorBusqueda(resultado, busqueda);
    }

    return resultado;
  };

  /**
   * Obtener título de la sección
   */
  const obtenerTituloSeccion = (): string => {
    if (categoriaSeleccionada) {
      const cat = categorias.find(
        (c) => c.idCategoria === categoriaSeleccionada
      );
      return cat ? `Categoría: ${cat.nombre}` : "Catálogo";
    }

    switch (seccionActiva) {
      case "destacados":
        return "Productos Destacados";
      case "nuevos":
        return "Novedades";
      case "mas-vendidos":
        return "Más Vendidos";
      default:
        return "Catálogo Completo";
    }
  };

  /**
   * Obtener estadísticas
   */
  const stats = CatalogoHelpers.obtenerEstadisticas(productos);

  /**
   * Agregar producto al carrito
   */
  const agregarAlCarrito = (producto: ProductoCatalogo) => {
    add({
      id: String(producto.idProducto),
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagen_url || "",
      qty: 1,
    });
    // Mostrar notificación de éxito con toast
    toast.success(`${producto.nombre} agregado al carrito`, {
      duration: 3000,
      position: "top-right",
      icon: "🛒",
    });
  };

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="catalogo-page">
      {/* ============================================================ */}
      {/* HEADER CON NAVEGACIÓN DE SECCIONES */}
      {/* ============================================================ */}
      <div className="catalogo-header">
        <div className="catalogo-header-content">
          <div className="catalogo-title-row">
            <div className="catalogo-title-section">
              <h1 className="catalogo-title">
                <MdShoppingCart className="catalogo-icon" />
                Eclat Online
              </h1>
              <p className="catalogo-subtitle">
                Explora nuestro catálogo de productos disponibles
              </p>
            </div>

            {/* Botones de usuario */}
            <div className="catalogo-user-actions">
              <button
                className="btn-user-action"
                onClick={() => navigate("/ventas")}
                title="Mis Compras"
              >
                <MdReceipt size={24} />
              </button>
              <button
                className="btn-user-action"
                onClick={() => navigate("/carrito")}
                title="Mi Carrito"
              >
                <MdShoppingCart size={24} />
              </button>
              <button className="btn-user-action" title="Perfil">
                <MdPerson size={24} />
              </button>
              <button
                className="btn-logout"
                onClick={handleCerrarSesion}
                title="Cerrar sesión"
              >
                <MdLogout size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Navegación de secciones */}
          <div className="catalogo-nav">
            <button
              className={`nav-btn ${seccionActiva === "todos" ? "active" : ""}`}
              onClick={() => handleCambiarSeccion("todos")}
            >
              <MdGridView size={20} />
              Todos
            </button>
            <button
              className={`nav-btn ${
                seccionActiva === "destacados" ? "active" : ""
              }`}
              onClick={() => handleCambiarSeccion("destacados")}
            >
              <MdStar size={20} />
              Destacados
            </button>
            <button
              className={`nav-btn ${
                seccionActiva === "nuevos" ? "active" : ""
              }`}
              onClick={() => handleCambiarSeccion("nuevos")}
            >
              <MdNewReleases size={20} />
              Nuevos
            </button>
            <button
              className={`nav-btn ${
                seccionActiva === "mas-vendidos" ? "active" : ""
              }`}
              onClick={() => handleCambiarSeccion("mas-vendidos")}
            >
              <MdLocalFireDepartment size={20} />
              Más Vendidos
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      {/* ============================================================ */}
      <div className="catalogo-filters">
        <div className="catalogo-filters-content">
          {/* Búsqueda */}
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Filtro de categorías */}
          <div className="filter-container">
            <MdFilterList className="filter-icon" />
            <select
              className="filter-select"
              value={categoriaSeleccionada || ""}
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

          {/* Toggle de vista */}
          <div className="view-toggle">
            <button
              className={`view-btn ${vista === "grid" ? "active" : ""}`}
              onClick={() => setVista("grid")}
              title="Vista de cuadrícula"
            >
              <MdGridView size={20} />
            </button>
            <button
              className={`view-btn ${vista === "list" ? "active" : ""}`}
              onClick={() => setVista("list")}
              title="Vista de lista"
            >
              <MdViewList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="catalogo-content">
        {/* Título de sección y estadísticas */}
        <div className="section-header">
          <h2 className="section-title">{obtenerTituloSeccion()}</h2>
          {!loading && !error && (
            <div className="section-stats">
              <span className="stat-badge">
                {productosFiltrados().length} productos
              </span>
              {stats.disponibles > 0 && (
                <span className="stat-badge success">
                  {stats.disponibles} disponibles
                </span>
              )}
            </div>
          )}
        </div>

        {/* Estado: Cargando */}
        {loading && (
          <div className={`catalogo-${vista}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="producto-card">
                <Skeleton height={vista === "grid" ? 240 : 160} />
                <div className="producto-info">
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
                  <Skeleton width="40%" height={24} style={{ marginTop: 12 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div className="catalogo-error">
            <MdShoppingCart size={64} />
            <h3>Error al cargar productos</h3>
            <p>{error}</p>
            <button className="btn-retry" onClick={cargarProductosSeccion}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados */}
        {!loading &&
          !error &&
          productosFiltrados().length === 0 &&
          (busqueda || categoriaSeleccionada) && (
            <div className="catalogo-empty">
              <MdSearch size={64} />
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros términos de búsqueda o cambia los filtros</p>
              <button
                className="btn-clear"
                onClick={() => {
                  setBusqueda("");
                  setCategoriaSeleccionada(null);
                  cargarProductosSeccion();
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

        {/* Estado: Lista con productos */}
        {!loading && !error && productosFiltrados().length > 0 && (
          <div className={`catalogo-${vista}`}>
            {productosFiltrados().map((producto) => {
              const badge = CatalogoHelpers.obtenerBadgeStock(producto.stock);
              const precio = CatalogoHelpers.formatearPrecio(producto.precio);
              const esNuevo = CatalogoHelpers.esNuevo(producto);

              return (
                <article
                  key={producto.idProducto}
                  className="producto-card"
                  onClick={() => setProductoDetalle(producto)}
                >
                  {/* Imagen */}
                  <div className="producto-imagen">
                    <img
                      src={CatalogoHelpers.obtenerImagenUrl(producto)}
                      alt={producto.nombre}
                    />
                    {/* Badges */}
                    <div className="producto-badges">
                      {esNuevo && (
                        <span className="badge badge-new">
                          <MdNewReleases size={14} />
                          Nuevo
                        </span>
                      )}
                      <span
                        className="badge badge-stock"
                        style={{ backgroundColor: badge.color }}
                      >
                        {badge.texto}
                      </span>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="producto-info">
                    <div className="producto-categoria">
                      {CatalogoHelpers.obtenerNombreCategoria(producto)}
                    </div>
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">
                      {CatalogoHelpers.obtenerDescripcion(producto)}
                    </p>

                    {/* Footer */}
                    <div className="producto-footer">
                      <span className="producto-precio">{precio}</span>
                      <div className="producto-acciones">
                        <button
                          className="btn-agregar"
                          onClick={(e) => {
                            e.stopPropagation();
                            agregarAlCarrito(producto);
                          }}
                          disabled={producto.stock === 0}
                          title={
                            producto.stock > 0
                              ? "Agregar al carrito"
                              : "Sin stock"
                          }
                        >
                          <MdShoppingCart size={18} />
                        </button>
                        <button
                          className="btn-ver-detalle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductoDetalle(producto);
                          }}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL DE DETALLE DE PRODUCTO */}
      {/* ============================================================ */}
      {productoDetalle && (
        <div
          className="producto-modal-overlay"
          onClick={() => setProductoDetalle(null)}
        >
          <div className="producto-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setProductoDetalle(null)}
            >
              <MdClose size={24} />
            </button>

            {/* Imagen grande */}
            <div className="modal-imagen">
              <img
                src={CatalogoHelpers.obtenerImagenUrl(productoDetalle)}
                alt={productoDetalle.nombre}
              />
              {CatalogoHelpers.esNuevo(productoDetalle) && (
                <span className="badge badge-new badge-large">
                  <MdNewReleases size={16} />
                  Nuevo
                </span>
              )}
            </div>

            {/* Información */}
            <div className="modal-info">
              <div className="modal-categoria">
                {CatalogoHelpers.obtenerNombreCategoria(productoDetalle)}
              </div>
              <h2 className="modal-nombre">{productoDetalle.nombre}</h2>
              <p className="modal-descripcion">
                {CatalogoHelpers.obtenerDescripcion(productoDetalle)}
              </p>

              {/* Stock */}
              <div className="modal-stock">
                <span
                  className="stock-badge"
                  style={{
                    backgroundColor: CatalogoHelpers.obtenerBadgeStock(
                      productoDetalle.stock
                    ).color,
                  }}
                >
                  {
                    CatalogoHelpers.obtenerBadgeStock(productoDetalle.stock)
                      .texto
                  }
                </span>
                <span className="stock-cantidad">
                  {productoDetalle.stock} unidades disponibles
                </span>
              </div>

              {/* Precio */}
              <div className="modal-precio">
                {CatalogoHelpers.formatearPrecio(productoDetalle.precio)}
              </div>

              {/* Botón de acción */}
              <button
                className="btn-agregar-carrito"
                onClick={(e) => {
                  e.stopPropagation();
                  agregarAlCarrito(productoDetalle);
                  setProductoDetalle(null);
                }}
                disabled={productoDetalle.stock === 0}
              >
                <MdShoppingCart size={20} />
                {productoDetalle.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  );
}
