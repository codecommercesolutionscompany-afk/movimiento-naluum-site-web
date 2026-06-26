const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign'];
const DEFAULT_SERVICE = 'selva_adentro';
const PROGRAM_START_DATE = '2026-08-03';

const getUtmSummary = () => {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(window.location.search);
  const values = UTM_PARAMS.map((param) => params.get(param)?.trim()).filter(Boolean);

  return values.length > 0 ? `\n\nOrigen: ${values.join(' / ')}` : '';
};

export const getWhatsappHref = (cta = {}) => {
  if (cta.href) return cta.href;
  if (!cta.whatsappNumber || !cta.whatsappMessage) return '#';

  return `https://wa.me/${cta.whatsappNumber}?text=${encodeURIComponent(
    `${cta.whatsappMessage}${getUtmSummary()}`
  )}`;
};

export const getWhatsappTarget = (cta = {}) =>
  getWhatsappHref(cta).startsWith('http') ? '_blank' : undefined;

export const trackWhatsappStart = (ctaLocation) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'click_whatsapp_start', {
    service: DEFAULT_SERVICE,
    cta_location: ctaLocation,
    program_start_date: PROGRAM_START_DATE,
  });
};

export const handleWhatsappClick = (cta = {}) => {
  if (cta.ctaLocation) {
    trackWhatsappStart(cta.ctaLocation);
  }
};
