import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import './timelineNav.scss';

const TimelineNav = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!sections?.length) return undefined;
    // Configurar el observer solo para secciones con hash
    const hashSections = sections.filter(section => section.path?.startsWith('#'));
    
    if (hashSections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };
   
      observerRef.current = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) => {
            return current.intersectionRatio > prev.intersectionRatio ? current : prev;
          });
          
          // Encontrar la sección que corresponde a este elemento
          const matchingSection = sections.find(s => {
            if (s.path?.startsWith('#')) {
              return s.path.substring(1) === mostVisible.target.id;
            }
            return false;
          });
          
          if (matchingSection) {
            setActiveSection(matchingSection.id);
          }
        }
      }, observerOptions);

      // Observar todas las secciones con hash
      hashSections.forEach((section) => {
        // Remover el # del path para obtener el ID del elemento
        const elementId = section.path.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          observerRef.current.observe(element);
        }
      });
    }

    // Para rutas normales, actualizar activeSection basado en la ruta actual
    const currentPath = location.pathname + location.hash;
    const matchingRoute = sections.find(section => {
      if (section.path?.startsWith('#')) {
        return location.hash === section.path;
      } else if (section.path === '') {
        // Para la ruta raíz
        return location.pathname.endsWith('/naluum') || location.pathname.endsWith('/madre-selva');
      } else {
        return currentPath.includes(section.path);
      }
    });
    
    if (matchingRoute && !activeSection) {
      setActiveSection(matchingRoute.id);
    }

    // Detectar scroll para mostrar nombres
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, location, activeSection]);

  const handleNavClick = (section) => {
    // Si el path empieza con #, es una navegación por hash (scroll)
    if (section.path?.startsWith('#')) {
      // Remover el # para obtener el ID del elemento
      const elementId = section.path.substring(1);
      const element = document.getElementById(elementId);
      
      if (element) {
        const offset = 60; // Offset para headers fijos
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar la URL con el hash
        window.history.pushState(null, '', section.path);
      }
    } else {
      // Es una ruta normal, usar navigate
      if (section.path === '') {
        // Para la ruta raíz del proyecto
        navigate('.');
      } else {
        navigate(section.path);
      }
    }
    
    // Actualizar la sección activa inmediatamente
    setActiveSection(section.id);
  };

  if (!sections?.length) return null;

  const getActiveIndex = () => {
    return sections.findIndex(section => section.id === activeSection);
  };

  // Agregar clase 'scrolling' al nav cuando está en ese estado
  const navClassName = `timeline-nav ${isScrolling ? 'scrolling' : ''}`;

  return (
    <nav className={navClassName}>
      <div className="timeline-container">
        {/* Línea de fondo */}
        <div className="timeline-line" />
        
        {/* Línea de progreso */}
        <div 
          className="timeline-progress" 
          style={{ 
            height: `${((getActiveIndex() + 1) / sections.length) * 100}%` 
          }}
        />
        
        {/* Items de navegación */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;
          const isPassed = index < getActiveIndex();
          const showLabel = isScrolling || isHovered || isActive;
          
          return (
            <div
              key={section.id}
              className={`timeline-item ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              onClick={() => handleNavClick(section)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="item-content">
                <span className={`item-label ${showLabel ? 'visible' : ''}`}>
                  {section.name}
                </span>
                <Icon className="item-icon" size={18} />
              </div>
              <div className="item-dot" />
            </div>
          );
        })}
      </div>
      
      {/* Indicador móvil de sección activa */}
      <div className="mobile-indicator">
        <div className="indicator-content">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`indicator-dot ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => handleNavClick(section)}
            />
          ))}
        </div>
        <span className="current-section">
          {sections.find(s => s.id === activeSection)?.name}
        </span>
      </div>
    </nav>
  );
};

TimelineNav.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ),
};

export default TimelineNav;
