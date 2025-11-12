// ============================================
// EJEMPLOS DE USO - Sistema de Rutas por Roles
// ============================================

// ========== 1. ESTRUCTURA DEL BACKEND ESPERADA ==========

/*
Cuando el usuario hace login, el backend debe retornar:

{
  "access": "token_de_acceso_jwt",
  "refresh": "token_de_refresco_jwt",
  "usuario": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "rol": {
      "idRol": 1,
      "nombre": "Admin",  // ← IMPORTANTE: "Admin" o "Cliente"
      "descripcion": "Administrador del sistema"
    }
  }
}

O también puede ser:

{
  "access": "token_de_acceso_jwt",
  "refresh": "token_de_refresco_jwt",
  "usuario": {
    "id": 2,
    "username": "cliente1",
    "email": "cliente@example.com",
    "rol": "Cliente"  // ← También soporta el rol como string directo
  }
}
*/

// ========== 2. COMPONENTES QUE NECESITAN SABER EL ROL ==========

import { useEffect, useState } from "react";

// Ejemplo 1: Mostrar contenido diferente según el rol
export function EjemploContenidoPorRol() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  return (
    <div>
      <h1>Bienvenido</h1>

      {userRole === "Admin" && (
        <div>
          <h2>Panel de Administración</h2>
          <p>Tienes acceso completo al sistema</p>
        </div>
      )}

      {userRole === "Cliente" && (
        <div>
          <h2>Tu Tienda</h2>
          <p>Explora nuestros productos y realiza tus compras</p>
        </div>
      )}
    </div>
  );
}

// Ejemplo 2: Hook personalizado para obtener el rol
export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    setLoading(false);
  }, []);

  return {
    userRole,
    loading,
    isAdmin: userRole === "Admin",
    isClient: userRole === "Cliente",
  };
}

// Uso del hook:
export function ComponenteConHook() {
  const { userRole, isAdmin, isClient, loading } = useUserRole();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <p>Tu rol es: {userRole}</p>
      {isAdmin && <button>Acciones de Admin</button>}
      {isClient && <button>Ir a la tienda</button>}
    </div>
  );
}

// ========== 3. NAVEGACIÓN PROGRAMÁTICA SEGÚN ROL ==========

import { useNavigate } from "react-router-dom";

export function EjemploNavegacion() {
  const navigate = useNavigate();

  const irAMiPanel = () => {
    const userRole = localStorage.getItem("user_role");

    if (userRole === "Admin") {
      navigate("/dashboard");
    } else if (userRole === "Cliente") {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return <button onClick={irAMiPanel}>Ir a mi panel</button>;
}

// ========== 4. SIDEBAR DINÁMICO (YA IMPLEMENTADO) ==========

/*
El Sidebar ya está configurado para mostrar items según el rol:

const navItems: NavItem[] = [
  { 
    to: "/dashboard", 
    label: "Dashboard", 
    icon: "🏠", 
    roles: ["Admin"]  // Solo visible para Admin
  },
  { 
    to: "/shop", 
    label: "Tienda", 
    icon: "🛍️", 
    roles: ["Cliente"]  // Solo visible para Cliente
  },
  { 
    to: "/profile", 
    label: "Mi Perfil", 
    icon: "👤", 
    roles: ["Admin", "Cliente"]  // Visible para ambos
  },
];
*/

// ========== 5. PROTEGER ACCIONES EN COMPONENTES ==========

export function EjemploAccionesProtegidas() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const eliminarProducto = (id: number) => {
    // Verificar rol antes de permitir la acción
    if (userRole !== "Admin") {
      alert("No tienes permisos para eliminar productos");
      return;
    }

    // Realizar la acción
    console.log("Eliminando producto", id);
  };

  return (
    <div>
      <button
        onClick={() => eliminarProducto(1)}
        disabled={userRole !== "Admin"}
      >
        Eliminar Producto
      </button>
    </div>
  );
}

// ========== 6. MANEJO DE SESIÓN ==========

import { signOut, isAuthenticated } from "../services/auth";

export function EjemploManejoDeSesion() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Limpiar todos los datos de sesión
    signOut();

    // Redirigir al login
    navigate("/login");
  };

  const verificarAutenticacion = () => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      console.log("Usuario autenticado");
    }
  };

  return (
    <div>
      <button onClick={verificarAutenticacion}>Verificar Sesión</button>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </div>
  );
}

