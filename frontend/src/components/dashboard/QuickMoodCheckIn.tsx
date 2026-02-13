import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import {
  useRealTimeUpdates,
  useSmoothAnimations,
  useStreakTracking,
} from '@/hooks/useRealTimeFeatures';
import { showRealTimeNotification, AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import notificationService from '@/services/notificationService';
import { Heart, Zap, Clock, CheckCircle2 } from 'lucide-react';

const moodEmojis = {
  1: {
    emoji: '😢',
    label: 'Very Sad',
    color: 'text-red-500',
    bgColor: 'bg-red-50 hover:bg-red-100',
  },
  2: {
    emoji: '😕',
    label: 'Sad',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  3: {
    emoji: '😐',
    label: 'Neutral',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
  },
  4: {
    emoji: '😊',
    label: 'Happy',
    color: 'text-green-500',
    bgColor: 'bg-green-50 hover:bg-green-100',
  },
  5: {
    emoji: '😄',
    label: 'Very Happy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
};

interface QuickMoodCheckInProps {
  variant?: 'default' | 'compact' | 'minimal';
  showStreak?: boolean;
  showTitle?: boolean;
  onMoodLogged?: (mood: number) => void;
  className?: string;
}

export const QuickMoodCheckIn: React.FC<QuickMoodCheckInProps> = ({
  variant = 'default',
  showStreak = true,
  showTitle = true,
  onMoodLogged,
  className = '',
}) => {
  const { addMoodEntry, getTodayMood } = useMoodTracking();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition, isAnimating } = useSmoothAnimations();
  const { updateStreak, getStreak } = useStreakTracking();
  const [isLogging, setIsLogging] = useState(false);

  const todayMood = getTodayMood();
  const moodStreak = getStreak('mood_tracking');

  const handleQuickMoodLog = async (mood: number) => {
    if (isLogging) return;

    setIsLogging(true);

    try {
      await smoothTransition(() => {
        addMoodEntry(mood);

        // Update streak and trigger real-time updates
        const newStreak = updateStreak('mood_tracking');
        triggerUpdate('mood_logged', { mood: mood, streak: newStreak });

        // Mark mood reminder notification as acted upon if present
        notificationService.markNotificationAsActedUpon('mood-reminder');

        // Show success notification
        showRealTimeNotification(
          'success',
          `Mood logged! ${moodEmojis[mood as keyof typeof moodEmojis].label}`
        );

        // Check for streak milestones
        if (newStreak > 0 && newStreak % 3 === 0) {
          showRealTimeNotification('milestone', `🔥 ${newStreak} day mood tracking streak!`);
        }

        // Call callback if provided
        onMoodLogged?.(mood);
      });
    } finally {
      setIsLogging(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {Object.entries(moodEmojis).map(([value, { emoji, label, bgColor }]) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickMoodLog(Number(value))}
                disabled={isLogging || !!todayMood}
                className={`h-10 w-10 p-0 ${bgColor} transition-all duration-200 hover:scale-110 ${
                  todayMood?.mood === Number(value) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Quick Mood Check</span>
            </div>
            {showStreak && moodStreak > 0 && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
              >
                <Zap className="h-3 w-3 mr-1" />
                <AnimatedCounter value={moodStreak} suffix=" day" />
              </Badge>
            )}
          </div>

          {todayMood ? (
            <div className="flex items-center justify-center p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium">
                Today's mood: {moodEmojis[todayMood.mood].emoji} {moodEmojis[todayMood.mood].label}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(moodEmojis).map(([value, { emoji, label, bgColor }]) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickMoodLog(Number(value))}
                      disabled={isLogging}
                      className={`h-12 w-full p-0 ${bgColor} gentle-transition gentle-hover`}
                    >
                      <span className="text-xl">{emoji}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={`enhanced-card hover:shadow-medium transition-all duration-300 ${
        isAnimating ? 'scale-105 shadow-lg' : ''
      } ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300 ${
                isAnimating ? 'scale-110' : ''
              }`}
            >
              <Heart className="h-5 w-5 text-primary" />
            </div>
            {showTitle && (
              <div>
                <CardTitle className="text-lg">Quick Mood Check-in</CardTitle>
                <p className="text-xs text-muted-foreground">One-tap mood logging</p>
              </div>
            )}
          </div>

          {showStreak && moodStreak > 0 && (
            <Badge
              variant="outline"
              className="text-xs bg-orange-50 text-orange-700 border-orange-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              <AnimatedCounter value={moodStreak} suffix=" day streak" />
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {todayMood ? (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{moodEmojis[todayMood.mood].emoji}</span>
              <div>
                <div className="font-semibold">Today's Mood Logged</div>
                <div className={`text-sm ${moodEmojis[todayMood.mood].color}`}>
                  {moodEmojis[todayMood.mood].label}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(todayMood.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              How are you feeling right now?
            </p>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(moodEmojis).map(([value, { emoji, label, color, bgColor }]) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleQuickMoodLog(Number(value))}
                      disabled={isLogging}
                      className={`h-16 w-full p-0 ${bgColor} transition-all duration-200 hover:scale-105 focus:scale-105 group`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                          {emoji}
                        </div>
                        <div className={`text-xs font-medium ${color}`}>{label}</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log {label} mood</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            {isLogging && (
              <div className="text-center text-sm text-muted-foreground">Logging your mood...</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickMoodCheckIn;
