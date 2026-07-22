import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// ------------------------------
// 📂 SEO y Meta
import SEOHelmet from '../../components/seo/SEOHelmet/SEOHelmet';

// ------------------------------
// 📂 Layout
import Header from '../../components/layout/header/header';
import FadeInOnView from '../../components/seccion/fadeInOnView/fadeInOnView';

// ------------------------------
// 📂 Secciones - Lazy Loading para mejor performance
const Founders = lazy(() => import('../../components/seccion/founders/founders'));
const Valores = lazy(() => import('../../components/seccion/valores/valores'));
  
// ------------------------------
// 📂 UI
// import Button from '../../components/ui/button/button';

// ------------------------------
// 📂 Styles
import './aboutMe.router.scss';

// Loading component para Suspense
const LoadingFallback = () => (
  <div className="loading-fallback" aria-label="Cargando contenido">
    <span className="sr-only">Cargando...</span>
  </div>
);

// Configuración de animaciones con preferencias de accesibilidad
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeInProps = {
  direction: "up",
  duration: prefersReducedMotion ? 0 : 800,
  delay: prefersReducedMotion ? 0 : 200,
  distance: prefersReducedMotion ? 0 : 30,
  easing: prefersReducedMotion ? 'linear' : "bounce",
  speed: prefersReducedMotion ? 'fast' : "slow"
};

const impactMetrics = [
  { label: 'Proyectos en marcha', value: '+50' },
  { label: 'hectáreas regeneradas', value: '+5.000' },
  { label: 'Comunidades beneficiadas', value: '+15' },
  { label: 'Talleres realizados', value: '+500' },
];

const aboutCanonical = 'https://movimientonaluum.org/sobre-nosotros';
const aboutDescription = 'Conocé Movimiento Naluum: una historia de aprendizaje, comunidad y regeneración que nació en Noh Bec y creció a través de territorios, proyectos y personas.';

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${aboutCanonical}#aboutpage`,
      url: aboutCanonical,
      name: 'Sobre Movimiento Naluum | Permacultura, comunidad y regeneración',
      description: aboutDescription,
      inLanguage: 'es-AR',
      about: { '@id': 'https://movimientonaluum.org/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${aboutCanonical}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: 'https://movimientonaluum.org/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sobre Movimiento Naluum',
          item: aboutCanonical,
        },
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://movimientonaluum.org/#organization',
      name: 'Movimiento Naluum',
      url: 'https://movimientonaluum.org/',
    },
  ],
};

