import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCategory, getCategory, updateCategory } from "./service.ts";
import "../../Styles/modulos.css";

type CategoryFormData = {
  nombre: string;
  descripcion: string;
  activo: boolean;
};

type CategoryResponse = Partial<{
  nombre: string;
  descripcion: string;
  activo: boolean;
}>;

function extractError(e: unknown): string {
  if (!e) return "Error desconocido";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  const obj = e as Record<string, unknown>;
  if ("detail" in obj && typeof obj.detail === "string") return obj.detail;
  if ("message" in obj && typeof obj.message === "string") return obj.message;
  try {
    return JSON.stringify(obj);
  } catch {
    return "Error desconocido";
  }
}

export default function CategoryForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<CategoryFormData>({ nombre: "", descripcion: "", activo: true });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = (await getCategory(id)) as CategoryResponse;
        setForm({ nombre: data.nombre ?? "", descripcion: data.descripcion ?? "", activo: typeof data.activo === 'boolean' ? data.activo : true });
      } catch (error: unknown) {
        console.error(error);
        setErr(extractError(error));
      }
    })();
  }, [id]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value: any = target.type === "checkbox" ? target.checked : target.value;
    setForm({ ...form, [target.name]: value } as any);
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setErr(null);
    try {
  const payload = { ...form };
      if (id) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }
      navigate("/dashboard/categories");
    } catch (error: unknown) {
      console.error(error);
      setErr(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-root">
      <h2>{id ? "Editar categoría" : "Registrar categoría"}</h2>

      <form className="module-form" onSubmit={submit}>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handle} required />
        </label>

        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={handle} />
        </label>

        <label className="gentle-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" name="activo" checked={Boolean(form.activo)} onChange={handle} />
    
        </label>

        {err && <div className="err">{err}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}
