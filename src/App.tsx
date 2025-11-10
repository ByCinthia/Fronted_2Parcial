import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Landing/home";
import Shop from "./pages/Shop/shop";
import Login from "./pages/Login/login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/index";
import CartPage from "./pages/Cart/cart";

/* Módulos del dashboard */
import ProductosAdmin from "./pages/Productos/productos";
import ProductForm from "./pages/Productos/inventario";
import RegistroCliente from "./pages/Clientes/registro";
import ClientList from "./pages/Clientes/ClientList";
import ClientForm from "./pages/Clientes/ClientForm";
import UserList from "./pages/Usuarios/user_list";
import UserForm from "./pages/Usuarios/user_form";
import RolesPage from "./pages/Roles/roles";
import OrderList from "./pages/Pedidos/OrderList";
import OrderForm from "./pages/Pedidos/OrderForm";

/* Estilos globales */
import './Styles/layout_base.css';
import './Styles/modulos.css';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistroCliente />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Panel administrativo */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Productos */}
            <Route path="products" element={<ProductosAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />

            {/* Clientes */}
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/new" element={<ClientForm />} />
            <Route path="clients/:id" element={<ClientForm />} />

            {/* Usuarios */}
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:id" element={<UserForm />} />

            {/* Roles (nueva ruta) */}
            <Route path="roles" element={<RolesPage />} />

            {/* Pedidos */}
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/completed" element={<OrderList />} />
            <Route path="orders/new" element={<OrderForm />} />
            <Route path="orders/:id" element={<OrderForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
