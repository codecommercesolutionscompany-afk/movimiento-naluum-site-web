import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import VoluntariadoLanding from './VoluntariadoLanding.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <VoluntariadoLanding />
    </HelmetProvider>
  </StrictMode>,
);
