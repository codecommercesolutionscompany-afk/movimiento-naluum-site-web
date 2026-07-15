import { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Monitor,
  Star,
  CheckCircle,
  ArrowRight,
  Share2,
  Heart,
  Award
} from 'lucide-react';

import Modal from '../../components/ui/modal/modal';
import SupportModalContent from '../../components/seccion/support_modal/support_modal';

import { ContextJsonLoadContext } from '../../context/context_json_load/context_json_load_context';
import './services_detail.scss';

// Imagen fallback simple
const FALLBACK_IMAGE = 'https://picsum.photos/1200/600?blur=2';

// Datos por defecto en caso de que no haya servicio
const defaultService = {
  title: 'Curso de Construcción Sostenible',
  subtitle: 'Aprende técnicas modernas y ancestrales de construcción ecológica',
  description:
    'Este curso te enseñará las mejores prácticas en construcción sostenible, combinando técnicas tradicionales con innovaciones modernas.',
  image:
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop',
  badge: 'Intermedio',
  format: 'Online',
  price: 299,
  currency: 'USD',
  rating: 4.8,
  students: 1250,
  instructor: 'Carlos Mendoza',
  duration: '8 semanas',
  date: '2024-02-15',
  highlights: [
    'Técnicas de construcción con materiales naturales',
    'Diseño bioclimático y eficiencia energética',
    'Sistemas de captación de agua lluvia',
    'Construcción con tierra y fibras naturales',
    'Certificación en construcción sostenible'
  ]
};