// ========== 7. AGREGAR NUEVOS ROLES ==========

/*
Para agregar un nuevo rol (por ejemplo, "Vendedor"):

1. Actualizar adminRoutes.tsx o crear vendedorRoutes.tsx:

export const vendedorRoutes: RouteObject[] = [
  {
    path: "/vendedor",
    element: <VendedorLayout />,
    children: [
      { index: true, element: <VendedorHome /> },
      { path: "ventas", element: <VentasPage /> },
      { path: "clientes", element: <ClientesPage /> },
    ],
  },
];

2. Actualizar routes/index.tsx:

import { vendedorRoutes } from "./vendedorRoutes";

export const getRoutes = (): RouteObject[] => {
  return [
    // ... rutas existentes
    ...protectRoutes(vendedorRoutes, ["Vendedor"]),
  ];
};

3. Actualizar Login para redirección:

const redirectPath = 
  userRole === "Admin" ? "/dashboard" :
  userRole === "Vendedor" ? "/vendedor" :
  "/";
*/

// ========== 8. CONTEXTO GLOBAL DE USUARIO (RECOMENDADO) ==========

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  userRole: string | null;
  isAdmin: boolean;
  isClient: boolean;
  isAuthenticated: boolean;
  updateRole: (role: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const updateRole = (role: string) => {
    localStorage.setItem("user_role", role);
    setUserRole(role);
  };

  const logout = () => {
    signOut();
    setUserRole(null);
  };

  const value: UserContextType = {
    userRole,
    isAdmin: userRole === "Admin",
    isClient: userRole === "Cliente",
    isAuthenticated: isAuthenticated(),
    updateRole,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
}

/*
Para usar el contexto:

// En App.tsx:
<UserProvider>
  <CartProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </CartProvider>
</UserProvider>

// En cualquier componente:
const { userRole, isAdmin, logout } = useUser();
*/

// ========== 9. TESTING ==========

/*
Para probar el sistema:

1. Login como Admin:
   - Usuario: admin / admin@example.com
   - Debería redirigir a /dashboard
   - Debería ver todas las opciones del sidebar

2. Login como Cliente:
   - Usuario: cliente / cliente@example.com
   - Debería redirigir a /
   - Solo debería ver opciones de tienda

3. Intentar acceder a /dashboard sin autenticar:
   - Debería redirigir a /login

4. Estando logueado como Cliente, intentar ir a /dashboard:
   - Debería redirigir a /login (sin permisos)

5. Cerrar sesión:
   - Debería limpiar localStorage
   - Debería redirigir a /login
*/

// ========== 10. TROUBLESHOOTING ==========

/*
Problema: El rol no se guarda correctamente
Solución: Verificar que el backend envíe el rol en el formato correcto:
  - usuario.rol.nombre o usuario.rol (como string)

Problema: Usuario Admin redirige a / en lugar de /dashboard
Solución: Verificar que localStorage.getItem("user_role") retorne exactamente "Admin" (con mayúscula)

Problema: El sidebar no muestra opciones
Solución: Verificar que los navItems tengan roles: ["Admin"] o ["Cliente"]

Problema: Rutas protegidas no funcionan
Solución: Verificar que ProtectedRoute esté correctamente implementado en routes/index.tsx

Problema: Usuario puede acceder a rutas sin permisos
Solución: Asegurarse de que TODAS las validaciones también se hagan en el backend
*/

export {};
