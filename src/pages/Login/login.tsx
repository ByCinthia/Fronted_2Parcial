import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let ok = true;
    setErrorEmail("");
    setErrorPassword("");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      setErrorEmail("Ingresa un correo válido.");
      ok = false;
    }
    if (!password || password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      ok = false;
    }
    return ok;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirigir al dashboard después de mostrar el éxito
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }, 900);
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
                <div className="gentle-subtitle">Inicia sesión para administrar tu tienda</div>
              </div>

              <form onSubmit={submit} noValidate>
                <div className="soft-field">
                  <div className="field-container">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      autoComplete="email"
                      required
                    />
                    <label htmlFor="email">Correo electrónico</label>
                    <div className="field-accent" />
                  </div>
                  <span className={`gentle-error ${errorEmail ? "show" : ""}`}>{errorEmail}</span>
                </div>

                <div className="soft-field">
                  <div className={`field-container ${errorPassword ? "error" : ""}`}>
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
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className={`gentle-toggle ${showPwd ? "toggle-active" : ""}`}
                      onClick={() => setShowPwd((s) => !s)}
                    >
                      <svg className="toggle-icon eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <svg className="toggle-icon eye-closed" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="field-accent" />
                  </div>
                  <span className={`gentle-error ${errorPassword ? "show" : ""}`}>{errorPassword}</span>
                </div>

                <div className="comfort-options">
                  <label className="gentle-checkbox">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span className="checkbox-soft">
                      <span className="check-circle" />
                      <span className="check-mark">✓</span>
                    </span>
                    Recuérdame
                  </label>

                  <a className="comfort-link" href="#" onClick={(e) => e.preventDefault()}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button className={`comfort-button ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
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
            <div className="gentle-success show" role="status" aria-live="polite">
              <div className="success-bloom">
                <div className="bloom-rings">
                  <div className="bloom-ring ring-1" />
                  <div className="bloom-ring ring-2" />
                  <div className="bloom-ring ring-3" />
                </div>
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M8 14l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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