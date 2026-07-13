const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_PREFIX = 'link_in_bio_';
const FIRST_TOUCH_KEY = 'link_in_bio_first_touch_timestamp';
const REFERENCE_KEY = 'link_in_bio_funnel_reference';
const FORM_DEDUPE_PREFIX = 'link_in_bio_application_form_start:';
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

let contextSent = false;

function getStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function getRandomCode(length = 4) {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(length);
    cryptoApi.getRandomValues(bytes);
    return Array.from(bytes, (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]).join('');
  }

  return Array.from({ length }, () => REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)]).join('');
}

function getAttribution() {
  const storage = getStorage();
  const params = new URLSearchParams(window.location.search);
  const attribution = {};

  UTM_KEYS.forEach((key) => {
    const fromUrl = params.get(key)?.trim();
    const fromStorage = storage?.getItem(`${UTM_STORAGE_PREFIX}${key}`)?.trim();
    const value = fromUrl || fromStorage || '';

    if (fromUrl && storage) storage.setItem(`${UTM_STORAGE_PREFIX}${key}`, fromUrl);
    attribution[key] = value;
  });

  let firstTouch = storage?.getItem(FIRST_TOUCH_KEY) || '';
  if (!firstTouch) {
    firstTouch = new Date().toISOString();
    storage?.setItem(FIRST_TOUCH_KEY, firstTouch);
  }

  let funnelReference = storage?.getItem(REFERENCE_KEY) || '';
  if (!funnelReference) {
    funnelReference = `BIO-CLICK-${getRandomCode()}`;
    storage?.setItem(REFERENCE_KEY, funnelReference);
  }

  return { ...attribution, first_touch_timestamp: firstTouch, funnel_reference: funnelReference };
}

function push(payload) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function getPageAttribution() {
  return getAttribution();
}

export function trackPageContext() {
  if (contextSent) return;
  contextSent = true;

  push({
    event: 'event_page_context',
    landing_name: 'link-in-bio',
    page_type: 'link_hub',
    related_service: 'multiple',
    event_id: 'link-in-bio-madre-selva',
    event_name: 'Link in Bio Madre Selva',
    event_type: 'navigation_hub',
    event_status: 'published',
    page_url: window.location.href,
    page_path: window.location.pathname,
    ...getAttribution(),
  });
}

function isFormDestination(url) {
  try {
    const parsedUrl = new URL(url, window.location.href);
    const hostname = parsedUrl.hostname.toLowerCase();
    return hostname === 'forms.gle' || (hostname === 'docs.google.com' && parsedUrl.pathname.startsWith('/forms/'));
  } catch {
    return false;
  }
}

export function trackLinkClick(link, group, position) {
  const attribution = getAttribution();
  const payload = {
    ...attribution,
    event: 'cta_click',
    cta_text: link.title,
    cta_location: group,
    cta_type: link.ctaType,
    cta_destination: link.url,
    related_service: link.relatedService,
    link_category: link.category,
    link_position: position,
    is_external: link.external,
  };

  push(payload);

  if (link.ctaType === 'whatsapp') {
    push({
      ...attribution,
      event: 'click_whatsapp',
      whatsapp_number: link.whatsappNumber,
      whatsapp_destination: link.url,
      contact_purpose: link.contactPurpose,
      cta_location: group,
      cta_text: link.title,
    });
  }

  if (isFormDestination(link.url)) {
    const storage = getStorage();
    const dedupeKey = `${FORM_DEDUPE_PREFIX}${link.url}`;
    if (!storage?.getItem(dedupeKey)) {
      storage?.setItem(dedupeKey, '1');
      push({
        ...attribution,
        event: 'application_form_start',
        cta_text: link.title,
        cta_location: group,
        cta_type: 'external_form',
        form_provider: link.formProvider,
        form_destination: link.url,
        related_service: link.relatedService,
      });
    }
  }
}
