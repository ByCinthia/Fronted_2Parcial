import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/auth/login";
import RegistroCliente from "../pages/auth/register";
import { adminRoutes } from "./adminRoutes";
import { clientRoutes } from "./clientRoutes";

/**
 * Función helper para envolver rutas con ProtectedRoute
 * Solo protege la ruta padre, los children heredan la protección
 */
function protectRoutes(
  routes: RouteObject[],
  allowedRoles: string[]
): RouteObject[] {
  return routes.map((route) => ({
    ...route,
    element: route.element ? (
      <ProtectedRoute allowedRoles={allowedRoles}>
        {route.element}
      </ProtectedRoute>
    ) : undefined,
    // Los children NO se envuelven nuevamente, heredan la protección del padre
    children: route.children,
  })) as RouteObject[];
}

/**
 * Configuración completa de rutas de la aplicación
 * Incluye rutas públicas y rutas protegidas por rol
 */
export const getRoutes = (): RouteObject[] => {
  // Debug: ver rutas generadas
  const adminProtected = protectRoutes(adminRoutes, ["Admin"]);
  const clientProtected = protectRoutes(clientRoutes, ["Cliente"]);

  console.log("Admin Routes:", adminProtected);
  console.log("Client Routes:", clientProtected);

  return [
    // Rutas públicas
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: <RegistroCliente />,
    },

    // Rutas protegidas para Admin (deben ir ANTES que las de cliente)
    ...adminProtected,

    // Rutas protegidas para Cliente
    ...clientProtected,

    // Ruta por defecto - debe ir AL FINAL
    {
      path: "*",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
  ];
};
