import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listProducts, deleteProduct } from "./service";
import "../../Styles/modulos.css";

type Product = {
  id?: number;
  idProducto?: number;
  nombre: string;
  categoria?: string;
  talla?: string;
  color?: string;
  tipo?: string;
  precio?: number;
  stock?: number;
  imagen?: string;
  fecha_creacion?: string;
};

function extractError(e: unknown): string {
  if (!e) return "Error desconocido";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  try {
    const obj = e as Record<string, unknown>;
    if (typeof obj?.detail === "string") return obj.detail;
    if (typeof obj?.message === "string") return obj.message;
    return JSON.stringify(obj);
  } catch {
    return "Error desconocido";
  }
}

// Nota: quité la anotación de retorno JSX.Element para evitar dependencia del namespace JSX
export default function ProductosAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await listProducts();
        setItems(Array.isArray(data) ? (data as Product[]) : []);
      } catch (err: unknown) {
        setError(extractError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      setItems((s) => s.filter((p) => (p.id ?? p.idProducto) !== id));
    } catch (err: unknown) {
      alert("Error al eliminar");
      console.error(err);
    }
  };

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Productos</h2>
        <div className="module-actions">
          <Link to="/dashboard/products/new" className="btn-primary">Registrar producto</Link>
        </div>
      </header>

      {loading ? (
        <p>Cargando productos…</p>
      ) : error ? (
        <p className="err">{error}</p>
      ) : items.length === 0 ? (
        <p>No hay productos aún.</p>
      ) : (
        <div className="module-list">
          {items.map((p) => {
            const id = p.id ?? p.idProducto ?? "";
            return (
              <article key={String(id)} className="module-card">
                <div className="module-img">
                  {p.imagen ? (
                    <img src={p.imagen.startsWith("http") ? p.imagen : `/assets/${p.imagen}`} alt={p.nombre} />
                  ) : (
                    <div className="module-placeholder" />
                  )}
                </div>
                <div className="module-body">
                  <h3>{p.nombre}</h3>
                  <div className="module-meta">
                    <span>{p.categoria}</span>
                    <span>{p.talla}</span>
                    <span>{p.color}</span>
                  </div>
                  <div className="module-footer">
                    <strong>${(p.precio ?? 0).toFixed(2)}</strong>
                    <div className="actions">
                      <button onClick={() => navigate(`/dashboard/products/${id}`)} className="btn-ghost">Editar</button>
                      <button onClick={() => handleDelete(id)} className="btn-danger">Eliminar</button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}