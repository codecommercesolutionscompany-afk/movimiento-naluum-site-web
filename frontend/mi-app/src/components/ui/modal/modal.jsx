import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import './Modal.scss';

const Modal = ({ isOpenModal, onClose, children, triggerElement }) => {
  const isOpen = isOpenModal;
  const closeButtonRef = useRef(null);

  // Si no está abierto, no renderiza nada
  useEffect(() => {
    // Permite cerrar el modal con la tecla Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      const previousActiveElement = document.activeElement;
      const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
      // Agrega clase CSS al body para bloquear el scroll
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleEscape);

      return () => {
        window.cancelAnimationFrame(focusFrame);
        document.removeEventListener('keydown', handleEscape);
        // Elimina la clase del body al cerrar
        document.body.classList.remove('modal-open');
        const focusTarget = triggerElement?.isConnected ? triggerElement : previousActiveElement;
        focusTarget?.focus?.();
      };
    }
  }, [isOpen, onClose, triggerElement]);

  if (!isOpen) return null;

  // Cerrar el modal con el botón "×"
  const handleCloseClick = () => {
    onClose();
    document.body.classList.remove('modal-open');
  };

  // 🟡 Esta función cerraba el modal al hacer clic fuera del contenido.
  // La dejamos comentada para que NO se cierre al hacer clic fuera.
  /*
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  */

  const modalContent = (
    // 🔸 Quitamos el onClick del backdrop para evitar cierre por clic fuera
    <div className="modal__backdrop" role="dialog" aria-modal="true" aria-label="Información">
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>

      {/* Botón "×" para cerrar el modal */}
      <button
        className="modal__close"
        onClick={handleCloseClick}
        aria-label="Cerrar modal"
        type="button"
        ref={closeButtonRef}
      >
        ×
      </button>
    </div>
  );

  // Renderiza el modal en el body (fuera del flujo normal de la app)
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpenModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  triggerElement: PropTypes.shape({
    focus: PropTypes.func,
    isConnected: PropTypes.bool,
  }),
};

export default Modal;
