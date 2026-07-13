import { useEffect, useMemo, useRef, useState } from 'react';
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
  general: 'GEN',
  'congreso-festival-completo': 'COMP',
  'solo-congreso': 'CONG',
  'solo-festival': 'FEST',
  'diplomado-inmersivo': 'DIP',
};
const FESTIVAL_PACKAGE_IDS = ['congreso-festival-completo', 'solo-congreso', 'solo-festival'];
const TRAINING_PACKAGE_IDS = ['diplomado-inmersivo'];

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

const formatTicketPrice = ({ amount, currency }) => {
  const formattedAmount = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === 'ARS' ? `$${formattedAmount} ARS` : `${currency} ${formattedAmount}`;
};

function CommercialStageNote({ stage }) {
  if (!stage) return null;

  return (
    <div className="festival-ticket__commercial-stage">
      <strong>{stage.label}</strong>
      <span>{stage.validity}</span>
      <span>{stage.nextStageStarts}</span>
      <span>
        Próximo precio de {stage.nextStage}: {formatTicketPrice(stage.nextPrice)}
      </span>
    </div>
  );
}

function DetailsModal({ ticket, onClose, ctaProps }) {
  const closeButtonRef = useRef(null);
  const titleId = ticket ? `package-modal-title-${ticket.id}` : undefined;

  useEffect(() => {
    if (!ticket) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ticket, onClose]);

  if (!ticket) return null;

  return (
    <div
      className="festival-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="festival-modal__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button
          type="button"
          className="festival-modal__x"
          aria-label="Cerrar detalles"
          onClick={onClose}
          ref={closeButtonRef}
        >
          ×
        </button>
        <p className="festival-ticket__badge">{ticket.badge || 'Detalles'}</p>
        <h2 id={titleId}>{ticket.name}</h2>
        <p className="festival-modal__period">{ticket.period}</p>
        <strong>{formatTicketPrice(ticket.price)}</strong>
        <p>{ticket.description}</p>
        <div className="festival-modal__grid">
          <div>
            <h3>Incluye</h3>
            <ul>
              {ticket.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>No incluye</h3>
            <ul>
              {ticket.excludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <dl className="festival-modal__facts">
          <div>
            <dt>Alimentación</dt>
            <dd>{ticket.food}</dd>
          </div>
          <div>
            <dt>Estadía</dt>
            <dd>{ticket.accommodation}</dd>
          </div>
          <div>
            <dt>Qué traer</dt>
            <dd>{ticket.camping}</dd>
          </div>
        </dl>
        {ticket.note ? <p className="festival-ticket__note">{ticket.note}</p> : null}
        <div className="festival-modal__actions">
          <button type="button" className="festival-secondary-button" onClick={onClose}>
            Cerrar
          </button>
          <a {...ctaProps({ location: ticket.modalLocation, text: ticket.cta, ticket })}>{ticket.cta}</a>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      onToggle={(event) => {
        setIsOpen(event.currentTarget.open);
      }}
    >
      <summary aria-expanded={isOpen}>{item.question}</summary>
      <p>{item.answer}</p>
    </details>
  );
}

function App() {
  const data = festivalData;
  const [selectedTicket, setSelectedTicket] = useState(null);
  const lastDetailsButtonRef = useRef(null);
  const eventContext = useMemo(() => getFestivalContext(data), [data]);
  const whatsappDestination = data.whatsapp.number || OFFICIAL_WHATSAPP_NUMBER;
  const trackingWhatsappUrl = getWhatsappTrackingUrl(whatsappDestination);
  const festivalTickets = data.tickets
    .filter((ticket) => FESTIVAL_PACKAGE_IDS.includes(ticket.id))
    .map((ticket) => ({ ...ticket, modalLocation: 'tickets_modal' }));
  const trainingTickets = data.tickets
    .filter((ticket) => TRAINING_PACKAGE_IDS.includes(ticket.id))
    .map((ticket) => ({ ...ticket, modalLocation: 'training_modal' }));

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

  const openDetails = (ticket, event) => {
    lastDetailsButtonRef.current = event.currentTarget;
    setSelectedTicket(ticket);
  };

  const closeDetails = () => {
    setSelectedTicket(null);
    window.requestAnimationFrame(() => {
      lastDetailsButtonRef.current?.focus();
    });
  };

  const renderFestivalCard = (ticket) => (
    <article
      className={`festival-ticket festival-ticket--event ${ticket.recommended ? 'festival-ticket--featured' : ''}`}
      id={`ticket-${ticket.id}`}
      key={ticket.name}
    >
      {ticket.badge ? <p className="festival-ticket__badge">{ticket.badge}</p> : null}
      <h3>{ticket.name}</h3>
      <p className="festival-ticket__period">{ticket.period}</p>
      <strong>{formatTicketPrice(ticket.price)}</strong>
      <CommercialStageNote stage={ticket.commercialStage} />
      <p className="festival-ticket__audience">{ticket.audience}</p>
      <ul className="festival-ticket__includes">
        {ticket.summaryBenefits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="festival-ticket__actions">
        <button type="button" className="festival-secondary-button" onClick={(event) => openDetails(ticket, event)}>
          Ver detalles
        </button>
        <a
          {...ctaProps({
            location: 'tickets',
            text: ticket.cta,
            ticket,
          })}
        >
          {ticket.cta}
        </a>
      </div>
    </article>
  );

  const renderTrainingCard = (ticket) => (
    <article
      className={`festival-training-card ${ticket.recommended ? 'festival-training-card--featured' : ''}`}
      id={`ticket-${ticket.id}`}
      key={ticket.name}
    >
      <div className="festival-training-card__media" aria-hidden="true">
        <img src={ticket.image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="festival-training-card__body">
        {ticket.badge ? <p className="festival-ticket__badge">{ticket.badge}</p> : null}
        <h3>{ticket.name}</h3>
        <p className="festival-ticket__period">{ticket.period}</p>
        <strong>{formatTicketPrice(ticket.price)}</strong>
        <p className="festival-ticket__audience">{ticket.audience}</p>
        <ul className="festival-ticket__includes">
          {ticket.summaryBenefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="festival-ticket__actions">
          <button type="button" className="festival-secondary-button" onClick={(event) => openDetails(ticket, event)}>
            Ver detalles
          </button>
          <a
            {...ctaProps({
              location: 'training',
              text: ticket.cta,
              ticket,
            })}
          >
            {ticket.cta}
          </a>
        </div>
      </div>
    </article>
  );

  return (
    <main className="festival-page">
      <section className="festival-hero">
        <div className="festival-hero__media" aria-hidden="true">
            <img src="/festival/img/diplomado-fuego.webp" alt="" decoding="async" />
        </div>
        <div className="festival-hero__overlay" />
        <div className="festival-container festival-hero__content">
          <p className="festival-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="festival-hero__concept">{data.hero.subtitle}</p>
          <p className="festival-hero__description">{data.hero.description}</p>
          <p className="festival-hero__path">{data.hero.pathNote}</p>
          <div className="festival-hero__facts" aria-label="Datos principales del festival">
            <span>{data.dates}</span>
            <span>{data.location.short}</span>
          </div>
          <a {...ctaProps({ location: 'hero', text: data.hero.cta })}>{data.hero.cta}</a>
          <p className="festival-hero__status">Estado: borrador interno. Programa completo a anunciarse.</p>
        </div>
      </section>

      <section className="festival-section festival-section--about">
        <div className="festival-container festival-about">
          <div>
            <p className="festival-eyebrow">Qué es Ecos de la Tierra</p>
            <h2>{data.about.title}</h2>
            <p>{data.about.text}</p>
            <div className="festival-concepts" aria-label="Conceptos centrales">
              {data.about.concepts.map((concept) => (
                <span key={concept}>{concept}</span>
              ))}
            </div>
          </div>
          <figure className="festival-about__image">
            <img src={data.about.image.src} alt={data.about.image.alt} loading="lazy" decoding="async" />
            <figcaption>{data.about.image.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="festival-section festival-section--tickets" id="paquetes-congreso-festival">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Congreso Festival</p>
            <h2>Elegí cómo vivir Ecos de la Tierra</h2>
          </div>
          <div className="festival-grid festival-grid--tickets">
            {festivalTickets.map((ticket) => renderFestivalCard(ticket))}
          </div>
        </div>
      </section>

      <section className="festival-section festival-section--training" id="formaciones">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Formaciones</p>
            <h2>{data.trainingSection.title}</h2>
            <p>{data.trainingSection.text}</p>
          </div>
          <div className="festival-training-list">
            {trainingTickets.map((ticket) => renderTrainingCard(ticket))}
          </div>
        </div>
      </section>

      <section className="festival-section festival-section--essential">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Información esencial</p>
            <h2>{data.essentialInfo.title}</h2>
          </div>
          <div className="festival-essential-grid">
            {data.essentialInfo.items.map((item) => (
              <article className="festival-essential-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="festival-essential-note">{data.essentialInfo.note}</p>
        </div>
      </section>

      <section className="festival-section festival-section--venue">
        <div className="festival-container festival-venue-layout">
          <figure className="festival-venue-image">
            <img src={data.venue.image.src} alt={data.venue.image.alt} loading="lazy" decoding="async" />
            <figcaption>{data.venue.image.caption}</figcaption>
          </figure>
          <div>
            <p className="festival-eyebrow">EcoCentro Madre Selva</p>
            <h2>{data.venue.title}</h2>
            <p>{data.venue.text}</p>
            <p className="festival-venue-location">{data.location.short}</p>
          </div>
        </div>
      </section>

      <section className="festival-section">
        <div className="festival-container">
          <div className="festival-section__header">
            <p className="festival-eyebrow">Preguntas frecuentes</p>
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="festival-faq">
            {data.faq.map((item) => (
              <FaqItem item={item} key={item.question} />
            ))}
          </div>
        </div>
      </section>

      <section className="festival-final">
        <div className="festival-container festival-narrow">
          <p className="festival-eyebrow">Madre Selva · Misiones</p>
          <h2>{data.finalCta.title}</h2>
          <p>{data.finalCta.text}</p>
          <a {...ctaProps({ location: 'final', text: data.finalCta.cta })}>{data.finalCta.cta}</a>
        </div>
      </section>
      <DetailsModal ticket={selectedTicket} onClose={closeDetails} ctaProps={ctaProps} />
    </main>
  );
}

export default App;
