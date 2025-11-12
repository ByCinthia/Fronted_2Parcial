import { useEffect, useState } from "react";
import { getUser } from "../../../services/api";
import type { User } from "../../../services/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  MdAttachMoney,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdAdd,
  MdBarChart,
  MdCheckCircle,
  MdWarning,
  MdPersonAdd,
} from "react-icons/md";
import { FaBox, FaClipboardList, FaCog } from "react-icons/fa";
import "./dashboard.css";

/**
 * Dashboard principal para administradores
 * Muestra resumen de estadísticas y bienvenida
 */
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario desde localStorage
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <Skeleton width={300} height={40} />
            <Skeleton width={400} height={20} style={{ marginTop: "8px" }} />
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton circle width={60} height={60} />
              <div style={{ flex: 1, marginLeft: "16px" }}>
                <Skeleton width={100} height={16} />
                <Skeleton width={80} height={32} style={{ marginTop: "8px" }} />
                <Skeleton
                  width={120}
                  height={14}
                  style={{ marginTop: "8px" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header de bienvenida */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            ¡Bienvenido de vuelta, {user?.username || "Admin"}!
          </h1>
          <p className="dashboard-subtitle">
            Aquí está un resumen de tu negocio hoy
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <MdAdd size={20} style={{ marginRight: "8px" }} />
            Nuevo producto
          </button>
          <button className="action-btn secondary">
            <MdBarChart size={20} style={{ marginRight: "8px" }} />
            Ver reportes
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(227,193,180,0.2)" }}
          >
            <MdAttachMoney size={32} color="#610C27" />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Ventas del día</h3>
            <p className="stat-value">$12,450</p>
            <span className="stat-change positive">+12.5% vs ayer</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(172,156,141,0.2)" }}
          >
            <MdInventory size={32} color="#AC9C8D" />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Productos</h3>
            <p className="stat-value">248</p>
            <span className="stat-change neutral">15 sin stock</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(97,12,39,0.1)" }}
          >
            <MdShoppingCart size={32} color="#610C27" />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Pedidos</h3>
            <p className="stat-value">34</p>
            <span className="stat-change positive">8 pendientes</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(212,175,55,0.15)" }}
          >
            <MdPeople size={32} color="#d4af37" />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Clientes</h3>
            <p className="stat-value">1,284</p>
            <span className="stat-change positive">+45 este mes</span>
          </div>
        </div>
      </div>

      {/* Sección de acciones rápidas */}
      <div className="quick-actions-section">
        <h2 className="section-title">Acciones rápidas</h2>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="qa-icon">
              <FaBox size={32} color="#610C27" />
            </div>
            <h3>Gestionar Productos</h3>
            <p>Administra tu inventario y catálogo</p>
            <button className="qa-btn">Ir a productos</button>
          </div>

          <div className="quick-action-card">
            <div className="qa-icon">
              <MdPeople size={36} color="#d4af37" />
            </div>
            <h3>Ver Clientes</h3>
            <p>Gestiona tu base de clientes</p>
            <button className="qa-btn">Ver clientes</button>
          </div>

          <div className="quick-action-card">
            <div className="qa-icon">
              <FaClipboardList size={32} color="#AC9C8D" />
            </div>
            <h3>Pedidos</h3>
            <p>Revisa y procesa pedidos</p>
            <button className="qa-btn">Ver pedidos</button>
          </div>

          <div className="quick-action-card">
            <div className="qa-icon">
              <FaCog size={32} color="#E3C1B4" />
            </div>
            <h3>Configuración</h3>
            <p>Usuarios, roles y ajustes</p>
            <button className="qa-btn">Configurar</button>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="activity-section">
        <h2 className="section-title">Actividad reciente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <MdShoppingCart size={24} color="#610C27" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>Nuevo pedido #1234</strong> de María González
              </p>
              <span className="activity-time">Hace 5 minutos</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <MdWarning size={24} color="#d4af37" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>Stock bajo</strong> en Producto XYZ
              </p>
              <span className="activity-time">Hace 15 minutos</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <MdPersonAdd size={24} color="#AC9C8D" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>Nuevo cliente</strong> registrado: Juan Pérez
              </p>
              <span className="activity-time">Hace 1 hora</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <MdCheckCircle size={24} color="#51cf66" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>Pedido #1230</strong> marcado como completado
              </p>
              <span className="activity-time">Hace 2 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
