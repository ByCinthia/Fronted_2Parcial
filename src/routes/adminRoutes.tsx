import type { RouteObject } from "react-router-dom";
import DashboardLayout from "../pages/admin/dashboard/DashboardLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";

/* Páginas de admin */
import ProductosPage from "../pages/admin/productos/ProductosPage";
import CategoriasPage from "../pages/admin/categorias/CategoriasPage";
import InventarioPage from "../pages/admin/inventario/InventarioPage";
import ClientesPage from "../pages/admin/clientes/ClientesPage";
import UsuariosPage from "../pages/admin/usuarios/UsuariosPage";
import RolesPage from "../pages/admin/roles/RolesPage";
import PedidosPage from "../pages/admin/pedidos/PedidosPage";
import ProveedorPage from "../pages/admin/proveedor/ProveedorPage";

/**
 * Rutas disponibles para usuarios con rol "Admin"
 */
export const adminRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      /* Dashboard principal */
      { index: true, element: <Dashboard /> },

      /* Productos */
      { path: "productos", element: <ProductosPage /> },

      /* Categorías */
      { path: "categorias", element: <CategoriasPage /> },

      /* Inventario */
      { path: "inventario", element: <InventarioPage /> },

      /* Pedidos */
      { path: "pedidos", element: <PedidosPage /> },

      /* Proveedores */
      { path: "proveedores", element: <ProveedorPage /> },

      /* Clientes */
      { path: "clientes", element: <ClientesPage /> },

      /* Usuarios */
      { path: "usuarios", element: <UsuariosPage /> },

      /* Roles */
      { path: "roles", element: <RolesPage /> },
    ],
  },
];
