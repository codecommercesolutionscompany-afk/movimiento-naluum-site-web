import Icon from './Icon.jsx';
import {
  getWhatsappHref,
  getWhatsappTarget,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const Hero = ({ content, assets }) => (
  <section className="sa-hero">
    <div className="sa-hero__media" aria-hidden="true">
      <img src={assets.hero} alt="" loading="eager" fetchPriority="high" decoding="async" />
    </div>
    <div className="sa-hero__overlay" />
    <div className="sa-hero__content">
      <span className="sa-eyebrow sa-eyebrow--light">{content.eyebrow}</span>
      <h1>{content.title}</h1>
      <p className="sa-hero__subtitle">{content.subtitle}</p>
      <p className="sa-hero__highlight">{content.highlight}</p>
      <div className="sa-hero__actions">
        <a
          className="sa-button"
          href={getWhatsappHref(content.primaryCta)}
          target={getWhatsappTarget(content.primaryCta)}
          rel={getWhatsappTarget(content.primaryCta) ? 'noopener noreferrer' : undefined}
          onClick={(event) => handleWhatsappClick(content.primaryCta, event)}
          {...getWhatsappTrackingAttributes(content.primaryCta)}
        >
          {content.primaryCta.label}
          <Icon name="ArrowRight" size={18} />
        </a>
        <a className="sa-button sa-button--ghost" href={content.secondaryCta.href}>
          {content.secondaryCta.label}
        </a>
      </div>
      <div className="sa-quick-facts" aria-label="Datos rápidos">
        {content.quickFacts.map((fact) => (
          <div className="sa-quick-fact" key={`${fact.label}-${fact.value}`}>
            <Icon name={fact.icon} size={20} />
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
