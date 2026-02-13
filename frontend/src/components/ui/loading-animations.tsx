import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Activity, Brain, Zap, MessageSquare } from 'lucide-react';

/**
 * Loading Animations for Mental Health Dashboard Components
 * 
 * These components provide smooth, anxiety-reducing loading animations
 * specifically designed for mental health applications.
 * 
 * Key Features:
 * - Gentle, non-jarring animations using CSS classes
 * - Mental health-themed iconography
 * - Accessible with reduced motion support
 * - Crisis-conscious design patterns
 */

export interface LoaderProps {
  /** Size of the animation */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom CSS classes */
  className?: string;
  /** Optional text to display */
  text?: string;
  /** Color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'gentle';
  /** Reduce animation for motion sensitivity */
  reduceMotion?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const colorClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-green-500',
  gentle: 'text-blue-400'
};

/**
 * Heartbeat animation for mood and emotional content
 */
export const HeartbeatLoader: React.FC<LoaderProps> = ({
  size = 'md',
  className,
  text,
  variant = 'primary',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn(sizeClasses[size], 'flex items-center justify-center')}>
        <Heart 
          className={cn(
            'w-full h-full',
            colorClasses[variant],
            !reduceMotion ? 'animate-pulse' : '',
            'drop-shadow-sm transition-transform duration-300'
          )}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Breathing animation for meditation and relaxation content
 */
export const BreathingLoader: React.FC<LoaderProps> = ({
  size = 'lg',
  className,
  text,
  variant = 'gentle',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className={cn(sizeClasses[size], 'flex items-center justify-center relative')}>
        {/* Outer breathing circle */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full border-2 opacity-30',
            variant === 'gentle' ? 'border-blue-400' : 'border-current',
            !reduceMotion ? 'animate-ping' : ''
          )}
        />
        
        {/* Inner circle */}
        <div 
          className={cn(
            'w-1/2 h-1/2 rounded-full opacity-60',
            variant === 'gentle' ? 'bg-blue-400' : 'bg-current',
            !reduceMotion ? 'animate-pulse' : ''
          )}
        />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Wave animation for analytics and data loading
 */
export const WaveLoader: React.FC<LoaderProps> = ({
  size = 'md',
  className,
  text,
  variant = 'primary',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className={cn(sizeClasses[size], 'flex items-end justify-center space-x-1')}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1 h-4 rounded-full',
              colorClasses[variant].replace('text-', 'bg-'),
              !reduceMotion ? 'animate-bounce' : ''
            )}
            style={{
              animationDelay: !reduceMotion ? `${i * 0.1}s` : undefined
            }}
          />
        ))}
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Gentle pulse animation for sensitive content
 */
export const GentlePulseLoader: React.FC<LoaderProps & { 
  icon?: React.ComponentType<{ className?: string }> 
}> = ({
  size = 'md',
  className,
  text,
  variant = 'gentle',
  reduceMotion = false,
  icon: Icon = Brain
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn(sizeClasses[size], 'flex items-center justify-center')}>
        <Icon 
          className={cn(
            'w-full h-full',
            colorClasses[variant],
            !reduceMotion ? 'animate-pulse' : ''
          )}
        />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Activity rings animation for progress and activity tracking
 */
export const ActivityRingsLoader: React.FC<LoaderProps> = ({
  size = 'lg',
  className,
  text,
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className={cn(sizeClasses[size], 'flex items-center justify-center relative')}>
        {/* Outer ring - mood */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-red-200"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-red-500"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="75, 100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              animation: !reduceMotion ? 'ring1 3s ease-in-out infinite' : undefined
            }}
          />
        </svg>
        
        {/* Middle ring - activity */}
        <svg className="absolute w-4/5 h-4/5 -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-green-200"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-green-500"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="60, 100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              animation: !reduceMotion ? 'ring2 3s ease-in-out 0.5s infinite' : undefined
            }}
          />
        </svg>
        
        {/* Inner ring - goals */}
        <svg className="absolute w-3/5 h-3/5 -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-blue-200"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-blue-500"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="45, 100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              animation: !reduceMotion ? 'ring3 3s ease-in-out 1s infinite' : undefined
            }}
          />
        </svg>
        
        {/* Center icon */}
        <Activity className="w-1/4 h-1/4 text-muted-foreground" />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Zen dots loader for meditation and mindfulness content
 */
export const ZenDotsLoader: React.FC<LoaderProps> = ({
  size = 'md',
  className,
  text,
  variant = 'gentle',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className={cn(sizeClasses[size], 'flex items-center justify-center space-x-2')}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              colorClasses[variant].replace('text-', 'bg-'),
              !reduceMotion && 'animate-pulse'
            )}
            style={{
              animation: !reduceMotion ? `zen-dot 2s ease-in-out ${i * 0.3}s infinite` : undefined
            }}
          />
        ))}
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">{text}</p>
      )}
    </div>
  );
};

/**
 * Typing indicator for chat and AI interactions
 */
export const TypingIndicator: React.FC<LoaderProps> = ({
  size = 'sm',
  className,
  text = 'AI is thinking...',
  variant = 'primary',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex items-center space-x-2 p-2', className)}>
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              colorClasses[variant].replace('text-', 'bg-'),
              !reduceMotion && 'animate-bounce'
            )}
            style={{
              animationDelay: !reduceMotion ? `${i * 0.2}s` : undefined,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

/**
 * Dashboard loading state with multiple components
 */
export const DashboardLoader: React.FC<LoaderProps> = ({
  size = 'lg',
  className,
  text = 'Loading your wellness dashboard...',
  variant = 'gentle',
  reduceMotion = false
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4 p-8', className)}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <HeartbeatLoader size="md" variant="primary" reduceMotion={reduceMotion} />
        <ActivityRingsLoader size="md" reduceMotion={reduceMotion} />
        <BreathingLoader size="md" variant="gentle" reduceMotion={reduceMotion} />
        <ZenDotsLoader size="md" variant="secondary" reduceMotion={reduceMotion} />
      </div>
      
      {text && (
        <p className="text-center text-muted-foreground max-w-md">{text}</p>
      )}
      
      <div className="text-xs text-muted-foreground/70 text-center">
        Preparing your mental wellness insights...
      </div>
    </div>
  );
};

export default {
  HeartbeatLoader,
  BreathingLoader,
  WaveLoader,
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
};