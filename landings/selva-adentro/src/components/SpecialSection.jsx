import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const SpecialSection = ({ content, assets }) => (
  <section id="experiencia" className="sa-section">
    <div className="sa-container">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.subtitle} align="center" />
      <div className="sa-special">
        <div className="sa-special__image">
          <img src={assets.forestWalk} alt="Recorrido por la selva en Madre Selva" loading="lazy" />
        </div>
        <div className="sa-special__cards">
          {content.cards.map((card) => (
            <article className="sa-feature-card" key={card.title}>
              <Icon name={card.icon} size={24} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SpecialSection;
