import "./footer.scss";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

const Footer = () => {

  // Objeto estático con toda la información del footer
  const footerData = {
    company: {
      name: "Movimiento Naluum",
      description: "Transformamos tu negocio hacia un futuro sostenible con soluciones innovadoras que regeneran nuestro planeta mientras impulsan tu éxito.",
      logo: '/img/branding/logo-naluum-transparente.svg'
    },
    socialMedia: [
      { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "#1877f2" },
      { name: "Twitter", icon: Twitter, url: "https://twitter.com", color: "#1da1f2" },
      { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "#e4405f" },
      { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", color: "#0077b5" },
      { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "#ff0000" }
    ],
    contact: {
      title: "Contáctanos",
      info: [
        { 
          icon: MapPin, 
          text: "Av. Regeneración 2030, Buenos Aires, Argentina",
          type: "address"
        },
        { 
          icon: Mail, 
          text: "contacto@ecoregen.com",
          type: "email",
          link: "mailto:contacto@ecoregen.com"
        },
        { 
          icon: Phone, 
          text: "+54 11 2030-4050",
          type: "phone",
          link: "tel:+541120304050"
        }
      ]
    },
    legal: {
      copyright: `© ${new Date().getFullYear()} Movimien Naluum. Todos los derechos reservados. Juntos por un planeta mejor.`,
      links: [
        { name: "Política de Privacidad", url: "/privacy" },
        { name: "Términos de Servicio", url: "/terms" },
        { name: "Política de Sostenibilidad", url: "/sustainability" }
      ]
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Sección de la empresa */}
          <div className="footer__section footer__brand">
            <div className="footer__logo">
              <h2 className="footer__logo-text">{footerData.company.name}</h2>
              <div className="footer__logo-decoration"></div>
              <img src={footerData.company.logo} alt="Logo Movimiento Naluum" className="footer__logo-img" />
            </div>
            <p className="footer__description">{footerData.company.description}</p>
            
            <div className="footer__social">
              {footerData.socialMedia.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.url} 
                    className="footer__social-link"
                    aria-label={social.name}
                    style={{'--social-color': social.color}}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="footer__section">
            <h3 className="footer__title">{footerData.contact.title}</h3>
            <ul className="footer__contact-list">
              {footerData.contact.info.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <li key={index} className="footer__contact-item">
                    <div className="footer__contact-icon">
                      <IconComponent size={16} />
                    </div>
                    {item.link ? (
                      <a href={item.link} className="footer__contact-text">
                        {item.text}
                      </a>
                    ) : (
                      <span className="footer__contact-text">{item.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Parte inferior del footer */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">{footerData.legal.copyright}</p>
            <div className="footer__legal-links">
              {footerData.legal.links.map((link, index) => (
                <a key={index} href={link.url} className="footer__legal-link">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
