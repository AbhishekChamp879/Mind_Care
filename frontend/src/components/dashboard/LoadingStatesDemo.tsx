import React, { useState, useEffect } from 'react';
import { 
  MoodTrackerSkeleton,
  MoodWidgetSkeleton,
  MoodAnalyticsSkeleton,
  InteractiveAnalyticsSkeleton,
  DashboardWidgetSkeleton,
  QuickMoodSkeleton
} from '@/components/ui/loading-skeletons';
import { 
  HeartbeatLoader,
  BreathingLoader,
  WaveLoader,
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
} from '@/components/ui/loading-animations';
import { 
  Spinner,
  InlineSpinner,
  LoadingOverlay,
  CardSpinner
} from '@/components/ui/spinner';

// Import existing components
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { 
  MoodSummaryWidget,
  MoodTrendWidget,
  MoodStreakWidget,
  MoodWeeklyWidget
} from '@/components/dashboard/MoodWidgets';
import { MoodAnalytics } from '@/components/dashboard/MoodAnalytics';
import { InteractiveAnalytics } from '@/components/dashboard/InteractiveAnalytics';
import QuickMoodCheckIn from '@/components/dashboard/QuickMoodCheckIn';

/**
 * Loading States Integration Demo
 * 
 * This component demonstrates how to integrate loading states throughout
 * the mood tracking components for a better user experience.
 * 
 * Features demonstrated:
 * - Skeleton loaders for different widget types
 * - Loading animations for different contexts
 * - Spinner components for async operations
 * - Error states with retry functionality
 * - Progressive loading patterns
 * 
 * @example
 * ```tsx
 * // Use in dashboard
 * <LoadingStatesDemo />
 * 
 * // Individual component with loading
 * <LoadingMoodTracker />
 * ```
 */

export interface LoadingStateProps {
  /** Force loading state for demonstration */
  forceLoading?: boolean;
  /** Simulate slow loading */
  slowLoading?: boolean;
  /** Show error state */
  showError?: boolean;
}

/**
 * Enhanced Mood Tracker with comprehensive loading states
 */
export const LoadingMoodTracker: React.FC<LoadingStateProps> = ({
  forceLoading = false,
  slowLoading = false,
  showError = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, slowLoading ? 3000 : 1500));
        
        if (showError) {
          throw new Error('Failed to load mood data');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    if (!forceLoading) {
      loadData();
    }
  }, [forceLoading, slowLoading, showError]);

  if (forceLoading || isLoading) {
    return <MoodTrackerSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] border rounded-lg">
        <div className="text-center space-y-4">
          <div className="text-red-500">⚠️ {error}</div>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <MoodTracker />;
};

/**
 * Mood Widgets with progressive loading
 */
export const LoadingMoodWidgets: React.FC<LoadingStateProps> = ({
  forceLoading = false,
  slowLoading = false
}) => {
  const [loadingStates, setLoadingStates] = useState({
    summary: true,
    trend: true,
    streak: true,
    weekly: true
  });

  useEffect(() => {
    if (forceLoading) return;

    // Progressive loading - components load one by one
    const loadComponents = async () => {
      const delay = slowLoading ? 1000 : 500;
      
      // Load summary first
      await new Promise(resolve => setTimeout(resolve, delay));
      setLoadingStates(prev => ({ ...prev, summary: false }));
      
      // Then trend
      await new Promise(resolve => setTimeout(resolve, delay));
      setLoadingStates(prev => ({ ...prev, trend: false }));
      
      // Then streak
      await new Promise(resolve => setTimeout(resolve, delay));
      setLoadingStates(prev => ({ ...prev, streak: false }));
      
      // Finally weekly
      await new Promise(resolve => setTimeout(resolve, delay));
      setLoadingStates(prev => ({ ...prev, weekly: false }));
    };

    loadComponents();
  }, [forceLoading, slowLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Summary Widget */}
      {forceLoading || loadingStates.summary ? (
        <MoodWidgetSkeleton variant="summary" />
      ) : (
        <MoodSummaryWidget />
      )}
      
      {/* Trend Widget */}
      {forceLoading || loadingStates.trend ? (
        <MoodWidgetSkeleton variant="trend" />
      ) : (
        <MoodTrendWidget />
      )}
      
      {/* Streak Widget */}
      {forceLoading || loadingStates.streak ? (
        <MoodWidgetSkeleton variant="streak" />
      ) : (
        <MoodStreakWidget />
      )}
      
      {/* Weekly Widget */}
      {forceLoading || loadingStates.weekly ? (
        <MoodWidgetSkeleton variant="weekly" />
      ) : (
        <MoodWeeklyWidget />
      )}
    </div>
  );
};

