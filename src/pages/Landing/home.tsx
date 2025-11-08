import { useNavigate } from "react-router-dom";
import "./landing.css";

// importa las imágenes para que el bundler las procese
import blusasCuadrado from "../../assets/blusas_cuadrado.jpg";
import blusasOnly from "../../assets/blusas_only.jpg";
import vestidoNegro from "../../assets/vestido_negro.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="landing-full">
      <div className="landing-container">
        <header className="landing-top">
          <div className="landing-top-inner">
            <div className="brand-wrap">
              <h1 className="brand">Éclat Studio</h1>
              <p className="subtitle">Ropa con alma · Estilo que resalta</p>
            </div>
            <nav className="login-nav">
              <button className="login-btn" onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
            </nav>
          </div>
        </header>

        <section className="center-hero">
          <h2 className="iconic-phrase">Vístete de momentos, crea recuerdos.</h2>

          <div className="gallery" id="productos">
            <figure className="frame">
              <img src={blusasCuadrado} alt="Blusas Coloridas" />
            </figure>
            <figure className="frame">
              <img src={blusasOnly} alt="Blusas Only" />
            </figure>
            <figure className="frame">
              <img src={vestidoNegro} alt="Vestido Negro Sofisticado" />
            </figure>
          </div>

          <div className="actions">
            <button className="primary" onClick={() => navigate("/shop")}>
              Entrar a la tienda
            </button>
            <button className="login-btn" onClick={() => navigate("/cart")} style={{ marginLeft: 8 }}>
              Ver carrito
            </button>
          </div>

          <small className="note">
            Explora los productos y añade al carrito. El inicio de sesión es solo para el personal.
          </small>
        </section>
      </div>
    </main>
  );
}