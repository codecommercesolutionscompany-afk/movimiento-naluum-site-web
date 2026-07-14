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

// ------------------------------
// 📂 UI
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';

// ------------------------------
// 📂 Styles
import './naluum.scss';

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeInProps = {
  direction: "up",
  duration: prefersReducedMotion ? 0 : 800,
  delay: prefersReducedMotion ? 0 : 200,
  distance: prefersReducedMotion ? 0 : 30,
  easing: prefersReducedMotion ? 'linear' : "bounce",
  speed: prefersReducedMotion ? 'fast' : "slow"
};

const timerProps = {
  img: "/img/shared/manos-plantines.webp",
  titles: {
    main: "",
    subtitle: "Festival Eco de la Tierra",
  },
  text: " lorem ipsum dolor sit amet, con sectetuer adipiscing elit, sed diam nonummy nibh euis mod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
  buttonText: "Quiero participar",
  timer: {
    targetDate: "2025-09-23T18:59:59",
    link: "/servicios/laboratorios-alimentacion-viva"
  }
};

const objectContentCard = {
  question: "¿Qué es Naluum?",
  title: "El corazón pedagógico del Movimiento Naluum",
  text: "Naluum es el núcleo educativo del Movimiento Naluum, encargado de llevar formación, acompañamiento y eventos pedagógicos a todo el mundo. Es el puente entre el conocimiento consciente y las personas, ofreciendo cursos, experiencias formativas y apoyo a proyectos que buscan transformar su realidad desde la colaboración, la regeneración y el aprendizaje continuo.",
  buttonPrimary: ["Explorar el universo pedagógico de Naluum", "/naluum"],
  image: "/img/projects/naluum-pregunta.webp"
};

const titles = {
  titulo: "Educación, conciencia y colaboración para transformar",
  subTitle: "Naluum",
  description: "Naluum es una propuesta para generar una comunidad educativa consciente y profesional que inspire a más personas. Está inspirado en los sistemas vivos que se autorregulan y se sostienen gracias a la colaboración efectiva y amorosa. Se basa en crear un sistema vivo, sustentable en el tiempo",
};

const Naluum = () => {
  const { servicios = [], FAQ: faqData = [] } = useContext(ContextJsonLoadContext);
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

  return (
    <div className='naluum__container'>
      <SEOHelmet
        title="Naluum | Educación Consciente y Colaborativa"
        description="Naluum es el corazón pedagógico del Movimiento Naluum: un espacio para la educación consciente, la colaboración y la transformación social a través del aprendizaje regenerativo."
        keywords="educación consciente, movimiento naluum, formación regenerativa, aprendizaje colaborativo, pedagogía viva, cursos naluum, desarrollo humano, transformación social"
        author="Movimiento Naluum"
        url="https://movimientonaluum.com/naluum"
        image={new URL('/img/branding/movimiento-naluum-og.jpg', window.location.origin).href}
      />

    <div className='naluum__header' id="inicio" style={{ backgroundImage: "url('/img/hero/inicio-naluum.svg')" }}>
      <Header>
        <div className='naluum__header__content'>
          <div className='naluum__header__content__logo'>
            <img src="/img/branding/logo-naluum-transparente.svg" alt="Logo de Naluum - Movimiento Educativo Consciente" />
          </div>
        </div>
      </Header>
    </div>

      <div className='naluum__content'>
        <div className='naluum__content--question' id='sobre-naluum'>
          <FadeInOnView {...fadeInProps}>
            <CardV2Img objectContentCard={objectContentCard} buttonTrue={false} />
          </FadeInOnView>
        </div>

        <div className='naluum__content--history'>
          <FadeInOnView {...fadeInProps}>
            <TimeLineHistory index={1} titles={titles} showHeroBg={true} heroBgImage="/img/branding/logo-naluum-transparente.svg" theme={'naluum'} />
          </FadeInOnView>
        </div>

        <div className='naluum__services' id='servicios'>
          <FadeInOnView {...fadeInProps}>
            <div className='naluum__services-titile'>
              <h2>Servicios Educativos de Naluum</h2>
              <p>Conoce las experiencias formativas y acompañamientos que promueven la transformación y el aprendizaje consciente.</p>
            </div>
 
            <Grid items={servicios} gridType="services" slice={3} setIsOpen={handleOpenModal} variant="minimal" />
            {modalContent}

            <div className='naluum__services-button'>
              <Button text={"Ver todos los servicios"} link="/servicios" style="secondary" />
            </div>
          </FadeInOnView>
        </div>

        <div className='naluum__content--CTA'>
          <FadeInOnView {...fadeInProps}>
            <CtaImgCuentaRgresiva {...timerProps} />
          </FadeInOnView>
        </div>

        <div className='naluum__content--testimonial'>
          <FadeInOnView {...fadeInProps}>
            <TestimonialCard typeTestimonial='testimonios_naluum' />
          </FadeInOnView>
        </div>

        <div className='naluum__content--contact' id='contacto'>
          <FadeInOnView {...fadeInProps}>
            <CtaHablemos showSocialMedia={true} />
          </FadeInOnView>
        </div>

        <div className='naluum__content--menssage_final' id='menssage_final'>
          <FadeInOnView {...fadeInProps}>
            <MessageFinal indexMessage={0} />
          </FadeInOnView>
        </div>

        <div className='naluum__content--FAQ' id='FAQ'>
          <FadeInOnView {...fadeInProps}>
            <FAQ faqs={faqData} defaultCategory="servicios" />
          </FadeInOnView>
        </div>
      </div>
    </div>
  );
};

export default Naluum;
