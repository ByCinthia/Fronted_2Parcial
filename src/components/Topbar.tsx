import React from "react";
import { Link } from "react-router-dom";
import "../Styles/topbar.css";

export default function Topbar() {
  return (
    <header className="topbar-root">
      <div className="topbar-left">
        <Link to="/" className="topbar-brand">Éclat Studio</Link>
      </div>

      <div className="topbar-actions">
        {/* quick actions movidas aquí */}
        <div className="topbar-qa" role="toolbar" aria-label="Herramientas rápidas">
          <button className="qa-btn" title="Buscar">🔍</button>
          <button className="qa-btn" title="Notificaciones">🔔</button>
          <button className="qa-btn" title="Ajustes">⚙️</button>
        </div>

        <nav className="topbar-nav">
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
