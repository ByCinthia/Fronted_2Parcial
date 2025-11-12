import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import type { User } from "../services/api";
import { MdSearch, MdNotifications, MdSettings } from "react-icons/md";
import { FaGem } from "react-icons/fa";
import "../Styles/topbar.css";

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  return (
    <header className="topbar-root">
      <div className="topbar-brand">
        <div className="brand-logo">
          <FaGem size={24} />
        </div>
        <span className="brand-text">Éclat Studio</span>
      </div>

      <div className="topbar-actions">
        <div className="topbar-qa">
          <button className="qa-btn" title="Buscar">
            <MdSearch size={20} />
          </button>
          <button className="qa-btn notify" title="Notificaciones">
            <MdNotifications size={20} />
          </button>
          <button className="qa-btn" title="Ajustes">
            <MdSettings size={20} />
          </button>
        </div>

        {user && (
          <div className="topbar-user">
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.rol.nombre}</span>
            </div>
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
