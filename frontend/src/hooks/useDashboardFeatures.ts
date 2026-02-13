// Utility functions for Student Dashboard functionality

import { useState, useEffect } from 'react';

// Types
export interface MoodEntry {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
  timestamp: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  progress: number;
  category: 'wellness' | 'academic' | 'social' | 'personal';
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  type: 'chat' | 'resource' | 'forum' | 'booking';
  title: string;
  timestamp: number;
  details?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  type: 'streak' | 'milestone' | 'social' | 'wellness';
}

// Mood Tracking Hook
export const useMoodTracking = () : {
  moods: MoodEntry[];
  addMoodEntry: (mood: number, note?: string) => void;
  getTodayMood: () => MoodEntry | undefined;
  getWeeklyMoodAverage: () => number;
  getMoodTrend: () => 'improving' | 'declining' | 'stable';
} => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const storedMoods = localStorage.getItem('mood_entries');
    if (storedMoods) {
      setMoods(JSON.parse(storedMoods));
    }
  }, []);

  const addMoodEntry = (mood: number, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      date: today,
      mood: mood as 1 | 2 | 3 | 4 | 5,
      note,
      timestamp: Date.now(),
    };

    const updatedMoods = moods.filter((m) => m.date !== today).concat(newEntry);
    setMoods(updatedMoods);
    localStorage.setItem('mood_entries', JSON.stringify(updatedMoods));
  };

  const getTodayMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moods.find((m) => m.date === today);
  };

  const getWeeklyMoodAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentMoods = moods.filter((m) => new Date(m.date) >= weekAgo);
    if (recentMoods.length === 0) return 0;

    const average = recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length;
    return Math.round(average * 10) / 10;
  };

  const getMoodTrend = () => {
    if (moods.length < 2) return 'stable';

    const recent = moods.slice(-7); // Last 7 entries
    const older = moods.slice(-14, -7); // Previous 7 entries

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, m) => sum + m.mood, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.mood, 0) / older.length;

    if (recentAvg > olderAvg + 0.3) return 'improving';
    if (recentAvg < olderAvg - 0.3) return 'declining';
    return 'stable';
  };

  return {
    moods,
    addMoodEntry,
    getTodayMood,
    getWeeklyMoodAverage,
    getMoodTrend,
  };
};

// Goals Hook
export const useGoals = (): {
  goals: Goal[];
  addGoal: (title: string, description: string, targetDate: string, category: Goal['category']) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  completeGoal: (id: string) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getWeeklyGoalProgress: () => number;
} => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedGoals = localStorage.getItem('user_goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  const addGoal = (
    title: string,
    description: string,
    targetDate: string,
    category: Goal['category']
  ) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      targetDate,
      completed: false,
      progress: 0,
      category,
      createdAt: Date.now(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('user_goals', JSON.stringify(updatedGoals));
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, progress, completed: progress >= 100 } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('user_goals', JSON.stringify(updatedGoals));
  };

  const completeGoal = (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: true, progress: 100 } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('user_goals', JSON.stringify(updatedGoals));
  };

  // --- ADD THIS FUNCTION ---
  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('user_goals', JSON.stringify(updatedGoals));
  };
  // --- END OF ADDED FUNCTION ---

  const getActiveGoals = () => goals.filter((g) => !g.completed);
  const getCompletedGoals = () => goals.filter((g) => g.completed);

  const getWeeklyGoalProgress = () => {
    const weeklyGoals = goals.filter((g) => {
      const targetDate = new Date(g.targetDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return targetDate <= weekFromNow;
    });

    if (weeklyGoals.length === 0) return 0;
    const totalProgress = weeklyGoals.reduce((sum, g) => sum + g.progress, 0);
    return Math.round(totalProgress / weeklyGoals.length);
  };

  return {
    goals,
    addGoal,
    updateGoalProgress,
    completeGoal,
    deleteGoal, // --- ADD deleteGoal HERE ---
    getActiveGoals,
    getCompletedGoals,
    getWeeklyGoalProgress,
  };
};

