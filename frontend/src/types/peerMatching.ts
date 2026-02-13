// Real-time Peer Matching System Types

export interface PeerUser {
  id: string;
  anonymousId: string; // For anonymous matching
  displayName: string; // Anonymous display name like "Student_123"
  isOnline: boolean;
  lastActive: string;
  year: StudentYear;
  major?: string;
  institution: string;
  mentalHealthConcerns: MentalHealthConcern[];
  interests: string[];
  availableHours: AvailableHours;
  timeZone: string;
  preferences: PeerPreferences;
  profileComplete: boolean;
  verificationStatus: 'pending' | 'verified' | 'unverified';
  createdAt: string;
}

export type StudentYear = 'junior' | 'senior' | 'graduate' | 'passout' | 'other';

export type MentalHealthConcern =
  | 'anxiety'
  | 'depression'
  | 'stress'
  | 'academic-pressure'
  | 'social-anxiety'
  | 'loneliness'
  | 'sleep-issues'
  | 'eating-concerns'
  | 'relationship-issues'
  | 'family-problems'
  | 'financial-stress'
  | 'perfectionism'
  | 'self-esteem'
  | 'burnout'
  | 'grief-loss'
  | 'substance-concerns'
  | 'identity-questions'
  | 'trauma-ptsd'
  | 'adjustment-issues';

export interface AvailableHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "12:00"
}

export interface PeerPreferences {
  genderPreference: 'any' | 'same' | 'different';
  ageRange: { min: number; max: number };
  communicationStyle: CommunicationStyle;
  meetingFrequency: MeetingFrequency;
  groupSizePreference: GroupSizePreference;
  anonymityLevel: AnonymityLevel;
  supportType: SupportType[];
}

export type CommunicationStyle =
  | 'text-only'
  | 'voice-calls'
  | 'video-calls'
  | 'in-person'
  | 'flexible';
export type MeetingFrequency =
  | 'daily'
  | 'few-times-week'
  | 'weekly'
  | 'bi-weekly'
  | 'monthly'
  | 'as-needed';
export type GroupSizePreference = 'one-on-one' | 'small-group' | 'large-group' | 'any';
export type AnonymityLevel =
  | 'fully-anonymous'
  | 'first-name-only'
  | 'partial-info'
  | 'open-profile';
export type SupportType =
  | 'emotional-support'
  | 'study-buddy'
  | 'accountability'
  | 'social-connection'
  | 'crisis-support';

// Peer Buddy System
export interface PeerBuddy {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: string;
  status: PeerBuddyStatus;
  compatibility: CompatibilityScore;
  sharedConcerns: MentalHealthConcern[];
  connectionType: 'peer-buddy' | 'study-partner' | 'support-buddy';
  lastInteraction: string;
  totalInteractions: number;
  averageResponseTime: number; // in minutes
  connectionStrength: number; // 0-100
  isActive: boolean;
  endedAt?: string;
  endReason?: string;
}

export type PeerBuddyStatus =
  | 'pending-acceptance'
  | 'active'
  | 'paused'
  | 'ended'
  | 'reported'
  | 'under-review';

export interface CompatibilityScore {
  overall: number; // 0-100
  concernsMatch: number;
  scheduleMatch: number;
  personalityMatch: number;
  communicationMatch: number;
  goalAlignment: number;
  breakdown: {
    sharedConcerns: number;
    availableHours: number;
    communicationStyle: number;
    yearLevel: number;
    institution: number;
    preferences: number;
  };
}

// Study Groups System
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  focus: StudyGroupFocus;
  mentalHealthTopics: MentalHealthConcern[];
  subjectAreas: string[];
  creatorId: string;
  memberIds: string[];
  maxMembers: number;
  currentMembers: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  status: StudyGroupStatus;
  createdAt: string;
  lastActivity: string;
  schedule: GroupSchedule;
  location: GroupLocation;
  rules: string[];
  tags: string[];
  successMetrics: GroupSuccessMetrics;
}

export type StudyGroupFocus =
  | 'mental-health-awareness'
  | 'stress-management'
  | 'academic-success'
  | 'mindfulness-meditation'
  | 'peer-support'
  | 'wellness-habits'
  | 'exam-preparation'
  | 'time-management'
  | 'social-skills'
  | 'self-care-practices'
  | 'crisis-prevention'
  | 'healthy-relationships'
  | 'emotional-regulation'
  | 'goal-setting'
  | 'resilience-building';

