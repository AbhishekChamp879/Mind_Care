import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import { WellnessNotification } from '@/types/notifications';

interface NotificationContainerProps {
  maxToasts?: number;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ maxToasts = 3 }) => {
  const [notifications, setNotifications] = useState<WellnessNotification[]>([]);

  useEffect(() => {
    const handleNotification = (event: CustomEvent<WellnessNotification>) => {
      const notification = event.detail;

      setNotifications((prev) => {
        // Remove oldest notification if at max capacity
        const newNotifications = prev.length >= maxToasts ? prev.slice(1) : prev;

        return [...newNotifications, notification];
      });
    };

    // Listen for wellness notifications
    window.addEventListener('wellnessNotification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('wellnessNotification', handleNotification as EventListener);
    };
  }, [maxToasts]);

  const handleDismiss = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
  };

  const handleAction = (notification: WellnessNotification) => {
    // Navigate to the appropriate page based on notification type
    if (notification.data?.actionUrl) {
      window.location.href = notification.data.actionUrl;
    } else {
      // Default actions based on type
      switch (notification.type) {
        case 'mood-reminder':
          window.location.href = '/app/dashboard';
          break;
        case 'breathing-exercise':
          window.location.href = '/app/breathing';
          break;
        case 'session-reminder':
          window.location.href = '/app/sessions';
          break;
        case 'wellness-quote':
          window.location.href = '/app/resources';
          break;
        default:
          window.location.href = '/app/dashboard';
      }
    }
  };

  // Don't render if no notifications
  if (notifications.length === 0) return null;

  // Create portal to render notifications at the top level
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onDismiss={() => handleDismiss(notification.id)}
            onAction={() => handleAction(notification)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;
