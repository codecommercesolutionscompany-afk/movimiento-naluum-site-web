import React from 'react';
import { generateWhatsappUrl, trackWhatsappStart } from '../utils/whatsapp.js';

const Hero = ({ data }) => {
  const { title, subtitle, description, badge, detail, image } = data;
  const generalMessage = detail?.cta?.messages?.general || detail?.cta?.whatsapp_message;
  const whatsappUrl = generateWhatsappUrl(detail?.cta?.whatsapp_number, generalMessage);

  const handleWhatsappClick = () => {
    trackWhatsappStart({
      ctaLocation: 'hero',
      quantityTier: 'general',
      displayedPriceArsPerKg: null
    });
  };

  return (
    <section className="yerba-hero">
      <div className="yerba-hero__bg">
        {image && (
          <img
            src={`${import.meta.env.BASE_URL}${image}`}
            alt={title}
            className="yerba-hero__bg-image"
          />
        )}
        <div className="yerba-hero__overlay"></div>
      </div>

      <div className="yerba-container yerba-hero__inner">
        <div className="yerba-hero__columns">
          <div className="yerba-hero__content">
            {badge && <span className="yerba-hero__badge">{badge}</span>}
            <h1 className="yerba-hero__title">{title}</h1>
            <h2 className="yerba-hero__subtitle">{subtitle}</h2>
            <p className="yerba-hero__description">{description}</p>
            <p className="yerba-hero__origin">{detail?.producer?.region}</p>
          </div>

          <div className="yerba-hero__glass-wrapper">
            <div className="yerba-hero__glass-card">
              <div className="yerba-hero__glass-header">
                <h3>Consulta tu pedido</h3>
                <p>Definimos cantidad, destino y envío por WhatsApp</p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="yerba-button yerba-button--large yerba-button--full"
                onClick={handleWhatsappClick}
              >
                {detail?.cta?.primary_label || 'Consultar y hacer mi pedido'}
              </a>

              <div className="yerba-hero__glass-pricing">
                <div className="yerba-hero__price-option">
                  <div className="yerba-hero__price-info">
                    <span className="yerba-hero__price-title">Menos de 30 kg</span>
                    <span className="yerba-hero__price-sub">El envío se cotiza según destino</span>
                  </div>
                  <span className="yerba-hero__price-amount">$7.500 <small>ARS/kg</small></span>
                </div>

                <div className="yerba-hero__price-option yerba-hero__price-option--featured">
                  <div className="yerba-hero__price-info">
                    <span className="yerba-hero__price-title">Desde 30 kg inclusive</span>
                    <span className="yerba-hero__price-sub">El envío se cotiza según destino</span>
                  </div>
                  <span className="yerba-hero__price-amount">$6.500 <small>ARS/kg</small></span>
                </div>
              </div>

              <p className="yerba-hero__glass-footer">Trato directo con Madre Selva</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
