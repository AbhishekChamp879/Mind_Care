/**
 * @fileoverview Error Boundary Demo Page - Interactive showcase of error handling
 * 
 * Comprehensive demonstration of error boundaries, fallback UIs, and error handling
 * patterns for the Mind Care mental health platform.
 * 
 * Features:
 * - Interactive error triggering for testing
 * - Showcase of different fallback UI variants
 * - Crisis detection and response demonstration
 * - Error reporting and recovery patterns
 * - Mental health-conscious error messaging
 * - Accessibility-compliant error handling
 * 
 * @example
 * ```tsx
 * // Access via /app/error-demo or standalone
 * <ErrorBoundaryDemo />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ErrorBoundary, 
  ComponentErrorBoundary, 
  CriticalErrorBoundary 
} from '@/components/error/ErrorBoundary';
import {
  NetworkErrorFallback,
  ComponentErrorFallback,
  DataErrorFallback,
  PermissionErrorFallback,
  AuthenticationErrorFallback,
  PageNotFoundFallback,
  ServerErrorFallback,
  MaintenanceFallback,
  GenericErrorFallback,
  OfflineFallback
} from '@/components/error/FallbackComponents';
import { 
  useErrorHandler, 
  useCrisisDetection, 
  useRetry,
  useFormError,
  useAsyncOperation 
} from '@/hooks/useErrorHandling';
import { 
  AlertTriangle, 
  Wifi, 
  Database, 
  Lock, 
  User, 
  Search,
  Server,
  Settings,
  Heart,
  Brain,
  RefreshCw,
  Zap,
  Bug,
  ShieldAlert,
  Network
} from 'lucide-react';

/**
 * Component that throws errors for testing
 */
const ErrorTrigger: React.FC<{ 
  errorType: string; 
  onError?: (error: Error) => void;
}> = ({ errorType, onError }) => {
  const { handleError } = useErrorHandler();
  const { checkForCrisis } = useCrisisDetection();

  const triggerError = useCallback(() => {
    let error: Error;
    
    switch (errorType) {
      case 'network':
        error = new Error('Network request failed: Unable to connect to server');
        break;
      case 'chunk':
        error = new Error('ChunkLoadError: Loading CSS chunk 2 failed');
        break;
      case 'permission':
        error = new Error('Permission denied: Unauthorized access to resource');
        break;
      case 'validation':
        error = new Error('Validation error: Invalid input format');
        break;
      case 'runtime':
        error = new ReferenceError('Cannot read property of undefined');
        break;
      case 'crisis':
        error = new Error('Crisis detected: Self-harm indicators in user input');
        break;
      case 'privacy':
        error = new Error('Privacy violation: Unauthorized data access attempt');
        break;
      case 'async':
        error = new Error('Async operation failed: Timeout after 30 seconds');
        break;
      default:
        error = new Error('Unknown error occurred');
    }

    // Handle error and trigger crisis detection if needed
    handleError(error);
    checkForCrisis(error);
    onError?.(error);
    
    // Throw error to be caught by error boundary
    throw error;
  }, [errorType, handleError, checkForCrisis, onError]);

  return (
    <Button 
      onClick={triggerError}
      variant="destructive"
      size="sm"
      className="w-full"
    >
      Trigger {errorType} error
    </Button>
  );
};

/**
 * Async operation component for testing error handling
 */
