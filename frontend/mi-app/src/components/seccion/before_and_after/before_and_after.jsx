import { useState } from 'react';
import './before_and_after.scss';

const BeforeAndAfter = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    return (
        <div className="before-and-after__container">
            <div className="before-and-after__header">
                <h2>Impacto y testimonios de personas que lo han hecho realidad</h2>
                <p>Descubre la transformación real que experimenta cada persona con Naluum</p>
            </div>

            <div className="before-and-after__content">
                <div 
                    className="before-and-after__slider-container"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                >
                    {/* Imagen Before (fondo completo) */}
                    <div className="before-and-after__image-before">
                        <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop" alt="Después de Naluum" />
                        <div className="before-and-after__label before-and-after__label--before">
                            <span>DESPUÉS</span>
                        </div>
                    </div>

                    {/* Imagen After (con clip según slider) */}
                    <div 
                        className="before-and-after__image-after"
                        style={{
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                        }}
                    >
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop" alt="Antes de Naluum" />
                        <div className="before-and-after__label before-and-after__label--after">
                            <span>ANTES</span>
                        </div>
                    </div>

                    {/* Slider handle */}
                    <div 
                        className="before-and-after__slider"
                        style={{ left: `${sliderPosition}%` }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        <div className="before-and-after__slider-line"></div>
                        <div className="before-and-after__slider-handle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M8 12L12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAndAfter;
