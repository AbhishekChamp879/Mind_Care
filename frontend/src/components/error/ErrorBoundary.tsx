import React, { Component } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HeartIcon,
  ArrowPathIcon,
  HomeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  CpuChipIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  errorId: string;
  timestamp: Date;
}

/**
 * Error boundary props interface
 */
interface ErrorBoundaryProps {
  /** Child components to protect */
  children: React.ReactNode;
  /** Custom fallback component */
  fallback?: React.ReactNode | ((error: Error, retry: () => void) => React.ReactNode);
  /** Error reporting callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  /** Component identifier for error tracking */
  componentName?: string;
  /** Error boundary variant */
  variant?: 'default' | 'minimal' | 'page' | 'critical';
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Enable crisis resources display */
  showCrisisResources?: boolean;
  /** Custom error messages by error type */
  errorMessages?: Record<string, string>;
}

/**
 * Generate unique error ID for tracking
 */
const generateErrorId = (): string => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Classify error type for appropriate messaging
 */
const classifyError = (error: Error): {
  type: 'network' | 'chunk' | 'permission' | 'validation' | 'runtime' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'user' | 'system';
} => {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  // Network errors
  if (message.includes('fetch') || message.includes('network') || name.includes('network')) {
    return { type: 'network', severity: 'medium', category: 'system' };
  }

  // Chunk loading errors (common in lazy-loaded components)
  if (message.includes('chunk') || message.includes('loading')) {
    return { type: 'chunk', severity: 'low', category: 'technical' };
  }

  // Permission errors
  if (message.includes('permission') || message.includes('unauthorized')) {
    return { type: 'permission', severity: 'medium', category: 'user' };
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return { type: 'validation', severity: 'low', category: 'user' };
  }

  // Runtime errors
  if (name.includes('reference') || name.includes('type')) {
    return { type: 'runtime', severity: 'high', category: 'technical' };
  }

  return { type: 'unknown', severity: 'medium', category: 'technical' };
};

/**
 * Get user-friendly error message based on error classification
 */
const getUserFriendlyMessage = (error: Error, classification: ReturnType<typeof classifyError>): string => {
  const messages = {
    network: "We're having trouble connecting to our servers. Your data is safe - please check your internet connection and try again.",
    chunk: "We're updating the app to serve you better. Please refresh the page to get the latest version.",
    permission: "It looks like you don't have permission to access this feature. If you believe this is a mistake, please contact our support team.",
    validation: "The information provided doesn't look quite right. Please check your input and try again.",
    runtime: "Something unexpected happened, but don't worry - your progress is saved. We're working to fix this issue.",
    unknown: "We encountered an unexpected issue. Your data is safe, and our team has been notified. Please try again in a moment."
  };

  return messages[classification.type] || messages.unknown;
};

/**
 * Crisis resources component for high-severity errors
 */
const CrisisResources: React.FC = () => (
  <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-2">
        <HeartIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
        <CardTitle className="text-lg text-red-800 dark:text-red-200">
          Need Immediate Support?
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-red-700 dark:text-red-300">
        If you're experiencing a mental health crisis, help is available 24/7:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
          onClick={() => window.open('tel:988', '_self')}
        >
          <PhoneIcon className="h-3 w-3 mr-1" />
          Call 988
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
          onClick={() => window.open('sms:741741', '_self')}
        >
          <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
          Text 741741
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
          onClick={() => window.location.href = '/app/chat'}
        >
          <CpuChipIcon className="h-3 w-3 mr-1" />
          AI Chat
        </Button>
      </div>
    </CardContent>
  </Card>
);

/**
 * Default error fallback UI component
 */
const DefaultErrorFallback = ({
  error,
  errorId,
  classification,
  onRetry,
  onGoHome,
  retryCount,
  maxRetries,
  showCrisisResources
}: {
  error: Error;
  errorId: string;
  classification: ReturnType<typeof classifyError>;
  onRetry: () => void;
  onGoHome: () => void;
  retryCount: number;
  maxRetries: number;
  showCrisisResources: boolean;
}) => (
  <div className="w-full p-6 space-y-6" role="alert" aria-live="polite">
    {/* Error Header */}
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
            <ShieldCheckIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Oops! Something went wrong
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          {getUserFriendlyMessage(error, classification)}
        </p>
      </div>

      {/* Error Classification Badge */}
      <div className="flex justify-center">
        {/* @ts-expect-error - Badge variant type mismatch */}
        <Badge
          variant={classification.severity === 'critical' ? 'destructive' : 'secondary'}
          className="text-xs"
        >
          {classification.category} • {classification.severity}
        </Badge>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
      {retryCount < maxRetries && (
        <Button
          onClick={onRetry}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Retry the action that caused the error"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
        </Button>
      )}

      <Button
        onClick={onGoHome}
        variant="outline"
        aria-label="Return to the main dashboard"
      >
        <HomeIcon className="w-4 h-4 mr-2" />
        Go to Dashboard
      </Button>      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        aria-label="Refresh the entire page"
      >
        <ArrowPathIcon className="w-4 h-4 mr-2" />
        Refresh Page
      </Button>
    </div>

    {/* Crisis Resources */}
    {showCrisisResources && classification.severity === 'critical' && (
      <>
        <Separator />
        <CrisisResources />
      </>
    )}

    {/* Technical Details (Collapsible) */}
    <details className="mt-6">
      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
        <QuestionMarkCircleIcon className="w-4 h-4" />
        Technical Details
      </summary>
      <div className="mt-3 p-4 bg-muted/50 rounded-lg space-y-2 text-xs font-mono">
        <div><strong>Error ID:</strong> {errorId}</div>
        <div><strong>Type:</strong> {error.name}</div>
        <div><strong>Message:</strong> {error.message}</div>
        <div><strong>Classification:</strong> {classification.type}</div>
        <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
      </div>
    </details>
  </div>
);

