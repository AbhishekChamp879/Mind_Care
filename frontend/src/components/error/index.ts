/**
 * @fileoverview Error Handling Components - Central export file
 * 
 * Centralized exports for all error handling components, hooks, and utilities
 * in the Mind Care mental health platform.
 * 
 * @example
 * ```tsx
 * import { 
 *   ErrorBoundary, 
 *   NetworkErrorFallback, 
 *   useErrorHandler 
 * } from '@/components/error';
 * ```
 */

// Error Boundary Components
export {
  ErrorBoundary,
  ErrorBoundaryWrapper,
  PageErrorBoundary,
  ComponentErrorBoundary,
  CriticalErrorBoundary,
  default as ErrorBoundaryClass
} from './ErrorBoundary';

// Fallback UI Components
export {
  NetworkErrorFallback,
  ComponentErrorFallback,
  DataErrorFallback,
  PermissionErrorFallback,
  AuthenticationErrorFallback,
  PageNotFoundFallback,
  ServerErrorFallback,
  MaintenanceFallback,
  GenericErrorFallback,
  OfflineFallback,
  default as FallbackComponents
} from './FallbackComponents';

// Error Reporting Service
export { errorReportingService } from '@/services/errorReportingService';

// Error Handling Hooks
export {
  useErrorHandler,
  useAsyncError,
  useRetry,
  useCrisisDetection,
  useNetworkError,
  useErrorBoundary,
  useFormError,
  useAsyncOperation,
  default as ErrorHooks
} from '@/hooks/useErrorHandling';

// Types and Interfaces (re-exported from services)
export type {
  ErrorContext,
  ErrorReport
} from '@/services/errorReportingService';

export {
  ErrorSeverity,
  ErrorCategory,
  ErrorType
} from '@/services/errorReportingService';