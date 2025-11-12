// ============================================================
// 📝 MODAL DE FORMULARIO DE CATEGORÍA
// ============================================================
// Modal para crear y editar categorías
// Características:
// - Modo crear / modo editar
// - Validación en tiempo real
// - Manejo de errores
// - UI limpia y profesional
// ============================================================

import { useState, useEffect } from "react";
import { MdClose, MdSave, MdCategory } from "react-icons/md";
import {
  CategoriaService,
  CategoriaHelpers,
} from "../../../services/categoria";
import type { Categoria } from "../../../services/categoria";

/**
 * Props del modal de formulario
 */
interface CategoriaFormModalProps {
  categoria?: Categoria; // Si se pasa una categoría, es modo editar. Si no, es modo crear
  onClose: () => void;
  onExito: () => void;
}

/**
 * Estructura de datos del formulario
 */
interface FormData {
  nombre: string;
  descripcion: string;
}

/**
 * Modal de formulario para crear/editar categorías
 */
export default function CategoriaFormModal({
  categoria,
  onClose,
  onExito,
}: CategoriaFormModalProps) {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const esEdicion = !!categoria;

  const [formData, setFormData] = useState<FormData>({
    nombre: categoria?.nombre || "",
    descripcion: categoria?.descripcion || "",
  });

  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Si cambia la categoría (modo editar), actualizar form
   */
  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
      });
    }
  }, [categoria]);

  // ============================================================
  // 🔧 FUNCIONES
  // ============================================================

  /**
   * Actualiza un campo del formulario
   */
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorServidor(null); // Limpiar error del servidor al escribir
  };

  /**
   * Valida el formulario antes de enviar
   */
  const validarFormulario = (): boolean => {
    const validacion = CategoriaHelpers.validarDatosCategoria({
      nombre: formData.nombre,
      descripcion: formData.descripcion || undefined,
    });

    setErrores(validacion.errores);
    return validacion.valido;
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
      // Preparar datos (descripción vacía se envía como undefined)
      const data = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      };

      if (esEdicion && categoria) {
        // EDITAR: usar PATCH para actualización parcial
        console.log("Datos enviados al servidor (PATCH):", data);
        await CategoriaService.actualizarParcial(categoria.idCategoria, data);
        alert("✅ Categoría actualizada exitosamente");
      } else {
        // CREAR
        console.log("Datos enviados al servidor (POST):", data);
        await CategoriaService.crear(data);
        alert("✅ Categoría creada exitosamente");
      }

      onExito(); // Callback de éxito
      onClose(); // Cerrar modal
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al guardar la categoría";
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
      formData.nombre !== (categoria?.nombre || "") ||
      formData.descripcion !== (categoria?.descripcion || "");

    if (hayCambios && !guardando) {
      const confirmar = window.confirm(
        "¿Estás seguro de cerrar? Se perderán los cambios no guardados."
      );
      if (!confirmar) return;
    }

    onClose();
  };

  // ============================================================
  // 🎨 RENDERIZADO
  // ============================================================

  return (
    <div className="modal-overlay" onClick={handleCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <MdCategory className="modal-icon" />
            <h2>{esEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}</h2>
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

            {/* Campo: Nombre */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label required">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                id="nombre"
                className="form-input"
                placeholder="Ej: Electrónica, Ropa, Alimentos"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                maxLength={100}
                required
                disabled={guardando}
              />
              <span className="form-hint">
                Máximo 100 caracteres. Debe ser único en el sistema.
              </span>
            </div>

            {/* Campo: Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                id="descripcion"
                className="form-textarea"
                placeholder="Describe el tipo de productos que pertenecen a esta categoría..."
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                maxLength={255}
                rows={4}
                disabled={guardando}
              />
              <span className="form-hint">
                Opcional. Máximo 255 caracteres.
              </span>
            </div>

            {/* Preview del avatar */}
            <div className="form-group">
              <label className="form-label">Vista Previa</label>
              <div className="categoria-preview">
                <div
                  className="categoria-avatar-preview"
                  style={{
                    backgroundColor: CategoriaHelpers.obtenerColorCategoria(
                      formData.nombre
                    ),
                  }}
                >
                  {CategoriaHelpers.obtenerIniciales(formData.nombre)}
                </div>
                <div className="categoria-preview-info">
                  <p className="preview-nombre">
                    {formData.nombre || "Nombre de la Categoría"}
                  </p>
                  <p className="preview-descripcion">
                    {formData.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>
            </div>
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
                : "Crear Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
