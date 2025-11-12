import { useState, useEffect } from "react";
import {
  UsuarioService,
  UsuarioHelpers,
  manejarErrorUsuario,
} from "../../../services/usuarios";
import type { Usuario } from "../../../services/usuarios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdSettings, MdEdit, MdDelete, MdAdd, MdSearch } from "react-icons/md";

/**
 * Ejemplo completo de página de gestión de usuarios
 * Lista, busca, y muestra usuarios con skeleton loading
 */
export default function UsuariosPageExample() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "activos" | "inactivos">(
    "todos"
  );

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await UsuarioService.listar();
      setUsuarios(data);
    } catch (err) {
      setError(manejarErrorUsuario(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (busqueda.trim().length < 2) {
      cargarUsuarios();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await UsuarioService.buscar(busqueda);
      setUsuarios(data);
    } catch (err) {
      setError(manejarErrorUsuario(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar este usuario?")) return;

    try {
      await UsuarioService.desactivar(id);
      alert("Usuario desactivado correctamente");
      cargarUsuarios();
    } catch (err) {
      alert(manejarErrorUsuario(err));
    }
  };

  const usuariosFiltrados = () => {
    switch (filtro) {
      case "activos":
        return UsuarioHelpers.filtrarActivos(usuarios);
      case "inactivos":
        return UsuarioHelpers.filtrarInactivos(usuarios);
      default:
        return usuarios;
    }
  };

  const renderSkeleton = () => (
    <div style={{ padding: "2rem" }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "1rem",
            padding: "1rem",
            marginBottom: "1rem",
            background: "white",
            borderRadius: "8px",
          }}
        >
          <Skeleton circle width={60} height={60} />
          <div style={{ flex: 1 }}>
            <Skeleton width={200} height={24} />
            <Skeleton width={300} height={16} style={{ marginTop: "8px" }} />
            <Skeleton width={100} height={20} style={{ marginTop: "8px" }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <MdSettings
              style={{ marginRight: "12px", verticalAlign: "middle" }}
            />
            Gestión de Usuarios
          </h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            background: "#610C27",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          <MdAdd size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div
        style={{
          padding: "1.5rem",
          background: "white",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono o CI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "2px solid #E3C1B4",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              <button
                onClick={handleBuscar}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#610C27",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <MdSearch size={20} />
                Buscar
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setFiltro("todos")}
              style={{
                padding: "0.75rem 1rem",
                background: filtro === "todos" ? "#610C27" : "#f5f5f5",
                color: filtro === "todos" ? "white" : "#666",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro("activos")}
              style={{
                padding: "0.75rem 1rem",
                background: filtro === "activos" ? "#51cf66" : "#f5f5f5",
                color: filtro === "activos" ? "white" : "#666",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Activos
            </button>
            <button
              onClick={() => setFiltro("inactivos")}
              style={{
                padding: "0.75rem 1rem",
                background: filtro === "inactivos" ? "#ff6b6b" : "#f5f5f5",
                color: filtro === "inactivos" ? "white" : "#666",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Inactivos
            </button>
          </div>
        </div>

        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          Mostrando {usuariosFiltrados().length} de {usuarios.length} usuario(s)
        </div>
      </div>

      {/* Contenido */}
      <div className="page-content">
        {error && (
          <div
            style={{
              padding: "1rem",
              background: "#fee",
              color: "#c00",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          renderSkeleton()
        ) : usuariosFiltrados().length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "12px",
            }}
          >
            <MdSettings size={64} color="#ccc" style={{ opacity: 0.5 }} />
            <h3 style={{ marginTop: "1rem", color: "#666" }}>
              No se encontraron usuarios
            </h3>
            <p style={{ color: "#999" }}>
              Intenta con otros filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {usuariosFiltrados().map((usuario) => {
              const iniciales = UsuarioHelpers.obtenerIniciales(usuario.nombre);
              const colorRol = UsuarioHelpers.obtenerColorRol(
                usuario.nombre_rol
              );
              const fechaCreacion = UsuarioHelpers.formatearFecha(
                usuario.fecha_creacion
              );

              return (
                <div
                  key={usuario.idUsuario}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1.5rem",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    alignItems: "center",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: colorRol,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {iniciales}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>{usuario.nombre}</h3>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: `${colorRol}20`,
                          color: colorRol,
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {usuario.nombre_rol}
                      </span>
                      {usuario.activo ? (
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#51cf6620",
                            color: "#51cf66",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Activo
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#ff6b6b20",
                            color: "#ff6b6b",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                      {usuario.email}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "0.5rem",
                        fontSize: "0.85rem",
                        color: "#999",
                      }}
                    >
                      {usuario.telefono && <span>📞 {usuario.telefono}</span>}
                      {usuario.ci && <span>🆔 CI: {usuario.ci}</span>}
                      <span>📅 Creado: {fechaCreacion}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        padding: "0.5rem",
                        background: "#d4af3720",
                        color: "#d4af37",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    {usuario.activo && (
                      <button
                        onClick={() => handleDesactivar(usuario.idUsuario)}
                        style={{
                          padding: "0.5rem",
                          background: "#ff6b6b20",
                          color: "#ff6b6b",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Desactivar"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
