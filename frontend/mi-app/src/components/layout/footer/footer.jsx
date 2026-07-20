import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';
import './footer.scss';

const footerData = {
  company: {
    name: 'Movimiento Naluum',
    description: 'Una red de personas, proyectos y territorios que aprende, comparte y regenera desde la permacultura.',
    logo: '/img/branding/logo-naluum-transparente.svg',
  },
  navigation: [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/sobre-nosotros' },
    { label: 'Productos', to: '/productos' },
    { label: 'Servicios', to: '/servicios' },
    { label: 'Proyectos', to: '/proyectos' },
    { label: 'Calendario', to: '/calendario' },
    { label: 'Blog', to: '/blog' },
  ],
  contact: {
    email: 'naluumpermacultura@gmail.com',
  },
  socialMedia: [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/Permacultura.Naluum',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/naluum.permacultura',
    },
  ],
};

const Footer = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__content">
        <section className="footer__brand" aria-labelledby="footer-brand-title">
          <div className="footer__brand-heading">
            <img
              src={footerData.company.logo}
              alt=""
              className="footer__logo"
            />
            <h2 id="footer-brand-title">{footerData.company.name}</h2>
          </div>
          <p>{footerData.company.description}</p>
        </section>

        <nav className="footer__navigation" aria-label="Navegación del pie de página">
          <h2>Explorar</h2>
          <ul>
            {footerData.navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="footer__contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Contacto</h2>
          <a className="footer__email" href={`mailto:${footerData.contact.email}`}>
            <Mail aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{footerData.contact.email}</span>
          </a>

          <ul className="footer__social" aria-label="Redes sociales">
            {footerData.socialMedia.map((social) => {
              const Icon = social.icon;

              return (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} de Movimiento Naluum`}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>{social.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Movimiento Naluum. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
