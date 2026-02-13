/**
 * @fileoverview Fallback UI Components - Error recovery interfaces
 * 
 * Collection of fallback UI components designed for graceful error recovery
 * in mental health applications with crisis-aware design patterns.
 * 
 * Features:
 * - WCAG 2.1 AA compliant accessibility
 * - Crisis-aware messaging and resources
 * - Multiple fallback variants for different contexts
 * - Calm, supportive visual design
 * - Action-oriented recovery options
 * - Privacy-conscious error display
 * 
 * @example
 * ```tsx
 * import { 
 *   NetworkErrorFallback, 
 *   ComponentErrorFallback, 
 *   DataErrorFallback 
 * } from '@/components/error/FallbackComponents';
 * 
 * // Network error with retry
 * <NetworkErrorFallback onRetry={handleRetry} />
 * 
 * // Component-specific fallback
 * <ComponentErrorFallback 
 *   componentName="Mood Tracker"
 *   onRetry={handleRetry}
 * />
 * 
 * // Data loading error
 * <DataErrorFallback 
 *   message="Unable to load your mood history"
 *   onRetry={handleRetry}
 * />
 * ```
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff,
  RefreshCw, 
  Home, 
  Phone, 
  MessageCircle, 
  Shield,
  AlertTriangle,
  HelpCircle,
  Brain,
  Heart,
  Database,
  Lock,
  UserX,
  Settings,
  CloudOff,
  Zap,
  FileX,
  Search,
  Clock
} from 'lucide-react';

/**
 * Common props for fallback components
 */
interface FallbackProps {
  onRetry?: () => void;
  onGoHome?: () => void;
  onContactSupport?: () => void;
  className?: string;
  showCrisisResources?: boolean;
  customMessage?: string;
}

/**
 * Crisis resources component for emergency situations
 */
const CrisisResourcesCompact: React.FC = () => (
  <div className="space-y-3">
    <div className="text-sm font-medium text-red-800 dark:text-red-200">
      Need immediate support?
    </div>
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300"
        onClick={() => window.open('tel:988', '_self')}
      >
        <Phone className="h-3 w-3 mr-1" />
        988
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300"
        onClick={() => window.open('sms:741741', '_self')}
      >
        <MessageCircle className="h-3 w-3 mr-1" />
        741741
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300"
        onClick={() => window.location.href = '/app/chat'}
      >
        <Brain className="h-3 w-3 mr-1" />
        AI Chat
      </Button>
    </div>
  </div>
);

/**
 * Network Error Fallback - For connection issues
 */
