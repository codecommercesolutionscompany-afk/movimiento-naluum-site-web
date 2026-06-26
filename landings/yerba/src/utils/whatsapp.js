const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_PREFIX = 'yerba_';

const canUseWindow = () => typeof window !== 'undefined';

const getStorage = () => {
  if (!canUseWindow()) return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const captureYerbaUtmParams = () => {
  if (!canUseWindow()) return;

  const storage = getStorage();
  const params = new URLSearchParams(window.location.search);

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);

    if (value && storage) {
      try {
        storage.setItem(`${UTM_PREFIX}${key}`, value);
      } catch {
        // Keep WhatsApp usable if browser storage is blocked.
      }
    }
  });
};

export const getYerbaUtmPayload = () => {
  const storage = getStorage();
  const params = canUseWindow() ? new URLSearchParams(window.location.search) : null;

  return UTM_KEYS.reduce((payload, key) => {
    let storedValue;

    try {
      storedValue = storage?.getItem(`${UTM_PREFIX}${key}`);
    } catch {
      storedValue = null;
    }

    const value = params?.get(key) || storedValue;

    if (value) {
      payload[key] = value;
    }

    return payload;
  }, {});
};

export const generateWhatsappUrl = (number, message) => {
  if (!number) return '#';

  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

export const trackWhatsappStart = ({
  ctaLocation,
  quantityTier,
  displayedPriceArsPerKg
}) => {
  if (!canUseWindow()) return;

  const payload = {
    service: 'yerba',
    product: 'yerba_mate_madre_selva',
    cta_location: ctaLocation,
    quantity_tier: quantityTier,
    displayed_price_ars_per_kg: displayedPriceArsPerKg,
    ...getYerbaUtmPayload()
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_whatsapp_start', payload);
  }
};
