import { useState, useCallback, useContext } from 'react';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load_context';
import { EmailContext } from '../../../context/email/email_context_value';
import { Mail, MessageCircle, Instagram, Leaf, Send, User, AtSign, AlertCircle, CheckCircle } from 'lucide-react';
import './cta_hablemos.scss';

const CtaHablemos = ({
    proyecto = "Na Lu'um",
    showSocialMedia = true, // prop para mostrar/ocultar redes sociales
}) => {
    const { sendEmail } = useContext(EmailContext);
    const { info_contacto } = useContext(ContextJsonLoadContext);

    const contacto = info_contacto?.find(item => item.proyecto === proyecto)?.contacto;

    const [formState, setFormState] = useState({
        nombre: '',
        correo: '',
        mensaje: ''
    });
     
    const [errors, setErrors] = useState({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

    const [additionalData, setAdditionalData] = useState({
        asunto: {
            location: window.location.pathname,
            tipo: "Consulta",
            fecha: new Date().toISOString(),
            proyectoSeleccionado: proyecto
        },
        infoExtra: {
            prioridad: "alta",
            canal: "email"
        },
    });

    const { nombre, correo, mensaje } = formState;

    const validateField = useCallback((field, value) => {
        const fieldErrors = {};
        switch (field) {
            case 'nombre':
                if (!value.trim()) fieldErrors.nombre = 'El nombre es obligatorio';
                else if (value.trim().length < 2) fieldErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
                else if (value.trim().length > 50) fieldErrors.nombre = 'El nombre no puede exceder 50 caracteres';
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) fieldErrors.nombre = 'El nombre solo puede contener letras y espacios';
                break;
            case 'correo':
                if (!value.trim()) fieldErrors.correo = 'El email es obligatorio';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) fieldErrors.correo = 'Ingresa un email válido';
                else if (value.length > 100) fieldErrors.correo = 'El email es demasiado largo';
                break;
            case 'mensaje':
                if (!value.trim()) fieldErrors.mensaje = 'El mensaje es obligatorio';
                else if (value.trim().length < 10) fieldErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
                else if (value.trim().length > 500) fieldErrors.mensaje = 'El mensaje no puede exceder 500 caracteres';
                break;
            default:
                break;
        }
        return fieldErrors;
    }, []);

    const validateForm = useCallback(() => {
        let formErrors = {};
        Object.keys(formState).forEach(field => {
            const fieldErrors = validateField(field, formState[field]);
            formErrors = { ...formErrors, ...fieldErrors };
        });
        return formErrors;
    }, [formState, validateField]);

    const handleInputChange = useCallback((field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));

        setAdditionalData(prev => ({
            ...prev,
            asunto: {
                ...prev.asunto,
                location: window.location.pathname,
                tipo: "Consulta",
                fecha: new Date().toISOString(),
                proyectoSeleccionado: proyecto
            }
        }));

        if (errors[field] || isFormSubmitted) {
            const fieldErrors = validateField(field, value);
            setErrors(prev => {
                const newErrors = { ...prev };
                if (Object.keys(fieldErrors).length === 0) delete newErrors[field];
                else Object.assign(newErrors, fieldErrors);
                return newErrors;
            });
        }

        if (submitStatus) setSubmitStatus(null);
    }, [errors, isFormSubmitted, submitStatus, proyecto, validateField]);

    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;

        setIsFormSubmitted(true);
        setSubmitStatus(null);

        try {
            const finalData = {
                ...formState,
                ...additionalData
            };

            const response = await sendEmail(finalData);
            if (response && response.success) {
                setSubmitStatus('success');
                setFormState({ nombre: '', correo: '', mensaje: '' });
                setErrors({});
                setFocusedField('');
                setAdditionalData(prev => ({ ...prev, userInputs: {} }));
            } else {
                setSubmitStatus(response?.reason === 'configuration' ? 'configuration' : 'error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsFormSubmitted(false);
        }
    }, [additionalData, sendEmail, formState, validateForm]);

    const handleFocus = (field) => {
        setFocusedField(field);
        if (submitStatus) setSubmitStatus(null);
    };

    const handleBlur = () => setFocusedField('');

    const isFormValid = () => Object.keys(validateForm()).length === 0 && nombre && correo && mensaje;

    return (
        <div className="modern-contact modern-contact--compact">
            <div className="modern-contact__bg-decoration modern-contact__bg-decoration--1"></div>
            <div className="modern-contact__bg-decoration modern-contact__bg-decoration--2"></div>
            <div className="modern-contact__bg-decoration modern-contact__bg-decoration--3"></div>

            <div className="modern-contact__floating-icon modern-contact__floating-icon--1">
                <Leaf size={32} />
            </div>
            <div className="modern-contact__floating-icon modern-contact__floating-icon--2">
                <Leaf size={26} />
            </div>
            <div className="modern-contact__floating-icon modern-contact__floating-icon--3">
                <Leaf size={20} />
            </div>

            <div className="modern-contact__container">
                {/* Header */}
                <div className="modern-contact__header">
                    <div className="modern-contact__header-icon"><Leaf size={24} /></div>
                    <h1 className="modern-contact__title">Hablemos</h1>
                    <p className="modern-contact__subtitle">
                        Conectemos ideas, creemos soluciones sostenibles y construyamos juntos un futuro más verde
                    </p>
                </div>

                {/* Formulario */}
                <div className="modern-contact__form-section">
                    <div className="modern-contact__form-card">
                        <div className="modern-contact__form-grid">
                            <div className="modern-contact__image-section">
                                <div className="modern-contact__image-bg"></div>
                                <div className="modern-contact__image-decoration modern-contact__image-decoration--top">
                                    <Leaf size={80} />
                                </div>
                                <div className="modern-contact__image-decoration modern-contact__image-decoration--bottom">
                                    <Leaf size={56} />
                                </div>
                                <div className="modern-contact__image-content">
                                    <div className="modern-contact__profile-image">
                                        <img src="/img/shared/comunidad-circulo.webp" alt={`${contacto?.nombre}`} loading="lazy" />
                                    </div>
                                    <div className="modern-contact__profile-info">
                                        <h3>{contacto?.nombre}</h3>
                                        <p>{proyecto}</p>
                                        <div className="modern-contact__profile-tagline">
                                            <Leaf size={14} />
                                            <span>Construyendo un futuro sostenible</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modern-contact__form-content">
                                <h2>Contanos en qué te podemos ayudar</h2>
                                <p>Tu mensaje es importante para nosotros</p>

                                {submitStatus === 'success' && (
                                    <div className="modern-contact__status modern-contact__status--success">
                                        <CheckCircle size={14} />
                                        <span>¡Mensaje enviado! Te contactaremos pronto.</span>
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="modern-contact__status modern-contact__status--error">
                                        <AlertCircle size={14} />
                                        <span>Error al enviar. Por favor intenta nuevamente.</span>
                                    </div>
                                )}
                                {submitStatus === 'configuration' && (
                                    <div className="modern-contact__status modern-contact__status--error" role="alert">
                                        <AlertCircle size={14} />
                                        <span>El formulario por correo no está disponible temporalmente. Podés usar los otros medios de contacto.</span>
                                    </div>
                                )}

                                <form className="modern-contact__form" onSubmit={handleSubmit}>
                                    {/* Nombre */}
                                    <div className="modern-contact__field">
                                        <div className={`modern-contact__field-icon ${focusedField === 'nombre' ? 'modern-contact__field-icon--focused' : ''} ${errors.nombre ? 'modern-contact__field-icon--error' : ''}`}>
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            onFocus={() => handleFocus('nombre')}
                                            onBlur={handleBlur}
                                            className={`modern-contact__input ${focusedField === 'nombre' ? 'modern-contact__input--focused' : ''} ${errors.nombre ? 'modern-contact__input--error' : ''}`}
                                            maxLength={50}
                                            required
                                            autoComplete="name"
                                        />
                                        {errors.nombre && (
                                            <div className="modern-contact__field-error">
                                                <AlertCircle size={12} />
                                                <span>{errors.nombre}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Correo */}
                                    <div className="modern-contact__field">
                                        <div className={`modern-contact__field-icon ${focusedField === 'correo' ? 'modern-contact__field-icon--focused' : ''} ${errors.correo ? 'modern-contact__field-icon--error' : ''}`}>
                                            <AtSign size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={correo}
                                            onChange={(e) => handleInputChange('correo', e.target.value)}
                                            onFocus={() => handleFocus('correo')}
                                            onBlur={handleBlur}
                                            className={`modern-contact__input ${focusedField === 'correo' ? 'modern-contact__input--focused' : ''} ${errors.correo ? 'modern-contact__input--error' : ''}`}
                                            maxLength={100}
                                            required
                                            autoComplete="email"
                                        />
                                        {errors.correo && (
                                            <div className="modern-contact__field-error">
                                                <AlertCircle size={12} />
                                                <span>{errors.correo}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mensaje */}
                                    <div className="modern-contact__field">
                                        <textarea
                                            placeholder="Escribe tu mensaje aquí..."
                                            value={mensaje}
                                            onChange={(e) => handleInputChange('mensaje', e.target.value)}
                                            onFocus={() => handleFocus('mensaje')}
                                            onBlur={handleBlur}
                                            rows="4"
                                            className={`modern-contact__textarea ${focusedField === 'mensaje' ? 'modern-contact__textarea--focused' : ''} ${errors.mensaje ? 'modern-contact__textarea--error' : ''}`}
                                            maxLength={500}
                                            required
                                        />
                                        {errors.mensaje && (
                                            <div className="modern-contact__field-error">
                                                <AlertCircle size={12} />
                                                <span>{errors.mensaje}</span>
                                            </div>
                                        )}
                                        <div className="modern-contact__char-counter">
                                            <span className={mensaje.length > 450 ? 'modern-contact__char-counter--warning' : ''}>
                                                {mensaje.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button 
                                        type="submit"
                                        disabled={isFormSubmitted || !isFormValid()}
                                        className="modern-contact__submit"
                                    >
                                        {isFormSubmitted ? (
                                            <>
                                                <div className="modern-contact__spinner"></div>
                                                <span>Enviando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Sembrar mensaje</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redes sociales dinámicas */}
                {showSocialMedia && contacto && (
                    <div className="modern-contact__social-section">
                        <div className="modern-contact__social-header">
                            <h2>También podés encontrarnos por otros medios</h2>
                            <p>Elige la forma que más te guste para conectar con nosotros</p>
                        </div>

                        <div className="modern-contact__social-grid">
                            {contacto.email && (
                                <div className="modern-contact__social-card">
                                    <div className="modern-contact__social-icon modern-contact__social-icon--email">
                                        <Mail size={24} />
                                    </div>
                                    <h3>Escribinos por email</h3>
                                    <p>{contacto.email}</p>
                                    <a 
                                        href={`mailto:${contacto.email}`} 
                                        className="modern-contact__social-button modern-contact__social-button--email"
                                        aria-label={`Enviar email a ${contacto.nombre}`}
                                    >
                                        <Mail size={16} />
                                        <span>Enviar mensaje</span>
                                    </a>
                                </div>
                            )}

                            {contacto.telefono && (
                                <div className="modern-contact__social-card">
                                    <div className="modern-contact__social-icon modern-contact__social-icon--whatsapp">
                                        <MessageCircle size={24} />
                                    </div>
                                    <h3>Habla por WhatsApp</h3>
                                    <p>{contacto.telefono}</p>
                                    <a 
                                        href={`https://wa.me/${contacto.telefono.replace(/\D/g, '')}?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20${contacto.nombre}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="modern-contact__social-button modern-contact__social-button--whatsapp"
                                        aria-label={`Abrir chat de WhatsApp con ${contacto.nombre}`}
                                    >
                                        <MessageCircle size={16} />
                                        <span>Conversemos</span>
                                    </a>
                                </div>
                            )}

                            {contacto.redes_sociales?.instagram && (
                                <div className="modern-contact__social-card">
                                    <div className="modern-contact__social-icon modern-contact__social-icon--instagram">
                                        <Instagram size={24} />
                                    </div>
                                    <h3>Seguinos en redes</h3>
                                    <p>@{contacto.nombre}</p>
                                    <a 
                                        href={contacto.redes_sociales.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="modern-contact__social-button modern-contact__social-button--instagram"
                                        aria-label={`Visitar perfil de Instagram de ${contacto.nombre}`}
                                    >
                                        <Instagram size={16} />
                                        <span>Haz parte de la red</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CtaHablemos;
