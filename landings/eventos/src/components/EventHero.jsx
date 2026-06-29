import EventCTA from './EventCTA.jsx';

const formatEventDate = (event) => {
  try {
    const date = new Date(`${event.event_date}T00:00:00`);
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: event.timezone,
    }).format(date);
  } catch {
    return event.event_date;
  }
};

const EventHero = ({ event, registrationHref }) => (
  <header className="eventos-hero">
    <div className="eventos-shell eventos-hero__inner">
      <div className="eventos-hero__content">
        {event.eyebrow ? <p className="eventos-eyebrow">{event.eyebrow}</p> : null}
        <h1>{event.headline}</h1>
        <p className="eventos-hero__description">{event.description}</p>
        <div className="eventos-hero__meta" aria-label="Datos del evento">
          <span>{formatEventDate(event)}</span>
          <span>{event.event_time} hs</span>
        </div>
        <EventCTA event={event} location="hero" registrationHref={registrationHref} />
      </div>
      {event.image ? (
        <div className="eventos-hero__media">
          <img src={event.image} alt="" />
        </div>
      ) : null}
    </div>
  </header>
);

export default EventHero;
