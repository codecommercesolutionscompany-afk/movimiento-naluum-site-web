import { getSafeExternalUrl } from '../utils/links.js';

const ALLOWED_LOCATIONS = ['hero', 'details', 'benefits', 'agenda', 'final', 'sticky'];

const EventCTA = ({ event, location = 'final', registrationHref, className = '' }) => {
  if (!event || event.status !== 'open' || !registrationHref) return null;

  const safeLocation = ALLOWED_LOCATIONS.includes(location) ? location : 'final';
  const href = getSafeExternalUrl(registrationHref);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`eventos-button ${className}`.trim()}
      data-event-id={event.event_id}
      data-event-name={event.event_name}
      data-event-type={event.event_type}
      data-event-edition={event.event_edition}
      data-event-date={event.event_date}
      data-event-status={event.status}
      data-cta-location={safeLocation}
      data-related-service={event.related_service}
    >
      {event.cta_text}
    </a>
  );
};

export default EventCTA;
