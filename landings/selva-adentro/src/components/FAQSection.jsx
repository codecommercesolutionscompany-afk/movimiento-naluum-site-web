import { useState } from 'react';
import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

const FAQSection = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id={content.id} className="sa-section sa-section--muted">
      <div className="sa-container">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} align="center" />
        <div className="sa-faq">
          {content.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article className={`sa-faq__item ${isOpen ? 'is-open' : ''}`} key={item.question}>
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <span>{item.question}</span>
                  <Icon name="Plus" size={20} />
                </button>
                {isOpen ? <p>{item.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
