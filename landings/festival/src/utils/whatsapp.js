export const OFFICIAL_WHATSAPP_NUMBER = '5493764257777';

export const buildFestivalWhatsappMessage = (baseMessage = '', ticketLabel = null, funnelReference = '') => {
  const referenceLine = funnelReference ? `Referencia: ${funnelReference}` : '';

  if (!ticketLabel) {
    return [baseMessage, referenceLine].filter(Boolean).join('\n\n');
  }

  return `${baseMessage}\n\nEntrada de interés: ${ticketLabel}\n${referenceLine}`;
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
