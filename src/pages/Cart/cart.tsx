import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder, type CreateOrderPayload } from "../../services/orders";
import "../../Styles/shop.css";

function extractApiError(err: unknown): string {
  if (!err) return "Error desconocido";
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    const data = e.data;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      const d = data as Record<string, unknown>;
      if (typeof d.error === "string") return d.error;
      if (typeof d.detail === "string") return d.detail;
    }
    if (typeof e.message === "string") return e.message;
  }
  return String(err);
}

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const navigate = useNavigate();

  // Checkout state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [method, setMethod] = React.useState<"card" | "cod" | "pickup">("card");
  const [form, setForm] = React.useState({ nombre: "", direccion: "", telefono: "", cardNumber: "", cardName: "" });

  const pickupDeadline = React.useMemo(() => {
    const d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }, []);

  const handlePlaceOrder = async () => {
    setError(null);
    if (items.length === 0) return setError("El carrito está vacío.");
    if (!form.nombre.trim()) return setError("Nombre requerido.");
    setLoading(true);
    try {
      const payload: CreateOrderPayload = {
        items: items.map(it => ({ producto_id: it.id, nombre: it.name, cantidad: it.qty || 1, precio: it.price })),
        total,
        metodo_pago: method === "card" ? "tarjeta" : method === "cod" ? "efectivo" : "recoger",
        datos_cliente: { nombre: form.nombre, direccion: form.direccion, telefono: form.telefono },
        recoger_hasta: method === "pickup" ? pickupDeadline : undefined,
        pago_tarjeta: method === "card" ? { titular: form.cardName, numero: form.cardNumber ? "**** **** **** " + String(form.cardNumber).slice(-4) : undefined } : undefined,
      };

      await createOrder(payload);
      setSuccess("Pedido creado correctamente.");
      clear();
      setTimeout(() => navigate("/dashboard/orders"), 900);
    } catch (err: unknown) {
      console.error("create order error", err);
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h2>Carrito</h2>
        <p>Tu carrito está vacío.</p>
        <button onClick={() => navigate("/shop")} style={{ padding: "8px 12px" }}>Ir a la tienda</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Carrito</h2>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
          {items.map((it) => (
            <li key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <img src={it.image} alt={it.name} style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div>Cantidad: {it.qty}</div>
                <div>${((it.price || 0) * (it.qty || 1)).toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => remove(it.id)} style={{ padding: "6px 8px" }}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Checkout panel */}
        <aside style={{ width: 420 }}>
          <div className="module-form">
            <h3 style={{ marginTop: 0 }}>Resumen de compra</h3>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div style={{ marginTop: 8, color: "var(--muted)" }}>
                Formas de pago: tarjeta (simulada), efectivo contra entrega o recoger en tienda.
              </div>
            </div>

            <div className="form-row">
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </label>
              <label>
                Teléfono
                <input name="telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </label>
            </div>

            <label style={{ display: "block", marginBottom: 12 }}>
              Dirección (opcional para recoger en tienda)
              <input name="direccion" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
            </label>

            <div style={{ marginBottom: 12 }}>
              <strong>Método de pago</strong>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className={method === "card" ? "btn-primary" : "btn-ghost"} onClick={() => setMethod("card")}>Tarjeta</button>
                <button className={method === "cod" ? "btn-primary" : "btn-ghost"} onClick={() => setMethod("cod")}>Efectivo (Contra entrega)</button>
                <button className={method === "pickup" ? "btn-primary" : "btn-ghost"} onClick={() => setMethod("pickup")}>Recoger en tienda</button>
              </div>
            </div>

            {method === "card" && (
              <>
                <div className="form-row">
                  <label>Nombre en la tarjeta<input value={form.cardName} onChange={e => setForm({ ...form, cardName: e.target.value })} /></label>
                  <label>Número de tarjeta<input value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} /></label>
                </div>
                <div style={{ color: "var(--muted)", marginBottom: 12 }}>Pago con tarjeta simulado: no se procesa real.</div>
              </>
            )}

            {method === "pickup" && (
              <div style={{ marginBottom: 12, color: "var(--muted)" }}>
                Recoger en tienda. Fecha límite para recogida: <strong>{pickupDeadline}</strong>. Pasados 2 días la prenda vuelve a estar disponible.
              </div>
            )}

            {error && <div style={{ color: "var(--wine)", padding: 8, borderRadius: 8, marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: "green", padding: 8, borderRadius: 8, marginBottom: 8 }}>{success}</div>}

            <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn-ghost" onClick={() => clear()}>Vaciar</button>
              <button className="btn-primary" disabled={loading} onClick={handlePlaceOrder}>{loading ? "Procesando…" : "Realizar pedido"}</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}