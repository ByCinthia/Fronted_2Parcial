import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";
import "../../Styles/modulos.css";

type Order = {
  id?: number;
  cliente?: { nombre: string; email: string };
  total?: number;
  estado?: string;
  fecha_creacion?: string;
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Order[]>("/pedidos");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lista de pedidos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Pedidos</h2>
        <div className="module-actions">
          <Link to="/dashboard/orders/new" className="btn-primary">Nuevo pedido</Link>
        </div>
      </header>

      {loading ? <p>Cargando…</p> : error ? <p className="err">{error}</p> : (
        <div className="module-list">
          {orders.map(o => (
            <article key={o.id} className="module-card">
              <div className="module-body">
                <h3>Pedido #{o.id}</h3>
                <div className="module-meta">
                  <span>{o.cliente?.nombre}</span>
                  <span>{o.estado}</span>
                  <span>${(o.total ?? 0).toFixed(2)}</span>
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