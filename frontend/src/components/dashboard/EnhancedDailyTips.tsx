'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  StarIcon,
  HeartIcon,
  MoonIcon,
  FaceSmileIcon,
  BeakerIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ConfettiEffect } from '@/components/ui/confetti-effect';

// Constants
const iconMap = {
  Star: StarIcon,
  Heart: HeartIcon,
  Moon: MoonIcon,
  Smile: FaceSmileIcon,
  Brain: BeakerIcon,
  Activity: BoltIcon,
  Target: FireIcon,
  Sparkles: SparklesIcon,
} as const;

// Types
type IconName = keyof typeof iconMap;
type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  category: string;
  color?: ColorVariant;
}

// All available tips
const ALL_TIPS: Tip[] = [
  {
    id: "1",
    title: "Deep Breathing",
    description: "Take 5 deep breaths, focusing on your breath for mindfulness.",
    icon: "Heart",
    category: "Mindfulness"
  },
  {
    id: "2",
    title: "Gratitude Moment",
    description: "Write down three things you are grateful for today.",
    icon: "Star",
    category: "Positivity"
  },
  {
    id: "3",
    title: "Quick Stretch",
    description: "Stand up and do a quick full-body stretch.",
    icon: "Activity",
    category: "Physical"
  },
  {
    id: "4",
    title: "Water Break",
    description: "Drink a glass of water and stay hydrated.",
    icon: "Sparkles",
    category: "Health"
  },
  {
    id: "5",
    title: "Positive Affirmation",
    description: "Say one positive affirmation to yourself.",
    icon: "Smile",
    category: "Mental"
  },
  {
    id: "6",
    title: "Mind Reset",
    description: "Close your eyes for 30 seconds and clear your mind.",
    icon: "Brain",
    category: "Focus"
  },
  {
    id: "7",
    title: "Energy Boost",
    description: "Do 10 jumping jacks to boost your energy.",
    icon: "Target",
    category: "Energy"
  },
  {
    id: "8",
    title: "Evening Reflection",
    description: "Reflect on one achievement from today.",
    icon: "Moon",
    category: "Reflection"
  }
];

// Maximum number of daily tips to show at once
const MAX_DAILY_TIPS = 3;

// Maximum number of refreshes allowed per day
const MAX_DAILY_REFRESHES = 3;

// Function to get random tips
const getRandomTips = (excludeIds: string[] = []): Tip[] => {
  const availableTips = ALL_TIPS.filter(tip => !excludeIds.includes(tip.id));
  const shuffled = [...availableTips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, MAX_DAILY_TIPS);
};

interface CompletedTip {
  id: string;
  completedAt: number;
  lastResetDate?: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  category: string;
  color?: ColorVariant;
}

interface TipCardProps {
  tip: Tip;
  onComplete: (id: string) => void;
  completed: boolean;
  onRemove?: (id: string) => void;
}

// Local Storage Keys
const STORAGE_KEYS = {
  COMPLETED_TIPS: 'completed_daily_tips',
  LAST_RESET: 'tips_last_reset_date',
  REFRESH_COUNT: 'tips_refresh_count',
} as const;

// Get today's date in YYYY-MM-DD format for consistent comparison
const getTodayKey = () => new Date().toISOString().split('T')[0];

