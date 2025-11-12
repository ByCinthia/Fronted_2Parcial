import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import "../../../Styles/layout_base.css";

/**
 * Layout principal del Dashboard Admin
 * Incluye Topbar, Sidebar y área de contenido
 */
export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Barra superior */}
      <Topbar />

      {/* Sidebar de navegación */}
      <Sidebar />

      {/* Área de contenido principal */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
