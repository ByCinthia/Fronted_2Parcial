import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet } from "../../services/api";
import "../../Styles/modulos.css";

type Order = {
  id?: number;
  cliente?: { nombre?: string; email?: string };
  total?: number;
  estado?: string;
  fecha_creacion?: string;
  items?: Array<{ producto?: string; cantidad?: number; precio?: number }>;
};

export default function OrderForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await apiGet<Order>(`/pedidos/${id}`);
        setOrder(data ?? null);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p className="err">{error}</p>;

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>{id ? `Pedido #${id}` : "Nuevo pedido"}</h2>
      </header>

      {id ? (
        <div className="module-form">
          <h3>Detalles del pedido</h3>

          <div style={{ marginBottom: 12 }}>
            <p><strong>Cliente:</strong> {order?.cliente?.nombre}</p>
            <p><strong>Email:</strong> {order?.cliente?.email}</p>
            <p><strong>Total:</strong> ${(Number(order?.total ?? 0)).toFixed(2)}</p>
            <p><strong>Estado:</strong> {order?.estado}</p>
            <p><strong>Fecha:</strong> {order?.fecha_creacion}</p>
          </div>

          <div>
            <strong>Artículos:</strong>
            {order?.items && order.items.length > 0 ? (
              <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
                <thead style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <tr>
                    <th style={{ padding: "6px 8px" }}>Producto</th>
                    <th style={{ padding: "6px 8px" }}>Cantidad</th>
                    <th style={{ padding: "6px 8px" }}>Precio</th>
                    <th style={{ padding: "6px 8px" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, i) => (
                    <tr key={it.producto ?? i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "8px" }}>{it.producto}</td>
                      <td style={{ padding: "8px" }}>{it.cantidad ?? 1}</td>
                      <td style={{ padding: "8px" }}>${(Number(it.precio ?? 0)).toFixed(2)}</td>
                      <td style={{ padding: "8px" }}>${(Number(it.precio ?? 0) * (it.cantidad ?? 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--muted)" }}>No hay artículos registrados para este pedido.</p>
            )}
          </div>

          <div className="form-actions" style={{ marginTop: 18 }}>
            <button className="btn-ghost" onClick={() => navigate(-1)}>Volver</button>
          </div>
        </div>
      ) : (
        <div className="module-form">
          <p>Formulario para crear nuevo pedido (implementar según necesidades)</p>
          <div className="form-actions">
            <button className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  );
}