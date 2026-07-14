import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './notFound.scss';

const NotFound = () => (
  <section className="not-found" aria-labelledby="not-found-title">
    <p className="not-found__code" aria-hidden="true">404</p>
    <h1 id="not-found-title">Esta página no existe</h1>
    <p>El enlace puede haber cambiado o la dirección puede estar incompleta.</p>
    <div className="not-found__actions">
      <Link to="/" className="not-found__primary">
        <Home size={18} aria-hidden="true" /> Volver al inicio
      </Link>
      <button type="button" onClick={() => window.history.back()} className="not-found__secondary">
        <ArrowLeft size={18} aria-hidden="true" /> Volver atrás
      </button>
    </div>
    <nav className="not-found__links" aria-label="Secciones principales">
      <Link to="/productos">Productos</Link>
      <Link to="/servicios">Servicios</Link>
      <Link to="/proyectos">Proyectos</Link>
    </nav>
  </section>
);

export default NotFound;
