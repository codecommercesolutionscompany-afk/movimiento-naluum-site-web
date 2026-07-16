import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ContextJsonLoadContext } from '../../context/context_json_load/context_json_load_context';
import { useQueryParam } from '../../hooks/useQueryParams';


// ------------------------------
// 📂 SEO y Meta
// Importaciones de componentes relacionados con SEO y metadata
import SEOHelmet from '../../components/seo/SEOHelmet/SEOHelmet';


// ------------------------------
// 📂 Layout
// Componentes que forman la estructura y navegación principal (header, footer, nav, etc.)
import ModalCard from '../../components/layout/card/modal_card/modal_card';
import Header from '../../components/layout/header/header';


// ------------------------------
// 📂 Secciones
// Bloques grandes o secciones completas que conforman las páginas
import Grid from '../../components/seccion/grid/grid';
import CtaImgCuentaRgresiva from '../../components/seccion/cta_img_cuenta_rgresiva/cta_img_cuenta_rgresiva';
import CardDataImpacto from '../../components/seccion/card_data_impacto/card_data_impacto';
import BeforeAndAfter from '../../components/seccion/before_and_after/before_and_after';
import Bitacora from '../../components/seccion/bitacora/bitacora';
import CtaHablemos from '../../components/seccion/cta_hablemos/cta_hablemos';
import MessageFinal from '../../components/seccion/message_final/message_final';
import TestimonialCard from '../../components/seccion/testimonial_card/testimonial_card';
import FadeInOnView from '../../components/seccion/fadeInOnView/fadeInOnView';
import SupportModalContent from '../../components/seccion/support_modal/support_modal';


// ------------------------------
// 📂 UI / Componentes visuales pequeños y reutilizables
import Button from '../../components/ui/button/button';
import LineLogoSeparacion from '../../components/ui/line_logo_separacion/line_logo_separacion';
import Modal from '../../components/ui/modal/modal';


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

// Timer Configuration
// const timerProps = {
//   img: '/img/shared/manos-plantines.webp',
//   titles: {
//     main: "",
//     subtitle: "Festival Eco de la Tierra",
//   },
//   text: " lorem ipsum dolor sit amet, con sectetuer adipiscing elit, sed diam nonummy nibh euis mod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
//   buttonText: "Quiero participar",
//   timer: {
//     targetDate: "2025-09-23T18:59:59"
//   },
//   link : "/serviciosl/aboratorios-alimentacion-viva"
// };

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


const Home = () => {

  const { products, servicios, timerProps } = useContext(ContextJsonLoadContext);
  const [servicioIdParam, setServicioIdParam, removeServicioIdParam] = useQueryParam('servicios');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState(null);

  useEffect(() => {
    if (servicioIdParam && servicios?.length > 0) {
      const item = servicios.find(s => s.id.toString() === servicioIdParam.toString());
      if (item) setIsModalOpen({ isOpen: true, item });
    }
  }, [servicioIdParam, servicios]);

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

  const handleOpenModal = useCallback((status, e, item) => {
    if (!item || !item.id) return;

    setTriggerElement(e.currentTarget);
    setIsModalOpen({ isOpen: status, item });
    setServicioIdParam(item.id);

  }, [setServicioIdParam]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTriggerElement(null);
    removeServicioIdParam();
  }, [removeServicioIdParam]);

  const modalContent = useMemo(() => {
    if (!isModalOpen.isOpen || !isModalOpen.item) return null;
    return (
      <Modal
        isOpenModal={isModalOpen}
        onClose={handleCloseModal}
        triggerElement={triggerElement}
        showPointer={true}
      >
        <ModalCard course={isModalOpen.item}>
          <SupportModalContent
            onClose={handleCloseModal}
            item={isModalOpen.item}
          />
        </ModalCard>
      </Modal>
    );
  }, [isModalOpen, handleCloseModal, triggerElement]);

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

        <LineLogoSeparacion />

        <section className='home__content--servicios' aria-labelledby="servicios-title" itemScope itemType="https://schema.org/Service">
          <FadeInOnView {...fadeInProps}>
            <div className='content--servicios__container'>
              <div className='content--servicios__text'>
                <h2 id="servicios-title" itemProp="name">Juntos en el proceso de regenerar territorios</h2>
                <p itemProp="description">
                  Nuestro objetivo es crear una red de regeneración global que impulse la colaboración y el aprendizaje compartido. A través de metodologías teórico-prácticas que integran permacultura, bioconstrucción y saberes ancestrales, acompañamos a quienes buscan transformar su entorno y modo de vida de manera profunda y consciente.
                </p>
                <span>
                Dirigimos nuestras capacitaciones a personas comprometidas con un cambio regenerativo auténtico, con la esperanza de generar transformación social y territorial significativa en familias, proyectos y comunidades, construyendo juntos un futuro más sostenible donde la vida humana y la naturaleza encuentren equilibrio.
                </span>
              </div>
              <div className='content--servicios__grid'>
                <div className="grid-wrapper">
                  <Grid items={servicios} gridType="services" slice={3} setIsOpen={handleOpenModal} variant="minimal" />
                </div>
                {modalContent}
              </div>
            </div>
 
            <div className='content--servicios__cta-timer'>
              <div className='content--servicios__cta-component'>
                <CtaImgCuentaRgresiva {...timerProps} />
              </div>

              <div className='home__content--servicios-buttons'>
                <Button 
                  text="Explora todos los servicios"
                  link="/servicios"
                  style="outline"
                  aria-label="Ver todos los servicios de capacitación y acompañamiento del Movimiento Naluum"
                />
              </div>

            </div>

          </FadeInOnView>
        </section>

        <LineLogoSeparacion />

        <section className='home__content--impacto' aria-labelledby="impacto-title">
          <FadeInOnView {...fadeInProps}>
            <h2 id="impacto-title" className="visually-hidden">Nuestro Impacto Regenerativo</h2>
            <CardDataImpacto />
          </FadeInOnView>
        </section>
 
        <LineLogoSeparacion />

        <section className='home__content--beforeAfter' aria-labelledby="transformacion-title">
          <FadeInOnView {...fadeInProps}>
            <h2 id="transformacion-title" className="visually-hidden">Transformación: Antes y Después</h2>
            <BeforeAndAfter />
          </FadeInOnView>
        </section>

        <section className='home__content--testimonios' aria-labelledby="testimonios-title" itemScope itemType="https://schema.org/Review">
          <FadeInOnView {...fadeInProps}>
            <h2 id="testimonios-title" className="visually-hidden">Testimonios de nuestra comunidad</h2>
            <TestimonialCard typeTestimonial="testimonios_movimiento" />
          </FadeInOnView>
        </section>

        <LineLogoSeparacion />

        <section className='home__content--products' aria-labelledby="productos-title" itemScope itemType="https://schema.org/Product">
          <FadeInOnView {...fadeInProps}>
            <div className='home__content--products-title'>
              <h2 id="productos-title" itemProp="name">Productos Regenerativos</h2>
              <p itemProp="description">Conoce los productos ecológicos que nos ayudan a cumplir con nuestras metas de regeneración</p>
            </div>
            <Grid items={products} slice={5} setIsOpen={handleOpenModal} />
            {modalContent}
            <div className='home__content--products-button'>
              <Button 
                text="Ver todos los productos" 
                link="/productos" 
                style="outline"
                aria-label="Explorar catálogo completo de productos regenerativos"
              />
            </div>
          </FadeInOnView>
        </section>

        <LineLogoSeparacion />

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
