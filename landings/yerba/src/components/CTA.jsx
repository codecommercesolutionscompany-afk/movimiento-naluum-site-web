import React from 'react';
import {
  getWhatsappHref,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const CTA = ({ data }) => {
  const { detail } = data;
  const finalCta = {
    ctaText: detail?.cta?.primary_label || 'Consultar y hacer mi pedido',
    ctaLocation: 'final',
    ticketCategory: 'compra',
    whatsappNumber: detail?.cta?.whatsapp_number,
    whatsappMessage: detail?.cta?.messages?.general || detail?.cta?.whatsapp_message,
  };

  return (
    <section className="yerba-cta">
      <div className="yerba-container">
        <h2>Consultar y hacer mi pedido</h2>
        <p>Contanos qué cantidad necesitás y tu localidad para poder coordinar el pedido y cotizar el envío.</p>
        <a
          href={getWhatsappHref(finalCta)}
          target="_blank"
          rel="noopener noreferrer"
          className="yerba-button yerba-button--large yerba-button--inverse"
          onClick={(event) => handleWhatsappClick(finalCta, event)}
          {...getWhatsappTrackingAttributes(finalCta)}
        >
          Consultar y hacer mi pedido
        </a>
      </div>
    </section>
  );
};

export default CTA;
