import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import {
  useRealTimeUpdates,
  useSmoothAnimations,
  useStreakTracking,
} from '@/hooks/useRealTimeFeatures';
import { showRealTimeNotification } from '@/components/dashboard/RealTimeFeedback';
import notificationService from '@/services/notificationService';
import { Heart, Smile, Plus, X } from 'lucide-react';

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

interface FloatingMoodButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  showOnlyIfNotLogged?: boolean;
}

export const FloatingMoodButton: React.FC<FloatingMoodButtonProps> = ({
  position = 'bottom-right',
  className = '',
  showOnlyIfNotLogged = true,
}) => {
  const { addMoodEntry, getTodayMood } = useMoodTracking();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition } = useSmoothAnimations();
  const { updateStreak } = useStreakTracking();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const todayMood = getTodayMood();

  // Don't show if mood already logged and showOnlyIfNotLogged is true
  if (showOnlyIfNotLogged && todayMood) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

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

        setIsOpen(false);
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:scale-110 group"
            >
              {todayMood ? (
                <span className="text-xl">{moodEmojis[todayMood.mood].emoji}</span>
              ) : (
                <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{todayMood ? 'Update mood' : 'Quick mood check-in'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Quick Mood Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Quick Mood Check-in</span>
            </DialogTitle>
            <DialogDescription>
              How are you feeling right now? One tap to log your mood.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(moodEmojis).map(([value, { emoji, label, bgColor }]) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleQuickMoodLog(Number(value))}
                      disabled={isLogging}
                      className={`h-16 w-full p-0 ${bgColor} gentle-transition gentle-hover group`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1 group-hover:text-3xl gentle-transition">
                          {emoji}
                        </div>
                        <div className="text-xs font-medium">{label.split(' ')[0]}</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {isLogging && (
              <div className="text-center text-sm text-muted-foreground">Logging your mood...</div>
            )}

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingMoodButton;
