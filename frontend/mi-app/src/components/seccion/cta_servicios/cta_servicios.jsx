import { useContext } from 'react';

// ------------------------------
// 📂 SEO y Meta
// Importaciones de componentes relacionados con SEO y metadata

// ------------------------------
// 📂 Layout
// Componentes que forman la estructura y navegación principal (header, footer, nav, etc.)
import Button from '../../ui/button/button';

// ------------------------------
// 📂 Secciones
// Bloques grandes o secciones completas que conforman las páginas

// ------------------------------
// 📂 UI / Componentes visuales pequeños y reutilizables

// ------------------------------
// 📂 Integrations
// Servicios externos, pasarelas de pago, APIs de terceros

// ------------------------------
// 📂 Maps
// Componentes relacionados con mapas y geolocalización

// ------------------------------
// 📂 Tracking
// Funciones y componentes para seguimiento de usuario y analytics

// ------------------------------
// 📂 Context
// Archivos relacionados con Context API para manejo global de estados
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load';


// ------------------------------
// 📂 Hooks
// Hooks personalizados para reutilización de lógica

// ------------------------------
// 📂 Services
// Funciones para llamadas a APIs y lógica de negocio

// ------------------------------
// 📂 Utils
// Funciones auxiliares y helpers

// ------------------------------
// 📂 Styles
// Estilos globales, variables SCSS y temas
import './cta_servicios.scss';
const CTAServicios = () => {
    const { dataImpactoReal = [] } = useContext(ContextJsonLoadContext);
    return(
        <div className="cta-servicios__container">
            <div className="cta-section" style={{ backgroundImage: 'url(/img/sections/cta-sobre-nosotros.webp)' }}
>
                <div className="cta-content">
                    <h2 className="cta-title">Quieres ser parte del cambio?</h2>
                    <p className="cta-text">
                        Cada acción cuenta. Cada persona importa. 
                        Juntos estamos escribiendo el futuro de nuestro planeta.
                    </p>
                    <div className="cta-stats">
                        <div className="stat">
                            <div className="stat-number">{ dataImpactoReal[0].value }</div>
                            <div className="stat-label">{ dataImpactoReal[0].title }</div>
                        </div>

                        <div className="stat">
                            <div className="stat-number">{ dataImpactoReal[7].value }</div>
                            <div className="stat-label">{ dataImpactoReal[7].title }</div>
                        </div>
                        
                        <div className="stat">
                            <div className="stat-number">{ dataImpactoReal[1].value }</div>
                            <div className="stat-label">{ dataImpactoReal[1].title }</div>
                        </div>
                    </div>
                    
                    <div className='cta-button-container'>
                        <Button link={'/servicios'} style='primary' text='Se parte de la misión' />
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default CTAServicios;
