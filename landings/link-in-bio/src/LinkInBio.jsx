import { useEffect } from 'react';
import { getPageAttribution, trackLinkClick, trackPageContext } from './tracking.js';

const ASSET_BASE = '/madre-selva/assets/';

const links = [
  {
    title: 'Explorar Movimiento Ná Lu’um',
    description: 'Conocé el ecosistema, sus proyectos, territorio, visión regenerativa y formas de participar.',
    url: 'https://movimientonaluum.org/',
    label: 'Puerta de entrada',
    category: 'general',
    relatedService: 'multiple',
    ctaType: 'external_site',
    external: false,
    variant: 'featured',
    group: 'main_links',
  },
  {
    title: 'Festival Madre Selva',
    description: 'Viví una experiencia de comunidad, naturaleza y transformación.',
    url: '/festival/',
    label: 'Festival',
    category: 'programs',
    relatedService: 'festival',
    ctaType: 'internal_link',
    external: false,
    notice: ['Súper preventa disponible'],
    promoText: 'Recomendado',
    badgeVariant: 'festival',
    showDescription: true,
    variant: 'secondary',
  },
  {
    title: 'PDC · Diseño de Permacultura',
    description: 'Conocé la formación completa, propuesta, fechas, inversión y próximos pasos.',
    url: 'https://movimientonaluum.org/pdc/',
    label: 'Formación',
    category: 'programs',
    relatedService: 'pdc',
    ctaType: 'internal_landing',
    external: false,
  },
  {
    title: 'Selva Adentro',
    description: 'Una experiencia inmersiva para aprender haciendo, vivir en comunidad y reconectar con la tierra.',
    url: 'https://movimientonaluum.org/selva-adentro/',
    label: 'Experiencia',
    category: 'programs',
    relatedService: 'selva_adentro',
    ctaType: 'internal_landing',
    external: false,
    notice: ['NUEVO', 'Experiencia Vivencial'],
    variant: 'secondary',
  },
  {
    title: 'Residencia Formativa por Rol',
    description: 'Una experiencia de formación vivencial para profundizar en un rol concreto dentro de Madre Selva.',
    url: 'https://movimientonaluum.org/programa-intercambio-formativo/',
    label: 'Residencia',
    category: 'programs',
    relatedService: 'residencia_formativa',
    ctaType: 'internal_landing',
    external: false,
    notice: ['NUEVO', 'Inscripciones Abiertas'],
    variant: 'secondary',
  },
  {
    title: 'Voluntariado',
    description: 'Inscripciones abiertas para julio y agosto',
    url: 'https://movimientonaluum.org/voluntariado-otono-invierno/',
    label: 'Voluntariado',
    category: 'programs',
    relatedService: 'voluntariado',
    ctaType: 'internal_landing',
    external: false,
    notice: ['Promoción activa'],
    promoText: '10 cupos',
    showDescription: true,
    variant: 'secondary',
  },
  {
    title: 'Masterclass Gratuita',
    description: 'Inscribite a nuestra nueva masterclass completando el formulario.',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeK_Ta--ZhmC0dXWB0Z13oIE1NbIyJK3vS4dxrgKedNYfV_cw/viewform?usp=header',
    label: 'Masterclass',
    category: 'free',
    relatedService: 'masterclass',
    ctaType: 'external_form',
    formProvider: 'google_forms',
    external: true,
    requires_content_review: true,
    notice: ['NUEVO', 'Gratis'],
    variant: 'secondary',
  },
  {
    title: 'Cuidado y conservación de semillas',
    description: 'Video sobre cuidado, conservación y memoria viva de las semillas.',
    url: 'https://www.youtube.com/watch?v=qVskZvomQn4',
    label: 'Video',
    category: 'free',
    relatedService: 'general',
    ctaType: 'external_site',
    external: true,
    requires_content_review: true,
    variant: 'video',
  },
  {
    title: 'Leer contenido del blog',
    description: 'Artículos, ideas y recursos sobre permacultura, territorio y educación regenerativa.',
    url: 'https://movimientonaluum.org/blog',
    label: 'Contenido',
    category: 'free',
    relatedService: 'general',
    ctaType: 'external_site',
    external: false,
    requires_content_review: true,
    variant: 'editorial',
  },
  {
    title: 'Yerba Mate - Suspiro Selva',
    description: 'Temporalmente no disponible',
    url: '',
    label: 'Tienda',
    category: 'yerba',
    relatedService: 'yerba',
    ctaType: 'internal_landing',
    external: false,
    disabled: true,
    variant: 'conversion',
  },
];

