import PropTypes from 'prop-types';
import './discount_badge.scss';

const DiscountBadge = ({ originalPrice, currentPrice }) => {
  // Calcular el porcentaje de descuento
  const calculateDiscount = () => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
      return 0;
    }
    
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const discountPercentage = calculateDiscount();

  // No mostrar el badge si no hay descuento
  if (discountPercentage === 0) {
    return null;
  }

  return (
    <div className="discount-badge">
      <div className="discount-badge__content">
        <span className="discount-badge__text">-{discountPercentage}%</span>
      </div>
    </div>
  );
};

DiscountBadge.propTypes = {
  originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DiscountBadge;
