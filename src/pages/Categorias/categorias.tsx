import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCategories, deleteCategory } from "./service.ts";
import "../../Styles/modulos.css";

type Category = {
  id?: number;
  idCategoria?: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
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

export default function CategoriasAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await listCategories();
        setItems(Array.isArray(data) ? (data as Category[]) : []);
      } catch (err: unknown) {
        setError(extractError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      setItems((s) => s.filter((c) => (c.id ?? c.idCategoria) !== id));
    } catch (err: unknown) {
      alert("Error al eliminar");
      console.error(err);
    }
  };

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Categorías</h2>
        <div className="module-actions">
          <Link to="/dashboard/categories/new" className="btn-primary">Registrar categoría</Link>
        </div>
      </header>

      {loading ? (
        <p>Cargando categorías…</p>
      ) : error ? (
        <p className="err">{error}</p>
      ) : items.length === 0 ? (
        <p>No hay categorías aún.</p>
      ) : (
        <div className="module-list">
          {items.map((c) => {
            const id = c.id ?? c.idCategoria ?? "";
            return (
              <article key={String(id)} className="module-card">
                <div className="module-body">
                  <h3>{c.nombre} {c.activo === false ? <span style={{color:'#c00', fontSize:'0.8rem', marginLeft:8}}>Inactivo</span> : <span style={{color:'#0a0', fontSize:'0.8rem', marginLeft:8}}>Activo</span>}</h3>
                  <div className="module-meta">
                    <span>{c.descripcion}</span>
                    {c.fecha_creacion && <span style={{marginLeft: '0.5rem', color:'#666'}}>{new Date(c.fecha_creacion).toLocaleDateString()}</span>}
                  </div>
                  <div className="module-footer">
                    <div className="actions">
                      <button onClick={() => navigate(`/dashboard/categories/${id}`)} className="btn-ghost">Editar</button>
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
