import { Fragment, useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  Star,
  Tent,
  Utensils,
  Users,
  Zap,
} from 'lucide-react';
import SEOHelmet from './SEOHelmet.jsx';
import data from './data/pdc_landing_content_v2_reforzado.json';
import testimonialImage from './assets/images/testimonioPDC1.jpg';
import jazminTestimonialImage from './assets/images/jazmin-testimonio.webp';
import yeruTestimonialImage from './assets/images/yeru-testimonio.webp';
import fabianLunaTestimonialImage from './assets/images/fabian-luna-testimonio.webp';
import './pdc_landing.scss';

const imageAssets = {
  'testimonioPDC1.jpg': testimonialImage,
  'jazmin-testimonio.jpg': jazminTestimonialImage,
  'yeru-testimonio.jpg': yeruTestimonialImage,
  'fabian-luna-testimonio.jpg': fabianLunaTestimonialImage,
};

const animationPropNames = new Set(['initial', 'animate', 'exit', 'whileInView', 'viewport', 'transition']);

const createStaticMotionComponent = (Tag) => {
  const StaticMotionComponent = ({ children, ...props }) => {
    const cleanProps = {};

    Object.entries(props).forEach(([key, value]) => {
      if (!animationPropNames.has(key)) {
        cleanProps[key] = value;
      }
    });

    return <Tag {...cleanProps}>{children}</Tag>;
  };

  StaticMotionComponent.displayName = `StaticMotion.${Tag}`;
  return StaticMotionComponent;
};

const motion = {
  article: createStaticMotionComponent('article'),
  div: createStaticMotionComponent('div'),
  h1: createStaticMotionComponent('h1'),
  h2: createStaticMotionComponent('h2'),
  p: createStaticMotionComponent('p'),
  section: createStaticMotionComponent('section'),
  span: createStaticMotionComponent('span'),
  ul: createStaticMotionComponent('ul'),
};

