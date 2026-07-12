import { createElement, useEffect, useState } from 'react';
import SEOHelmet from './SEOHelmet';
import {
  Calendar,
  MapPin,
  Clock,
  Zap,
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react';
const heroImage = '/programa-intercambio-formativo/residencias_y_voluntariado_de_aprendizaje.webp';
import ayelenImage from './assets/images/ayelen_testimonio.webp';
import leoImage from './assets/images/leo_testimonio.webp';
import claudiaImage from './assets/images/claudia_testimonio.webp';
import awenImage from './assets/images/awen_testimonio.webp';
import gabrielImage from './assets/images/gabriel_testimonio.webp';
import './program_landing.scss';

const PROGRAM_PRICE = "USD 133,33";
const APPLICATION_FORM_URL = "https://forms.gle/1kdFz1e76oY82EXd9";
const SITE_URL = "https://movimientonaluum.org";
const LANDING_URL = `${SITE_URL}/programa-intercambio-formativo`;
const heroSeoImage = new URL(heroImage, SITE_URL).toString();
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'residencia_utm_params';
const FIRST_TOUCH_STORAGE_KEY = 'residencia_first_touch_timestamp';
const FUNNEL_REFERENCE_KEY = 'residencia_funnel_reference:aplica';
const FORM_START_DEDUP_PREFIX = 'residencia_form_start_dedup';
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TRACKING_CONTEXT = {
  landing_name: 'programa-intercambio-formativo',
  related_service: 'residencia-formativa',
  event_id: 'residencia-formativa-2026',
  event_name: 'Residencia Formativa por Rol',
  event_type: 'programa_formativo',
  event_edition: 2026,
  event_status: 'published',
  program_duration: '2_meses',
  currency: 'USD',
  display_price: 133.33,
};

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

const getStoredUtmParams = () => {
  const stored = readSessionValue(UTM_STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored);
    return UTM_PARAMS.reduce((params, name) => {
      if (parsed?.[name]) params[name] = parsed[name];
      return params;
    }, {});
  } catch {
    return {};
  }
};

const getMergedUtmParams = () => {
  if (typeof window === 'undefined') return {};
  const currentParams = new URLSearchParams(window.location.search);
  const storedParams = getStoredUtmParams();

  return UTM_PARAMS.reduce((params, name) => {
    const currentValue = currentParams.get(name);
    if (currentValue) params[name] = currentValue;
    else if (storedParams[name]) params[name] = storedParams[name];
    return params;
  }, {});
};

const persistUtmParams = () => {
  const mergedParams = getMergedUtmParams();
  if (Object.keys(mergedParams).length > 0) {
    writeSessionValue(UTM_STORAGE_KEY, JSON.stringify(mergedParams));
  }
  return mergedParams;
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
    for (let i = 0; i < values.length; i += 1) {
      values[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  return Array.from(values, (value) => REFERENCE_ALPHABET[value % REFERENCE_ALPHABET.length]).join('');
};

const getFunnelReference = () => {
  const existing = readSessionValue(FUNNEL_REFERENCE_KEY);
  if (existing) return existing;

  const reference = `RESI-APLICA-${generateReferenceCode()}`;
  writeSessionValue(FUNNEL_REFERENCE_KEY, reference);
  return reference;
};

const pushDataLayer = (payload) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const getFormCtaData = (ctaLocation, cohort = 'sin_seleccionar', applicationRole = 'sin_seleccionar') => ({
  'data-landing-name': TRACKING_CONTEXT.landing_name,
  'data-related-service': TRACKING_CONTEXT.related_service,
  'data-event-id': TRACKING_CONTEXT.event_id,
  'data-event-name': TRACKING_CONTEXT.event_name,
  'data-event-type': TRACKING_CONTEXT.event_type,
  'data-event-edition': String(TRACKING_CONTEXT.event_edition),
  'data-event-status': TRACKING_CONTEXT.event_status,
  'data-cta-location': ctaLocation,
  'data-cta-type': 'external_form',
  'data-form-provider': 'google_forms',
  'data-ticket-category': 'aplica',
  'data-cohort': cohort,
  'data-application-role': applicationRole,
});

const animationPropNames = new Set(['initial', 'animate', 'exit', 'whileInView', 'viewport', 'transition']);
const createStaticMotionComponent = (tag) => ({ children, ...props }) => {
  const cleanProps = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!animationPropNames.has(key)) cleanProps[key] = value;
  });
  return createElement(tag, cleanProps, children);
};
const motion = new Proxy({}, { get: (_, tag) => createStaticMotionComponent(tag) });
const AnimatePresence = ({ children }) => children;

