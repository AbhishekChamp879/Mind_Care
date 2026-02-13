/**
 * @fileoverview Error Handling Hooks - React hooks for error management
 * 
 * Custom React hooks for error handling, reporting, and recovery in mental health applications.
 * Provides crisis-aware error management with automatic reporting and user-friendly recovery options.
 * 
 * Features:
 * - Automatic error classification and reporting
 * - Crisis detection and appropriate response
 * - Retry mechanisms with exponential backoff
 * - Privacy-conscious error logging
 * - Integration with error boundaries
 * - Mental health-specific error contexts
 * 
 * @example
 * ```tsx
 * import { useErrorHandler, useAsyncError, useCrisisDetection } from '@/hooks/useErrorHandling';
 * 
 * function MyComponent() {
 *   const { handleError, reportError } = useErrorHandler();
 *   const throwAsyncError = useAsyncError();
 *   const { checkForCrisis } = useCrisisDetection();
 * 
 *   const handleSubmit = async () => {
 *     try {
 *       await submitData();
 *     } catch (error) {
 *       handleError(error, { component: 'MyComponent', action: 'submit' });
 *     }
 *   };
 * }
 * ```
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { ErrorInfo } from 'react';
import { errorReportingService, ErrorContext } from '@/services/errorReportingService';

/**
 * Error handler options
 */
interface ErrorHandlerOptions {
  /** Show user notification */
  showToast?: boolean;
  /** Enable crisis detection */
  detectCrisis?: boolean;
  /** Log to console */
  logToConsole?: boolean;
  /** Rethrow error after handling */
  rethrow?: boolean;
  /** Component name for context */
  componentName?: string;
  /** Additional context */
  context?: Partial<ErrorContext>;
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000
};

/**
 * Main error handling hook
 */
