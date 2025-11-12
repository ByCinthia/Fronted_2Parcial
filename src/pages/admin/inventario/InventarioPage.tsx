import { MdInventory } from "react-icons/md";

/**
 * Página de Panel de Inventario
 * Por implementar
 */
export default function InventarioPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          <MdInventory
            style={{ marginRight: "12px", verticalAlign: "middle" }}
          />
          Inventario
        </h1>
        <p>Control de stock e inventario</p>
      </div>
      <div className="page-content">
        <div className="empty-state">
          <MdInventory size={64} color="#610C27" style={{ opacity: 0.3 }} />
          <h2>Sección en desarrollo</h2>
          <p>El panel de inventario estará disponible próximamente</p>
        </div>
      </div>
    </div>
  );
}
