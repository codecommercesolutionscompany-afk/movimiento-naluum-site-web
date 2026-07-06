import {
  getWhatsappHref,
  getWhatsappTarget,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const resolveHref = (href) => (String(href || '').startsWith('[') ? '#' : href);
const getLinkHref = (link) => (link.whatsappNumber ? getWhatsappHref(link) : resolveHref(link.href));
const getLinkTarget = (link) => (link.whatsappNumber ? getWhatsappTarget(link) : link.href?.startsWith('http') ? '_blank' : undefined);

const Footer = ({ content }) => (
  <footer className="sa-footer">
    <div className="sa-container sa-footer__grid">
      <div>
        <span className="sa-footer__brand">{content.brand}</span>
        <strong>{content.program}</strong>
        <p>{content.description}</p>
      </div>
      <nav aria-label="Links de contacto">
        {content.links.map((link) => (
          <a
            key={link.label}
            href={getLinkHref(link)}
            target={getLinkTarget(link)}
            rel={getLinkTarget(link) ? 'noreferrer' : undefined}
            onClick={(event) => handleWhatsappClick(link, event)}
            {...(link.whatsappNumber ? getWhatsappTrackingAttributes(link) : {})}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
    <div className="sa-container">
      <p className="sa-footer__legal">{content.legal}</p>
    </div>
  </footer>
);

export default Footer;
