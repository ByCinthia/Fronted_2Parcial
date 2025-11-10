import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/modulos.css";

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section className="module-root">
      <header className="module-header">
        <h2>{id ? "Editar cliente" : "Nuevo cliente"}</h2>
      </header>
      
      <form className="module-form" onSubmit={(e) => { e.preventDefault(); navigate(-1); }}>
        <label>
          Nombre
          <input name="nombre" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        
        <div className="form-actions">
          <button className="btn-primary" type="submit">Guardar</button>
          <button className="btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}