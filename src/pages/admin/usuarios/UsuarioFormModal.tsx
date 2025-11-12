import React, { useState } from "react";
import {
  MdClose,
  MdSave,
  MdPerson,
  MdEmail,
  MdBadge,
  MdLock,
  MdAdd,
  MdEdit,
  MdWarning,
} from "react-icons/md";
import {
  UsuarioService,
  UsuarioHelpers,
  manejarErrorUsuario,
} from "../../../services/usuarios";
import type {
  Usuario,
  CrearUsuarioDTO,
  ActualizarUsuarioParcialDTO,
} from "../../../services/usuarios";
import "../../../Styles/usuarios.css";

interface UsuarioFormModalProps {
  usuario?: Usuario;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  ci: string;
  rol: number;
}

const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({
  usuario,
  onClose,
  onSuccess,
}) => {
  const isEdit = !!usuario;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: usuario ? UsuarioHelpers.obtenerNombre(usuario) : "",
    email: usuario?.email || "",
    password: "",
    telefono: usuario?.telefono || "",
    direccion: usuario?.direccion || "",
    ci: usuario?.ci || "",
    rol: usuario?.rol || 2,
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!UsuarioHelpers.validarEmail(formData.email)) {
      errors.email = "El formato del email no es válido";
    }

    // Validar password solo en creación
    if (!isEdit) {
      if (!formData.password) {
        errors.password = "La contraseña es requerida";
      } else {
        const passwordValidation = UsuarioHelpers.validarPassword(
          formData.password
        );
        if (!passwordValidation.valido) {
          errors.password = passwordValidation.errores[0];
        }
      }
    }

    // Validar rol
    if (!formData.rol) {
      errors.rol = "Debe seleccionar un rol";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Actualización parcial
        const updateData: ActualizarUsuarioParcialDTO = {
          username: formData.nombre, // Mapear nombre a username
          email: formData.email,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          ci: formData.ci || undefined,
          idRol: formData.rol, // Mapear rol a idRol
        };
        await UsuarioService.actualizarParcial(usuario.idUsuario, updateData);
      } else {
        // Creación
        const createData: CrearUsuarioDTO = {
          username: formData.nombre, // Mapear nombre a username
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          ci: formData.ci || undefined,
          idRol: formData.rol, // Mapear rol a idRol
        };
        console.log("Datos enviados al servidor:", createData);
        await UsuarioService.crear(createData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(manejarErrorUsuario(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? (
              <>
                <MdEdit size={28} />
                Editar Usuario
              </>
            ) : (
              <>
                <MdAdd size={28} />
                Crear Nuevo Usuario
              </>
            )}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#fee",
                  color: "#c00",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MdWarning size={20} />
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label required">
                <MdPerson size={18} style={{ verticalAlign: "middle" }} />{" "}
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ingresa el nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.nombre && (
                <div className="form-error">
                  <MdWarning size={16} />
                  {validationErrors.nombre}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label required">
                <MdEmail size={18} style={{ verticalAlign: "middle" }} /> Email
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.email && (
                <div className="form-error">
                  <MdWarning size={16} />
                  {validationErrors.email}
                </div>
              )}
            </div>

            {/* Password - solo en creación */}
            {!isEdit && (
              <div className="form-group">
                <label className="form-label required">
                  <MdLock size={18} style={{ verticalAlign: "middle" }} />{" "}
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {validationErrors.password && (
                  <div className="form-error">
                    <MdWarning size={16} />
                    {validationErrors.password}
                  </div>
                )}
                <div className="form-help">
                  La contraseña debe tener al menos 6 caracteres
                </div>
              </div>
            )}

            {/* Rol */}
            <div className="form-group">
              <label className="form-label required">
                <MdBadge size={18} style={{ verticalAlign: "middle" }} /> Rol
              </label>
              <select
                name="rol"
                className="form-select"
                value={formData.rol}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Seleccionar rol...</option>
                <option value={1}>Administrador</option>
                <option value={2}>Cliente</option>
              </select>
              {validationErrors.rol && (
                <div className="form-error">
                  <MdWarning size={16} />
                  {validationErrors.rol}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <MdClose size={20} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <MdSave size={20} />
              {loading
                ? "Guardando..."
                : isEdit
                ? "Guardar Cambios"
                : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioFormModal;