export const useErrorHandler = (defaultOptions: Partial<ErrorHandlerOptions> = {}) => {
  const [lastError, setLastError] = useState<Error | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  /**
   * Handle error with context and reporting
   */
  const handleError = useCallback(async (
    error: Error,
    options: ErrorHandlerOptions = {}
  ) => {
    const mergedOptions = { ...defaultOptions, ...options };

    setLastError(error);
    setErrorCount(prev => prev + 1);

    // Build context
    const context: ErrorContext = {
      component: mergedOptions.componentName,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      route: window.location.pathname,
      ...mergedOptions.context
    };

    // Report error
    try {
      const errorId = await errorReportingService.reportError(error, context);

      // Log to console if enabled
      if (mergedOptions.logToConsole !== false) {
        console.error('Error handled:', { error, errorId, context });
      }

      // Check for crisis situation
      if (mergedOptions.detectCrisis !== false) {
        const isCrisis = errorReportingService.isCrisisRelated(error, context);
        if (isCrisis) {
          console.warn('Crisis situation detected:', errorId);
          // Could trigger additional crisis protocols here
        }
      }

      return errorId;
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      return null;
    }
  }, [defaultOptions]);

  /**
   * Handle error with rethrowing option
   */
  const handleErrorWithRethrow = useCallback(async (
    error: Error,
    options: ErrorHandlerOptions = {}
  ) => {
    const errorId = await handleError(error, { ...options, rethrow: false });
    if (options.rethrow) {
      throw error;
    }
    return errorId;
  }, [handleError]);

  /**
   * Report error without handling
   */
  const reportError = useCallback(async (
    error: Error,
    context: Partial<ErrorContext> = {}
  ) => {
    return await errorReportingService.reportError(error, context);
  }, []);

  /**
   * Get user-friendly error message
   */
  const getUserMessage = useCallback((error: Error, context?: ErrorContext) => {
    return errorReportingService.getUserFriendlyMessage(error, context);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    handleError,
    reportError,
    getUserMessage,
    clearError,
    lastError,
    errorCount
  };
};

/**
 * Hook for throwing async errors that will be caught by error boundaries
 */
export const useAsyncError = () => {
  const [, setError] = useState<Error>();

  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

/**
 * Hook for retry functionality with exponential backoff
 */
export const useRetry = (
  asyncFunction: () => Promise<any>,
  config: Partial<RetryConfig> = {}
) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const { handleError } = useErrorHandler();

  const executeWithRetry = useCallback(async () => {
    setIsRetrying(true);
    setLastError(null);

    for (let attempt = 0; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const result = await asyncFunction();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error(String(error));
        setLastError(errorInstance);
        setRetryCount(attempt + 1);

        // If this is the last attempt, handle error and rethrow
        if (attempt === retryConfig.maxAttempts) {
          await handleError(errorInstance, {
            context: { retryAttempts: attempt + 1 }
          });
          setIsRetrying(false);
          throw errorInstance;
        }

        // Calculate delay for next retry
        const delay = Math.min(
          retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
          retryConfig.maxDelay
        );

        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [asyncFunction, retryConfig, handleError]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setLastError(null);
  }, []);

  return {
    executeWithRetry,
    isRetrying,
    retryCount,
    lastError,
    reset,
    canRetry: retryCount < retryConfig.maxAttempts
  };
};

/**
 * Hook for crisis detection and response
 */
export const useCrisisDetection = () => {
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const { handleError } = useErrorHandler();

  /**
   * Check error for crisis indicators
   */
  const checkForCrisis = useCallback((error: Error, context?: ErrorContext) => {
    const isCrisis = errorReportingService.isCrisisRelated(error, context);
    setCrisisDetected(isCrisis);

    if (isCrisis) {
      // Determine crisis level based on error classification
      const classification = errorReportingService.classifyError(error);

      switch (classification.severity) {
        case 'critical':
          setCrisisLevel('critical');
          break;
        case 'high':
          setCrisisLevel('high');
          break;
        case 'medium':
          setCrisisLevel('medium');
          break;
        default:
          setCrisisLevel('low');
      }

      // Report crisis situation
      handleError(error, {
        detectCrisis: true,
        context: {
          ...context,
          mentalHealthContext: {
            crisisIndicators: true,
            supportLevel: crisisLevel === 'critical' ? 'high' : crisisLevel
          }
        }
      });
    }

    return isCrisis;
  }, [handleError, crisisLevel]);

  /**
   * Clear crisis state
   */
  const clearCrisis = useCallback(() => {
    setCrisisDetected(false);
    setCrisisLevel('low');
  }, []);

  /**
   * Get crisis resources
   */
  const getCrisisResources = useCallback(() => {
    return {
      hotlines: [
        { name: '988 Suicide & Crisis Lifeline', number: '988' },
        { name: 'Crisis Text Line', number: '741741', method: 'text' }
      ],
      emergencyContacts: [
        { name: 'Emergency Services', number: '911' }
      ],
      onlineResources: [
        { name: 'AI Crisis Chat', url: '/app/chat' }
      ]
    };
  }, []);

  return {
    crisisDetected,
    crisisLevel,
    checkForCrisis,
    clearCrisis,
    getCrisisResources
  };
};

/**
 * Hook for network error handling
 */
export const useNetworkError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkError, setNetworkError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      const offlineError = new Error('Network connection lost');
      setNetworkError(offlineError);
      handleError(offlineError, {
        context: { connectivity: 'offline' }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleError]);

  /**
   * Handle network-related errors
   */
  const handleNetworkError = useCallback(async (error: Error) => {
    setNetworkError(error);
    return await handleError(error, {
      context: {
        connectivity: isOnline ? 'online' : 'offline',
        networkError: true
      }
    });
  }, [handleError, isOnline]);

  return {
    isOnline,
    networkError,
    handleNetworkError
  };
};

/**
 * Hook for component-specific error boundaries
 */
export const useErrorBoundary = (componentName: string) => {
  const { handleError } = useErrorHandler({ componentName });
  const throwAsyncError = useAsyncError();

  /**
   * Handle component error and propagate to boundary
   */
  const handleComponentError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    // Report error first
    handleError(error, {
      context: {
        componentStack: errorInfo?.componentStack,
        component: componentName
      }
    });

    // Throw to be caught by error boundary
    throwAsyncError(error);
  }, [handleError, throwAsyncError, componentName]);

  return {
    handleComponentError
  };
};

/**
 * Hook for form error handling
 */
export const useFormError = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { handleError, getUserMessage } = useErrorHandler();

  /**
   * Handle form submission errors
   */
  const handleSubmissionError = useCallback(async (error: Error) => {
    const errorId = await handleError(error, {
      context: { formSubmission: true }
    });

    // Check if it's a validation error with field details
    if (error.message.includes('validation') && (error as any).fields) {
      setFieldErrors((error as any).fields);
    } else {
      setGeneralError(getUserMessage(error));
    }

    return errorId;
  }, [handleError, getUserMessage]);

  /**
   * Set field-specific error
   */
  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  /**
   * Clear specific field error
   */
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  return {
    fieldErrors,
    generalError,
    handleSubmissionError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(fieldErrors).length > 0 || generalError !== null
  };
};

/**
 * Hook for async operation error handling
 */
export const useAsyncOperation = <T,>(
  operation: () => Promise<T>,
  options: {
    onError?: (error: Error) => void;
    onSuccess?: (result: T) => void;
    retryConfig?: Partial<RetryConfig>;
  } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { executeWithRetry, isRetrying } = useRetry(operation, options.retryConfig);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      await handleError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [executeWithRetry, handleError, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading: loading || isRetrying,
    error,
    data,
    reset
  };
};

// Export all hooks
export default {
  useErrorHandler,
  useAsyncError,
  useRetry,
  useCrisisDetection,
  useNetworkError,
  useErrorBoundary,
  useFormError,
  useAsyncOperation
};