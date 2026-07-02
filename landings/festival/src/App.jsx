import { useEffect, useMemo } from 'react';
import festivalData from './data/festival.json';
import {
  OFFICIAL_WHATSAPP_NUMBER,
  buildFestivalWhatsappMessage,
  generateWhatsappUrl,
  getWhatsappTrackingUrl,
} from './utils/whatsapp.js';
import './styles/main.scss';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'festival_utm_context';
const FIRST_TOUCH_STORAGE_KEY = 'festival_first_touch_timestamp';
const WHATSAPP_DEDUP_PREFIX = 'festival_whatsapp_click_tracked';
const FUNNEL_REFERENCE_PREFIX = 'festival_funnel_reference';
const RELATED_SERVICE = 'festival';
const LANDING_NAME = 'festival';
const REFERENCE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TICKET_CATEGORY_CODES = {
  'super-preventa': 'SPREV',
  preventa: 'PREV',
  'entrada-general': 'GRAL',
  'guardianes-del-bosque': 'BOSQ',
  misiones: 'MIS',
  general: 'GEN',
};

let eventPageContextPushed = false;

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

const getFirstTouchTimestamp = () => {
  if (typeof window === 'undefined') return null;

  const storedTimestamp = window.sessionStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
  if (storedTimestamp) return storedTimestamp;

  const timestamp = new Date().toISOString();
  window.sessionStorage.setItem(FIRST_TOUCH_STORAGE_KEY, timestamp);
  return timestamp;
};

const generateReferenceCode = (length = 4) => {
  const values = new Uint32Array(length);

  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < length; index += 1) {
      values[index] = Math.floor(Math.random() * REFERENCE_CHARACTERS.length);
    }
  }

  return Array.from(values, (value) => REFERENCE_CHARACTERS[value % REFERENCE_CHARACTERS.length]).join('');
};

const getFunnelReference = (ticketCategory = null) => {
  const categoryKey = ticketCategory || 'general';
  const categoryCode = TICKET_CATEGORY_CODES[categoryKey] || TICKET_CATEGORY_CODES.general;

  if (typeof window === 'undefined') {
    return `FEST-${categoryCode}-${generateReferenceCode()}`;
  }

  const storageKey = `${FUNNEL_REFERENCE_PREFIX}:${categoryKey}`;
  const storedReference = window.sessionStorage.getItem(storageKey);
  if (storedReference) return storedReference;

  const reference = `FEST-${categoryCode}-${generateReferenceCode()}`;
  window.sessionStorage.setItem(storageKey, reference);
  return reference;
};

const getPageLocation = () => {
  if (typeof window === 'undefined') {
    return {
      page_url: '',
      page_path: '',
    };
  }

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
  };
};

const getFestivalContext = (data) => ({
  ...getPageLocation(),
  landing_name: LANDING_NAME,
  related_service: RELATED_SERVICE,
  event_id: data.id,
  event_name: data.name,
  event_type: data.type,
  event_edition: data.year,
  event_date: data.dates,
  event_status: data.status,
  ...getStoredUtms(),
  first_touch_timestamp: getFirstTouchTimestamp(),
});

const pushDataLayer = (eventName, payload = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
};

function App() {
  const data = festivalData;
  const eventContext = useMemo(() => getFestivalContext(data), [data]);
  const whatsappDestination = data.whatsapp.number || OFFICIAL_WHATSAPP_NUMBER;
  const trackingWhatsappUrl = getWhatsappTrackingUrl(whatsappDestination);

  useEffect(() => {
    if (eventPageContextPushed) return;
    pushDataLayer('event_page_context', eventContext);
    eventPageContextPushed = true;
  }, [eventContext]);

  const getUtmPayload = () =>
    UTM_KEYS.reduce((acc, key) => {
      acc[key] = eventContext[key] || undefined;
      return acc;
    }, {});

  const trackWhatsappClick = ({ ctaLocation, ctaText, ticketCategory = null, ticketLabel = null }) => {
    const funnelReference = getFunnelReference(ticketCategory);
    const ctaUrl = generateWhatsappUrl(
      whatsappDestination,
      buildFestivalWhatsappMessage(data.whatsapp.message, ticketLabel, funnelReference),
    );
    const trackingBase = {
      page_url: eventContext.page_url,
      page_path: eventContext.page_path,
      cta_text: ctaText,
      cta_location: ctaLocation,
      ticket_category: ticketCategory,
      funnel_reference: funnelReference,
      related_service: RELATED_SERVICE,
      ...getUtmPayload(),
    };

    pushDataLayer('cta_click', {
      ...trackingBase,
      cta_url: ctaUrl,
      cta_type: 'whatsapp',
    });

    const deduplicationKey = `${WHATSAPP_DEDUP_PREFIX}:${ctaLocation}:${ticketCategory || 'none'}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(deduplicationKey) !== 'true') {
      pushDataLayer('click_whatsapp', {
        ...trackingBase,
        whatsapp_destination: whatsappDestination,
        deduplication_scope: 'session_cta_location_ticket_category',
      });
      window.sessionStorage.setItem(deduplicationKey, 'true');
    }

    return ctaUrl;
  };

  const ctaProps = ({ location, text, ticket = null }) => {
    const ticketCategory = ticket?.id || null;

    return {
      href: trackingWhatsappUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'festival-button',
      onClick: (event) => {
        const ctaUrl = trackWhatsappClick({
          ctaLocation: location,
          ctaText: text,
          ticketCategory,
          ticketLabel: ticket?.name || null,
        });
        event.currentTarget.href = ctaUrl;
      },
      'data-event-id': data.id,
      'data-event-name': data.name,
      'data-event-type': data.type,
      'data-event-edition': data.year,
      'data-event-date': data.dates,
      'data-event-status': data.status,
      'data-cta-location': location,
      'data-cta-type': 'whatsapp',
      'data-ticket-category': ticket?.id || '',
      'data-ticket-label': ticket?.name || '',
      'data-related-service': RELATED_SERVICE,
    };
  };

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
          <a {...ctaProps({ location: 'hero', text: data.hero.cta })}>{data.hero.cta}</a>
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
                <a
                  {...ctaProps({
                    location: 'tickets',
                    text: `Consultar ${ticket.name}`,
                    ticket,
                  })}
                >
                  Consultar {ticket.name}
                </a>
              </article>
            ))}
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
          <a {...ctaProps({ location: 'final', text: 'Escribir por WhatsApp' })}>Escribir por WhatsApp</a>
        </div>
      </section>
    </main>
  );
}

export default App;
