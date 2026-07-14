
import { Link } from 'react-router-dom';
import './bitacora.scss';
 
const bitacora = [
    {
        id: 1,
        title: '🌱 Rehabilitamos suelos, pero también vínculos.',
        description: 'Trabajamos regenerando la tierra y fortaleciendo la conexión entre las personas.',
        image: '/img/shared/comunidad-circulo.webp',
        fecha: '2022-06-01',
        routeSeccion: '/bitacora/1',
    },
    {
        id: 2,
        title: '🔥 Encendemos fogones, pero también la memoria colectiva.',
        description: 'Creamos espacios de encuentro donde las historias, saberes y sentires se comparten.',
        image: '/img/shared/equipo-diseno-colaborativo.webp',
        fecha: '2022-06-02',
        routeSeccion: '/bitacora/2',
    },
    {
        id: 3,
        title: '🏡 Diseñamos espacios, pero sobre todo, formas nuevas de habitar.',
        description: 'Pensamos y construimos entornos sostenibles que nutren cuerpo, alma y comunidad.',
        image: '/img/shared/hojas-bosque.webp',
        fecha: '2022-06-03',
        routeSeccion: '/bitacora/3',
    },
    {
        id: 4,
        title: '🌾 Cultivamos alimentos, pero también autonomía.',
        description: 'Promovemos huertas comunitarias y saberes ancestrales para una vida autosuficiente.',
        image: '/img/shared/personas-trabajando.webp',
        fecha: '2022-06-04',
        routeSeccion: '/bitacora/4',
    },
];
 
const Bitacora = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('es-ES', options);
    };

    return (
        <div className="bitacora__container">
            <div className='bitacora__content'>
                <div className='bitacora__content__header'>
                    <div className='bitacora__content__header-img'>
                        <img src="/img/blog/bitacora-de-la-tierra.webp" alt="Bitacora de la Tierra" />
                    </div>
                    
                    <div className='bitacora__content__header-text'>
                        <h2>Bitacora de la Tierra</h2>
                        <span>Nuestro blog</span>
                    </div>
                </div>
                
                <div className='bitacora__content__blog--seccion'>
                    {bitacora.slice(0, 2).map((item) => (
                        <div key={item.id} className='bitacora__content__blog--seccion-item'>
                            <div className='bitacora__content__blog--seccion-item-img'>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className='bitacora__content__blog--seccion-item-text'>
                                <span className='date'>{formatDate(item.fecha)}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <Link to={item.routeSeccion} className='read-more'>
                                    Leer más
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bitacora;
