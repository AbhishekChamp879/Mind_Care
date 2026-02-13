import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorMessageProps {
  category: string;
  messageKey: string;
  onRetry?: () => void;
  onClose?: () => void;
  details?: string;
}

export const ErrorMessage = ({
  category,
  messageKey,
  onRetry,
  onClose,
  details,
}: ErrorMessageProps) => {
  const { t } = useLanguage();

  return (
    <div className="error-message-container">
      <div className="error-message-content">
        <h3>{t('generic', 'title')}</h3>
        <p>{t(category, messageKey)}</p>
        {details && (
          <details>
            <summary>{t('generic', 'details')}</summary>
            <pre>{details}</pre>
          </details>
        )}
        <div className="error-message-actions">
          {onRetry && (
            <button onClick={onRetry} className="retry-button">
              {t('generic', 'retry')}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="close-button">
              {t('generic', 'close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};