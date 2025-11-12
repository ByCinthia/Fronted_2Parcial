import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Componente que protege rutas verificando:
 * 1. Si el usuario está autenticado
 * 2. Si tiene el rol permitido para acceder
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  // Verificar si está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Obtener el rol del usuario desde localStorage
  const userRole = localStorage.getItem("user_role");

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirigir al login si no tiene el rol adecuado
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
