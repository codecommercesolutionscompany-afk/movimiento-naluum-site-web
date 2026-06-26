import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const IncludesSection = ({ content }) => (
  <section id={content.id} className="sa-section sa-section--muted">
    <div className="sa-container">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} align="center" />
      <div className="sa-include-grid">
        <div className="sa-list-panel">
          <h3>Incluye</h3>
          <ul>
            {content.included.map((item) => (
              <li key={item}>
                <Icon name="CheckCircle2" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sa-list-panel sa-list-panel--quiet">
          <h3>No incluye</h3>
          <ul>
            {content.notIncluded.map((item) => (
              <li key={item}>
                <Icon name="XCircle" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default IncludesSection;
