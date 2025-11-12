import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRoleName } from "../services/auth";

/**
 * Componente de depuración para verificar el estado de autenticación
 * y las rutas
 */
export default function DebugInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getUserRoleName();

  useEffect(() => {
    console.log("=== DEBUG INFO ===");
    console.log("Authenticated:", authenticated);
    console.log("Role:", role);
    console.log("Current Path:", location.pathname);
    console.log("Auth Token:", localStorage.getItem("auth_token"));
    console.log("User Role:", localStorage.getItem("user_role"));
    console.log("Current User:", localStorage.getItem("current_user"));
    console.log("==================");
  }, [authenticated, role, location.pathname]);

  if (!authenticated) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#ff6b6b",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          zIndex: 9999,
          maxWidth: "300px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>⚠️ No Autenticado</h4>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          Ruta actual: <strong>{location.pathname}</strong>
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "white",
            color: "#ff6b6b",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#51cf66",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
        maxWidth: "300px",
        fontSize: "14px",
      }}
    >
      <h4 style={{ margin: "0 0 10px 0" }}>✅ Sesión Activa</h4>
      <p style={{ margin: "5px 0" }}>
        <strong>Rol:</strong> {role}
      </p>
      <p style={{ margin: "5px 0" }}>
        <strong>Ruta:</strong> {location.pathname}
      </p>
      <div
        style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <button
          onClick={() => {
            if (role === "Admin") {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          }}
          style={{
            padding: "6px 12px",
            background: "white",
            color: "#51cf66",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          Ir a Inicio
        </button>
      </div>
    </div>
  );
}
