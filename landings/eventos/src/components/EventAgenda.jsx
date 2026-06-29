const EventAgenda = ({ event }) => {
  if (!event.agenda?.length) return null;

  return (
    <section className="eventos-section eventos-section--soft">
      <div className="eventos-shell">
        <div className="eventos-section__heading">
          <span>Agenda</span>
          <h2>Recorrido del encuentro</h2>
        </div>
        <ol className="eventos-agenda">
          {event.agenda.map((item) => (
            <li key={`${item.time || 'sin-hora'}-${item.title}`}>
              {item.time ? <time>{item.time}</time> : null}
              <strong>{item.title}</strong>
              {item.description ? <p>{item.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default EventAgenda;
