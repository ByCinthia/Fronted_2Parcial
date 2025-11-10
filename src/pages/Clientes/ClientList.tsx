import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listUsers } from "../../services/api";
import "../../Styles/modulos.css";

type Client = {
  id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  rolNombre?: string;
};

type BackendUser = {
  idUsuario?: number;
  username?: string;
  email?: string;
  telefono?: string;
  rol?: { idRol?: number; nombre?: string };
};

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers(); // usa helper listUsers -> GET /api/usuarios/
        const users = (data as BackendUser[]) || [];
        setClients(
          Array.isArray(users)
            ? users.map(u => ({
                id: u.idUsuario,
                nombre: u.username,
                email: u.email,
                telefono: u.telefono,
                rolNombre: u.rol?.nombre,
              }))
            : []
        );
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lista de clientes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="module-root">
      <header className="module-header">
        <h2>👥 Clientes</h2>
        <div className="module-actions">
          <Link to="/dashboard/clients/new" className="btn-primary">Nuevo cliente</Link>
        </div>
      </header>

      <div className="module-content">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Cargando clientes...</p>
          </div>
        ) : error ? (
          <div className="list-empty">
            <h3>Error al cargar</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-ghost">
              Reintentar
            </button>
          </div>
        ) : clients.length === 0 ? (
          <div className="list-empty">
            <h3>No hay clientes registrados</h3>
            <p>Comienza añadiendo el primer cliente al sistema.</p>
            <Link to="/dashboard/clients/new" className="btn-primary">
              Registrar primer cliente
            </Link>
          </div>
        ) : (
          <div className="module-list">
            {clients.map((c: Client) => (
              <div key={c.id} className="module-card">
                <div className="module-body">
                  <h3>{c.nombre ?? "Sin nombre"}</h3>
                  <div className="module-meta">
                    <span>{c.email}</span>
                  </div>
                  <div className="module-footer">
                    <div className="small text-muted">ID: {c.id}</div>
                    <div>
                      <Link to={`/dashboard/clients/${c.id}`} className="btn-ghost">
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}