import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import emailjs from '@emailjs/browser';
import { EmailContext } from './email_context_value';

export const EmailProvider = ({ children }) => {
  const config = useMemo(() => ({
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  }), []);
  const isEmailConfigured = Boolean(config.serviceId && config.templateId && config.publicKey);

  const sendEmail = useCallback(async (emailData) => {
    if (!isEmailConfigured) {
      if (import.meta.env.DEV) {
        console.error('EmailJS no está configurado. Revisa las variables VITE_EMAILJS requeridas.');
      }
      return { success: false, reason: 'configuration' };
    }

    try {
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        emailData,
        config.publicKey,
      );
      return { success: true, response };
    } catch {
      if (import.meta.env.DEV) {
        console.error('EmailJS no pudo enviar el mensaje.');
      }
      return { success: false, reason: 'send' };
    }
  }, [config, isEmailConfigured]);

  const value = useMemo(
    () => ({ sendEmail, isEmailConfigured }),
    [isEmailConfigured, sendEmail],
  );

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

EmailProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
