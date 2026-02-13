export interface NotificationPreferences {
  moodReminders: {
    enabled: boolean;
    frequency: 'daily' | 'twice-daily' | 'weekly' | 'custom';
    time: string; // HH:MM format
    customDays?: string[]; // For custom frequency
  };
  breathingReminders: {
    enabled: boolean;
    frequency: 'daily' | 'multiple' | 'custom';
    times: string[]; // Multiple times for breathing exercises
    duration: number; // Duration in minutes
  };
  sessionReminders: {
    enabled: boolean;
    beforeSession: number; // Minutes before session
    followUp: boolean; // Post-session follow-up
    rescheduleReminder: boolean;
  };
  wellnessQuotes: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
  };
  general: {
    sound: boolean;
    vibration: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

export interface WellnessNotification {
  id: string;
  type: 'mood-reminder' | 'breathing-exercise' | 'session-reminder' | 'wellness-quote' | 'custom';
  title: string;
  message: string;
  scheduledTime: Date;
  isRecurring: boolean;
  data?: {
    sessionId?: string;
    exerciseType?: string;
    quoteId?: string;
    actionUrl?: string;
  };
  status: 'pending' | 'sent' | 'dismissed' | 'acted-upon';
  createdAt: Date;
}

export interface NotificationTemplate {
  type: WellnessNotification['type'];
  title: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    url: string;
  };
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate[]> = {
  'mood-reminder': [
    {
      type: 'mood-reminder',
      title: '🌟 How are you feeling today?',
      message: 'Take a moment to check in with yourself and log your mood.',
      icon: '😊',
      action: { label: 'Log Mood', url: '/app/dashboard' },
    },
    {
      type: 'mood-reminder',
      title: '💭 Daily Mood Check',
      message: 'Your mental wellness journey matters. How are you doing right now?',
      icon: '🧠',
      action: { label: 'Track Mood', url: '/app/dashboard' },
    },
    {
      type: 'mood-reminder',
      title: '🌈 Mood Reflection Time',
      message: 'A few seconds to reflect on your feelings can make a big difference.',
      icon: '🌈',
      action: { label: 'Check In', url: '/app/dashboard' },
    },
  ],
  'breathing-exercise': [
    {
      type: 'breathing-exercise',
      title: '🌬️ Take a Deep Breath',
      message: 'Ready for a quick 3-minute breathing exercise to reset your day?',
      icon: '🫁',
      action: { label: 'Start Exercise', url: '/app/breathing' },
    },
    {
      type: 'breathing-exercise',
      title: '🧘‍♀️ Mindful Moment',
      message: 'Pause, breathe, and reconnect with yourself. Your mind will thank you.',
      icon: '🧘‍♀️',
      action: { label: 'Begin', url: '/app/breathing' },
    },
    {
      type: 'breathing-exercise',
      title: '💨 Stress Relief Break',
      message: 'Feeling overwhelmed? A breathing exercise can help you find your calm.',
      icon: '🌱',
      action: { label: 'Breathe', url: '/app/breathing' },
    },
  ],
  'session-reminder': [
    {
      type: 'session-reminder',
      title: '📅 Upcoming Session',
      message: 'Your counseling session is coming up. Take a moment to prepare.',
      icon: '🗓️',
      action: { label: 'View Details', url: '/app/sessions' },
    },
    {
      type: 'session-reminder',
      title: '👨‍⚕️ Session Starting Soon',
      message: 'Your session with your counselor begins in a few minutes.',
      icon: '💬',
      action: { label: 'Join Now', url: '/app/sessions' },
    },
  ],
  'wellness-quote': [
    {
      type: 'wellness-quote',
      title: '✨ Daily Inspiration',
      message: "Here's a thought to brighten your day and support your wellness journey.",
      icon: '💫',
      action: { label: 'Read More', url: '/app/resources' },
    },
  ],
};

export const WELLNESS_QUOTES = [
  'Every small step forward is progress worth celebrating. 🌟',
  'Your mental health is just as important as your physical health. 💙',
  "It's okay to not be okay. What matters is that you're taking care of yourself. 🤗",
  "Breathe in peace, breathe out stress. You've got this! 🌬️",
  "Self-care isn't selfish - it's essential. 🌸",
  'Progress, not perfection. Every day is a new chance to grow. 🌱',
  'You are stronger than you think and braver than you believe. 💪',
  'Mental health awareness is the first step toward wellness. 🧠',
  "Take time to listen to your mind and body. They're telling you something important. 👂",
  'Your journey is unique, and so is your healing. Trust the process. ✨',
];
