import React from 'react';
import { generateWhatsappUrl, trackWhatsappStart } from '../utils/whatsapp.js';

const CTA = ({ data }) => {
  const { detail } = data;
  const whatsappUrl = generateWhatsappUrl(
    detail?.cta?.whatsapp_number,
    detail?.cta?.messages?.general || detail?.cta?.whatsapp_message
  );

  const handleWhatsappClick = () => {
    trackWhatsappStart({
      ctaLocation: 'final',
      quantityTier: 'general',
      displayedPriceArsPerKg: null
    });
  };

  return (
    <section className="yerba-cta">
      <div className="yerba-container">
        <h2>Consultar y hacer mi pedido</h2>
        <p>Contanos qué cantidad necesitás y tu localidad para poder coordinar el pedido y cotizar el envío.</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="yerba-button yerba-button--large yerba-button--inverse"
          onClick={handleWhatsappClick}
        >
          Consultar y hacer mi pedido
        </a>
      </div>
    </section>
  );
};

export default CTA;
