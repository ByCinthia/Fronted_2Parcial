import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Styles/sidebar.css";

type SubNavItem = { to: string; label: string; icon?: React.ReactNode };
type NavItem = { 
  to: string; 
  label: string; 
  icon: React.ReactNode; 
  exact?: boolean;
  submenu?: SubNavItem[];
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Resumen", icon: "🏠", exact: true },
  { to: "/dashboard/products", label: "Productos", icon: "📦" },
  { to: "/dashboard/orders", label: "Pedidos", icon: "📋" },
  { to: "/dashboard/clients", label: "Clientes", icon: "👥" },
  { 
    to: "/dashboard/users", 
    label: "Usuarios", 
    icon: "⚙️",
    submenu: [
      { to: "/dashboard/users", label: "Lista de usuarios", icon: "👤" },
      { to: "/dashboard/users/new", label: "Crear usuario", icon: "➕" },
      { to: "/dashboard/roles", label: "Gestionar roles", icon: "🎭" },
    ]
  },
];

export default function Sidebar({
  user = { name: "Nombre Usuario", role: "Super Administrador", avatar: "/assets/avatar.jpg" },
}: { user?: { name: string; role?: string; avatar?: string } }) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (itemTo: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemTo) 
        ? prev.filter(menu => menu !== itemTo)
        : [...prev, itemTo]
    );
  };

  const isExpanded = (itemTo: string) => expandedMenus.includes(itemTo);

  return (
    <aside className="sidebar-root">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
          <div className="brand-info">
            <div className="brand-name">{user.name}</div>
            <div className="brand-sub">{user.role}</div>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <div key={item.to} className="nav-group">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.to)}
                    className={`nav-item nav-expandable ${isExpanded(item.to) ? 'expanded' : ''}`}
                  >
                    <span className="nav-icon" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-arrow" aria-hidden>
                      {isExpanded(item.to) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {isExpanded(item.to) && (
                    <div className="nav-submenu">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          end={subItem.to === "/dashboard/users"}
                          className={({ isActive }) =>
                            `nav-subitem${isActive ? " active" : ""}`
                          }
                        >
                          {subItem.icon && (
                            <span className="nav-subicon" aria-hidden>
                              {subItem.icon}
                            </span>
                          )}
                          <span className="nav-sublabel">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-item${isActive ? " active" : ""}`
                  }
                >
                  <span className="nav-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="footer-btn">Cerrar sesión</button>
        </div>
      </div>
    </aside>
  );
}