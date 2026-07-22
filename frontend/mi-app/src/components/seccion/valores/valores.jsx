import './valores.scss';

const valores = [
  {
    id: 1,
    title: 'Ética y Valores Fundamentales',
    description: 'Actuar con respeto e integridad, fomentando la confianza y la transparencia en todo lo que hacemos.',
  },
  {
    id: 2,
    title: 'Diversidad y Colaboración',
    description: 'Abrazamos la diversidad y trabajamos juntos, valorando cada perspectiva para construir soluciones más humanas.',
  },
  {
    id: 3,
    title: 'Pasión y Compromiso',
    description: 'Nos mueve el compromiso y el amor por lo que hacemos, creando desde el corazón con sentido y propósito.',
  },
];

const Valores = () => (
  <section className="about-values" aria-labelledby="about-values-title">
    <div className="about-values__inner">
      <header className="about-values__heading">
        <h2 id="about-values-title">Valores</h2>
      </header>

      <div className="about-values__list">
        {valores.map((valor) => (
          <article
            key={valor.id}
            className={`about-values__item about-values__item--${valor.id === 2 ? 'right' : 'left'}`}
          >
            <p className="about-values__index" aria-hidden="true">0{valor.id}</p>
            <div>
              <h3>{valor.title}</h3>
              <p>{valor.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Valores;
