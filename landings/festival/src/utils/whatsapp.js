export const OFFICIAL_WHATSAPP_NUMBER = '5493764257777';

export const buildFestivalAttributionLine = (attribution = {}) => {
  const fields = [
    ['Origen', attribution.utm_source],
    ['Campaña', attribution.utm_campaign],
    ['Pieza', attribution.utm_content],
  ].filter(([, value]) => Boolean(value));

  return fields.length ? fields.map(([label, value]) => `${label}: ${value}`).join(' | ') : '';
};

export const buildFestivalWhatsappMessage = (
  baseMessage = '',
  funnelReference = '',
  attribution = {},
) => {
  const referenceLine = funnelReference ? `Referencia: ${funnelReference}` : '';
  const attributionLine = buildFestivalAttributionLine(attribution);

  return [baseMessage, referenceLine, attributionLine].filter(Boolean).join('\n\n');
};

export const generateWhatsappUrl = (number = OFFICIAL_WHATSAPP_NUMBER, message = '') => {
  const normalizedNumber = number || OFFICIAL_WHATSAPP_NUMBER;
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${normalizedNumber}?${params.toString()}`;
};

export const getWhatsappTrackingUrl = (number = OFFICIAL_WHATSAPP_NUMBER) => {
  const normalizedNumber = number || OFFICIAL_WHATSAPP_NUMBER;
  return `https://wa.me/${normalizedNumber}`;
};
