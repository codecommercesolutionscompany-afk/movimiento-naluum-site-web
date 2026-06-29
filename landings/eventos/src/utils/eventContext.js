const publishedContexts = new Set();

export const publishEventPageContext = (event) => {
  if (typeof window === 'undefined' || !event?.event_id) return;

  const contextKey = `${event.event_id}:${event.event_edition}`;
  if (publishedContexts.has(contextKey)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'event_page_context',
    event_id: event.event_id,
    event_name: event.event_name,
    event_type: event.event_type,
    event_edition: event.event_edition,
    event_date: event.event_date,
    related_service: event.related_service,
    event_status: event.status,
  });

  publishedContexts.add(contextKey);
};
