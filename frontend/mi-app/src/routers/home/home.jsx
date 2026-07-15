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
import CardV2Img from '../../components/layout/card/cardV2_Img/cardV2_img';
import ModalCard from '../../components/layout/card/modal_card/modal_card';
import Header from '../../components/layout/header/header';


// ------------------------------
// 📂 Secciones
// Bloques grandes o secciones completas que conforman las páginas
import MissionCarousel from '../../components/seccion/carrusel_imagenes/carrusel_imagenes';
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

const missionCards = [
 {
   id: 1,
   title: '🌱 Regeneramos territorios, pero también comunidades.',
   description: 'Trabajamos con permacultura y agricultura sintrópica para sanar la tierra y fortalecer vínculos comunitarios a través de nuestra red global.',
   image: '/img/shared/comunidad-circulo.webp',
 },
 {
   id: 2,
   title: '🔥 Rescatamos saberes ancestrales, pero también encendemos el futuro.',
   description: 'Conectamos la sabiduría maya y de pueblos originarios con técnicas regenerativas modernas para crear soluciones innovadoras.',
   image: '/img/shared/equipo-diseno-colaborativo.webp',
 },
 {
   id: 3,
   title: '🏡 Diseñamos con bioconstrucción, pero sobre todo, nuevas formas de habitar.',
   description: 'Creamos espacios sustentables con materiales naturales que nutren la conexión entre las personas y la Madre Tierra.',
   image: '/img/shared/hojas-bosque.webp',
 },
 {
   id: 4,
   title: '🌾 Cultivamos alimentos, pero también soberanía alimentaria.',
   description: 'Promovemos huertas comunitarias y técnicas agroecológicas para lograr autonomía y abundancia local en cada territorio.',
   image: '/img/shared/personas-trabajando.webp',
 },
 {
   id: 5,
   title: '💧 Gestionamos agua, pero también vida.',
   description: 'Diseñamos sistemas hidrológicos regenerativos que honran el agua como fuente sagrada de toda existencia.',
   image: '/img/sections/gestion-agua-vida.webp',
 },
 {
   id: 6,
   title: '🛠 Construimos herramientas, pero también redes de cambio.',
   description: 'Capacitamos facilitadores que replican metodologías regenerativas, creando una constelación de proyectos interconectados.',
   image: '/img/shared/comunidad-circulo.webp',
 },
 {
   id: 7,
   title: '🌍 Conectamos proyectos locales, pero también transformamos globalmente.',
   description: 'Desde grupos locales hasta alianzas continentales, tejemos una red viva que regenera el planeta proyecto a proyecto.',
   image: '/img/shared/manos-plantines.webp',
 },
 {
   id: 8,
   title: '🎓 Enseñamos permacultura, pero también despertamos propósito.',
   description: 'Nuestros cursos y talleres no solo transmiten técnicas, sino que ayudan a cada persona a encontrar su lugar en la regeneración.',
   image: '/img/shared/personas-trabajando.webp',
 }
];

const objectContentCard = {
   question: "¿Qué es el Movimiento Naluum?",
   title: "Una red global de regeneración",
   text: "El Movimiento Naluum es una comunidad viva que emergió hace más de dos décadas en las selvas del Caribe mexicano. Lo que comenzó como un instituto itinerante de permacultura se transformó en un movimiento mundial que conecta proyectos regenerativos través de una red descentralizada de grupos locales, redes nacionales y alianzas continentales, basado en el respeto por saberes ancestrales, regeneración de territorios y abundancia para todas las formas de vida.",
   buttonPrimary: ["Conocer más sobre el Movimiento", '/sobre-nosotros'],
   image: '/img/shared/personas-trabajando.webp'
}

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

  const memoizedCards = useMemo(() => missionCards, []);

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

      <section className='home__content' itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content="Movimiento Naluum" />
        <meta itemProp="description" content="Organización dedicada a impulsar soluciones regenerativas" />
        
        <LineLogoSeparacion />

        <article className='home__content--card-question' itemScope itemType="https://schema.org/Article">
          <FadeInOnView {...fadeInProps}>
            <CardV2Img objectContentCard={objectContentCard} buttonTrue={false} />
          </FadeInOnView>
        </article>

        <LineLogoSeparacion />

        <section className='home__content--mision__container' aria-labelledby="mision-title">
          <FadeInOnView {...fadeInProps}>
            <div className='home__content--mision'>
              <div className='content--mision--titiles'>
                <div className='mision--titile'>
                  <h1 id="mision-title">! Lo que hacemos !</h1>
                </div>
                <div className='mision--subTitle'>
                  <h2>Acompañamos proyectos con impacto regenerativo</h2>
                </div>

                <div className='mision--parrafo'>
                  <p itemProp="description">
                      Capacitamos personas y proyectos para impulsar iniciativas regenerativas que restauren el equilibrio social, económico y ecológico del planeta, basados en valores de respeto, colaboración y amor por la Madre Tierra.
                  </p>
                </div>
                
              </div>
              <div className='content--mision--carousel-wrapper'>
                <MissionCarousel cards={memoizedCards} autoPlayInterval={5000} />
              </div>
            </div>
          </FadeInOnView>
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
