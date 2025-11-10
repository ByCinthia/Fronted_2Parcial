import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, registerClient, loginUser } from "../../services/api";
import "../../Styles/modulos.css";

type FormDataClient = {
  username: string;
  email: string;
  password: string;
  fcmToken?: string;
};

/* nuevo tipo para la respuesta del registro */
type CreatedUser = {
  idUsuario?: number;
  username?: string;
  email?: string;
  fcmToken?: string | null;
  telefono?: string | null;
  rol?: { idRol?: number; nombre?: string } | null;
};

function extractError(e: unknown): string {
  if (!e) return "Error desconocido";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  try {
    const obj = e as Record<string, unknown>;
    if (typeof obj?.error === "string") return obj.error;
    if (typeof obj?.detail === "string") return obj.detail;
    if (typeof obj?.message === "string") return obj.message;
    return JSON.stringify(obj);
  } catch {
    return "Error desconocido";
  }
}

export default function RegistroCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormDataClient>({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buscarCliente = async () => {
    if (!form.email) {
      setError("Introduce un email para buscar.");
      return;
    }
    setSearching(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiGet(`/api/usuarios/?email=${encodeURIComponent(form.email)}`);
      // res puede ser array o objeto, tratamos array
      if (Array.isArray(res) && res.length > 0) {
        setMessage(`Cliente encontrado: ${res[0].username ?? res[0].email}.`);
      } else {
        setMessage("No se encontraron clientes con ese email. Puedes registrarlo.");
      }
    } catch (err: unknown) {
      setMessage("No se encontraron clientes con ese email (o la búsqueda no está disponible).");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!form.username || !form.email || !form.password) {
      setError("Todos los campos obligatorios deben completarse.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // Registrar cliente público (usa /registrar/)
      const created = await registerClient({
        username: form.username,
        email: form.email,
        password: form.password,
        fcmToken: form.fcmToken,
      });

      // convertir respuesta a tipo seguro en lugar de usar `any`
      const createdUser = (created as unknown) as CreatedUser;
      const createdName = createdUser.username ?? createdUser.email ?? "cliente";
      setMessage(`Registro exitoso: ${createdName}`);

      // intentar login automático, manejar fallo (no dejar catch vacío)
      try {
        await loginUser(form.username, form.password);
      } catch (e) {
        console.warn("Auto login failed:", e);
      }

      setTimeout(() => navigate("/shop"), 700);
    } catch (err: unknown) {
      console.error(err);
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>Registro de cliente</h2>
      </header>

      <form className="module-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            Usuario
            <input name="username" value={form.username} onChange={handle} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handle} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            Contraseña
            <input name="password" type="password" value={form.password} onChange={handle} required />
          </label>

          <label>
            FCM Token (opcional)
            <input name="fcmToken" value={form.fcmToken ?? ""} onChange={handle} />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={buscarCliente} disabled={searching}>
            {searching ? "Buscando…" : "Buscar cliente"}
          </button>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registrando…" : "Registrar cliente"}
          </button>
        </div>

        {message && <div className="module-note" role="status">{message}</div>}
        {error && <div className="form-error" role="alert">{error}</div>}
      </form>
    </section>
  );
}