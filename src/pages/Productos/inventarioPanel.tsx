import { useEffect, useMemo, useState } from "react";
import { listProducts } from "./service";
import { listCategories } from "../Categorias/service";
import "../../Styles/modulos.css";
import "../../Styles/inventory.css";

type Product = {
  id?: number;
  idProducto?: number;
  nombre?: string;
  name?: string;
  categoria?: any;
  precio?: number;
  base_price?: number;
  stock?: number;
  variants?: Array<{ stock?: number; sku?: string }> | any;
  min_stock?: number | null; // optional field (assumption)
};

const DEFAULT_MIN_STOCK = 2;

function productCode(p: Product) {
  // prefer explicit id, otherwise use first variant sku if available
  if (p.id) return String(p.id);
  if ((p as any).idProducto) return String((p as any).idProducto);
  if (Array.isArray(p.variants) && p.variants.length > 0) {
    const sku = p.variants[0]?.sku;
    if (sku) return String(sku);
  }
  return "-";
}

function productName(p: Product) {
  return p.nombre ?? p.name ?? "";
}

function productCategoryLabel(c: any) {
  if (!c) return "";
  if (typeof c === "string") return c;
  if (typeof c === "object") return c.nombre ?? c.name ?? String(c.id ?? c.idCategoria ?? "");
  return String(c);
}

function computeStock(p: Product): number {
  if (Array.isArray((p as any).variants) && (p as any).variants.length > 0) {
    const sum = (p as any).variants.reduce((acc: number, v: any) => acc + (Number(v.stock ?? 0) || 0), 0);
    return sum;
  }
  return Number(p.stock ?? 0) || 0;
}

function getMinStockFromProduct(p: Product): number | null {
  // try multiple possible field names and coerce to number
  const candidates: any = (p as any);
  const keys = ["min_stock", "minStock", "minimo_stock", "minimum_stock", "min"];
  for (const k of keys) {
    if (k in candidates) {
      const raw = candidates[k];
      if (raw === null || raw === undefined || raw === "") return null;
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
  }
  // sometimes backend may nest it under metadata or settings
  if (candidates?.metadata && typeof candidates.metadata === "object") {
    const m = candidates.metadata.min_stock ?? candidates.metadata.minStock;
    if (m !== undefined) {
      const n = Number(m);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

export default function InventoryPanel() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | number | "">("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "low" | "out">("all");

  // reusable loader so we can refresh data on demand
  async function loadData() {
    try {
      setLoading(true);
      const data = await listProducts();
      setItems(Array.isArray(data) ? data : []);
      const catdata = await listCategories();
      setCats(Array.isArray(catdata) ? catdata : []);
    } catch (err) {
      console.error("Error loading inventory", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .map((p) => ({ p, stock: computeStock(p), min_stock: getMinStockFromProduct(p) ?? DEFAULT_MIN_STOCK }))
      .filter(({ p, stock, min_stock }) => {
        // category filter
        if (categoryFilter && categoryFilter !== "") {
          const catId = String((p.categoria && (p.categoria.id ?? p.categoria.idCategoria)) ?? p.categoria ?? "");
          if (String(categoryFilter) !== catId) return false;
        }

        // status filter
        if (statusFilter === "low" && !(stock > 0 && stock <= (min_stock ?? DEFAULT_MIN_STOCK))) return false;
        if (statusFilter === "out" && !(stock === 0)) return false;
        if (statusFilter === "available" && !(stock > (min_stock ?? DEFAULT_MIN_STOCK))) return false;

        // search term: name or code
        if (!term) return true;
        const code = productCode(p).toLowerCase();
        const name = productName(p).toLowerCase();
        return name.includes(term) || code.includes(term);
      });
  }, [items, q, categoryFilter, statusFilter]);

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Inventario</h2>
        <div className="module-actions">
          <button className="btn-ghost" onClick={() => loadData()} style={{ marginRight: 12 }}>Refrescar</button>
          <div className="inventory-controls">
            <input className="inventory-search" placeholder="Buscar por nombre o código" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="inventory-filter" value={categoryFilter ?? ""} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Todas las categorías</option>
              {cats.map((c) => (
                <option key={String(c.id ?? c.idCategoria ?? c.nombre)} value={c.id ?? c.idCategoria ?? c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <select className="inventory-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">Todos</option>
              <option value="available">Disponible</option>
              <option value="low">Bajo stock</option>
              <option value="out">Agotado</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <p>Cargando inventario…</p>
      ) : (
        <div className="module-list compact inventory-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Código</th>
                <th style={{ textAlign: "left", padding: 8 }}>Nombre</th>
                <th style={{ textAlign: "left", padding: 8 }}>Categoría</th>
                <th style={{ textAlign: "right", padding: 8 }}>Precio unitario</th>
                <th style={{ textAlign: "right", padding: 8 }}>Stock mínimo</th>
                <th style={{ textAlign: "right", padding: 8 }}>Stock disponible</th>
                <th style={{ textAlign: "left", padding: 8 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 12 }}>No hay resultados.</td>
                </tr>
              ) : (
                rows.map(({ p, stock, min_stock }, idx) => {
                  const status = stock === 0 ? "Agotado" : stock <= (min_stock ?? DEFAULT_MIN_STOCK) ? "Bajo stock" : "Disponible";
                  const bg = status === "Agotado" ? "#ffdddd" : status === "Bajo stock" ? "#fff4cc" : "transparent";
                  const price = Number((p.precio ?? p.base_price ?? 0) as any) || 0;
                  return (
                    <tr key={String(p.id ?? p.idProducto ?? idx)} style={{ background: bg }}>
                      <td style={{ padding: 8 }}>{productCode(p)}</td>
                      <td style={{ padding: 8 }}>{productName(p)}</td>
                      <td style={{ padding: 8 }}>{productCategoryLabel(p.categoria)}</td>
                      <td style={{ textAlign: "right" }}>${price.toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>{min_stock ?? DEFAULT_MIN_STOCK}</td>
                      <td style={{ textAlign: "right" }}>{stock}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
