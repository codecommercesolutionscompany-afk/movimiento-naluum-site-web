const labels = {
  masterclass: 'Masterclass',
  taller: 'Taller',
  clase_abierta: 'Clase abierta',
  charla: 'Charla',
};

const timezones = {
  'America/Argentina/Buenos_Aires': 'Hora de Argentina',
};

const formatEventDate = (dateValue) => {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const EventDetails = ({ event }) => (
  <section className="eventos-section">
    <div className="eventos-shell eventos-details">
      <article>
        <span>Fecha</span>
        <strong>{formatEventDate(event.event_date)}</strong>
      </article>
      <article>
        <span>Hora</span>
        <strong>{event.event_time} hs</strong>
      </article>
      <article>
        <span>Zona horaria</span>
        <strong>{timezones[event.timezone] || event.timezone}</strong>
      </article>
      <article>
        <span>Tipo</span>
        <strong>{labels[event.event_type] || event.event_type}</strong>
      </article>
    </div>
  </section>
);

export default EventDetails;
