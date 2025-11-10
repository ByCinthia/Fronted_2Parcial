import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="module-root">
      <header className="module-header">
        <h1>Panel de Administración</h1>
        <div className="module-actions">
          <span className="small text-muted">Éclat Studio</span>
        </div>
      </header>

      <div className="module-list">
        <div className="module-card">
          <div className="module-body">
            <h3>🛍️ Productos</h3>
            <p className="text-muted">Gestiona tu inventario y catálogo completo de productos disponibles</p>
            <div className="module-footer">
              <span className="small kv">24 productos activos</span>
              <Link to="/dashboard/products" className="btn-ghost">Ver todos</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>📊 Inventario</h3>
            <p className="text-muted">Vista centralizada del stock: detecta productos con bajo stock o agotados</p>
            <div className="module-footer">
              <span className="small kv">Panel de control</span>
              <Link to="/dashboard/inventory" className="btn-ghost">Ir al inventario</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>🏷️ Categorías</h3>
            <p className="text-muted">Administra las categorías que organizan tu catálogo de productos</p>
            <div className="module-footer">
              <span className="small kv">0 categorías</span>
              <Link to="/dashboard/categories" className="btn-ghost">Ver todas</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>👥 Clientes</h3>
            <p className="text-muted">Administra usuarios registrados y gestiona sus perfiles</p>
            <div className="module-footer">
              <span className="small kv">12 clientes activos</span>
              <Link to="/dashboard/clients" className="btn-ghost">Ver todos</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>📦 Pedidos</h3>
            <p className="text-muted">Seguimiento completo de ventas y entregas en tiempo real</p>
            <div className="module-footer">
              <span className="small kv">8 pedidos pendientes</span>
              <Link to="/dashboard/orders" className="btn-ghost">Ver todos</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>⚙️ Usuarios</h3>
            <p className="text-muted">Control de acceso y permisos del sistema administrativo</p>
            <div className="module-footer">
              <span className="small kv">3 usuarios activos</span>
              <Link to="/dashboard/users" className="btn-ghost">Ver todos</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>📊 Estadísticas</h3>
            <p className="text-muted">Análisis detallado de ventas y métricas de rendimiento</p>
            <div className="module-footer">
              <span className="small kv">Datos en tiempo real</span>
              <Link to="/dashboard/stats" className="btn-ghost">Ver reportes</Link>
            </div>
          </div>
        </div>

        <div className="module-card">
          <div className="module-body">
            <h3>🔧 Configuración</h3>
            <p className="text-muted">Ajustes generales del sistema y personalización</p>
            <div className="module-footer">
              <span className="small kv">Panel de configuración</span>
              <Link to="/dashboard/settings" className="btn-ghost">Configurar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}