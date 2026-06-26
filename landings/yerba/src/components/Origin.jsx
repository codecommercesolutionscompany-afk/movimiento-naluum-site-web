import React from 'react';

const Origin = ({ data }) => {
  return (
    <section className="yerba-origin">
      <div className="yerba-container yerba-origin__content">
        <h2>La historia detrás del mate</h2>
        {data.detail?.producer?.region && (
          <p className="yerba-origin__region">{data.detail.producer.region}</p>
        )}
        <div className="yerba-origin__text">
          {data.origin_text.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Origin;
