import { useState, useEffect, useRef, useContext } from 'react';
import './card_data_impacto.scss';

import {ContextJsonLoadContext} from '../../../context/context_json_load/context_json_load'

// Componente individual para cada card con su propio hook
const ImpactCard = ({ item }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    setIsVisible(true);
                    hasAnimated.current = true;
                }
            },
            { threshold: 0.2 }
        );

        const element = elementRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const end = item.value;
        const originalText = end.toString();
        const numberMatch = originalText.match(/[\d,]+/);
        const cleanNumber = numberMatch ? numberMatch[0].replace(/,/g, '') : '0';
        const endValue = parseInt(cleanNumber) || 0;
        
        if (endValue === 0) {
            setCount(originalText);
            return;
        }

        let startTimestamp = null;
        let animationFrame = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const currentValue = Math.floor(progress * endValue);
            const formattedNumber = currentValue.toLocaleString('es-ES');
            const formattedValue = originalText.replace(/[\d,]+/, formattedNumber);
            
            setCount(formattedValue);
            
            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step);
            }
        };
        
        animationFrame = window.requestAnimationFrame(step);
        
        return () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, item.value]);

    return (
        <div 
            className='card-data-impacto__card' 
            ref={elementRef}
        >
            <div className='card-data-impacto__icon'>
                <i className={item.icon}></i>
            </div>
            
            <h3 className='card-data-impacto__value'>
                {count || '0'}
            </h3>
            
            <h4 className='card-data-impacto__title'>
                {item.title}
            </h4>
            
            <p className='card-data-impacto__description'>
                {item.description}
            </p>
        </div>
    );
};
 
const CardDataImpacto = () => {
    const { dataImpactoReal = [] } = useContext(ContextJsonLoadContext);
    
    // Validación de datos
    return (
        <div className='card-data-impacto'>
            <div className='card-data-impacto__grid'>
                {dataImpactoReal.slice(0, 4).map((item) => (
                    <ImpactCard 
                        key={item.id || item.title}
                        item={item} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CardDataImpacto;
