const LEGACY_CONTENT_CACHE_KEYS = [
  'json_data_impacto_real',
  'json_listRouters',
  'json_products',
  'json_projects',
  'json_servicios',
  'json_testimonios',
  'json_time_line_history',
  'json_messge',
  'json_FAQ',
  'json_blogs',
  'json_timerProps',
  'json_eventos',
  'json_info_contacto',
];

export const clearLegacyContentCache = () => {
  try {
    LEGACY_CONTENT_CACHE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    console.warn('No se pudo limpiar la caché de contenido anterior.', error);
  }
};
