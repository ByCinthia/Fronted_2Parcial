import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../services/auth";
import {
  MdDashboard,
  MdInventory,
  MdCategory,
  MdPeople,
  MdSettings,
  MdSecurity,
  MdLogout,
  MdExpandMore,
  MdChevronRight,
  MdBusiness,
} from "react-icons/md";
import { FaBox, FaClipboardList } from "react-icons/fa";
import "../Styles/sidebar.css";

type SubNavItem = { to: string; label: string; icon?: React.ReactNode };
type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  submenu?: SubNavItem[];
  roles?: string[]; // Roles permitidos para ver este item
};

// Items de navegación para Admin
const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    exact: true,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/productos",
    label: "Productos",
    icon: <FaBox size={18} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/categorias",
    label: "Categorías",
    icon: <MdCategory size={20} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/inventario",
    label: "Inventario",
    icon: <MdInventory size={20} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/pedidos",
    label: "Pedidos",
    icon: <FaClipboardList size={18} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/proveedores",
    label: "Proveedores",
    icon: <MdBusiness size={20} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/clientes",
    label: "Clientes",
    icon: <MdPeople size={20} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/usuarios",
    label: "Usuarios",
    icon: <MdSettings size={20} />,
    roles: ["Admin"],
  },
  {
    to: "/dashboard/roles",
    label: "Roles",
    icon: <MdSecurity size={20} />,
    roles: ["Admin"],
  },
];

export default function Sidebar({
  user = {
    name: "Nombre Usuario",
    role: "Super Administrador",
    avatar: "/assets/avatar.jpg",
  },
}: {
  user?: { name: string; role?: string; avatar?: string };
}) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el rol del usuario desde localStorage
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const toggleSubmenu = (itemTo: string) => {
    setExpandedMenus((prev) =>
      prev.includes(itemTo)
        ? prev.filter((menu) => menu !== itemTo)
        : [...prev, itemTo]
    );
  };

  const isExpanded = (itemTo: string) => expandedMenus.includes(itemTo);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  // Filtrar items según el rol del usuario
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <aside className="sidebar-root">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
          <div className="brand-info">
            <div className="brand-name">{user.name}</div>
            <div className="brand-sub">
              {user.role || userRole || "Usuario"}
            </div>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {filteredNavItems.map((item) => (
            <div key={item.to} className="nav-group">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.to)}
                    className={`nav-item nav-expandable ${
                      isExpanded(item.to) ? "expanded" : ""
                    }`}
                  >
                    <span className="nav-icon" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-arrow" aria-hidden>
                      {isExpanded(item.to) ? (
                        <MdExpandMore size={18} />
                      ) : (
                        <MdChevronRight size={18} />
                      )}
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
          <button className="footer-btn" onClick={handleLogout}>
            <MdLogout size={18} style={{ marginRight: "8px" }} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
