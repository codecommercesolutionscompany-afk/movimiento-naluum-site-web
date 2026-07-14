import { useState, useMemo } from 'react';
import './FAQ.scss';

const FAQ = ({ 
  faqs = [], 
  title = "Preguntas Frecuentes", 
  subtitle = "",
  defaultCategory = "all" // <- aquí defines qué categoría quieres por defecto
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Filtrar FAQs solo para la categoría seleccionada
  const filteredFaqs = useMemo(() => {
    const categoryFaqs =
      defaultCategory === 'all'
        ? faqs
        : faqs.filter((faq) => faq.category === defaultCategory);

    return categoryFaqs;
  }, [faqs, defaultCategory]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
 
  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">{title}</h2>
          {subtitle && <p className="faq-subtitle">{subtitle}</p>}
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={faq.id || index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="question-icon">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className="icon-chevron"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              
              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  {faq.additionalInfo && (
                    <div className="additional-info">
                      {faq.additionalInfo}
                    </div>
                  )}
                  {faq.links && faq.links.length > 0 && (
                    <div className="faq-links">
                      {faq.links.map((link, linkIndex) => (
                        <a 
                          key={linkIndex} 
                          href={link.url} 
                          className="faq-link"
                          target={link.external ? "_blank" : "_self"}
                          rel={link.external ? "noopener noreferrer" : ""}
                        >
                          {link.text}
                          {link.external && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 6V10H2V2H6M8 0H12V4M12 0L5 7" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="no-faqs">
            <p>No hay preguntas frecuentes en esta categoría.</p>
          </div>
        )}
{/* 
        <div className="faq-footer">
          <div className="help-section">
            <h3>¿No encontraste lo que buscabas?</h3>
            <p>Estamos aquí para ayudarte</p>
            <div className="help-actions">
              <button className="help-btn primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 5L10 10L18 5M2 5V15L10 20L18 15V5M2 5L10 0L18 5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Contactar por Email
              </button>
              <button className="help-btn secondary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 2V8L10 6L12 8V2M4 20H16C17.1046 20 18 19.1046 18 18V4C18 2.89543 17.1046 2 16 2H4C2.89543 2 2 2.89543 2 4V18C2 19.1046 2.89543 20 4 20Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Ver Guías
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQ;
