import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (como Login)
 * Si el usuario ya está autenticado, lo redirige a su ruta correspondiente
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  if (isAuthenticated()) {
    const userRole = localStorage.getItem("user_role");
    const redirectPath = userRole === "Admin" ? "/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