/**
 * Analytics components with loading animations
 */
export const LoadingMoodAnalytics: React.FC<LoadingStateProps> = ({
  forceLoading = false,
  slowLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (forceLoading) return;

    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, slowLoading ? 2500 : 1200));
      setIsLoading(false);
    };

    loadData();
  }, [forceLoading, slowLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mood Analytics */}
      {forceLoading || isLoading ? (
        <MoodAnalyticsSkeleton />
      ) : (
        <MoodAnalytics />
      )}
      
      {/* Interactive Analytics */}
      {forceLoading || isLoading ? (
        <InteractiveAnalyticsSkeleton />
      ) : (
        <InteractiveAnalytics />
      )}
    </div>
  );
};

/**
 * Quick actions with inline loading states
 */
export const LoadingQuickActions: React.FC<LoadingStateProps> = ({
  forceLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    try {
      // Simulate action
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Executed: ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (forceLoading) {
    return <QuickMoodSkeleton />;
  }

  return (
    <div className="space-y-4">
      <QuickMoodCheckIn />
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleQuickAction('breathing')}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? <InlineSpinner size="sm" className="mr-2" /> : null}
          Quick Breathing
        </button>
        
        <button
          onClick={() => handleQuickAction('meditation')}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? <InlineSpinner size="sm" className="mr-2" /> : null}
          Meditation
        </button>
      </div>
    </div>
  );
};

/**
 * Loading animations showcase
 */
export const LoadingAnimationsShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {/* Heartbeat for mood */}
      <div className="text-center space-y-2">
        <HeartbeatLoader text="Loading mood data..." />
        <p className="text-xs text-muted-foreground">Heartbeat Loader</p>
      </div>
      
      {/* Breathing for meditation */}
      <div className="text-center space-y-2">
        <BreathingLoader text="Preparing meditation..." />
        <p className="text-xs text-muted-foreground">Breathing Loader</p>
      </div>
      
      {/* Wave for analytics */}
      <div className="text-center space-y-2">
        <WaveLoader text="Analyzing trends..." />
        <p className="text-xs text-muted-foreground">Wave Loader</p>
      </div>
      
      {/* Gentle pulse for sensitive content */}
      <div className="text-center space-y-2">
        <GentlePulseLoader text="Loading gently..." />
        <p className="text-xs text-muted-foreground">Gentle Pulse</p>
      </div>
      
      {/* Activity rings */}
      <div className="text-center space-y-2">
        <ActivityRingsLoader text="Tracking progress..." />
        <p className="text-xs text-muted-foreground">Activity Rings</p>
      </div>
      
      {/* Zen dots */}
      <div className="text-center space-y-2">
        <ZenDotsLoader text="Finding peace..." />
        <p className="text-xs text-muted-foreground">Zen Dots</p>
      </div>
      
      {/* Typing indicator */}
      <div className="text-center space-y-2">
        <TypingIndicator />
        <p className="text-xs text-muted-foreground">Typing Indicator</p>
      </div>
      
      {/* Basic spinner */}
      <div className="text-center space-y-2">
        <Spinner text="Loading..." />
        <p className="text-xs text-muted-foreground">Basic Spinner</p>
      </div>
    </div>
  );
};

/**
 * Complete dashboard with loading states
 */
export const LoadingDashboardDemo: React.FC<{
  showLoading?: boolean;
  progressiveLoading?: boolean;
}> = ({ 
  showLoading = false, 
  progressiveLoading = false 
}) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  useEffect(() => {
    if (showLoading) return;
    
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [showLoading]);

  // Show full dashboard loading overlay
  if (showLoading || isInitialLoading) {
    return (
      <div className="min-h-screen">
        <DashboardLoader />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mental Wellness Dashboard</h1>
        <p className="text-muted-foreground">Your journey to better mental health</p>
      </div>

      {/* Mood tracking section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Mood Tracking</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingMoodTracker />
          </div>
          <div>
            <LoadingQuickActions />
          </div>
        </div>
      </section>

      {/* Widgets section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Mood Insights</h2>
        <LoadingMoodWidgets slowLoading={progressiveLoading} />
      </section>

      {/* Analytics section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Analytics & Trends</h2>
        <LoadingMoodAnalytics slowLoading={progressiveLoading} />
      </section>
    </div>
  );
};

export default {
  LoadingMoodTracker,
  LoadingMoodWidgets,
  LoadingMoodAnalytics,
  LoadingQuickActions,
  LoadingAnimationsShowcase,
  LoadingDashboardDemo
};