export type StudyGroupStatus = 'forming' | 'active' | 'paused' | 'completed' | 'disbanded';

export interface GroupSchedule {
  type: 'regular' | 'flexible' | 'one-time';
  regularSchedule?: {
    dayOfWeek: string;
    time: string;
    duration: number; // minutes
    timeZone: string;
  };
  flexibleTimes?: TimeSlot[];
  upcomingSessions: GroupSession[];
}

export interface GroupLocation {
  type: 'online' | 'in-person' | 'hybrid';
  details: string;
  platform?: string; // for online meetings
  address?: string; // for in-person meetings
}

export interface GroupSession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  attendeeIds: string[];
  facilitatorId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  materials: SessionMaterial[];
  feedback: SessionFeedback[];
  recordingUrl?: string;
  notes?: string;
}

export interface SessionMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'presentation';
  url: string;
  description?: string;
}

export interface SessionFeedback {
  userId: string;
  rating: number; // 1-5
  comment?: string;
  helpful: boolean;
  wouldRecommend: boolean;
  submittedAt: string;
}

export interface GroupSuccessMetrics {
  attendanceRate: number;
  memberRetention: number;
  averageRating: number;
  completionRate: number;
  memberSatisfaction: number;
  goalsAchieved: number;
}

// Mentor Matching System
export interface Mentor {
  id: string;
  userId: string;
  mentorProfile: MentorProfile;
  availability: MentorAvailability;
  specializations: MentorSpecialization[];
  experience: MentorExperience;
  menteeIds: string[];
  maxMentees: number;
  currentMentees: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  joinedAt: string;
  lastActive: string;
}

export interface MentorProfile {
  bio: string;
  year: StudentYear;
  major: string;
  achievements: string[];
  mentalHealthExperience: string;
  approachDescription: string;
  languagesSpoken: string[];
  personalityTraits: string[];
  successStories: number;
  responseTime: string; // "Usually responds within 2 hours"
}

export interface MentorAvailability {
  hoursPerWeek: number;
  preferredTimes: AvailableHours;
  responseTime: number; // in hours
  communicationMethods: CommunicationStyle[];
  sessionTypes: SessionType[];
}

export type SessionType =
  | 'one-time-advice'
  | 'ongoing-mentorship'
  | 'crisis-support'
  | 'academic-guidance'
  | 'career-advice'
  | 'peer-counseling'
  | 'study-strategies'
  | 'stress-management'
  | 'social-support';

export interface MentorSpecialization {
  area: MentalHealthConcern | 'academic-success' | 'leadership' | 'research' | 'career-prep';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  certifications: string[];
}

export interface MentorExperience {
  totalMentees: number;
  averageSessionDuration: number;
  successRate: number;
  totalHours: number;
  specialCases: number;
  testimonials: MentorTestimonial[];
}

export interface MentorTestimonial {
  id: string;
  menteeId: string; // anonymous
  rating: number;
  comment: string;
  helpfulnessScore: number;
  category: string;
  submittedAt: string;
  isVerified: boolean;
}

export interface MentorshipMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  matchedAt: string;
  compatibility: CompatibilityScore;
  goals: MentorshipGoal[];
  progress: MentorshipProgress;
  schedule: MentorshipSchedule;
  lastSession: string;
  nextSession?: string;
  totalSessions: number;
  isActive: boolean;
  endedAt?: string;
  endReason?: string;
  satisfaction: MentorshipSatisfaction;
}

export type MentorshipStatus =
  | 'pending-mentor-approval'
  | 'pending-mentee-approval'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'terminated'
  | 'under-review';

export interface MentorshipGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number; // 0-100
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface MentorshipProgress {
  overallProgress: number;
  goalsCompleted: number;
  totalGoals: number;
  sessionsCompleted: number;
  averageRating: number;
  keyAchievements: string[];
  challengesNoted: string[];
  nextSteps: string[];
}

export interface MentorshipSchedule {
  frequency: MeetingFrequency;
  preferredDuration: number;
  preferredTimes: TimeSlot[];
  timeZone: string;
  communicationMethod: CommunicationStyle;
  sessionFormat: 'structured' | 'flexible' | 'goal-oriented' | 'check-in';
}

