import Icon from './Icon.jsx';

const LodgingPaymentSection = ({ content }) => (
  <section className="sa-section">
    <div className="sa-container sa-two-panel">
      <article className="sa-list-panel">
        <Icon name="Tent" size={26} />
        <h2>{content.lodgingTitle}</h2>
        <ul>
          {content.lodging.map((item) => (
            <li key={item}>
              <Icon name="CheckCircle2" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="sa-list-panel sa-list-panel--payment">
        <Icon name="CreditCard" size={26} />
        <h2>{content.paymentTitle}</h2>
        <ul>
          {content.paymentMethods.map((item) => (
            <li key={item}>
              <Icon name="CheckCircle2" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default LodgingPaymentSection;
