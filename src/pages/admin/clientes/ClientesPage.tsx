import { MdPeople } from "react-icons/md";

/**
 * Página de gestión de Clientes
 * Por implementar
 */
export default function ClientesPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          <MdPeople style={{ marginRight: "12px", verticalAlign: "middle" }} />
          Clientes
        </h1>
        <p>Gestión de clientes y usuarios finales</p>
      </div>
      <div className="page-content">
        <div className="empty-state">
          <MdPeople size={64} color="#610C27" style={{ opacity: 0.3 }} />
          <h2>Sección en desarrollo</h2>
          <p>La gestión de clientes estará disponible próximamente</p>
        </div>
      </div>
    </div>
  );
}