export interface MentorshipSatisfaction {
  mentorRating: number;
  menteeRating: number;
  communicationQuality: number;
  goalProgress: number;
  overallExperience: number;
  wouldRecommend: boolean;
  feedback: string;
}

// Real-time Connection System
export interface RealTimeConnection {
  id: string;
  participants: string[]; // user IDs
  type: ConnectionType;
  status: ConnectionStatus;
  createdAt: string;
  lastActivity: string;
  metadata: ConnectionMetadata;
  messages: ConnectionMessage[];
  isEncrypted: boolean;
  connectionQuality: number; // 0-100
}

export type ConnectionType =
  | 'peer-buddy-chat'
  | 'study-group-session'
  | 'mentor-mentee-session'
  | 'group-video-call'
  | 'one-on-one-call'
  | 'emergency-support'
  | 'anonymous-chat';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'active'
  | 'idle'
  | 'reconnecting'
  | 'disconnected'
  | 'ended'
  | 'failed';

export interface ConnectionMetadata {
  sessionId?: string;
  groupId?: string;
  mentorshipId?: string;
  buddyPairId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  duration: number;
  participantStates: ParticipantState[];
  features: ConnectionFeature[];
}

export interface ParticipantState {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  isTyping: boolean;
  connectionQuality: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export type ConnectionFeature =
  | 'text-chat'
  | 'voice-call'
  | 'video-call'
  | 'screen-share'
  | 'file-sharing'
  | 'whiteboard'
  | 'recording'
  | 'end-to-end-encryption';

export interface ConnectionMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageType;
  isEncrypted: boolean;
  readBy: string[];
  reactions: MessageReaction[];
  replyTo?: string;
  attachments: MessageAttachment[];
}

export type MessageType =
  | 'text'
  | 'system'
  | 'file'
  | 'image'
  | 'voice'
  | 'video'
  | 'location'
  | 'poll'
  | 'emergency'
  | 'check-in';

export interface MessageReaction {
  emoji: string;
  userId: string;
  addedAt: string;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnail?: string;
}

// Matching Algorithm
export interface MatchingRequest {
  userId: string;
  type: 'peer-buddy' | 'study-group' | 'mentor' | 'emergency';
  preferences: MatchingPreferences;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'processing' | 'matched' | 'expired' | 'cancelled';
}

export interface MatchingPreferences {
  concernsWeight: number; // 0-1, importance of shared concerns
  scheduleWeight: number; // 0-1, importance of schedule overlap
  personalityWeight: number; // 0-1, importance of personality match
  experienceWeight: number; // 0-1, importance of experience level
  locationWeight: number; // 0-1, importance of location/timezone
  communicationWeight: number; // 0-1, importance of communication style
  minimumCompatibility: number; // 0-100, minimum required match score
  maxWaitTime: number; // minutes to wait for a match
  allowPartialMatches: boolean;
}

export interface MatchResult {
  requestId: string;
  matches: PotentialMatch[];
  algorithm: MatchingAlgorithm;
  processingTime: number;
  confidence: number;
  timestamp: string;
}

export interface PotentialMatch {
  targetId: string; // peer, group, or mentor ID
  compatibility: CompatibilityScore;
  rank: number;
  reasons: string[];
  warnings: string[];
  estimatedWaitTime?: number;
  availableSlots?: TimeSlot[];
}

export interface MatchingAlgorithm {
  name: string;
  version: string;
  parameters: Record<string, any>;
  weights: Record<string, number>;
}

// Safety and Moderation
export interface SafetyReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  connectionId?: string;
  type: SafetyReportType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: ReportEvidence[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  moderatorId?: string;
  actions: ModerationAction[];
}

export type SafetyReportType =
  | 'inappropriate-behavior'
  | 'harassment'
  | 'spam'
  | 'false-information'
  | 'safety-concern'
  | 'crisis-situation'
  | 'technical-issue'
  | 'privacy-violation';

export interface ReportEvidence {
  type: 'screenshot' | 'message-log' | 'recording' | 'description';
  content: string;
  timestamp: string;
}

export interface ModerationAction {
  type: 'warning' | 'temporary-ban' | 'permanent-ban' | 'connection-end' | 'profile-review';
  reason: string;
  duration?: number; // for temporary actions
  effectiveAt: string;
  expiresAt?: string;
}

