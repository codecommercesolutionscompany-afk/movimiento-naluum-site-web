import { createElement, useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Home,
  MapPin,
  Plus,
  Sprout,
  Tent,
  Utensils,
  Wifi,
  XCircle,
} from 'lucide-react';
import SEOHelmet from './SEOHelmet.jsx';
const heroImage = '/voluntariado-otono-invierno/images/voluntariado-grupo-hero.jpg';
const cultivationImage = '/voluntariado-otono-invierno/images/voluntariado-cultivos.jpg';
const workImage = '/voluntariado-otono-invierno/images/voluntariado-trabajo.jpg';
import './voluntariado_landing.scss';

const SITE_URL = 'https://movimientonaluum.org';
const LANDING_URL = `${SITE_URL}/voluntariado-otono-invierno/`;
const socialSeoImage = new URL(
  '/voluntariado-otono-invierno/voluntariado-madre-selva-social.png',
  SITE_URL
).toString();
const SEO_TITLE = 'Voluntariado en Madre Selva | Otoño–Invierno 2026';
const SEO_DESCRIPTION =
  'Viví una semana de voluntariado en Madre Selva, Misiones. Elegí una fecha disponible y avanzá con tu reserva por WhatsApp.';
const SEO_OG_DESCRIPTION =
  'Viví una experiencia de voluntariado comunitario en contacto con la naturaleza. Elegí una semana disponible y reservá tu lugar por WhatsApp.';
const SEO_TWITTER_DESCRIPTION =
  'Elegí una semana disponible y avanzá con tu reserva para vivir una experiencia de voluntariado comunitario en Madre Selva.';
const SEO_IMAGE_ALT = 'Voluntariado Otoño–Invierno en Madre Selva, Misiones';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'voluntariado_utm_params';
const FIRST_TOUCH_STORAGE_KEY = 'voluntariado_first_touch_timestamp';
const FUNNEL_REFERENCE_KEY = 'voluntariado_funnel_reference:inscripcion';
const WHATSAPP_DEDUP_PREFIX = 'voluntariado_whatsapp_dedup';
const WHATSAPP_NUMBER = '5493764257777';
const WHATSAPP_DESTINATION = 'madre_selva_whatsapp';
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PUBLIC_PRICING = {
  amount: 133333,
  currency: 'ARS',
};
const TRACKING_CONTEXT = {
  landing_name: 'voluntariado-otono-invierno',
  related_service: 'voluntariado',
  event_id: 'voluntariado-2026',
  event_name: 'Voluntariado Otoño-Invierno',
  event_type: 'voluntariado',
  event_edition: 2026,
  event_status: 'published',
};

const isPendingUrl = (url = '') => /^PENDIENTE_/i.test(String(url).trim());
const getTargetProps = (url) =>
  url && !isPendingUrl(url) && !String(url).startsWith('#')
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      ({ children, initial, whileInView, viewport, transition, animate, exit, ...props }) =>
        createElement(tag, props, children),
  },
);

const AnimatePresence = ({ children }) => children;

const formatPublicPrice = () =>
  `$${new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(PUBLIC_PRICING.amount)} ${PUBLIC_PRICING.currency}`;

let pageContextPushed = false;

const readSessionValue = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeSessionValue = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Tracking must never block navigation when storage is unavailable.
  }
};

const getStoredUtms = () => {
  const stored = readSessionValue(UTM_STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored);
    return UTM_KEYS.reduce((params, key) => {
      if (parsed?.[key]) params[key] = parsed[key];
      return params;
    }, {});
  } catch {
    return {};
  }
};

const getMergedUtms = () => {
  if (typeof window === 'undefined') return {};
  const currentParams = new URLSearchParams(window.location.search);
  const storedParams = getStoredUtms();

  return UTM_KEYS.reduce((params, key) => {
    const currentValue = currentParams.get(key);
    if (currentValue) params[key] = currentValue;
    else if (storedParams[key]) params[key] = storedParams[key];
    return params;
  }, {});
};

const persistUtms = () => {
  const merged = getMergedUtms();
  if (Object.keys(merged).length > 0) writeSessionValue(UTM_STORAGE_KEY, JSON.stringify(merged));
  return merged;
};

const getFirstTouchTimestamp = () => {
  const existing = readSessionValue(FIRST_TOUCH_STORAGE_KEY);
  if (existing) return existing;
  const timestamp = new Date().toISOString();
  writeSessionValue(FIRST_TOUCH_STORAGE_KEY, timestamp);
  return timestamp;
};

const generateReferenceCode = () => {
  const values = new Uint32Array(4);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * 0xffffffff);
    }
  }
  return Array.from(values, (value) => REFERENCE_ALPHABET[value % REFERENCE_ALPHABET.length]).join('');
};

