import { BrowserRouter, useRoutes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { getRoutes } from "./routes";
// import DebugInfo from "./components/DebugInfo";

/* Estilos globales */
import "./Styles/layout_base.css";
import "./Styles/modulos.css";

function AppRoutes() {
  const routes = getRoutes();
  return useRoutes(routes);
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
        {/* <DebugInfo /> */}
      </BrowserRouter>
    </CartProvider>
  );
}
