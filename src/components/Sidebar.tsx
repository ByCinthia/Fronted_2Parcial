import React from "react";
import { Link } from "react-router-dom";
import "../Styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-root" aria-label="Sidebar">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-mark">É</div>
          <div className="brand-name">Éclat Studio</div>
        </div>

        <div className="menu-title">MENÚ</div>
        <nav className="nav-list">
          <Link className="nav-item" to="/dashboard">Resumen</Link>
          <Link className="nav-item" to="/dashboard/products">Productos</Link>
          <Link className="nav-item" to="/dashboard/orders">Pedidos</Link>
          <Link className="nav-item" to="/dashboard/clients">Clientes</Link>
          <Link className="nav-item" to="/dashboard/users">Usuarios</Link>
        </nav>

        <div className="sidebar-footer">
          <button className="footer-btn">Cerrar sesión</button>
        </div>
      </div>
    </aside>
  );
}