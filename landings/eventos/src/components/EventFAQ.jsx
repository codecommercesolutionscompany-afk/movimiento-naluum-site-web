const EventFAQ = ({ event }) => {
  if (!event.faq?.length) return null;

  return (
    <section className="eventos-section eventos-section--soft">
      <div className="eventos-shell">
        <div className="eventos-section__heading">
          <span>FAQ</span>
          <h2>Preguntas frecuentes</h2>
        </div>
        <div className="eventos-faq">
          {event.faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventFAQ;
