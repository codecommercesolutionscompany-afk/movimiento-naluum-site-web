import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const FormationSection = ({ content }) => (
  <section id={content.id} className="sa-section sa-section--dark sa-formation-section">
    <div className="sa-container">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} align="center" />
      <div className="sa-formation">
        <div className="sa-timeline">
          {content.schedule.map((item) => (
            <article className="sa-timeline__item" key={`${item.day}-${item.title}`}>
              <span className="sa-timeline__day">{item.day}</span>
              <div className="sa-timeline__body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="sa-rhythm">
          <div className="sa-rhythm__header">
            <Icon name="CalendarDays" size={22} />
            <h3>{content.rhythmTitle}</h3>
          </div>
          <ul>
            {content.rhythm.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default FormationSection;
