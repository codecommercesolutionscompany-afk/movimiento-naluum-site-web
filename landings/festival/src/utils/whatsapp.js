export const OFFICIAL_WHATSAPP_NUMBER = '5493764257777';

export const generateWhatsappUrl = (number = OFFICIAL_WHATSAPP_NUMBER, message = '') => {
  const normalizedNumber = number || OFFICIAL_WHATSAPP_NUMBER;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
};
