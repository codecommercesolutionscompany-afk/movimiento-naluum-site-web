import Icon from './Icon.jsx';
import {
  getWhatsappHref,
  getWhatsappTarget,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const FinalCTA = ({ content }) => (
  <section id={content.id} className="sa-final-cta">
    <div className="sa-container sa-final-cta__content">
      <span className="sa-eyebrow sa-eyebrow--light">{content.eyebrow}</span>
      <h2>{content.title}</h2>
      <p>{content.text}</p>
      <div className="sa-final-steps">
        {content.process.map((step, index) => (
          <div className="sa-final-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <a
        className="sa-button sa-button--light"
        href={getWhatsappHref(content.cta)}
        target={getWhatsappTarget(content.cta)}
        rel={getWhatsappTarget(content.cta) ? 'noopener noreferrer' : undefined}
        onClick={(event) => handleWhatsappClick(content.cta, event)}
        {...getWhatsappTrackingAttributes(content.cta)}
      >
        {content.cta.label}
        <Icon name="ArrowRight" size={18} />
      </a>
    </div>
  </section>
);

export default FinalCTA;
