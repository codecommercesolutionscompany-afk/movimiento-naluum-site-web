import Icon from './Icon.jsx';
import SectionHeading from './SectionHeading.jsx';
import { getWhatsappHref, getWhatsappTarget, handleWhatsappClick } from '../utils/whatsapp.js';

const getItemValue = (items, label) => items.find((item) => item.label === label)?.value || '';

const MainLayout = ({ content }) => {
  const basicLabels = [
    'Nombre',
    'Tipo',
    'Duración',
    'Programa',
    'Salida',
    'Locación',
    'Espacio físico',
    'Hospedaje',
    'Alimentación',
    'Capacidad',
  ];
  const basicItems = content.sidebar.items.filter((item) => basicLabels.includes(item.label));
  const priceValue = getItemValue(content.sidebar.items, 'Precio');
  const paymentMethods = getItemValue(content.sidebar.items, 'Medios de pago');
  const countdownValue = content.sidebar.countdown.value;
  const countdownNote = content.sidebar.countdown.note;

  return (
    <section className="sa-section">
      <div className="sa-container sa-main-layout">
        <div className="sa-main-layout__content">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
          <div className="sa-axis-grid">
            {content.axes.map((axis, index) => (
              <article className="sa-axis-card" key={axis.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{axis.title}</h3>
                <p>{axis.text}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="sa-sidebar" aria-label="Datos clave del programa">
          <div className="sa-sidebar__price-box" aria-label="Inversión e inscripción">
            <span>Inversión total por persona</span>
            <strong>{priceValue}</strong>
          </div>

          <div className="sa-countdown">
            <Icon name="CalendarDays" size={18} />
            <div>
              <span>{content.sidebar.countdown.label}</span>
              <strong>{countdownValue}</strong>
              <small>{countdownNote}</small>
            </div>
          </div>

          <h3>{content.sidebar.title}</h3>
          <dl className="sa-sidebar__details">
            {basicItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="sa-sidebar__payment">
            <h4>Medios de pago</h4>
            <p>{paymentMethods}</p>
          </div>

          {content.sidebar.policy ? <p className="sa-sidebar__policy">{content.sidebar.policy}</p> : null}
          <div className="sa-sidebar__process">
            <h4>{content.sidebar.processTitle}</h4>
            {content.sidebar.process.map((step, index) => (
              <p key={step}>
                <strong>{index + 1}.</strong> {step}
              </p>
            ))}
          </div>
          <a
            className="sa-button sa-button--wide"
            href={getWhatsappHref(content.sidebar.cta)}
            target={getWhatsappTarget(content.sidebar.cta)}
            rel={getWhatsappTarget(content.sidebar.cta) ? 'noopener noreferrer' : undefined}
            onClick={() => handleWhatsappClick(content.sidebar.cta)}
          >
            {content.sidebar.cta.label}
          </a>
        </aside>
      </div>
    </section>
  );
};

export default MainLayout;
