import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Skeleton Loading Components for Mental Health Dashboard
 * 
 * These skeleton loaders provide consistent loading states for mood tracking
 * and dashboard components with mental health-conscious design principles.
 * 
 * Key Features:
 * - Gentle animations to reduce anxiety during loading
 * - Proper ARIA attributes for accessibility
 * - Consistent spacing and layout matching real components
 * - Crisis-aware design patterns
 * 
 * @example
 * ```tsx
 * // Mood tracker skeleton
 * <MoodTrackerSkeleton />
 * 
 * // Mood analytics skeleton  
 * <MoodAnalyticsSkeleton />
 * 
 * // Dashboard widget skeleton
 * <DashboardWidgetSkeleton />
 * ```
 */

export interface SkeletonProps {
  /** Custom CSS classes */
  className?: string;
  /** Use gentle pulse animation instead of default */
  gentle?: boolean;
}

/**
 * Enhanced Skeleton with mental health-conscious animations
 */
export const GentleSkeleton: React.FC<React.HTMLAttributes<HTMLDivElement> & SkeletonProps> = ({
  className,
  gentle = true,
  ...props
}) => {
  return (
    <Skeleton 
      className={cn(
        gentle ? 'animate-pulse' : 'animate-pulse',
        'bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%]',
        className
      )} 
      {...props} 
    />
  );
};

/**
 * Skeleton for Mood Tracker Component
 */
export const MoodTrackerSkeleton: React.FC<SkeletonProps> = ({ className, gentle = true }) => {
  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} role="status" aria-label="Loading mood tracker">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GentleSkeleton className="h-12 w-12 rounded-lg" gentle={gentle} />
            <div className="space-y-2">
              <GentleSkeleton className="h-5 w-24" gentle={gentle} />
              <GentleSkeleton className="h-4 w-16" gentle={gentle} />
            </div>
          </div>
          <GentleSkeleton className="h-8 w-16 rounded-md" gentle={gentle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood Selection Area */}
        <div className="space-y-3">
          <GentleSkeleton className="h-4 w-32" gentle={gentle} />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <GentleSkeleton key={i} className="h-12 w-12 rounded-lg" gentle={gentle} />
            ))}
          </div>
        </div>
        
        {/* Stats Area */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <GentleSkeleton className="h-6 w-8 mx-auto mb-1" gentle={gentle} />
            <GentleSkeleton className="h-3 w-16 mx-auto" gentle={gentle} />
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <GentleSkeleton className="h-6 w-12 mx-auto mb-1" gentle={gentle} />
            <GentleSkeleton className="h-3 w-12 mx-auto" gentle={gentle} />
          </div>
        </div>

        {/* Recent Entries */}
        <div className="pt-2 border-t space-y-2">
          <GentleSkeleton className="h-3 w-20" gentle={gentle} />
          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <GentleSkeleton className="h-6 w-6 rounded" gentle={gentle} />
                <GentleSkeleton className="h-2 w-4" gentle={gentle} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton for Mood Analytics Component
 */
export const MoodAnalyticsSkeleton: React.FC<SkeletonProps> = ({ className, gentle = true }) => {
  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} role="status" aria-label="Loading mood analytics">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <GentleSkeleton className="h-5 w-5" gentle={gentle} />
          <GentleSkeleton className="h-5 w-32" gentle={gentle} />
        </div>
        <GentleSkeleton className="h-4 w-48" gentle={gentle} />
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 p-1 bg-muted/20 rounded-lg">
          {Array.from({ length: 3 }).map((_, i) => (
            <GentleSkeleton key={i} className="h-8 w-20 rounded-md" gentle={gentle} />
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
            <GentleSkeleton className="h-8 w-12 mx-auto mb-1" gentle={gentle} />
            <GentleSkeleton className="h-3 w-16 mx-auto" gentle={gentle} />
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
            <GentleSkeleton className="h-8 w-8 mx-auto mb-1" gentle={gentle} />
            <GentleSkeleton className="h-3 w-20 mx-auto" gentle={gentle} />
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-2 p-3 rounded-lg border mb-4">
          <GentleSkeleton className="h-4 w-4" gentle={gentle} />
          <GentleSkeleton className="h-4 w-24" gentle={gentle} />
        </div>

        {/* Mood Distribution */}
        <div className="space-y-3">
          <GentleSkeleton className="h-4 w-28" gentle={gentle} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 rounded">
              <GentleSkeleton className="h-6 w-6 rounded" gentle={gentle} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <GentleSkeleton className="h-3 w-16" gentle={gentle} />
                  <GentleSkeleton className="h-3 w-8" gentle={gentle} />
                </div>
                <GentleSkeleton className="h-2 w-full rounded-full" gentle={gentle} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton for Mood Widgets (Summary, Trend, Streak, Weekly)
 */
export const MoodWidgetSkeleton: React.FC<SkeletonProps & { variant?: 'summary' | 'trend' | 'streak' | 'weekly' }> = ({ 
  className, 
  gentle = true,
  variant = 'summary'
}) => {
  const renderContent = () => {
    switch (variant) {
      case 'summary':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GentleSkeleton className="h-5 w-5" gentle={gentle} />
                <GentleSkeleton className="h-5 w-24" gentle={gentle} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <GentleSkeleton className="h-8 w-8 mx-auto mb-2" gentle={gentle} />
                <GentleSkeleton className="h-4 w-16 mx-auto mb-1" gentle={gentle} />
                <GentleSkeleton className="h-3 w-20 mx-auto" gentle={gentle} />
              </div>
            </CardContent>
          </>
        );
      
      case 'trend':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GentleSkeleton className="h-5 w-5" gentle={gentle} />
                <GentleSkeleton className="h-5 w-28" gentle={gentle} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <GentleSkeleton className="h-4 w-20" gentle={gentle} />
                <GentleSkeleton className="h-6 w-12 rounded-full" gentle={gentle} />
              </div>
              <GentleSkeleton className="h-24 w-full rounded" gentle={gentle} />
            </CardContent>
          </>
        );

      case 'streak':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GentleSkeleton className="h-5 w-5" gentle={gentle} />
                <GentleSkeleton className="h-5 w-24" gentle={gentle} />
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <GentleSkeleton className="h-12 w-12 mx-auto mb-2" gentle={gentle} />
              <GentleSkeleton className="h-8 w-16 mx-auto mb-1" gentle={gentle} />
              <GentleSkeleton className="h-4 w-24 mx-auto" gentle={gentle} />
            </CardContent>
          </>
        );

      case 'weekly':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GentleSkeleton className="h-5 w-5" gentle={gentle} />
                <GentleSkeleton className="h-5 w-20" gentle={gentle} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <GentleSkeleton className="h-3 w-6 mx-auto" gentle={gentle} />
                    <GentleSkeleton className="h-8 w-8 mx-auto rounded" gentle={gentle} />
                  </div>
                ))}
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} role="status" aria-label={`Loading ${variant} mood widget`}>
      {renderContent()}
    </Card>
  );
};