// Analytics and Insights
export interface PeerMatchingAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  stats: PeerMatchingStats;
  insights: PeerMatchingInsight[];
  recommendations: PeerMatchingRecommendation[];
  trends: PeerMatchingTrend[];
  lastUpdated: string;
}

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all-time';

export interface PeerMatchingStats {
  totalConnections: number;
  activeConnections: number;
  averageSessionDuration: number;
  successfulMatches: number;
  matchingAccuracy: number;
  responseRate: number;
  satisfactionScore: number;
  helpGiven: number;
  helpReceived: number;
  streakDays: number;
  milestones: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface PeerMatchingInsight {
  type: 'pattern' | 'improvement' | 'warning' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: string;
}

export interface PeerMatchingRecommendation {
  type: 'connection' | 'schedule' | 'profile' | 'goal' | 'activity';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number;
  timeToImplement: string;
}

export interface PeerMatchingTrend {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  change: number;
  period: string;
  significance: 'low' | 'medium' | 'high';
}

// Utility Functions
export const MENTAL_HEALTH_CONCERNS: {
  [K in MentalHealthConcern]: { label: string; color: string; icon: string };
} = {
  anxiety: { label: 'Anxiety', color: '#3B82F6', icon: '😰' },
  depression: { label: 'Depression', color: '#6366F1', icon: '😔' },
  stress: { label: 'Stress', color: '#EF4444', icon: '😫' },
  'academic-pressure': { label: 'Academic Pressure', color: '#F59E0B', icon: '📚' },
  'social-anxiety': { label: 'Social Anxiety', color: '#8B5CF6', icon: '😳' },
  loneliness: { label: 'Loneliness', color: '#6B7280', icon: '😞' },
  'sleep-issues': { label: 'Sleep Issues', color: '#1F2937', icon: '😴' },
  'eating-concerns': { label: 'Eating Concerns', color: '#EC4899', icon: '🍽️' },
  'relationship-issues': { label: 'Relationship Issues', color: '#F97316', icon: '💔' },
  'family-problems': { label: 'Family Problems', color: '#84CC16', icon: '👨‍👩‍👧‍👦' },
  'financial-stress': { label: 'Financial Stress', color: '#10B981', icon: '💰' },
  perfectionism: { label: 'Perfectionism', color: '#06B6D4', icon: '⭐' },
  'self-esteem': { label: 'Self-Esteem', color: '#8B5CF6', icon: '🪞' },
  burnout: { label: 'Burnout', color: '#DC2626', icon: '🔥' },
  'grief-loss': { label: 'Grief & Loss', color: '#374151', icon: '😢' },
  'substance-concerns': { label: 'Substance Concerns', color: '#7C2D12', icon: '🚫' },
  'identity-questions': { label: 'Identity Questions', color: '#BE185D', icon: '🤔' },
  'trauma-ptsd': { label: 'Trauma/PTSD', color: '#991B1B', icon: '⚡' },
  'adjustment-issues': { label: 'Adjustment Issues', color: '#059669', icon: '🔄' },
};

export const STUDY_GROUP_FOCUSES: {
  [K in StudyGroupFocus]: { label: string; description: string; icon: string };
} = {
  'mental-health-awareness': {
    label: 'Mental Health Awareness',
    description: 'Learning about mental health topics',
    icon: '🧠',
  },
  'stress-management': {
    label: 'Stress Management',
    description: 'Techniques for managing academic and personal stress',
    icon: '🧘',
  },
  'academic-success': {
    label: 'Academic Success',
    description: 'Strategies for academic achievement',
    icon: '🎓',
  },
  'mindfulness-meditation': {
    label: 'Mindfulness & Meditation',
    description: 'Practicing mindfulness and meditation together',
    icon: '🧘‍♀️',
  },
  'peer-support': {
    label: 'Peer Support',
    description: 'Mutual support and encouragement',
    icon: '🤝',
  },
  'wellness-habits': {
    label: 'Wellness Habits',
    description: 'Building healthy lifestyle habits',
    icon: '💪',
  },
  'exam-preparation': {
    label: 'Exam Preparation',
    description: 'Collaborative exam study and preparation',
    icon: '📝',
  },
  'time-management': {
    label: 'Time Management',
    description: 'Learning effective time management skills',
    icon: '⏰',
  },
  'social-skills': {
    label: 'Social Skills',
    description: 'Developing interpersonal and social skills',
    icon: '👥',
  },
  'self-care-practices': {
    label: 'Self-Care Practices',
    description: 'Learning and practicing self-care',
    icon: '🌸',
  },
  'crisis-prevention': {
    label: 'Crisis Prevention',
    description: 'Building resilience and prevention strategies',
    icon: '🛡️',
  },
  'healthy-relationships': {
    label: 'Healthy Relationships',
    description: 'Building and maintaining healthy relationships',
    icon: '💝',
  },
  'emotional-regulation': {
    label: 'Emotional Regulation',
    description: 'Managing emotions effectively',
    icon: '❤️',
  },
  'goal-setting': {
    label: 'Goal Setting',
    description: 'Setting and achieving personal goals',
    icon: '🎯',
  },
  'resilience-building': {
    label: 'Resilience Building',
    description: 'Developing mental resilience',
    icon: '💎',
  },
};

export const calculateCompatibilityScore = (
  user1: PeerUser,
  user2: PeerUser
): CompatibilityScore => {
  // Simplified compatibility calculation
  const sharedConcerns = user1.mentalHealthConcerns.filter((concern) =>
    user2.mentalHealthConcerns.includes(concern)
  ).length;
  const maxConcerns = Math.max(
    user1.mentalHealthConcerns.length,
    user2.mentalHealthConcerns.length
  );
  const concernsMatch = maxConcerns > 0 ? (sharedConcerns / maxConcerns) * 100 : 0;

  // Calculate schedule overlap (simplified)
  const scheduleMatch = 75; // Would be calculated based on actual schedule overlap

  // Other compatibility factors
  const personalityMatch = 80; // Would be based on personality assessment
  const communicationMatch = 85; // Based on communication preferences
  const goalAlignment = 70; // Based on stated goals and preferences

  const overall =
    concernsMatch * 0.3 +
    scheduleMatch * 0.2 +
    personalityMatch * 0.2 +
    communicationMatch * 0.15 +
    goalAlignment * 0.15;

  return {
    overall: Math.round(overall),
    concernsMatch: Math.round(concernsMatch),
    scheduleMatch: Math.round(scheduleMatch),
    personalityMatch: Math.round(personalityMatch),
    communicationMatch: Math.round(communicationMatch),
    goalAlignment: Math.round(goalAlignment),
    breakdown: {
      sharedConcerns: sharedConcerns,
      availableHours: 15, // Hours of overlap per week
      communicationStyle:
        user1.preferences.communicationStyle === user2.preferences.communicationStyle ? 100 : 60,
      yearLevel: Math.abs(getYearNumber(user1.year) - getYearNumber(user2.year)) <= 1 ? 100 : 70,
      institution: user1.institution === user2.institution ? 100 : 0,
      preferences: 80, // Based on other preference alignments
    },
  };
};

const getYearNumber = (year: StudentYear): number => {
  const yearMap = { junior: 3, senior: 4, graduate: 5, passout: 6, other: 0 };
  return yearMap[year];
};

export const formatTimeSlot = (slot: TimeSlot): string => {
  return `${slot.start} - ${slot.end}`;
};

export const formatMeetingFrequency = (frequency: MeetingFrequency): string => {
  const frequencyMap = {
    daily: 'Daily',
    'few-times-week': 'Few times a week',
    weekly: 'Weekly',
    'bi-weekly': 'Bi-weekly',
    monthly: 'Monthly',
    'as-needed': 'As needed',
  };
  return frequencyMap[frequency];
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: '#F59E0B',
    active: '#10B981',
    paused: '#6B7280',
    completed: '#3B82F6',
    ended: '#EF4444',
    online: '#10B981',
    offline: '#6B7280',
    away: '#F59E0B',
    busy: '#EF4444',
  };
  return statusColors[status] || '#6B7280';
};

export const generateAnonymousDisplayName = (): string => {
  const adjectives = [
    'Helpful',
    'Kind',
    'Supportive',
    'Caring',
    'Understanding',
    'Friendly',
    'Wise',
    'Calm',
  ];
  const animals = ['Owl', 'Butterfly', 'Dolphin', 'Elephant', 'Turtle', 'Rabbit', 'Bear', 'Fox'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${randomAdjective}${randomAnimal}${randomNumber}`;
};
