import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// ------------------------------
// 📂 SEO y Meta
// Importaciones de componentes relacionados con SEO y metadata
import SEOHelmet from '../../components/seo/SEOHelmet/SEOHelmet';


// ------------------------------
// 📂 Layout
// Componentes que forman la estructura y navegación principal (header, footer, nav, etc.)
import Header from '../../components/layout/header/header';


// ------------------------------
// 📂 Secciones
// Bloques grandes o secciones completas que conforman las páginas
import Bitacora from '../../components/seccion/bitacora/bitacora';
import CtaHablemos from '../../components/seccion/cta_hablemos/cta_hablemos';
import MessageFinal from '../../components/seccion/message_final/message_final';
import FadeInOnView from '../../components/seccion/fadeInOnView/fadeInOnView';


// ------------------------------
// 📂 UI / Componentes visuales pequeños y reutilizables
import LineLogoSeparacion from '../../components/ui/line_logo_separacion/line_logo_separacion';


// ------------------------------
// 📂 Maps
// Componentes relacionados con mapas y geolocalización

// ------------------------------
// 📂 Tracking
// Funciones y componentes para seguimiento de usuario y analytics

// ------------------------------
// 📂 Context
// Archivos relacionados con Context API para manejo global de estados

// ------------------------------
// 📂 Hooks
// Hooks personalizados para reutilización de lógica

// ------------------------------
// 📂 Services
// Funciones para llamadas a APIs y lógica de negocio

// ------------------------------
// 📂 Utils
// Funciones auxiliares y helpers

// ------------------------------
// 📂 Styles
// Estilos globales, variables SCSS y temas
import './home.scss';

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeInProps = {
  direction: "up",
  duration: prefersReducedMotion ? 0 : 800,
  delay: prefersReducedMotion ? 0 : 200,
  distance: prefersReducedMotion ? 0 : 30,
  easing: prefersReducedMotion ? 'linear' : "bounce",
  speed: prefersReducedMotion ? 'fast' : "slow"
};

// SEO: Datos estructurados para Schema.org
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Movimiento Naluum",
  "description": "Movimiento que impulsa soluciones regenerativas para transformar vidas, conectar comunidades y sanar la Tierra",
  "url": "https://movimientonaluum.org",
  "logo": new URL('/img/branding/logo-naluum-transparente.svg', window.location.origin).href,
  "sameAs": [
    "https://www.facebook.com/movimientonaluum",
    "https://www.instagram.com/movimientonaluum",
    "https://www.linkedin.com/company/movimientonaluum"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["es"]
  }
};

// SEO: Datos estructurados para breadcrumbs
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Inicio",
    "item": "https://movimientonaluum.org"
  }]
};

const communityVoices = [
  {
    name: 'Claudia',
    context: 'Selva Adentro · Madre Selva',
    quote: 'Sentís una energía especial con el lugar, la tierra y las personas. Ves la vida misma crecer mientras aprendes.',
  },
  {
    name: 'Ayelén',
    context: 'Selva Adentro · Madre Selva',
    quote: 'Me llevo muchísimas herramientas para aplicar en la práctica de la permacultura. Me sentí contenida y muy a gusto en todo el proceso.',
  },
  {
    name: 'Iara',
    context: 'Yerba Mate Madre Selva',
    quote: 'Es hermoso ver todo el proceso, desde el crecimiento en las agroflorestas hasta el sapecado y poder probarlo. Me gustó ver cómo algo que viene generalmente empaquetado tiene todo un proceso hasta llegar al consumo.',
  },
];