const iconMap = {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  Star,
  Tent,
  Utensils,
  Users,
  Zap,
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'pdc_utm_params';
const FIRST_TOUCH_STORAGE_KEY = 'pdc_first_touch_timestamp';
const WHATSAPP_DEDUP_PREFIX = 'pdc_whatsapp_click_dedup';
const FUNNEL_REFERENCE_KEY = 'pdc_funnel_reference:inscripcion';
const REFERENCE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const WHATSAPP_DESTINATION = '5493764257777';
const TICKET_CATEGORY = 'inscripcion';
const PDC_CONTEXT = {
  landing_name: 'pdc',
  related_service: 'pdc',
  event_id: 'pdc-2026',
  event_name: 'PDC Diseño de Permacultura',
  event_type: 'curso_certificado',
  event_edition: '2026',
  event_status: 'published',
};
const CTA_LABELS = {
  header: 'Avanzar inscripción',
  hero: 'Quiero avanzar con mi inscripción',
  sticky_sidebar: 'Reservar mi lugar',
  payment: 'Quiero reservar mi lugar',
  final: 'Quiero dar el siguiente paso',
};

let eventPageContextPushed = false;

const dynamicValueKeys = ['valueFromSetting', 'titleFromSetting', 'priceFromSetting'];

const getCountdownParts = (startsAt, now) => {
  const diff = Math.max(new Date(startsAt).getTime() - now, 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { days, hours, minutes, seconds };
};

const padCountdownValue = (value) => String(value).padStart(2, '0');

const useCountdown = (startsAt) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return startsAt ? getCountdownParts(startsAt, now) : null;
};

const BookingCountdown = ({ startsAt }) => {
  const countdown = useCountdown(startsAt);

  if (!countdown) return null;

  return (
    <div className="booking-countdown" aria-label="Cuenta regresiva para el Curso de Diseño en Permacultura (PDC)">
      <div className="booking-countdown__title">
        <Clock size={16} />
        El Curso de Diseño en Permacultura (PDC) empieza en
      </div>
      <div className="booking-countdown__grid">
        <span>
          <strong>{countdown.days}</strong>
          <small>Días</small>
        </span>
        <span>
          <strong>{padCountdownValue(countdown.hours)}</strong>
          <small>Horas</small>
        </span>
        <span>
          <strong>{padCountdownValue(countdown.minutes)}</strong>
          <small>Min</small>
        </span>
        <span>
          <strong>{padCountdownValue(countdown.seconds)}</strong>
          <small>Seg</small>
        </span>
      </div>
      <p>Los cupos se confirman por orden de inscripción.</p>
    </div>
  );
};

const renderMultiline = (text = '') =>
  String(text)
    .split('\n')
    .map((line, index, lines) => (
      <Fragment key={`${line}-${index}`}>
        {line}
        {index < lines.length - 1 ? <br /> : null}
      </Fragment>
    ));

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

const getFunnelReference = () => {
  if (typeof window === 'undefined') {
    return `PDC-INS-${generateReferenceCode()}`;
  }

  const storedReference = window.sessionStorage.getItem(FUNNEL_REFERENCE_KEY);
  if (storedReference) return storedReference;

  const reference = `PDC-INS-${generateReferenceCode()}`;
  window.sessionStorage.setItem(FUNNEL_REFERENCE_KEY, reference);
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

const getTrackingContext = () => ({
  ...getPageLocation(),
  ...PDC_CONTEXT,
  ...getStoredUtms(),
  first_touch_timestamp: getFirstTouchTimestamp(),
});

const pushDataLayer = (payload = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const buildPdcWhatsappMessage = (funnelReference) =>
  [
    'Hola, ya estuve viendo la información del PDC Diseño de Permacultura de Madre Selva y quiero avanzar con mi inscripción.',
    '',
    `Referencia: ${funnelReference}`,
  ].join('\n');

const generateWhatsappUrl = (funnelReference) =>
  `https://wa.me/${WHATSAPP_DESTINATION}?text=${encodeURIComponent(buildPdcWhatsappMessage(funnelReference))}`;

const getWhatsappTrackingUrl = () => `https://wa.me/${WHATSAPP_DESTINATION}`;

const getInitials = (name = '') =>
  String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

const PdcLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showDeferredContent, setShowDeferredContent] = useState(false);
  const { settings } = data;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (eventPageContextPushed) return;

    pushDataLayer({
      event: 'event_page_context',
      ...getTrackingContext(),
    });
    eventPageContextPushed = true;
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] },
  };

  const resolveSetting = (settingKey) => (settingKey ? settings?.[settingKey] || '' : '');

  const resolveValue = (item = {}, fallbackKey = 'value') => {
    const settingKey = dynamicValueKeys.find((key) => item?.[key]);

    if (settingKey) {
      return resolveSetting(item[settingKey]);
    }

    return item?.[fallbackKey] || item?.value || item?.title || item?.price || '';
  };

  const resolveImage = (imageName) => imageAssets[imageName] || imageName || '';

  const resolveAbsoluteImage = (imageName) => {
    const src = resolveImage(imageName);
    return src ? new URL(src, data.site.siteUrl).toString() : '';
  };

  const trackWhatsappClick = ({ ctaLocation, ctaText, element }) => {
    const funnelReference = getFunnelReference();
    const ctaUrl = generateWhatsappUrl(funnelReference);
    const trackingPayload = {
      ...getTrackingContext(),
      cta_location: ctaLocation,
      cta_text: ctaText,
      cta_type: 'whatsapp',
      cta_url: ctaUrl,
      ticket_category: TICKET_CATEGORY,
      funnel_reference: funnelReference,
      whatsapp_destination: WHATSAPP_DESTINATION,
      deduplication_scope: 'session_cta_location_ticket_category',
      landing_slug: data.tracking.landingSlug,
      campaign_type: data.tracking.campaignType,
      audience_profile: data.tracking.mainAudienceProfile,
      funnel_strategy: data.tracking.funnelStrategy,
    };

    if (element) {
      element.href = ctaUrl;
      element.dataset.funnelReference = funnelReference;
    }

    pushDataLayer({
      event: 'cta_click',
      ...trackingPayload,
    });

    const deduplicationKey = `${WHATSAPP_DEDUP_PREFIX}:${ctaLocation}:${TICKET_CATEGORY}`;
    const alreadyTracked =
      typeof window !== 'undefined' && window.sessionStorage.getItem(deduplicationKey) === 'true';

    if (!alreadyTracked) {
      pushDataLayer({
        event: 'click_whatsapp',
        ...trackingPayload,
      });

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(deduplicationKey, 'true');
      }
    }

    return ctaUrl;
  };

  const getWhatsappCtaProps = (ctaLocation) => {
    const ctaText = CTA_LABELS[ctaLocation] || CTA_LABELS.final;

    return {
      href: getWhatsappTrackingUrl(),
      target: '_blank',
      rel: 'noopener noreferrer',
      onClick: (event) => {
        trackWhatsappClick({
          ctaLocation,
          ctaText,
          element: event.currentTarget,
        });
      },
      'data-event-id': PDC_CONTEXT.event_id,
      'data-event-name': PDC_CONTEXT.event_name,
      'data-event-type': PDC_CONTEXT.event_type,
      'data-event-edition': PDC_CONTEXT.event_edition,
      'data-event-status': PDC_CONTEXT.event_status,
      'data-cta-location': ctaLocation,
      'data-cta-type': 'whatsapp',
      'data-ticket-category': TICKET_CATEGORY,
      'data-related-service': PDC_CONTEXT.related_service,
      'data-whatsapp-destination': WHATSAPP_DESTINATION,
    };
  };

  const Icon = ({ name, ...props }) => {
    const IconComponent = iconMap[name] || Leaf;
    return <IconComponent {...props} />;
  };

  const testimonials = data.testimonialsSection?.testimonials || [];
  const nextCohort = data.cohortsSection?.cohorts?.[0];
  return (
    <div className="pdc-landing">
      <SEOHelmet
        title={data.seo.title}
        description={data.seo.description}
        canonical={data.seo.canonical}
        image={resolveAbsoluteImage(data.seo.image)}
      />

      <header className={`pdc-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="pdc-header__wrapper">
          <a href={data.header.logoUrl} className="nav-logo">
            {data.header.logoText}
          </a>
          <a
            {...getWhatsappCtaProps('header')}
            className="btnPrimary btnPrimary--small"
          >
            {CTA_LABELS.header}
          </a>
        </div>
      </header>

      <section className="pdc-hero">
        <div className="pdc-hero__bg">
          <img
            src={resolveImage(data.hero.image)}
            alt="Participantes del Curso de Diseño en Permacultura (PDC) practicando permacultura en Madre Selva"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="pdc-hero__overlay" />

        <div className="pdc-hero__content">
          <motion.h1 className="pdc-title--hero" {...fadeInUp} transition={{ delay: 0.08 }}>
            {data.hero.title}
          </motion.h1>
          <motion.p className="pdc-hero__subtitle" {...fadeInUp} transition={{ delay: 0.16 }}>
            {data.hero.subtitle}
          </motion.p>
          <motion.div className="pdc-hero__actions" {...fadeInUp} transition={{ delay: 0.24 }}>
            <a
              {...getWhatsappCtaProps('hero')}
              className="btnPrimary pdc-hero__cta"
            >
              {CTA_LABELS.hero}
            </a>
          </motion.div>
          <motion.p className="pdc-hero__price-hint" {...fadeInUp} transition={{ delay: 0.32 }}>
            Fecha: <strong>{settings.programDates}</strong> · Inversión: <strong>{settings.programPrice}</strong>
          </motion.p>
        </div>
      </section>

      {showDeferredContent ? (
      <>
      <section className="pdc-hero-meta container">
        <motion.p className="pdc-hero__support" {...fadeInUp}>
          {data.hero.supportText}
        </motion.p>
        <motion.div className="pdc-info-bar pdc-info-bar--below" {...fadeInUp}>
          {data.hero.infoBar.map((item) => (
            <div className="pdc-info-bar__item" key={item.label}>
              <Icon name={item.icon} className="icon" size={24} />
              <div className="text">
                <span>{item.label}</span>
                <span>{resolveValue(item)}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="pdc-id-block container">
        <div className="id-grid">
          <motion.div {...fadeInUp}>
            <span className="section-label">{data.affinity.label}</span>
            <h2 className="editorial-title">{data.affinity.title}</h2>
          </motion.div>
          <div className="id-content">
            <motion.p className="editorial-lead" {...fadeInUp}>
              {data.affinity.lead}
            </motion.p>
            <motion.ul className="id-list" {...fadeInUp}>
              <li>
                <CheckCircle2 className="check" size={22} />
                <p>{data.affinity.warning}</p>
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      {data.threeDimensions?.items?.length ? (
        <section className="pdc-stats-grid container">
          <motion.div className="section-intro" {...fadeInUp}>
            <span className="section-label">{data.threeDimensions.label}</span>
            <h2 className="editorial-title">{data.threeDimensions.title}</h2>
            <p className="editorial-lead">{data.threeDimensions.lead}</p>
          </motion.div>

          <div className="axis-grid axis-grid--three">
            {data.threeDimensions.items.map((item, index) => (
              <motion.div
                key={item.title}
                className="axis-item"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="pdc-stats-grid container">
        <motion.div className="section-intro" {...fadeInUp}>
          <span className="section-label">{data.includes.label}</span>
          <h2 className="editorial-title">{data.includes.title}</h2>
          <p className="editorial-lead">{data.includes.lead}</p>
        </motion.div>

        <div className="stats-container">
          {data.includes.items.map((item, index) => (
            <motion.div
              key={item.value}
              className="stat-card"
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon">
                <Icon name={item.icon} size={28} />
              </div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
              <p className="stat-desc">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <main className="pdc-main-layout container">
        <div className="content-area">
          <motion.section className="card-editorial" {...fadeInUp}>
            <span className="section-label">{data.rolesSection.label}</span>
            <h2 className="editorial-title">{data.rolesSection.title}</h2>
            <p className="editorial-lead">{data.rolesSection.lead}</p>

            <div className="axis-grid">
              {data.rolesSection.roles.map((axis, index) => (
                <div className="axis-item" key={axis.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{axis.title}</h3>
                  <p>{axis.description}</p>
                </div>
              ))}
            </div>

            <p className="axis-note">{data.rolesSection.note}</p>
          </motion.section>

        </div>

        <aside className="sidebar-area">
          <motion.div
            className="booking-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="booking-price-highlight">
              <div className="booking-price-highlight__row booking-price-highlight__row--final">
                <span>Valor del curso</span>
                <strong>{settings.programPrice}</strong>
              </div>
              <p>
                La inscripción queda confirmada una vez realizado el pago correspondiente y enviado el comprobante.
              </p>
            </div>

            <BookingCountdown startsAt={nextCohort?.startsAt} />

            <a
              {...getWhatsappCtaProps('sticky_sidebar')}
              className="btnPrimary btnPrimary--wide booking-card__primary-cta"
            >
              {CTA_LABELS.sticky_sidebar}
            </a>

            <span className="section-label">{data.sidebar.label}</span>
            <ul className="booking-list">
              {data.sidebar.items.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong>
                  <span>{resolveValue(item)}</span>
                </li>
              ))}
            </ul>

            <p className="booking-description">{data.sidebar.description}</p>

            <span className="section-label section-label--process">{data.sidebar.processLabel}</span>
            <div className="process-list">
              {data.sidebar.process.map((step, index) => (
                <p key={step}>
                  <strong>{index + 1}.</strong> {step}
                </p>
              ))}
            </div>
          </motion.div>
        </aside>
      </main>

      <section className="container">
        <motion.section className="card-editorial card-editorial--dark card-editorial--focus" {...fadeInUp}>
          <span className="section-label">{data.formation.label}</span>
          <h2 className="editorial-title">{renderMultiline(data.formation.title)}</h2>
          <p className="editorial-lead">{data.formation.lead}</p>
          {data.formation.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="highlight-text">{data.formation.highlight}</p>
        </motion.section>
      </section>

      {data.facilitatorsSection?.items?.length ? (
        <section className="container">
          <motion.section className="card-editorial card-editorial--focus" {...fadeInUp}>
            <span className="section-label">{data.facilitatorsSection.label}</span>
            <h2 className="editorial-title">{data.facilitatorsSection.title}</h2>
            <p className="editorial-lead">{data.facilitatorsSection.lead}</p>
            <div className="axis-grid">
              {data.facilitatorsSection.items.map((item) => (
                <div className="axis-item" key={item.name}>
                  <span>{item.role}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            {data.facilitatorsSection.highlight ? (
              <p className="inline-highlight">
                <CheckCircle2 size={16} />
                {data.facilitatorsSection.highlight}
              </p>
            ) : null}
          </motion.section>
        </section>
      ) : null}

      {data.locationSection ? (
        <section className="container">
          <motion.section className="card-editorial card-editorial--dark card-editorial--focus" {...fadeInUp}>
            <span className="section-label">{data.locationSection.label}</span>
            <h2 className="editorial-title">{data.locationSection.title}</h2>
            <p className="editorial-lead">{data.locationSection.lead}</p>
            {data.locationSection.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {data.locationSection.highlight ? (
              <p className="highlight-text">{data.locationSection.highlight}</p>
            ) : null}
          </motion.section>
        </section>
      ) : null}

      {data.offerSection?.priceCards?.length ? (
        <section className="container pdc-offer-section">
          <motion.section className="card-editorial card-editorial--focus" {...fadeInUp}>
            <span className="section-label">{data.offerSection.label}</span>
            <h2 className="editorial-title">{data.offerSection.title}</h2>
            <p className="editorial-lead">{data.offerSection.lead}</p>
            <div className={`price-grid ${data.offerSection.priceCards.length === 1 ? 'price-grid--single' : ''}`}>
              {data.offerSection.priceCards.map((card) => (
                <div className="price-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{resolveValue(card)}</strong>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
            {data.offerSection.conditions?.length ? (
              <ul className="id-list conditions-list">
                {data.offerSection.conditions.map((condition) => (
                  <li key={condition}>
                    <CheckCircle2 className="check" size={20} />
                    <p>{condition}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.section>
        </section>
      ) : null}

      {(data.accommodationSection || data.paymentSection) ? (
        <section className="container pdc-logistics-section">
          <div className="pdc-logistics-grid">
            {data.accommodationSection ? (
              <motion.section className="card-editorial logistics-card" {...fadeInUp}>
                <span className="section-label">{data.accommodationSection.label}</span>
                <h2 className="editorial-title">{data.accommodationSection.title}</h2>
                <p className="editorial-lead">{data.accommodationSection.lead}</p>
                {data.accommodationSection.baseOption ? (
                  <div className="option-card">
                    <h3>{data.accommodationSection.baseOption.title}</h3>
                    <ul>
                      {data.accommodationSection.baseOption.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {data.accommodationSection.extraOptions?.map((option) => (
                  <div className="option-card option-card--extra" key={option.title}>
                    <h3>{option.title}</h3>
                    <strong>{resolveValue(option, 'price')}</strong>
                    <p>{option.availability}</p>
                    <ul>
                      {option.includes?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.section>
            ) : null}

            {data.paymentSection ? (
              <motion.section className="card-editorial logistics-card" {...fadeInUp}>
                <span className="section-label">{data.paymentSection.label}</span>
                <h2 className="editorial-title">{data.paymentSection.title}</h2>
                <p className="editorial-lead">{data.paymentSection.lead}</p>
                <div className="payment-grid">
                  {data.paymentSection.items?.map((item) => (
                    <div className="payment-card" key={item.label}>
                      <CreditCard size={24} />
                      <span>{item.label}</span>
                      <strong>{resolveValue(item)}</strong>
                    </div>
                  ))}
                </div>
                <a
                  {...getWhatsappCtaProps('payment')}
                  className="btnPrimary btnPrimary--wide logistics-cta"
                >
                  {CTA_LABELS.payment}
                </a>
              </motion.section>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="container spaced-section">
        <div className="pdc-filters-block">
          <div className="filters-container">
            <motion.div id={data.filters.positive.id} className="filter-card filter-card--pos" {...fadeInUp}>
              <h3>{data.filters.positive.title}</h3>
              <ul>
                {data.filters.positive.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div className="filter-card filter-card--neg" {...fadeInUp}>
              <h3>{data.filters.negative.title}</h3>
              <ul>
                {data.filters.negative.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{data.filters.negative.note}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {testimonials.length ? (
      <section className="pdc-testimonials">
        <div className="container">
          <div className="section-header">
            <motion.span className="section-label" {...fadeInUp}>
              {data.testimonialsSection.label}
            </motion.span>
            <motion.h2 className="editorial-title" {...fadeInUp}>
              {data.testimonialsSection.title}
            </motion.h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => {
              const testimonialImage = resolveImage(testimonial.image);

              return (
                <motion.article
                  key={testimonial.name}
                  className="testimonial-card"
                  tabIndex={0}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`testimonial-card__media ${
                      testimonialImage ? '' : 'testimonial-card__media--empty'
                    }`}
                  >
                    {testimonialImage ? (
                      <img src={testimonialImage} alt={testimonial.name} loading="lazy" />
                    ) : (
                      <div className="testimonial-placeholder" aria-label="Foto pendiente">
                        <span>{getInitials(testimonial.name) || 'CDP'}</span>
                        <small>Foto pendiente</small>
                      </div>
                    )}
                  </div>
                  <div className="testimonial-card__content">
                    <div className="stars">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, starIndex) => (
                        <Star key={starIndex} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <h3>{testimonial.name}</h3>
                    <span>{testimonial.title}</span>
                    <p>{testimonial.quote}</p>
                    {testimonial.link ? (
                      <a href={testimonial.link} target="_blank" rel="noopener noreferrer">
                        {testimonial.handle}
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      <section className="pdc-faq container">
        <div className="section-intro">
          <span className="section-label">{data.faqSection.label}</span>
          <h2 className="editorial-title">{data.faqSection.title}</h2>
        </div>
        <div className="faq-container">
          {data.faqSection.items.map((faq, index) => (
            <div key={faq.question} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
              <button
                className="faq-item__trigger"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <Plus
                  size={20}
                  className="icon"
                  style={{ transform: openFaq === index ? 'rotate(45deg)' : 'none' }}
                />
              </button>
              {openFaq === index ? <div className="faq-item__content">{faq.answer}</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section id={data.application.id} className="pdc-application">
        <div className="container">
          <motion.div {...fadeInUp} className="application-content">
            <span className="section-label">{data.application.label}</span>
            <h2 className="editorial-title">{data.application.title}</h2>
            <p className="editorial-lead application-lead">{data.application.intro}</p>

            <div className="investment-box">
              <p>
                <strong>{data.application.investmentLabel}:</strong> {resolveSetting('programPrice')}
              </p>
              <span>{data.application.investmentDescription}</span>
            </div>

            <a
              {...getWhatsappCtaProps('final')}
              className="btnPrimary"
            >
              {CTA_LABELS.final}
            </a>

            <p className="application-note">{data.application.note}</p>

            <div className="application-closing">
              <h3>{data.application.closing.title}</h3>
              <p>{data.application.closing.text}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="pdc-footer">
        <div className="container">
          <span className="footer-logo">{data.footer.logo}</span>
          <p>{data.footer.copy}</p>
        </div>
      </footer>
      </>
      ) : null}
    </div>
  );
};

export default PdcLanding;
