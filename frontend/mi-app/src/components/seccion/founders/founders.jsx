import PropTypes from 'prop-types';
import './founders.scss';

const founders = [
  {
    id: 'tierra',
    name: 'Tierra Martínez',
    role: 'Co-Fundador y Coordinador General',
    bio: 'Diseñador en Permacultura y educador internacional con más de 25 años de experiencia en procesos de regeneración ecológica, social y cultural. Ha trabajado en más de 40 países desarrollando proyectos de diseño regenerativo, educación y desarrollo comunitario. Co-fundador del Instituto Na Lu’um y del Eco Centro Madre Selva (Argentina), impulsa espacios de aprendizaje vivo donde se integran la sabiduría ancestral, la ciencia moderna y la espiritualidad práctica para construir una humanidad en equilibrio con la Tierra.',
    image: '/img/testimonials/tierra-martinez.webp',
    alt: 'Tierra Martínez',
    width: 801,
    height: 1200,
  },
  {
    id: 'beatriz',
    name: 'Beatriz Ramírez Cruz',
    role: 'Co-Fundadora y Directora General de Campo',
    bio: 'Diseñadora en Permacultura especializada en Bioconstrucción y Diseño Social, con más de 15 años de experiencia. Co-facilitadora de los cursos de Diseño en Permacultura del Instituto Na Lu’um, ha trabajado en más de 30 países compartiendo herramientas para la regeneración ecológica y humana. De origen mexicana, coordina programas educativos en Madre Selva y el Instituto Na Lu’um, impulsando una educación viva que une conocimiento, propósito y acción.',
    image: '/img/testimonials/beatriz-ramirez.webp',
    alt: 'Beatriz Ramírez Cruz',
    width: 1080,
    height: 720,
  },
  {
    id: 'familia',
    name: "La Familia Na Lu'um",
    role: 'Unidos por un propósito común',
    bio: "El Instituto de Permacultura Na Lu'um International tiene como propósito común la regeneración planetaria a través de procesos educativos en diseño de permacultura, bioconstrucción, permacultura social, reingeniería del ser, diseño hidrológico y agricultura sintrópica. Somos una familia unida por la regeneración de los sistemas. La Familia Na Lu'um sostiene un proceso educativo mediante una organización viva, donde cada integrante aporta desde su servicio al proyecto.",
    image: '/img/shared/personas-trabajando.webp',
    alt: 'Personas trabajando juntas bajo una estructura al aire libre',
    width: 1080,
    height: 720,
  },
];

const FounderProfile = ({ founder, reverse = false, collective = false }) => (
  <article
    className={`about-founders__profile${reverse ? ' about-founders__profile--reverse' : ''}${collective ? ' about-founders__profile--collective' : ''}`}
  >
    <figure className="about-founders__media">
      <img
        src={founder.image}
        alt={founder.alt}
        loading="lazy"
        decoding="async"
        width={founder.width}
        height={founder.height}
      />
    </figure>

    <div className="about-founders__profile-content">
      <p className="about-founders__role">{founder.role}</p>
      <h3>{founder.name}</h3>
      <p>{founder.bio}</p>
    </div>
  </article>
);

FounderProfile.propTypes = {
  founder: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  reverse: PropTypes.bool,
  collective: PropTypes.bool,
};

const Founders = () => (
  <section className="about-founders" aria-labelledby="about-founders-title">
    <div className="about-founders__inner">
      <header className="about-founders__heading">
        <p>LAS PERSONAS</p>
        <h2 id="about-founders-title">Los fundadores</h2>
      </header>

      <div className="about-founders__profiles">
        <FounderProfile founder={founders[0]} />
        <FounderProfile founder={founders[1]} reverse />
        <FounderProfile founder={founders[2]} collective />
      </div>
    </div>
  </section>
);

export default Founders;