/**
 * Skeleton for Interactive Analytics Component
 */
export const InteractiveAnalyticsSkeleton: React.FC<SkeletonProps> = ({ className, gentle = true }) => {
  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} role="status" aria-label="Loading interactive analytics">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <GentleSkeleton className="h-5 w-5" gentle={gentle} />
            <GentleSkeleton className="h-5 w-36" gentle={gentle} />
          </div>
          <GentleSkeleton className="h-8 w-20 rounded-md" gentle={gentle} />
        </div>
        <GentleSkeleton className="h-4 w-56" gentle={gentle} />
      </CardHeader>
      <CardContent>
        {/* Timeframe Selector */}
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <GentleSkeleton key={i} className="h-8 w-16 rounded-md" gentle={gentle} />
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GentleSkeleton className="h-4 w-4" gentle={gentle} />
                <GentleSkeleton className="h-4 w-16" gentle={gentle} />
              </div>
              <GentleSkeleton className="h-6 w-12 mb-1" gentle={gentle} />
              <GentleSkeleton className="h-2 w-full rounded-full mb-1" gentle={gentle} />
              <GentleSkeleton className="h-3 w-20" gentle={gentle} />
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-3">
            <GentleSkeleton className="h-4 w-4 mr-2" gentle={gentle} />
            <GentleSkeleton className="h-4 w-32" gentle={gentle} />
          </div>
          <GentleSkeleton className="h-48 w-full rounded" gentle={gentle} />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton for Dashboard Widget (Generic)
 */
export const DashboardWidgetSkeleton: React.FC<SkeletonProps & { 
  height?: string;
  showHeader?: boolean;
  showChart?: boolean;
}> = ({ 
  className, 
  gentle = true, 
  height = 'auto',
  showHeader = true,
  showChart = false
}) => {
  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} style={{ height }} role="status" aria-label="Loading dashboard widget">
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <GentleSkeleton className="h-5 w-32" gentle={gentle} />
              <GentleSkeleton className="h-3 w-48" gentle={gentle} />
            </div>
            <GentleSkeleton className="h-8 w-8 rounded" gentle={gentle} />
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {showChart ? (
          <GentleSkeleton className="h-32 w-full rounded" gentle={gentle} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <GentleSkeleton className="h-16 w-full rounded" gentle={gentle} />
              <GentleSkeleton className="h-16 w-full rounded" gentle={gentle} />
            </div>
            <div className="space-y-2">
              <GentleSkeleton className="h-4 w-full" gentle={gentle} />
              <GentleSkeleton className="h-4 w-3/4" gentle={gentle} />
              <GentleSkeleton className="h-4 w-1/2" gentle={gentle} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton for Quick Mood Check-in
 */
export const QuickMoodSkeleton: React.FC<SkeletonProps> = ({ className, gentle = true }) => {
  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)} role="status" aria-label="Loading quick mood check-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GentleSkeleton className="h-4 w-4" gentle={gentle} />
            <GentleSkeleton className="h-4 w-24" gentle={gentle} />
          </div>
          <GentleSkeleton className="h-6 w-12 rounded-full" gentle={gentle} />
        </div>
        
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <GentleSkeleton key={i} className="h-10 w-10 rounded-lg" gentle={gentle} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  GentleSkeleton,
  MoodTrackerSkeleton,
  MoodAnalyticsSkeleton,
  MoodWidgetSkeleton,
  InteractiveAnalyticsSkeleton,
  DashboardWidgetSkeleton,
  QuickMoodSkeleton
};