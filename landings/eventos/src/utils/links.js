export const getSafeExternalUrl = (url) => {
  if (!url) return '';

  try {
    const target = new URL(url);
    return target.protocol === 'http:' || target.protocol === 'https:' ? target.toString() : '';
  } catch {
    return '';
  }
};