const Home = () => {

  const [festivalTimeLeft, setFestivalTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [leavingVoiceIndex, setLeavingVoiceIndex] = useState(null);

  useEffect(() => {
    const targetDate = new Date('2026-09-21T00:00:00');
    const updateFestivalTimer = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference <= 0) {
        setFestivalTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setFestivalTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    updateFestivalTimer();
    const intervalId = setInterval(updateFestivalTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timeoutId = window.setTimeout(() => {
      setLeavingVoiceIndex(activeVoiceIndex);
      setActiveVoiceIndex((activeVoiceIndex + 1) % communityVoices.length);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [activeVoiceIndex]);

  // SEO: Inyectar datos estructurados en el head
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (breadcrumbScript.parentNode) breadcrumbScript.parentNode.removeChild(breadcrumbScript);
    };
  }, []);

  return (
    <main className='home__container' aria-label="Página principal" itemScope itemType="https://schema.org/WebPage">
      <SEOHelmet 
        title="Movimiento Naluum | Soluciones Regenerativas para un Futuro Sostenible"
        description="Descubre cómo el Movimiento Naluum impulsa soluciones regenerativas para transformar vidas, conectar comunidades y sanar la Tierra. Capacitaciones, productos ecológicos y diseño permacultural."
        keywords="regeneración, permacultura, agricultura regenerativa, soluciones sostenibles, educación ambiental, comunidad sustentable, diseño regenerativo, tecnología social, agroecología, desarrollo sostenible"
        author="Movimiento Naluum"
        url="https://movimientonaluum.org"
        image="/img/branding/logo-naluum-transparente.svg"
        type="website"
        locale="es_ES"
        siteName="Movimiento Naluum"
      />
      
      {/* SEO: Meta tags adicionales */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href="https://movimientonaluum.org" />
      
      <Header>
        <div className="home__hero">
          <div className="home__hero-media" aria-hidden="true">
            <img
              src="/img/hero/brote-regeneracion.webp"
              alt=""
              className="home__hero-image"
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="1080"
            />
          </div>
          <div className="home__hero-overlay" aria-hidden="true" />
          <div className="home__hero-inner">
            <div className="home__hero-content">
              <p className="home__hero-brand" itemProp="name">Movimiento Naluum</p>
              <h1 itemProp="headline">
                Regenerar la vida, desde el <span className="home__hero-highlight">territorio</span>
              </h1>
              <p className="home__hero-description" itemProp="description">
                Formación, comunidad y experiencias vivas para aprender a habitar la Tierra de otra manera.
              </p>
              <nav className="home__hero-actions" aria-label="Acciones principales">
                <Link className="home__hero-cta home__hero-cta--primary" to="/servicios">
                  Explorar propuestas
                </Link>
                <Link className="home__hero-cta home__hero-cta--secondary" to="/sobre-nosotros">
                  Conocer nuestra historia
                </Link>
              </nav>
            </div>
          </div>
          <img
            className="home__hero-signature"
            src="/img/branding/logo-naluum-transparente.svg"
            alt=""
            aria-hidden="true"
            width="500"
            height="500"
            loading="eager"
          />
        </div>
      </Header>

      <section className="home__ecosystem-intro" aria-labelledby="home-ecosystem-title">
        <div className="home__ecosystem-intro__inner">
          <div className="home__ecosystem-intro__heading">
            <h2 id="home-ecosystem-title">Un movimiento, distintas formas de regenerar</h2>
          </div>

          <div className="home__ecosystem-intro__body">
            <div className="home__ecosystem-intro__copy">
              <p>Movimiento Naluum conecta <strong>personas, saberes y territorios</strong> alrededor de una misma intención: aprender a vivir de una forma más <strong>consciente, comunitaria y regenerativa</strong>.</p>
              <p>A través de <strong>procesos educativos</strong>, experiencias prácticas y proyectos vinculados con la <strong>permacultura</strong>, el movimiento busca transformar la manera en que habitamos, aprendemos y nos relacionamos con la Tierra.</p>
            </div>

            <ol className="home__ecosystem-intro__axes">
              <li><span>Aprender.</span></li>
              <li><span>Vivir el territorio.</span></li>
              <li><span>Tejer comunidad.</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section className='home__content' itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content="Movimiento Naluum" />
        <meta itemProp="description" content="Organización dedicada a impulsar soluciones regenerativas" />

        <section className="home__history" aria-labelledby="home-history-title">
          <div className="home__history-inner">
            <div className="home__history-heading">
              <p className="home__history-eyebrow">QUÉ ES EL MOVIMIENTO NALU’UM</p>
              <h2 id="home-history-title">Una red global de regeneración</h2>
              <div className="home__history-intro">
                <p>Lo que comenzó como un <strong>instituto de permacultura</strong> en el <strong>Caribe mexicano</strong> se transformó en un <strong>movimiento mundial</strong>.</p>
                <p>Hoy conecta grupos locales, redes nacionales y alianzas continentales, con una visión basada en el respeto por los <strong>saberes ancestrales</strong>, la <strong>regeneración de los territorios</strong> y la abundancia para todas las formas de vida.</p>
              </div>
            </div>

            <div className="home__history-body">
              <figure className="home__history-media">
                <img
                  src="/img/sections/equipo-global.webp"
                  alt="Personas trabajando con plantas en un espacio de aprendizaje"
                  width="1200"
                  height="800"
                  loading="lazy"
                />
              </figure>
              <p className="home__history-identity">Aprender, cuidar y regenerar en comunidad.</p>
            </div>
            <Link className="home__history-cta" to="/sobre-nosotros">Conocer nuestra historia</Link>
          </div>
        </section>

        <section className="home__proposals" aria-labelledby="home-proposals-title">
          <div className="home__proposals-inner">
            <header className="home__proposals-intro">
              <p className="home__proposals-eyebrow">PROPUESTAS DESTACADAS</p>
              <h2 id="home-proposals-title">Experiencias que nacen del territorio</h2>
              <p>Una selección de experiencias y productos para aprender, encontrarse y acercarse a una forma regenerativa de habitar la Tierra.</p>
            </header>

            <div className="home__proposals-grid">
              <article className="home__proposal-card home__proposal-card--selva">
                <span className="home__proposal-badge">RECOMENDADO</span>
                <div className="home__proposal-card-content"><h3>Selva Adentro</h3><p className="home__proposal-type">EXPERIENCIA FORMATIVA</p><p>Una experiencia inmersiva de aprendizaje, convivencia y práctica entre agricultura, bioconstrucción, arte y territorio.</p><Link className="home__proposal-cta" to="/selva-adentro">Ver experiencia</Link></div>
                <figure><img src="/img/shared/bitacora-madre-selva.webp" alt="Personas reunidas en una experiencia compartida en territorio" loading="lazy" /></figure>
              </article>
              <article className="home__proposal-card home__proposal-card--festival">
                <div className="home__proposal-event-meta"><span>PRÓXIMO ENCUENTRO</span><span className="home__proposal-timer" aria-label="Cuenta regresiva para el Festival Ecos de la Tierra">{String(festivalTimeLeft.days).padStart(2, '0')}d : {String(festivalTimeLeft.hours).padStart(2, '0')}h : {String(festivalTimeLeft.minutes).padStart(2, '0')}m : {String(festivalTimeLeft.seconds).padStart(2, '0')}s</span></div>
                <div className="home__proposal-card-content"><h3>Festival Ecos de la Tierra</h3><p className="home__proposal-type">ENCUENTRO</p><p>Un encuentro cultural y comunitario para compartir expresiones, aprendizajes y formas regenerativas de habitar la Tierra.</p><Link className="home__proposal-cta" to="/servicios/festival-eco-de-la-tierra">Conocer el festival</Link></div>
                <figure><img src="/img/hero/hero-festival-eco-de-la-tierra.webp" alt="Personas reunidas al aire libre durante un encuentro comunitario" loading="lazy" /></figure>
              </article>
              <article className="home__proposal-card home__proposal-card--product">
                <div className="home__proposal-card-content"><h3>Yerba Mate Madre Selva</h3><p className="home__proposal-type">PRODUCTO DEL TERRITORIO</p><p>Yerba mate agroecológica vinculada con el cuidado de la tierra, los procesos artesanales y la producción regenerativa.</p><Link className="home__proposal-cta" to="/productos/yerba-mate-organica">Ver producto</Link></div>
                <figure><img src="/img/shared/mate-yerba-organica.webp" alt="Persona preparando mate al aire libre" loading="lazy" /></figure>
              </article>
            </div>
            <Link className="home__proposals-cta" to="/servicios">Explorar todos los servicios</Link>
          </div>
        </section>

        <section className="home__impact" aria-labelledby="home-impact-title">
          <div className="home__impact-inner">
            <header className="home__impact-intro">
              <p className="home__impact-eyebrow">IMPACTO</p>
              <h2 id="home-impact-title">Regenerar también es dejar huella</h2>
              <p className="home__impact-lede">El movimiento se construye a través de proyectos, territorios, comunidades y procesos de aprendizaje que continúan creciendo.</p>
              <div className="home__impact-signature" aria-hidden="true">
                <img src="/img/branding/logo-naluum-transparente.svg" alt="" />
              </div>
            </header>

            <ol className="home__impact-list">
              <li className="home__impact-item">
                <span className="home__impact-number" aria-label="Más de 50">+50</span>
                <h3>Proyectos en marcha</h3>
                <p>Iniciativas activas vinculadas con la regeneración.</p>
              </li>
              <li className="home__impact-item home__impact-item--featured">
                <div className="home__impact-number-group"><span className="home__impact-number" aria-label="Más de 5.000">+5.000</span><span className="home__impact-unit">hectáreas</span></div>
                <h3>Territorios regenerados</h3>
                <p>Tierra acompañada en procesos de restauración y cuidado.</p>
              </li>
              <li className="home__impact-item">
                <span className="home__impact-number" aria-label="Más de 15">+15</span>
                <h3>Comunidades beneficiadas</h3>
                <p>Comunidades involucradas en prácticas sostenibles.</p>
              </li>
              <li className="home__impact-item">
                <span className="home__impact-number" aria-label="Más de 500">+500</span>
                <h3>Talleres realizados</h3>
                <p>Instancias de formación y educación ambiental.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="home__madre-selva" aria-labelledby="home-madre-selva-title">
          <div className="home__madre-selva-inner">
            <div className="home__madre-selva-copy">
              <p className="home__madre-selva-eyebrow">MADRE SELVA</p>
              <div className="home__madre-selva-intro">
                <div className="home__madre-selva-primary-copy">
                  <h2 id="home-madre-selva-title">Un territorio vivo para aprender haciendo</h2>
                  <p>En Misiones, Madre Selva es una expresión concreta del ecosistema Naluum: un espacio donde la tierra, la práctica y la vida en comunidad forman parte de una misma experiencia de aprendizaje.</p>
                </div>
                <div className="home__madre-selva-closing-copy">
                  <p>Agricultura, bioconstrucción y procesos cotidianos se encuentran en un territorio que funciona como escuela viva.</p>
                  <Link className="home__madre-selva-cta" to="/proyectos/madre-selva">Conocer el proyecto</Link>
                </div>
              </div>
            </div>

            <figure className="home__madre-selva-main-media">
              <img
                src="/img/shared/ecocentro-madre-selva.webp"
                alt="Paisaje selvático del territorio de Madre Selva"
                width="1200"
                height="675"
                loading="lazy"
              />
              <img
                className="home__madre-selva-logo"
                src="/img/branding/logo-madre-selva-horizontal-blanco.png"
                alt="Madre Selva"
                width="800"
                height="800"
                loading="lazy"
              />
            </figure>
          </div>
        </section>
 
        <section className="home__transformation" aria-labelledby="transformacion-title">
          <FadeInOnView {...fadeInProps}>
            <div className="home__transformation-inner">
              <header className="home__transformation-header">
                <p className="home__transformation-eyebrow">TRANSFORMACIÓN EN EL TERRITORIO</p>
                <h2 id="transformacion-title">Un mismo lugar, otra forma de habitarlo</h2>
                <p>La regeneración se vuelve visible cuando el cuidado del territorio, el aprendizaje y el trabajo sostenido forman parte de un mismo proceso.</p>
                <p className="home__transformation-support">Estas imágenes muestran el mismo espacio en dos momentos distintos.</p>
              </header>

              <div className="home__transformation-comparison" role="group" aria-label="Comparación del mismo espacio en Madre Selva">
                <figure className="home__transformation-frame">
                  <img src="/img/home/madre-selva-antes.jpg" alt="Vista anterior del mismo espacio en Madre Selva" width="1204" height="1600" loading="lazy" />
                  <figcaption>Antes</figcaption>
                </figure>
                <figure className="home__transformation-frame">
                  <img src="/img/home/madre-selva-despues.jpg" alt="Vista posterior del mismo espacio en Madre Selva" width="1204" height="1600" loading="lazy" />
                  <figcaption>Después</figcaption>
                </figure>
              </div>
            </div>
          </FadeInOnView>
        </section>

        <section className="home__voices" aria-labelledby="voces-title">
          <FadeInOnView {...fadeInProps}>
            <div className="home__voices-inner">
              <header className="home__voices-header">
                <p className="home__voices-eyebrow">VOCES DE LA COMUNIDAD</p>
                <h2 id="voces-title">Experiencias que dejan huella</h2>
              </header>

              <div className="home__voices-stage" aria-live="polite" aria-atomic="true">
                {communityVoices.map((voice, index) => {
                  const isActive = index === activeVoiceIndex;
                  const isLeaving = index === leavingVoiceIndex;
                  const voiceClassName = [
                    'home__voices-quote',
                    isActive && 'home__voices-quote--active',
                    isLeaving && 'home__voices-quote--leaving',
                  ].filter(Boolean).join(' ');

                  return (
                    <figure className={voiceClassName} aria-hidden={!isActive} key={voice.name}>
                      <blockquote>{voice.quote}</blockquote>
                      <figcaption>
                        <cite>{voice.name}</cite>
                        <span>{voice.context}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </FadeInOnView>
        </section>

        <section className='home__content--bitacora' aria-labelledby="bitacora-title">
          <FadeInOnView {...fadeInProps}>
            <h2 id="bitacora-title" className="visually-hidden">Bitácora del Movimiento</h2>
            <Bitacora />
          </FadeInOnView>
        </section>

        <LineLogoSeparacion />

        <section className='home__content--boletin' id='boletin' aria-labelledby="boletin-title">
          <FadeInOnView {...fadeInProps}>
            <h2 id="boletin-title" className="visually-hidden">Suscríbete a nuestro boletín</h2>
            <CtaHablemos showSocialMedia={false} />
          </FadeInOnView>
        </section>

        {/* <LineLogoSeparacion /> */}

        <section className='home__content--message_final' aria-labelledby="mensaje-final-title">
          <FadeInOnView {...fadeInProps}>
            {/* <h2 id="mensaje-final-title" className="visually-hidden">Mensaje de cierre</h2> */}
            <MessageFinal indexMessage={0} />
          </FadeInOnView>
        </section>

        <LineLogoSeparacion />
      </section>

      {/* SEO: CSS para ocultar visualmente pero mantener accesible para screen readers */}
      <style>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </main>
  );
};

export default Home;
