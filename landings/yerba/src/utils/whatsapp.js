const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'yerba_utm_params';
const LEGACY_UTM_PREFIX = 'yerba_';
const FIRST_TOUCH_STORAGE_KEY = 'yerba_first_touch_timestamp';
const WHATSAPP_DEDUP_PREFIX = 'yerba_whatsapp_click_dedup';
const WHATSAPP_DESTINATION = '5493764257777';
const REFERENCE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const EVENT_CONTEXT = {
  landing_name: 'yerba',
  related_service: 'yerba',
  event_id: 'yerba-mate-2026',
  event_name: 'Yerba Mate Orgánica Madre Selva',
  event_type: 'producto',
  event_edition: '2026',
  event_status: 'published',
  product_name: 'Yerba Mate Orgánica Madre Selva',
  currency: 'ARS',
};

const REFERENCE_PREFIX_BY_CATEGORY = {
  compra: 'YERBA-COMPRA',
  menos30: 'YERBA-MENOS30',
  mas30: 'YERBA-MAS30',
};

const canUseWindow = () => typeof window !== 'undefined';

const getStorage = () => {
  if (!canUseWindow()) return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const readStoredJson = (key) => {
  const storage = getStorage();
  if (!storage) return {};

  try {
    return JSON.parse(storage.getItem(key) || '{}');
  } catch {
    return {};
  }
};

const writeStoredJson = (key, value) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep WhatsApp usable if browser storage is blocked.
  }
};

const generateReferenceCode = () => {
  const bytes = new Uint8Array(4);

  if (canUseWindow() && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => REFERENCE_CHARACTERS[byte % REFERENCE_CHARACTERS.length]).join('');
};

const getReferenceStorageKey = (ticketCategory) => `yerba_funnel_reference:${ticketCategory}`;

const getReferencePrefix = (ticketCategory) =>
  REFERENCE_PREFIX_BY_CATEGORY[ticketCategory] || REFERENCE_PREFIX_BY_CATEGORY.compra;

const getFunnelReference = (ticketCategory) => {
  const storage = getStorage();
  const storageKey = getReferenceStorageKey(ticketCategory);
  const prefix = getReferencePrefix(ticketCategory);

  if (!storage) return `${prefix}-${generateReferenceCode()}`;

  try {
    const existingReference = storage.getItem(storageKey);
    if (existingReference?.startsWith(`${prefix}-`)) {
      return existingReference;
    }

    const newReference = `${prefix}-${generateReferenceCode()}`;
    storage.setItem(storageKey, newReference);
    return newReference;
  } catch {
    return `${prefix}-${generateReferenceCode()}`;
  }
};

export const captureYerbaUtmParams = () => {
  if (!canUseWindow()) return;

  const storage = getStorage();
  const params = new URLSearchParams(window.location.search);
  const storedUtmParams = readStoredJson(UTM_STORAGE_KEY);
  const nextUtmParams = { ...storedUtmParams };

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);

    if (value) {
      nextUtmParams[key] = value;

      if (storage) {
        try {
          storage.setItem(`${LEGACY_UTM_PREFIX}${key}`, value);
        } catch {
          // Preserve current behavior when storage is available.
        }
      }
    }
  });

  writeStoredJson(UTM_STORAGE_KEY, nextUtmParams);
};

export const getYerbaUtmPayload = () => {
  const storage = getStorage();
  const params = canUseWindow() ? new URLSearchParams(window.location.search) : null;
  const storedUtmParams = readStoredJson(UTM_STORAGE_KEY);

  return UTM_KEYS.reduce((payload, key) => {
    let legacyStoredValue;

    try {
      legacyStoredValue = storage?.getItem(`${LEGACY_UTM_PREFIX}${key}`);
    } catch {
      legacyStoredValue = null;
    }

    const value = params?.get(key) || storedUtmParams[key] || legacyStoredValue;

    if (value) {
      payload[key] = value;
    }

    return payload;
  }, {});
};

