const LEGACY_PAYMENT_STORAGE_KEY = 'methodStatePayment';

export const clearLegacyPaymentState = () => {
  try {
    window.localStorage.removeItem(LEGACY_PAYMENT_STORAGE_KEY);
  } catch {
    if (import.meta.env.DEV) console.warn('No se pudo limpiar el estado transaccional anterior.');
  }
};