export const NetworkErrorFallback: React.FC<FallbackProps & {
  offline?: boolean;
}> = ({ 
  onRetry, 
  onGoHome, 
  className, 
  showCrisisResources = false,
  customMessage,
  offline = false
}) => (
  <Card className={`border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20 ${className}`}>
    <CardContent className="p-6 space-y-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {offline ? (
            <WifiOff className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          ) : (
            <Wifi className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          )}
        </div>
        <div className="space-y-2 flex-grow">
          <h3 className="font-semibold text-orange-800 dark:text-orange-200">
            {offline ? 'You\'re offline' : 'Connection issue'}
          </h3>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            {customMessage || (offline 
              ? "You're currently offline. Some features may not work until your connection is restored."
              : "We're having trouble connecting to our servers. Please check your internet connection."
            )}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {onRetry && (
              <Button 
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {offline ? 'Check connection' : 'Try again'}
              </Button>
            )}
            {onGoHome && (
              <Button 
                onClick={onGoHome}
                size="sm"
                variant="ghost"
                className="text-orange-700 hover:bg-orange-100"
              >
                <Home className="h-3 w-3 mr-1" />
                Home
              </Button>
            )}
          </div>

          {showCrisisResources && (
            <>
              <Separator className="my-3" />
              <CrisisResourcesCompact />
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Component Error Fallback - For individual component failures
 */
export const ComponentErrorFallback: React.FC<FallbackProps & {
  componentName?: string;
  description?: string;
}> = ({ 
  onRetry, 
  className, 
  componentName = 'component',
  description,
  customMessage
}) => (
  <Alert className={`border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20 ${className}`}>
    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    <AlertDescription className="space-y-3">
      <div>
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
          {componentName} unavailable
        </h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          {customMessage || description || `There was a problem loading the ${componentName}. Your other data is safe.`}
        </p>
      </div>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reload {componentName}
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

/**
 * Data Error Fallback - For data loading/saving issues
 */
export const DataErrorFallback: React.FC<FallbackProps & {
  dataType?: string;
  action?: 'loading' | 'saving' | 'syncing';
}> = ({ 
  onRetry, 
  className, 
  dataType = 'data',
  action = 'loading',
  customMessage,
  showCrisisResources = false
}) => (
  <Card className={`border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 ${className}`}>
    <CardContent className="p-4 space-y-3">
      <div className="flex items-start space-x-3">
        <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2 flex-grow">
          <h4 className="font-medium text-blue-800 dark:text-blue-200">
            {action === 'loading' ? 'Unable to load' : 
             action === 'saving' ? 'Save failed' : 
             'Sync issue'} {dataType}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {customMessage || 
             (action === 'loading' ? `We couldn't load your ${dataType} right now. ` :
              action === 'saving' ? `Your ${dataType} couldn't be saved. ` :
              `We couldn't sync your ${dataType}. `) + 
             'Don\'t worry - no data has been lost.'}
          </p>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try again
            </Button>
          )}

          {showCrisisResources && (
            <>
              <Separator className="my-3" />
              <CrisisResourcesCompact />
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Permission Error Fallback - For access control issues
 */
export const PermissionErrorFallback: React.FC<FallbackProps & {
  resourceName?: string;
  suggestedAction?: string;
}> = ({ 
  onGoHome, 
  onContactSupport,
  className, 
  resourceName = 'this content',
  suggestedAction,
  customMessage
}) => (
  <Card className={`border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20 ${className}`}>
    <CardContent className="p-6 space-y-4 text-center">
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
            <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Access restricted
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            {customMessage || `You don't have permission to access ${resourceName}.`}
            {suggestedAction && ` ${suggestedAction}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Go home
          </Button>
        )}
        {onContactSupport && (
          <Button onClick={onContactSupport} variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            Contact support
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Authentication Error Fallback - For login/session issues
 */
export const AuthenticationErrorFallback: React.FC<FallbackProps & {
  sessionExpired?: boolean;
}> = ({ 
  className, 
  sessionExpired = false,
  customMessage,
  showCrisisResources = false
}) => (
  <Card className={`border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/20 ${className}`}>
    <CardContent className="p-6 space-y-4 text-center">
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
            <UserX className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
            {sessionExpired ? 'Session expired' : 'Authentication required'}
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {customMessage || (sessionExpired 
              ? 'Your session has expired for security. Please log in again to continue.'
              : 'Please log in to access this feature.'
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          onClick={() => window.location.href = '/login'}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <UserX className="h-4 w-4 mr-2" />
          Log in
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
        >
          <Home className="h-4 w-4 mr-2" />
          Go home
        </Button>
      </div>

      {showCrisisResources && (
        <>
          <Separator />
          <div className="text-left">
            <CrisisResourcesCompact />
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

/**
 * Page Not Found Fallback - For routing errors
 */
export const PageNotFoundFallback: React.FC<FallbackProps & {
  searchQuery?: string;
}> = ({ 
  onGoHome, 
  className,
  searchQuery,
  customMessage
}) => (
  <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
    <Card className="w-full max-w-md">
      <CardContent className="p-8 space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">Page not found</h2>
            <p className="text-muted-foreground">
              {customMessage || 'The page you\'re looking for doesn\'t exist or has been moved.'}
              {searchQuery && ` We couldn't find anything for "${searchQuery}".`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onGoHome || (() => window.location.href = '/')}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to homepage
          </Button>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
          >
            Go back
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

/**
 * Server Error Fallback - For 500+ errors
 */
export const ServerErrorFallback: React.FC<FallbackProps & {
  statusCode?: number;
  canRetry?: boolean;
}> = ({ 
  onRetry, 
  onGoHome, 
  onContactSupport,
  className,
  statusCode = 500,
  canRetry = true,
  customMessage,
  showCrisisResources = false
}) => (
  <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
    <Card className="w-full max-w-lg border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
      <CardContent className="p-8 space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
              Server error
            </h2>
            <p className="text-red-700 dark:text-red-300">
              {customMessage || 'Our servers are experiencing issues. We\'re working to fix this as quickly as possible.'}
            </p>
            <Badge variant="secondary" className="mt-2">
              Error {statusCode}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {canRetry && onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onGoHome || (() => window.location.href = '/')}
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button 
              onClick={onContactSupport}
              variant="outline"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
          </div>
        </div>

        {showCrisisResources && (
          <>
            <Separator />
            <div className="text-left">
              <CrisisResourcesCompact />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </div>
);

/**
 * Maintenance Mode Fallback - For scheduled maintenance
 */
export const MaintenanceFallback: React.FC<FallbackProps & {
  estimatedTime?: string;
  maintenanceType?: string;
}> = ({ 
  className,
  estimatedTime,
  maintenanceType = 'maintenance',
  customMessage,
  showCrisisResources = true
}) => (
  <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
    <Card className="w-full max-w-lg border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardContent className="p-8 space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
              <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              Under {maintenanceType}
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              {customMessage || 'We\'re temporarily offline for scheduled maintenance to improve your experience.'}
            </p>
            {estimatedTime && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Expected to return: {estimatedTime}
                </span>
              </div>
            )}
          </div>
        </div>

        {showCrisisResources && (
          <>
            <Separator />
            <div className="text-left">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Crisis support still available
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  If you need immediate mental health support:
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Crisis Line:</strong> Call 988 (24/7)
                  </div>
                  <div className="text-sm">
                    <strong>Text Support:</strong> Text HOME to 741741
                  </div>
                  <div className="text-sm">
                    <strong>Emergency:</strong> Call 911
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </div>
);

/**
 * Generic Error Fallback - Catch-all for unknown errors
 */
export const GenericErrorFallback: React.FC<FallbackProps & {
  title?: string;
  errorCode?: string;
}> = ({ 
  onRetry, 
  onGoHome, 
  onContactSupport,
  className,
  title = 'Something went wrong',
  errorCode,
  customMessage,
  showCrisisResources = false
}) => (
  <Card className={`border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20 ${className}`}>
    <CardContent className="p-6 space-y-4 text-center">
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FileX className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {customMessage || 'An unexpected error occurred. We\'re working to resolve this issue.'}
          </p>
          {errorCode && (
            <Badge variant="outline" className="mt-2 text-xs">
              {errorCode}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {onRetry && (
          <Button onClick={onRetry} size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} size="sm" variant="outline">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Button>
        )}
        {onContactSupport && (
          <Button onClick={onContactSupport} size="sm" variant="ghost">
            <HelpCircle className="h-3 w-3 mr-1" />
            Support
          </Button>
        )}
      </div>

      {showCrisisResources && (
        <>
          <Separator className="my-4" />
          <div className="text-left">
            <CrisisResourcesCompact />
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

/**
 * Offline Fallback - For when the app is offline
 */
export const OfflineFallback: React.FC<FallbackProps> = ({ 
  onRetry, 
  className,
  customMessage
}) => (
  <Alert className={`border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20 ${className}`}>
    <CloudOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    <AlertDescription className="space-y-3">
      <div>
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
          You're offline
        </h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          {customMessage || 'Some features may be limited while offline. We\'ll sync your data when you reconnect.'}
        </p>
      </div>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Check connection
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

export default {
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
};