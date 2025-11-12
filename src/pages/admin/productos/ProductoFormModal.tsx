// ============================================================
// 📝 MODAL DE FORMULARIO DE PRODUCTO
// ============================================================
// Modal para crear y editar productos
// Características:
// - Modo crear / modo editar
// - Soporte de imágenes con preview
// - Validación en tiempo real
// - Selector de categorías
// - Manejo de errores
// - UI limpia y profesional
// ============================================================

import { useState, useEffect } from "react";
import { MdClose, MdSave, MdShoppingCart, MdImage } from "react-icons/md";
import { ProductoService, ProductoHelpers } from "../../../services/producto";
import type { Producto } from "../../../services/producto";
import type { Categoria } from "../../../services/categoria";

/**
 * Props del modal de formulario
 */
interface ProductoFormModalProps {
  producto?: Producto; // Si se pasa un producto, es modo editar. Si no, es modo crear
  categorias: Categoria[]; // Lista de categorías para el selector
  onClose: () => void;
  onExito: () => void;
}

/**
 * Estructura de datos del formulario
 */
interface FormData {
  nombre: string;
  precio: string;
  stock: string;
  idCategoria: string;
  imagen: File | null;
}

/**
 * Modal de formulario para crear/editar productos
 */
export default function ProductoFormModal({
  producto,
  categorias,
  onClose,
  onExito,
}: ProductoFormModalProps) {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const esEdicion = !!producto;

  const [formData, setFormData] = useState<FormData>({
    nombre: producto?.nombre || "",
    precio: producto?.precio.toString() || "",
    stock: producto?.stock.toString() || "",
    idCategoria: producto?.categoria.idCategoria.toString() || "",
    imagen: null,
  });

  const [imagenPreview, setImagenPreview] = useState<string | null>(
    producto ? ProductoHelpers.obtenerImagenUrl(producto) : null
  );

  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Si cambia el producto (modo editar), actualizar form
   */
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        precio: producto.precio.toString() || "",
        stock: producto.stock.toString() || "",
        idCategoria: producto.categoria.idCategoria.toString() || "",
        imagen: null,
      });
      setImagenPreview(ProductoHelpers.obtenerImagenUrl(producto));
    }
  }, [producto]);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Actualiza un campo del formulario
   */
  const handleChange = (field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorServidor(null); // Limpiar error del servidor al escribir
  };

  /**
   * Maneja la selección de imagen
   */
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, imagen: null }));
      setImagenPreview(
        producto ? ProductoHelpers.obtenerImagenUrl(producto) : null
      );
      return;
    }

    // Validar imagen
    if (!ProductoHelpers.validarImagen(file)) {
      alert(
        "❌ Imagen no válida. Debe ser JPG, PNG o WEBP y pesar menos de 5MB"
      );
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, imagen: file }));

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Valida el formulario antes de enviar
   */
  const validarFormulario = (): boolean => {
    const erroresTemp: string[] = [];

    // Validar nombre
    if (!ProductoHelpers.validarNombre(formData.nombre)) {
      erroresTemp.push("El nombre es requerido (máximo 200 caracteres)");
    }

    // Validar precio
    const precioNum = parseFloat(formData.precio);
    if (!ProductoHelpers.validarPrecio(precioNum)) {
      erroresTemp.push("El precio debe ser mayor a 0");
    }

    // Validar stock
    const stockNum = parseInt(formData.stock);
    if (!ProductoHelpers.validarStock(stockNum)) {
      erroresTemp.push("El stock debe ser un número entero mayor o igual a 0");
    }

    // Validar categoría
    if (!formData.idCategoria) {
      erroresTemp.push("Debe seleccionar una categoría");
    }

    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    setErrorServidor(null);

    try {
      if (esEdicion && producto) {
        // EDITAR: usar PATCH para actualización parcial
        const data = {
          nombre: formData.nombre.trim(),
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          idCategoria: parseInt(formData.idCategoria),
          imagen: formData.imagen, // Puede ser null si no se cambió
        };

        console.log("Datos enviados al servidor (PATCH):", data);
        await ProductoService.actualizarParcial(producto.idProducto, data);
        alert("✅ Producto actualizado exitosamente");
      } else {
        // CREAR
        const data = {
          nombre: formData.nombre.trim(),
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          idCategoria: parseInt(formData.idCategoria),
          imagen: formData.imagen, // Puede ser null
        };

        console.log("Datos enviados al servidor (POST):", data);
        await ProductoService.crear(data);
        alert("✅ Producto creado exitosamente");
      }

      onExito(); // Callback de éxito
      onClose(); // Cerrar modal
    } catch (err) {
      console.error("Error al guardar producto:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al guardar el producto";
      setErrorServidor(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  /**
   * Cierra el modal con confirmación si hay cambios
   */
  const handleCerrar = () => {
    const hayCambios =
      formData.nombre !== (producto?.nombre || "") ||
      formData.precio !== (producto?.precio.toString() || "") ||
      formData.stock !== (producto?.stock.toString() || "") ||
      formData.idCategoria !==
        (producto?.categoria.idCategoria.toString() || "") ||
      formData.imagen !== null;

    if (hayCambios && !guardando) {
      const confirmar = window.confirm(
        "¿Estás seguro de cerrar? Se perderán los cambios no guardados."
      );
      if (!confirmar) return;
    }

    onClose();
  };

  /**
   * Obtiene el nombre de la categoría seleccionada
   */
  const obtenerNombreCategoria = (): string => {
    const cat = categorias.find(
      (c) => c.idCategoria.toString() === formData.idCategoria
    );
    return cat?.nombre || "Sin categoría";
  };

  /**
   * Obtiene el estado del stock actual
   */
  const obtenerEstadoStockPreview = () => {
    const stockNum = parseInt(formData.stock) || 0;
    return ProductoHelpers.obtenerEstadoStock(stockNum);
  };

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="modal-overlay" onClick={handleCerrar}>
      <div
        className="modal-content modal-producto-form"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <MdShoppingCart className="modal-icon" />
            <h2>{esEdicion ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleCerrar}
            disabled={guardando}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Errores de validación */}
            {errores.length > 0 && (
              <div className="form-errores">
                {errores.map((error, index) => (
                  <p key={index}>⚠️ {error}</p>
                ))}
              </div>
            )}

            {/* Error del servidor */}
            {errorServidor && (
              <div className="form-error-servidor">
                <p>❌ {errorServidor}</p>
              </div>
            )}

            {/* Grid de dos columnas */}
            <div className="form-grid">
              {/* Columna izquierda: Imagen */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="imagen" className="form-label">
                    Imagen del Producto
                  </label>

                  {/* Preview de la imagen */}
                  <div className="imagen-preview-container">
                    {imagenPreview ? (
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="imagen-preview"
                      />
                    ) : (
                      <div className="imagen-placeholder">
                        <MdImage size={64} />
                        <p>Sin imagen</p>
                      </div>
                    )}
                  </div>

                  {/* Input de archivo */}
                  <input
                    type="file"
                    id="imagen"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImagenChange}
                    disabled={guardando}
                    className="form-input-file"
                  />

                  <span className="form-hint">
                    Opcional. Formatos: JPG, PNG, WEBP. Máximo 5MB.
                  </span>
                </div>
              </div>

              {/* Columna derecha: Datos del producto */}
              <div className="form-column">
                {/* Campo: Nombre */}
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label required">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-input"
                    placeholder="Ej: Laptop HP Pavilion"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    maxLength={200}
                    required
                    disabled={guardando}
                  />
                  <span className="form-hint">Máximo 200 caracteres.</span>
                </div>

                {/* Campo: Categoría */}
                <div className="form-group">
                  <label htmlFor="categoria" className="form-label required">
                    Categoría
                  </label>
                  <select
                    id="categoria"
                    className="form-select"
                    value={formData.idCategoria}
                    onChange={(e) =>
                      handleChange("idCategoria", e.target.value)
                    }
                    required
                    disabled={guardando}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fila: Precio y Stock */}
                <div className="form-row">
                  {/* Campo: Precio */}
                  <div className="form-group">
                    <label htmlFor="precio" className="form-label required">
                      Precio (USD)
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">$</span>
                      <input
                        type="number"
                        id="precio"
                        className="form-input with-icon"
                        placeholder="0.00"
                        value={formData.precio}
                        onChange={(e) => handleChange("precio", e.target.value)}
                        step="0.01"
                        min="0.01"
                        required
                        disabled={guardando}
                      />
                    </div>
                    <span className="form-hint">Debe ser mayor a 0</span>
                  </div>

                  {/* Campo: Stock */}
                  <div className="form-group">
                    <label htmlFor="stock" className="form-label required">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      className="form-input"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => handleChange("stock", e.target.value)}
                      min="0"
                      step="1"
                      required
                      disabled={guardando}
                    />
                    <span className="form-hint">Unidades disponibles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview del producto */}
            {formData.nombre && formData.precio && formData.idCategoria && (
              <div className="form-group">
                <label className="form-label">Vista Previa</label>
                <div className="producto-preview">
                  <div className="preview-imagen">
                    {imagenPreview ? (
                      <img src={imagenPreview} alt="Preview" />
                    ) : (
                      <div className="preview-placeholder">
                        <MdImage size={32} />
                      </div>
                    )}
                  </div>
                  <div className="preview-info">
                    <h3 className="preview-nombre">
                      {formData.nombre || "Nombre del producto"}
                    </h3>
                    <p className="preview-categoria">
                      {obtenerNombreCategoria()}
                    </p>
                    <div className="preview-detalles">
                      <div className="preview-precio">
                        {ProductoHelpers.formatearPrecio(
                          parseFloat(formData.precio) || 0
                        )}
                      </div>
                      <div
                        className="preview-stock-badge"
                        style={{
                          backgroundColor: obtenerEstadoStockPreview().color,
                        }}
                      >
                        Stock: {formData.stock || 0} -{" "}
                        {obtenerEstadoStockPreview().texto}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-guardar" disabled={guardando}>
              <MdSave size={20} />
              {guardando
                ? "Guardando..."
                : esEdicion
                ? "Guardar Cambios"
                : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
