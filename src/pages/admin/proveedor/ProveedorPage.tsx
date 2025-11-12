/* ============================================================ */
/* 📦 PÁGINA DE PROVEEDORES */
/* ============================================================ */
/* Componente principal para gestión de proveedores */
/* Incluye listado, búsqueda, crear, editar y eliminar */
/* ============================================================ */

import { useState, useEffect } from "react";
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdClose,
  MdCheckCircle,
  MdInfo,
  MdError,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  proveedorService,
  ProveedorHelpers,
  type Proveedor,
  type ProveedorCreateData,
  type ProveedorUpdateData,
} from "../../../services/proveedor";
import "../../../Styles/proveedores.css";

/* ============================================================ */
/* 🎯 COMPONENTE PRINCIPAL */
/* ============================================================ */

export default function ProveedorPage() {
  // Estados principales
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Proveedor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"crear" | "editar" | "detalle">(
    "crear"
  );
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<Proveedor | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<ProveedorCreateData>({
    nombre: "",
    telefono: "",
    email: "",
  });

  // Estados de UI
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);
  const [guardando, setGuardando] = useState(false);

  /* ============================================================ */
  /* 📥 CARGAR DATOS */
  /* ============================================================ */

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await proveedorService.listarProveedores();
      const ordenados = ProveedorHelpers.ordenarPorNombre(data);
      setProveedores(ordenados);
      setProveedoresFiltrados(ordenados);
    } catch (error) {
      mostrarMensaje("error", "Error al cargar proveedores");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================ */
  /* 🔍 BÚSQUEDA Y FILTROS */
  /* ============================================================ */

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProveedoresFiltrados(proveedores);
    } else {
      const filtrados = ProveedorHelpers.filtrarProveedoresLocal(
        proveedores,
        searchTerm
      );
      setProveedoresFiltrados(filtrados);
    }
  }, [searchTerm, proveedores]);

  /* ============================================================ */
  /* 📝 MODAL Y FORMULARIO */
  /* ============================================================ */

  const abrirModalCrear = () => {
    setModalMode("crear");
    setProveedorSeleccionado(null);
    setFormData({ nombre: "", telefono: "", email: "" });
    setShowModal(true);
  };

  const abrirModalEditar = (proveedor: Proveedor) => {
    setModalMode("editar");
    setProveedorSeleccionado(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      telefono: proveedor.telefono || "",
      email: proveedor.email || "",
    });
    setShowModal(true);
  };

  const abrirModalDetalle = (proveedor: Proveedor) => {
    setModalMode("detalle");
    setProveedorSeleccionado(proveedor);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setProveedorSeleccionado(null);
    setFormData({ nombre: "", telefono: "", email: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ============================================================ */
  /* 💾 GUARDAR (CREAR O ACTUALIZAR) */
  /* ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const { valido, errores } =
      ProveedorHelpers.validarDatosProveedor(formData);
    if (!valido) {
      mostrarMensaje("error", errores.join(", "));
      return;
    }

    try {
      setGuardando(true);

      if (modalMode === "crear") {
        await proveedorService.crearProveedor(formData);
        mostrarMensaje("success", "Proveedor creado exitosamente");
      } else if (proveedorSeleccionado) {
        await proveedorService.actualizarProveedor(
          proveedorSeleccionado.idProveedor,
          formData as ProveedorUpdateData
        );
        mostrarMensaje("success", "Proveedor actualizado exitosamente");
      }

      cerrarModal();
      await cargarProveedores();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al guardar proveedor";
      mostrarMensaje("error", errorMsg);
    } finally {
      setGuardando(false);
    }
  };

  /* ============================================================ */
  /* 🗑️ ELIMINAR */
  /* ============================================================ */

  const handleEliminar = async (proveedor: Proveedor) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar el proveedor "${proveedor.nombre}"?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await proveedorService.eliminarProveedor(proveedor.idProveedor);
      mostrarMensaje("success", "Proveedor eliminado exitosamente");
      await cargarProveedores();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al eliminar proveedor";
      mostrarMensaje("error", errorMsg);
    }
  };

  /* ============================================================ */
  /* 💬 MENSAJES */
  /* ============================================================ */

  const mostrarMensaje = (tipo: "success" | "error", texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  /* ============================================================ */
  /* 🎨 UTILIDADES */
  /* ============================================================ */

  const getAvatarColor = (nombre: string): string => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    ];
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const calcularEstadisticas = () => {
    const total = proveedores.length;
    const conContactoCompleto = proveedores.filter((p) =>
      ProveedorHelpers.tieneContactoCompleto(p)
    ).length;
    return { total, conContactoCompleto };
  };

  /* ============================================================ */
  /* 🎨 RENDER */
  /* ============================================================ */

  const stats = calcularEstadisticas();

  return (
    <div className="proveedores-page">
      {/* Header con gradiente */}
      <div className="proveedores-header-wrapper">
        <div className="proveedores-header">
          {/* Título y estadísticas */}
          <div className="proveedores-title-section">
            <div className="proveedores-icon-wrapper">
              <MdBusiness size={32} />
            </div>
            <div>
              <h1 className="proveedores-title">Proveedores</h1>
              <p className="proveedores-subtitle">
                Gestión de proveedores del sistema
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="proveedores-stats">
            <div className="stat-card">
              <div className="stat-value">
                {loading ? <Skeleton width={40} /> : stats.total}
              </div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {loading ? <Skeleton width={40} /> : stats.conContactoCompleto}
              </div>
              <div className="stat-label">Con contacto</div>
            </div>
          </div>

          {/* Botón crear */}
          <button className="btn-crear-proveedor" onClick={abrirModalCrear}>
            <MdAdd size={22} />
            Nuevo Proveedor
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="proveedores-search-section">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-results">
            {loading ? (
              <Skeleton width={180} />
            ) : (
              <>
                <span className="results-count">
                  {proveedoresFiltrados.length}
                </span>
                {proveedoresFiltrados.length === 1
                  ? " proveedor"
                  : " proveedores"}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="proveedores-content">
        {/* Mensajes */}
        {mensaje && (
          <div className={`proveedores-alert alert-${mensaje.tipo}`}>
            <div className="alert-icon">
              {mensaje.tipo === "success" ? (
                <MdCheckCircle size={22} />
              ) : (
                <MdError size={22} />
              )}
            </div>
            <span className="alert-text">{mensaje.texto}</span>
            <button className="alert-close" onClick={() => setMensaje(null)}>
              <MdClose size={20} />
            </button>
          </div>
        )}

        {/* Grid de tarjetas */}
        <div className="proveedores-grid">
          {loading ? (
            // Skeleton cards
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="proveedor-card skeleton-card">
                <div className="proveedor-card-header">
                  <Skeleton circle width={60} height={60} />
                  <div className="proveedor-card-title-section">
                    <Skeleton width={180} height={24} />
                    <Skeleton width={100} height={16} />
                  </div>
                </div>
                <div className="proveedor-card-body">
                  <Skeleton count={2} height={20} />
                </div>
                <div className="proveedor-card-footer">
                  <Skeleton width={80} height={36} />
                  <Skeleton width={80} height={36} />
                </div>
              </div>
            ))
          ) : proveedoresFiltrados.length === 0 ? (
            <div className="proveedores-empty-state">
              <MdBusiness size={64} />
              <h2>
                {searchTerm
                  ? "No se encontraron proveedores"
                  : "No hay proveedores"}
              </h2>
              <p>
                {searchTerm
                  ? "Intenta con otro término de búsqueda"
                  : "Comienza agregando tu primer proveedor"}
              </p>
              {!searchTerm && (
                <button
                  className="btn-crear-proveedor"
                  onClick={abrirModalCrear}
                >
                  <MdAdd size={20} />
                  Crear Proveedor
                </button>
              )}
            </div>
          ) : (
            proveedoresFiltrados.map((proveedor) => {
              const resumen = ProveedorHelpers.generarResumen(proveedor);
              return (
                <div
                  key={proveedor.idProveedor}
                  className="proveedor-card"
                  onClick={() => abrirModalDetalle(proveedor)}
                >
                  {/* Header de la tarjeta */}
                  <div className="proveedor-card-header">
                    <div
                      className="proveedor-avatar"
                      style={{ background: getAvatarColor(proveedor.nombre) }}
                    >
                      {resumen.iniciales}
                    </div>
                    <div className="proveedor-card-title-section">
                      <h3 className="proveedor-card-title">
                        {proveedor.nombre}
                      </h3>
                      <span className="proveedor-card-id">
                        ID: #{proveedor.idProveedor}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="proveedor-card-body">
                    <div className="proveedor-info-item">
                      <MdEmail className="info-icon" />
                      <span className="info-text">
                        {proveedor.email || "Sin email"}
                      </span>
                    </div>
                    <div className="proveedor-info-item">
                      <MdPhone className="info-icon" />
                      <span className="info-text">
                        {proveedor.telefono || "Sin teléfono"}
                      </span>
                    </div>
                    <div className="proveedor-info-item">
                      <MdInfo className="info-icon" />
                      <span className="info-text">
                        {ProveedorHelpers.formatearFecha(
                          proveedor.fecha_creacion
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Footer con acciones */}
                  <div className="proveedor-card-footer">
                    <button
                      className="card-action-btn edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEditar(proveedor);
                      }}
                      title="Editar proveedor"
                    >
                      <MdEdit size={18} />
                      Editar
                    </button>
                    <button
                      className="card-action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminar(proveedor);
                      }}
                      title="Eliminar proveedor"
                    >
                      <MdDelete size={18} />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de crear/editar/detalle */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className={`modal-content ${
              modalMode === "detalle" ? "modal-detalle" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === "crear" && "Nuevo Proveedor"}
                {modalMode === "editar" && "Editar Proveedor"}
                {modalMode === "detalle" && "Detalles del Proveedor"}
              </h2>
              <button className="modal-close" onClick={cerrarModal}>
                <MdClose size={24} />
              </button>
            </div>

            {modalMode === "detalle" && proveedorSeleccionado ? (
              // Vista de detalles
              <>
                <div className="modal-body">
                  <div className="proveedor-preview">
                    <div
                      className="proveedor-avatar-large"
                      style={{
                        background: getAvatarColor(
                          proveedorSeleccionado.nombre
                        ),
                      }}
                    >
                      {ProveedorHelpers.obtenerIniciales(
                        proveedorSeleccionado.nombre
                      )}
                    </div>
                    <h3 className="proveedor-nombre-large">
                      {proveedorSeleccionado.nombre}
                    </h3>
                    <span className="proveedor-id-badge">
                      ID: #{proveedorSeleccionado.idProveedor}
                    </span>
                  </div>

                  <div className="detalle-sections">
                    <div className="detalle-section">
                      <h4 className="detalle-section-title">
                        <MdInfo size={20} />
                        Información de Contacto
                      </h4>
                      <div className="detalle-items">
                        <div className="detalle-item">
                          <MdEmail className="detalle-icon" />
                          <div className="detalle-content">
                            <span className="detalle-label">Email</span>
                            <span className="detalle-value">
                              {proveedorSeleccionado.email || "No especificado"}
                            </span>
                          </div>
                        </div>
                        <div className="detalle-item">
                          <MdPhone className="detalle-icon" />
                          <div className="detalle-content">
                            <span className="detalle-label">Teléfono</span>
                            <span className="detalle-value">
                              {proveedorSeleccionado.telefono ||
                                "No especificado"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="detalle-section">
                      <h4 className="detalle-section-title">
                        <MdBusiness size={20} />
                        Información del Sistema
                      </h4>
                      <div className="detalle-items">
                        <div className="detalle-item">
                          <MdInfo className="detalle-icon" />
                          <div className="detalle-content">
                            <span className="detalle-label">
                              Fecha de Registro
                            </span>
                            <span className="detalle-value">
                              {ProveedorHelpers.formatearFecha(
                                proveedorSeleccionado.fecha_creacion
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="detalle-item">
                          <MdCheckCircle className="detalle-icon" />
                          <div className="detalle-content">
                            <span className="detalle-label">
                              Estado del Contacto
                            </span>
                            <span
                              className={`detalle-badge ${
                                ProveedorHelpers.tieneContactoCompleto(
                                  proveedorSeleccionado
                                )
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {ProveedorHelpers.tieneContactoCompleto(
                                proveedorSeleccionado
                              )
                                ? "Completo"
                                : "Incompleto"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cerrarModal}
                  >
                    <MdClose size={20} />
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => {
                      if (proveedorSeleccionado) {
                        abrirModalEditar(proveedorSeleccionado);
                      }
                    }}
                  >
                    <MdEdit size={20} />
                    Editar Proveedor
                  </button>
                </div>
              </>
            ) : (
              // Formulario de crear/editar
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Preview del avatar */}
                  {formData.nombre && (
                    <div className="proveedor-preview">
                      <div
                        className="proveedor-avatar-preview"
                        style={{ background: getAvatarColor(formData.nombre) }}
                      >
                        {ProveedorHelpers.obtenerIniciales(formData.nombre)}
                      </div>
                      <span className="preview-text">Vista previa</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                      <MdBusiness size={18} />
                      Nombre del Proveedor
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ej: Proveedor Tech S.A."
                      required
                      maxLength={200}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telefono" className="form-label">
                        <MdPhone size={18} />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Ej: 555-1234"
                        maxLength={20}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        <MdEmail size={18} />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Ej: contacto@proveedor.com"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>Guardando...</>
                    ) : modalMode === "crear" ? (
                      <>
                        <MdAdd size={20} />
                        Crear Proveedor
                      </>
                    ) : (
                      <>
                        <MdCheckCircle size={20} />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
