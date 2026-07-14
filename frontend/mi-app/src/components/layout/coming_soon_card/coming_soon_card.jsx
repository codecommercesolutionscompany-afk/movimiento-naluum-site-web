import { useState, useEffect } from 'react';
import './coming_soon_card.scss';

const ComingSoonCard = ({ 
  title = "Estamos construyendo algo especial",
  message = "Esta sección estará disponible muy pronto"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`coming-soon ${isVisible ? 'visible' : ''}`}>
      <div className="coming-soon__content">
        
        {/* Ícono de construcción */}
        <div className="coming-soon__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Badge */}
        <span className="coming-soon__badge">En construcción</span>

        {/* Título */}
        <h1 className="coming-soon__title">{title}</h1>

        {/* Mensaje */}
        <p className="coming-soon__message">{message}</p>

        {/* Barra de progreso */}
        <div className="coming-soon__progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">Trabajando en ello...</span>
        </div>

        {/* Decoración */}
        <div className="coming-soon__decoration">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>  

      </div>
    </div>
  );
};

export default ComingSoonCard;
