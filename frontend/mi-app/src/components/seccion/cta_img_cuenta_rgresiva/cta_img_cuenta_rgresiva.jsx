import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load.jsx';
import Modal from '../../ui/modal/modal';
import SupportModalContent from '../support_modal/support_modal';
import './cta_img_cuenta_rgresiva.scss';

const CtaImgCuentaRgresiva = ({
  img,
  titles = { main: '', subtitle: 'Conocé la propuesta' },
  text = 'Contactanos para recibir más información.',
  buttonText = 'Quiero participar',
  timer = { targetDate: null },
  id = "curso-certificado-diseno-permacultura"
}) => {
  const { eventos } = useContext(ContextJsonLoadContext);
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // --- ⏳ Calcular tiempo restante del contador
  useEffect(() => {
    if (!timer?.targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(timer.targetDate) - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [timer?.targetDate]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  // --- 🔹 Memorizar el evento filtrado
  const filterItem = useMemo(() => {
    if (!Array.isArray(eventos) || !id) return null;
    return eventos.find((evento) => evento.id === id) || null;
  }, [eventos, id]);

  const contactItem = useMemo(() => {
    return {
      ...(filterItem || {}),
      id: filterItem?.id || id,
      title: filterItem?.title || titles.main || 'esta propuesta',
      type: 'event participation',
      itemType: 'event participation',
    };
  }, [filterItem, id, titles.main]);

  const configuredUrl = timer?.link || filterItem?.externalUrl || filterItem?.url || filterItem?.link || filterItem?.router;
  const isExternalUrl = /^https?:\/\//i.test(configuredUrl || '');
  const isValidInternalUrl = /^\/(productos|servicios|proyectos|contacto|calendario|blog|sobre-nosotros)(\/|$)/.test(configuredUrl || '');

  // --- Acción informativa o de contacto
  const handlePrimaryAction = useCallback(
    (e) => {
      e.stopPropagation();

      if (isExternalUrl) {
        window.open(configuredUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      if (isValidInternalUrl) {
        navigate(configuredUrl);
        return;
      }

      setIsContactOpen(true);
    },
    [configuredUrl, isExternalUrl, isValidInternalUrl, navigate]
  );

  // --- Determinar la URL final de la imagen
  const finalImageUrl = useMemo(() => {
    if (!img) return null;
    return img;
  }, [img]);

  return (
    <div className="cta-cuenta-regresiva__container">
      <div className="cta-cuenta-regresiva__content">
        {titles.main && (
          <div className="cta-cuenta-regresiva__titles">
            <h2>{titles.main}</h2>
          </div>
        )}

        <div className="cta-cuenta-regresiva__image">
          {finalImageUrl && (
            <img
              src={finalImageUrl}
              alt="Cuenta Regresiva"
              className="cta-cuenta-regresiva__img"
            />
          )}

          <div className="cta-cuenta-regresiva__content-text">
            {/* --- ⏳ Contador */}
            <div className="cta-cuenta-regresiva__timer">
              <div className="timer-content">
                <div className="timer-unit">
                  <span className="timer-number">{formatTime(timeLeft.days)}</span>
                  <span className="timer-label">Días</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="timer-unit">
                  <span className="timer-number">{formatTime(timeLeft.hours)}</span>
                  <span className="timer-label">Horas</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="timer-unit">
                  <span className="timer-number">{formatTime(timeLeft.minutes)}</span>
                  <span className="timer-label">Min</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="timer-unit">
                  <span className="timer-number">{formatTime(timeLeft.seconds)}</span>
                  <span className="timer-label">Seg</span>
                </div>
              </div>
            </div>

            {/* --- 📄 Texto + Botón */}
            <div className="cta-cuenta-regresiva__text-section">
              <h2>{titles.subtitle}</h2>
              <p>{text}</p>
              <button
                onClick={handlePrimaryAction}
                className="cta-cuenta-regresiva__link"
              >
                <span>{buttonText}</span>
              </button>
            </div> 
          </div>
        </div>
      </div>
      <Modal isOpenModal={isContactOpen} onClose={() => setIsContactOpen(false)}>
        {contactItem && <SupportModalContent item={contactItem} />}
      </Modal>
    </div>
  );
};
 
export default CtaImgCuentaRgresiva;
