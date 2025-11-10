import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut, listRoles } from "../../services/api";
import "../../Styles/modulos.css";

type Role = { idRol: number; nombre: string };
type CurrentUser = { rol?: { nombre?: string } } | null;
type FormState = { username: string; email: string; password: string; rol: number };
type UserPayload = { username: string; email: string; idRol?: number | null; password?: string };

export default function UserForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "", rol: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // obtener usuario logueado desde localStorage
    const raw = localStorage.getItem("current_user");
    if (!raw) return; // no logueado -> no cargar roles
    try {
      const user = JSON.parse(raw) as CurrentUser;
      const rolNombre = (user?.rol?.nombre || "").toString().toLowerCase();
      // condición: solo si es SuperAdmin (o contiene 'admin')
      if (!rolNombre.includes("admin")) return;

      let mounted = true;
      listRoles()
        .then((data: unknown) => {
          if (!mounted) return;
          if (Array.isArray(data)) {
            setRoles(data as Role[]);
          } else {
            console.warn("listRoles no devolvió array:", data);
          }
        })
        .catch((err) => {
          console.error("Error cargando roles:", err);
        });
      return () => {
        mounted = false;
      };
    } catch (e) {
      console.error("Error parseando current_user:", e);
      return;
    }
  }, []);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await apiGet<{ username?: string; email?: string; idRol?: number }>(`/api/usuarios/${id}/`);
          setForm({
            username: data.username ?? "",
            email: data.email ?? "",
            password: "",
            rol: data.idRol ?? 0
          });
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar el usuario.");
        }
      })();
    }
  }, [id]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: UserPayload = {
        username: form.username,
        email: form.email,
        idRol: form.rol ? parseInt(String(form.rol), 10) : null,
      };

      if (form.password) payload.password = form.password;

      if (id) {
        await apiPut(`/api/usuarios/${id}/`, payload);
      } else {
        await apiPost("/api/usuarios/", payload);
      }
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      setError("Error al guardar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>{id ? "Editar usuario" : "Registrar usuario"}</h2>
      </header>

      <form className="module-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            Username
            <input name="username" value={form.username} onChange={handle} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handle} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            Contraseña {id && <span className="small text-muted">(dejar vacío para no cambiar)</span>}
            <input name="password" type="password" value={form.password} onChange={handle} required={!id} />
          </label>
          {roles.length > 0 && (
            <label>
              Rol
              <select name="rol" value={form.rol} onChange={handle} required>
                <option value={0}>Seleccionar rol</option>
                {roles.map(r => (
                  <option key={r.idRol} value={r.idRol}>{r.nombre}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
          <button className="btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}