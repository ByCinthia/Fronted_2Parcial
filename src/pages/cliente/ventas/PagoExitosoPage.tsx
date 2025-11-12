// ============================================================
// ✅ PÁGINA DE PAGO EXITOSO
// ============================================================
// Página mostrada después de completar un pago exitoso en Stripe
// Características:
// - Confirmación visual de pago exitoso
// - Mostrar session_id de Stripe
// - Botones para ver compras o volver al catálogo
// - Animación de éxito
// - Diseño moderno y responsive
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdCheckCircle,
  MdShoppingBag,
  MdStorefront,
  MdReceipt,
  MdCelebration,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import "../../../Styles/pago-exitoso.css";

export default function PagoExitosoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [mostrarAnimacion, setMostrarAnimacion] = useState(true);

  useEffect(() => {
    // Mostrar toast de éxito
    toast.success("¡Pago procesado exitosamente!", {
      duration: 4000,
      position: "top-center",
      icon: "🎉",
    });

    // Ocultar animación después de 3 segundos
    const timer = setTimeout(() => {
      setMostrarAnimacion(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pago-exitoso-page">
      {/* Animación de confeti */}
      {mostrarAnimacion && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "#610c27",
                  "#d4af37",
                  "#8b1538",
                  "#c49d2e",
                  "#4a0a1e",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="pago-exitoso-container">
        {/* Icono de éxito animado */}
        <div className="success-icon-wrapper">
          <div className="success-circle">
            <MdCheckCircle className="success-icon" />
          </div>
          <div className="celebration-icon">
            <MdCelebration size={40} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="pago-exitoso-content">
          <h1 className="pago-exitoso-title">¡Pago Exitoso!</h1>
          <p className="pago-exitoso-mensaje">
            Tu pago ha sido procesado correctamente. Gracias por tu compra.
          </p>

          {/* Información de la transacción */}
          {sessionId && (
            <div className="transaction-info">
              <div className="transaction-label">
                <MdReceipt size={20} />
                ID de Transacción
              </div>
              <div className="transaction-id">{sessionId}</div>
            </div>
          )}

          {/* Pasos siguientes */}
          <div className="next-steps">
            <h3 className="next-steps-title">¿Qué sigue?</h3>
            <ul className="next-steps-list">
              <li>
                <MdCheckCircle size={20} className="step-icon" />
                <span>
                  Recibirás un correo de confirmación con los detalles de tu
                  compra
                </span>
              </li>
              <li>
                <MdCheckCircle size={20} className="step-icon" />
                <span>
                  Puedes ver el historial de tus compras en "Mis Compras"
                </span>
              </li>
              <li>
                <MdCheckCircle size={20} className="step-icon" />
                <span>
                  Si elegiste pago en cuotas, podrás gestionar tus pagos desde
                  tu perfil
                </span>
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="pago-exitoso-actions">
            <button className="btn-primary" onClick={() => navigate("/ventas")}>
              <MdShoppingBag size={24} />
              Ver Mis Compras
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/catalogo")}
            >
              <MdStorefront size={24} />
              Seguir Comprando
            </button>
          </div>

          {/* Mensaje adicional */}
          <div className="pago-exitoso-footer">
            <p>
              Si tienes alguna pregunta sobre tu compra, no dudes en contactar a
              nuestro equipo de soporte.
            </p>
          </div>
        </div>
      </div>

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  );
}
