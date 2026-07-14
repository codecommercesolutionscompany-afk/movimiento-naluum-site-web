import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load';
import './time_line_history.scss';

/**
 * TimeLineHistory Component
 * 
 * @param {Object} props
 * @param {number} props.index - Índice para obtener los datos del contexto
 * @param {Object} props.titles - Objeto con titulo, subTitle y description
 * @param {boolean} props.showHeroBg - Mostrar imagen de fondo en el hero
 * @param {string} props.heroBgImage - URL de la imagen de fondo
 * @param {string} props.theme - Tema a aplicar: 'naluum', 'global', 'madreselva'
 * @param {string} props.className - Clases adicionales personalizadas
 * @param {number} props.initialItemsToShow - Número inicial de items a mostrar (default: 3)
 * @param {boolean} props.showMoreButton - Mostrar botón de "más info" (default: true)
 * @param {Function} props.onChapterChange - Callback cuando cambia el capítulo activo
 */
const TimeLineHistory = ({ 
  index, 
  titles, 
  showHeroBg = false, 
  heroBgImage,
  theme = 'naluum', // Por defecto usa el tema naluum
  className = '',
  initialItemsToShow = 3,
  showMoreButton = true,
  onChapterChange
}) => {
  // TODOS los hooks DEBEN ejecutarse ANTES de cualquier return condicional
  const { time_line_history } = useContext(ContextJsonLoadContext);
  const [activeChapter, setActiveChapter] = useState(0);
  const [moreInfo, setMoreInfo] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const chapterRefs = useRef([]);

  const chapters = useMemo(
    () => time_line_history?.[index]?.items || [],
    [index, time_line_history],
  );

  // Efecto para detectar scroll y activar animaciones
  useEffect(() => {
    // Si no hay capítulos, no ejecutar el efecto
    if (!chapters || chapters.length === 0) return;

    const handleScroll = () => {
      chapterRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;

          if (isInView) {
            setIsVisible((prev) => ({ ...prev, [index]: true }));
            
            // Actualizar capítulo activo basado en la posición del scroll
            if (rect.top < window.innerHeight * 0.5 && rect.top > -rect.height * 0.5) {
              if (activeChapter !== index) {
                setActiveChapter(index);
                // Llamar callback si existe
                if (onChapterChange) {
                  onChapterChange(index, chapters[index]);
                }
              }
            }
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Ejecutar al montar
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeChapter, chapters, onChapterChange]);

  // Validación de datos - DESPUÉS de los hooks
  if (!chapters || chapters.length === 0) {
    console.warn('TimeLineHistory: No se encontraron capítulos para el índice', index);
    return null;
  }

  if (!titles) {
    console.warn('TimeLineHistory: No se proporcionaron títulos');
    return null;
  }

  // Determinar la clase del tema
  const getThemeClass = () => {
    const validThemes = ['naluum', 'global', 'madreselva'];
    if (validThemes.includes(theme)) {
      return `theme-${theme}`;
    }
    console.warn(`TimeLineHistory: Tema '${theme}' no válido. Usando tema por defecto 'naluum'`);
    return 'theme-naluum';
  };

  // Función para manejar el click en "más info"
  const handleMoreInfo = () => {
    setMoreInfo(true);
    // Opcional: hacer scroll suave al siguiente capítulo
    if (chapterRefs.current[initialItemsToShow]) {
      setTimeout(() => {
        chapterRefs.current[initialItemsToShow].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  // Determinar cuántos capítulos mostrar
  const chaptersToShow = moreInfo ? chapters : chapters.slice(0, initialItemsToShow);

  return (
    <div className={`timeline-wrapper ${getThemeClass()} ${className}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="particle particle-1">✧</div>
          <div className="particle particle-2">✧</div>
          <div className="particle particle-3">✧</div>
          <div className="particle particle-4">✧</div>
        </div>

        <div
          className={`hero-content ${showHeroBg ? "with-bg" : ""}`}
          style={
            showHeroBg && heroBgImage
              ? { "--hero-bg-image": `url(${heroBgImage})` }
              : {}
          }
        >
          <h1 className="hero-title">
            {titles.titulo && (
              <span className="title-line">{titles.titulo}</span>
            )}
            {titles.subTitle && (
              <span className="title-highlight">{titles.subTitle}</span>
            )}
          </h1>
          {titles.description && (
            <p className="hero-subtitle">{titles.description}</p>
          )}
        </div>

        <div className="scroll-indicator">
          <span>Descubre nuestra historia</span>
          <div className="arrow-down">↓</div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-line" />

        {chaptersToShow.map((chapter, index) => (
          <div
            key={chapter.id || index}
            ref={(el) => (chapterRefs.current[index] = el)}
            className={`chapter ${isVisible[index] ? "visible" : ""} ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="chapter-content">
              <div className="chapter-content-icon-year">
                {chapter.year && (
                  <div className="chapter-year">{chapter.year}</div>
                )}
                {chapter.image && (
                  <div className="chapter-icon">{chapter.image}</div>
                )}
              </div>

              {chapter.title && (
                <h2 className="chapter-title">{chapter.title}</h2>
              )}
              {chapter.content && (
                <p className="chapter-text">{chapter.content}</p>
              )}
              {chapter.highlight && (
                <div className="chapter-highlight">
                  <span className="highlight-icon">⚡</span>
                  {chapter.highlight}
                </div>
              )}
            </div>
            
            <div className="chapter-marker">
              <div className={`marker-dot ${activeChapter === index ? "active" : ""}`} />
            </div>
          </div>
        ))}

        {/* Botón más info */}
        {showMoreButton && chapters.length > initialItemsToShow && (
          <div className="timeline-buttons">
            <button 
              className="more-info" 
              disabled={moreInfo} 
              onClick={handleMoreInfo}
              aria-label="Ver más información"
            >
              {moreInfo ? 'Mostrando todo' : 'Ver más'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default TimeLineHistory;
