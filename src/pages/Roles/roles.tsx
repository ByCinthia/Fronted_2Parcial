// Componente mínimo para listar y crear roles (usar desde la UI si el usuario es SuperAdmin)
import React, { useEffect, useState } from "react";
import { listRoles, createRole } from "../../services/api";
import "../../Styles/modulos.css";

type Role = { idRol: number; nombre: string; descripcion?: string };

function extractApiError(err: unknown): string {
  if (!err) return "Error desconocido";
  // error formato { data: { error: "..." } } o { data: "..." }
  try {
    const e = err as Record<string, unknown>;
    const data = e?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (typeof data === "object" && data !== null) {
        const d = data as Record<string, unknown>;
        if (typeof d.error === "string") return d.error;
        if (typeof d.message === "string") return d.message;
        // fallback stringify
        try {
          return JSON.stringify(d);
        } catch {
          // continue
        }
      }
    }
    if (typeof e?.message === "string") return e.message;
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return String(err);
  } catch {
    return "Error desconocido";
  }
}

// --- añadido: guard type-safe para extraer status sin usar `any` ---
function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null) {
    const maybe = err as Record<string, unknown>;
    const s = maybe.status;
    if (typeof s === "number") return s;
  }
  return undefined;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Inicia sesión como SuperAdmin para gestionar roles.");
      return;
    }
    load();
  }, []);

  async function load() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Debes iniciar sesión como SuperAdmin para ver/crear roles.");
      setRoles([]);
      return;
    }

    try {
      const data = await listRoles();
      setRoles(Array.isArray(data) ? (data as Role[]) : []);
      setError(null);
    } catch (e) {
      console.error("Error listando roles", e);
      const status = getErrorStatus(e);
      if (status === 401) setError("Sesión inválida/expirada. Inicia sesión.");
      else setError(extractApiError(e));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) return setError("Nombre requerido");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Debes iniciar sesión como SuperAdmin para crear roles.");
      return;
    }

    setLoading(true);
    try {
      await createRole({ nombre: nombre.trim(), descripcion: descripcion.trim() });
      setNombre("");
      setDescripcion("");
      await load();
    } catch (ex) {
      console.error("Error creando rol", ex);
      setError(extractApiError(ex));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="module-root">
      {/* Header principal */}
      <header className="module-header">
        <h2>Gestión de Roles</h2>
        <div className="module-actions">
          <span className="text-muted">Total: {roles.length} roles</span>
        </div>
      </header>

      {/* Formulario para crear rol */}
      <div className="module-form">
        <h3 style={{ margin: "0 0 24px 0", color: "var(--text-dark)" }}>Crear nuevo rol</h3>
        
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label>
              Nombre del rol *
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Vendedor, Administrador..."
                required
              />
            </label>
            
            <label>
              Descripción
              <input
                type="text"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Describe las funciones del rol..."
              />
            </label>
          </div>

          {error && (
            <div style={{ 
              color: "var(--wine)", 
              background: "rgba(97,12,39,0.08)", 
              padding: "12px 16px", 
              borderRadius: "8px", 
              marginBottom: "16px",
              border: "1px solid rgba(97,12,39,0.2)"
            }}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-ghost"
              onClick={() => { setNombre(""); setDescripcion(""); setError(null); }}
            >
              Limpiar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? "Creando…" : "Crear rol"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de roles existentes */}
      {roles.length > 0 ? (
        <div className="module-list">
          {roles.map(role => (
            <div key={role.idRol} className="module-card">
              <div className="module-body">
                <h3>{role.nombre}</h3>
                
                <div className="module-meta">
                  <span className="kv">ID: {role.idRol}</span>
                </div>
                
                <p style={{ 
                  color: "var(--muted)", 
                  fontSize: "1rem", 
                  lineHeight: "1.5",
                  margin: "0 0 auto 0"
                }}>
                  {role.descripcion || "Sin descripción"}
                </p>
                
                <div className="module-footer">
                  <span className="text-muted">Rol del sistema</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-ghost" style={{ padding: "8px 12px", fontSize: "0.9rem" }}>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-empty">
          <h3 style={{ margin: "0 0 16px 0", color: "var(--muted)" }}>
            📝 No hay roles creados
          </h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Crea tu primer rol usando el formulario de arriba.
            Los roles definen los permisos de los usuarios en el sistema.
          </p>
        </div>
      )}
    </section>
  );
}