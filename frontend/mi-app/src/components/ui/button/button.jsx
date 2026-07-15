import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import "./button.scss";

const Button = ({ text, link, icon, style = "primary" }) => {
  return (
    <div className={`cardV2__content-button cardV2__content-button--${style}`}>
      <Link className="cardV2__image-button" to={link}>
        {icon && <span className="cardV2__button-icon">{icon}</span>}
        {text}
      </Link>
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.node,
  style: PropTypes.oneOf(['primary', 'secondary']),
};

export default Button;
