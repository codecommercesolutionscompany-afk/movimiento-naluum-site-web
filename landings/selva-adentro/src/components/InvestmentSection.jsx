import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';
import {
  getWhatsappHref,
  getWhatsappTarget,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';
import { formatMoney } from '../utils/pricing.js';

const InvestmentSection = ({ content, pricing }) => {
  return (
    <section id={content.id} className="sa-section sa-section--muted">
      <div className="sa-container">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} align="center" />
        <div className="sa-price-grid">
          {content.cards.map((card) => (
            <article className="sa-price-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.type === 'price' ? formatMoney(pricing.amount, pricing.currency) : card.value}</strong>
              {card.detail ? <p>{card.detail}</p> : null}
            </article>
          ))}
        </div>

        <div className="sa-centered-action">
          <a
            className="sa-button"
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
      </div>
    </section>
  );
};

export default InvestmentSection;
