import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, AlertCircle, Zap, Heart, Target, Trophy } from 'lucide-react';

interface RealTimeFeedbackProps {
  type: 'success' | 'error' | 'loading' | 'achievement' | 'milestone';
  message: string;
  isVisible: boolean;
  duration?: number;
  onHide?: () => void;
}

export const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({
  type,
  message,
  isVisible,
  duration = 3000,
  onHide,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);

      if (duration > 0 && type !== 'loading') {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(() => onHide?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isVisible, duration, type, onHide]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'milestone':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <Heart className="h-4 w-4 text-primary" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'milestone':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!isVisible && !show) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <Card className={`${getColors()} shadow-lg border max-w-sm`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for showing real-time progress updates
export const ProgressFeedback: React.FC<{
  progress: number;
  label: string;
  isAnimating?: boolean;
}> = ({ progress, label, isAnimating = false }) => {
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    if (isAnimating) {
      const startProgress = displayProgress;
      const targetProgress = progress;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);

        // Smooth easing
        const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3);
        const currentProgress = startProgress + (targetProgress - startProgress) * easeOutCubic;

        setDisplayProgress(currentProgress);

        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, isAnimating, displayProgress]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{Math.round(displayProgress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};

// Smooth counter animation component
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}> = ({ value, duration = 1000, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (value - startValue) * easeOutCubic;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  return (
    <span>
      {prefix}
      {Math.round(displayValue)}
      {suffix}
    </span>
  );
};

// Real-time streak counter with celebration
export const StreakCounter: React.FC<{
  streak: number;
  type: string;
  label: string;
}> = ({ streak, type, label }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (streak > 0) {
      setIsAnimating(true);

      // Show celebration for milestones
      if (streak % 7 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [streak]);

  return (
    <div
      className={`relative p-3 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 transition-all duration-300 ${
        isAnimating ? 'scale-105 shadow-lg' : 'scale-100'
      }`}
    >
      {showCelebration && (
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🎉 {streak} days!
          </Badge>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full">
          <Target className="h-4 w-4 text-orange-600" />
        </div>
        <div>
          <div className="font-bold text-lg text-orange-700">
            <AnimatedCounter value={streak} suffix=" days" />
          </div>
          <div className="text-sm text-orange-600">{label}</div>
        </div>
      </div>

      {streak > 0 && (
        <div className="mt-2">
          <div className="w-full bg-orange-200 rounded-full h-1">
            <div
              className="h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(((streak % 7) / 7) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {7 - (streak % 7)} days to next milestone
          </div>
        </div>
      )}
    </div>
  );
};

// Global notification manager for real-time feedback
export const RealTimeNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: 'success' | 'error' | 'loading' | 'achievement' | 'milestone';
      message: string;
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { type, message } = event.detail;
      const notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);
    };

    window.addEventListener('showNotification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('showNotification', handleNotification as EventListener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ top: `${5 + index * 5}rem` }}
          className="fixed right-4 z-50"
        >
          <RealTimeFeedback
            type={notification.type}
            message={notification.message}
            isVisible={true}
            onHide={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
};

// Utility function to trigger notifications
export const showRealTimeNotification = (
  type: 'success' | 'error' | 'loading' | 'achievement' | 'milestone',
  message: string
) => {
  const event = new CustomEvent('showNotification', { detail: { type, message } });
  window.dispatchEvent(event);
};
