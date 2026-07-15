
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import './button_back.scss';
import { ArrowLeft } from 'lucide-react';

const ButtonBack = ({ fallback = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Divide y limpia la ruta actual
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Si hay ruta padre, construye su path, si no, fallback
  const parentPath = pathParts.length > 0
    ? '/' + pathParts.slice(0, -1).join('/')
    : null;

  // Handler para navegar
  const goBack = () => {
    if (parentPath) {
      navigate(parentPath);
    } else {
      navigate(fallback);
    }
  };

  // Solo renderiza el botón si hay padre o fallback definido
  if (!parentPath && !fallback) return null;

  return (
    <button className="button-back" onClick={goBack}>
      <ArrowLeft size={18} className="icon" />
    </button>
  );
};

ButtonBack.propTypes = {
  fallback: PropTypes.string,
};

export default ButtonBack;
