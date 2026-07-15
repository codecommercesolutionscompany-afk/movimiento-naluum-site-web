import { useState } from 'react';
import './founders.scss';
const Founders = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  
const founders = [
  {
    id: 1,
    name: "Tierra Martínez",
    role: "Co-Fundador y Coordinador General",
    bio: "Diseñador en Permacultura y educador internacional con más de 25 años de experiencia en procesos de regeneración ecológica, social y cultural. Ha trabajado en más de 40 países desarrollando proyectos de diseño regenerativo, educación y desarrollo comunitario. Co-fundador del Instituto Na Lu’um y del Eco Centro Madre Selva (Argentina), impulsa espacios de aprendizaje vivo donde se integran la sabiduría ancestral, la ciencia moderna y la espiritualidad práctica para construir una humanidad en equilibrio con la Tierra.",
    quote: "Solo cuando recordamos cómo habitar la Tierra con humildad y propósito, comienza la verdadera transformación.",
    image: '/img/testimonials/tierra-martinez.webp'
  },
  {
    id: 2,
    name: "Beatriz Ramírez Cruz",
    role: "Co-Fundadora y Directora General de Campo",
    bio: "Diseñadora en Permacultura especializada en Bioconstrucción y Diseño Social, con más de 15 años de experiencia. Co-facilitadora de los cursos de Diseño en Permacultura del Instituto Na Lu’um, ha trabajado en más de 30 países compartiendo herramientas para la regeneración ecológica y humana. De origen mexicana, coordina programas educativos en Madre Selva y el Instituto Na Lu’um, impulsando una educación viva que une conocimiento, propósito y acción.",
    quote: "La vida es muy sencilla, solo que la complicamos en nombre de la búsqueda incansable de quienes somos, sin saber que ya somos alguien desde que hacemos.",
    image: '/img/testimonials/beatriz-ramirez.webp'
  }
];


const familyFounder = {
  id: 3,
  name: "La Familia Na Lu'um",
  role: "Unidos por un propósito común",
  bio: "El Instituto de Permacultura Na Lu'um International tiene como propósito común la regeneración planetaria a través de procesos educativos en diseño de permacultura, bioconstrucción, permacultura social, reingeniería del ser, diseño hidrológico y agricultura sintrópica. Somos una familia unida por la regeneración de los sistemas. La Familia Na Lu'um sostiene un proceso educativo mediante una organización viva, donde cada integrante aporta desde su servicio al proyecto.",
  quote: "Somos una familia unida por la regeneración de la Tierra, sosteniendo una organización viva al servicio del cambio.",
  image: '/img/placeholders/pendiente-persona-familia-naluum.svg'
};



  const handleCardClick = (founderId) => {
    // Si la tarjeta ya está expandida, la contraemos, si no, la expandimos
    setExpandedCard(expandedCard === founderId ? null : founderId);
  };

  return (
    <section className="founders-section">
      <div className="founders-container">
        {/* Header elegante y minimalista */}
        <div className="founders-header">
          <div className="accent-line"></div>
          <h2 className="founders-title">Fundadores</h2>
          <p className="founders-subtitle">Las mentes visionarias detrás de Naluum</p>
        </div>

        {/* Layout de dos niveles */}
        <div className="founders-layout">
          {/* Primera fila - dos fundadores */}
          <div className="founders-row-top">
            {founders.map((founder) => (
              <div
                key={founder.id}
                className={`founder-card ${expandedCard === founder.id ? 'expanded' : ''}`}
                onClick={() => handleCardClick(founder.id)}
              >
                {/* Número decorativo */}
            

                {/* Imagen con overlay elegante */}
                <div className="founder-image-wrapper">
                  <div className="founder-image-container">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="founder-image"
                    />
                    <div className="image-overlay"></div>
                  </div>
                  
                  {/* Glow effect sutil */}
                  <div className="glow-effect"></div>
                </div>

                {/* Información del fundador */}
                <div className="founder-info">
                  <h3 className="founder-name">{founder.name}</h3>
                  <p className="founder-role">{founder.role}</p>
                  
                  {/* Línea decorativa */}
                  <div className="divider"></div>

                  {/* Bio expandible */}
                  <div className="bio-container">
                    <p className="founder-bio">{founder.bio}</p>
                    <blockquote className="founder-quote">&quot;{founder.quote}&quot;</blockquote>
                  </div>
                </div>

                {/* Indicador de hover */}
                <div className="hover-indicator"></div>
                
                {/* Botón de expansión */}
                <div className="expand-icon"></div>
              </div>
            ))}
          </div>

          {/* Segunda fila - familia centrada */}
          <div className="founders-row-bottom">
            <div
              className={`founder-card ${expandedCard === familyFounder.id ? 'expanded' : ''}`}
              onClick={() => handleCardClick(familyFounder.id)}
            >

              {/* Imagen con overlay elegante */}
              <div className="founder-image-wrapper">
                <div className="founder-image-container">
                  <img
                    src={familyFounder.image}
                    alt={familyFounder.name}
                    className="founder-image"
                  />
                  <div className="image-overlay"></div>
                </div>
                
                {/* Glow effect sutil */}
                <div className="glow-effect"></div>
              </div>

              {/* Información del fundador */}
              <div className="founder-info">
                <h3 className="founder-name">{familyFounder.name}</h3>
                <p className="founder-role">{familyFounder.role}</p>
                
                {/* Línea decorativa */}
                <div className="divider"></div>

                {/* Bio expandible */}
                <div className="bio-container">
                  <p className="founder-bio">{familyFounder.bio}</p>
                  <blockquote className="founder-quote">&quot;{familyFounder.quote}&quot;</blockquote>
                </div>
              </div>

              {/* Indicador de hover */}
              <div className="hover-indicator"></div>
              
              {/* Botón de expansión */}
              <div className="expand-icon"></div>
            </div>
          </div>
        </div>

        {/* Footer elegante */}
        <div className="founders-footer">
          <div className="footer-line"></div>
          <p className="footer-message">Unidos por una visión común de transformación</p>
        </div>
      </div>
    </section>
  );
};

export default Founders;