export const getFirstTouchTimestamp = () => {
  const storage = getStorage();
  if (!storage) return undefined;

  try {
    const existingTimestamp = storage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (existingTimestamp) return existingTimestamp;

    const timestamp = new Date().toISOString();
    storage.setItem(FIRST_TOUCH_STORAGE_KEY, timestamp);
    return timestamp;
  } catch {
    return undefined;
  }
};

const getPagePayload = () => {
  if (!canUseWindow()) return {};

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
  };
};

const pushDataLayerEvent = (payload) => {
  if (!canUseWindow()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const buildBasePayload = () => ({
  ...getPagePayload(),
  ...EVENT_CONTEXT,
  ...getYerbaUtmPayload(),
  first_touch_timestamp: getFirstTouchTimestamp(),
});

export const pushEventPageContext = () => {
  pushDataLayerEvent({
    event: 'event_page_context',
    ...buildBasePayload(),
  });
};

export const generateWhatsappUrl = (number, message) => {
  if (!number) return '#';

  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

const buildWhatsappMessage = (cta, funnelReference) =>
  [`${cta.whatsappMessage || ''}`, '', `Referencia: ${funnelReference}`].join('\n');

export const getWhatsappHref = (cta = {}) => {
  const whatsappNumber = cta.whatsappNumber || WHATSAPP_DESTINATION;
  return generateWhatsappUrl(whatsappNumber, cta.whatsappMessage);
};

export const getWhatsappTrackingAttributes = (cta = {}) => ({
  'data-event-id': EVENT_CONTEXT.event_id,
  'data-event-name': EVENT_CONTEXT.event_name,
  'data-event-type': EVENT_CONTEXT.event_type,
  'data-event-edition': EVENT_CONTEXT.event_edition,
  'data-event-status': EVENT_CONTEXT.event_status,
  'data-cta-location': cta.ctaLocation,
  'data-cta-type': 'whatsapp',
  'data-ticket-category': cta.ticketCategory,
  'data-related-service': EVENT_CONTEXT.related_service,
  'data-product-name': EVENT_CONTEXT.product_name,
  'data-whatsapp-destination': cta.whatsappNumber || WHATSAPP_DESTINATION,
});

export const handleWhatsappClick = (cta = {}, event) => {
  if (!cta.ctaLocation || !cta.ticketCategory || !cta.whatsappMessage) return;

  const whatsappNumber = cta.whatsappNumber || WHATSAPP_DESTINATION;
  const funnelReference = getFunnelReference(cta.ticketCategory);
  const whatsappMessage = buildWhatsappMessage(cta, funnelReference);
  const ctaUrl = generateWhatsappUrl(whatsappNumber, whatsappMessage);

  if (event?.currentTarget) {
    event.currentTarget.href = ctaUrl;
    event.currentTarget.dataset.funnelReference = funnelReference;
  }

  const eventPayload = {
    ...buildBasePayload(),
    cta_text: cta.ctaText,
    cta_location: cta.ctaLocation,
    ticket_category: cta.ticketCategory,
    funnel_reference: funnelReference,
    cta_url: ctaUrl,
    cta_type: 'whatsapp',
    whatsapp_destination: whatsappNumber,
    deduplication_scope: 'session_cta_location_ticket_category',
    ...(cta.productVariant ? { product_variant: cta.productVariant } : {}),
    ...(cta.quantitySegment ? { quantity_segment: cta.quantitySegment } : {}),
    ...(cta.pricePerKg ? { price_per_kg: cta.pricePerKg } : {}),
  };

  pushDataLayerEvent({
    event: 'cta_click',
    ...eventPayload,
  });

  const storage = getStorage();
  const deduplicationKey = `${WHATSAPP_DEDUP_PREFIX}:${cta.ctaLocation}:${cta.ticketCategory}`;

  try {
    if (!storage?.getItem(deduplicationKey)) {
      pushDataLayerEvent({
        event: 'click_whatsapp',
        ...eventPayload,
      });

      storage?.setItem(deduplicationKey, '1');
    }
  } catch {
    pushDataLayerEvent({
      event: 'click_whatsapp',
      ...eventPayload,
    });
  }
};
