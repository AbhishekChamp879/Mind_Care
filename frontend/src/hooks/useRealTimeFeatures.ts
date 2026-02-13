// Real-time event system for smooth user interactions
import { useEffect, useState, useCallback } from 'react';

// Custom hook for real-time updates across components
export const useRealTimeUpdates = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = useCallback((eventType: string, data?: Record<string, unknown>) => {
    setUpdateTrigger((prev) => prev + 1);

    // Dispatch custom event for cross-component communication
    window.dispatchEvent(
      new CustomEvent('dashboardUpdate', {
        detail: { eventType, data, timestamp: Date.now() },
      })
    );
  }, []);

  return { updateTrigger, triggerUpdate };
};

// Hook for smooth animations and transitions
export const useSmoothAnimations = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const smoothTransition = useCallback(async (callback: () => void, duration: number = 300) => {
    setIsAnimating(true);

    // Add smooth transition
    await new Promise((resolve) => setTimeout(resolve, 50));
    callback();

    // Complete animation
    setTimeout(() => setIsAnimating(false), duration);
  }, []);

  return { isAnimating, smoothTransition };
};

// Hook for real-time notifications
export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: 'success' | 'info' | 'achievement' | 'milestone';
      title: string;
      message: string;
      timestamp: number;
    }>
  >([]);

  const addNotification = useCallback((type: string, title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type: type as any,
      title,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 3000);
  }, []);

  return { notifications, addNotification };
};

// Hook for real-time progress tracking
export const useRealTimeProgress = () => {
  const [progressAnimations, setProgressAnimations] = useState<Record<string, number>>({});

  const animateProgress = useCallback(
    (key: string, from: number, to: number, duration: number = 1000) => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = from + (to - from) * easeOutCubic;

        setProgressAnimations((prev) => ({
          ...prev,
          [key]: currentValue,
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },
    []
  );

  return { progressAnimations, animateProgress };
};

// Hook for live data synchronization
export const useLiveSync = () => {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const syncData = useCallback(async (key: string, data: Record<string, unknown>) => {
    setSyncStatus('syncing');

    try {
      // Simulate smooth sync with localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));
      localStorage.setItem(key, JSON.stringify(data));

      // Trigger sync event for other components
      window.dispatchEvent(
        new CustomEvent('dataSync', {
          detail: { key, data },
        })
      );

      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('synced'), 2000);
    }
  }, []);

  return { syncStatus, syncData };
};

// Hook for real-time streak tracking
export const useStreakTracking = () => {
  const [streaks, setStreaks] = useState<Record<string, number>>({});

  const updateStreak = useCallback((type: string) => {
    const today = new Date().toDateString();
    const streakKey = `streak_${type}`;
    const lastUpdateKey = `${streakKey}_last_update`;

    const lastUpdate = localStorage.getItem(lastUpdateKey);
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');

    let newStreak = currentStreak;

    if (lastUpdate !== today) {
      newStreak = currentStreak + 1;
      localStorage.setItem(streakKey, newStreak.toString());
      localStorage.setItem(lastUpdateKey, today);

      setStreaks((prev) => ({
        ...prev,
        [type]: newStreak,
      }));

      // Trigger streak milestone events
      if (newStreak % 7 === 0) {
        // Weekly milestone
        window.dispatchEvent(
          new CustomEvent('streakMilestone', {
            detail: { type, streak: newStreak },
          })
        );
      }
    }

    return newStreak;
  }, []);

  const getStreak = useCallback((type: string) => {
    return parseInt(localStorage.getItem(`streak_${type}`) || '0');
  }, []);

  return { streaks, updateStreak, getStreak };
};

// Hook for smooth UI feedback
export const useSmoothFeedback = () => {
  const [feedbackStates, setFeedbackStates] = useState<
    Record<
      string,
      {
        isActive: boolean;
        type: 'success' | 'error' | 'loading' | 'idle';
        message?: string;
      }
    >
  >({});

  const triggerFeedback = useCallback(
    (
      key: string,
      type: 'success' | 'error' | 'loading' | 'idle',
      message?: string,
      duration: number = 2000
    ) => {
      setFeedbackStates((prev) => ({
        ...prev,
        [key]: { isActive: true, type, message },
      }));

      if (type !== 'loading') {
        setTimeout(() => {
          setFeedbackStates((prev) => ({
            ...prev,
            [key]: { isActive: false, type: 'idle' },
          }));
        }, duration);
      }
    },
    []
  );

  const clearFeedback = useCallback((key: string) => {
    setFeedbackStates((prev) => ({
      ...prev,
      [key]: { isActive: false, type: 'idle' },
    }));
  }, []);

  return { feedbackStates, triggerFeedback, clearFeedback };
};
