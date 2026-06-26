import Icon from './Icon.jsx';

const AffinityFilter = ({ content }) => (
  <section className="sa-section sa-affinity">
    <div className="sa-container sa-affinity__grid">
      <div>
        <span className="sa-eyebrow">Filtro de afinidad</span>
        <h2>{content.title}</h2>
        <p>{content.text}</p>
      </div>
      <div className="sa-affinity__options">
        {content.options.map((option) => (
          <div className="sa-pill-card" key={option}>
            <Icon name="CheckCircle2" size={20} />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AffinityFilter;
