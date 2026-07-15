import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './carrusel_imagenes.scss';

const MissionCarousel = ({ cards = [], autoPlay = true, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || cards.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, cards.length, autoPlayInterval]);

  // Handlers con useCallback para evitar recreación
  const goToPrevious = useCallback(() => {
    setCurrentIndex(currentIndex => (currentIndex === 0 ? cards.length - 1 : currentIndex - 1));
  }, [cards.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(currentIndex => (currentIndex === cards.length - 1 ? 0 : currentIndex + 1));
  }, [cards.length]);

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
  
  const handleMouseLeave = useCallback(() => {
    if (autoPlay) setIsAutoPlaying(true);
  }, [autoPlay]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    else if (e.key === 'ArrowRight') goToNext();
  }, [goToPrevious, goToNext]);

  // Memorizar estilos para evitar recalculaciones innecesarias
  const slidesStyle = useMemo(() => ({
    transform: `translateX(-${currentIndex * 100}%)`
  }), [currentIndex]);

  const progressBarStyle = useMemo(() => ({
    width: `${((currentIndex + 1) / cards.length) * 100}%`,
    animationDuration: isAutoPlaying ? `${autoPlayInterval}ms` : 'none'
  }), [currentIndex, cards.length, isAutoPlaying, autoPlayInterval]);

  // Memorizar slides para evitar recreación de elementos
  const slides = useMemo(() => cards.map((card, index) => (
    <div
      key={card.id}
      className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
      aria-hidden={index !== currentIndex}
    >
      <div className="slide-image">
        <img
          src={card.image}
          alt={card.title}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <div className="slide-overlay"></div>
      </div>
      <div className="slide-content">
        <h3 className="slide-title">{card.title}</h3>
        <p className="slide-description">{card.description}</p>
      </div>
    </div>
  )), [cards, currentIndex]);

  if (cards.length === 0) {
    return <div className="mission-carousel">No hay imágenes para mostrar</div>;
  }

  return (
    <div
      className="mission-carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de misión"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-container">
        <div className="carousel-slides" style={slidesStyle}>
          {slides}
        </div>

        <button
          className="carousel-arrow carousel-arrow--prev"
          onClick={goToPrevious}
          aria-label="Imagen anterior"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          className="carousel-arrow carousel-arrow--next"
          onClick={goToNext}
          aria-label="Siguiente imagen"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
 
      <div className="carousel-progress">
        <div className="carousel-progress-bar" style={progressBarStyle} />
      </div>

      <div className="carousel-counter">
        <span className="counter-current">{currentIndex + 1}</span>
        <span className="counter-separator">/</span>
        <span className="counter-total">{cards.length}</span>
      </div>
    </div>
  );
};

MissionCarousel.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
};

MissionCarousel.displayName = 'MissionCarousel';

// Comparación personalizada para evitar renders innecesarios
const areEqual = (prevProps, nextProps) => {
  // Se recomienda comparar arrays con cuidado, usar IDs o memoización en el padre para evitar pasar arrays nuevos cada render
  if (prevProps.autoPlay !== nextProps.autoPlay) return false;
  if (prevProps.autoPlayInterval !== nextProps.autoPlayInterval) return false;

  if (prevProps.cards.length !== nextProps.cards.length) return false;

  for (let i = 0; i < prevProps.cards.length; i++) {
    if (prevProps.cards[i].id !== nextProps.cards[i].id) return false;
  }
  return true;
};

export default React.memo(MissionCarousel, areEqual);
