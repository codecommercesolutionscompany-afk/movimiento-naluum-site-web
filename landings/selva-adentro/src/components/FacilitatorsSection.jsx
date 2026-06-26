import SectionHeading from './SectionHeading.jsx';

const FacilitatorsSection = ({ content }) => (
  <section id={content.id} className="sa-section">
    <div className="sa-container">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} align="center" />
      <div className="sa-facilitators">
        {content.items.map((item) => (
          <article className="sa-facilitator" key={item.name}>
            <span>{item.name}</span>
            <p>{item.role}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FacilitatorsSection;
