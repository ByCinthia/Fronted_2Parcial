
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const navigate = useNavigate();

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
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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

      <footer style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Total: ${total.toFixed(2)}</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => clear()} style={{ padding: "8px 12px" }}>Vaciar</button>
          <button onClick={() => alert("Checkout simulado")} style={{ padding: "8px 12px", background: "#cfa94a", color: "#fff", border: "none", borderRadius: 8 }}>
            Pagar
          </button>
        </div>
      </footer>
    </main>
  );
}