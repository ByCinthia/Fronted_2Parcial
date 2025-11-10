import React, { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import CartIcon from "../../components/CartIcon";
import "../../Styles/shop.css";
import "../../Styles/layout_base.css";

// importa la imagen para que el bundler la procese
import vestidoLila from "../../assets/vestido_lila.jpg";
import vestidoNegro from "../../assets/vestido_negro.jpg";

const PRODUCTS = [
  { id: "p1", name: "Vestido Lila", price: 80, image: vestidoLila, category: "vestidos", description: "Vestido lila de corte midi, tejido ligero." },
  { id: "p2", name: "Blusa Rosa", price: 29.99, image: "../../assets/placeholder-2.jpg", category: "blusas", description: "Blusa informal, algodón suave." },
  { id: "p3", name: "Abrigo Crema", price: 89.99, image: "../../assets/placeholder-3.jpg", category: "pantalones", description: "Abrigo de textura cálida, corte clásico." },
  { id: "p4", name: "Blusita Formal Azul", price: 45.99, image: "../../assets/placeholder-2.jpg", category: "blusitas-formales", description: "Ideal para oficina y eventos formales." },
  { id: "p5", name: "Vestido Negro Elegante", price: 120, image: vestidoNegro, category: "vestidos", description: "Vestido negro elegante, perfecto para noche." },
  { id: "p6", name: "Pantalón de Oficina", price: 75, image: "../../assets/placeholder-3.jpg", category: "pantalones", description: "Pantalón de tiro alto, corte recto." },
];

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "vestidos", label: "Vestidos" },
  { id: "blusas", label: "Blusas" },
  { id: "pantalones", label: "Pantalones" },
  { id: "blusitas-formales", label: "Blusitas Formales" },
];

export default function Shop() {
  const { add } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selected, setSelected] = useState<typeof PRODUCTS[number] | null>(null);
  const [qty, setQty] = useState<number>(1);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  function openDetail(p: typeof PRODUCTS[number]) {
    setSelected(p);
    setQty(1);
  }
  function closeDetail() {
    setSelected(null);
  }

  function addToCartFromGrid(e: React.MouseEvent, p: typeof PRODUCTS[number]) {
    e.stopPropagation();
    add({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  }

  function addToCart() {
    if (!selected) return;
    add({ id: selected.id, name: selected.name, price: selected.price, image: selected.image, qty });
    closeDetail();
  }

  return (
    <main className="page-root">
      <div className="page-container shop-header-row">
        <div>
          <h2>Catálogo — Éclat Studio</h2>
          <p>Productos disponibles públicamente. Inicia sesión solo si eres personal.</p>
        </div>

        <div className="shop-header-actions">
          <Link to="/register" className="btn-primary">Crear cuenta</Link>
          <CartIcon />
        </div>
      </div>

      {/* Menú de categorías */}
      <nav className="shop-categories" aria-label="Categorías de productos">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`cat-btn ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
            <span className="cat-count">
              ({category.id === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === category.id).length})
            </span>
          </button>
        ))}
      </nav>

      {/* Grid de productos filtrados */}
      <div className="products-grid">
        {filteredProducts.map((p) => (
          <article key={p.id} onClick={() => openDetail(p)} role="button" tabIndex={0}>
            <div className="product-thumb">
              {p.image ? <img src={p.image} alt={p.name} /> : <div className="img-fallback">{p.name}</div>}
            </div>
            <div>
              <h3>{p.name}</h3>
              <div>
                <strong>${p.price.toFixed(2)}</strong>
                <button onClick={(e) => addToCartFromGrid(e, p)} aria-label={`Añadir ${p.name}`}>Añadir</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="shop-empty">
          <p>No hay productos en esta categoría.</p>
        </div>
      )}

      {/* Detalle de producto (modal lateral) */}
      {selected && (
        <div className="product-modal" role="dialog" aria-modal="true">
          <div className="product-modal-backdrop" onClick={closeDetail} />
          <aside className="product-modal-panel">
            <button className="modal-close" onClick={closeDetail} aria-label="Cerrar">✕</button>
            {selected.image ? <img src={selected.image} alt={selected.name} /> : <div className="img-fallback large">{selected.name}</div>}
            <div className="product-detail">
              <h3>{selected.name}</h3>
              <p className="muted">{selected.description}</p>
              <div className="price-row">
                <strong>${selected.price.toFixed(2)}</strong>
              </div>

              <label className="qty-label">
                Cantidad
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} />
                  <button onClick={() => setQty(q => q + 1)}>＋</button>
                </div>
              </label>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn-primary" onClick={addToCart}>Añadir al carrito</button>
                <Link to="/cart" className="btn-ghost" onClick={closeDetail} style={{ alignSelf: "center" }}>Ir al carrito</Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}