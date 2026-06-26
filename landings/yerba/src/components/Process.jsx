import React from 'react';

const Process = ({ data }) => {
  const steps = data.process || [];

  return (
    <section className="yerba-process">
      <div className="yerba-container">
        <h2 className="yerba-process__title">Nuestro proceso artesanal</h2>
        <div className="yerba-process__timeline">
          {steps.map((step, i) => (
            <div key={i} className="yerba-process__step">
              <div className="yerba-process__number">{i + 1}</div>
              <div className="yerba-process__content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
