export const DEFAULT_START_DATE_MONTHS = [2, 3, 4, 5, 8, 9, 10, 11];

export const formatMoney = (value, currency = 'ARS') => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '';
  }

  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(Math.round(numericValue));

  return `$${formatted}${currency ? ` ${currency}` : ''}`;
};

export const toLocalDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatStartDateLabel = (date) =>
  new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

export const getFirstMonday = (year, monthNumber) => {
  const date = new Date(year, monthNumber - 1, 1);
  const daysUntilMonday = (8 - date.getDay()) % 7;
  date.setDate(1 + daysUntilMonday);
  date.setHours(0, 0, 0, 0);

  return date;
};

export const buildStartDateOptions = (config = {}, referenceDate = new Date()) => {
  if (!config?.enabled) return [];

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const months = Array.isArray(config.months) && config.months.length > 0
    ? config.months.map(Number).filter((month) => month >= 1 && month <= 12)
    : DEFAULT_START_DATE_MONTHS;
  const years = Array.isArray(config.years) && config.years.length > 0
    ? config.years.map(Number).filter((year) => Number.isInteger(year))
    : [today.getFullYear()];
  const limit = Number.isFinite(Number(config.limit)) ? Number(config.limit) : 8;

  return years
    .flatMap((year) =>
      months.map((month) => {
        const date = getFirstMonday(year, month);

        return {
          value: toLocalDateValue(date),
          label: formatStartDateLabel(date),
          date,
        };
      })
    )
    .filter((option) => option.date >= today)
    .sort((a, b) => a.value.localeCompare(b.value))
    .slice(0, limit)
    .map(({ date, ...option }) => option);
};

export const getNextStartDateOption = (config = {}, referenceDate = new Date()) =>
  buildStartDateOptions(config, referenceDate)[0] || null;

export const parseLocalDateValue = (value) => {
  if (!value) return null;

  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getDaysUntilDate = (dateValue, referenceDate = new Date()) => {
  const targetDate = parseLocalDateValue(dateValue);
  if (!targetDate) return null;

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  return Math.ceil((targetDate.getTime() - today.getTime()) / 86400000);
};