const AsyncOperationDemo: React.FC = () => {
  const { execute, loading, error, data } = useAsyncOperation(
    async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 50% chance of error
      if (Math.random() > 0.5) {
        throw new Error('Simulated async operation failure');
      }
      
      return { success: true, timestamp: new Date().toISOString() };
    },
    {
      retryConfig: { maxAttempts: 2 }
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Async Operation with Retry
        </CardTitle>
        <CardDescription>
          Demonstrates error handling in async operations with automatic retry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={execute} disabled={loading}>
          {loading ? 'Processing...' : 'Start Async Operation'}
        </Button>
        
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {data && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription>
              <strong>Success:</strong> Operation completed at {data.timestamp}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Form error handling demo
 */
const FormErrorDemo: React.FC = () => {
  const { 
    fieldErrors, 
    generalError, 
    handleSubmissionError,
    setFieldError,
    clearAllErrors,
    hasErrors 
  } = useFormError();

  const simulateFormError = () => {
    const errors = [
      () => setFieldError('email', 'Please enter a valid email address'),
      () => setFieldError('password', 'Password must be at least 8 characters'),
      () => handleSubmissionError(new Error('Server validation failed: Email already exists'))
    ];
    
    const randomError = errors[Math.floor(Math.random() * errors.length)];
    randomError();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Form Error Handling
        </CardTitle>
        <CardDescription>
          Demonstrates form validation and submission error handling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={simulateFormError} variant="outline">
            Simulate Form Error
          </Button>
          <Button onClick={clearAllErrors} variant="ghost">
            Clear All Errors
          </Button>
        </div>
        
        {hasErrors && (
          <div className="space-y-2">
            {Object.entries(fieldErrors).map(([field, message]) => (
              <Alert key={field} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <strong>{field}:</strong> {message}
                </AlertDescription>
              </Alert>
            ))}
            
            {generalError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Form Error:</strong> {generalError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Main Error Boundary Demo Page
 */
const ErrorBoundaryDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('basic');
  const [lastError, setLastError] = useState<Error | null>(null);

  const demoSections = [
    {
      id: 'basic',
      title: 'Basic Error Boundaries',
      icon: <ShieldAlert className="h-4 w-4" />,
      description: 'Component and page-level error boundaries'
    },
    {
      id: 'fallbacks',
      title: 'Fallback UI Components',
      icon: <Bug className="h-4 w-4" />,
      description: 'Various fallback UI patterns for different error types'
    },
    {
      id: 'hooks',
      title: 'Error Handling Hooks',
      icon: <Zap className="h-4 w-4" />,
      description: 'React hooks for error management and reporting'
    },
    {
      id: 'crisis',
      title: 'Crisis Detection',
      icon: <Heart className="h-4 w-4" />,
      description: 'Mental health-specific error handling and crisis response'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Error Handling Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Interactive demonstration of error boundaries, fallback UIs, and crisis-aware error handling
            for the Mind Care mental health platform.
          </p>
        </div>
      </div>

      {/* Demo Navigation */}
      <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          {demoSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              {section.icon}
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Basic Error Boundaries Demo */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Boundary Types</CardTitle>
              <CardDescription>
                Different error boundary configurations for various use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Component Error Boundary */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Component Error Boundary</h3>
                <ComponentErrorBoundary componentName="DemoWidget">
                  <Card className="border-dashed">
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        This component is wrapped in a ComponentErrorBoundary
                      </p>
                      <ErrorTrigger errorType="runtime" onError={setLastError} />
                    </CardContent>
                  </Card>
                </ComponentErrorBoundary>
              </div>

              <Separator />

              {/* Critical Error Boundary */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Critical Error Boundary</h3>
                <CriticalErrorBoundary>
                  <Card className="border-dashed border-red-200">
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        This component uses CriticalErrorBoundary for high-priority errors
                      </p>
                      <ErrorTrigger errorType="crisis" onError={setLastError} />
                    </CardContent>
                  </Card>
                </CriticalErrorBoundary>
              </div>

              {lastError && (
                <>
                  <Separator />
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <strong>Last Triggered Error:</strong> {lastError.message}
                      <br />
                      <small className="text-muted-foreground">
                        Check browser console for detailed error report
                      </small>
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fallback UI Demo */}
        <TabsContent value="fallbacks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Error
              </h3>
              <NetworkErrorFallback 
                onRetry={() => console.log('Retry network')}
                showCrisisResources={true}
              />
            </div>

            {/* Component Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Component Error
              </h3>
              <ComponentErrorFallback 
                componentName="Mood Tracker"
                onRetry={() => console.log('Retry component')}
              />
            </div>

            {/* Data Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Error
              </h3>
              <DataErrorFallback 
                dataType="mood history"
                action="loading"
                onRetry={() => console.log('Retry data')}
              />
            </div>

            {/* Permission Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Permission Error
              </h3>
              <PermissionErrorFallback 
                resourceName="admin dashboard"
                onGoHome={() => console.log('Go home')}
              />
            </div>

            {/* Authentication Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Authentication Error
              </h3>
              <AuthenticationErrorFallback 
                sessionExpired={true}
                showCrisisResources={true}
              />
            </div>

            {/* Server Error */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Error
              </h3>
              <div className="border rounded-lg p-1">
                <ServerErrorFallback 
                  statusCode={500}
                  onRetry={() => console.log('Retry server')}
                  onGoHome={() => console.log('Go home')}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Hooks Demo */}
        <TabsContent value="hooks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AsyncOperationDemo />
            <FormErrorDemo />
          </div>
        </TabsContent>

        {/* Crisis Detection Demo */}
        <TabsContent value="crisis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Crisis Detection & Response
              </CardTitle>
              <CardDescription>
                Mental health-specific error handling with crisis awareness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <Brain className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Crisis-Aware Error Handling:</strong> The system monitors for crisis-related 
                  keywords and provides immediate access to mental health resources when detected.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Regular Error</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Standard error handling without crisis indicators
                    </p>
                    <ErrorBoundary variant="minimal">
                      <ErrorTrigger errorType="network" />
                    </ErrorBoundary>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 text-red-800">Crisis Error</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Error with crisis keywords - triggers enhanced support
                    </p>
                    <ErrorBoundary variant="default" showCrisisResources={true}>
                      <ErrorTrigger errorType="crisis" />
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Crisis Resources Always Available
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Even during system errors, users have access to crisis support:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">988</Badge>
                    <span>24/7 Crisis Lifeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">741741</Badge>
                    <span>Crisis Text Line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">AI Chat</Badge>
                    <span>Emergency AI Support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorBoundaryDemo;