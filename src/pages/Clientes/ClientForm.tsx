import { useEffect, useState } from "react";
import { apiGet, updateUser, createUser } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/modulos.css";

type FormState = {
  username: string;
  email?: string; // ahora opcional
  telefono?: string;
  idRol?: number | null;
  password?: string;
};

/* nuevo tipo concreto según la respuesta del backend */
type BackendUser = {
  idUsuario?: number;
  username?: string;
  email?: string;
  telefono?: string | null;
  rol?: { idRol?: number; nombre?: string } | null;
};

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ username: "", email: "", telefono: "", idRol: null, password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet<BackendUser>(`/api/usuarios/${id}/`);
        setForm({
          username: String(data.username ?? ""),
          email: String(data.email ?? ""),
          telefono: data.telefono ?? "",
          idRol: data.rol?.idRol ?? null,
          password: "",
        });
      } catch (err) {
        console.error("Error cargando cliente:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateUser(id, {
          username: form.username,
          email: form.email,
          telefono: form.telefono,
          rol: form.idRol ?? undefined,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        // construir payload con inclusión condicional de email
        const payload: { username: string; password: string; rol: number; email?: string } = {
          username: form.username,
          password: form.password ?? "123456",
          rol: form.idRol ?? 3,
        };
        if (form.email && form.email.trim() !== "") payload.email = form.email.trim();

        await createUser(payload);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>{id ? "Editar cliente" : "Nuevo cliente"}</h2>
      </header>

      <form className="module-form" onSubmit={submit}>
        <label>
          Usuario
          <input name="username" value={form.username} onChange={handle} required />
        </label>
        <label>
          Email
          <input name="email" value={form.email ?? ""} type="email" onChange={handle} /* NOT required */ />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={form.telefono} onChange={handle} />
        </label>
        <label>
          Contraseña {id ? "(dejar vacío para no cambiar)" : ""}
          <input name="password" value={form.password ?? ""} type="password" onChange={handle} />
        </label>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
          <button className="btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}