import { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useQueryParam } from '../../../hooks/useQueryParams';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load';

// ------------------------------
// 📂 SEO y Meta
import SEOHelmet from '../../seo/SEOHelmet/SEOHelmet';

// ------------------------------
// 📂 Layout
import Header from '../../layout/header/header';
import CardV2Img from '../../layout/card/cardV2_Img/cardV2_img';
import ModalCard from '../../layout/card/modal_card/modal_card';

// ------------------------------
// 📂 Secciones
import TimeLineHistory from '../../seccion/history_about/time_line_history';
import Grid from '../../seccion/grid/grid';
import CtaImgCuentaRgresiva from '../../seccion/cta_img_cuenta_rgresiva/cta_img_cuenta_rgresiva';
import CtaHablemos from '../../seccion/cta_hablemos/cta_hablemos';
import TestimonialCard from '../../seccion/testimonial_card/testimonial_card';
import SupportModalContent from '../../seccion/support_modal/support_modal';
import FAQ from '../../seccion/FAQ/FAQ';
import MessageFinal from '../../seccion/message_final/message_final';
import FadeInOnView from '../../seccion/fadeInOnView/fadeInOnView';
import MissionCarousel from '../../seccion/carrusel_imagenes/carrusel_imagenes';

// ------------------------------
// 📂 UI
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';

// ------------------------------
// 📂 Styles
import './madre_selva.scss';

// ------------------------------
// ⚙️ Animaciones y configuración
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeInProps = {
  direction: "up",
  duration: prefersReducedMotion ? 0 : 800,
  delay: prefersReducedMotion ? 0 : 200,
  distance: prefersReducedMotion ? 0 : 30,
  easing: prefersReducedMotion ? 'linear' : "bounce",
  speed: prefersReducedMotion ? 'fast' : "slow"
};

// ------------------------------
// 🕓 Contenido dinámico
// const timerProps = {
//   img: "/img/shared/manos-plantines.webp",
//   titles: {
//     main: "",
//     subtitle: "Festival Eco de la Tierra",
//   },
//   text: "Únete al próximo Festival Eco de la Tierra: un encuentro de saberes, música y experiencias regenerativas para celebrar la vida en comunidad.",
//   buttonText: "Quiero participar",
//   timer: {
//     targetDate: "2025-09-23T18:59:59",
//   },
//   link: "/servicios/laboratorios-alimentacion-viva",
// };

const objectContentCard = {
  question: "¿Qué es Madre Selva?",
  title: "Centro de investigación en agricultura sintrópica y diseño regenerativo.",
  text: "22 hectáreas de selva misionera donde la naturaleza, la ciencia y la comunidad se entrelazan para regenerar el futuro.",
  buttonPrimary: ["Explorar el universo de Madre Selva", "/madreSelva"],
  image: "/img/sections/mensaje-accion-regenerativa.webp",
};

const titles = {
  titulo: "Filosofía / Propósito ",
  subTitle: "Madre Selva",
  description:
    "Inspirados por la permacultura y la pedagogía regenerativa, cultivamos salud, conocimiento y comunidad desde el corazón de la selva misionera.",
};

// ------------------------------
// 🌾 Actividades destacadas
const actividadesMadreSelva = [
  {
    id: 1,
    title: '🌳 Caminatas guiadas por la selva',
    description:
      'Explora senderos vivos y descubre cómo cada especie contribuye a la regeneración del ecosistema.',
    image: '/img/placeholders/pendiente-actividad-caminatas-selva.svg',
  },
  {
    id: 2,
    title: '🪵 Talleres de construcción natural',
    description:
      'Aprende técnicas sostenibles con materiales locales: bioconstrucción, adobe y bambú.',
    image: '/img/placeholders/pendiente-actividad-construccion-natural.svg',
  },
  {
    id: 3,
    title: '🌾 Agricultura sintrópica en acción',
    description:
      'Participa en nuestras huertas regenerativas y conecta con los ciclos naturales de la tierra.',
    image: '/img/placeholders/pendiente-actividad-agricultura-sintropica.svg',
  },
  {
    id: 4,
    title: '💧 Rutas del agua',
    description:
      'Conoce los sistemas de captación, filtrado y uso responsable del agua en el ecosistema.',
    image: '/img/placeholders/pendiente-actividad-rutas-agua.svg',
  },
  {
    id: 5,
    title: '🔥 Encuentros alrededor del fuego',
    description:
      'Vivencias colectivas de canto, historia y transmisión de saberes ancestrales.',
    image: '/img/placeholders/pendiente-actividad-encuentros-fuego.svg',
  },
  {
    id: 6,
    title: '🔬 Experiencias de investigación',
    description:
      'Participa en proyectos de observación sobre biodiversidad, suelos y restauración ambiental.',
    image: '/img/placeholders/pendiente-actividad-investigacion.svg',
  },
  {
    id: 7,
    title: '🛖 Vivencias inmersivas',
    description:
      'Vive la experiencia de habitar Madre Selva: aprendizaje, contemplación y acción regenerativa.',
    image: '/img/placeholders/pendiente-actividad-vivencias-inmersivas.svg',
  },
];

