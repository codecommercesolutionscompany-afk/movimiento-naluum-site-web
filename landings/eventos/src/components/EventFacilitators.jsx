const EventFacilitators = ({ event }) => {
  if (!event.facilitators?.length) return null;

  return (
    <section className="eventos-section">
      <div className="eventos-shell">
        <div className="eventos-section__heading">
          <span>Facilitan</span>
          <h2>Quiénes guían la experiencia</h2>
        </div>
        <div className="eventos-facilitators">
          {event.facilitators.map((facilitator) => (
            <article key={facilitator.name}>
              {facilitator.image ? <img src={facilitator.image} alt="" /> : null}
              <h3>{facilitator.name}</h3>
              {facilitator.role ? <p>{facilitator.role}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventFacilitators;
