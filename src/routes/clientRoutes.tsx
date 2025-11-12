import type { RouteObject } from "react-router-dom";
import CatalogoPage from "../pages/cliente/catalogo/CatalogoPage";
import CarritoPage from "../pages/cliente/carrito/CarritoPage";
import VentasPage from "../pages/cliente/ventas/VentasPage";
import PagoExitosoPage from "../pages/cliente/ventas/PagoExitosoPage";

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
  {
    path: "/carrito",
    element: <CarritoPage />,
  },
  {
    path: "/ventas",
    element: <VentasPage />,
  },
  {
    path: "/compras",
    element: <VentasPage />,
  },
  {
    path: "/cuotas",
    element: <VentasPage />,
  },
  {
    path: "/ventas/exito",
    element: <PagoExitosoPage />,
  },
];
