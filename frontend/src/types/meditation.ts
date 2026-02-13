// Real-time Guided Meditation & Breathing Exercises System Types

export interface MeditationSession {
  id: string;
  userId: string;
  type: MeditationType;
  duration: number; // in seconds
  startTime: string;
  endTime?: string;
  completed: boolean;
  ambientSound?: AmbientSoundType;
  soundVolume: number; // 0-100
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  interruptions: number;
  actualDuration: number; // actual time spent meditating
}

export type MeditationType =
  | 'guided-meditation'
  | 'breathing-exercise'
  | 'mindfulness'
  | 'body-scan'
  | 'loving-kindness'
  | 'zen-meditation'
  | 'free-meditation';

export interface BreathingExercise {
  id: string;
  name: string;
  type: BreathingTechnique;
  description: string;
  instructions: string[];
  phases: BreathingPhase[];
  totalCycleDuration: number; // in seconds
  recommendedCycles: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

export type BreathingTechnique =
  | '4-7-8-breathing'
  | 'box-breathing'
  | 'triangle-breathing'
  | 'belly-breathing'
  | 'alternate-nostril'
  | '7-11-breathing';

export interface BreathingPhase {
  name: string;
  duration: number; // in seconds
  instruction: string;
  color: string;
  animation: AnimationType;
}

export type AnimationType = 'expand' | 'contract' | 'hold' | 'pause' | 'inhale' | 'exhale';

export interface AmbientSound {
  id: string;
  name: string;
  type: AmbientSoundType;
  description: string;
  audioUrl: string;
  duration?: number; // if not looping
  isLooping: boolean;
  category: SoundCategory;
  icon: string;
  color: string;
  tags: string[];
}

export type AmbientSoundType =
  | 'rain'
  | 'ocean-waves'
  | 'forest'
  | 'mountain-stream'
  | 'fireplace'
  | 'white-noise'
  | 'pink-noise'
  | 'brown-noise'
  | 'thunder'
  | 'wind'
  | 'birds'
  | 'crickets'
  | 'cafe-ambience'
  | 'tibetan-bowls'
  | 'chimes'
  | 'silence';

export type SoundCategory = 'nature' | 'urban' | 'instrumental' | 'noise' | 'spiritual';

export interface MeditationTimer {
  duration: number; // total duration in seconds
  elapsed: number; // elapsed time in seconds
  remaining: number; // remaining time in seconds
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  startTime?: number; // timestamp
  pausedTime: number; // total paused duration
  pausedStartTime?: number; // when pause started
  intervals: TimerInterval[];
}

export interface TimerInterval {
  type: 'meditation' | 'break' | 'preparation';
  duration: number;
  message?: string;
  soundAlert?: boolean;
}

export interface MindfulnessProgress {
  userId: string;
  totalSessions: number;
  totalMeditationTime: number; // in minutes
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastSessionDate: string;
  weeklyGoal: number; // minutes per week
  weeklyProgress: number; // minutes completed this week
  favoriteType: MeditationType;
  averageSessionDuration: number;
  averageRating: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  achievements: Achievement[];
  weeklyStats: WeeklyStats[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type AchievementCategory =
  | 'streak'
  | 'duration'
  | 'frequency'
  | 'technique'
  | 'consistency'
  | 'milestone';

export interface WeeklyStats {
  weekStartDate: string;
  sessionsCompleted: number;
  totalMinutes: number;
  averageRating: number;
  mostUsedTechnique: MeditationType;
  goalCompletion: number; // percentage
}

export interface MeditationPreferences {
  userId: string;
  defaultDuration: number; // in minutes
  preferredTimes: TimePreference[];
  favoriteAmbientSounds: AmbientSoundType[];
  defaultVolume: number;
  reminderEnabled: boolean;
  reminderTimes: string[]; // HH:MM format
  vibrationEnabled: boolean;
  autoStartBreathing: boolean;
  showProgressStats: boolean;
  preferredBreathingTechnique: BreathingTechnique;
  skipPreparation: boolean;
  enableGuidedInstructions: boolean;
}

export interface TimePreference {
  label: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  enabled: boolean;
}

export interface BreathingSession {
  id: string;
  userId: string;
  technique: BreathingTechnique;
  cyclesCompleted: number;
  targetCycles: number;
  duration: number; // actual duration in seconds
  startTime: string;
  endTime?: string;
  completed: boolean;
  heartRateBefore?: number;
  heartRateAfter?: number;
  stressLevelBefore?: number; // 1-10 scale
  stressLevelAfter?: number; // 1-10 scale
  notes?: string;
}

export interface GuidedMeditationScript {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  instructor: string;
  type: MeditationType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  script: MeditationSegment[];
  tags: string[];
  audioUrl?: string;
  backgroundMusic?: AmbientSoundType;
}

export interface MeditationSegment {
  timestamp: number; // seconds from start
  instruction: string;
  duration: number; // how long this instruction should be displayed
  tone: 'gentle' | 'encouraging' | 'calming' | 'neutral';
  breathingCue?: BreathingCue;
}

export interface BreathingCue {
  type: 'inhale' | 'exhale' | 'hold';
  duration: number;
  intensity: 'gentle' | 'normal' | 'deep';
}

// Predefined breathing exercises
export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    type: '4-7-8-breathing',
    description:
      'A powerful technique for relaxation and sleep, involving inhaling for 4, holding for 7, and exhaling for 8 counts.',
    instructions: [
      'Sit comfortably with your back straight',
      'Place your tongue against the ridge behind your upper teeth',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat for 4 cycles initially',
    ],
    phases: [
      {
        name: 'Inhale',
        duration: 4,
        instruction: 'Breathe in slowly through your nose',
        color: '#3B82F6',
        animation: 'expand',
      },
      {
        name: 'Hold',
        duration: 7,
        instruction: 'Hold your breath gently',
        color: '#8B5CF6',
        animation: 'hold',
      },
      {
        name: 'Exhale',
        duration: 8,
        instruction: 'Breathe out slowly through your mouth',
        color: '#10B981',
        animation: 'contract',
      },
    ],
    totalCycleDuration: 19,
    recommendedCycles: 4,
    difficulty: 'beginner',
    benefits: [
      'Reduces anxiety and stress',
      'Improves sleep quality',
      'Lowers heart rate',
      'Promotes relaxation',
      'Enhances focus',
    ],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    type: 'box-breathing',
    description:
      'A balanced breathing technique used by Navy SEALs and athletes for focus and stress relief.',
    instructions: [
      'Sit upright in a comfortable position',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale through your mouth for 4 counts',
      'Hold empty for 4 counts',
      'Continue for several cycles',
    ],
    phases: [
      {
        name: 'Inhale',
        duration: 4,
        instruction: 'Breathe in slowly and deeply',
        color: '#3B82F6',
        animation: 'expand',
      },
      {
        name: 'Hold Full',
        duration: 4,
        instruction: 'Hold your breath with lungs full',
        color: '#8B5CF6',
        animation: 'hold',
      },
      {
        name: 'Exhale',
        duration: 4,
        instruction: 'Breathe out slowly and completely',
        color: '#10B981',
        animation: 'contract',
      },
      {
        name: 'Hold Empty',
        duration: 4,
        instruction: 'Hold your breath with lungs empty',
        color: '#F59E0B',
        animation: 'pause',
      },
    ],
    totalCycleDuration: 16,
    recommendedCycles: 6,
    difficulty: 'beginner',
    benefits: [
      'Improves focus and concentration',
      'Reduces stress and anxiety',
      'Enhances emotional regulation',
      'Increases lung capacity',
      'Promotes mental clarity',
    ],
  },
  {
    id: 'triangle-breathing',
    name: 'Triangle Breathing',
    type: 'triangle-breathing',
    description: 'A simple three-phase breathing pattern that promotes balance and calm.',
    instructions: [
      'Find a comfortable seated position',
      'Breathe naturally for a few moments',
      'Inhale for 3 counts',
      'Hold for 3 counts',
      'Exhale for 3 counts',
      'Continue the triangle pattern',
    ],
    phases: [
      {
        name: 'Inhale',
        duration: 3,
        instruction: 'Breathe in gently',
        color: '#3B82F6',
        animation: 'expand',
      },
      {
        name: 'Hold',
        duration: 3,
        instruction: 'Hold with ease',
        color: '#8B5CF6',
        animation: 'hold',
      },
      {
        name: 'Exhale',
        duration: 3,
        instruction: 'Breathe out slowly',
        color: '#10B981',
        animation: 'contract',
      },
    ],
    totalCycleDuration: 9,
    recommendedCycles: 8,
    difficulty: 'beginner',
    benefits: [
      'Creates a sense of balance',
      'Easy for beginners',
      'Promotes steady rhythm',
      'Calms the nervous system',
      'Improves breathing awareness',
    ],
  },
];

// Predefined ambient sounds
export const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    type: 'rain',
    description: 'Soft, steady rainfall perfect for meditation',
    audioUrl: '/sounds/rain.mp3',
    isLooping: true,
    category: 'nature',
    icon: '🌧️',
    color: '#6B7280',
    tags: ['relaxing', 'nature', 'sleep'],
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    type: 'ocean-waves',
    description: 'Rhythmic ocean waves washing onto shore',
    audioUrl: '/sounds/ocean-waves.mp3',
    isLooping: true,
    category: 'nature',
    icon: '🌊',
    color: '#0EA5E9',
    tags: ['calming', 'rhythmic', 'nature'],
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    type: 'forest',
    description: 'Peaceful forest sounds with birds and rustling leaves',
    audioUrl: '/sounds/forest.mp3',
    isLooping: true,
    category: 'nature',
    icon: '🌲',
    color: '#059669',
    tags: ['nature', 'birds', 'peaceful'],
  },
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    type: 'fireplace',
    description: 'Warm crackling fire for comfort and focus',
    audioUrl: '/sounds/fireplace.mp3',
    isLooping: true,
    category: 'instrumental',
    icon: '🔥',
    color: '#DC2626',
    tags: ['cozy', 'warm', 'focus'],
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    type: 'white-noise',
    description: 'Pure white noise for concentration and masking',
    audioUrl: '/sounds/white-noise.mp3',
    isLooping: true,
    category: 'noise',
    icon: '📊',
    color: '#9CA3AF',
    tags: ['focus', 'concentration', 'masking'],
  },
  {
    id: 'tibetan-bowls',
    name: 'Tibetan Singing Bowls',
    type: 'tibetan-bowls',
    description: 'Sacred tones for deep meditation',
    audioUrl: '/sounds/tibetan-bowls.mp3',
    isLooping: true,
    category: 'spiritual',
    icon: '🎵',
    color: '#7C3AED',
    tags: ['spiritual', 'meditation', 'sacred'],
  },
];

