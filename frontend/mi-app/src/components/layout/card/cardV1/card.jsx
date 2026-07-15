import PropTypes from 'prop-types';
import "./card.scss";

const Card = ({ products }) => {
  return (
    <div className="card__container">
      <div className="card__grid">
        {products.map((product, index) => (
          <div className="card" key={index}>
            <h2>{product.name}</h2>
            <div className="card__image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="card__description">
              <p>{product.description}</p>
            </div>
            <div className="card__info-bottom">
              <div className="card__price">
                <span>{product.price}</span>
                <span className="card__currency">{product.currency}</span>
              </div>
              <button className="card__button-buy">Inscribirse</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Card.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    })
  ).isRequired,
};

export default Card;
