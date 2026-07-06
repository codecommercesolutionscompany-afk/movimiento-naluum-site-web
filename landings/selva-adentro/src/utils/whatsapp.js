const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'selva_utm_params';
const FIRST_TOUCH_STORAGE_KEY = 'selva_first_touch_timestamp';
const WHATSAPP_DEDUP_PREFIX = 'selva_whatsapp_click_dedup';
const REFERENCE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const WHATSAPP_DESTINATION = '5493764257777';

const EVENT_CONTEXT = {
  landing_name: 'selva-adentro',
  related_service: 'selva-adentro',
  event_id: 'selva-adentro-2026',
  event_name: 'Selva Adentro',
  event_type: 'experiencia_inmersiva',
  event_edition: '2026',
  event_date: '3 al 14 de agosto de 2026',
  event_status: 'published',
};

let eventPageContextPushed = false;

const getTicketCategory = (cta = {}) => cta.ticketCategory || 'inscripcion';

const getReferencePrefix = (ticketCategory) => (ticketCategory === 'general' ? 'SELVA-GEN' : 'SELVA-INS');

const getReferenceStorageKey = (ticketCategory) =>
  `selva_funnel_reference:${ticketCategory === 'general' ? 'general' : 'inscripcion'}`;

const getStoredUtms = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const currentUtms = UTM_PARAMS.reduce((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  if (Object.keys(currentUtms).length > 0) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentUtms));
    return currentUtms;
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getFirstTouchTimestamp = () => {
  if (typeof window === 'undefined') return null;

  const storedTimestamp = window.sessionStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
  if (storedTimestamp) return storedTimestamp;

  const timestamp = new Date().toISOString();
  window.sessionStorage.setItem(FIRST_TOUCH_STORAGE_KEY, timestamp);
  return timestamp;
};

const generateReferenceCode = (length = 4) => {
  const values = new Uint32Array(length);

  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < length; index += 1) {
      values[index] = Math.floor(Math.random() * REFERENCE_CHARACTERS.length);
    }
  }

  return Array.from(values, (value) => REFERENCE_CHARACTERS[value % REFERENCE_CHARACTERS.length]).join('');
};

const getFunnelReference = (ticketCategory) => {
  const prefix = getReferencePrefix(ticketCategory);

  if (typeof window === 'undefined') {
    return `${prefix}-${generateReferenceCode()}`;
  }

  const storageKey = getReferenceStorageKey(ticketCategory);
  const storedReference = window.sessionStorage.getItem(storageKey);
  if (storedReference) return storedReference;

  const reference = `${prefix}-${generateReferenceCode()}`;
  window.sessionStorage.setItem(storageKey, reference);
  return reference;
};

const getPageLocation = () => {
  if (typeof window === 'undefined') {
    return {
      page_url: '',
      page_path: '',
    };
  }

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
  };
};

const getTrackingContext = () => ({
  ...getPageLocation(),
  ...EVENT_CONTEXT,
  ...getStoredUtms(),
  first_touch_timestamp: getFirstTouchTimestamp(),
});

const pushDataLayer = (payload = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const buildWhatsappMessage = (cta = {}, funnelReference) =>
  [`${cta.whatsappMessage || ''}`, '', `Referencia: ${funnelReference}`].join('\n');

const generateWhatsappUrl = (cta = {}, funnelReference) => {
  const whatsappNumber = cta.whatsappNumber || WHATSAPP_DESTINATION;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage(cta, funnelReference))}`;
};

export const pushEventPageContext = () => {
  if (eventPageContextPushed) return;

  pushDataLayer({
    event: 'event_page_context',
    ...getTrackingContext(),
  });
  eventPageContextPushed = true;
};

export const getWhatsappHref = (cta = {}) => {
  if (cta.href) return cta.href;
  if (!cta.whatsappNumber || !cta.whatsappMessage) return '#';

  return `https://wa.me/${cta.whatsappNumber}`;
};

export const getWhatsappTarget = (cta = {}) =>
  getWhatsappHref(cta).startsWith('http') ? '_blank' : undefined;

export const getWhatsappTrackingAttributes = (cta = {}) => {
  const ticketCategory = getTicketCategory(cta);

  return {
    'data-event-id': EVENT_CONTEXT.event_id,
    'data-event-name': EVENT_CONTEXT.event_name,
    'data-event-type': EVENT_CONTEXT.event_type,
    'data-event-edition': EVENT_CONTEXT.event_edition,
    'data-event-date': EVENT_CONTEXT.event_date,
    'data-event-status': EVENT_CONTEXT.event_status,
    'data-cta-location': cta.ctaLocation,
    'data-cta-type': 'whatsapp',
    'data-ticket-category': ticketCategory,
    'data-related-service': EVENT_CONTEXT.related_service,
    'data-whatsapp-destination': cta.whatsappNumber || WHATSAPP_DESTINATION,
  };
};

export const handleWhatsappClick = (cta = {}, event) => {
  if (!cta.ctaLocation || !cta.whatsappNumber || !cta.whatsappMessage) return;

  const ticketCategory = getTicketCategory(cta);
  const funnelReference = getFunnelReference(ticketCategory);
  const ctaUrl = generateWhatsappUrl(cta, funnelReference);
  const trackingPayload = {
    ...getTrackingContext(),
    cta_text: cta.label,
    cta_location: cta.ctaLocation,
    ticket_category: ticketCategory,
    funnel_reference: funnelReference,
    cta_url: ctaUrl,
    cta_type: 'whatsapp',
    whatsapp_destination: cta.whatsappNumber || WHATSAPP_DESTINATION,
    deduplication_scope: 'session_cta_location_ticket_category',
  };

  if (event?.currentTarget) {
    event.currentTarget.href = ctaUrl;
    event.currentTarget.dataset.funnelReference = funnelReference;
  }

  pushDataLayer({
    event: 'cta_click',
    ...trackingPayload,
  });

  const deduplicationKey = `${WHATSAPP_DEDUP_PREFIX}:${cta.ctaLocation}:${ticketCategory}`;
  const alreadyTracked =
    typeof window !== 'undefined' && window.sessionStorage.getItem(deduplicationKey) === 'true';

  if (!alreadyTracked) {
    pushDataLayer({
      event: 'click_whatsapp',
      ...trackingPayload,
    });

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(deduplicationKey, 'true');
    }
  }
};
