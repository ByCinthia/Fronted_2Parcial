import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../../services/api";
import "../../Styles/modulos.css";

type FormState = {
  username: string;
  email: string;
  password: string;
  idRol: string;
};

type Rol = {
  idRol: number;
  nombre: string;
};

type UserPayload = {
  username: string;
  email: string;
  idRol?: number | null;
  password?: string;
};

export default function UserForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "", idRol: "" });
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar roles disponibles
    (async () => {
      try {
        const rolesData = await apiGet<Rol[]>("/roles");
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (err) {
        console.error("Error cargando roles:", err);
      }
    })();

    // Cargar usuario si estamos editando
    if (id) {
      (async () => {
        try {
          const data = await apiGet<{ username?: string; email?: string; idRol?: number }>(`/usuarios/${id}`);
          setForm({
            username: data.username ?? "",
            email: data.email ?? "",
            password: "", // no cargar password por seguridad
            idRol: String(data.idRol ?? "")
          });
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar el usuario.");
        }
      })();
    }
  }, [id]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: UserPayload = {
        username: form.username,
        email: form.email,
        idRol: form.idRol ? parseInt(form.idRol, 10) : null,
      };

      // asignar password solo si viene (evita delete y any)
      if (form.password) payload.password = form.password;

      if (id) {
        await apiPut(`/usuarios/${id}`, payload);
      } else {
        await apiPost("/usuarios", payload);
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
          <label>
            Rol
            <select name="idRol" value={form.idRol} onChange={handle} required>
              <option value="">Seleccionar rol</option>
              {roles.map(r => (
                <option key={r.idRol} value={r.idRol}>{r.nombre}</option>
              ))}
            </select>
          </label>
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