// Activity Logging Hook
export const useActivityLog = (): {
  activities: ActivityLog[];
  logActivity: (type: ActivityLog['type'], title: string, details?: string) => void;
  getWeeklyStats: () => { total: number; chat: number; resource: number; forum: number; booking: number; };
  getRecentActivities: (limit?: number) => ActivityLog[];
} => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const storedActivities = localStorage.getItem('activity_log');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);

  const logActivity = (type: ActivityLog['type'], title: string, details?: string) => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type,
      title,
      timestamp: Date.now(),
      details,
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 100); // Keep only last 100
    setActivities(updatedActivities);
    localStorage.setItem('activity_log', JSON.stringify(updatedActivities));
  };

  const getWeeklyStats = () => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyActivities = activities.filter((a) => a.timestamp > weekAgo);

    return {
      total: weeklyActivities.length,
      chat: weeklyActivities.filter((a) => a.type === 'chat').length,
      resource: weeklyActivities.filter((a) => a.type === 'resource').length,
      forum: weeklyActivities.filter((a) => a.type === 'forum').length,
      booking: weeklyActivities.filter((a) => a.type === 'booking').length,
    };
  };

  const getRecentActivities = (limit: number = 5) => {
    return activities.slice(0, limit);
  };

  return {
    activities,
    logActivity,
    getWeeklyStats,
    getRecentActivities,
  };
};

// Achievement System Hook
export const useAchievements = (): {
  achievements: Achievement[];
  unlockAchievement: (id: string) => Achievement | undefined;
  checkAchievements: (activities: ActivityLog[], moods: MoodEntry[], goals: Goal[]) => Achievement[];
  getUnlockedCount: () => number;
  getTotalCount: () => number;
} => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Initialize default achievements
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_chat',
        title: 'First Steps',
        description: 'Started your first AI chat session',
        icon: '🌱',
        unlocked: false,
        type: 'milestone',
      },
      {
        id: 'mood_streak_3',
        title: 'Mood Tracker',
        description: 'Tracked your mood for 3 consecutive days',
        icon: '📊',
        unlocked: false,
        type: 'streak',
      },
      {
        id: 'goal_setter',
        title: 'Goal Setter',
        description: 'Created your first wellness goal',
        icon: '🎯',
        unlocked: false,
        type: 'milestone',
      },
      {
        id: 'community_helper',
        title: 'Community Helper',
        description: 'Helped 5 peers in the forum',
        icon: '🤝',
        unlocked: false,
        type: 'social',
      },
      {
        id: 'weekly_warrior',
        title: 'Weekly Warrior',
        description: 'Used the platform for 7 consecutive days',
        icon: '⚡',
        unlocked: false,
        type: 'streak',
      },
      {
        id: 'wellness_champion',
        title: 'Wellness Champion',
        description: 'Completed 10 wellness activities',
        icon: '🏆',
        unlocked: false,
        type: 'wellness',
      },
    ];

    const storedAchievements = localStorage.getItem('user_achievements');
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      setAchievements(defaultAchievements);
      localStorage.setItem('user_achievements', JSON.stringify(defaultAchievements));
    }
  }, []);

  const unlockAchievement = (id: string) => {
    const updatedAchievements = achievements.map((achievement) =>
      achievement.id === id && !achievement.unlocked
        ? { ...achievement, unlocked: true, unlockedAt: Date.now() }
        : achievement
    );

    setAchievements(updatedAchievements);
    localStorage.setItem('user_achievements', JSON.stringify(updatedAchievements));

    // Return the unlocked achievement for showing notification
    const unlockedAchievement = updatedAchievements.find((a) => a.id === id && a.unlocked);

    // Trigger notification
    if (unlockedAchievement && typeof window !== 'undefined') {
      const event = new CustomEvent('achievementUnlocked', { detail: unlockedAchievement });
      window.dispatchEvent(event);
    }

    return unlockedAchievement;
  };

  const checkAchievements = (activities: ActivityLog[], moods: MoodEntry[], goals: Goal[]) => {
    const newUnlocks: Achievement[] = [];

    // Check for chat achievement
    if (
      activities.some((a) => a.type === 'chat') &&
      !achievements.find((a) => a.id === 'first_chat')?.unlocked
    ) {
      const unlocked = unlockAchievement('first_chat');
      if (unlocked) newUnlocks.push(unlocked);
    }

    // Check for mood streak
    const recentMoods = moods.slice(-3);
    if (recentMoods.length >= 3 && !achievements.find((a) => a.id === 'mood_streak_3')?.unlocked) {
      const unlocked = unlockAchievement('mood_streak_3');
      if (unlocked) newUnlocks.push(unlocked);
    }

    // Check for goal setter
    if (goals.length > 0 && !achievements.find((a) => a.id === 'goal_setter')?.unlocked) {
      const unlocked = unlockAchievement('goal_setter');
      if (unlocked) newUnlocks.push(unlocked);
    }

    return newUnlocks;
  };

  const getUnlockedCount = () => achievements.filter((a) => a.unlocked).length;
  const getTotalCount = () => achievements.length;

  return {
    achievements,
    unlockAchievement,
    checkAchievements,
    getUnlockedCount,
    getTotalCount,
  };
};

