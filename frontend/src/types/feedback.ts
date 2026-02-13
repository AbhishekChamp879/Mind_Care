// Session Feedback System Types and Interfaces

export interface SessionFeedback {
  id: string;
  sessionId: string;
  studentId: string;
  counselorId: string;
  sessionDate: string;
  submittedAt: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
  categoryRatings: CategoryRatings;
  quickFeedback: QuickFeedback;
  detailedFeedback?: DetailedFeedback;
  anonymous: boolean;
  isPublic: boolean;
}

export interface CategoryRatings {
  helpfulness: 1 | 2 | 3 | 4 | 5;
  communication: 1 | 2 | 3 | 4 | 5;
  professionalism: 1 | 2 | 3 | 4 | 5;
  environment: 1 | 2 | 3 | 4 | 5;
  satisfaction: 1 | 2 | 3 | 4 | 5;
}

export interface QuickFeedback {
  wouldRecommend: boolean;
  feelHeard: boolean;
  goalsMet: boolean;
  safeEnvironment: boolean;
  appropriateLength: boolean;
}

export interface DetailedFeedback {
  whatWorkedWell?: string;
  whatCouldImprove?: string;
  additionalComments?: string;
  specificConcerns?: string;
  suggestions?: string;
  followUpNeeded?: boolean;
  followUpReason?: string;
}

export interface FeedbackQuestion {
  id: string;
  type: 'rating' | 'boolean' | 'text' | 'multiple-choice' | 'scale';
  category: FeedbackCategory;
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  maxLength?: number;
}

export type FeedbackCategory =
  | 'overall-experience'
  | 'counselor-performance'
  | 'session-environment'
  | 'personal-outcomes'
  | 'system-feedback'
  | 'improvement-suggestions';

export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  sessionType: SessionType;
  questions: FeedbackQuestion[];
  isActive: boolean;
}

export type SessionType =
  | 'individual-counseling'
  | 'group-therapy'
  | 'crisis-intervention'
  | 'assessment'
  | 'follow-up'
  | 'peer-support';

export interface FeedbackAnalytics {
  averageRating: number;
  totalFeedbacks: number;
  categoryAverages: CategoryRatings;
  responseRate: number;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  commonThemes: string[];
  improvementAreas: string[];
  recommendations: string[];
}

export interface FeedbackDashboardData {
  counselorId: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  analytics: FeedbackAnalytics;
  recentFeedbacks: SessionFeedback[];
  trends: {
    date: string;
    rating: number;
    count: number;
  }[];
  benchmarks: {
    department: number;
    institution: number;
    national?: number;
  };
}

// Predefined feedback questions
export const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  // Overall Experience
  {
    id: 'overall-rating',
    type: 'rating',
    category: 'overall-experience',
    question: 'How would you rate your overall experience with this session?',
    required: true,
  },
  {
    id: 'recommend',
    type: 'boolean',
    category: 'overall-experience',
    question: 'Would you recommend this counselor to other students?',
    required: true,
  },
  {
    id: 'satisfaction',
    type: 'scale',
    category: 'overall-experience',
    question: 'How satisfied are you with the session outcomes?',
    required: true,
  },

  // Counselor Performance
  {
    id: 'counselor-helpfulness',
    type: 'rating',
    category: 'counselor-performance',
    question: 'How helpful was your counselor during this session?',
    required: true,
  },
  {
    id: 'counselor-communication',
    type: 'rating',
    category: 'counselor-performance',
    question: "How clear and effective was the counselor's communication?",
    required: true,
  },
  {
    id: 'felt-heard',
    type: 'boolean',
    category: 'counselor-performance',
    question: 'Did you feel heard and understood by your counselor?',
    required: true,
  },
  {
    id: 'professional-manner',
    type: 'rating',
    category: 'counselor-performance',
    question: "How would you rate the counselor's professionalism?",
    required: true,
  },

  // Session Environment
  {
    id: 'safe-environment',
    type: 'boolean',
    category: 'session-environment',
    question: 'Did you feel safe and comfortable during the session?',
    required: true,
  },
  {
    id: 'environment-rating',
    type: 'rating',
    category: 'session-environment',
    question: 'How would you rate the session environment (privacy, comfort, etc.)?',
    required: false,
  },
  {
    id: 'session-length',
    type: 'multiple-choice',
    category: 'session-environment',
    question: 'How was the session length?',
    required: false,
    options: ['Too short', 'Just right', 'Too long'],
  },

  // Personal Outcomes
  {
    id: 'goals-met',
    type: 'boolean',
    category: 'personal-outcomes',
    question: 'Were your goals for this session met?',
    required: true,
  },
  {
    id: 'coping-strategies',
    type: 'boolean',
    category: 'personal-outcomes',
    question: 'Did you learn new coping strategies or techniques?',
    required: false,
  },
  {
    id: 'progress-feeling',
    type: 'scale',
    category: 'personal-outcomes',
    question: 'How much progress do you feel you made today?',
    required: false,
  },

  // Open-ended questions
  {
    id: 'what-worked-well',
    type: 'text',
    category: 'improvement-suggestions',
    question: 'What worked well in this session?',
    required: false,
    placeholder: 'Share what you found most helpful...',
    maxLength: 500,
  },
  {
    id: 'what-could-improve',
    type: 'text',
    category: 'improvement-suggestions',
    question: 'What could be improved for future sessions?',
    required: false,
    placeholder: 'Share any suggestions for improvement...',
    maxLength: 500,
  },
  {
    id: 'additional-comments',
    type: 'text',
    category: 'improvement-suggestions',
    question: 'Any additional comments or feedback?',
    required: false,
    placeholder: 'Share any other thoughts or concerns...',
    maxLength: 1000,
  },
];

