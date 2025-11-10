import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";
import "../../Styles/modulos.css";

type User = {
  id?: number;
  username?: string;
  email?: string;
  idRol?: number;
  rol?: { nombre: string };
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<User[]>("/usuarios");
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lista de usuarios.");
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
            <article key={u.id} className="module-card">
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