const getFunnelReference = () => {
  const existing = readSessionValue(FUNNEL_REFERENCE_KEY);
  if (existing) return existing;
  const reference = `VOL-INS-${generateReferenceCode()}`;
  writeSessionValue(FUNNEL_REFERENCE_KEY, reference);
  return reference;
};

const pushDataLayer = (payload) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const getTrackingAttributes = (
  ctaLocation,
  ctaType,
  volunteerWeek = 'sin_seleccionar',
  availabilityStatus = 'open',
) => ({
  'data-landing-name': TRACKING_CONTEXT.landing_name,
  'data-related-service': TRACKING_CONTEXT.related_service,
  'data-event-id': TRACKING_CONTEXT.event_id,
  'data-event-name': TRACKING_CONTEXT.event_name,
  'data-event-type': TRACKING_CONTEXT.event_type,
  'data-event-edition': String(TRACKING_CONTEXT.event_edition),
  'data-event-status': TRACKING_CONTEXT.event_status,
  'data-cta-location': ctaLocation,
  'data-cta-type': ctaType,
  'data-volunteer-week': volunteerWeek,
  'data-availability-status': availabilityStatus,
});

const fadeInUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.72, ease: [0.165, 0.84, 0.44, 1] },
};

const quickFacts = [
  { icon: MapPin, label: 'Lugar', value: 'Madre Selva - Colonia Para\u00edso, El Soberbio, Misiones, Argentina' },
  { icon: Home, label: 'Modalidad', value: 'Presencial' },
];

const tasks = [
  'Podas',
  'Apoyo en agroflorestas',
  'Trabajo en huerta',
  'Mantenimiento del entorno',
  'Ayuda en sistemas que se están creando',
  'Tareas comunitarias',
  'Apoyo en actividades del proyecto según las necesidades reales de cada semana',
];

const cohorts = [
  {
    name: 'Semana 1',
    dates: 'Del lunes 6 al sábado 11 de julio de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_july_06',
    selectedWeek: '2026-07-06',
    normalizedWeek: 'julio_06_2026',
    displayDates: '6 al 11 de julio de 2026',
    availabilityStatus: 'closed',
  },
  {
    name: 'Semana 2',
    dates: 'Del lunes 20 al sábado 25 de julio de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_july_20',
    selectedWeek: '2026-07-20',
    normalizedWeek: 'julio_20_2026',
    displayDates: '20 al 25 de julio de 2026',
    availabilityStatus: 'open',
  },
  {
    name: 'Semana 3',
    dates: 'Del lunes 31 de agosto al sábado 5 de septiembre de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_august_31',
    selectedWeek: '2026-08-31',
    normalizedWeek: 'agosto_31_2026',
    displayDates: '31 de agosto al 5 de septiembre de 2026',
    availabilityStatus: 'open',
  },
  {
    name: 'Semana 4',
    dates: 'Del lunes 28 de septiembre al sábado 3 de octubre de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_september_28',
    selectedWeek: '2026-09-28',
    normalizedWeek: 'septiembre_28_2026',
    displayDates: '28 de septiembre al 3 de octubre de 2026',
    availabilityStatus: 'open',
  },
  {
    name: 'Semana 5',
    dates: 'Del lunes 26 al sábado 31 de octubre de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_october_26',
    selectedWeek: '2026-10-26',
    normalizedWeek: 'octubre_26_2026',
    displayDates: '26 al 31 de octubre de 2026',
    availabilityStatus: 'open',
  },
  {
    name: 'Semana 6',
    dates: 'Del lunes 30 de noviembre al sábado 5 de diciembre de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_november_30',
    selectedWeek: '2026-11-30',
    normalizedWeek: 'noviembre_30_2026',
    displayDates: '30 de noviembre al 5 de diciembre de 2026',
    availabilityStatus: 'open',
  },
];

const OPEN_COHORT_COUNT = cohorts.filter((cohort) => cohort.availabilityStatus === 'open').length;

const lodgingNotes = [
  'El espacio de camping está incluido en el aporte.',
  'Cada participante debe traer obligatoriamente su propia carpa, bolsa de dormir, abrigo suficiente y elementos personales para acampar.',
  'También existen yurtas opcionales por $15.000 ARS por noche. Este alojamiento tiene un costo adicional y está sujeto a disponibilidad.',
  `La yurta no está incluida en el aporte semanal de ${formatPublicPrice()} y debe consultarse después de la aceptación o durante el proceso correspondiente.`,
];

