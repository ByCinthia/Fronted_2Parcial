//paaagina de registro de cliente
export default function RegistroCliente() {
  return (
    <div className="page-container">
      <h1>Registro de Cliente</h1>
      <form>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
