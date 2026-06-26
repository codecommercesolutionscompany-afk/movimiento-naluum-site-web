import React from 'react';

const Testimonials = ({ data }) => {
  const testimonials = data.testimonials;

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="yerba-testimonials">
      <div className="yerba-container">
        <h2 className="yerba-testimonials__section-title">Lo que dicen quienes la prueban</h2>
        <div className="yerba-testimonials__grid">
          {testimonials.map((t) => (
            <div key={t.name} className="yerba-testimonials__card">
              <img src={`${import.meta.env.BASE_URL}${t.image}`} alt={t.name} className="yerba-testimonials__image" />
              <div className="yerba-testimonials__overlay">
                <div className="yerba-testimonials__content">
                  {t.tags && t.tags.length > 0 && (
                    <div className="yerba-testimonials__tags">
                      {t.tags.map((tag) => (
                        <span key={tag} className="yerba-testimonials__tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <h3 className="yerba-testimonials__title">"{t.title}"</h3>
                  <p className="yerba-testimonials__quote">{t.quote}</p>
                  <p className="yerba-testimonials__name">- {t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
