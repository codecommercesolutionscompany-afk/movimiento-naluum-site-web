import "./footer.scss";
import { 
  Facebook, 
  Instagram, 
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
      { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/Permacultura.Naluum", color: "#1877f2" },
      { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/naluum.permacultura", color: "#e4405f" }
    ],
    contact: {
      title: "Contáctanos",
      info: [
        { 
          icon: MapPin, 
          text: "Coto 7 Interior 807 2-D Selva Nova, Playa del Carmen, México",
          type: "address"
        },
        { 
          icon: Mail, 
          text: "naluumpermacultura@gmail.com",
          type: "email",
          link: "mailto:naluumpermacultura@gmail.com"
        },
        { 
          icon: Phone, 
          text: "+54 9 376 425-7777",
          type: "phone",
          link: "tel:+5493764257777"
        }
      ]
    },
    legal: {
      copyright: `© ${new Date().getFullYear()} Movimiento Naluum. Todos los derechos reservados. Juntos por un planeta mejor.`,
      links: ["Política de Privacidad", "Términos de Servicio", "Política de Sostenibilidad"]
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
              {footerData.socialMedia.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.name}
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
              {footerData.contact.info.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.type} className="footer__contact-item">
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
              {footerData.legal.links.map((link) => (
                <span key={link} className="footer__legal-link">
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