// ------------------------------
// 🌿 COMPONENTE PRINCIPAL
const MadreSelva = () => {
  const { servicios = [], FAQ: faqData = [], products = [], timerProps } = useContext(ContextJsonLoadContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState(null);
  const [servicioIdParam, setServicioIdParam, removeServicioIdParam] = useQueryParam('servicios');

  useEffect(() => {
    if (servicioIdParam && servicios?.length > 0) {
      const item = servicios.find(s => s.id.toString() === servicioIdParam.toString());
      if (item) setIsModalOpen({ isOpen: true, item });
    }
  }, [servicioIdParam, servicios]);

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
          <SupportModalContent item={isModalOpen.item} />
        </ModalCard>
      </Modal>
    );
  }, [isModalOpen, handleCloseModal, triggerElement]);

  // Filtrar servicios de Madre Selva
  const servicesMadreSelva = useMemo(() => {
    return servicios.filter(
      (item) => item.type === 'service' && item.project?.toLowerCase().trim() === 'madre selva'
    );
  }, [servicios]);

  const memoizedCards = useMemo(() => actividadesMadreSelva, []);

  // 🧠 SEO optimizado
  const meta = {
    title: 'Madre Selva | Centro de permacultura y regeneración en la selva misionera',
    description:
      'Madre Selva es un espacio de 22 hectáreas dedicado a la investigación, educación y acción regenerativa. Un proyecto del movimiento Naluum para restaurar la selva misionera y cultivar una nueva relación con la Tierra.',
    keywords:
      'madre selva, permacultura, regeneración, selva misionera, agricultura sintrópica, educación ambiental, ecología, Naluum, sostenibilidad, restauración ecológica',
    author: 'Neyen Frandino',
    url: 'https://movimientonaluum.org/proyectos/madre-selva',
    image: new URL('/img/shared/ecocentro-madre-selva.webp', window.location.origin).href,
  };

  return (
    <div className='madreSelva__container'>
      {/* 🧠 SEO Dinámico */}
      <SEOHelmet
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        author={meta.author}
        url={meta.url}
        image={meta.image}
      />

      <div 
        className='madreSelva__header' 
        id="inicio"
        style={{ backgroundImage: 'url(/img/shared/ecocentro-madre-selva.webp)' }}
      >
        <Header>
          <div className='madreSelva__header__content'>
            <div className='madreSelva__header__content__logo'>
              <img src="/img/branding/logo-madre-selva.svg" alt="Logo Madre Selva" />
            </div>
            <div className='madreSelva__header__content__title'>
              <p>
                Bienvenidos al Eco-Centro Madre Selva, un santuario de regeneración en el corazón
                de la naturaleza. Donde la salud del suelo, las plantas y las personas se
                entrelazan para regenerar la vida.
              </p>
            </div>
          </div>
        </Header>
      </div>


      <div className='madreSelva__content'>
        <div className='madreSelva__content--question' id='sobre-mi'>
          <FadeInOnView {...fadeInProps}>
            <CardV2Img objectContentCard={objectContentCard} buttonTrue={false} />
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--history'>
          <FadeInOnView {...fadeInProps}>
            <TimeLineHistory index={2} titles={titles} showHeroBg={false} heroBgImage={null} />
          </FadeInOnView>
        </div>

        <div className='madreSelva__grid' id='servicios'>
          <FadeInOnView {...fadeInProps}>
            <div className='madreSelva__services-titile'>
              <h2 className='title'>Servicios y productos</h2>
              <p className='subtitle'>
                Promovemos prácticas ecológicas, bioconstrucción, talleres educativos y productos
                elaborados desde la ética de la permacultura y el respeto por la Tierra.
              </p>
            </div>

            <div className='madreSelva__services'>
              <Grid items={servicesMadreSelva} gridType="services" slice={3} setIsOpen={handleOpenModal} variant="minimal" />
              {modalContent}
              <div className='madreSelva__button'>
                <Button text={"Ver todos los servicios"} link="/servicios" style="secondary" />
              </div>
            </div>

            <div className='madreSelva__products'>
              <Grid items={products} gridType="products" slice={3} setIsOpen={handleOpenModal} />
              {modalContent}
              <div className='madreSelva__button'>
                <Button text={"Ver todos los productos"} link="/productos" style="secondary" />
              </div>
            </div>
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--CTA'>
          <FadeInOnView {...fadeInProps}>
            <CtaImgCuentaRgresiva {...timerProps} />
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--testimonial'>
          <FadeInOnView {...fadeInProps}>
            <TestimonialCard typeTestimonial='servicios_madreSelva' />
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--contact' id='contacto'>
          <FadeInOnView {...fadeInProps}>
            <CtaHablemos showSocialMedia={true} proyecto='Madre Selva' />
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--menssage_final' id='menssage_final'>
          <FadeInOnView {...fadeInProps}>
            <MessageFinal indexMessage={0} />
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--carrousel' id='carrousel'>
          <FadeInOnView {...fadeInProps}>
            <div className='content__carrousel--titiles'>
              <h2>Madre Selva no es solo un lugar, es una experiencia.</h2>
              <p>
                Te invitamos a sumergirte en la selva viva, escuchar el pulso de la Tierra y ser
                parte de un proceso colectivo de regeneración.
              </p>
            </div>
            <div className='content__carrousel--cards'>
              <MissionCarousel cards={memoizedCards} autoPlayInterval={5000} />
            </div>
          </FadeInOnView>
        </div>

        <div className='madreSelva__content--FAQ' id='FAQ'>
          <FadeInOnView {...fadeInProps}>
            <FAQ faqs={faqData} defaultCategory="madre-selva" />
          </FadeInOnView>
        </div>
      </div>
    </div>
  );
};

export default MadreSelva;
