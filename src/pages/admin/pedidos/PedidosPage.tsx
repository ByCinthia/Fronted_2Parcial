import { FaClipboardList } from "react-icons/fa";

/**
 * Página de gestión de Pedidos
 * Por implementar
 */
export default function PedidosPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          <FaClipboardList
            style={{ marginRight: "12px", verticalAlign: "middle" }}
          />
          Pedidos
        </h1>
        <p>Gestión de pedidos y órdenes</p>
      </div>
      <div className="page-content">
        <div className="empty-state">
          <FaClipboardList size={64} color="#610C27" style={{ opacity: 0.3 }} />
          <h2>Sección en desarrollo</h2>
          <p>La gestión de pedidos estará disponible próximamente</p>
        </div>
      </div>
    </div>
  );
}
