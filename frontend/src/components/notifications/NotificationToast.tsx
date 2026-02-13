import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Heart, Wind, Calendar, Quote, CheckCircle, ExternalLink, Bell } from 'lucide-react';
import { WellnessNotification } from '@/types/notifications';
import notificationService from '@/services/notificationService';

interface NotificationToastProps {
  notification: WellnessNotification;
  onDismiss: () => void;
  onAction: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow time for exit animation
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'mood-reminder':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'breathing-exercise':
        return <Wind className="h-5 w-5 text-blue-500" />;
      case 'session-reminder':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'wellness-quote':
        return <Quote className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'mood-reminder':
        return 'border-pink-200 bg-pink-50';
      case 'breathing-exercise':
        return 'border-blue-200 bg-blue-50';
      case 'session-reminder':
        return 'border-green-200 bg-green-50';
      case 'wellness-quote':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleAction = () => {
    onAction();
    notificationService.markNotificationAsActedUpon(notification.id);
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleDismiss = () => {
    notificationService.dismissNotification(notification.id);
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <Card className={`w-80 shadow-lg hover:shadow-xl transition-shadow ${getTypeColor()}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{getTypeIcon()}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                  {notification.title}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-gray-200/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{notification.message}</p>

              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className="text-xs">
                  {notification.type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>

                {notification.data?.actionUrl && (
                  <Button size="sm" onClick={handleAction} className="h-7 text-xs">
                    Take Action
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationToast;