// Default meditation achievements
export const MEDITATION_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-session',
    name: 'First Steps',
    description: 'Complete your first meditation session',
    icon: '🌱',
    category: 'milestone',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'common',
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Meditate for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    requirement: 7,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'rare',
  },
  {
    id: 'hour-master',
    name: 'Hour Master',
    description: 'Complete 60 minutes of total meditation',
    icon: '⏰',
    category: 'duration',
    requirement: 60,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'epic',
  },
  {
    id: 'breathing-expert',
    name: 'Breathing Expert',
    description: 'Master all breathing techniques',
    icon: '🌬️',
    category: 'technique',
    requirement: 3,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'legendary',
  },
];

// Utility functions
export const formatMeditationTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateSessionCompletion = (elapsed: number, total: number): number => {
  return Math.min((elapsed / total) * 100, 100);
};

export const getBreathingPhaseColor = (phase: BreathingPhase, intensity: number = 1): string => {
  const colors = {
    expand: `rgba(59, 130, 246, ${intensity})`,
    contract: `rgba(16, 185, 129, ${intensity})`,
    hold: `rgba(139, 92, 246, ${intensity})`,
    pause: `rgba(245, 158, 11, ${intensity})`,
    inhale: `rgba(59, 130, 246, ${intensity})`,
    exhale: `rgba(16, 185, 129, ${intensity})`,
  };
  return colors[phase.animation] || colors.hold;
};

export const getMeditationTypeIcon = (type: MeditationType): string => {
  const icons = {
    'guided-meditation': '🧘‍♀️',
    'breathing-exercise': '🌬️',
    mindfulness: '🧠',
    'body-scan': '🫧',
    'loving-kindness': '💝',
    'zen-meditation': '☯️',
    'free-meditation': '✨',
  };
  return icons[type] || '🧘';
};

export const getNextAchievement = (progress: MindfulnessProgress): Achievement | null => {
  const locked = MEDITATION_ACHIEVEMENTS.filter((a) => !a.isUnlocked);
  return locked.find((a) => a.currentProgress / a.requirement >= 0.5) || locked[0] || null;
};

export const calculateWeeklyGoalProgress = (weeklyMinutes: number, goal: number): number => {
  return Math.min((weeklyMinutes / goal) * 100, 100);
};
