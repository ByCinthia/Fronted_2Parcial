import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Landing/home";
import Shop from "./pages/Shop/shop";
import Login from "./pages/Login/login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/index";
import './App.css';
import './styles/layout.css'; // ← importa layout global aquí

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
            {/* Añade rutas hijas: /dashboard/products, /dashboard/orders, /dashboard/users */}
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
