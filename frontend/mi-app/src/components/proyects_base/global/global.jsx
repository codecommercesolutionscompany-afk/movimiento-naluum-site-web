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
import './global.scss';

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

const titles = {
  titulo: " Consultoría Regenerativa Internacional",
  subTitle: "GLOBAL",
  description: "No somos una empresa. Somos un tejido vivo de personas comprometidas con la regeneración de la vida. Nacidos desde la experiencia del Movimiento Na Lu'um y nutrida por décadas de trabajo en territorios diversos, co-creamos realidades donde la vida puede florecer. Global existe como puente entre mundos: entre la sabiduría ancestral y la innovación contemporánea, entre la urgencia del hacer y la paciencia del proceso, entre el sueño individual y la transformación colectiva. No vendemos esperanza, la cultivamos. No prometemos cambios, los acompañamos. No hablamos de sustentabilidad, vivimos la regeneración."
};

const globalCard = {
  titulo: "EL MOMENTO ES AHORA",
  subtitulo: "Vivimos tiempos de colapso y tiempos de renacimiento",
  descripcion: "Las viejas estructuras se desmoronan mientras las nuevas apenas comienzan a germinar. En este umbral, Global existe como puente entre mundos. Somos traductores entre la sabiduría ancestral y la innovación contemporánea. Entre la urgencia del hacer y la paciencia del proceso. Entre el sueño individual y la transformación colectiva. No vendemos esperanza. La cultivamos. No prometemos cambios. Los acompañamos. No hablamos de sustentabilidad. Vivimos la regeneración."
};

