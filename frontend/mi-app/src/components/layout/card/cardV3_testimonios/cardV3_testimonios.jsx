import "./cardV3_testimonios.scss";

const CardV3_testimonios = (/* objectContentCardTestimonios */) => {
    
  const objectContentCardTestimonios = {
    title: "Lo que dicen nuestros clientes",
    testimonios: [
      {
        content:
          "Un servicio excepcional que transformó completamente la forma en que operamos. El equipo fue profesional y atento en todo momento.",
        author: {
          name: "María González",
          avatar: "img/shared/manos-plantines.webp",
          info: {
            title: "Directora de Operaciones",
            text: "Directora de Operaciones",
          },
        },
      },
      {
        content:
          "Implementamos las soluciones recomendadas y vimos resultados inmediatos. La experiencia y conocimiento del equipo son invaluables.",
        author: {
          name: "Carlos Medina",
          avatar: "img/shared/comunidad-circulo.webp",
          info: {
            title: "CEO, Innovatech",
            text: "CEO, Innovatech",
          },
        },
      },
    ],
  };

  return (
    <div className="cardV3__testimonials">
      <h2 className="cardV3__section-title">{objectContentCardTestimonios.title}</h2>
      <div className="cardV3__testimonials-container">
        {objectContentCardTestimonios.testimonios.map((testimonio, index) => (
          <div className="cardV3__testimonial" key={index}>
            <div className="cardV3__testimonial-content">
              <p>{testimonio.content}</p>
            </div>
            <div className="cardV3__testimonial-author">
              <div className="cardV3__testimonial-avatar">
                <img src={testimonio.author.avatar} alt={`Avatar de ${testimonio.author.name}`} />
              </div>
              <div className="cardV3__testimonial-info">
                <h4>{testimonio.author.name}</h4>
                <p>{testimonio.author.info.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardV3_testimonios;
