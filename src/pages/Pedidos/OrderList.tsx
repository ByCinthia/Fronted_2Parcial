import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";
import "../../Styles/modulos.css";

type Order = {
  id?: number;
  cliente?: { idUsuario?: number; nombre?: string; email?: string };
  total?: number;
  estado?: string;
  fecha_creacion?: string;
  items?: Array<{ producto?: string; cantidad?: number; precio?: number }>;
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const showingCompleted = location.pathname.endsWith("/completed");

  useEffect(() => {
    (async () => {
      try {
        // obtener usuario actual para filtro en caso de cliente
        const raw = localStorage.getItem("current_user");
        const currentUser = raw ? JSON.parse(raw) : null;
        const data = await apiGet<Order[]>("/pedidos"); // endpoint según proxy /api
        let all: Order[] = Array.isArray(data) ? data : [];

        // si es cliente, filtrar por su email o idUsuario
        if (currentUser && currentUser.rol && String(currentUser.rol.nombre).toLowerCase() === "cliente") {
          const uid = currentUser.idUsuario;
          const email = currentUser.email;
          all = all.filter(o =>
            (o.cliente?.idUsuario && uid && o.cliente.idUsuario === uid) ||
            (o.cliente?.email && email && o.cliente.email === email)
          );
        }

        // aplicar filtro por estado según la ruta: completados vs no completados (enviados/pendientes)
        const filtered = showingCompleted
          ? all.filter(o => String(o.estado ?? "").toLowerCase().includes("complet"))
          : all.filter(o => !(String(o.estado ?? "").toLowerCase().includes("complet")));

        setOrders(filtered);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lista de pedidos.");
      } finally {
        setLoading(false);
      }
    })();
  }, [showingCompleted]);

  return (
    <section className="module-root">
      <header className="module-header">
        <div style={{ display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
          <h2 style={{ margin: 0 }}>Pedidos</h2>

          <nav style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <NavLink to="/dashboard/orders" className={({isActive}) => isActive ? "btn-primary" : "btn-ghost"} end>
              Ver pedidos
            </NavLink>
            <NavLink to="/dashboard/orders/completed" className={({isActive}) => isActive ? "btn-primary" : "btn-ghost"}>
              Completados
            </NavLink>
            <Link to="/dashboard/orders/new" className="btn-ghost" style={{ marginLeft: 8 }}>Nuevo pedido</Link>
          </nav>
        </div>
      </header>

      {loading ? <p>Cargando…</p> : error ? <p className="err">{error}</p> : (
        <div className="module-list">
          {orders.length === 0 && (
            <div className="list-empty">
              <h3 style={{ margin: 0, color: "var(--muted)" }}>No hay pedidos</h3>
              <p style={{ color: "var(--muted)", margin: 0 }}>Cuando las clientas hagan pedidos desde la tienda, aquí aparecerán.</p>
            </div>
          )}

          {orders.map(o => (
            <article key={o.id ?? `${o.cliente?.email}-${o.fecha_creacion}`} className="module-card">
              <div className="module-body">
                <h3>Pedido #{o.id}</h3>

                <div className="module-meta" style={{ gap: 10, marginBottom: 8 }}>
                  <span>{o.cliente?.nombre ?? "Cliente desconocido"}</span>
                  <span>{o.estado ?? "—"}</span>
                  <span>${(o.total ?? 0).toFixed(2)}</span>
                </div>

                {/* Lista de items del pedido */}
                <div style={{ margin: "8px 0 12px 0" }}>
                  <strong>Artículos:</strong>
                  {o.items && o.items.length > 0 ? (
                    <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                      {o.items.map((it, idx) => (
                        <li key={it.producto ?? idx} style={{ marginBottom: 6, listStyle: "disc" }}>
                          <span style={{ fontWeight: 600 }}>{it.producto ?? "Producto"}</span>
                          <span style={{ marginLeft: 8, color: "var(--muted)" }}>x{it.cantidad ?? 1}</span>
                          <span style={{ marginLeft: 12 }}>${(Number(it.precio ?? 0)).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "var(--muted)", marginTop: 6 }}>Sin items registrados</div>
                  )}
                </div>

                <div className="module-footer">
                  <div className="small text-muted">{o.fecha_creacion}</div>
                  <div>
                    <Link to={`/dashboard/orders/${o.id}`} className="btn-ghost">Ver detalles</Link>
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