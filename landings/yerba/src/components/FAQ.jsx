import React, { useState } from 'react';

const FAQ = ({ data }) => {
  const faqList = data?.detail?.faq;
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqList || faqList.length === 0) return null;

  return (
    <section className="yerba-faq">
      <div className="yerba-container">
        <h2 className="yerba-faq__title">Preguntas frecuentes</h2>
        <div className="yerba-faq__list">
          {faqList.map((item, index) => (
            <div
              key={index}
              className={`yerba-faq__item ${openIndex === index ? 'yerba-faq__item--open' : ''}`}
            >
              <button
                className="yerba-faq__question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                {item.question}
                <span className="yerba-faq__icon">{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="yerba-faq__answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
