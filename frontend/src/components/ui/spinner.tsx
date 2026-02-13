import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Spinner Component for Mental Health Platform
 * 
 * Provides consistent loading spinners with mental health-conscious design.
 * Uses calming colors and animations to reduce anxiety during wait times.
 * 
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 * 
 * // Large spinner for page loading
 * <Spinner size="lg" />
 * 
 * // Spinner with custom text
 * <Spinner text="Loading your mood data..." />
 * 
 * // Crisis-safe spinner (no rapid animations)
 * <Spinner variant="gentle" />
 * ```
 */

export interface SpinnerProps {
  /** Size of the spinner */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Visual variant for different contexts */
  variant?: 'default' | 'primary' | 'secondary' | 'gentle' | 'success' | 'warning';
  /** Optional text to display below spinner */
  text?: string;
  /** Custom CSS classes */
  className?: string;
  /** Show pulse animation instead of spin for gentler loading */
  gentle?: boolean;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4', 
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const variantClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  gentle: 'text-blue-400',
  success: 'text-green-500',
  warning: 'text-amber-500'
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className,
  gentle = false,
  ...props
}) => {
  const spinnerClasses = cn(
    sizeClasses[size],
    variantClasses[variant],
    gentle ? 'animate-pulse' : 'animate-spin',
    className
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-2" {...props}>
      <Loader2 className={spinnerClasses} aria-hidden="true" />
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Inline Spinner for buttons and inline elements
 */
export const InlineSpinner: React.FC<Omit<SpinnerProps, 'text'>> = ({
  size = 'sm',
  variant = 'default',
  className,
  gentle = false,
  ...props
}) => {
  const spinnerClasses = cn(
    sizeClasses[size],
    variantClasses[variant],
    gentle ? 'animate-pulse' : 'animate-spin',
    className
  );

  return (
    <Loader2 className={spinnerClasses} aria-hidden="true" {...props} />
  );
};

/**
 * Full-page loading overlay with gentle animation
 */
export const LoadingOverlay: React.FC<{
  text?: string;
  variant?: SpinnerProps['variant'];
}> = ({ text = 'Loading...', variant = 'gentle' }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg border">
        <Spinner 
          size="lg" 
          variant={variant} 
          text={text}
          gentle={true}
        />
      </div>
    </div>
  );
};

/**
 * Loading state for cards and containers
 */
export const CardSpinner: React.FC<{
  text?: string;
  height?: string;
}> = ({ text, height = 'h-32' }) => {
  return (
    <div className={cn('flex items-center justify-center w-full', height)}>
      <Spinner 
        size="md" 
        variant="gentle" 
        text={text}
        gentle={true}
      />
    </div>
  );
};

export default Spinner;