// TipCard component
const TipCard = React.memo<TipCardProps>((props: TipCardProps) => {
  const { tip, onComplete, completed, onRemove } = props;
  const Icon = iconMap[tip.icon];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${completed ? 'bg-green-50 dark:bg-green-900/20' : ''}
        ${isHovered ? 'scale-105' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`
              p-2 rounded-full
              ${completed ? 'bg-green-100 dark:bg-green-800' : 'bg-blue-100 dark:bg-blue-800'}
            `}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tip.description}
              </p>
            </div>
          </div>
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            transition-colors duration-300
            ${completed
              ? 'bg-green-50 text-green-700'
              : isHovered
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-700'
            }
          `}>
            {tip.category}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => onComplete(tip.id)}
            disabled={completed}
            variant={completed ? "outline" : "default"}
            className="flex-1"
          >
            {completed ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : 'Mark as Complete'}
          </Button>
          
          {completed && onRemove && (
            <Button
              onClick={() => onRemove(tip.id)}
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TipCard.displayName = 'TipCard';

// Main component
export default function EnhancedDailyTips() {
  // State for daily tips
  const [currentTips, setCurrentTips] = React.useState<Tip[]>(() => {
    const storedTips = localStorage.getItem('current_daily_tips');
    if (storedTips) {
      return JSON.parse(storedTips);
    }
    const initialTips = getRandomTips();
    localStorage.setItem('current_daily_tips', JSON.stringify(initialTips));
    return initialTips;
  });

  // State for completed tips
  const [completedTips, setCompletedTips] = React.useState<CompletedTip[]>(() => {
    try {
      // Get today's date
      const today = getTodayKey();
      
      // Get last reset date
      const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);
      
      // Check if we need to reset (new day)
      if (!lastReset || lastReset !== today) {
        localStorage.setItem(STORAGE_KEYS.LAST_RESET, today);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_TIPS, '[]');
        localStorage.setItem(STORAGE_KEYS.REFRESH_COUNT, '0');
        return [];
      }

      // Load stored completions
      const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_TIPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((tip: CompletedTip) => 
            new Date(tip.completedAt).toISOString().split('T')[0] === today
          );
        }
      }
    } catch (error) {
      console.error('Failed to parse completed tips:', error);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_TIPS);
    }
    return [];
  });

  const [refreshCount, setRefreshCount] = React.useState(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.REFRESH_COUNT) || '0', 10);
    } catch {
      return 0;
    }
  });

  const [showConfetti, setShowConfetti] = React.useState(false);

  // Handlers
  const handleComplete = React.useCallback((id: string) => {
    setCompletedTips((prev: CompletedTip[]) => {
      const newTips = [...prev, { id, completedAt: Date.now() }];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TIPS, JSON.stringify(newTips));
      
      // Show confetti if all tips are completed
      if (newTips.length === currentTips.length) {
        setShowConfetti(true);
      }
      
      return newTips;
    });
  }, [currentTips.length]);

  const handleRemove = React.useCallback((id: string) => {
    setCompletedTips((prev: CompletedTip[]) => {
      const newTips = prev.filter((tip: CompletedTip) => tip.id !== id);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TIPS, JSON.stringify(newTips));
      return newTips;
    });
  }, []);

  const handleRefresh = React.useCallback(() => {
    if (refreshCount >= MAX_DAILY_REFRESHES) return;
    
    const newCount = refreshCount + 1;
    setRefreshCount(newCount);
    localStorage.setItem(STORAGE_KEYS.REFRESH_COUNT, newCount.toString());
    
    // Get completed tip IDs to exclude them from new random selection
    const completedIds = completedTips.map((tip: CompletedTip) => tip.id);
    const newTips = getRandomTips(completedIds);
    
    setCurrentTips(newTips);
    localStorage.setItem('current_daily_tips', JSON.stringify(newTips));
    
    // Reset completed tips for the new set
    setCompletedTips([]);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TIPS, '[]');
  }, [refreshCount, completedTips]);

  const handleConfettiComplete = React.useCallback(() => {
    setShowConfetti(false);
  }, []);

  return (
    <div className="space-y-4">
      {showConfetti && <ConfettiEffect active={true} onComplete={handleConfettiComplete} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentTips.map((tip: Tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            onComplete={handleComplete}
            onRemove={handleRemove}
            completed={completedTips.some((ct: CompletedTip) => ct.id === tip.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {completedTips.length} of {currentTips.length} tips completed today
        </p>
        
        {refreshCount < MAX_DAILY_REFRESHES && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-xs hover:bg-primary/5 transition-all duration-200"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Refresh Tips ({MAX_DAILY_REFRESHES - refreshCount} left)
            </Button>
            <div className="text-xs text-gray-500">
              {refreshCount > 0 && `Used ${refreshCount}/${MAX_DAILY_REFRESHES} refreshes today`}
            </div>
          </div>
        )}
      </div>

      {completedTips.length === currentTips.length && (
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 font-medium">
            🎉 Amazing job! You've completed all your wellness tips for today.
            {refreshCount < MAX_DAILY_REFRESHES ? 
              " You can refresh for new tips or come back tomorrow!" :
              " Come back tomorrow for new challenges!"
            }
          </p>
        </div>
      )}
    </div>
  );
}