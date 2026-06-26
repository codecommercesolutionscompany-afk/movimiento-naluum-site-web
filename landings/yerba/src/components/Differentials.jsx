import React from 'react';

const Differentials = ({ data }) => {
  const cards = data.differentials_cards || [];

  return (
    <section className="yerba-differentials">
      <div className="yerba-container">
        <h2 className="yerba-differentials__title">Por qué elegir Madre Selva</h2>
        <div className="yerba-differentials__grid">
          {cards.map((card, idx) => (
            <div key={idx} className="yerba-differentials__card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
