import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LinkInBio from './LinkInBio.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LinkInBio />
  </StrictMode>,
);
