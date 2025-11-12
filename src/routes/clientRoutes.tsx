import type { RouteObject } from "react-router-dom";
import CatalogoPage from "../pages/cliente/catalogo/CatalogoPage";

/**
 * Rutas disponibles para usuarios con rol "Cliente"
 */
export const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <CatalogoPage />,
  },
  {
    path: "/shop",
    element: <CatalogoPage />,
  },
  {
    path: "/catalogo",
    element: <CatalogoPage />,
  },
];
