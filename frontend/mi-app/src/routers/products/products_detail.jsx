import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextJsonLoadContext } from '../../context/context_json_load/context_json_load';

import Modal from '../../components/ui/modal/modal';
import SupportModalContent from '../../components/seccion/support_modal/support_modal';

import {
  Calendar, Clock, Users, Monitor, Star, CheckCircle,
  ArrowRight, Share2, Heart, Award
} from 'lucide-react';

import './products_detail.scss';

const defaultItem = {
  title: 'Producto destacado',
  subtitle: 'Descubre lo mejor de nuestra colección',
  description: 'Este producto/servicio representa nuestra dedicación a la excelencia.',
  image: 'https://images.unsplash.com/photo-1602524818371-04eeb2fc76dd?w=800',
  badge: 'Destacado',
  format: 'Presencial',
  price: 199,
  currency: 'USD',
  rating: 4.5,
  students: 500,
  instructor: 'Equipo EcoVida',
  duration: '4 semanas',
  date: '2025-09-01',
  highlights: [
    'Alta calidad garantizada',
    'Materiales sustentables',
    'Hecho con amor y dedicación',
    'Disponible en toda Latinoamérica',
    'Certificado de autenticidad'
  ]
};

const ProductsDetail = ({ type = 'product' }) => {
  const { products } = useContext(ContextJsonLoadContext);
  const { id } = useParams();

  const currentItem = Array.isArray(products)
    ? products.find((item) => String(item.id) === String(id)) || defaultItem
    : defaultItem;

  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /** 🔹 Formateo de precio **/
  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currentItem.currency || 'USD',
    }).format(price);
  };

  /** 🔹 Formateo de fecha **/
  const formatDate = (date) => {
    if (!date) return 'Fecha por confirmar';
    try {
      const productsDate = new Date(date);
      return productsDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Fecha por confirmar';
    }
  };

  /** 🔹 Renderizado de estrellas **/
  const renderStars = (rating) => {
    const numRating = rating || 0;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < Math.floor(numRating) ? '#8F764C' : 'none'}
        stroke={i < Math.floor(numRating) ? '#8F764C' : '#d1d5db'}
      />
    ));
  };

  /** 🔹 Abrir modal de soporte **/
  const handleOpenSupportModal = () => {
    const updatedItem = {
      ...currentItem,
      type: `${currentItem.type || type} soporte`,
    };
    setSelectedItem(updatedItem);
    setIsSupportModalOpen(true);
  };

  /** Acción de consulta **/
  const handleConsult = () => {
    const updatedItem = {
      ...currentItem,
      type: `${currentItem.type || 'product'} consulta`,
    };
    setSelectedItem(updatedItem);
    setIsSupportModalOpen(true);
  };

  return (
    <div className={`products-detail ${isVisible ? 'visible' : ''}`}>
      {/* ===== HERO ===== */}
      <section className="products-detail__hero">
        <div className="products-detail__hero-background">
          <img src={currentItem.image} alt={currentItem.title} />
          <div className="overlay"></div>
        </div>

        <div className="products-detail__hero-content">
          <div className="badge-container">
            <span className="badge badge--level">{currentItem.badge}</span>
            <span className="badge badge--format">{currentItem.format}</span>
          </div>

          <h1 className="title">{currentItem.title}</h1>
          <p className="subtitle">{currentItem.subtitle}</p>

          <div className="hero-footer">
            <div className="rating">
              <div className="stars">{renderStars(currentItem.rating)}</div>
              <span className="rating-text">
                {currentItem.rating || 0} ({currentItem.students || 0}{' '}
                {type === 'product' ? 'clientes' : 'estudiantes'})
              </span>
            </div>

            <div className="actions">
              {/* Compartir */}
              <button
                className="action-btn"
                onClick={async () => {
                  const shareData = {
                    title: currentItem.title,
                    text: currentItem.subtitle || 'Mira este producto interesante',
                    url: window.location.href,
                  };

                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (error) {
                      if (import.meta.env.DEV && error?.name !== 'AbortError') {
                        console.error('No se pudo compartir el contenido.');
                      }
                    }
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }
                }}
              >
                <Share2 size={20} />
              </button>

              {/* Like */}
              <button
                className={`action-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="products-detail__container">
        <div className="products-detail__content">
          {/* Descripción */}
          <section className="section section--description">
            <h2 className="section__title">Acerca de este {type}</h2>
            <p className="description">{currentItem.description}</p>
          </section>

          {/* Beneficios */}
          <section className="section section--highlights">
            <h2 className="section__title">Lo que obtienes</h2>
            <div className="highlights-grid">
              {(currentItem.highlights || []).map((text, i) => (
                <div key={i} className="highlight-products">
                  <CheckCircle size={20} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Instructor o fabricante */}
          <section className="section section--instructor">
            <h2 className="section__title">
              {type === 'product' ? 'Fabricante' : 'Tu instructor'}
            </h2>
            <div className="instructor-card">
              <div className="instructor-avatar">
                <Users size={32} />
              </div>
              <div className="instructor-info">
                <h3>{currentItem.instructor || 'Equipo especializado'}</h3>
                <p>
                  Especialista en{' '}
                  {type === 'product'
                    ? 'productos ecológicos'
                    : 'formación sustentable'}
                </p>
              </div>
            </div>
          </section>

          {/* Información adicional */}
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

        {/* ===== SIDEBAR ===== */}
        <aside className="products-detail__sidebar">
          <div className="inquiry-card">
            <div className="price-section">
              <span className="price">{formatPrice(currentItem.price)}</span>
              <span className="price-label">Precio total</span>
            </div>

            <button className="inquiry-btn" onClick={handleConsult}>
              {type === 'product' ? 'Consultar' : 'Quiero inscribirme'}
              <ArrowRight size={20} />
            </button>

            <div className="course-info">
              {currentItem.date && (
                <div className="info-products">
                  <Calendar size={18} />
                  <div>
                    <strong>Inicio: </strong>
                    <span>{formatDate(currentItem.date)}</span>
                  </div>
                </div>
              )}

              <div className="info-products">
                <Clock size={18} />
                <div>
                  <strong>Duración: </strong>
                  <span>{currentItem.duration}</span>
                </div>
              </div>

              <div className="info-products">
                <Monitor size={18} />
                <div>
                  <strong>Formato: </strong>
                  <span>{currentItem.format}</span>
                </div>
              </div>

              <div className="info-products">
                <Users size={18} />
                <div>
                  <strong>Nivel: </strong>
                  <span>{currentItem.badge}</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* CTA Soporte */}
        <div className="cta-card">
          <h3>¿Tienes preguntas?</h3>
          <p>Nuestro equipo está aquí para ayudarte</p>
          <button className="contact-btn" onClick={handleOpenSupportModal}>
            Contactar soporte
          </button>
        </div>

        {/* Redirección */}
        <div className="redirect-btn">
          <h3>Ver todos los {type === 'product' ? 'productos' : 'servicios'}</h3>
          <p>{type === 'product' ? 'Productos destacados' : 'Servicios disponibles'}</p>
          <Link
            className="contact-btn"
            to={`/${type === 'product' ? 'productos' : 'servicios'}`}
          >
            Ir a {type === 'product' ? 'productos' : 'servicios'}
          </Link>
        </div>
      </div>

      {/* ===== MODAL DE SOPORTE ===== */}
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

export default ProductsDetail;
