import { Routes, Route, useLocation } from 'react-router-dom';
import { Home, User, ShoppingBag, Mail, HelpCircle } from 'lucide-react';

// ------------------------------
// 📂 SEO y Meta
import SEOHelmet from "../../components/seo/SEOHelmet/SEOHelmet";

// ------------------------------
// 📂 Layout
import TimelineNav from '../../components/layout/timeLineNav/timelineNav';
import Header from '../../components/layout/header/header';

// ------------------------------
// 📂 Proyectos
import MadreSelva from '../../components/proyects_base/madre_selva/madre_selva';
import Naluum from '../../components/proyects_base/naluum/naluum';
import Global from '../../components/proyects_base/global/global';

// ------------------------------
// 📂 Styles
import './projects.router.scss';

// ------------------------------
// 📋 Rutas secundarias
const routes_subpage = [
  { id: "inicio", name: "Inicio", path: "#inicio", icon: Home },
  { id: "sobre-naluum", name: "Sobre mí", path: "#sobre-mi", icon: User },
  { id: "servicios", name: "Servicios", path: "#servicios", icon: ShoppingBag },
  { id: "contacto", name: "Contacto", path: "#contacto", icon: Mail },
  { id: "FAQ", name: "Preguntas Frecuentes", path: "#FAQ", icon: HelpCircle },
];

// ------------------------------
// 📦 Componente principal
const Projects = () => {
  const { pathname } = useLocation();

  // ✅ Meta dinámico según la ruta (SEO optimizado y coherente con Naluum)
  const metaData = {
    '/projects/madre-selva': {
      title: 'Madre Selva | Regeneración de la selva misionera y permacultura viva',
      description:
        'Madre Selva es un santuario de 22 hectáreas en la selva misionera donde aplicamos principios de permacultura, restauración ecológica y aprendizaje vivencial. Proyecto raíz del movimiento Naluum para regenerar la Tierra desde la acción local.',
      image: new URL('/img/shared/ecocentro-madre-selva.webp', window.location.origin).href,
      keywords:
        'madre selva, selva misionera, regeneración ecológica, permacultura, reforestación, sostenibilidad, restauración ambiental, Naluum',
    },
    '/projects/naluum': {
      title: 'Naluum | Movimiento global de permacultura y pedagogía regenerativa',
      description:
        'Naluum es un movimiento global que integra, permacultura y procesos pedagógicos para regenerar la conexión entre humanidad y naturaleza. Llevamos el conocimiento y la práctica de la permacultura al mundo.',
      image: new URL('/img/shared/pdc-la-belleza.webp', window.location.origin).href,
      keywords:
        'naluum, permacultura, pedagogía regenerativa, sostenibilidad, educación ambiental, comunidad global, ecología profunda',
    },
    '/projects/global': {
      title: 'Global | Consultoría permacultural para proyectos sostenibles',
      description:
        'Global es la consultoría de Naluum que acompaña a empresas y emprendedores en la creación de proyectos sostenibles. Aplicamos principios de permacultura al diseño organizacional, estrategias digitales y desarrollo regenerativo.',
      image: new URL('/img/projects/proyecto-global-menu.webp', window.location.origin).href,
      keywords:
        'global, consultoría permacultural, sostenibilidad empresarial, economía regenerativa, diseño organizacional, innovación verde, Naluum, permacultura aplicada',
    },
  };

  // 🌍 Meta por defecto para el ecosistema Naluum
  const meta = metaData[pathname] || {
    title: 'Proyectos Naluum | Ecosistema de permacultura y regeneración planetaria',
    description:
      'Explora los proyectos del movimiento Naluum: una red de iniciativas que integran permacultura, educación regenerativa y tecnología al servicio de la Tierra.',
    image: new URL('/img/branding/movimiento-naluum-og.jpg', window.location.origin).href,
    keywords:
      'naluum, permacultura, regeneración, sostenibilidad, educación ambiental, proyectos ecológicos, movimiento global, tecnología regenerativa',
  };

  return (
    <div className="projects__container">
      {/* 🧠 SEO Dinámico */}
      <SEOHelmet
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        author="Neyen Frandino"
        url={`https://miempresa.com${pathname}`}
        image={meta.image}
      />

      {/* 🧭 Navegación por secciones */}
      <Header />
      <TimelineNav sections={routes_subpage} />

      {/* 📂 Rutas internas */}
      <Routes>
        <Route path="madre-selva" element={<MadreSelva />} />
        <Route path="naluum" element={<Naluum />} />
        <Route path="global" element={<Global />} />
      </Routes>
    </div>
  );
};

export default Projects;
