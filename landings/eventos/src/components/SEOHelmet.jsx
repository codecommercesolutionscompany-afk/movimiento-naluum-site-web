import { useEffect } from 'react';

const SITE_URL = 'https://movimientonaluum.org';
const DEFAULT_DESCRIPTION = 'Eventos gratuitos de Movimiento Naluum.';

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(attributes.property ? 'meta' : attributes.rel ? 'link' : 'meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      element.removeAttribute(key);
      return;
    }

    element.setAttribute(key, value);
  });
};

const SEOHelmet = ({ event, fallbackTitle = 'Eventos gratuitos', noindex = false }) => {
  useEffect(() => {
    const title = event?.seo_title || fallbackTitle;
    const description = event?.seo_description || DEFAULT_DESCRIPTION;
    const canonical = event?.slug ? `${SITE_URL}/eventos/${event.slug}/` : `${SITE_URL}/eventos/`;
    const image = event?.image ? new URL(event.image, SITE_URL).toString() : '';

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex || event?.status === 'draft' ? 'noindex, nofollow' : 'index, follow',
    });
  }, [event, fallbackTitle, noindex]);

  return null;
};

export default SEOHelmet;
