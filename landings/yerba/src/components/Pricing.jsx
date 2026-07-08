import React from 'react';
import {
  getWhatsappHref,
  getWhatsappTrackingAttributes,
  handleWhatsappClick,
} from '../utils/whatsapp.js';

const Pricing = ({ data }) => {
  const { detail } = data;
  const under30Cta = {
    ctaText: 'Consultar pedido menor a 30 kg',
    ctaLocation: 'pricing_under_30kg',
    ticketCategory: 'menos30',
    whatsappNumber: detail?.cta?.whatsapp_number,
    whatsappMessage: detail?.cta?.messages?.under_30kg,
    productVariant: 'under_30kg',
    quantitySegment: 'menos_30kg',
    pricePerKg: 7500,
  };
  const plus30Cta = {
    ctaText: 'Consultar pedido desde 30 kg',
    ctaLocation: 'pricing_30kg_plus',
    ticketCategory: 'mas30',
    whatsappNumber: detail?.cta?.whatsapp_number,
    whatsappMessage: detail?.cta?.messages?.['30kg_plus'],
    productVariant: '30kg_plus',
    quantitySegment: 'desde_30kg',
    pricePerKg: 6500,
  };

  return (
    <section className="yerba-pricing">
      <div className="yerba-container">
        <h2 className="yerba-pricing__title">Elegi tu tramo de pedido</h2>

        <div className="yerba-pricing__cards">
          <div className="yerba-pricing__card">
            <h3 className="yerba-pricing__card-title">Pedido menor a 30 kg</h3>
            <p className="yerba-pricing__card-desc">Para pedidos de cualquier cantidad menor a 30 kg.</p>
            <p className="yerba-pricing__card-price">$7.500 <span>ARS por kg</span></p>
            <p className="yerba-pricing__card-shipping">El envío se coordina y cotiza según el destino.</p>
            <a
              href={getWhatsappHref(under30Cta)}
              target="_blank"
              rel="noopener noreferrer"
              className="yerba-button"
              onClick={(event) => handleWhatsappClick(under30Cta, event)}
              {...getWhatsappTrackingAttributes(under30Cta)}
            >
              Consultar pedido menor a 30 kg
            </a>
          </div>

          <div className="yerba-pricing__card yerba-pricing__card--featured">
            <span className="yerba-pricing__featured-badge">Desde 30 kg inclusive</span>
            <h3 className="yerba-pricing__card-title">Pedido desde 30 kg</h3>
            <p className="yerba-pricing__card-desc">Precio disponible desde 30 kg inclusive.</p>
            <p className="yerba-pricing__card-price">$6.500 <span>ARS por kg</span></p>
            <p className="yerba-pricing__card-shipping">El envío se coordina y cotiza según el destino.</p>
            <a
              href={getWhatsappHref(plus30Cta)}
              target="_blank"
              rel="noopener noreferrer"
              className="yerba-button yerba-button--inverse"
              onClick={(event) => handleWhatsappClick(plus30Cta, event)}
              {...getWhatsappTrackingAttributes(plus30Cta)}
            >
              Consultar pedido desde 30 kg
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
