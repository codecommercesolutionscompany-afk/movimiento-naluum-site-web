import { useEffect, useMemo } from 'react';
import festivalData from './data/festival.json';
import { generateWhatsappUrl } from './utils/whatsapp.js';
import './styles/main.scss';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'festival_utm_context';
const WHATSAPP_DEDUP_KEY = 'festival_whatsapp_first_click_tracked';

const getStoredUtms = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const currentUtms = UTM_KEYS.reduce((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  if (Object.keys(currentUtms).length > 0) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentUtms));
    return currentUtms;
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const pushDataLayer = (eventName, payload = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
};

function App() {
  const data = festivalData;
  const utms = useMemo(getStoredUtms, []);
  const whatsappUrl = generateWhatsappUrl(data.whatsapp.number, data.whatsapp.message);

  const eventContext = useMemo(
    () => ({
      event_id: data.id,
      event_name: data.name,
      event_type: data.type,
      event_year: data.year,
      event_status: data.status,
      related_service: 'festival',
      ...utms,
    }),
    [data, utms],
  );

  useEffect(() => {
    pushDataLayer('event_page_context', eventContext);
  }, [eventContext]);

  const trackWhatsappClick = (ctaLocation) => {
    const payload = {
      ...eventContext,
      cta_location: ctaLocation,
      link_type: 'whatsapp',
    };

    pushDataLayer('cta_click', payload);

    if (typeof window !== 'undefined' && window.sessionStorage.getItem(WHATSAPP_DEDUP_KEY) !== 'true') {
      pushDataLayer('click_whatsapp', payload);
      window.sessionStorage.setItem(WHATSAPP_DEDUP_KEY, 'true');
    }
  };

  const ctaProps = (location) => ({
    href: whatsappUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'festival-button',
    onClick: () => trackWhatsappClick(location),
    'data-event-id': data.id,
    'data-event-name': data.name,
    'data-event-type': data.type,
    'data-event-year': data.year,
    'data-event-status': data.status,
    'data-cta-location': location,
    'data-related-service': 'festival',
  });

  return (
    <main className="festival-page">
      <section className="festival-hero">
        <div className="festival-hero__media" aria-hidden="true">
          <img src="/festival/img/conexion.JPG" alt="" />
        </div>
        <div className="festival-hero__overlay" />
        <div className="festival-container festival-hero__content">
          <p className="festival-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="festival-hero__concept">{data.hero.subtitle}</p>
          <p className="festival-hero__description">{data.hero.description}</p>
          <div className="festival-hero__facts" aria-label="Datos principales del festival">
            <span>{data.dates}</span>
            <span>{data.duration}</span>
            <span>{data.location.name}, Misiones</span>
          </div>
          <a {...ctaProps('hero')}>{data.hero.cta}</a>
          <p className="festival-hero__status">Estado: borrador interno. Programa completo a anunciarse.</p>
        </div>
      </section>

      <section className="festival-section festival-section--intro">
        <div className="festival-container festival-narrow">
          <p className="festival-eyebrow">Festival 2026</p>
          <h2>{data.intro.title}</h2>
          {data.intro.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="festival-section">
        <div className="festival-container">
          <div className="festival-grid festival-grid--pillars">
            {data.pillars.map((pillar) => (
              <article className="festival-card festival-card--pillar" key={pillar.title}>
                <h2>{pillar.title}</h2>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="festival-section festival-section--green">
        <div className="festival-container festival-two-column">
          <div>
            <p className="festival-eyebrow">Incluye</p>
            <h2>Que incluye la experiencia</h2>
          </div>
          <ul className="festival-list">
            {data.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="festival-section">
        <div className="festival-container festival-two-column">
          <div>
            <p className="festival-eyebrow">Alimentacion</p>
            <h2>{data.food.title}</h2>
          </div>
          <p>{data.food.text}</p>
        </div>
      </section>

      <section className="festival-section festival-section--tickets">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Entradas</p>
            <h2>Valores publicos previstos</h2>
            <p>Cupos totales: {data.capacity} participantes.</p>
          </div>
          <div className="festival-grid festival-grid--tickets">
            {data.tickets.map((ticket) => (
              <article className="festival-ticket" key={ticket.name}>
                <h3>{ticket.name}</h3>
                <p>{ticket.spots}</p>
                <strong>{ticket.price}</strong>
              </article>
            ))}
          </div>
          <div className="festival-center">
            <a {...ctaProps('tickets')}>Consultar disponibilidad</a>
          </div>
        </div>
      </section>

      <section className="festival-section festival-section--program">
        <div className="festival-container festival-two-column">
          <div>
            <p className="festival-eyebrow">Programa</p>
            <h2>{data.program.title}</h2>
          </div>
          <p>{data.program.text}</p>
        </div>
      </section>

      <section className="festival-section">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Preguntas frecuentes</p>
            <h2>Informacion disponible</h2>
          </div>
          <div className="festival-faq">
            {data.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="festival-section festival-section--refund">
        <div className="festival-container festival-narrow">
          <p className="festival-eyebrow">Politica de devolucion</p>
          <h2>Cancelaciones</h2>
          <p>{data.refundPolicy}</p>
        </div>
      </section>

      <section className="festival-final">
        <div className="festival-container festival-narrow">
          <p className="festival-eyebrow">Madre Selva · Misiones</p>
          <h2>Queres recibir informacion de Ecos de la Tierra?</h2>
          <p>Escribinos por WhatsApp y te compartimos los pasos disponibles cuando la informacion comercial este abierta.</p>
          <a {...ctaProps('final')}>Escribir por WhatsApp</a>
        </div>
      </section>
    </main>
  );
}

export default App;
