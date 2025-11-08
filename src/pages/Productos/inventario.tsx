import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "./service";
import "../../Styles/modulos.css";

type ProductFormData = {
  nombre: string;
  categoria: string;
  talla: string;
  color: string;
  tipo: string;
  precio: string | number;
  stock: string | number;
  descripcion: string;
  imagen?: string;
};

type ProductResponse = Partial<{
  nombre: string;
  categoria: string;
  talla: string;
  color: string;
  tipo: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
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

export default function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormData>({
    nombre: "",
    categoria: "",
    talla: "",
    color: "",
    tipo: "",
    precio: "",
    stock: "",
    descripcion: "",
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = (await getProduct(id)) as ProductResponse;
        setForm({
          nombre: data.nombre ?? "",
          categoria: data.categoria ?? "",
          talla: data.talla ?? "",
          color: data.color ?? "",
          tipo: data.tipo ?? "",
          precio: data.precio ?? "",
          stock: data.stock ?? "",
          descripcion: data.descripcion ?? "",
        });
      } catch (error: unknown) {
        console.error(error);
        setErr(extractError(error));
      }
    })();
  }, [id]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagenFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      // usar FormData si hay imagen
      let payload: FormData | Record<string, unknown>;
      if (imagenFile) {
        const fd = new FormData();
        (Object.keys(form) as Array<keyof ProductFormData>).forEach((k) =>
          fd.append(k, String(form[k] ?? ""))
        );
        fd.append("imagen", imagenFile);
        payload = fd;
      } else {
        payload = {
          ...form,
          precio: typeof form.precio === "string" ? parseFloat(form.precio || "0") : form.precio,
          stock: typeof form.stock === "string" ? parseInt(String(form.stock || "0"), 10) : form.stock,
        };
      }

      if (id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/dashboard/products");
    } catch (error: unknown) {
      console.error(error);
      setErr(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-root">
      <h2>{id ? "Editar producto" : "Registrar producto"}</h2>

      <form className="module-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={handle} required />
          </label>

          <label>
            Categoría
            <input name="categoria" value={form.categoria} onChange={handle} placeholder="ropa, accesorios, calzado..." />
          </label>
        </div>

        <div className="form-row">
          <label>
            Talla
            <input name="talla" value={form.talla} onChange={handle} placeholder="S, M, L, 38, etc." />
          </label>

          <label>
            Color
            <input name="color" value={form.color} onChange={handle} placeholder="rojo, crema, azul..." />
          </label>
        </div>

        <label>
          Tipo
          <input name="tipo" value={form.tipo} onChange={handle} placeholder="formal, casual, deportiva..." />
        </label>

        <div className="form-row">
          <label>
            Precio
            <input name="precio" type="number" step="0.01" value={form.precio as number | string} onChange={handle} required />
          </label>

          <label>
            Stock
            <input name="stock" type="number" value={form.stock as number | string} onChange={handle} required />
          </label>
        </div>

        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={handle} />
        </label>

        <label>
          Imagen (opcional)
          <input type="file" accept="image/*" onChange={handleFile} />
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