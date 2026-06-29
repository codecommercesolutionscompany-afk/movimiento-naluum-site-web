import EventCTA from './EventCTA.jsx';

const EventBenefits = ({ event, registrationHref }) => {
  if (!event.benefits?.length) return null;

  return (
    <section className="eventos-section">
      <div className="eventos-shell">
        <div className="eventos-section__heading">
          <span>Beneficios</span>
          <h2>Qué te llevas de este encuentro</h2>
        </div>
        <ul className="eventos-list eventos-list--cards">
          {event.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <EventCTA event={event} location="benefits" registrationHref={registrationHref} className="eventos-button--secondary" />
      </div>
    </section>
  );
};

export default EventBenefits;
