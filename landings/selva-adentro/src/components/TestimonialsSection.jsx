import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const TestimonialsSection = ({ content }) => (
  <section className="sa-section sa-testimonials-v2">
    <div className="sa-container">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.text} align="center" />
      <div className="sa-testimonials-grid">
        {content.items.map((testimonial) => (
          <article className="sa-testimonial-card" key={testimonial.name}>
            <div className="sa-testimonial-card__bg">
              <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
              <div className="sa-testimonial-card__overlay" />
            </div>

            <div className="sa-testimonial-card__content">
              <div className="sa-testimonial-card__stars" aria-label={`${testimonial.rating} estrellas`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Icon key={index} name="Star" size={14} fill="currentColor" stroke="none" />
                ))}
              </div>

              <div className="sa-testimonial-card__bottom">
                <p>“{testimonial.quote}”</p>
                <div>
                  <h3>{testimonial.name}</h3>
                  {testimonial.link ? (
                    <a href={testimonial.link} target="_blank" rel="noopener noreferrer">
                      {testimonial.handle}
                    </a>
                  ) : (
                    <span>{testimonial.handle}</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
