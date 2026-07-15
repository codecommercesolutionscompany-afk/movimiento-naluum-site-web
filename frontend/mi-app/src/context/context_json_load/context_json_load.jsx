import { ContextJsonLoadContext } from './context_json_load_context';

import dataImpactoReal from '../../json/data_impacto_real.json';
import listRouters from '../../json/listRouters.json';
import products from '../../json/products.json';
import projects from '../../json/projects.json';
import servicios from '../../json/servicios.json';
import testimonios from '../../json/testimonios.json';
import timeLineHistory from '../../json/time_line_history.json';
import message from '../../json/messge.json';
import FAQ from '../../json/FAQ.json';
import blogs from '../../json/blogs.json';
import timerProps from '../../json/timerProps.json';
import eventos from '../../json/eventos.json';
import infoContacto from '../../json/info_contacto.json';

const testimonialGroups = [
  'productos_madreSelva',
  'servicios_madreSelva',
  'servicios_naluum',
  'testimonios_movimiento',
  'testimonios_naluum',
];

const validators = {
  listaRutas: (value) => Boolean(value && Array.isArray(value['Movimiento Naluum'])),
  dataImpactoReal: (value) => Array.isArray(value) && value.length >= 8,
  products: Array.isArray,
  projects: (value) => Boolean(value && Array.isArray(value.projects)),
  servicios: Array.isArray,
  testimonios: (value) =>
    Boolean(value && testimonialGroups.every((group) => Array.isArray(value[group]))),
  time_line_history: Array.isArray,
  message: Array.isArray,
  FAQ: Array.isArray,
  blogs: (value) => Boolean(value && Array.isArray(value.blogs)),
  timerProps: (value) => Boolean(value && typeof value === 'object' && value.timer?.targetDate),
  eventos: Array.isArray,
  info_contacto: (value) =>
    Array.isArray(value) && value.every((entry) => entry?.proyecto && entry?.contacto),
};

const importedContent = {
  listaRutas: listRouters,
  dataImpactoReal,
  products,
  projects,
  servicios,
  testimonios,
  time_line_history: timeLineHistory,
  message,
  FAQ,
  blogs,
  timerProps,
  eventos,
  info_contacto: infoContacto,
};

const validateContent = () => {
  const errors = [];
  const content = {};

  Object.entries(importedContent).forEach(([name, value]) => {
    if (validators[name](value)) {
      content[name] = value;
      return;
    }

    errors.push(name);
    content[name] = Array.isArray(value) ? [] : {};
    if (import.meta.env.DEV) console.error(`[contenido local] Esquema inválido en ${name}.json`);
  });

  return { content, errors };
};

const validatedContent = validateContent();
const contextValue = Object.freeze({
  ...validatedContent.content,
  json_load: true,
  content_errors: validatedContent.errors,
  dataTimerProps: validatedContent.content.timerProps,
});

export const ContextJsonLoadProvider = ({ children }) => {
  return (
    <ContextJsonLoadContext.Provider value={contextValue}>
      {validatedContent.errors.length > 0 && (
        <div role="alert" className="content-data-error">
          No se pudo cargar correctamente: {validatedContent.errors.join(', ')}.
        </div>
      )}
      {children}
    </ContextJsonLoadContext.Provider>
  );
};
