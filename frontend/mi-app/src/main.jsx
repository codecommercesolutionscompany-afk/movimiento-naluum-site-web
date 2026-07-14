import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { ContextJsonLoadProvider } from './context/context_json_load/context_json_load';
import { EmailProvider } from './context/email/email_context';
import { clearLegacyContentCache } from './utils/cleanupLegacyContentCache';
import { clearLegacyPaymentState } from './utils/cleanupLegacyPaymentState';
import './index.css'
import App from './App.jsx'

clearLegacyContentCache();
clearLegacyPaymentState();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ContextJsonLoadProvider>
        <EmailProvider>
          <App />
        </EmailProvider>
      </ContextJsonLoadProvider>
    </Router>
  </StrictMode>
)
