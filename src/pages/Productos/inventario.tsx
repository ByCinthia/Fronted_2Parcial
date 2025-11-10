import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "./service";
import { listCategories } from "../Categorias/service";
import "../../Styles/modulos.css";

type ProductFormData = {
  nombre: string;
  categoria: string | number;
  precio: string | number;
  descripcion: string;
  active: boolean;
};

type Variant = {
  id?: number;
  sku?: string;
  size?: string;
  color?: string;
  model_name?: string;
  price?: number | string;
  stock?: number | string;
};

type ProductResponse = Partial<{
  // Spanish fields
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string | { idCategoria?: number; id?: number; nombre?: string };
  // English/DRF fields
  name: string;
  description: string;
  base_price: number;
  categoria_id: number;
  // common/optional
  talla: string;
  color: string;
  stock: number;
  imagen: string;
  variants: Variant[];
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
    precio: "",
    descripcion: "",
    active: true,
  });
  const [categories, setCategories] = useState<Array<{ id?: number; idCategoria?: number; nombre: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imagenFiles, setImagenFiles] = useState<File[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = (await getProduct(id)) as ProductResponse;
        setForm({
          nombre: (data.nombre ?? (data.name as string) ?? "") as string,
          categoria:
            typeof data.categoria === "object" && data.categoria !== null
              ? (data.categoria.idCategoria ?? data.categoria.id ?? "")
              : (data.categoria ?? (data as any).categoria_id ?? ""),
          precio: (data.precio ?? data.base_price ?? "") as any,
          descripcion: (data.descripcion ?? (data.description as string) ?? "") as string,
          active: (data as any).active ?? true,
        });

        // load variants if any
        if (Array.isArray((data as any).variants)) setVariants((data as any).variants as Variant[]);
      } catch (error: unknown) {
        console.error(error);
        setErr(extractError(error));
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setCategoriesLoading(true);
        const data = await listCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading categories", error);
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImagenFiles(files);
  };

  const addVariant = () => setVariants((s) => [...s, { sku: "", size: "", color: "", model_name: "", price: "", stock: "" }]);
  const removeVariant = (idx: number) => setVariants((s) => s.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, key: keyof Variant, value: any) =>
    setVariants((s) => s.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      let payload: FormData | Record<string, unknown>;

      // prefer FormData when there are files to upload
        if (imagenFiles.length > 0) {
        const fd = new FormData();
        fd.append("name", String(form.nombre ?? ""));
        fd.append("description", String(form.descripcion ?? ""));
        fd.append("base_price", String(typeof form.precio === "string" ? form.precio : String(form.precio ?? "")));
        const categoriaVal = typeof form.categoria === "string" && /^\d+$/.test(String(form.categoria))
          ? String(parseInt(String(form.categoria), 10))
          : String(form.categoria ?? "");
        fd.append("categoria_id", categoriaVal);
        // product model doesn't include talla/color/stock at top-level; variants carry those attributes

        imagenFiles.forEach((f) => fd.append("images", f));

        if (variants && variants.length > 0) {
          fd.append(
            "variants",
            JSON.stringify(
              variants.map((v) => ({
                sku: v.sku,
                size: v.size,
                color: v.color,
                model_name: v.model_name,
                price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
                stock: typeof v.stock === "string" ? parseInt(String(v.stock || "0"), 10) : v.stock,
              }))
            )
          );
        }

        payload = fd;
      } else {
        const categoriaVal = typeof form.categoria === "string" && /^\d+$/.test(String(form.categoria))
          ? parseInt(String(form.categoria), 10)
          : form.categoria;

        // Build JSON payload. Only include top-level talla/color/stock when there are no variants.
        payload = {
          name: form.nombre,
          description: form.descripcion,
          base_price: typeof form.precio === "string" ? parseFloat(form.precio || "0") : form.precio,
          categoria_id: categoriaVal,
          // top-level talla/color/stock removed: variants contain size/color/stock
          variants: variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            model_name: v.model_name,
            price: typeof v.price === "string" ? parseFloat(v.price || "0") : v.price,
            stock: typeof v.stock === "string" ? parseInt(String(v.stock || "0"), 10) : v.stock,
          })),
        };
      }

      if (id) await updateProduct(id, payload);
      else await createProduct(payload);

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
            {categoriesLoading ? (
              <select name="categoria" value={form.categoria as any} onChange={handle} disabled>
                <option> Cargando categorías… </option>
              </select>
            ) : (
              <select name="categoria" value={String(form.categoria ?? "")} onChange={handle} required>
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={String(c.id ?? c.idCategoria ?? c.nombre)} value={c.id ?? c.idCategoria ?? c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            )}
          </label>
            <label style={{ alignSelf: 'center', marginLeft: 12 }}>
              Activo
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                style={{ marginLeft: 8 }}
              />
            </label>
        </div>

        {/* top-level talla/color removed - use variantes */}

        <div className="form-row">
          <label>
            Precio (base)
            <input name="precio" type="number" step="0.01" value={form.precio as number | string} onChange={handle} required />
          </label>

          {/* stock at product level removed - use variant.stock when using variants */}
        </div>

        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={handle} />
        </label>

        <label>
          Imágenes
          <input type="file" accept="image/*" onChange={handleFile} multiple />
        </label>

        <section style={{ marginTop: 12 }}>
          <h4>Variantes</h4>
          <div style={{ marginBottom: 8 }}>
            <button type="button" className="btn-ghost" onClick={addVariant}>Agregar variante</button>
          </div>
          {variants.length === 0 && <div className="small text-muted">No hay variantes. Puedes agregar una si el producto tiene múltiples tallas/precios.</div>}
          {variants.map((v, idx) => (
            <div key={idx} className="module-card" style={{ padding: 8, marginBottom: 8 }}>
              <div className="form-row">
                <label>
                  SKU
                  <input value={v.sku ?? ""} onChange={(e) => updateVariant(idx, "sku", e.target.value)} />
                </label>
                <label>
                  Talla
                  <input value={v.size ?? ""} onChange={(e) => updateVariant(idx, "size", e.target.value)} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Color
                  <input value={v.color ?? ""} onChange={(e) => updateVariant(idx, "color", e.target.value)} />
                </label>
                <label>
                  Modelo
                  <input value={v.model_name ?? ""} onChange={(e) => updateVariant(idx, "model_name", e.target.value)} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Precio
                  <input type="number" step="0.01" value={v.price as number | string ?? ""} onChange={(e) => updateVariant(idx, "price", e.target.value)} />
                </label>
                <label>
                  Stock
                  <input type="number" value={v.stock as number | string ?? ""} onChange={(e) => updateVariant(idx, "stock", e.target.value)} />
                </label>
              </div>
              <div style={{ textAlign: "right" }}>
                <button type="button" className="btn-danger" onClick={() => removeVariant(idx)}>Eliminar variante</button>
              </div>
            </div>
          ))}
        </section>

        {err && <div className="err">{err}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}
