import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorState {
  isError: boolean;
  category: string;
  messageKey: string;
  details?: string;
}

export const useError = () => {
  const { t } = useLanguage();
  const [error, setError] = useState<ErrorState>({
    isError: false,
    category: '',
    messageKey: '',
    details: ''
  });

  const showError = useCallback((category: string, messageKey: string, details?: string) => {
    setError({
      isError: true,
      category,
      messageKey,
      details
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      isError: false,
      category: '',
      messageKey: '',
      details: ''
    });
  }, []);

  const getErrorMessage = useCallback(() => {
    if (!error.isError) return '';
    return t(error.category, error.messageKey);
  }, [error, t]);

  return {
    error,
    showError,
    clearError,
    getErrorMessage,
  };
};