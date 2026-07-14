import { Component } from 'react';
import PropTypes from 'prop-types';
import './error_boundary.scss';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Error de render controlado por ErrorBoundary.', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert" aria-labelledby="error-boundary-title">
          <h1 id="error-boundary-title">No pudimos mostrar esta página</h1>
          <p>Ocurrió un error inesperado. Podés volver al inicio e intentarlo nuevamente.</p>
          <a href="/">Volver al inicio</a>
        </main>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
