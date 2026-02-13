import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/hooks/useDashboardFeatures';
import { Trophy, X, Sparkles } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className="enhanced-card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-aurora max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full animate-bounce">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Achievement Unlocked!
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-pulse">{achievement.icon}</div>
            <div>
              <h4 className="font-bold text-yellow-800 text-sm">{achievement.title}</h4>
              <p className="text-xs text-yellow-700 leading-relaxed">{achievement.description}</p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-600 font-medium">
                {achievement.type === 'milestone' && '🎯 Milestone'}
                {achievement.type === 'streak' && '🔥 Streak'}
                {achievement.type === 'social' && '👥 Social'}
                {achievement.type === 'wellness' && '🌿 Wellness'}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                onClick={handleClose}
              >
                Awesome!
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Achievement notification manager
export const AchievementNotificationManager = () => {
  const [notifications, setNotifications] = useState<Achievement[]>([]);

  useEffect(() => {
    // Listen for new achievements
    const handleAchievementUnlocked = (event: CustomEvent<Achievement>) => {
      setNotifications((prev) => [...prev, event.detail]);
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener);

    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener);
    };
  }, []);

  const removeNotification = (achievementId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== achievementId));
  };

  return (
    <>
      {notifications.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{ top: `${1 + index * 6}rem` }}
          className="fixed right-4 z-50"
        >
          <AchievementNotification
            achievement={achievement}
            onClose={() => removeNotification(achievement.id)}
          />
        </div>
      ))}
    </>
  );
};

// Utility function to trigger achievement notifications
export const triggerAchievementNotification = (achievement: Achievement) => {
  const event = new CustomEvent('achievementUnlocked', { detail: achievement });
  window.dispatchEvent(event);
};
