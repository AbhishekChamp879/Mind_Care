import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/services/logger';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import {
  useRealTimeUpdates,
  useSmoothAnimations,
  useStreakTracking,
} from '@/hooks/useRealTimeFeatures';
import { showRealTimeNotification } from '@/components/dashboard/RealTimeFeedback';
import notificationService from '@/services/notificationService';
import { Heart, ChevronDown, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  2: { emoji: '😕', label: 'Sad', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '😊', label: 'Happy', color: 'text-green-500' },
  5: { emoji: '😄', label: 'Very Happy', color: 'text-blue-500' },
};

interface QuickMoodHeaderProps {
  variant?: 'button' | 'dropdown' | 'inline';
  showTrend?: boolean;
  className?: string;
}

export const QuickMoodHeader: React.FC<QuickMoodHeaderProps> = ({
  variant = 'button',
  showTrend = false,
  className = '',
}) => {
  const { addMoodEntry, getTodayMood, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition } = useSmoothAnimations();
  const { updateStreak } = useStreakTracking();

  const todayMood = getTodayMood();
  const weeklyAverage = getWeeklyMoodAverage();
  const trend = getMoodTrend();

  const handleQuickMoodLog = async (mood: number) => {
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
      });
    } catch (error) {
      logger.error('MOOD_TRACKING', 'Failed to log mood in quick header', error as Error, { mood });
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Declining';
      default:
        return 'Stable';
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {todayMood ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{moodEmojis[todayMood.mood].emoji}</span>
            <div className="text-sm">
              <div className="font-medium">Today's Mood</div>
              <div className={`text-xs ${moodEmojis[todayMood.mood].color}`}>
                {moodEmojis[todayMood.mood].label}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            {Object.entries(moodEmojis).map(([value, { emoji, label }]) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickMoodLog(Number(value))}
                    className="h-8 w-8 p-0 hover:scale-110 transition-transform duration-200"
                  >
                    <span className="text-sm">{emoji}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {showTrend && weeklyAverage > 0 && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getTrendIcon()}
            <span>{getTrendText()}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 px-2 ${className}`}>
            <Heart className="h-4 w-4 mr-1" />
            {todayMood ? (
              <span className="text-sm">{moodEmojis[todayMood.mood].emoji}</span>
            ) : (
              <span className="text-xs">Mood</span>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Mood Check-in</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {todayMood ? (
            <div className="p-2 text-center">
              <div className="text-lg mb-1">{moodEmojis[todayMood.mood].emoji}</div>
              <div className="text-sm font-medium">Today's Mood</div>
              <div className={`text-xs ${moodEmojis[todayMood.mood].color}`}>
                {moodEmojis[todayMood.mood].label}
              </div>
              <div className="flex items-center justify-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(todayMood.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ) : (
            <>
              {Object.entries(moodEmojis).map(([value, { emoji, label }]) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleQuickMoodLog(Number(value))}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm">{label}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {showTrend && weeklyAverage > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Weekly avg:</span>
                  <span>{weeklyAverage.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Trend:</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon()}
                    <span>{getTrendText()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default button variant
  return (
    <div className={className}>
      {todayMood ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="text-sm mr-1">{moodEmojis[todayMood.mood].emoji}</span>
              <span className="text-xs text-muted-foreground">
                {moodEmojis[todayMood.mood].label}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Today's mood: {moodEmojis[todayMood.mood].label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">Log mood</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Track your mood for today</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default QuickMoodHeader;
