import { useEffect, useState } from 'react';
import {
  getWhatsappHref,
  getWhatsappTarget,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const Header = ({ content }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sa-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="sa-header__inner">
        <a className="sa-header__brand" href={content.homeUrl}>
          {content.brand}
        </a>
        {content.links.length > 0 ? (
          <nav className="sa-header__nav" aria-label="Navegación principal">
            {content.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
        <a
          className="sa-button sa-button--small"
          href={getWhatsappHref(content.cta)}
          target={getWhatsappTarget(content.cta)}
          rel={getWhatsappTarget(content.cta) ? 'noopener noreferrer' : undefined}
          onClick={(event) => handleWhatsappClick(content.cta, event)}
          {...getWhatsappTrackingAttributes(content.cta)}
        >
          {content.cta.label}
        </a>
      </div>
    </header>
  );
};

export default Header;
