import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/login.css";
import { signIn } from "../../services/auth";

type ApiErrorShape = {
  data?: { detail?: string } | string;
  detail?: string;
  message?: string;
  error?: string;
};

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const e = err as ApiErrorShape & { data?: { non_field_errors?: string[] } };

    // caso: { data: { non_field_errors: ["mensaje"] } }
    if (e.data && typeof e.data === "object" && "non_field_errors" in e.data) {
      const errors = (e.data as { non_field_errors?: string[] })
        .non_field_errors;
      if (Array.isArray(errors) && errors.length > 0) {
        return errors[0]; // devolver el primer error
      }
    }

    // caso: { data: { detail: "..." } } o { data: "..." }
    if (e.data) {
      if (typeof e.data === "string") return e.data;
      if (typeof (e.data as { detail?: string }).detail === "string") {
        return (e.data as { detail?: string }).detail as string;
      }
    }

    // caso: { detail: "..." } o { message: "..." } o { error: "..." }
    if (typeof e.detail === "string") return e.detail;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error === "string") return e.error;
  }
  return "No se pudo iniciar sesión";
}

export default function Login() {
  const navigate = useNavigate();

  // ahora "identifier" puede ser username o email
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorIdentifier, setErrorIdentifier] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorServer, setErrorServer] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let ok = true;
    setErrorIdentifier("");
    setErrorPassword("");

    // Validar email (es el campo requerido por el backend)
    if (!identifier || identifier.trim().length === 0) {
      setErrorIdentifier("El correo electrónico es requerido.");
      ok = false;
    } else {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(identifier)) {
        setErrorIdentifier("Ingresa un correo electrónico válido.");
        ok = false;
      }
    }

    if (!password || password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      ok = false;
    }
    return ok;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorServer("");
    if (!validate()) return;
    setLoading(true);
    try {
      // Realizar login con email y password
      await signIn(identifier.trim(), password);
      setSuccess(true);

      // Redirigir según el rol del usuario
      const userRole = localStorage.getItem("user_role");
      const redirectPath = userRole === "Admin" ? "/dashboard" : "/";

      setTimeout(() => navigate(redirectPath), 900);
    } catch (err: unknown) {
      console.error("Login error:", err);
      const msg = getErrorMessage(err);
      setErrorServer(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full">
      <div className="login-container">
        <div className="soft-card" role="region" aria-label="Login">
          {!success ? (
            <>
              <div className="comfort-header">
                <div className="gentle-logo" aria-hidden>
                  <div className="logo-circle">
                    <span className="comfort-icon">✦</span>
                    <div className="gentle-glow" />
                  </div>
                </div>
                <h1 className="comfort-title">Éclat Studio</h1>
                <div className="gentle-subtitle">
                  Inicia sesión para administrar tu tienda
                </div>
              </div>

              <form onSubmit={submit} noValidate>
                <div className="soft-field">
                  <div className="field-container">
                    <input
                      type="email"
                      id="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder=" "
                      autoComplete="email"
                      required
                    />
                    <label htmlFor="identifier">Correo electrónico</label>
                    <div className="field-accent" />
                  </div>
                  <span
                    className={`gentle-error ${errorIdentifier ? "show" : ""}`}
                  >
                    {errorIdentifier}
                  </span>
                </div>

                <div className="soft-field">
                  <div
                    className={`field-container ${
                      errorPassword ? "error" : ""
                    }`}
                  >
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      autoComplete="current-password"
                      required
                    />
                    <label htmlFor="password">Contraseña</label>
                    <button
                      type="button"
                      aria-label={
                        showPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      className={`gentle-toggle ${
                        showPwd ? "toggle-active" : ""
                      }`}
                      onClick={() => setShowPwd((s) => !s)}
                    >
                      <span className="toggle-icon">
                        {showPwd ? "🙈" : "👁️"}
                      </span>
                    </button>
                    <div className="field-accent" />
                  </div>
                  <span
                    className={`gentle-error ${errorPassword ? "show" : ""}`}
                  >
                    {errorPassword}
                  </span>
                </div>

                {errorServer && (
                  <div className="server-error" role="alert">
                    {errorServer}
                  </div>
                )}

                <div className="comfort-options">
                  <label className="gentle-checkbox">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="checkbox-soft">
                      <span className="check-circle" />
                      <span className="check-mark">✓</span>
                    </span>
                    Recuérdame
                  </label>

                  <a
                    className="comfort-link"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  className={`comfort-button ${loading ? "loading" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  <span className="button-background" />
                  <span className="button-glow" />
                  <span className="button-text">Entrar</span>
                  <span className="button-loader" aria-hidden>
                    <span className="gentle-spinner">
                      <span className="spinner-circle" />
                    </span>
                  </span>
                </button>
              </form>
            </>
          ) : (
            <div
              className="gentle-success show"
              role="status"
              aria-live="polite"
            >
              <div className="success-bloom">
                <div className="bloom-rings">
                  <div className="bloom-ring ring-1" />
                  <div className="bloom-ring ring-2" />
                  <div className="bloom-ring ring-3" />
                </div>
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path
                      d="M8 14l5 5 11-11"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="success-title">¡Bienvenido!</h3>
              <p className="success-desc">Redirigiendo al dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
