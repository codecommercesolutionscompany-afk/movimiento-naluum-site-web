import React from 'react';
import { generateWhatsappUrl, trackWhatsappStart } from '../utils/whatsapp.js';

const Pricing = ({ data }) => {
  const { detail } = data;
  const number = detail?.cta?.whatsapp_number;
  const under30Url = generateWhatsappUrl(number, detail?.cta?.messages?.under_30kg);
  const plus30Url = generateWhatsappUrl(number, detail?.cta?.messages?.['30kg_plus']);

  const handleTierClick = (ctaLocation, quantityTier, displayedPriceArsPerKg) => {
    trackWhatsappStart({
      ctaLocation,
      quantityTier,
      displayedPriceArsPerKg
    });
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
              href={under30Url}
              target="_blank"
              rel="noopener noreferrer"
              className="yerba-button"
              onClick={() => handleTierClick('pricing_under_30kg', 'under_30kg', 7500)}
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
              href={plus30Url}
              target="_blank"
              rel="noopener noreferrer"
              className="yerba-button yerba-button--inverse"
              onClick={() => handleTierClick('pricing_30kg_plus', '30kg_plus', 6500)}
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
