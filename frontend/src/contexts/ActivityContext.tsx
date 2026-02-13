// Context provider for activity logging across the platform
import { createContext, useContext, useEffect } from 'react';
import {
  useActivityLog,
  useAchievements,
  useMoodTracking,
  useGoals,
} from '@/hooks/useDashboardFeatures';

interface ActivityContextType {
  logActivity: (
    type: 'chat' | 'resource' | 'forum' | 'booking',
    title: string,
    details?: string
  ) => void;
  checkAndUnlockAchievements: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const { logActivity } = useActivityLog();
  const { checkAchievements } = useAchievements();
  const { moods } = useMoodTracking();
  const { goals } = useGoals();

  const checkAndUnlockAchievements = () => {
    const activities = JSON.parse(localStorage.getItem('activity_log') || '[]');
    checkAchievements(activities, moods, goals);
  };

  const logActivityWithAchievements = (
    type: 'chat' | 'resource' | 'forum' | 'booking',
    title: string,
    details?: string
  ) => {
    logActivity(type, title, details);

    // Check achievements after logging activity
    setTimeout(() => {
      checkAndUnlockAchievements();
    }, 100);
  };

  return (
    <ActivityContext.Provider
      value={{
        logActivity: logActivityWithAchievements,
        checkAndUnlockAchievements,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
};

// Higher-order component to automatically log navigation activities
export const withActivityLogging = (
  WrappedComponent: React.ComponentType<Record<string, unknown>>,
  activityType: 'chat' | 'resource' | 'forum' | 'booking',
  activityTitle: string
) => {
  return (props: Record<string, unknown>) => {
    const { logActivity } = useActivityContext();

    useEffect(() => {
      logActivity(activityType, activityTitle, `Navigated to ${activityTitle}`);
    }, [logActivity]);

    return <WrappedComponent {...props} />;
  };
};
