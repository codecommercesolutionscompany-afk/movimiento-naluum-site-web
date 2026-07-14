import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Clock, Users, Monitor, Sparkles,
  ArrowRight, MessageCircle, BookOpen, Calendar, Share2, Expand
} from 'lucide-react';

import DiscountBadge from '../../../ui/discount_badge/discount_badge';

import './modal_card.scss';

const ModalCard = ({ course, children, onPrimaryAction }) => {
  if (!course) return null;

  const [isVisible, setIsVisible] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading] = useState(false);

  // normalizador simple
  const normalize = (s = '') =>
    s.normalize?.('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || String(s).toLowerCase();

  // Derivar base/action para el payload estandarizado
  const derived = useMemo(() => {
    const rawType = normalize(`${course?.type || ''} ${course?.category || ''}`);
    const isProduct = rawType.includes('product') || rawType.includes('producto');
    const isService = rawType.includes('service') || rawType.includes('servicio') || rawType.includes('curso');
    const base = isProduct ? 'product' : isService ? 'service' : 'product';
    const action = isProduct ? 'consulta' : 'inscripción';
    return { base, action };
  }, [course]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [course?.id]);

  useEffect(() => {
    const count = course?.highlights?.length || 0;
    if (count <= 1) return; // no ciclar si hay 0/1 items
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % count);
    }, 2500);
    return () => clearInterval(interval);
  }, [course?.id, course?.highlights?.length]);

  const handleEnrollClick = () => {
    // armar payload compatible con SupportModalContent
    const enriched = {
      ...course,
      type: `${derived.base} ${derived.action}`,
      itemType: `${derived.base} ${derived.action}`,
    };
    // callback opcional para que el padre dispare acciones si quiere
    if (typeof onPrimaryAction === 'function') onPrimaryAction(enriched);
    // mostrar el formulario embebido (children)
    setIsFormVisible(true);
  };

  const handleBackClick = () => setIsFormVisible(false);

  const renderStars = (ratingRaw) => {
    const rating = Number(ratingRaw) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return [...Array(5)].map((_, i) => {
      const isFilled = i < fullStars;
      const isHalf = i === fullStars && hasHalfStar;
      return (
        <Star
          key={i}
          size={16}
          fill={isFilled || isHalf ? '#f59e0b' : 'none'}
          stroke={isFilled || isHalf ? '#f59e0b' : '#d1d5db'}
          style={{
            opacity: isFilled ? 1 : isHalf ? 0.7 : 0.3,
            transition: 'all 0.2s ease',
          }}
        />
      );
    });
  };

  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n)) return '';
    const currency = course?.currency || 'USD';
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
      }).format(n);
    } catch {
      return `${currency} ${n.toFixed(2)}`;
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Construir URL asegurando barra inicial, sin duplicar id
  const buildCourseUrl = useCallback(() => {
    const cleanRouter = (course?.router || '').replace(/\/+$/, ''); // sin barra al final
    const cleanId = (course?.id || '').toString().replace(/^\/+/, ''); // sin barra al inicio

    // si el router ya contiene el id, usar router
    if (cleanRouter && cleanId && cleanRouter.endsWith(cleanId)) {
      return cleanRouter.startsWith('/') ? cleanRouter : `/${cleanRouter}`;
    }

    let path = cleanRouter ? `${cleanRouter}/${cleanId}` : `/${cleanId}`;
    if (!path.startsWith('/')) path = `/${path}`;
    return path.replace(/\/+$/, ''); // sin barra final
  }, [course?.router, course?.id]);

  const handleShareOrCopy = async () => {
    const url = `${window.location.origin}${buildCourseUrl()}`;
    const shareData = {
      title: course?.title || document.title,
      text: course?.subtitle || 'Mira este enlace interesante',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // cae a copiar si falla
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        // pequeño toast no intrusivo
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
      } catch {
        alert('Error al copiar el enlace');
      }
    } else {
      alert('Función de compartir no disponible en este navegador');
    }
  };

  return (
    <>
      {isFormVisible ? (
        <div className="children__container">
          {/* Si quisieras pasar el enriched como render-prop: 
              typeof children === 'function' ? children(enriched) : children */}
          {children}
          <div className="button__container">
            <button onClick={handleBackClick} className="button--back">← Volver</button>
          </div>
        </div>
      ) : (
        <div className={`card_modal__container ${isVisible ? 'visible' : ''}`}>
          <div className="card_modal__header">
            <div style={{ position: 'relative' }}>
              <img
                src={course.image}
                alt={course.title}
                className="card_modal__image"
                loading="lazy"
              />
            </div>

            <div className="card_modal__header-content">
              <h2 className="card_modal__title">{course.title}</h2>

              {course.subtitle && <p className="card_modal__subtitle">{course.subtitle}</p>}

              {course.description && (
                <p className="card_modal__description">{course.description}</p>
              )}

              <div className="card_modal__rating">
                <div className="stars">{renderStars(course.rating)}</div>
                {Number.isFinite(Number(course?.rating)) && (
                  <span className="rating-number">{Number(course.rating).toFixed(1)}</span>
                )}
                {course.students && (
                  <span className="students-count">
                    ({Number(course.students).toLocaleString()} estudiantes)
                  </span>
                )}
                {course.sold && (
                  <span className="students-count">
                    ({Number(course.sold).toLocaleString()} vendidos)
                  </span>
                )}
              </div>

              {course.instructor && (
                <div className="card_modal__instructor">
                  <BookOpen size={16} className="svg-icon" />
                  <span>
                    Instructor: <strong>{course.instructor}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {Array.isArray(course.highlights) && course.highlights.length > 0 && (
            <div className="card_modal__highlights">
              {course.highlights.map((highlight, index) => (
                <div
                  key={`${highlight}-${index}`}
                  className={`card_modal__highlight-item ${index === activeHighlight ? 'active' : ''}`}
                >
                  <Sparkles size={16} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}

          <div className="card_modal__body">
            {formatDate(course.date) && (
              <div className="card_modal__info-item card_modal__date">
                <Calendar size={20} />
                <div>
                  <strong>Fecha:</strong>
                  <br />
                  <span>{formatDate(course.date)}</span>
                </div>
              </div>
            )}

            {course.duration && (
              <div className="card_modal__info-item">
                <Clock size={20} />
                <div>
                  <strong>Duración:</strong>
                  <br />
                  <span>{course.duration}</span>
                </div>
              </div>
            )}

            {course.badge && (
              <div className="card_modal__info-item">
                <Users size={20} />
                <div>
                  <strong>Nivel:</strong>
                  <br />
                  <span>{course.badge}</span>
                </div>
              </div>
            )}

            {course.format && (
              <div className="card_modal__info-item">
                <Monitor size={20} />
                <div>
                  <strong>Formato:</strong>
                  <br />
                  <span>{course.format}</span>
                </div>
              </div>
            )}

            <div className="card_modal__info-item card_modal__price">
              {Number.isFinite(Number(course?.originalPrice)) && (
                <DiscountBadge
                  originalPrice={course.originalPrice}
                  currentPrice={course.price}
                />
              )}

              <div>
                {Number.isFinite(Number(course?.originalPrice)) && (
                  <div className="card_modal__original-price">
                    <span className="line-through">{formatPrice(course.originalPrice)}</span>
                    <span className="oferta-label">Oferta</span>
                  </div>
                )}
                {Number.isFinite(Number(course?.price)) && (
                  <div className="price-final">{formatPrice(course.price)}</div>
                )}
              </div>
            </div>
          </div>

          <button
            className="card_modal__action-button"
            onClick={handleEnrollClick}
            style={{ opacity: isLoading ? 0.8 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            <MessageCircle size={20} /> {derived.base === 'product' ? 'Consultar' : 'Quiero inscribirme'} <ArrowRight size={18} />
          </button>

          <div className="card_modal__buttons-floating">
            <button className="btn-copy-link" onClick={handleShareOrCopy} title="Compartir / Copiar enlace">
              <Share2 size={20} />
            </button>

            <Link to={buildCourseUrl()} className="card_modal__vermas-link" title="Expandir">
              <Expand size={18} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ModalCard);
