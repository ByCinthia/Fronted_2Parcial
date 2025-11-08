import React, { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../Styles/shop.css";
import "../../Styles/layout_base.css";

// importa la imagen para que el bundler la procese
import vestidoLila from "../../assets/vestido_lila.jpg";
import vestidoNegro from "../../assets/vestido_negro.jpg";

const PRODUCTS = [
  { id: "p1", name: "Vestido Lila", price: 80, image: vestidoLila, category: "vestidos" },
  { id: "p2", name: "Blusa Rosa", price: 29.99, image: "../../assets/placeholder-2.jpg", category: "blusas" },
  { id: "p3", name: "Abrigo Crema", price: 89.99, image: "../../assets/placeholder-3.jpg", category: "pantalones" },
  { id: "p4", name: "Blusita Formal Azul", price: 45.99, image: "../../assets/placeholder-2.jpg", category: "blusitas-formales" },
  { id: "p5", name: "Vestido Negro Elegante", price: 120, image: vestidoNegro, category: "vestidos" },
  { id: "p6", name: "Pantalón de Oficina", price: 75, image: "../../assets/placeholder-3.jpg", category: "pantalones" },
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

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="page-root">
      <div className="page-container">
        <h2>Catálogo — Éclat Studio</h2>
        <p>Productos disponibles públicamente. Inicia sesión solo si eres personal.</p>

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
            <article key={p.id}>
              <img src={p.image} alt={p.name} />
              <div>
                <h3>{p.name}</h3>
                <div>
                  <strong>${p.price.toFixed(2)}</strong>
                  <button onClick={() => add(p)}>Añadir</button>
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
      </div>
    </main>
  );
}