// Feedback templates for different session types
export const FEEDBACK_TEMPLATES: FeedbackTemplate[] = [
  {
    id: 'individual-counseling-template',
    name: 'Individual Counseling Session',
    description: 'Standard feedback form for one-on-one counseling sessions',
    sessionType: 'individual-counseling',
    questions: FEEDBACK_QUESTIONS,
    isActive: true,
  },
  {
    id: 'group-therapy-template',
    name: 'Group Therapy Session',
    description: 'Feedback form for group therapy sessions',
    sessionType: 'group-therapy',
    questions: FEEDBACK_QUESTIONS.filter(
      (q) => !['counselor-communication', 'counselor-helpfulness'].includes(q.id)
    ).concat([
      {
        id: 'group-dynamics',
        type: 'rating',
        category: 'session-environment',
        question: 'How comfortable did you feel sharing in the group setting?',
        required: true,
      },
      {
        id: 'group-benefit',
        type: 'boolean',
        category: 'personal-outcomes',
        question: "Did you benefit from hearing others' experiences?",
        required: true,
      },
    ]),
    isActive: true,
  },
  {
    id: 'crisis-intervention-template',
    name: 'Crisis Intervention Session',
    description: 'Specialized feedback for crisis intervention sessions',
    sessionType: 'crisis-intervention',
    questions: [
      {
        id: 'immediate-support',
        type: 'rating',
        category: 'counselor-performance',
        question: 'How well did the counselor provide immediate support?',
        required: true,
      },
      {
        id: 'safety-assessment',
        type: 'boolean',
        category: 'session-environment',
        question: 'Did you feel your safety was properly assessed?',
        required: true,
      },
      {
        id: 'crisis-resolution',
        type: 'scale',
        category: 'personal-outcomes',
        question: 'How much did this session help with your immediate crisis?',
        required: true,
      },
    ],
    isActive: true,
  },
];

// Utility functions
export const calculateOverallRating = (categoryRatings: CategoryRatings): number => {
  const ratings = Object.values(categoryRatings);
  return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
};

export const getFeedbackTemplate = (sessionType: SessionType): FeedbackTemplate | undefined => {
  return FEEDBACK_TEMPLATES.find(
    (template) => template.sessionType === sessionType && template.isActive
  );
};

export const categorizeRating = (
  rating: number
): 'excellent' | 'good' | 'average' | 'poor' | 'very-poor' => {
  if (rating >= 4.5) return 'excellent';
  if (rating >= 3.5) return 'good';
  if (rating >= 2.5) return 'average';
  if (rating >= 1.5) return 'poor';
  return 'very-poor';
};

export const getRatingColor = (rating: number): string => {
  const category = categorizeRating(rating);
  switch (category) {
    case 'excellent':
      return 'text-green-600 bg-green-50';
    case 'good':
      return 'text-blue-600 bg-blue-50';
    case 'average':
      return 'text-yellow-600 bg-yellow-50';
    case 'poor':
      return 'text-orange-600 bg-orange-50';
    case 'very-poor':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getRatingEmoji = (rating: number): string => {
  const category = categorizeRating(rating);
  switch (category) {
    case 'excellent':
      return '🌟';
    case 'good':
      return '😊';
    case 'average':
      return '😐';
    case 'poor':
      return '😕';
    case 'very-poor':
      return '😢';
    default:
      return '❓';
  }
};
