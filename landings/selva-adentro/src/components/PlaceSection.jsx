import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const PlaceSection = ({ content, assets }) => (
  <section id={content.id} className="sa-section sa-place">
    <div className="sa-container sa-place__grid">
      <div className="sa-place__image">
        <img
          src={assets.place}
          alt="Madre Selva, espacio físico donde sucede Selva Adentro"
          loading="lazy"
        />
      </div>
      <div>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.text} />
        <p className="sa-place__description">{content.description}</p>
        <div className="sa-highlight-grid">
          {content.highlights.map((item) => (
            <div className="sa-mini-highlight" key={item}>
              <Icon name="Leaf" size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PlaceSection;
