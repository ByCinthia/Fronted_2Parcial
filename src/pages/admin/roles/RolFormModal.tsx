// ============================================================
// 📝 MODAL DE FORMULARIO DE ROL
// ============================================================
// Modal para crear y editar roles
// Características:
// - Modo crear / modo editar
// - Validación en tiempo real
// - Manejo de errores
// - UI limpia y profesional
// ============================================================

import { useState, useEffect } from "react";
import { MdClose, MdSave, MdSecurity } from "react-icons/md";
import { RolService, RolHelpers } from "../../../services/rol";
import type { Rol } from "../../../services/rol";

/**
 * Props del modal de formulario
 */
interface RolFormModalProps {
  rol?: Rol; // Si se pasa un rol, es modo editar. Si no, es modo crear
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
 * Modal de formulario para crear/editar roles
 */
export default function RolFormModal({
  rol,
  onClose,
  onExito,
}: RolFormModalProps) {
  // ============================================================
  // 🔄 ESTADO
  // ============================================================
  const esEdicion = !!rol;

  const [formData, setFormData] = useState<FormData>({
    nombre: rol?.nombre || "",
    descripcion: rol?.descripcion || "",
  });

  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  // ============================================================
  // 📡 EFECTOS
  // ============================================================

  /**
   * Si cambia el rol (modo editar), actualizar form
   */
  useEffect(() => {
    if (rol) {
      setFormData({
        nombre: rol.nombre || "",
        descripcion: rol.descripcion || "",
      });
    }
  }, [rol]);

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
    const validacion = RolHelpers.validarDatosRol({
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

      if (esEdicion && rol) {
        // EDITAR: usar PATCH para actualización parcial
        console.log("Datos enviados al servidor (PATCH):", data);
        await RolService.actualizarParcial(rol.idRol, data);
        alert("✅ Rol actualizado exitosamente");
      } else {
        // CREAR
        console.log("Datos enviados al servidor (POST):", data);
        await RolService.crear(data);
        alert("✅ Rol creado exitosamente");
      }

      onExito(); // Callback de éxito
      onClose(); // Cerrar modal
    } catch (err) {
      console.error("Error al guardar rol:", err);
      const mensaje =
        err instanceof Error ? err.message : "Error al guardar el rol";
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
      formData.nombre !== (rol?.nombre || "") ||
      formData.descripcion !== (rol?.descripcion || "");

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
            <MdSecurity className="modal-icon" />
            <h2>{esEdicion ? "Editar Rol" : "Crear Nuevo Rol"}</h2>
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
                Nombre del Rol
              </label>
              <input
                type="text"
                id="nombre"
                className="form-input"
                placeholder="Ej: Administrador, Gerente, Cliente"
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
                placeholder="Describe los permisos y responsabilidades de este rol..."
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
              <div className="rol-preview">
                <div
                  className="rol-avatar-preview"
                  style={{
                    backgroundColor: RolHelpers.obtenerColorRol(
                      formData.nombre
                    ),
                  }}
                >
                  {RolHelpers.obtenerIniciales(formData.nombre)}
                </div>
                <div className="rol-preview-info">
                  <p className="preview-nombre">
                    {formData.nombre || "Nombre del Rol"}
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
                : "Crear Rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
