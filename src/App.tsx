import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Landing/home";
import Shop from "./pages/Shop/shop";
import Login from "./pages/Login/login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/index";
import './App.css';
import './Styles/layout_base.css'; // <-- ruta corregida (usa la carpeta Styles)

/* nuevas importaciones de productos */
import ProductosAdmin from "./pages/Productos/productos";
import ProductForm from "./pages/Productos/inventario";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Rutas del módulo Productos */}
            <Route path="products" element={<ProductosAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />

            {/* Añade aquí otras rutas hijas: orders, users, clients, etc. */}
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