const scheduleNotes = [
  'Son seis horas diarias de participación activa.',
  'Las tareas pueden implicar actividad física y dependen del clima y de las prioridades del territorio.',
  'Se requiere puntualidad, compromiso y disposición para integrarse a la dinámica cotidiana.',
  'Las tareas se asignan según necesidades reales del proyecto; no se garantiza elegir solamente las tareas preferidas.',
  'El sábado no hay bloque de colaboración. Es el día de cierre y salida, prevista para las 15:30. Ese día están incluidos el desayuno y el almuerzo.',
];

const cancellationPolicy =
  'El aporte puede devolverse si la cancelación se informa con al menos 10 días de anticipación respecto de la fecha de inicio de la semana elegida. Dentro de los últimos 10 días, el aporte no es reembolsable.';

const processNotes = [
  'Completar el formulario no garantiza el ingreso.',
  'No debés realizar ningún pago antes de recibir la confirmación de aceptación de Madre Selva.',
];

const applicationSteps = [
  'Elegís la semana dentro del formulario y enviás tu postulación.',
  'Revisamos tu perfil, motivación y afinidad con la experiencia.',
  'Te contactamos para una breve entrevista.',
  'Madre Selva confirma si tu aplicación fue aceptada.',
  'Solo después de ser aceptado abonás el aporte para confirmar tu lugar.',
];

const PublicPricing = ({ className = '', supportText = '' }) => (
  <div className={`voi-price-summary ${className}`.trim()}>
    <span className="voi-price-summary__label">Aporte por semana</span>
    <strong>{formatPublicPrice()}</strong>
    {supportText ? <p>{supportText}</p> : null}
  </div>
);

const faqs = [
  {
    q: '¿El voluntariado es gratuito?',
    a: `No es gratuito. El aporte es de ${formatPublicPrice()} por persona y por la semana completa.`,
  },
  {
    q: '¿Qué incluye el aporte?',
    a: 'Incluye estadía en Madre Selva, espacio de camping, tres comidas diarias, comidas desde el día de llegada, desayuno y almuerzo el sábado de salida, espacios compartidos, internet, biblioteca, yoga, actividades recreativas, arte programado, aprendizaje práctico, participación en tareas reales y vida comunitaria.',
  },
  {
    q: '¿Cuándo se paga?',
    a: 'El aporte se abona únicamente después de que Madre Selva confirma la aceptación. No debés realizar ningún pago antes de recibir esa confirmación.',
  },
  {
    q: '¿Aplicar garantiza el ingreso?',
    a: 'No. Completar el formulario no garantiza el ingreso. Madre Selva revisa perfil, disponibilidad y afinidad con la experiencia antes de confirmar una aceptación.',
  },
  {
    q: '¿Qué tareas se realizan?',
    a: 'Las tareas pueden incluir podas, apoyo en agroflorestas, trabajo en huerta, mantenimiento, tareas comunitarias y ayuda en sistemas que se están creando. Pueden implicar actividad física y variar según clima, prioridades y necesidades reales del territorio.',
  },
  {
    q: '¿Puedo elegir únicamente las tareas que prefiero?',
    a: 'No. Las tareas se asignan según necesidades reales del proyecto y no se garantiza elegir solamente las tareas preferidas.',
  },
  {
    q: '¿Cuál es el horario de colaboración?',
    a: 'La colaboración se realiza de lunes a viernes, de 07:00 a 13:00. Son seis horas diarias y se requiere puntualidad y participación activa.',
  },
  {
    q: '¿Se trabaja el sábado?',
    a: 'No. El sábado es día de cierre y salida; no hay bloque de colaboración. La salida está prevista para las 15:30 e incluye desayuno y almuerzo.',
  },
  {
    q: '¿Dónde se duerme?',
    a: 'La base incluida es el espacio de camping en Madre Selva. Cada participante duerme en su propia carpa.',
  },
  {
    q: '¿Debo llevar mi propia carpa?',
    a: 'Sí. Cada participante debe traer obligatoriamente su propia carpa, bolsa de dormir, abrigo suficiente y elementos personales para acampar.',
  },
  {
    q: '¿Existe alojamiento en yurta?',
    a: `También existen yurtas opcionales por $15.000 ARS por noche. Este alojamiento tiene un costo adicional, no está incluido en el aporte semanal de ${formatPublicPrice()}, está sujeto a disponibilidad y debe consultarse después de la aceptación o durante el proceso correspondiente.`,
  },
  {
    q: '¿Cuántas comidas están incluidas?',
    a: 'Están incluidas tres comidas diarias durante la estadía, comidas desde el día de llegada y desayuno y almuerzo el sábado de salida.',
  },
  {
    q: '¿Cuántos cupos hay?',
    a: 'Hay hasta 10 personas por semana.',
  },
  {
    q: '¿Qué sucede si cancelo?',
    a: cancellationPolicy,
  },
  {
    q: '¿Es un curso formal?',
    a: 'No. Es una experiencia de aprendizaje práctico y participación activa dentro del proyecto. No se plantea como curso formal ni certificación.',
  },
  {
    q: '¿Es turismo, retiro o alojamiento gratuito?',
    a: 'No. No es turismo, hospedaje gratuito, retiro espiritual ni una experiencia pasiva. Es una propuesta de voluntariado comunitario con participación activa y responsabilidades concretas.',
  },
];

