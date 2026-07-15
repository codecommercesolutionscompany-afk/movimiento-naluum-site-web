import { createContext } from 'react';

export const EmailContext = createContext({
  sendEmail: async () => ({ success: false, reason: 'configuration' }),
  isEmailConfigured: false,
});
