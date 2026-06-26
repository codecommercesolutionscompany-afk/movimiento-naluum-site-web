import { createElement, useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Home,
  Leaf,
  MapPin,
  Plus,
  Sprout,
  Tent,
  Users,
  Utensils,
  Wifi,
  XCircle,
} from 'lucide-react';
import SEOHelmet from './SEOHelmet.jsx';
import logoUrl from './assets/images/logo-madre-selva-user.png';
const heroImage = '/voluntariado-otono-invierno/voluntariado-hero.webp';
import './voluntariado_landing.scss';

const SITE_URL = 'https://movimientonaluum.org';
const LANDING_URL = `${SITE_URL}/voluntariado-otono-invierno`;
const APPLICATION_FORM_URL = 'https://forms.gle/zjeisEcMoAyntZL26';
const heroSeoImage = new URL(heroImage, SITE_URL).toString();
const logoSeoImage = new URL(logoUrl, SITE_URL).toString();
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

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

const buildApplicationUrl = () => {
  if (!APPLICATION_FORM_URL) return 'PENDIENTE_FORM_URL';
  return APPLICATION_FORM_URL;
};

const getStoredUtms = () => {
  if (typeof window === 'undefined') return {};

  try {
    return UTM_KEYS.reduce((acc, key) => {
      const value = window.sessionStorage.getItem(`voi_${key}`);
      if (value) acc[key] = value;
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const trackEvent = (eventName, payload = {}) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.72, ease: [0.165, 0.84, 0.44, 1] },
};

const quickFacts = [
  { icon: MapPin, label: 'Lugar', value: 'Madre Selva' },
  { icon: Home, label: 'Modalidad', value: 'Presencial' },
  { icon: Calendar, label: 'Formato', value: 'Colaboración de lunes a viernes' },
  { icon: Leaf, label: 'Horario', value: '07:00 a 13:00' },
  { icon: Tent, label: 'Alojamiento', value: 'Camping incluido. Traé tu carpa.' },
  { icon: Users, label: 'Cupos', value: 'Hasta 10 personas por semana' },
  { icon: DollarSign, label: 'Aporte', value: '$150.000 ARS' },
  { icon: Utensils, label: 'Incluye', value: 'Tres comidas diarias' },
];

const includes = [
  'Estadía en Madre Selva',
  'Espacio de camping',
  'Tres comidas diarias',
  'Comidas incluidas desde el día de llegada',
  'Desayuno y almuerzo el sábado de salida',
  'Espacios de uso compartido',
  'Internet',
  'Biblioteca',
  'Yoga',
  'Actividades recreativas',
  'Arte programado dentro de la participación',
  'Aprendizaje constante en la práctica',
  'Participación en actividades concretas del proyecto',
  'Vida comunitaria en contacto con la naturaleza',
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
    name: 'Semana 2',
    dates: 'Del lunes 6 al sábado 11 de julio de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_july_06',
    selectedWeek: '2026-07-06',
  },
  {
    name: 'Semana 3',
    dates: 'Del lunes 20 al sábado 25 de julio de 2026',
    collaboration: 'Colaboración de lunes a viernes, de 07:00 a 13:00.',
    exit: 'Sábado de cierre y salida a las 15:30.',
    meals: 'Desayuno y almuerzo incluidos el sábado.',
    location: 'week_july_20',
    selectedWeek: '2026-07-20',
  },
];

const lodgingNotes = [
  'El espacio de camping está incluido en el aporte.',
  'Cada participante debe traer obligatoriamente su propia carpa, bolsa de dormir, abrigo suficiente y elementos personales para acampar.',
  'También existen yurtas opcionales por $15.000 ARS por noche. Este alojamiento tiene un costo adicional y está sujeto a disponibilidad.',
  'La yurta no está incluida en los $150.000 ARS y debe consultarse después de la aceptación o durante el proceso correspondiente.',
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

const includesList = includes;

const faqs = [
  {
    q: '¿El voluntariado es gratuito?',
    a: 'No es gratuito. El aporte es de $150.000 ARS por persona y por la semana completa.',
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
    a: 'También existen yurtas opcionales por $15.000 ARS por noche. Este alojamiento tiene un costo adicional, no está incluido en los $150.000 ARS, está sujeto a disponibilidad y debe consultarse después de la aceptación o durante el proceso correspondiente.',
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
    a: 'No. No es turismo, hospedaje gratuito, retiro espiritual ni una experiencia pasiva. Es una propuesta de intercambio con participación activa y responsabilidades concretas.',
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
    try {
      const params = new URLSearchParams(window.location.search);
      UTM_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) window.sessionStorage.setItem(`voi_${key}`, value);
      });
    } catch {
      // UTMs are optional and should never block the landing.
    }
  }, []);

  const chooseCohortHref = '#fechas';

  const handleApplicationClick = (cohort) => {
    trackEvent('application_form_start', {
      service: 'voluntariado_otono_invierno',
      cta_location: cohort.location,
      selected_week: cohort.selectedWeek,
      ...getStoredUtms(),
    });
  };

  return (
    <div className="voi-landing">
      <SEOHelmet
        title="Voluntariado Otoño-Invierno | Madre Selva"
        description="Sumate al voluntariado de otoño-invierno en Madre Selva. Una experiencia de aprendizaje práctico, vida comunitaria y contacto con la naturaleza."
        image={heroSeoImage}
        url={LANDING_URL}
      />

      <header className={`voi-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="voi-header__wrapper">
          <a href={SITE_URL} className="nav-logo">
            <span className="nav-logo__text">MADRE SELVA</span>
          </a>
          <div className="voi-header__actions">
            <a className="btnPrimary btnPrimary--small" href={chooseCohortHref}>
              Postularme
            </a>
          </div>
        </div>
      </header>

      <section className="voi-hero">
        <div className="voi-hero__bg">
          <img src={heroImage} alt="Vida comunitaria y naturaleza en Madre Selva" loading="eager" />
        </div>
        <div className="voi-hero__overlay" />

        <div className="voi-hero__content">
          <motion.span className="voi-badge" {...fadeInUp}>
            Experiencia de intercambio
          </motion.span>
          <motion.h1 className="voi-title--hero" {...fadeInUp} transition={{ delay: 0.08 }}>
            Voluntariado Otoño–Invierno
          </motion.h1>
          <motion.p className="voi-hero__subtitle" {...fadeInUp} transition={{ delay: 0.16 }}>
            Una experiencia de intercambio en Madre Selva para colaborar con actividades concretas del proyecto,
            vivir en comunidad y aprender desde la práctica en contacto con la naturaleza.
          </motion.p>
          <motion.p className="voi-hero__support" {...fadeInUp} transition={{ delay: 0.24 }}>
            Durante la estadía vas a participar en tareas reales del territorio, como podas, agrofloresta, huerta,
            mantenimiento y sistemas en desarrollo. La experiencia incluye estadía, tres comidas diarias, espacios
            compartidos, internet, biblioteca, yoga, actividades recreativas y arte programado.
          </motion.p>
          <motion.div className="voi-hero__actions" {...fadeInUp} transition={{ delay: 0.32 }}>
            <a className="btnPrimary" href={chooseCohortHref}>
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
            <h2 className="editorial-title">Un intercambio consciente, claro y con responsabilidad compartida.</h2>
          </motion.div>
          <motion.div className="voi-purpose__copy" {...fadeInUp}>
            <p>
              El propósito del Voluntariado Otoño–Invierno es generar una experiencia de intercambio consciente entre
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
            { icon: Tent, value: 'Camping', label: 'Alojamiento', desc: 'Espacio incluido para acampar con carpa propia.' },
            { icon: Utensils, value: '3 comidas', label: 'Alimentación', desc: 'Tres comidas diarias, más desayuno y almuerzo el sábado de salida.' },
            { icon: Wifi, value: 'Internet', label: 'Espacios', desc: 'Uso de espacios compartidos, internet y biblioteca.' },
            { icon: Sprout, value: 'Práctica', label: 'Aprendizaje', desc: 'Participación diaria en tareas reales del proyecto.' },
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

        <motion.div className="voi-includes-panel" {...fadeInUp}>
          <div className="voi-pills-container">
            {includesList.map((item) => (
              <span key={item} className="voi-pill">{item}</span>
            ))}
          </div>
          <p className="voi-important-note">
            Cada participante debe traer obligatoriamente su propia carpa, bolsa de dormir, abrigo suficiente y
            elementos personales para acampar.
          </p>
        </motion.div>
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
            <div className="booking-price-box">
              <span>Aporte por persona y por la semana completa</span>
              <strong>$150.000 ARS</strong>
              <p>El aporte contribuye a cubrir alimentación, estadía y logística durante la semana elegida.</p>
            </div>
            <a className="btnPrimary btnPrimary--wide" href={chooseCohortHref}>
              Elegir semana para postularme
            </a>
            <ul className="booking-list">
              <li>
                <strong>Horario:</strong>
                <span>Colaboración de lunes a viernes, de 07:00 a 13:00</span>
              </li>
              <li>
                <strong>Alojamiento:</strong>
                <span>Camping incluido. Traé tu carpa.</span>
              </li>
              <li>
                <strong>Cupos:</strong>
                <span>Hasta 10 personas por semana</span>
              </li>
            </ul>
            <p className="booking-note">
              No debés realizar ningún pago antes de recibir la confirmación de aceptación de Madre Selva.
            </p>
          </motion.div>
        </aside>
      </main>

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

      <section className="container" style={{ marginBottom: '80px' }}>
        <motion.div className="voi-section-block" {...fadeInUp} style={{ textAlign: 'center' }}>
          <span className="section-label">Aporte</span>
          <h2 className="editorial-title" style={{ margin: '0 auto 18px' }}>Aporte por persona y por la semana completa: $150.000 ARS</h2>
          <p style={{ margin: '0 auto', maxWidth: '760px' }}>
            El aporte contribuye a cubrir alimentación, estadía y logística durante la semana elegida. Se abona
            únicamente después de que Madre Selva confirma la aceptación.
          </p>
        </motion.div>
      </section>

      <section className="voi-cohorts container" id="fechas">
        <motion.div className="section-intro" {...fadeInUp}>
          <span className="section-label">Fechas y cupos</span>
          <h2 className="editorial-title">Dos semanas disponibles durante julio de 2026.</h2>
          <p className="editorial-lead">
            El mismo formulario sirve para ambas semanas. Dentro del formulario elegís la semana en la que querés
            postularte.
          </p>
        </motion.div>

        <div className="voi-cohorts__grid">
          {cohorts.map((cohort, index) => (
            <motion.article className="cohort-card" key={cohort.name} {...fadeInUp} transition={{ delay: index * 0.08 }}>
              <span>{cohort.name}</span>
              <h3>{cohort.dates}</h3>
              <p>{cohort.collaboration}</p>
              <p>{cohort.exit}</p>
              <p className="cohort-card__note">{cohort.meals}</p>
              <strong>Hasta 10 personas</strong>
              <a
                className="cohort-card__cta"
                href={buildApplicationUrl()}
                onClick={() => handleApplicationClick(cohort)}
                {...getTargetProps(APPLICATION_FORM_URL)}
              >
                Postularme a esta semana
                <ArrowRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>
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
            <span className="section-label">Aplicación</span>
            <h2 className="editorial-title">Sumate al Voluntariado Otoño–Invierno</h2>
            <p className="editorial-lead application-lead">
              Si querés vivir unos días en Madre Selva, colaborar con trabajos reales del territorio y formar parte de
              una experiencia comunitaria en contacto con la naturaleza, primero elegí una semana disponible y completá
              el formulario de postulación.
            </p>

            <div className="application-actions">
              <a className="btnPrimary" href={chooseCohortHref}>
                Elegir semana para postularme
                <ArrowRight size={18} />
              </a>
            </div>

            <p className="application-note">
              Completar el formulario no garantiza el ingreso. No debés realizar ningún pago antes de recibir la
              confirmación de aceptación de Madre Selva.
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
