import React from "react";
import { NavLink } from "react-router-dom";
import "../Styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-root" aria-label="Sidebar">
      <div className="sidebar-top">
        {/* logo de la empresa en formato redondo, coloca el archivo en public/assets/logo.jpg o src/assets y ajusta src */}
        <img src="/assets/logo.jpg" alt="Éclat Studio" className="brand-logo" />

        <div className="brand">
          <div className="brand-mark" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18" stroke="#8b6655" strokeWidth="2" />
            </svg>
          </div>
          <div className="brand-name">Éclat Studio</div>
        </div>

        {/* quick-actions eliminadas del sidebar */}
      </div>

      <div className="menu-block">
        <div className="menu-title">MENÚ</div>
        <nav className="nav-list" aria-label="Navegación principal">
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon" aria-hidden>🏠</span>
            <span className="nav-label">Resumen</span>
          </NavLink>

          <NavLink to="/dashboard/products" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon" aria-hidden>🛍️</span>
            <span className="nav-label">Productos</span>
          </NavLink>

          <NavLink to="/dashboard/orders" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon" aria-hidden>📦</span>
            <span className="nav-label">Pedidos</span>
          </NavLink>

          <NavLink to="/dashboard/users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon" aria-hidden>👥</span>
            <span className="nav-label">Usuarios</span>
          </NavLink>

          <NavLink to="/dashboard/clients" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon" aria-hidden>🧾</span>
            <span className="nav-label">Clientes</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="footer-btn">Cerrar sesión</button>
      </div>
    </aside>
  );
}