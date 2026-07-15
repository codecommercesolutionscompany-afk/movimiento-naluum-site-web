import { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { EmailContext } from '../../../context/email/email_context_value';
import './support_modal.scss';

const messageTitle = {
  informacionProductos:
    'Para una mejor atención, hemos abierto un canal de contacto donde te proporcionaremos toda la información que necesitas sobre nuestros productos y servicios.',
  soporteTecnico: 'Soporte Técnico',
  consultasGenerales: 'Consultas Generales',
};

// util simple para normalizar strings sin acentos
const normalize = (s = '') =>
  s.normalize?.('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || String(s).toLowerCase();

const SupportModalContent = ({ item }) => {
  const { sendEmail, isEmailConfigured } = useContext(EmailContext);
  const {
    title: itemTitle,
    id: itemId,
    type: itemType,
    itemType: itemKind,
  } = item || {};

  const [contactMethod, setContactMethod] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'Consulta', // se sincroniza más abajo
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubjectLocked, setIsSubjectLocked] = useState(false);

  const WHATSAPP_NUMBER = '5493534240350';

  // ===== Derivar intención/ctx desde item.type / item.itemType =====
  const ctx = useMemo(() => {
    const raw = normalize(`${itemType || ''} ${itemKind || ''}`);
    const isEnroll = raw.includes('inscripcion'); // cubre inscripción/inscripcion por normalize
    const isSupport = raw.includes('soporte');
    const isProduct = raw.includes('product') || raw.includes('producto');
    const isService = raw.includes('service') || raw.includes('servicio');
    const isEvent = raw.includes('event') || raw.includes('evento') || raw.includes('particip');
    const isProject = raw.includes('project') || raw.includes('proyecto');
    const base = isProduct ? 'product' : isService ? 'service' : isEvent ? 'event' : isProject ? 'project' : 'item';
    return { isEnroll, isSupport, isEvent, isProject, base };
  }, [itemKind, itemType]);

  /** Acción según el tipo (para WhatsApp) */
  const action = ctx.isEnroll
    ? 'inscribirme'
    : ctx.isEvent
    ? 'participar en'
    : ctx.isSupport
    ? 'recibir soporte sobre'
    : 'hacer una consulta sobre';

  const WHATSAPP_MESSAGE = `Hola, quiero ${action} ${
    itemTitle ? `"${itemTitle}"` : `este ${ctx.base}`
  }${itemId ? ` (ID ${itemId})` : ''}.`;

  /** 🔹 Pre-cargar asunto/mensaje y sincronizar tipo según intención */
  useEffect(() => {
    if (!item) return;

    const productName = itemTitle || 'Producto o servicio';
    const productId = itemId ? `#${itemId}` : '';

    let subject = '';
    let message = '';
    let lockSubject = false;
    let derivedType = 'Consulta';

    if (ctx.isEnroll) {
      subject = `Inscripción al servicio ${productName} ${productId}`.trim();
      message = `Hola, quiero inscribirme en "${productName}". ¿Podrían indicarme los pasos a seguir, fechas de inicio y requisitos?`;
      lockSubject = true; // usualmente bloqueado
      derivedType = 'Inscripción';
    } else if (ctx.isEvent) {
      subject = `Participación en ${productName} ${productId}`.trim();
      message = `Hola, quiero participar en "${productName}". ¿Podrían brindarme información sobre fechas, ubicación y disponibilidad?`;
      lockSubject = true;
      derivedType = 'Participación';
    } else if (ctx.isSupport) {
      subject = `Soporte para ${productName} ${productId}`.trim();
      message = `Hola, necesito ayuda con "${productName}". Detallo a continuación:`;
      lockSubject = false;
      derivedType = 'Soporte';
    } else {
      subject = `Consulta general sobre ${productName} ${productId}`.trim();
      message = `Hola, quiero hacer una consulta sobre "${productName}". ¿Podrían ayudarme?`;
      lockSubject = false;
      derivedType = 'Consulta';
    }

    setFormData((prev) => ({
      ...prev,
      subject,
      message,
      type: derivedType,
    }));
    setIsSubjectLocked(lockSubject);
  }, [ctx.isEnroll, ctx.isEvent, ctx.isSupport, item, itemId, itemTitle]);

  /** 🔹 Manejo de inputs */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Redirección a WhatsApp (forzar WhatsApp Web) */
  const handleWhatsAppRedirect = () => {
    const cleanPhone = String(WHATSAPP_NUMBER).replace(/\D/g, '');
    const message = encodeURIComponent(WHATSAPP_MESSAGE);
    const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${message}`;
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  };

  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

  /** 🔹 Envío del formulario (NO cierra modal; limpia SOLO nombre y email) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!isValidEmail(formData.email)) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const emailData = {
      nombre_completo: formData.name,
      email: formData.email,
      asunto: formData.subject,
      tipo_consulta: formData.type,
      tipo_class: (formData.type || '').toLowerCase(),
      mensaje: formData.message,
      fecha_hora: new Date().toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      elemento_nombre: itemTitle || 'Sin especificar',
      elemento_id: itemId ?? 'N/A',
      elemento_tipo: itemType || itemKind || 'N/A',
      // Se conservan estas claves porque la plantilla de contacto de EmailJS
      // puede usarlas actualmente, aunque la consulta sea sobre un servicio.
      producto_nombre: itemTitle || 'Sin especificar',
      producto_id: itemId ?? 'N/A',
      producto_tipo: itemType || itemKind || 'N/A',
    };

    try {
      const response = await sendEmail(emailData);

      if (response?.success) {
        setSubmitStatus('success');

        // ✅ solo limpiar nombre y email; mantener subject/message/type y el lock del asunto
        setFormData((prev) => ({
          ...prev,
          name: '',
          email: '',
        }));
        // Mantener isSubjectLocked tal cual está
        // NO cerrar el modal
      } else {
        setSubmitStatus(response?.reason === 'configuration' ? 'configuration' : 'error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageText =
    normalize(itemType).includes('product') || normalize(itemType).includes('service')
      ? messageTitle.informacionProductos
      : messageTitle.soporteTecnico;

  return (
    <div className="support-content">
      <h2 className="support-content__title">¿Cómo prefieres contactarnos?</h2>

      {!contactMethod ? (
        <>
          <p className="support-content__subtitle">{messageText}</p>

          <div className="support-content__options">
            {/* 🔹 WhatsApp */}
            <button
              className="contact-option contact-option--whatsapp"
              onClick={handleWhatsAppRedirect}
              aria-label="Contactar por WhatsApp"
              title="Contactar por WhatsApp"
            >
              <div className="contact-option__icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
              </div>
              <div className="contact-option__content">
                <h3>WhatsApp</h3>
                <p>Se abrirá en WhatsApp Web</p>
              </div>
            </button>

            {/* 🔹 Email */}
            <button
              className="contact-option contact-option--email"
              onClick={() => setContactMethod('email')}
              aria-label="Contactar por correo"
              title="Contactar por correo"
            >
              <div className="contact-option__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="contact-option__content">
                <h3>Correo Electrónico</h3>
                <p>Detalla tu consulta por escrito</p>
              </div>
            </button>
          </div>

          <div className="support-content__info">
            <p>Horario de atención: Lunes a Viernes de 9:00 a 18:00</p>
          </div>
        </>
      ) : (
        <>
          <button
            className="support-content__back"
            onClick={() => setContactMethod(null)}
            aria-label="Volver a opciones de contacto"
            title="Volver"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Volver</span>
          </button>

          <form className="email-form" onSubmit={handleSubmit}>
            {!isEmailConfigured && (
              <div className="email-form__alert email-form__alert--error" role="alert">
                <span>El formulario por correo no está disponible temporalmente. Podés usar WhatsApp.</span>
              </div>
            )}
            <h3 className="email-form__title">Envíanos tu mensaje</h3>

            <div className="email-form__group">
              <label htmlFor="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Juan Pérez"
                autoComplete="name"
              />
            </div>

            <div className="email-form__group">
              <label htmlFor="email">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div className="email-form__group">
              <label htmlFor="subject">Asunto *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={isSubjectLocked}
                style={isSubjectLocked ? { backgroundColor: '#f3f3f3', cursor: 'not-allowed' } : {}}
              />
              {isSubjectLocked && (
                <small style={{ color: '#777', fontSize: '0.85rem' }}>
                  Este asunto se genera automáticamente y no puede modificarse.
                </small>
              )}
            </div>

            <div className="email-form__group">
              <label htmlFor="message">Mensaje *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="email-form__alert email-form__alert--success">
                <span>¡Mensaje enviado con éxito!</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="email-form__alert email-form__alert--error">
                <span>Error al enviar. Intenta nuevamente.</span>
              </div>
            )}

            {submitStatus === 'configuration' && (
              <div className="email-form__alert email-form__alert--error" role="alert">
                <span>El formulario por correo no está disponible temporalmente. Podés usar WhatsApp.</span>
              </div>
            )}

            <button type="submit" className="email-form__submit" disabled={isSubmitting || !isEmailConfigured}>
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

SupportModalContent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    itemType: PropTypes.string,
  }),
};

export default SupportModalContent;