const footerLinks = [
  { title: 'Instagram', url: 'https://www.instagram.com/madree.selvaa', ctaType: 'social', relatedService: 'general', external: true, group: 'footer_social', requires_content_review: true },
  { title: 'WhatsApp', url: 'https://wa.me/5493764257777', ctaType: 'whatsapp', relatedService: 'general', external: true, whatsappNumber: '5493764257777', contactPurpose: 'general', group: 'footer_contact', requires_content_review: true },
  { title: 'Web', url: 'https://movimientonaluum.org/', ctaType: 'external_site', relatedService: 'multiple', external: false, group: 'footer_contact' },
  { title: 'Email', url: 'mailto:administracion@movimientonaluum.com', ctaType: 'email', relatedService: 'general', external: true, group: 'footer_contact', requires_content_review: true },
];

const groupLabels = {
  programs: 'Programas y Experiencias',
  free: 'Recursos Gratuitos',
  yerba: 'Productos',
};

function linkProps(link) {
  return link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

function LinkButton({ link, group, position }) {
  const className = `linkbio__button linkbio__button--${link.variant || 'default'}${link.disabled ? ' linkbio__button--disabled' : ''}`;

  if (link.disabled) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        <span className="linkbio__button-copy">
          <span className="linkbio__button-title">{link.title}</span>
          <span className="linkbio__button-status">{link.description}</span>
        </span>
      </button>
    );
  }

  return (
    <a
      className={className}
      href={link.url}
      onClick={() => trackLinkClick(link, group, position)}
      {...linkProps(link)}
    >
      <span className="linkbio__button-copy">
        <span className="linkbio__button-title">{link.title}</span>
        {link.showDescription && <span className="linkbio__button-description">{link.description}</span>}
        {link.promoText && <span className="linkbio__button-promo">{link.promoText}</span>}
      </span>
    </a>
  );
}

export default function LinkInBio() {
  useEffect(() => {
    getPageAttribution();
    trackPageContext();
  }, []);

  const featured = links[0];
  const grouped = links.slice(1);
  const mainPositions = new Map(grouped.map((link, index) => [link.title, index + 2]));

  return (
    <main className="linkbio__page">
      <section className="linkbio__banner" aria-label="Territorio Madre Selva">
        <picture>
          <source srcSet={`${ASSET_BASE}banner-ecosistema-fast.avif`} type="image/avif" />
          <img src={`${ASSET_BASE}banner-ecosistema-fast.webp`} alt="Aprendizaje vivo en el territorio Madre Selva" width="1200" height="800" decoding="async" fetchPriority="high" />
        </picture>
      </section>

      <div className="linkbio__shell">
        <section className="linkbio__hero" aria-labelledby="linkbio-title">
          <div className="linkbio__brand-mark">
            <img src={`${ASSET_BASE}logo-madre-selva-user.png`} alt="Símbolo Madre Selva" width="280" height="280" decoding="async" />
          </div>
          <h1 className="linkbio__title" id="linkbio-title">Accesos Madre Selva</h1>
          <p className="linkbio__subtitle">Un mapa simple para entrar al ecosistema vivo de Madre Selva.</p>
          <p className="linkbio__intro">Encontrá formaciones, experiencias, contenidos, proyectos y canales de contacto en un solo lugar.</p>
        </section>

        <section className="linkbio__groups" aria-label="Enlaces principales">
          {['programs', 'free', 'yerba'].map((category) => {
            const categoryLinks = grouped.filter((link) => link.category === category);
            return (
              <div className="linkbio__group-frame" key={category}>
                <span className="linkbio__group-pill">{groupLabels[category]}</span>
                <div className="linkbio__links">
                  {categoryLinks.map((link, index) => (
                    <div className={link.notice ? 'linkbio__deal-frame' : 'linkbio__button-wrap'} key={link.title}>
                      {link.notice && <span className={`linkbio__deal-badge${link.badgeVariant ? ` linkbio__deal-badge--${link.badgeVariant}` : ''}`}><strong>{link.notice[0]}</strong>{link.notice[1] && <span>{link.notice[1]}</span>}</span>}
                      <LinkButton link={link} group="main_links" position={mainPositions.get(link.title)} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="linkbio__editorial" aria-labelledby="editorial-title">
          <span className="linkbio__section-line" aria-hidden="true" />
          <h2 className="linkbio__section-title" id="editorial-title">Una puerta de entrada al ecosistema Movimiento Ná Lu’um</h2>
          <p>Aprender a regenerar no es acumular teoría. Es volver a diseñar la vida con la Tierra, con otras personas y con un propósito más honesto.</p>
          <div className="linkbio__featured-wrap">
            <LinkButton link={featured} group="main_links" position={1} />
          </div>
        </section>

        <footer className="linkbio__footer">
          <p className="linkbio__footer-title">Madre Selva</p>
          <p className="linkbio__footer-text">Educación viva para una cultura regenerativa.</p>
          <nav className="linkbio__footer-links" aria-label="Redes y contacto">
            {footerLinks.map((link, index) => (
              <a key={link.title} href={link.url} onClick={() => trackLinkClick(link, link.group, link.group === 'footer_social' ? 1 : index)} {...linkProps(link)}>{link.title}</a>
            ))}
          </nav>
        </footer>
      </div>
    </main>
  );
}
