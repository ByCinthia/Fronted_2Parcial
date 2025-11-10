import React from "react";
import "../Styles/topbar.css";

export default function Topbar() {
  return (
    <header className="topbar-root">
      <div className="topbar-inner">
        <a className="topbar-brand" href="/">Éclat Studio</a>
        <div className="topbar-actions">
          <div className="topbar-qa">
            <button className="qa-btn" title="Buscar">🔍</button>
            <button className="qa-btn" title="Notificaciones">🔔</button>
            <button className="qa-btn" title="Ajustes">⚙️</button>
          </div>
          <nav className="topbar-nav">
            <a href="/login">Login</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