const cohorts = [
  {
    name: "Cohorte Agosto",
    program: "Residencia Formativa por Rol",
    slug: "agosto_2026",
    ctaLocation: "cohort_august",
    weekday: "Lunes",
    day: "3",
    month: "Agosto",
    year: "2026",
    duration: "Dos meses completos",
    location: "Madre Selva - Misiones, Argentina",
    spots: "Hasta 3 personas por cohorte"
  },
  {
    name: "Cohorte Octubre",
    program: "Residencia Formativa por Rol",
    slug: "octubre_2026",
    ctaLocation: "cohort_october",
    weekday: "Lunes",
    day: "5",
    month: "Octubre",
    year: "2026",
    duration: "Dos meses completos",
    location: "Madre Selva - Misiones, Argentina",
    spots: "Hasta 3 personas por cohorte"
  }
];

const ProgramLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const utmParams = persistUtmParams();
    const firstTouchTimestamp = getFirstTouchTimestamp();

    if (!pageContextPushed) {
      pageContextPushed = true;
      pushDataLayer({
        event: 'event_page_context',
        page_url: window.location.href,
        page_path: window.location.pathname,
        ...TRACKING_CONTEXT,
        ...utmParams,
        first_touch_timestamp: firstTouchTimestamp,
      });
    }
  }, []);

  const getApplicationFormUrl = () => {
    if (typeof window === 'undefined') return APPLICATION_FORM_URL;

    const formUrl = new URL(APPLICATION_FORM_URL);

    UTM_PARAMS.forEach((param) => {
      const value = getMergedUtmParams()[param];
      if (value) formUrl.searchParams.set(param, value);
    });

    return formUrl.toString();
  };

  const trackApplicationFormStart = (event, ctaLocation, cohort = 'sin_seleccionar', applicationRole = 'sin_seleccionar') => {
    if (typeof window === 'undefined') return;

    const normalizedCohort = cohort || 'sin_seleccionar';
    const normalizedRole = applicationRole || 'sin_seleccionar';
    const utmParams = getMergedUtmParams();
    const firstTouchTimestamp = getFirstTouchTimestamp();
    const funnelReference = getFunnelReference();
    const formDestination = getApplicationFormUrl();
    const payload = {
      page_url: window.location.href,
      page_path: window.location.pathname,
      ...TRACKING_CONTEXT,
      ...utmParams,
      first_touch_timestamp: firstTouchTimestamp,
      cta_text: event?.currentTarget?.textContent?.trim() || '',
      cta_location: ctaLocation,
      cta_type: 'external_form',
      form_provider: 'google_forms',
      form_destination: formDestination,
      ticket_category: 'aplica',
      funnel_reference: funnelReference,
      cohort: normalizedCohort,
      application_role: normalizedRole,
      deduplication_scope: 'session_cta_location_cohort_application_role',
    };

    event?.currentTarget?.setAttribute('data-funnel-reference', funnelReference);
    pushDataLayer({ event: 'cta_click', ...payload });

    const deduplicationKey = `${FORM_START_DEDUP_PREFIX}:${ctaLocation}:${normalizedCohort}:${normalizedRole}`;
    if (!readSessionValue(deduplicationKey)) {
      writeSessionValue(deduplicationKey, '1');
      pushDataLayer({ event: 'application_form_start', ...payload });
    }
  };

  const applicationFormUrl = getApplicationFormUrl();


  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }
  };

  const faqs = [
    {
      q: "¿Necesito experiencia previa?",
      a: "Sí. No buscamos perfección, pero sí una base real en el área a la que aplicás."
    },
    {
      q: "¿Puedo ir por menos de dos meses?",
      a: "No. La residencia dura dos meses completos porque la propuesta requiere tiempo real de integración, convivencia y aprendizaje dentro del rol."
    },
    {
      q: "¿Es una experiencia abierta para cualquiera?",
      a: "No. Es una convocatoria cuidada, orientada a personas con afinidad real con el rol y con la visión de Madre Selva."
    },
    {
      q: "¿Aplicar significa que ya quedé?",
      a: "No. Completar el formulario no garantiza el ingreso. Madre Selva revisa cada perfil, experiencia y afinidad con el rol antes de confirmar si la aplicación fue aceptada."
    },
    {
      q: "¿Qué incluye la inversión?",
      a: "Incluye alojamiento durante la residencia, alimentación, acceso a internet, integración activa a uno de los tres roles, acompañamiento y aprendizaje práctico, participación en espacios formativos y convivencia dentro de Madre Selva."
    },
    {
      q: "¿Cómo funciona la evaluación del primer mes?",
      a: "Al finalizar el primer mes realizamos una evaluación del proceso, considerando la convivencia, el compromiso, la responsabilidad, la adaptación al rol y la disposición para aprender. No es un examen académico."
    },
    {
      q: "¿Qué pasa si no continúo al segundo mes?",
      a: "La continuidad durante el segundo mes está sujeta a esa evaluación. Si el proceso no resulta compatible con los acuerdos y responsabilidades de la residencia, Madre Selva puede solicitar la finalización anticipada de la experiencia."
    },
    {
      q: "¿El Programa de Aprendices está incluido desde el inicio?",
      a: "No. Quienes continúen durante el segundo mes podrán participar del Programa de Aprendices de 12 días como instancia complementaria de formación."
    }
  ];

  return (
    <div className="program-landing">
      <SEOHelmet
        title="Residencia Formativa por Rol | Madre Selva 2026"
        description="Convocatoria para personas con base previa que buscan aprendizaje aplicado, convivencia y aporte concreto en comunidad."
        url={LANDING_URL}
        image={heroSeoImage}
      />

      <header className={`pl-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="pl-header__wrapper">
          <a href={SITE_URL} className="nav-logo">MADRE SELVA</a>
            <a
              href={applicationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btnPrimary"
              {...getFormCtaData('header')}
              style={{ padding: '12px 24px', fontSize: '0.8rem' }}
              onClick={(event) => trackApplicationFormStart(event, 'header')}
            >
            APLICAR
          </a>
        </div>
      </header>

      {/* --- BLOQUE 1: HERO PRINCIPAL --- */}
      <section className="pl-hero">
        <div className="pl-hero__bg">
          <img src={heroImage} alt="Naturaleza Madre Selva" loading="eager" fetchPriority="high" decoding="async" />
        </div>
        <div className="pl-hero__overlay"></div>

        <div className="pl-hero__content">
          <motion.span className="pl-badge" {...fadeInUp}>CONVOCATORIA POR ROL 2026</motion.span>
          <motion.h1 className="pl-title--hero" {...fadeInUp} transition={{ delay: 0.1 }}>
            Residencia Formativa por Rol en Madre Selva
          </motion.h1>
          <motion.p className="pl-hero__subtitle" {...fadeInUp} transition={{ delay: 0.2 }}>
            Una experiencia de formación vivencial para personas con base previa que quieran profundizar su práctica dentro de uno de los 3 roles oficiales de esta edición: Redes y Comunicación, Agricultura y Agricultura Sintrópica y Bioconstrucción.
          </motion.p>

          <motion.div className="pl-hero__actions" {...fadeInUp} transition={{ delay: 0.3 }}>
              <a
                href={applicationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btnPrimary"
                {...getFormCtaData('hero')}
                onClick={(event) => trackApplicationFormStart(event, 'hero')}
              >
              APLICAR
            </a>
            <a href="#perfil" className="btnOutlineLight">Ver si esta experiencia es para mí</a>
          </motion.div>

          <motion.p className="pl-hero__support" {...fadeInUp} transition={{ delay: 0.4 }}>
            La residencia requiere una estancia mínima de 2 meses en Madre Selva. No es una experiencia turística ni un voluntariado abierto: es una propuesta de aprendizaje con compromiso, presencia y participación real en un rol.
          </motion.p>

          <motion.div className="pl-info-bar" {...fadeInUp} transition={{ delay: 0.5 }}>
            <div className="pl-info-bar__item">
              <Calendar className="icon" size={24} />
              <div className="text">
                <span>Temporada</span>
                <span>Ingresos: agosto y octubre de 2026</span>
              </div>
            </div>
            <div className="pl-info-bar__item">
              <MapPin className="icon" size={24} />
              <div className="text">
                <span>Ubicación</span>
                <span>El Soberbio, Misiones</span>
              </div>
            </div>
            <div className="pl-info-bar__item">
              <Zap className="icon" size={24} />
              <div className="text">
                <span>Propuesta</span>
                <span>Vida y Aprendizaje</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- BLOQUE 2: IDENTIFICACIÓN RÁPIDA --- */}
      <section className="pl-id-block container">
        <div className="id-grid">
          <motion.div {...fadeInUp}>
            <span className="section-label">Filtro de afinidad</span>
            <h2 className="editorial-title">No buscamos cantidad. Buscamos afinidad real.</h2>
          </motion.div>
          <div className="id-content">
            <motion.p className="editorial-lead" {...fadeInUp} style={{ marginBottom: '30px' }}>
              Esta residencia está pensada para personas con interés real en aprender haciendo, convivir en comunidad y asumir un rol con responsabilidad.
            </motion.p>
            <motion.ul className="id-list" {...fadeInUp}>
              <li style={{ opacity: 0.8 }}><XCircle className="check" size={22} style={{ color: '#ef4444' }} /><p>Si estás buscando solo “ir a un lugar lindo”, desconectarte unos días o improvisar sobre la marcha, esta propuesta probablemente no sea para vos.</p></li>
            </motion.ul>
          </div>
        </div>
      </section>

      {/* --- BLOQUE 3: DIFERENCIAL --- */}
      <section className="pl-stats-grid container">
        <motion.div style={{ textAlign: 'center', marginBottom: '60px' }} {...fadeInUp}>
          <span className="section-label">Propuesta</span>
          <h2 className="editorial-title">Qué incluye</h2>
          <p className="editorial-lead" style={{ margin: '0 auto' }}>Durante 2 meses, la residencia combina claridad operativa, convivencia, acompañamiento e integración gradual dentro del rol.</p>
        </motion.div>

        <div className="stats-container">
          {[
            { icon: <CheckCircle2 />, val: "Rol Activo", label: "Integración", desc: "Integración activa a uno de los tres roles y participación en espacios formativos." },
            { icon: <Zap />, val: "Acompañamiento", label: "Práctica", desc: "Acompañamiento y aprendizaje práctico desde la experiencia cotidiana." },
            { icon: <Users />, val: "Convivencia", label: "Entorno", desc: "Alojamiento durante la residencia, alimentación, acceso a internet y convivencia dentro de Madre Selva." },
            { icon: <Star />, val: "Criterio", label: "Proceso", desc: "Espacio para observar, colaborar y desarrollar criterio dentro de un proceso real." }
          ].map((stat, i) => (
            <motion.div key={i} className="stat-card" {...fadeInUp} transition={{ delay: i * 0.1 }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.val}</div>
              <div className="stat-label">{stat.label}</div>
              <p className="stat-desc">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BLOQUE 4 & 5 & 10: MAIN CONTENT + SIDEBAR --- */}
      {/* --- BLOQUE LOCALIZADO CON SIDEBAR --- */}
      <main className="pl-main-layout container">
        <div className="content-area">
          <motion.section className="card-editorial" {...fadeInUp}>
            <span className="section-label">CONVOCATORIA 2026</span>
            <h2 className="editorial-title">Hoy estamos abriendo convocatoria para los 3 roles oficiales de esta edición</h2>
            <p className="editorial-lead">Buscamos afinidad, no cantidad. Personas con base previa que quieran profundizar su oficio dentro de una experiencia real, formativa y con sentido.</p>

            <div className="roles-grid-mvp" style={{ display: 'grid', gap: '30px', marginTop: '40px' }}>
              <div className="role-item-mvp" style={{ background: '#fcfcfc', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ color: '#179c55', fontSize: '1.2rem', marginBottom: '10px' }}>1. Redes y Comunicación</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Para personas con experiencia previa en comunicación, creación de contenido, registro visual, narrativa digital o gestión de redes, que quieran documentar, comunicar y dar forma al relato vivo de la experiencia con criterio, sensibilidad y presencia.</p>
              </div>
              <div className="role-item-mvp" style={{ background: '#fcfcfc', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ color: '#179c55', fontSize: '1.2rem', marginBottom: '10px' }}>2. Agricultura y Agricultura Sintrópica</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Para personas con base en agricultura, agroecología o trabajo con sistemas vivos, que quieran profundizar la práctica, comprender procesos regenerativos y aprender desde la experiencia directa en territorio.</p>
              </div>
              <div className="role-item-mvp" style={{ background: '#fcfcfc', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ color: '#179c55', fontSize: '1.2rem', marginBottom: '10px' }}>3. Bioconstrucción</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Para personas con experiencia previa en construcción natural, mejora de espacios o trabajo práctico de obra, que quieran aprender y aportar dentro de procesos reales vinculados al habitar, construir y sostener infraestructura con sentido.</p>
              </div>
            </div>

            <p style={{ marginTop: '30px', fontWeight: 500, fontStyle: 'italic', fontSize: '0.9rem' }}>No hace falta ser experto. Sí hace falta tener base, disposición real para aprender y compromiso con el proceso.</p>
          </motion.section>
        </div>

        <aside className="sidebar-area">
          <motion.div className="booking-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="section-label">Estancia y Compromiso</span>
            <ul className="booking-list" style={{ margin: '1.5rem 0' }}>
              <li><strong>Tiempo:</strong> Mínimo 2 meses</li>
              <li><strong>Ubicación:</strong> Madre Selva, Misiones</li>
              <li><strong>Propuesta:</strong> Aprender haciendo</li>
              <li><strong>Cupos:</strong> 3 personas por cohorte</li>
              <li><strong>Inversión total por los dos meses:</strong> {PROGRAM_PRICE}</li>
            </ul>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>Esto no es un detalle logístico. Es parte de la propuesta para poder integrarse y aportar de verdad.</p>

            <span className="section-label" style={{ marginTop: '20px', display: 'block' }}>Cómo es el proceso</span>
            <div style={{ margin: '15px 0', fontSize: '0.9rem' }}>
              <p><strong>1.</strong> Completás el formulario de aplicación.</p>
              <p><strong>2.</strong> Revisamos tu perfil, experiencia y afinidad con el rol.</p>
              <p><strong>3.</strong> Si el perfil avanza, te contactamos para conversar.</p>
              <p><strong>4.</strong> Madre Selva confirma si la aplicación fue aceptada.</p>
            </div>
            <p className="application-note">Completar el formulario no garantiza el ingreso.</p>

            <a href="#cohortes" className="btnPrimary" style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>VER COHORTES</a>
          </motion.div>
        </aside>
      </main>

      <section id="cohortes" className="pl-cohorts container">
        <motion.div className="pl-cohorts__intro" {...fadeInUp}>
          <span className="section-label">Cohortes disponibles</span>
          <h2 className="editorial-title">Elegí desde qué fecha querés iniciar tu residencia</h2>
          <p className="editorial-lead">
            Abrimos dos cohortes de la Residencia Formativa por Rol, cada una con disponibilidad para hasta 3 personas. Cada cohorte tiene una duración de dos meses completos desde su fecha de inicio.
          </p>
        </motion.div>

        <div className="pl-cohorts__grid">
          {cohorts.map((cohort, i) => {
            return (
              <motion.article
                key={cohort.name}
                className="cohort-card"
                {...fadeInUp}
                transition={{ delay: i * 0.12 }}
              >
                <div className="cohort-card__top">
                  <span>{cohort.program}</span>
                  <strong>{cohort.name}</strong>
                </div>

                <div className="cohort-card__date">
                  <span>{cohort.weekday}</span>
                  <strong>{cohort.day}</strong>
                  <span>{cohort.month} {cohort.year}</span>
                </div>

                <div className="cohort-card__availability">
                  <Users size={18} />
                  <span>{cohort.spots}</span>
                </div>

                <div className="cohort-card__details">
                  <p><Clock size={18} />Duración: {cohort.duration}</p>
                  <p><MapPin size={18} />{cohort.location}</p>
                </div>

                <a
                  href={applicationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cohort-card__cta"
                  {...getFormCtaData(cohort.ctaLocation, cohort.slug)}
                  onClick={(event) => trackApplicationFormStart(event, cohort.ctaLocation, cohort.slug)}
                >
                  <CheckCircle2 size={18} />
                  Aplicar a esta cohorte
                  <ArrowRight size={16} />
                </a>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Bloque 5: El Sentido (Centrado y Dark) */}
      <section className="container">
        <motion.section className="card-editorial card-editorial--dark card-editorial--focus" {...fadeInUp} style={{ marginTop: '50px' }}>
          <span className="section-label" style={{ color: '#179c55' }}>La Formación</span>
          <h2 className="editorial-title">No es un curso tradicional.<br/>Es formación en contexto real.</h2>
          <p className="editorial-lead">La Residencia Formativa por Rol propone aprender desde la práctica cotidiana dentro de Madre Selva.</p>
          <p style={{ opacity: 0.8 }}>Eso significa que el aprendizaje no sucede solo en una clase, sino en la experiencia concreta de habitar un rol, observar un sistema vivo y comprender cómo una visión toma forma en lo real.</p>
          <p style={{ marginTop: '20px', fontWeight: 600, color: '#179c55' }}>Acá se aprende viendo, haciendo, ajustando, preguntando y sosteniendo.</p>
        </motion.section>
      </section>

      {/* Bloque: Progresión Formativa y Programa de Aprendices */}
      <section className="container">
        <motion.section className="card-editorial card-editorial--focus" {...fadeInUp} style={{ marginTop: '50px' }}>
          <span className="section-label">Progresión</span>
          <h2 className="editorial-title">Una residencia de dos meses, con evaluación al finalizar el primer mes</h2>
          <p className="editorial-lead" style={{ marginBottom: '20px' }}>
            La aplicación corresponde a una residencia de dos meses.
          </p>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>
            Al finalizar el primer mes realizamos una evaluación del proceso, considerando la convivencia, el compromiso, la responsabilidad, la adaptación al rol y la disposición para aprender.
          </p>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>
            La continuidad durante el segundo mes está sujeta a esa evaluación. Si el proceso no resulta compatible con los acuerdos y responsabilidades de la residencia, Madre Selva puede solicitar la finalización anticipada de la experiencia.
          </p>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>
            Quienes continúen durante el segundo mes podrán participar del Programa de Aprendices de 12 días como instancia complementaria de formación.
          </p>
          <div style={{ background: '#f8f9f8', padding: '20px', borderRadius: '12px', display: 'inline-block', border: '1px solid rgba(23, 156, 85, 0.2)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#179c55', fontWeight: 600 }}>
              <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }} />
              La evaluación no es un examen académico: revisa el proceso real de convivencia, rol y aprendizaje.
            </p>
          </div>
        </motion.section>
      </section>

      {/* --- BLOQUES DE ANCHO COMPLETO (90%) --- */}
      <section className="container" style={{ margin: '100px auto' }}>
        {/* Bloque 6 & 7: Filtros */}
        <div className="pl-filters-block" style={{ padding: '0' }}>
          <div className="filters-container">
            <motion.div id="perfil" className="filter-card filter-card--pos" {...fadeInUp}>
              <h3>Esta residencia puede ser para vos si...</h3>
              <ul>
                <li>Sentís un llamado real a aprender desde la práctica.</li>
                <li>Querés desarrollar criterio, no solo acumular información.</li>
                <li>Te interesa la vida en comunidad y el trabajo con sentido.</li>
                <li>Valorás la naturaleza, el cuidado y la experiencia directa.</li>
                <li>Buscás una experiencia que te transforme también en lo humano.</li>
              </ul>
            </motion.div>
            <motion.div className="filter-card filter-card--neg" {...fadeInUp}>
              <h3>Importante: esto no es</h3>
              <ul>
                <li>No es turismo espiritual.</li>
                <li>No es una experiencia casual o sin compromiso.</li>
                <li>No es un voluntariado abierto sin filtro.</li>
                <li>No es para venir “a ver qué pasa”.</li>
                <li>No es para quienes no puedan sostener proceso y responsabilidad.</li>
              </ul>
              <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6 }}>Buscamos cuidar la calidad del proceso y la afinidad con el rol.</p>
            </motion.div>
          </div>
        </div>

        {/* Bloque 8: Confianza */}
        <motion.section className="card-editorial card-editorial--focus" {...fadeInUp} style={{ marginTop: '80px' }}>
          <span className="section-label">Compromiso</span>
          <h2 className="editorial-title">Requisitos para aplicar</h2>
          <p className="editorial-lead">Para sostener la calidad del aprendizaje y la vida en el espacio, pedimos:</p>
          <ul className="id-list">
            <li><CheckCircle2 className="check" size={20}/><p>Aplicar a uno de los 3 roles oficiales de esta edición.</p></li>
            <li><CheckCircle2 className="check" size={20}/><p>Tener base previa en el área o rol al que aplicás.</p></li>
            <li><CheckCircle2 className="check" size={20}/><p>Poder sostener una estancia mínima de 2 meses.</p></li>
            <li><CheckCircle2 className="check" size={20}/><p>Tener disposición para convivir, aprender y participar activamente.</p></li>
            <li><CheckCircle2 className="check" size={20}/><p>Valorar los procesos comunitarios, el cuidado y la vida simple.</p></li>
            <li><CheckCircle2 className="check" size={20}/><p>Tener apertura para recibir guía, feedback y aprender en contexto real.</p></li>
          </ul>
        </motion.section>
      </section>

      {/* --- BLOQUE 9: TESTIMONIOS (REDISEÑO VISUAL & EMOCIONAL) --- */}
      <section className="pl-testimonials-v2">
        <div className="container">
          <div className="section-header">
            <motion.span className="section-label" {...fadeInUp}>Voces de procesos formativos en Madre Selva</motion.span>
            <motion.h2 className="editorial-title" {...fadeInUp}>Aprendizaje y crecimiento en contexto real</motion.h2>
            <motion.p className="testimonials-note" {...fadeInUp}>
              Estos testimonios pertenecen a personas que participaron en otras experiencias formativas de Madre Selva. La Residencia Formativa por Rol 2026 es una propuesta nueva.
            </motion.p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: "Ayelén",
                handle: "@Urakalindi",
                link: "https://instagram.com/Urakalindi",
                quote: "Me llevo muchísimas herramientas para aplicar en la práctica de la permacultura. Me sentí contenida y muy a gusto en todo el proceso.",
                image: ayelenImage,
                rating: 5
              },
              {
                name: "Leo",
                handle: "@leoglen_1",
                link: "https://instagram.com/leoglen_1",
                quote: "Es hermosísimo ver el proceso, tanto teórico como operativo y, sobre todo, vivencial. Una formación completa.",
                image: leoImage,
                rating: 5
              },
              {
                name: "Claudia",
                handle: "@clau_tierra",
                link: "https://instagram.com/clau_tierra",
                quote: "Sentís una energía especial con el lugar, la tierra y las personas. Ves la vida misma crecer mientras aprendes.",
                image: claudiaImage,
                rating: 5
              },
              {
                name: "Awen",
                handle: "@Awenvie",
                link: "https://instagram.com/Awenvie",
                quote: "Siento que aprendí un montón. Pude incorporar conocimientos que no tenía y me voy muy feliz por toda la experiencia.",
                image: awenImage,
                rating: 5
              },
              {
                name: "Gabriel",
                handle: "@Elitinerantetaller",
                link: "https://instagram.com/Elitinerantetaller",
                quote: "Este lugar es un oasis que se puede replicar para generar núcleos de vida real. Es un proceso con corazón.",
                image: gabrielImage,
                rating: 5
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card-v2"
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="card-bg">
                  <img src={t.image} alt={t.name} loading="lazy" />
                  <div className="card-overlay"></div>
                </div>

                <div className="card-content">
                  <div className="card-top">
                    <div className="stars">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                  </div>

                  <div className="card-bottom">
                    <p className="quote">“{t.quote}”</p>
                    <div className="author">
                      <h4 className="name">{t.name}</h4>
                      <a
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="handle"
                      >
                        {t.handle}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BLOQUE 11: FAQ --- */}
      <section className="pl-faq container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-label">Resolviendo dudas</span>
          <h2 className="editorial-title">Preguntas frecuentes</h2>
        </div>
        <div className="faq-container">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-item__trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <Plus size={20} className="icon" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
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

      {/* --- BLOQUE 12: CTA FINAL --- */}
      <section id="aplicar" className="pl-application-final" style={{ background: '#fff', color: '#111827', padding: '120px 0' }}>
        <div className="container">
          <motion.div className="pl-application-final__content" {...fadeInUp} style={{ textAlign: 'center' }}>
            <span className="section-label" style={{ color: '#179c55', marginBottom: '20px', display: 'block', textAlign: 'center' }}>Aplicación</span>
            <h2 className="editorial-title" style={{ maxWidth: '900px', margin: '0 auto 40px', textAlign: 'center' }}>Aplicación a Residencia Formativa por Rol</h2>

            <div className="pl-application-final__details" style={{ textAlign: 'left', background: '#f9f9f9', borderRadius: '20px' }}>
              <p style={{ fontWeight: 600, marginBottom: '20px' }}>En el formulario de aplicación te pediremos:</p>
              <ul className="pl-application-final__fields" style={{ listStyle: 'none' }}>
                <li>• Nombre, Apellido y Edad</li>
                <li>• Ciudad y País</li>
                <li>• WhatsApp y Email</li>
                <li>• Rol al que aplicás (uno de los 3 roles oficiales de esta edición)</li>
                <li>• Tu experiencia previa en el área</li>
                <li>• Por qué querés vivir esta residencia</li>
                <li>• Compromiso de estancia de 2 meses</li>
                <li>• Qué sentís que podrías aportar</li>
              </ul>
              <p style={{ marginTop: '30px', fontSize: '0.9rem', opacity: 0.7 }}>Completar el formulario no garantiza el ingreso. Buscamos cuidar la calidad del proceso y la afinidad entre la persona y el rol.</p>
            </div>

            <div className="pl-application-final__investment" style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.2rem', color: '#111827', marginBottom: '8px' }}>Inversión total por los dos meses: {PROGRAM_PRICE}</p>
              <p style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: '500px', margin: '0 auto' }}>Si tu perfil tiene afinidad con la propuesta, Madre Selva te contactará para conversar los próximos pasos.</p>
            </div>

            <div className="pl-application-final__actions">
                <a
                  href={applicationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btnPrimary"
                  {...getFormCtaData('final')}
                  onClick={(event) => trackApplicationFormStart(event, 'final')}
                >
                Enviar aplicación
              </a>
            </div>

            <div style={{ marginTop: '80px', opacity: 0.9, textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Si sentís afinidad real con esta propuesta, aplicá.</h3>
              <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>No buscamos personas perfectas. Buscamos presencia, honestidad, base previa y compromiso con un proceso real.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="pl-footer">
        <div className="container">
          <span className="footer-logo">MADRE SELVA</span>
          <p className="footer-copy">© 2026 MADRE SELVA — MOVIMIENTO NÁ LU’UM. Instituto de Pedagogía de la Tierra.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProgramLanding;
