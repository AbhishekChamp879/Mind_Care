import {
  NotificationPreferences,
  WellnessNotification,
  NOTIFICATION_TEMPLATES,
  WELLNESS_QUOTES,
} from '@/types/notifications';

class NotificationService {
  private preferences: NotificationPreferences;
  private notifications: WellnessNotification[] = [];
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.preferences = this.getDefaultPreferences();
    this.loadPreferences();
    this.initializeNotifications();
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      moodReminders: {
        enabled: true,
        frequency: 'daily',
        time: '09:00',
      },
      breathingReminders: {
        enabled: true,
        frequency: 'multiple',
        times: ['10:00', '15:00', '20:00'],
        duration: 3,
      },
      sessionReminders: {
        enabled: true,
        beforeSession: 15,
        followUp: true,
        rescheduleReminder: true,
      },
      wellnessQuotes: {
        enabled: true,
        frequency: 'daily',
        time: '08:00',
      },
      general: {
        sound: true,
        vibration: true,
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00',
        },
      },
    };
  }

  private loadPreferences() {
    const saved = localStorage.getItem('wellness-notification-preferences');
    if (saved) {
      this.preferences = { ...this.getDefaultPreferences(), ...JSON.parse(saved) };
    }
  }

  public savePreferences(preferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...preferences };
    localStorage.setItem('wellness-notification-preferences', JSON.stringify(this.preferences));
    this.rescheduleNotifications();
  }

  public getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  private initializeNotifications() {
    this.requestPermission();
    this.scheduleRecurringNotifications();
  }

  private async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  private isQuietHour(): boolean {
    if (!this.preferences.general.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startTime = this.parseTime(this.preferences.general.quietHours.start);
    const endTime = this.parseTime(this.preferences.general.quietHours.end);

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private scheduleRecurringNotifications() {
    this.clearScheduledNotifications();

    // Schedule mood reminders
    if (this.preferences.moodReminders.enabled) {
      this.scheduleMoodReminders();
    }

    // Schedule breathing reminders
    if (this.preferences.breathingReminders.enabled) {
      this.scheduleBreathingReminders();
    }

    // Schedule wellness quotes
    if (this.preferences.wellnessQuotes.enabled) {
      this.scheduleWellnessQuotes();
    }
  }

  private scheduleMoodReminders() {
    const { frequency, time, customDays } = this.preferences.moodReminders;

    switch (frequency) {
      case 'daily':
        this.scheduleDaily('mood-reminder', time);
        break;
      case 'twice-daily':
        this.scheduleDaily('mood-reminder', time);
        this.scheduleDaily('mood-reminder', this.addHours(time, 8));
        break;
      case 'weekly':
        this.scheduleWeekly('mood-reminder', time, 1); // Every Monday
        break;
      case 'custom':
        if (customDays) {
          customDays.forEach((day) => {
            this.scheduleWeekly('mood-reminder', time, parseInt(day));
          });
        }
        break;
    }
  }

  private scheduleBreathingReminders() {
    const { frequency, times } = this.preferences.breathingReminders;

    if (frequency === 'daily' || frequency === 'multiple') {
      times.forEach((time) => {
        this.scheduleDaily('breathing-exercise', time);
      });
    }
  }

  private scheduleWellnessQuotes() {
    const { frequency, time } = this.preferences.wellnessQuotes;

    if (frequency === 'daily') {
      this.scheduleDaily('wellness-quote', time);
    } else if (frequency === 'weekly') {
      this.scheduleWeekly('wellness-quote', time, 1);
    }
  }

  private scheduleDaily(type: WellnessNotification['type'], time: string) {
    const scheduleNext = () => {
      const nextTime = this.getNextScheduledTime(time);
      const timeout = setTimeout(() => {
        this.sendNotification(type);
        scheduleNext(); // Reschedule for next day
      }, nextTime.getTime() - Date.now());

      this.scheduledNotifications.set(`${type}-${time}`, timeout);
    };

    scheduleNext();
  }

  private scheduleWeekly(type: WellnessNotification['type'], time: string, dayOfWeek: number) {
    const scheduleNext = () => {
      const nextTime = this.getNextWeeklyTime(time, dayOfWeek);
      const timeout = setTimeout(() => {
        this.sendNotification(type);
        scheduleNext(); // Reschedule for next week
      }, nextTime.getTime() - Date.now());

      this.scheduledNotifications.set(`${type}-${time}-${dayOfWeek}`, timeout);
    };

    scheduleNext();
  }

  private getNextScheduledTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    return scheduled;
  }

  private getNextWeeklyTime(time: string, dayOfWeek: number): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();

    scheduled.setHours(hours, minutes, 0, 0);
    scheduled.setDate(now.getDate() + ((dayOfWeek - now.getDay() + 7) % 7));

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 7);
    }

    return scheduled;
  }

  private addHours(time: string, hoursToAdd: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + hoursToAdd) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private sendNotification(type: WellnessNotification['type'], customData?: any) {
    if (this.isQuietHour()) return;

    const templates = NOTIFICATION_TEMPLATES[type];
    if (!templates || templates.length === 0) return;

    const template = templates[Math.floor(Math.random() * templates.length)];
    let message = template.message;

    // Add custom content for wellness quotes
    if (type === 'wellness-quote') {
      const quote = WELLNESS_QUOTES[Math.floor(Math.random() * WELLNESS_QUOTES.length)];
      message = quote;
    }

    const notification: WellnessNotification = {
      id: `${type}-${Date.now()}`,
      type,
      title: template.title,
      message,
      scheduledTime: new Date(),
      isRecurring: true,
      data: customData,
      status: 'pending',
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    this.showBrowserNotification(notification);
    this.showInAppNotification(notification);

    // Cleanup old notifications
    this.cleanupOldNotifications();
  }

  private async showBrowserNotification(notification: WellnessNotification) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        silent: !this.preferences.general.sound,
        requireInteraction: true,
      });

      browserNotification.onclick = () => {
        if (notification.data?.actionUrl) {
          window.open(notification.data.actionUrl, '_blank');
        } else {
          window.focus();
        }
        browserNotification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  private showInAppNotification(notification: WellnessNotification) {
    // Trigger custom event for in-app notification display
    const event = new CustomEvent('wellnessNotification', {
      detail: notification,
    });
    window.dispatchEvent(event);
  }

  public scheduleSessionReminder(sessionId: string, sessionTime: Date, counselorName: string) {
    if (!this.preferences.sessionReminders.enabled) return;

    const reminderTime = new Date(
      sessionTime.getTime() - this.preferences.sessionReminders.beforeSession * 60 * 1000
    );

    if (reminderTime <= new Date()) return; // Don't schedule past reminders

    const timeout = setTimeout(() => {
      this.sendNotification('session-reminder', {
        sessionId,
        title: '📅 Upcoming Session',
        message: `Your session with ${counselorName} starts in ${this.preferences.sessionReminders.beforeSession} minutes.`,
        actionUrl: '/app/sessions',
      });
    }, reminderTime.getTime() - Date.now());

    this.scheduledNotifications.set(`session-${sessionId}`, timeout);
  }

  public cancelSessionReminder(sessionId: string) {
    const timeoutId = this.scheduledNotifications.get(`session-${sessionId}`);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(`session-${sessionId}`);
    }
  }

  private clearScheduledNotifications() {
    this.scheduledNotifications.forEach((timeout) => clearTimeout(timeout));
    this.scheduledNotifications.clear();
  }

  private rescheduleNotifications() {
    this.clearScheduledNotifications();
    this.scheduleRecurringNotifications();
  }

  private cleanupOldNotifications() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.notifications = this.notifications.filter(
      (notification) => notification.createdAt > oneWeekAgo
    );
  }

  public getNotificationHistory(): WellnessNotification[] {
    return this.notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public markNotificationAsActedUpon(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.status = 'acted-upon';
    }
  }

  public dismissNotification(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.status = 'dismissed';
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export types and service
export default notificationService;
export type { NotificationPreferences, WellnessNotification };