const Global = () => {
    const { servicios, FAQ: faqData, products } = useContext(ContextJsonLoadContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [triggerElement, setTriggerElement] = useState(null);
    const [isLoadPeges, setIsLoadPeges] = useState(false);
    const [servicioIdParam, setServicioIdParam, removeServicioIdParam] = useQueryParam('servicios');
    const [headerAnimationState, setHeaderAnimationState] = useState('initial');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) {
            setHeaderAnimationState('hover-ready');
            return;
        }
        const timer1 = setTimeout(() => setHeaderAnimationState('peek'), 2500);
        const timer2 = setTimeout(() => setHeaderAnimationState('hidden'), 4500);
        const timer3 = setTimeout(() => setHeaderAnimationState('hover-ready'), 5500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, []);

    useEffect(() => {
        if (servicioIdParam && servicios?.length > 0) {
            const item = servicios.find(s => s.id.toString() === servicioIdParam.toString());
            if (item) setIsModalOpen({ isOpen: true, item });
        }
    }, [servicioIdParam, servicios]);

    if (!servicios || !products) return null;

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

    const handleKeyPress = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && headerAnimationState === 'hover-ready') {
            setIsHovered(!isHovered);
        }
    };

    const getContentClasses = () => {
        let baseClass = 'global__header__content';
        if (headerAnimationState === 'hover-ready' && isHovered) baseClass += ' hovered';
        return baseClass;
    };

    const getLogoStyles = () => {
        const baseStyles = { transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', willChange: 'transform, opacity, filter' };
        switch (headerAnimationState) {
            case 'initial': return { ...baseStyles, opacity: 1, transform: 'translate(-50%, -50%)', filter: 'none', pointerEvents: 'auto' };
            case 'peek': return { ...baseStyles, opacity: 0, transform: 'translate(-50%, -50%) translateY(-20px) scale(0.98)', filter: 'blur(2px)', pointerEvents: 'none' };
            case 'hidden':
            case 'hover-ready':
                return {
                    ...baseStyles,
                    opacity: headerAnimationState === 'hover-ready' && isHovered ? 0 : 1,
                    transform: headerAnimationState === 'hover-ready' && isHovered ? 'translate(-50%, -50%) translateY(-30px) scale(0.95)' : 'translate(-50%, -50%)',
                    filter: headerAnimationState === 'hover-ready' && isHovered ? 'blur(3px)' : 'none',
                    pointerEvents: headerAnimationState === 'hover-ready' && isHovered ? 'none' : 'auto'
                };
            default: return baseStyles;
        }
    };

    const getTitlesStyles = () => {
        const baseStyles = { transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', willChange: 'transform, opacity' };
        switch (headerAnimationState) {
            case 'initial': return { ...baseStyles, opacity: 0, transform: 'translate(-50%, -50%) translateY(40px)', pointerEvents: 'none' };
            case 'peek': return { ...baseStyles, opacity: 0.9, transform: 'translate(-50%, -50%) translateY(0)', pointerEvents: 'auto' };
            case 'hidden': return { ...baseStyles, opacity: 0, transform: 'translate(-50%, -50%) translateY(40px)', pointerEvents: 'none' };
            case 'hover-ready': return { ...baseStyles, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translate(-50%, -50%) translateY(0)' : 'translate(-50%, -50%) translateY(40px)', pointerEvents: isHovered ? 'auto' : 'none' };
            default: return baseStyles;
        }
    };

    const getChildStyles = (delay = 0) => {
        const baseStyles = { transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s` };
        switch (headerAnimationState) {
            case 'initial': return { ...baseStyles, opacity: 0, transform: 'translateY(0px) scale(0.98)' };
            case 'peek': return { ...baseStyles, opacity: 1, transform: 'translateY(0) scale(1)' };
            case 'hidden': return { ...baseStyles, opacity: 0, transform: 'translateY(20px) scale(0.98)' };
            case 'hover-ready': return { ...baseStyles, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)' };
            default: return baseStyles;
        }
    };

    const servicesMadreSelva = useMemo(() => {
        return servicios.filter((item) => item.type === 'service' && item.project?.toLowerCase().trim() === 'madre selva');
    }, [servicios]);

    useEffect(() => {
        if (isLoadPeges) return;
        const timer = setTimeout(() => setIsLoadPeges(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='global__container'>
            <SEOHelmet 
                title="Global | Consultoría Regenerativa Internacional del Movimiento Na Lu'um"
                description="Global es una red viva de consultoría regenerativa nacida del Movimiento Na Lu'um. Acompañamos procesos ecosociales, pedagógicos y tecnológicos inspirados en la permacultura, la sabiduría ancestral y la innovación contemporánea."
                keywords="consultoría regenerativa, Na Lu'um, permacultura, regeneración, sostenibilidad, ecosocial, sabiduría ancestral, innovación, pedagogía, comunidad, transición ecológica"
                author="Movimiento Na Lu'um | Coordinación Global"
                url="https://miempresa.com/projects/global"
                image={new URL('/img/projects/proyecto-global-menu.webp', window.location.origin).href}
            />

            <div className='global__header' id="inicio">
                <Header className="global__header">
                    <div 
                        className={getContentClasses()}
                        onMouseEnter={() => headerAnimationState === 'hover-ready' && setIsHovered(true)}
                        onMouseLeave={() => headerAnimationState === 'hover-ready' && setIsHovered(false)}
                        onKeyDown={handleKeyPress}
                        tabIndex="0"
                        role="banner"
                        aria-label="Global header con contenido interactivo"
                    >
                        <div className="global__header__content__logo" style={getLogoStyles()}>
                            <img src="/img/branding/fondo-transparente-global.svg" alt="Logo Global" style={{ animationPlayState: (headerAnimationState === 'hover-ready' && isHovered) ? 'paused' : 'running' }} />
                        </div>
                        <div className="global__header__content__titles" style={getTitlesStyles()}>
                            <h1 style={getChildStyles(0.15)}>CONSULTORÍA REGENERATIVA INTERNACIONAL</h1>
                            <p className="subtitle" style={getChildStyles(0.3)}>Red viva de transformación ecosocial</p>
                            <p style={getChildStyles(0.45)}>
                                No somos una empresa. Somos un <span className="highlight">tejido vivo</span> de personas comprometidas con la regeneración de la vida. Nacidos desde la experiencia del {' '}
                                <span className="highlight">Movimiento Na Lu'um</span> y nutrida por décadas de trabajo en territorios diversos, co-creamos realidades donde la vida puede florecer.
                            </p>
                        </div>
                    </div>
                </Header>
            </div>

            <div className='global__content'>
                <div className='global__content--question' id='sobre-mi'>
                    <FadeInOnView {...fadeInProps}>
                        <div className='global__content--question__card'>
                            <div className='global__content--question__card__img'>
                                <img src="/img/sections/equipo-global.webp" alt="Global" />
                            </div>
                            <div className='global__content--question__card__text'>
                                <h2>{globalCard.titulo}</h2>
                                <p>{globalCard.subtitulo}</p>
                                <p>{globalCard.descripcion}</p>
                            </div>
                        </div>
                    </FadeInOnView>
                </div>

                <div className='global__content--history'>
                    <FadeInOnView {...fadeInProps}>
                        <TimeLineHistory index={3} theme={'global'} titles={titles} showHeroBg={true} heroBgImage="/img/branding/fondo-transparente-global.svg" />
                    </FadeInOnView>
                </div>

                <div className='global__grid' id='servicios'>
                    <FadeInOnView {...fadeInProps}>
                        <div className='global__services-titile'>
                            <h2>Servicios Y Productos</h2>
                            <p>Conoce los servicios y productos que nos ayudan a cumplir con nuestras metas</p>
                        </div>
                        <div className='global__services'>
                            <Grid items={servicesMadreSelva} gridType="services" slice={3} setIsOpen={handleOpenModal} variant="minimal" />
                            {modalContent}
                            <div className='global__button'>
                                <Button text={"Ver todos los servicios"} link="/servicios" style="secondary" />
                            </div>
                        </div>
                        <div className='global__products'>
                            <Grid items={products} gridType="products" slice={3} setIsOpen={handleOpenModal} />
                            {modalContent}
                            <div className='global__button'>
                                <Button text={"Ver todos los productos"} link="/productos" style="secondary" />
                            </div>
                        </div>
                    </FadeInOnView>
                </div>

                <div className='global__content--CTA'>
                    <FadeInOnView {...fadeInProps}>
                        <CtaImgCuentaRgresiva {...timerProps} />
                    </FadeInOnView>
                </div>

                <div className='global__content--testimonial'>
                    <FadeInOnView {...fadeInProps}>
                        <TestimonialCard typeTestimonial='servicios_madreSelva'/>
                    </FadeInOnView>
                </div>

                <div className='global__content--contact' id='contacto'>
                    <FadeInOnView {...fadeInProps}>
                        <CtaHablemos showSocialMedia={true} />
                    </FadeInOnView>
                </div>

                <div className='global__content--menssage_final' id='menssage_final'>   
                    <FadeInOnView {...fadeInProps}>
                        <MessageFinal indexMessage={0} />
                    </FadeInOnView>
                </div>

                <div className='global__content--FAQ' id='FAQ'>
                    <FadeInOnView {...fadeInProps}>
                        <FAQ faqs={faqData} defaultCategory="servicios" />
                    </FadeInOnView>
                </div>
            </div>
        </div>
    );
};

export default Global;