const positiveFilters = [
  'Personas que quieren vivir una experiencia real en Madre Selva.',
  'Personas con ganas de colaborar con tareas concretas.',
  'Personas que buscan aprender desde la práctica.',
  'Personas que pueden adaptarse a una estadía simple, en contacto directo con la naturaleza.',
  'Personas que valoran la vida comunitaria, la naturaleza y el trabajo compartido.',
  'Personas con disposición para participar de lunes a viernes, de 07:00 a 13:00.',
  'Personas que quieren integrarse a una dinámica cotidiana con responsabilidad y respeto.',
  'Personas que entienden el aporte económico como parte del sostenimiento de la experiencia.',
];

const negativeFilters = [
  'Personas que buscan turismo barato.',
  'Personas que buscan hospedaje gratuito.',
  'Personas que buscan una experiencia pasiva.',
  'Personas que quieren llegar sin horarios ni compromiso.',
  'Personas que quieren elegir únicamente las tareas que prefieren.',
  'Personas que buscan un retiro espiritual.',
  'Personas que buscan un curso formal con certificación.',
  'Personas que quieren consumir la experiencia sin aportar al proyecto.',
];

const IconList = ({ items, icon: Icon = CheckCircle2 }) => (
  <ul className="voi-check-list">
    {items.map((item) => (
      <li key={item}>
        <Icon size={19} aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const VoluntariadoLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showDeferredContent, setShowDeferredContent] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timeoutId;

    const reveal = () => {
      setShowDeferredContent(true);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('pointerdown', reveal);
      window.removeEventListener('keydown', reveal);
      window.removeEventListener('touchstart', reveal);
      window.clearTimeout(timeoutId);
    };

    timeoutId = window.setTimeout(reveal, 4200);
    window.addEventListener('scroll', reveal, { passive: true, once: true });
    window.addEventListener('pointerdown', reveal, { passive: true, once: true });
    window.addEventListener('keydown', reveal, { once: true });
    window.addEventListener('touchstart', reveal, { passive: true, once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('pointerdown', reveal);
      window.removeEventListener('keydown', reveal);
      window.removeEventListener('touchstart', reveal);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return undefined;

    const scrollId = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ block: 'start' });
    }, 150);

    return () => window.clearTimeout(scrollId);
  }, []);

  useEffect(() => {
    persistUtms();
    const firstTouchTimestamp = getFirstTouchTimestamp();

    if (!pageContextPushed) {
      pageContextPushed = true;
      pushDataLayer({
        event: 'event_page_context',
        page_url: window.location.href,
        page_path: window.location.pathname,
        ...TRACKING_CONTEXT,
        ...getMergedUtms(),
        first_touch_timestamp: firstTouchTimestamp,
      });
    }
  }, []);

  const chooseCohortHref = '#fechas';

  const getCommonClickPayload = (event, ctaLocation, ctaType, cohort = null) => ({
    page_url: window.location.href,
    page_path: window.location.pathname,
    ...TRACKING_CONTEXT,
    ...getMergedUtms(),
    first_touch_timestamp: getFirstTouchTimestamp(),
    cta_text: event?.currentTarget?.textContent?.trim() || '',
    cta_location: ctaLocation,
    cta_type: ctaType,
    ticket_category: 'inscripcion',
    volunteer_week: cohort?.normalizedWeek || 'sin_seleccionar',
    volunteer_dates: cohort?.displayDates || 'sin_seleccionar',
    volunteer_schedule: 'lunes_a_viernes_07_00_13_00',
    availability_status: cohort?.availabilityStatus || 'open',
  });

  const handleInternalClick = (event, ctaLocation) => {
    pushDataLayer({
      event: 'cta_click',
      ...getCommonClickPayload(event, ctaLocation, 'internal_anchor'),
    });
  };

  const buildWhatsappUrl = (cohort = null) => {
    const funnelReference = getFunnelReference();
    const message = [
      'Hola, estuve viendo la propuesta de Voluntariado de Madre Selva y quiero avanzar con mi reserva.',
      'Ya vi que el aporte es de $133.333 ARS por persona y semana.',
      'Quiero confirmar disponibilidad y conocer los pasos para reservar mi lugar.',
      `Referencia: ${funnelReference}`,
    ].join('\n\n');

    const selectedWeekMessage = cohort
      ? [
          'Hola, estuve viendo la propuesta de Voluntariado de Madre Selva y quiero avanzar con mi reserva.',
          `Semana elegida: ${cohort.displayDates}.`,
          'Ya vi que el aporte es de $133.333 ARS por persona y semana.',
          'Quiero confirmar disponibilidad y conocer los pasos para reservar mi lugar.',
          `Referencia: ${funnelReference}`,
        ].join('\n\n')
      : message;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(selectedWeekMessage)}`;
  };

  const handleWhatsappClick = (event, ctaLocation, cohort = null) => {
    const funnelReference = getFunnelReference();
    const payload = {
      ...getCommonClickPayload(event, ctaLocation, 'whatsapp', cohort),
      funnel_reference: funnelReference,
      volunteer_week: cohort?.normalizedWeek || 'sin_seleccionar',
      volunteer_dates: cohort?.displayDates || 'multiple_open',
      availability_status: cohort?.availabilityStatus || 'multiple_open',
      whatsapp_destination: WHATSAPP_DESTINATION,
      deduplication_scope: 'session_cta_location_volunteer_week',
      intent: 'reservation',
      funnel_stage: 'high_intent',
    };

    event?.currentTarget?.setAttribute('data-funnel-reference', funnelReference);
    pushDataLayer({ event: 'cta_click', ...payload });

    const deduplicationKey = `${WHATSAPP_DEDUP_PREFIX}:${ctaLocation}:${cohort?.normalizedWeek || 'sin_seleccionar'}`;
    if (!readSessionValue(deduplicationKey)) {
      writeSessionValue(deduplicationKey, '1');
      pushDataLayer({ event: 'click_whatsapp', ...payload });
    }

    return buildWhatsappUrl(cohort);
  };

  return (
    <div className="voi-landing">
      <SEOHelmet
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        ogDescription={SEO_OG_DESCRIPTION}
        twitterDescription={SEO_TWITTER_DESCRIPTION}
        image={socialSeoImage}
        imageAlt={SEO_IMAGE_ALT}
        url={LANDING_URL}
      />

      <header className={`voi-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="voi-header__wrapper">
          <a href={SITE_URL} className="nav-logo">
            <span className="nav-logo__text">MADRE SELVA</span>
          </a>
          <div className="voi-header__actions">
            <a
              className="btnPrimary btnPrimary--small"
              href={buildWhatsappUrl()}
              onClick={(event) => handleWhatsappClick(event, 'header')}
              {...getTargetProps(WHATSAPP_NUMBER)}
              {...getTrackingAttributes('header', 'whatsapp', 'sin_seleccionar', 'multiple_open')}
              data-available-weeks-count={OPEN_COHORT_COUNT}
            >
              Quiero reservar mi lugar
            </a>
          </div>
        </div>
      </header>

      <section className="voi-hero">
        <div className="voi-hero__bg">
          <img
            src={heroImage}
            alt="Grupo de personas compartiendo una experiencia en la naturaleza de Madre Selva"
            loading="eager"
            fetchPriority="high"
            width="2000"
            height="3556"
          />
        </div>
        <div className="voi-hero__overlay" />

        <div className="voi-hero__content">
          <motion.span className="voi-badge" {...fadeInUp}>
            Voluntariado comunitario
          </motion.span>
          <motion.h1 className="voi-title--hero" {...fadeInUp} transition={{ delay: 0.08 }}>
            Voluntariado Otoño–Invierno
          </motion.h1>
          <motion.p className="voi-hero__subtitle" {...fadeInUp} transition={{ delay: 0.16 }}>
            Una experiencia de voluntariado comunitario en Madre Selva para colaborar con actividades concretas del proyecto,
            vivir en comunidad y aprender desde la práctica en contacto con la naturaleza.
          </motion.p>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <PublicPricing
              className="voi-price-summary--hero"
              supportText="Incluye camping, tres comidas diarias y participación en las actividades de la semana."
            />
          </motion.div>
          <motion.p className="voi-hero__support" {...fadeInUp} transition={{ delay: 0.24 }}>
            Durante la estadía vas a participar en tareas reales del territorio, como podas, agrofloresta, huerta,
            mantenimiento y sistemas en desarrollo. La experiencia incluye estadía, tres comidas diarias, espacios
            compartidos, internet, biblioteca, yoga, actividades recreativas y arte programado.
          </motion.p>
          <motion.div className="voi-hero__actions" {...fadeInUp} transition={{ delay: 0.32 }}>
            <a
              className="btnPrimary"
              href={buildWhatsappUrl()}
              {...getTargetProps(WHATSAPP_NUMBER)}
              {...getTrackingAttributes('hero', 'whatsapp', 'sin_seleccionar', 'multiple_open')}
              onClick={(event) => handleWhatsappClick(event, 'hero')}
            >
              Quiero reservar mi lugar
              <ArrowRight size={18} />
            </a>
            <a
              className="btnOutlineLight"
              href={chooseCohortHref}
              {...getTrackingAttributes('hero_dates', 'internal_anchor')}
              onClick={(event) => handleInternalClick(event, 'hero_dates')}
            >
              Ver semanas disponibles
              <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div className="voi-quick-grid" {...fadeInUp} transition={{ delay: 0.4 }}>
            {quickFacts.map(({ icon: Icon, label, value }) => (
              <div className="voi-quick-item" key={label}>
                <Icon size={21} aria-hidden="true" />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {showDeferredContent ? (
      <>
      <section className="voi-intro container">
        <motion.div className="section-intro section-intro--left" {...fadeInUp}>
          <span className="section-label">Qué es</span>
          <h2 className="editorial-title">Participación activa en una etapa concreta de Madre Selva.</h2>
        </motion.div>
        <motion.div className="voi-text-flow" {...fadeInUp}>
          <p>
            El Voluntariado Otoño–Invierno es una experiencia presencial de participación activa en Madre Selva.
          </p>
          <p>
            Durante la estadía, las personas voluntarias colaboran en tareas reales que el proyecto necesita en esta
            etapa, como podas, apoyo en agroflorestas, huerta, mantenimiento y ayuda en sistemas que se están creando.
          </p>
            <p>
              A cambio de esa participación, Madre Selva ofrece estadía, comidas, espacios compartidos, conexión a
              internet, biblioteca, actividades de bienestar, recreación y propuestas artísticas programadas.
            </p>
          <p className="voi-highlight-line">La base del programa es simple: colaborar, convivir y aprender desde la práctica.</p>
        </motion.div>
      </section>

      <section className="voi-purpose">
        <div className="container voi-purpose__inner">
          <motion.div {...fadeInUp}>
            <span className="section-label">Propósito</span>
            <h2 className="editorial-title">Una experiencia comunitaria, clara y con responsabilidad compartida.</h2>
          </motion.div>
          <motion.div className="voi-purpose__copy" {...fadeInUp}>
            <p>
              El propósito del Voluntariado Otoño–Invierno es generar una experiencia comunitaria consciente entre
              Madre Selva y las personas participantes.
            </p>
            <p>
              La propuesta consiste en colaborar con actividades concretas del proyecto a cambio de estadía, espacios de
              uso compartido, internet, tres comidas diarias, acceso a biblioteca, yoga, actividades recreativas, arte
              programado y aprendizaje constante desde la práctica.
            </p>
            <p>
              Es una experiencia para participar activamente en la vida cotidiana del territorio, aportar al desarrollo
              de Madre Selva y aprender haciendo dentro de un entorno natural, comunitario y vivo.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="voi-stats-grid container">
        <motion.div className="section-intro" {...fadeInUp}>
          <span className="section-label">Qué incluye</span>
          <h2 className="editorial-title">Condiciones concretas para sostener la experiencia.</h2>
          <p className="editorial-lead">
            La propuesta integra estadía, alimentación, espacios compartidos y participación real dentro del proyecto.
          </p>
        </motion.div>

        <div className="stats-container">
          {[
            { icon: Tent, value: 'Alojamiento y convivencia', label: 'Base compartida', desc: 'Estadía en Madre Selva, camping, espacios compartidos y vida comunitaria en contacto con la naturaleza.' },
            { icon: Utensils, value: 'Alimentación', label: 'Comidas incluidas', desc: 'Tres comidas diarias desde la llegada, más desayuno y almuerzo el sábado de salida.' },
            { icon: Wifi, value: 'Servicios y bienestar', label: 'Recursos disponibles', desc: 'Internet, biblioteca, yoga y actividades recreativas para acompañar la experiencia.' },
            { icon: Sprout, value: 'Experiencia y aprendizaje', label: 'Práctica real', desc: 'Arte programado, aprendizaje práctico y participación en actividades concretas del proyecto.' },
          ].map(({ icon: Icon, value, label, desc }, index) => (
            <motion.article className="stat-card" key={label} {...fadeInUp} transition={{ delay: index * 0.08 }}>
              <div className="stat-icon">
                <Icon size={28} />
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
              <p className="stat-desc">{desc}</p>
            </motion.article>
          ))}
        </div>

        </section>

      <main className="voi-main-layout container">
        <div className="content-area">
          <motion.section className="voi-section-block" {...fadeInUp}>
            <span className="section-label">Qué vas a hacer</span>
            <h2 className="editorial-title">Colaboración concreta con necesidades reales del territorio.</h2>
            <p className="editorial-lead">
              Durante el voluntariado vas a colaborar con actividades concretas que Madre Selva necesita sostener y
              desarrollar.
            </p>
            <div className="voi-task-grid">
              {tasks.map((task, index) => (
                <article className="task-card" key={task}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{task}</p>
                </article>
              ))}
            </div>
            <p className="axis-note">
              Las tareas se asignan según necesidades reales del proyecto, pueden implicar actividad física y no se
              garantiza elegir solamente las tareas preferidas.
            </p>
          </motion.section>





        </div>

        <aside className="sidebar-area">
          <motion.div
            className="booking-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Datos rápidos</span>
            <PublicPricing className="voi-price-summary--sidebar" />
            <p className="booking-price-note">El aporte contribuye a cubrir alimentación, estadía y logística durante la semana elegida.</p>
            <a
              className="btnPrimary btnPrimary--wide"
              href={buildWhatsappUrl()}
              {...getTargetProps(WHATSAPP_NUMBER)}
              {...getTrackingAttributes('investment_section', 'whatsapp', 'sin_seleccionar', 'multiple_open')}
              onClick={(event) => handleWhatsappClick(event, 'investment_section')}
            >
              Quiero avanzar con mi reserva
            </a>
            <p className="booking-note">
              El pago se realiza únicamente después de que Madre Selva confirme tu aceptación.
            </p>
          </motion.div>
        </aside>
      </main>

      <section className="voi-story container" aria-label="Trabajo y aprendizaje en Madre Selva">
        <article className="voi-story__card voi-story__card--image-first">
          <div className="voi-story__image-wrap">
            <img
              src={workImage}
              alt="Personas colaborando con tierra y herramientas en Madre Selva"
              loading="lazy"
              decoding="async"
              width="1400"
              height="2489"
            />
          </div>
          <div className="voi-story__copy">
            <span className="section-label">Trabajo compartido</span>
            <h2 className="editorial-title">Colaborar también es aprender a sostener lo real.</h2>
            <p>
              Las tareas se realizan en equipo, con herramientas, presencia y atención a las necesidades concretas del
              territorio.
            </p>
          </div>
        </article>
        <article className="voi-story__card voi-story__card--text-first">
          <div className="voi-story__copy">
            <span className="section-label">Contacto con la tierra</span>
            <h2 className="editorial-title">Una rutina cotidiana entre cultivos, cuidado y práctica.</h2>
            <p>
              La experiencia combina trabajo manual, observación y aprendizaje en contacto directo con los ciclos del
              espacio.
            </p>
          </div>
          <div className="voi-story__image-wrap">
            <img
              src={cultivationImage}
              alt="Grupo de personas compartiendo una experiencia en la naturaleza de Madre Selva"
              loading="lazy"
              decoding="async"
              width="2000"
              height="3556"
            />
          </div>
        </article>
      </section>

      <section className="container" style={{ marginBottom: '32px' }}>
        <motion.div className="voi-section-block" {...fadeInUp} style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 auto', maxWidth: '900px' }}>
            Cada jornada permite acercarse a prácticas reales vinculadas al cuidado del territorio, la agrofloresta,
            la huerta, la organización comunitaria, el arte, el bienestar y la vida en naturaleza.
          </p>
        </motion.div>
      </section>

      <section className="voi-split-row container" style={{ marginBottom: '80px', textAlign: 'center' }}>
        <motion.div className="voi-section-block voi-section-block--dark" {...fadeInUp}>
          <span className="section-label">Horario y dinámica</span>
          <h2 className="editorial-title" style={{ margin: '0 auto' }}>Horario de colaboración: de 07:00 a 13:00.</h2>
          <IconList items={scheduleNotes} />
        </motion.div>

        <motion.div className="voi-section-block" {...fadeInUp}>
          <span className="section-label">Alojamiento</span>
          <h2 className="editorial-title" style={{ margin: '0 auto' }}>Camping incluido y yurta opcional sujeta a disponibilidad.</h2>
          <IconList items={lodgingNotes} />
        </motion.div>
      </section>

      <section className="voi-cohorts container" id="fechas">
        <motion.div className="section-intro" {...fadeInUp}>
          <span className="section-label">Fechas disponibles</span>
          <h2 className="editorial-title">Elegí la semana que mejor se adapte a vos.</h2>
        </motion.div>

        <div className="voi-dates-list" role="radiogroup" aria-label="Semana de voluntariado de interés">
          {cohorts.map((cohort, index) => (
            <motion.div
              className={`voi-date-row voi-date-row--${cohort.availabilityStatus}`}
              key={cohort.name}
              {...fadeInUp}
              transition={{ delay: index * 0.05 }}
            >
              {cohort.availabilityStatus === 'open' ? (
                <label className="voi-date-row__option">
                  <input
                    type="radio"
                    name="voluntariado-cohort"
                    value={cohort.normalizedWeek}
                    checked={selectedCohort?.normalizedWeek === cohort.normalizedWeek}
                    onChange={() => setSelectedCohort(cohort)}
                    aria-label={`${cohort.name}: ${cohort.displayDates}`}
                  />
                  <span className="voi-date-row__status">Disponible</span>
                  <time dateTime={cohort.selectedWeek}>{cohort.displayDates}</time>
                </label>
              ) : (
                <div className="voi-date-row__closed" aria-disabled="true">
                  <span className="voi-date-row__status">Finalizada</span>
                  <time dateTime={cohort.selectedWeek}>{cohort.displayDates}</time>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="voi-dates-selection-status" aria-live="polite">
          {selectedCohort
            ? `Semana seleccionada: ${selectedCohort.displayDates}`
            : 'Elegí la semana que te interesa para avanzar con tu reserva.'}
        </p>

        <button
          className="btnPrimary btnPrimary--wide voi-dates-cta"
          type="button"
          disabled={!selectedCohort}
          onClick={(event) => {
            if (!selectedCohort) return;
            const whatsappUrl = handleWhatsappClick(event, 'dates_section', selectedCohort);
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          }}
          {...getTrackingAttributes(
            'dates_section',
            'whatsapp',
            selectedCohort?.normalizedWeek || 'sin_seleccionar',
            selectedCohort?.availabilityStatus || 'selection_required',
          )}
          data-available-weeks-count={OPEN_COHORT_COUNT}
        >
          Quiero reservar esta semana
          <ArrowRight size={18} />
        </button>
      </section>




      <section className="container spaced-section">
        <div className="voi-filters-block">
          <motion.div className="filter-card filter-card--pos" id="perfil" {...fadeInUp}>
            <CheckCircle2 size={28} />
            <h2>Para quién es</h2>
            <IconList items={positiveFilters} />
          </motion.div>
          <motion.div className="filter-card filter-card--neg" {...fadeInUp}>
            <XCircle size={28} />
            <h2>Para quién no es</h2>
            <IconList items={negativeFilters} icon={XCircle} />
          </motion.div>
        </div>
      </section>

      <section className="voi-process container">
        <motion.div className="section-intro" {...fadeInUp}>
          <span className="section-label">Proceso de aplicación</span>
          <h2 className="editorial-title">Un proceso simple para cuidar la afinidad y los cupos.</h2>
        </motion.div>
        <div className="process-grid">
          {applicationSteps.map((step, index) => (
            <motion.article className="process-step" key={step} {...fadeInUp} transition={{ delay: index * 0.06 }}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </motion.article>
          ))}
        </div>
        <div className="voi-process__notes">
          {processNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          <p>{cancellationPolicy}</p>
        </div>
      </section>

      <section className="voi-faq container">
        <div className="section-intro">
          <span className="section-label">Preguntas frecuentes</span>
          <h2 className="editorial-title">Dudas importantes antes de aplicar</h2>
        </div>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={faq.q}>
              <button className="faq-item__trigger" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{faq.q}</span>
                <Plus size={20} className="icon" style={{ transform: openFaq === index ? 'rotate(45deg)' : 'none' }} />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="faq-item__content"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section id="aplicar" className="voi-application">
        <div className="container">
          <motion.div className="application-content" {...fadeInUp}>
            <span className="section-label">Reserva</span>
            <h2 className="editorial-title">Elegí tu semana y avanzá con la reserva</h2>
            <p className="editorial-lead application-lead">
              Seleccioná una fecha disponible y escribinos por WhatsApp para confirmar tu lugar y recibir los próximos
              pasos.
            </p>

            <div className="application-actions">
              <a
                className="btnPrimary"
                href={buildWhatsappUrl()}
                {...getTargetProps(WHATSAPP_NUMBER)}
                {...getTrackingAttributes('final_section', 'whatsapp', 'sin_seleccionar', 'multiple_open')}
                onClick={(event) => handleWhatsappClick(event, 'final_section')}
              >
                Reservar mi lugar
                <ArrowRight size={18} />
              </a>
            </div>

            <p className="application-note">
              No realices ningún pago hasta recibir la confirmación del equipo de Madre Selva.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="voi-footer">
        <div className="container">
          <div className="footer-logo-wrapper">
            <span className="footer-logo">MADRE SELVA</span>
          </div>
          <p>© 2026 MADRE SELVA - MOVIMIENTO NÁLU’UM. Instituto de Pedagogía de la Tierra.</p>
        </div>
      </footer>
      </>
      ) : null}

    </div>
  );
};

export default VoluntariadoLanding;