const ServiceDetail = () => {
  const { servicios } = useContext(ContextJsonLoadContext);
  const { id } = useParams();

  // Mantener referencia estable y emular el patrón del componente de productos
  const currentService = useMemo(() => {
    if (Array.isArray(servicios)) {
      return servicios.find((s) => String(s.id) === String(id)) || defaultService;
    }
    return defaultService;
  }, [servicios, id]);

  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price) => {
    // Robusto: soporta number y string; deja strings no numéricas (p.ej. "Gratis")
    if (price === null || price === undefined) return '$0';
    if (typeof price !== 'number') {
      const n = Number(price);
      if (Number.isFinite(n)) price = n;
      else return String(price);
    }
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currentService.currency || 'USD'
      }).format(price);
    } catch {
      return `$${price}`;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha por confirmar';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Fecha por confirmar';
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const numRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < numRating ? '#8F764C' : 'none'}
        stroke={i < numRating ? '#8F764C' : '#d1d5db'}
        aria-hidden="true"
      />
    ));
  };

  // Compartir / copiar (alineado al de productos, con toast)
  const handleShare = async () => {
    const shareData = {
      title: currentService.title,
      text: currentService.subtitle || 'Mira este curso interesante',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // cae a copiar
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      const toast = document.createElement('div');
      toast.textContent = 'Enlace copiado 📋';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(0,0,0,0.8)';
      toast.style.color = '#fff';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '12px';
      toast.style.fontSize = '14px';
      toast.style.zIndex = '9999';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => (toast.style.opacity = '0'), 1500);
      setTimeout(() => toast.remove(), 1800);
      return;
    }

    alert('Función de compartir no disponible en este navegador');
  };

  /** 🔹 Abrir modal de soporte **/
  const handleOpenSupportModal = () => {
    const updatedService = {
      ...currentService,
      type: `${currentService.type || 'servicio'} soporte`
    };
    setSelectedItem(updatedService);
    setIsSupportModalOpen(true);
  };

  /** Acción de inscripción por contacto **/
  const handleEnrollment = () => {
    const updatedService = {
      ...currentService,
      type: `${currentService.type || 'servicio'} inscripción`
    };
    setSelectedItem(updatedService);
    setIsSupportModalOpen(true);
  };

  return (
    <div className={`service-detail ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <section className="service-detail__hero">
        <div className="service-detail__hero-background">
          <img
            src={currentService.image}
            alt={currentService.title}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="overlay"></div>
        </div>

        <div className="service-detail__hero-content">
          <div className="badge-container">
            {currentService.badge && (
              <span className="badge badge--level">{currentService.badge}</span>
            )}
            {currentService.format && (
              <span className="badge badge--format">{currentService.format}</span>
            )}
          </div>

          <h1 className="title">{currentService.title}</h1>
          {currentService.subtitle && (
            <p className="subtitle">{currentService.subtitle}</p>
          )}

          <div className="hero-footer">
            <div
              className="rating"
              aria-label={`Valoración ${currentService.rating || 0} de 5`}
            >
              <div className="stars">{renderStars(currentService.rating)}</div>
              <span className="rating-text">
                {currentService.rating || 0} ({currentService.students || 0} estudiantes)
              </span>
            </div>

            <div className="actions">
              <button
                className="action-btn"
                onClick={handleShare}
                aria-label="Compartir"
                title="Compartir"
              >
                <Share2 size={20} />
              </button>

              <button
                onClick={() => setIsLiked((v) => !v)}
                className={`action-btn ${isLiked ? 'liked' : ''}`}
                aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                title={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="service-detail__container">
        <div className="service-detail__content">
          <section className="section section--description">
            <h2 className="section__title">Acerca de este curso</h2>
            <p className="description">{currentService.description}</p>
          </section>

          <section className="section section--highlights">
            <h2 className="section__title">Lo que aprenderás</h2>
            <div className="highlights-grid">
              {(currentService.highlights || []).map((text, i) => (
                <div key={i} className="highlight-item">
                  <CheckCircle size={20} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="section section--instructor">
            <h2 className="section__title">Tu instructor</h2>
            <div className="instructor-card">
              <div className="instructor-avatar">
                <Users size={32} />
              </div>
              <div className="instructor-info">
                <h3>{currentService.instructor || 'Instructor Experto'}</h3>
                <p>Experto en construcción sostenible y técnicas ancestrales</p>
              </div>
            </div>
          </section>

          <section className="section section--info">
            <h2 className="section__title">Información adicional</h2>
            <div className="info-cards">
              <div className="info-card">
                <Award size={24} />
                <h4>Certificación</h4>
                <p>Incluye certificado oficial</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="service-detail__sidebar">
          <div className="enrollment-card">
            <div className="price-section">
              <span className="price">{formatPrice(currentService.price)}</span>
              <span className="price-label">Precio total</span>
            </div>

            <button className="enrollment-btn" onClick={handleEnrollment}>
              Quiero inscribirme
              <ArrowRight size={20} />
            </button>

            <div className="course-info">
              {currentService.date && (
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <strong>Inicio:</strong>
                    <span>{formatDate(currentService.date)}</span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <Clock size={18} />
                <div>
                  <strong>Duración:</strong>
                  <span>{currentService.duration}</span>
                </div>
              </div>

              <div className="info-item">
                <Monitor size={18} />
                <div>
                  <strong>Formato:</strong>
                  <span>{currentService.format}</span>
                </div>
              </div>

              <div className="info-item">
                <Users size={18} />
                <div>
                  <strong>Nivel:</strong>
                  <span>{currentService.badge}</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        <div className="cta-card">
          <h3>¿Tienes preguntas?</h3>
          <p>Nuestro equipo está aquí para ayudarte</p>
          <button className="contact-btn" onClick={handleOpenSupportModal}>
            Contactar soporte
          </button>
        </div>

        <div className="redirect-btn">
          <h3>Ver todos los servicios</h3>
          <p>Todos los servicios disponibles</p>
          <Link className="contact-btn" to="/servicios">
            Ir a servicios
          </Link>
        </div>
      </div>

      {/* Modal de soporte */}
      <Modal
        isOpenModal={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      >
        {selectedItem && (
          <SupportModalContent
            onClose={() => setIsSupportModalOpen(false)}
            item={selectedItem}
          />
        )}
      </Modal>
    </div>
  );
};

export default ServiceDetail;