const AboutMe = () => {
  return (
    <>
      <SEOHelmet
        title="Sobre Movimiento Naluum | Permacultura, comunidad y regeneración"
        description={aboutDescription}
        canonical={aboutCanonical}
        robots="index, follow"
        url={aboutCanonical}
        type="website"
        locale="es_AR"
        siteName="Movimiento Naluum"
        image="https://movimientonaluum.org/img/hero/sobre-nosotros.webp"
        imageAlt="Historia, territorio y comunidad de Movimiento Naluum"
        imageWidth="1920"
        imageHeight="1282"
        jsonLd={aboutJsonLd}
      />

      {/* Contenedor principal con semántica mejorada */}
      <main className='aboutMe__container' role="main" aria-label="Contenido principal sobre Naluum">
        
        {/* Hero editorial */}
        <Header>
          <section className='aboutMe__hero' aria-labelledby="about-hero-title">
            <img 
              src="/img/hero/sobre-nosotros.webp"
              alt=""
              className="aboutMe__hero-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1920"
              height="1282"
            />
            <div className="aboutMe__hero-overlay" aria-hidden="true" />
            <div className="aboutMe__hero-content">
              <p className="aboutMe__hero-eyebrow">Movimiento Naluum</p>
              <h1 id="about-hero-title">Naluum</h1>
              <p className="aboutMe__hero-lead">
                Una historia de regeneración planetaria que comenzó con un descubrimiento y se convirtió en la esperanza de millones
              </p>
              <a className="aboutMe__hero-cta" href="#nuestra-historia">
                Descubre nuestra historia
              </a>
            </div>
          </section>
        </Header>

        {/* Contenido principal con secciones semánticas */}
        <div className='aboutMe__content'>
          
          <section id="nuestra-historia" className="about-origin" aria-labelledby="about-origin-title">
            <div className="about-origin__inner">
              <div className="about-origin__year-column">
                <p className="about-origin__chapter">CAPÍTULO I</p>
                <p className="about-origin__year" aria-label="Año 1998">1998</p>
              </div>

              <div className="about-origin__content">
                <h2 id="about-origin-title">El Sueño Original</h2>
                <p>
                  En una comunidad maya de Noh Bec, Riviera Maya, el maestro Tierra Martínez, de origen argentino, concibe el primer instituto de permacultura.
                </p>
                <p>
                  Naluum, que significa <strong>Madre Tierra</strong> en maya yucateco, nace como un susurro ancestral que conecta sabiduría milenaria con necesidades modernas de regeneración territorial.
                </p>
                <p className="about-origin__milestone">Nacimiento del concepto Naluum</p>
              </div>

              <figure className="about-origin__media">
                <img
                  src="/img/shared/curso-diseno-permacultura.webp"
                  alt="Personas reunidas en un espacio de aprendizaje en comunidad"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="800"
                />
              </figure>
            </div>
          </section>

          <section className="about-journey" aria-labelledby="about-journey-title">
            <div className="about-journey__inner">
              <div className="about-journey__content">
                <p className="about-journey__chapter">CAPÍTULO II</p>
                <p className="about-journey__period">2000–2007</p>
                <h2 id="about-journey-title">El Viaje Transformador</h2>
                <p>
                  Después de relocalizarse en Playa del Carmen, distintas situaciones de vida impulsan a la familia a iniciar un viaje por diferentes países y ecosistemas.
                </p>
                <p>
                  Durante ese recorrido nacen sus hijas: una en México y otra en República Dominicana.
                </p>
                <p>
                  Este viaje sin retorno les enseña que no se trata de regresar al mismo lugar, sino de no volver a ver el mundo de la misma forma.
                </p>
                <p className="about-journey__milestone">7 años de aprendizaje mundial</p>
              </div>

              <figure className="about-journey__media">
                <img
                  src="/img/shared/personas-trabajando.webp"
                  alt="Personas trabajando juntas bajo una estructura al aire libre"
                  loading="lazy"
                  decoding="async"
                  width="1080"
                  height="720"
                />
              </figure>
            </div>
          </section>

          <section className="about-itinerant" aria-labelledby="about-itinerant-title">
            <div className="about-itinerant__inner">
              <div className="about-itinerant__content">
                <p className="about-itinerant__chapter">CAPÍTULO III</p>
                <p className="about-itinerant__period">2008–2015</p>
                <h2 id="about-itinerant-title">Instituto Itinerante</h2>
                <p>
                  Nace una metodología transformadora: Naluum se convierte en un instituto itinerante de diseño de permacultura.
                </p>
                <p>
                  Viajan por montañas, bosques, mares y selvas, llevando permacultura a lugares donde era necesaria pero inaccesible.
                </p>
                <p>
                  En ese camino integran bioconstrucción, agricultura sintrópica, diseño hidrológico y permacultura social, junto con el rescate de saberes ancestrales como base espiritual.
                </p>
                <p className="about-itinerant__milestone">Metodología itinerante revolucionaria</p>
              </div>

              <figure className="about-itinerant__media">
                <img
                  src="/img/services/curso-certificado-diseno-permacultura-naluum-pdc.webp"
                  alt="Personas reunidas alrededor de materiales de trabajo en un espacio interior"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="798"
                />
              </figure>
            </div>
          </section>

          <section className="about-roots" aria-labelledby="about-roots-title">
            <div className="about-roots__inner">
              <p className="about-roots__chapter">CAPÍTULO IV</p>

              <div className="about-roots__content">
                <h2 id="about-roots-title">Raíces en la Selva</h2>
                <p>Se establece el Ecocentro Madre Selva en Misiones, Argentina.</p>
                <p>
                  Un proyecto demostrativo de 22 hectáreas que transforma suelos degradados en un sistema regenerativo funcional.
                </p>
                <p>
                  La metodología Na Lu&apos;um se consolida como una propuesta holística que conecta permacultura con espiritualidad ancestral, llenando el vacío que existía en los diseños tradicionales.
                </p>
                <p className="about-roots__milestone">Ecocentro Madre Selva establecido</p>
              </div>

              <p className="about-roots__period">2016–2020</p>

              <figure className="about-roots__media">
                <img
                  src="/img/shared/ecocentro-madre-selva.webp"
                  alt="Vegetación densa en un paisaje montañoso"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="675"
                />
              </figure>
            </div>
          </section>

          <section className="about-recognition" aria-labelledby="about-recognition-title">
            <div className="about-recognition__inner">
              <header className="about-recognition__header">
                <p className="about-recognition__chapter">CAPÍTULO V</p>
                <p className="about-recognition__year">2022</p>
                <h2 id="about-recognition-title">Reconocimiento Internacional</h2>
              </header>

              <div className="about-recognition__content">
                <p>Madre Selva se convierte en anfitrión del Encuentro Internacional de Permacultura 2022.</p>
                <p>Naluum es reconocido como parte del Consejo Internacional de Permacultura.</p>
                <p>
                  La metodología que comenzó como un sueño de cuidado se convierte en una realidad reconocida mundialmente por su enfoque integral y transformador.
                </p>
                <p className="about-recognition__milestone">Consejo Internacional de Permacultura</p>
              </div>

              <figure className="about-recognition__media">
                <img
                  src="/img/shared/comunidad-circulo.webp"
                  alt="Personas tomadas de las manos al aire libre"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="675"
                />
              </figure>
            </div>
          </section>

          <section className="about-global" aria-labelledby="about-global-title">
            <div className="about-global__inner">
              <figure className="about-global__media">
                <img
                  src="/img/shared/comunidad-suscripcion.webp"
                  alt="Grupo de personas participando de un encuentro de aprendizaje al aire libre"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="800"
                />
              </figure>

              <div className="about-global__content">
                <p className="about-global__chapter">CAPÍTULO VI</p>
                <p className="about-global__period">2023–2024</p>
                <h2 id="about-global-title">Movimiento Global</h2>
                <p>Naluum trasciende el instituto para convertirse en un movimiento mundial.</p>
                <p>
                  Una comunidad global con grupos locales, nacionales y continentales que genera cambios regenerativos.
                </p>
                <p>
                  Ofrecen acompañamientos, asesorías y procesos educativos certificados internacionalmente, incluyendo PDC, agricultura sintrópica y masters en diseño, llevando soberanía alimentaria y regeneración ecosistémica a comunidades de todo el mundo.
                </p>
                <p className="about-global__milestone">Red global regenerativa activa</p>
              </div>
            </div>
          </section>

          <div className='aboutMe__founders' id='founders'>
            <Suspense fallback={<LoadingFallback />}>
              <FadeInOnView {...fadeInProps}>
                <Founders />
              </FadeInOnView>
            </Suspense>
          </div>

          <div className='aboutMe__valores'>
            <Suspense fallback={<LoadingFallback />}>
              <FadeInOnView {...fadeInProps}>
                <Valores />
              </FadeInOnView>
            </Suspense>
          </div>

          <section className="about-impact" aria-labelledby="about-impact-title">
            <div className="about-impact__inner">
              <header className="about-impact__heading">
                <h2 id="about-impact-title">Impacto en movimiento</h2>
              </header>

              <dl className="about-impact__metrics">
                {impactMetrics.map((metric) => (
                  <div className="about-impact__metric" key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="about-closing" aria-labelledby="about-closing-title">
            <div className="about-closing__inner">
              <div className="about-closing__content">
                <p className="about-closing__eyebrow">SEGUIR EL CAMINO</p>
                <h2 id="about-closing-title">La historia continúa en los territorios</h2>
                <p className="about-closing__text">
                  Movimiento Naluum vive en las personas, los proyectos y los territorios donde la permacultura se transforma en aprendizaje, comunidad y acción.
                </p>

                <div className="about-closing__actions">
                  <Link className="about-closing__action about-closing__action--primary" to="/proyectos/madre-selva">
                    Conocer Madre Selva
                  </Link>
                  <Link className="about-closing__action about-closing__action--secondary" to="/contacto">
                    Conversemos
                  </Link>
                </div>
              </div>

              <figure className="about-closing__logo" aria-hidden="true">
                <img
                  src="/img/branding/logo-naluum-transparente.svg"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="500"
                  height="500"
                />
              </figure>
            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default AboutMe;
