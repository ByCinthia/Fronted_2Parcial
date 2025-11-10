import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listUsers } from "../../services/api";
import "../../Styles/modulos.css";

type User = {
  id?: number;
  idUsuario?: number;
  username?: string;
  email?: string;
  idRol?: number;
  rol?: { nombre: string };
};

// helper type-safe para extraer status de errores devueltos por api
function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null) {
    const maybe = err as Record<string, unknown>;
    const s = maybe.status;
    if (typeof s === "number") return s;
  }
  return undefined;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Debes iniciar sesión.");
      // opcional: navigate("/login");
      return;
    }

    // cargar usuarios y manejar loading + errores tipados
    (async () => {
      setLoading(true);
      try {
        const data = await listUsers();
        if (Array.isArray(data)) {
          setUsers(data as User[]);
        } else {
          setUsers([]);
        }
      } catch (err: unknown) {
        const status = getErrorStatus(err);
        if (status === 401) {
          setError("Sesión expirada. Por favor inicia sesión.");
        } else {
          setError("Error cargando usuarios.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Usuarios</h2>
        <div className="module-actions">
          <Link to="/dashboard/users/new" className="btn-primary">Nuevo usuario</Link>
        </div>
      </header>

      {loading ? <p>Cargando…</p> : error ? <p className="err">{error}</p> : (
        <div className="module-list">
          {users.map(u => (
            <article key={u.id ?? u.idUsuario ?? u.username} className="module-card">
              <div className="module-body">
                <h3>{u.username}</h3>
                <div className="module-meta">
                  <span>{u.email}</span>
                  <span className="text-muted">{u.rol?.nombre ?? "Sin rol"}</span>
                </div>
                <div className="module-footer">
                  <div className="small text-muted">ID: {u.id}</div>
                  <div>
                    <Link to={`/dashboard/users/${u.id}`} className="btn-ghost">Editar</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}