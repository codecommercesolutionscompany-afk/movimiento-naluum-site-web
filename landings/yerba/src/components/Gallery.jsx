import React from 'react';

const Gallery = ({ data }) => {
  const images = data.gallery;

  if (!images || images.length === 0) return null;

  return (
    <section className="yerba-gallery">
      <div className="yerba-gallery__grid">
        {images.map((img, i) => (
          <div key={i} className="yerba-gallery__item">
            <img
              src={`${import.meta.env.BASE_URL}${img}`}
              alt={`Yerba Mate Madre Selva - Imagen ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
