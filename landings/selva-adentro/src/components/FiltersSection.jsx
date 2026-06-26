import Icon from './Icon.jsx';

const FiltersSection = ({ content }) => (
  <section className="sa-section sa-section--split">
    <div className="sa-container sa-filter-grid">
      <article className="sa-filter-card sa-filter-card--yes">
        <h2>{content.forTitle}</h2>
        <ul>
          {content.forItems.map((item) => (
            <li key={item}>
              <Icon name="CheckCircle2" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="sa-filter-card sa-filter-card--no">
        <h2>{content.notForTitle}</h2>
        <ul>
          {content.notForItems.map((item) => (
            <li key={item}>
              <Icon name="XCircle" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default FiltersSection;
