import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './cta_logros_reconocimientos.scss';

import { useState, useEffect } from 'react';

const petals = [
  { className: "petal-1", rotate: "rotate(0 100 70)" },
  { className: "petal-2", rotate: "rotate(45 100 40)" },
  { className: "petal-3", rotate: "rotate(90 100 40)" },
  { className: "petal-4", rotate: "rotate(135 100 40)" },
  { className: "petal-5", rotate: "rotate(180 100 40)" },
  { className: "petal-6", rotate: "rotate(225 100 40)" },
  { className: "petal-7", rotate: "rotate(270 100 40)" },
  { className: "petal-8", rotate: "rotate(315 100 40)" },
];

 
// // Simulamos Link para la demo
// const Link = ({ to, className, children }) => (
//     <a href={to} className={className}>{children}</a>
// );

const CtaLogrosReconocimientos = ({redirectRouter}) => {
    const [stemVisible, setStemVisible] = useState(false);
    const [leavesVisible, setLeavesVisible] = useState([false, false, false]);
    const [petalsVisible, setPetalsVisible] = useState(Array(8).fill(false));
    const [flowerCenterVisible, setFlowerCenterVisible] = useState(false);
    const [flowerInnerVisible, setFlowerInnerVisible] = useState(false);
    const [flowerDotVisible, setFlowerDotVisible] = useState(false);

    useEffect(() => {
        // Animación del tallo
        const stemTimer = setTimeout(() => setStemVisible(true), 1200);
        
        // Animación de las hojas
        const leaf1Timer = setTimeout(() => {
            setLeavesVisible(prev => [true, prev[1], prev[2]]);
        }, 1800);
        
        const leaf2Timer = setTimeout(() => {
            setLeavesVisible(prev => [prev[0], true, prev[2]]);
        }, 2200);
        
        const leaf3Timer = setTimeout(() => {
            setLeavesVisible(prev => [prev[0], prev[1], true]);
        }, 2600);

        // Animación de los pétalos
        const petalTimers = [];
        for (let i = 0; i < 8; i++) {
            const timer = setTimeout(() => {
                setPetalsVisible(prev => {
                    const newState = [...prev];
                    newState[i] = true;
                    return newState;
                });
            }, 3000 + (i * 100));
            petalTimers.push(timer);
        }

        // Animación del centro
        const centerTimer = setTimeout(() => setFlowerCenterVisible(true), 3800);
        const innerTimer = setTimeout(() => setFlowerInnerVisible(true), 4000);
        const dotTimer = setTimeout(() => setFlowerDotVisible(true), 4200);

        return () => {
            clearTimeout(stemTimer);
            clearTimeout(leaf1Timer);
            clearTimeout(leaf2Timer);
            clearTimeout(leaf3Timer);
            petalTimers.forEach(timer => clearTimeout(timer));
            clearTimeout(centerTimer);
            clearTimeout(innerTimer);
            clearTimeout(dotTimer);
        };
    }, []);

    const petalStyle = (index, isVisible) => ({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0)',
        transition: 'all 0.5s ease-out',
        filter: 'drop-shadow(0 1px 2px rgba(6, 59, 44, 0.2))',
        animation: isVisible ? 'shimmer 4s ease-in-out infinite' : 'none',
        animationDelay: `${index * 0.5}s`
    });

    const leafStyleSVG = (isVisible, rotation) => ({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? `scale(1) rotate(${rotation}deg)` : 'scale(0) rotate(0deg)',
        transition: 'all 0.8s ease-out',
        transformOrigin: 'center'
    });

    return (
        <div className='cta-logros-reconocimientos__container'>
            <div className='cta-logros-reconocimientos__background-elements'>
                <div className='floating-seed seed-1'></div>
                <div className='floating-seed seed-2'></div>
                <div className='floating-seed seed-3'></div>
                <div className='leaf leaf-1'></div>
                <div className='leaf leaf-2'></div>
            </div>
            
            <div className='cta-logros-reconocimientos__content'>
                <div className='cta-logros-reconocimientos__decoration-top'>
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                </div>
                
                <div className='cta-logros-reconocimientos__inner'>
                    <div className='cta-logros-reconocimientos__text-container'>
                        <div className='cta-logros-reconocimientos__text-title'>
                            <h1>¡Semillas que florecen!</h1>
                            <div className='title-underline'></div>
                        </div>
                        
                        <div className='cta-logros-reconocimientos__text-subtitle'>
                            <p>
                                Los frutos del trabajo colectivo florecen cuando sembramos con conciencia y propósito. 
                                Cada paso con las comunidades refleja conexión, aprendizaje y compromiso con la vida.
                            </p>
                        </div>

                        <div className='cta-logros-reconocimientos__text-paragraph'>
                            <div className='quote-mark'>&quot;</div>
                            <span>
                                A través de proyectos colaborativos y diseño participativo, fortalecemos redes humanas que sanan, empoderan y transforman realidades con esperanza y cooperación.
                            </span>
                        </div>

                        
                        <div className='cta-logros-reconocimientos__text-button'>
                            <Link to={`${redirectRouter}`} className='button-CTA-logros'>
                                <span className='button-text'>Semillas que germinan</span>
                                <svg className='button-icon' viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z" 
                                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    <div className='cta-logros-reconocimientos__visual'>
                        <div className='growth-animation'>
                            <svg viewBox="0 0 200 300" className='plant-svg'>
                                <defs>
                                    <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#063B2C" />
                                        <stop offset="100%" stopColor="#48514A" />
                                    </linearGradient>
                                    <radialGradient id="leafGradient">
                                        <stop offset="0%" stopColor="#D0DE85" />
                                        <stop offset="100%" stopColor="#063B2C" />
                                    </radialGradient>
                                    <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#F7DC6F" />
                                        <stop offset="50%" stopColor="#F4D03F" />
                                        <stop offset="100%" stopColor="#F1C40F" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Tallo */}
                                <path 
                                    d="M100 280 Q 100 200 90 150 Q 85 100 100 50" 
                                    stroke="url(#stemGradient)" 
                                    strokeWidth="4" 
                                    fill="none"
                                    style={{
                                        strokeDasharray: '300',
                                        strokeDashoffset: stemVisible ? '0' : '300',
                                        transition: 'stroke-dashoffset 2s ease-out'
                                    }}
                                />
                                
                                {/* Hojas */}
                                <ellipse cx="90" cy="220" rx="30" ry="15" 
                                         fill="url(#leafGradient)" 
                                         transform="rotate(-30 75 220)"
                                         style={leafStyleSVG(leavesVisible[0], -30)} />
                                <ellipse cx="125" cy="150" rx="35" ry="18" 
                                         fill="url(#leafGradient)" 
                                         transform="rotate(25 125 150)"
                                         style={leafStyleSVG(leavesVisible[1], 25)} />
                                <ellipse cx="80" cy="100" rx="25" ry="12" 
                                         fill="url(#leafGradient)" 
                                         transform="rotate(-20 70 100)"
                                         style={leafStyleSVG(leavesVisible[2], -20)} />
                                
                                {/* Flor */}
                                <g className="flower">
                                    {petals.map((petal, index) => (
                                        <ellipse
                                        key={index}
                                        className={`petal ${petal.className}`}
                                        cx="100"
                                        cy="20"
                                        rx="8"
                                        ry="16"
                                        fill="#F7DC6F"
                                        transform={petal.rotate}
                                        style={petalStyle(index, petalsVisible[index])}
                                        />
                                    ))}
                                    <circle className="flower-center" cx="100" cy="40" r="10" fill="#8F764C" style={{ opacity: flowerCenterVisible ? 1 : 0 }} />
                                    <circle className="flower-inner" cx="100" cy="40" r="6" fill="#63502D" style={{ opacity: flowerInnerVisible ? 1 : 0 }} />
                                    <circle className="flower-dot" cx="100" cy="40" r="2" fill="#F7DC6F" style={{ opacity: flowerDotVisible ? 1 : 0 }} />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className='cta-logros-reconocimientos__decoration-bottom'>
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 L100,10 Q75,20 50,10 T0,10 Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

CtaLogrosReconocimientos.propTypes = {
    redirectRouter: PropTypes.string.isRequired,
};

export default CtaLogrosReconocimientos;
