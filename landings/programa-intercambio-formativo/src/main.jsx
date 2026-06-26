import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import ProgramLanding from './ProgramLanding.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ProgramLanding />
    </HelmetProvider>
  </StrictMode>
);