// Daily Tips System
export const useDailyTips = (): {
  getDailyTips: (count?: number) => Array<{ icon: string; title: string; description: string; color: string; }>;
} => {
  const tips = [
    {
      icon: 'Target',
      title: 'Mindful Moments',
      description: 'Take 3 deep breaths between classes to center yourself',
      color: 'primary',
    },
    {
      icon: 'Timer',
      title: 'Study Breaks',
      description: 'Rest for 10 minutes every hour to prevent burnout',
      color: 'secondary',
    },
    {
      icon: 'Heart',
      title: 'Self-Care',
      description: 'Eat well, sleep enough, and stay hydrated daily',
      color: 'accent',
    },
    {
      icon: 'Smile',
      title: 'Gratitude Practice',
      description: "Write down 3 things you're grateful for today",
      color: 'success',
    },
    {
      icon: 'Coffee',
      title: 'Social Connection',
      description: 'Reach out to a friend or family member',
      color: 'primary',
    },
    {
      icon: 'Moon',
      title: 'Quality Sleep',
      description: 'Aim for 7-9 hours of sleep for better mood',
      color: 'secondary',
    },
    {
      icon: 'Brain',
      title: 'Mental Exercise',
      description: 'Try a 5-minute meditation or mindfulness exercise',
      color: 'accent',
    },
    {
      icon: 'Activity',
      title: 'Physical Movement',
      description: 'Take a short walk or do some stretches',
      color: 'success',
    },
  ];

  const getDailyTips = (count: number = 6) => {
    // Shuffle tips based on current date for daily variation
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

    const shuffled = [...tips].sort(() => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    });

    return shuffled.slice(0, count);
  };

  return { getDailyTips };
};

// Sleep Quality Tracking
export const useSleepTracking = (): {
  sleepData: Array<{ date: string; hours: number }>;
  addSleepEntry: (hours: number) => void;
  getAverageHours: () => number;
} => {
  const [sleepData, setSleepData] = useState<Array<{ date: string; hours: number }>>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sleep_data');
    if (stored) {
      setSleepData(JSON.parse(stored));
    }
  }, []);

  const addSleepEntry = (hours: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = sleepData.filter((s) => s.date !== today).concat({ date: today, hours });
    setSleepData(updated);
    localStorage.setItem('sleep_data', JSON.stringify(updated));
  };

  const getAverageHours = () => {
    if (sleepData.length === 0) return 7.2; // Default value
    const total = sleepData.reduce((sum, s) => sum + s.hours, 0);
    return Math.round((total / sleepData.length) * 10) / 10;
  };

  return { sleepData, addSleepEntry, getAverageHours };
};