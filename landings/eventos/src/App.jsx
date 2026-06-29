import { useEffect, useMemo, useRef } from 'react';
import { events } from './data/events.config.js';
import EventHero from './components/EventHero.jsx';
import EventDetails from './components/EventDetails.jsx';
import EventBenefits from './components/EventBenefits.jsx';
import EventAgenda from './components/EventAgenda.jsx';
import EventFacilitators from './components/EventFacilitators.jsx';
import EventFAQ from './components/EventFAQ.jsx';
import EventCTA from './components/EventCTA.jsx';
import EventStatus from './components/EventStatus.jsx';
import SEOHelmet from './components/SEOHelmet.jsx';
import { captureUtmParams, appendUtmParamsToUrl } from './utils/utm.js';
import { publishEventPageContext } from './utils/eventContext.js';

const BASE_SEGMENT = 'eventos';

const getSlugFromPathname = () => {
  if (typeof window === 'undefined') return '';

  const segments = window.location.pathname.split('/').filter(Boolean);
  const baseIndex = segments.indexOf(BASE_SEGMENT);

  return baseIndex >= 0 ? segments[baseIndex + 1] || '' : '';
};

const findEventBySlug = (slug) => events.find((event) => event.slug === slug);

const App = () => {
  const contextPublishedRef = useRef(false);
  const slug = getSlugFromPathname();
  const event = useMemo(() => findEventBySlug(slug), [slug]);
  const isUnavailable = !event || event.status === 'draft';
  const registrationHref =
    event?.status === 'open' ? appendUtmParamsToUrl(event.registration_url) : '';

  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    if (!event || contextPublishedRef.current) return;

    publishEventPageContext(event);
    contextPublishedRef.current = true;
  }, [event]);

  if (isUnavailable) {
    return (
      <div className="eventos-app">
        <SEOHelmet event={event} fallbackTitle="Evento no disponible" noindex />
        <EventStatus title="Evento no disponible" message="La pagina solicitada no esta disponible." />
      </div>
    );
  }

  return (
    <div className="eventos-app">
      <SEOHelmet event={event} />
      <EventHero event={event} registrationHref={registrationHref} />
      <main>
        <EventDetails event={event} />
        <EventBenefits event={event} registrationHref={registrationHref} />
        <EventAgenda event={event} registrationHref={registrationHref} />
        <EventFacilitators event={event} />
        <EventFAQ event={event} />
        <section className="eventos-final">
          {event.status === 'closed' ? (
            <EventStatus title="Inscripciones cerradas" message="Este evento ya no recibe inscripciones." />
          ) : null}
          {event.status === 'finished' ? (
            <EventStatus title="Este evento ya finalizó" message="La actividad ya fue realizada." />
          ) : null}
          {event.status === 'open' ? (
            <EventCTA event={event} location="final" registrationHref={registrationHref} />
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default App;
