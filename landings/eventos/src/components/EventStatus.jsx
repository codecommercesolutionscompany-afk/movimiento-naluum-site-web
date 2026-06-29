const EventStatus = ({ title, message }) => (
  <main className="eventos-status">
    <div className="eventos-shell eventos-status__card">
      <p className="eventos-eyebrow">Movimiento Naluum</p>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  </main>
);

export default EventStatus;
