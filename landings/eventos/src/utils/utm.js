const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORAGE_PREFIX = 'eventos_';

const canUseWindow = () => typeof window !== 'undefined';

const getStorage = () => {
  if (!canUseWindow()) return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const sanitizeValue = (value) => String(value || '').trim();

export const captureUtmParams = () => {
  if (!canUseWindow()) return {};

  const storage = getStorage();
  const params = new URLSearchParams(window.location.search);
  const captured = {};

  UTM_KEYS.forEach((key) => {
    const value = sanitizeValue(params.get(key));

    if (!value) return;

    captured[key] = value;

    if (storage) {
      try {
        storage.setItem(`${STORAGE_PREFIX}${key}`, value);
      } catch {
        // UTM persistence should never block navigation.
      }
    }
  });

  return captured;
};

export const getStoredUtmParams = () => {
  const storage = getStorage();
  const currentParams = canUseWindow() ? new URLSearchParams(window.location.search) : null;

  return UTM_KEYS.reduce((payload, key) => {
    const currentValue = sanitizeValue(currentParams?.get(key));

    if (currentValue) {
      payload[key] = currentValue;
      return payload;
    }

    try {
      const storedValue = sanitizeValue(storage?.getItem(`${STORAGE_PREFIX}${key}`));
      if (storedValue) payload[key] = storedValue;
    } catch {
      // Missing storage is acceptable.
    }

    return payload;
  }, {});
};

export const appendUtmParamsToUrl = (url) => {
  if (!url) return '';

  try {
    const target = new URL(url);
    const utms = getStoredUtmParams();

    Object.entries(utms).forEach(([key, value]) => {
      target.searchParams.set(key, value);
    });

    return target.toString();
  } catch {
    return url;
  }
};

export const clearUtmParams = () => {
  const storage = getStorage();
  if (!storage) return;

  UTM_KEYS.forEach((key) => {
    try {
      storage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch {
      // Clearing attribution should be best effort.
    }
  });
};

export { UTM_KEYS };