/**
 * Minimal error fallback for inline components
 */
const MinimalErrorFallback = ({ error, onRetry, retryCount, maxRetries }: {
  error: Error;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
}) => (
  <Alert className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
    <ExclamationTriangleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    <AlertDescription className="space-y-2">
      <p className="text-sm">Something went wrong with this section.</p>
      {retryCount < maxRetries && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="h-8"
        >
          <ArrowPathIcon className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

/**
 * Page-level error fallback with navigation
 */
const PageErrorFallback = ({ error, errorId, classification, onRetry, onGoBack, onGoHome }: {
  error: Error;
  errorId: string;
  classification: ReturnType<typeof classifyError>;
  onRetry: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div>
          <CardTitle className="text-3xl mb-2">Page Error</CardTitle>
          <CardDescription className="text-lg">
            {getUserFriendlyMessage(error, classification)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button onClick={onRetry} className="w-full">
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoBack} variant="outline" className="w-full">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={onGoHome} variant="outline" className="w-full">
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {classification.severity === 'critical' && <CrisisResources />}
      </CardContent>
    </Card>
  </div>
);

/**
 * React Error Boundary Class Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: '',
      timestamp: new Date(),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
      timestamp: new Date(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || generateErrorId();

    this.setState({
      errorInfo,
      errorId,
    });

    // Report error
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Report to external service (implement as needed)
    this.reportError(error, errorInfo, errorId);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
    // Implement error reporting to your analytics/monitoring service
    // Example: Sentry, LogRocket, etc.
    try {
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        componentName: this.props.componentName,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'user_id_if_available', // Get from auth context
      };

      // Send to your error reporting service
      console.log('Error Report:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;

    if (this.state.retryCount < maxRetries) {
      this.setState((prevState: ErrorBoundaryState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      // Add a small delay before retry to prevent immediate re-error
      this.retryTimeoutId = window.setTimeout(() => {
        this.forceUpdate();
      }, 100);
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const classification = classifyError(this.state.error);
      const variant = this.props.variant || 'default';
      const maxRetries = this.props.maxRetries || 3;
      const showCrisisResources = this.props.showCrisisResources !== false;

      // Custom fallback component
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.handleRetry);
        }
        return this.props.fallback;
      }

      // Built-in fallback variants
      switch (variant) {
        case 'minimal':
          return (
            <MinimalErrorFallback
              error={this.state.error}
              onRetry={this.handleRetry}
              retryCount={this.state.retryCount}
              maxRetries={maxRetries}
            />
          );

        case 'page':
          return (
            <PageErrorFallback
              error={this.state.error}
              errorId={this.state.errorId}
              classification={classification}
              onRetry={this.handleRetry}
              onGoBack={this.handleGoBack}
              onGoHome={this.handleGoHome}
            />
          );

        case 'critical':
          return (
            <div className="min-h-screen bg-red-950 text-white flex items-center justify-center p-4">
              <Card className="w-full max-w-md border-red-800 bg-red-900">
                <CardContent className="p-6 text-center space-y-4">
                  <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto" />
                  <h2 className="text-xl font-bold">Critical Error</h2>
                  <p>The application has encountered a critical error. Please contact support.</p>
                  <Button onClick={() => window.location.reload()} variant="destructive">
                    Restart Application
                  </Button>
                  <CrisisResources />
                </CardContent>
              </Card>
            </div>
          );

        default:
          return (
            <Card className="w-full max-w-2xl mx-auto my-8">
              <CardContent>
                <DefaultErrorFallback
                  error={this.state.error}
                  errorId={this.state.errorId}
                  classification={classification}
                  onRetry={this.handleRetry}
                  onGoHome={this.handleGoHome}
                  retryCount={this.state.retryCount}
                  maxRetries={maxRetries}
                  showCrisisResources={showCrisisResources}
                />
              </CardContent>
            </Card>
          );
      }
    }

    return this.props.children;
  }
}

/**
 * Functional component wrapper for easier usage
 */
export const ErrorBoundaryWrapper = ({ children, ...props }: ErrorBoundaryProps) => {
  const EB = ErrorBoundary as React.ComponentType<ErrorBoundaryProps>;
  return <EB {...props}>{children}</EB>;
};

/**
 * Page-level error boundary with automatic navigation
 */
export const PageErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const EB = ErrorBoundary as React.ComponentType<ErrorBoundaryProps>;
  return (
    <EB
      variant="page"
      componentName="PageBoundary"
      showCrisisResources={true}
      onError={(error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
        console.error('Page Error:', { error, errorInfo, errorId });
      }}
    >
      {children}
    </EB>
  );
};

/**
 * Component-level error boundary with minimal UI
 */
export const ComponentErrorBoundary = ({ children, componentName }: {
  children: React.ReactNode;
  componentName?: string;
}) => {
  const EB = ErrorBoundary as React.ComponentType<ErrorBoundaryProps>;
  return (
    <EB
      variant="minimal"
      componentName={componentName}
      maxRetries={2}
      showCrisisResources={false}
    >
      {children}
    </EB>
  );
};

/**
 * Critical section error boundary for high-priority components
 */
export const CriticalErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const EB = ErrorBoundary as React.ComponentType<ErrorBoundaryProps>;
  return (
    <EB
      variant="critical"
      componentName="CriticalSection"
      maxRetries={1}
      showCrisisResources={true}
    >
      {children}
    </EB>
  );
};

export default ErrorBoundary;