import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  Star,
  Clock,
  MessageCircle,
  User,
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Brain,
  CheckCircle,
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  Settings,
  Quote,
  BookOpen,
  Lightbulb,
  Shield,
  Zap,
  ChevronRight,
  MapPin,
  Globe,
} from 'lucide-react';
import { getCreationDate, getRecentActivityDate, getJoinDate, getScheduledDate, getRelativeDate } from '../../utils/dateUtils';

import {
  Mentor,
  MentorProfile,
  MentorshipMatch,
  MentorshipStatus,
  MentorshipGoal,
  PeerUser,
  StudentYear,
  SessionType,
  MentalHealthConcern,
  CommunicationStyle,
  MeetingFrequency,
  CompatibilityScore,
  MENTAL_HEALTH_CONCERNS,
  formatMeetingFrequency,
  getStatusColor,
  generateAnonymousDisplayName,
} from '@/types/peerMatching';

interface MentorMatchingSystemProps {
  currentUser?: PeerUser;
  onMentorMatch?: (matchId: string) => void;
  onBecomeMentor?: (mentorProfile: MentorProfile) => void;
  onSessionRequest?: (mentorId: string, sessionType: SessionType) => void;
  className?: string;
}

export const MentorMatchingSystem: React.FC<MentorMatchingSystemProps> = ({
  currentUser,
  onMentorMatch,
  onBecomeMentor,
  onSessionRequest,
  className = '',
}) => {
  // Component state
  const [activeTab, setActiveTab] = useState<string>('find-mentor');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [myMentorships, setMyMentorships] = useState<MentorshipMatch[]>([]);
  const [isMentor, setIsMentor] = useState(false);
  const [mentorApplications, setMentorApplications] = useState<string[]>([]);

  // Become mentor form state
  const [mentorApplication, setMentorApplication] = useState({
    bio: '',
    achievements: [] as string[],
    mentalHealthExperience: '',
    approachDescription: '',
    specializations: [] as string[],
    hoursPerWeek: 5,
    maxMentees: 3,
    sessionTypes: [] as SessionType[],
    communicationMethods: [] as CommunicationStyle[],
    languagesSpoken: ['English'],
  });

  // Mock mentor data
  const mockMentors: Mentor[] = [
    {
      id: 'mentor_001',
      userId: 'user_senior_001',
      mentorProfile: {
        bio: "Senior Psychology student with 3 years of peer counseling experience. I've overcome anxiety and academic pressure through mindfulness and structured study approaches.",
        year: 'senior',
        major: 'Psychology',
        achievements: [
          "Dean's List for 6 semesters",
          'Peer Counseling Certification',
          'Mental Health First Aid Certified',
          'Led 15+ support groups',
        ],
        mentalHealthExperience:
          'Specialized in anxiety, depression, and academic stress. Personally experienced and overcame severe test anxiety through CBT techniques.',
        approachDescription:
          "I believe in a collaborative, strengths-based approach. We'll work together to identify your unique challenges and build personalized coping strategies.",
        languagesSpoken: ['English', 'Spanish'],
        personalityTraits: ['Empathetic', 'Patient', 'Solution-focused', 'Non-judgmental'],
        successStories: 12,
        responseTime: 'Usually responds within 2 hours',
      },
      availability: {
        hoursPerWeek: 8,
        preferredTimes: {
          monday: [{ start: '18:00', end: '20:00' }],
          tuesday: [{ start: '16:00', end: '18:00' }],
          wednesday: [{ start: '18:00', end: '20:00' }],
          thursday: [{ start: '16:00', end: '18:00' }],
          friday: [],
          saturday: [{ start: '10:00', end: '12:00' }],
          sunday: [{ start: '14:00', end: '16:00' }],
        },
        responseTime: 2,
        communicationMethods: ['text-only', 'voice-calls', 'video-calls'],
        sessionTypes: [
          'ongoing-mentorship',
          'academic-guidance',
          'stress-management',
          'peer-counseling',
        ],
      },
      specializations: [
        {
          area: 'anxiety',
          proficiencyLevel: 'expert',
          yearsOfExperience: 3,
          certifications: ['Peer Counseling Certificate', 'Anxiety Management Training'],
        },
        {
          area: 'academic-pressure',
          proficiencyLevel: 'advanced',
          yearsOfExperience: 4,
          certifications: ['Academic Success Coaching'],
        },
        {
          area: 'stress',
          proficiencyLevel: 'advanced',
          yearsOfExperience: 3,
          certifications: ['Stress Management Certification'],
        },
      ],
      experience: {
        totalMentees: 15,
        averageSessionDuration: 45,
        successRate: 87,
        totalHours: 120,
        specialCases: 3,
        testimonials: [
          {
            id: 'test_001',
            menteeId: 'anonymous_001',
            rating: 5,
            comment:
              'Sarah helped me develop incredible coping strategies for my anxiety. I went from panic attacks during exams to feeling confident and prepared.',
            helpfulnessScore: 95,
            category: 'anxiety-support',
            submittedAt: getRelativeDate(-20),
            isVerified: true,
          },
          {
            id: 'test_002',
            menteeId: 'anonymous_002',
            rating: 5,
            comment:
              'The study strategies and time management techniques I learned completely transformed my academic performance.',
            helpfulnessScore: 90,
            category: 'academic-guidance',
            submittedAt: getRelativeDate(-25),
            isVerified: true,
          },
        ],
      },
      menteeIds: ['user_123', 'user_456'],
      maxMentees: 4,
      currentMentees: 2,
      rating: 4.8,
      reviewCount: 15,
      isActive: true,
      isVerified: true,
      joinedAt: getJoinDate(),
      lastActive: new Date().toISOString(),
    },
    {
      id: 'mentor_002',
      userId: 'user_grad_002',
      mentorProfile: {
        bio: 'Graduate student in Clinical Psychology with research focus on student mental health. Passionate about helping undergraduates navigate the challenges of college life.',
        year: 'graduate',
        major: 'Clinical Psychology',
        achievements: [
          'Graduate Research Assistant',
          'Published 3 papers on student wellness',
          'Crisis Intervention Training',
          'Group Therapy Facilitator',
        ],
        mentalHealthExperience:
          'Research and clinical experience in depression, adjustment disorders, and relationship issues. Strong background in evidence-based interventions.',
        approachDescription:
          'I integrate research-backed strategies with compassionate support. My goal is to help you develop resilience and self-advocacy skills.',
        languagesSpoken: ['English', 'French'],
        personalityTraits: ['Analytical', 'Supportive', 'Research-oriented', 'Culturally-aware'],
        successStories: 8,
        responseTime: 'Usually responds within 4 hours',
      },
      availability: {
        hoursPerWeek: 6,
        preferredTimes: {
          monday: [{ start: '19:00', end: '21:00' }],
          tuesday: [],
          wednesday: [{ start: '19:00', end: '21:00' }],
          thursday: [{ start: '17:00', end: '19:00' }],
          friday: [{ start: '15:00', end: '17:00' }],
          saturday: [],
          sunday: [{ start: '13:00', end: '15:00' }],
        },
        responseTime: 4,
        communicationMethods: ['text-only', 'video-calls'],
        sessionTypes: [
          'ongoing-mentorship',
          'crisis-support',
          'academic-guidance',
          'career-advice',
        ],
      },
      specializations: [
        {
          area: 'depression',
          proficiencyLevel: 'expert',
          yearsOfExperience: 2,
          certifications: ['Clinical Training', 'CBT Foundations'],
        },
        {
          area: 'adjustment-issues',
          proficiencyLevel: 'advanced',
          yearsOfExperience: 2,
          certifications: ['Transition Counseling'],
        },
      ],
      experience: {
        totalMentees: 8,
        averageSessionDuration: 50,
        successRate: 92,
        totalHours: 80,
        specialCases: 2,
        testimonials: [
          {
            id: 'test_003',
            menteeId: 'anonymous_003',
            rating: 5,
            comment:
              'Alex provided incredible support during my transition to college. Their evidence-based approach really helped.',
            helpfulnessScore: 88,
            category: 'adjustment-support',
            submittedAt: getRelativeDate(-23),
            isVerified: true,
          },
        ],
      },
      menteeIds: ['user_789'],
      maxMentees: 3,
      currentMentees: 1,
      rating: 4.9,
      reviewCount: 8,
      isActive: true,
      isVerified: true,
      joinedAt: getRelativeDate(-350),
      lastActive: new Date().toISOString(),
    },
    {
      id: 'mentor_003',
      userId: 'user_senior_003',
      mentorProfile: {
        bio: 'Senior Engineering student who overcame perfectionism and burnout. Now helping others find balance between academic excellence and mental wellness.',
        year: 'senior',
        major: 'Computer Engineering',
        achievements: [
          'Valedictorian Track',
          'Burnout Recovery Program Graduate',
          'Peer Mentor Training',
          'Work-Life Balance Workshop Leader',
        ],
        mentalHealthExperience:
          'Personal experience with perfectionism, burnout, and imposter syndrome. Developed effective strategies for high-achieving students.',
        approachDescription:
          "I help high-achievers find sustainable success. We'll work on setting realistic goals and developing healthy perfectionism.",
        languagesSpoken: ['English', 'Mandarin'],
        personalityTraits: ['Achievement-oriented', 'Balanced', 'Practical', 'Goal-focused'],
        successStories: 6,
        responseTime: 'Usually responds within 6 hours',
      },
      availability: {
        hoursPerWeek: 4,
        preferredTimes: {
          monday: [],
          tuesday: [{ start: '20:00', end: '22:00' }],
          wednesday: [],
          thursday: [{ start: '20:00', end: '22:00' }],
          friday: [],
          saturday: [{ start: '16:00', end: '18:00' }],
          sunday: [],
        },
        responseTime: 6,
        communicationMethods: ['text-only', 'voice-calls'],
        sessionTypes: ['ongoing-mentorship', 'stress-management', 'academic-guidance'],
      },
      specializations: [
        {
          area: 'perfectionism',
          proficiencyLevel: 'expert',
          yearsOfExperience: 2,
          certifications: ['Perfectionism Workshop Certification'],
        },
        {
          area: 'burnout',
          proficiencyLevel: 'advanced',
          yearsOfExperience: 1,
          certifications: ['Burnout Recovery Training'],
        },
      ],
      experience: {
        totalMentees: 6,
        averageSessionDuration: 40,
        successRate: 85,
        totalHours: 45,
        specialCases: 1,
        testimonials: [
          {
            id: 'test_004',
            menteeId: 'anonymous_004',
            rating: 4,
            comment:
              "Jordan helped me realize that perfection isn't the goal - progress is. My stress levels decreased significantly.",
            helpfulnessScore: 85,
            category: 'perfectionism-support',
            submittedAt: getRelativeDate(-27),
            isVerified: true,
          },
        ],
      },
      menteeIds: [],
      maxMentees: 2,
      currentMentees: 0,
      rating: 4.5,
      reviewCount: 6,
      isActive: true,
      isVerified: true,
      joinedAt: getRelativeDate(-333),
      lastActive: new Date().toISOString(),
    },
  ];

  // Mock mentorship matches
  const mockMentorships: MentorshipMatch[] = [
    {
      id: 'mentorship_001',
      mentorId: 'mentor_001',
      menteeId: currentUser?.id || 'user_123',
      status: 'active',
      matchedAt: getRelativeDate(-20),
      compatibility: {
        overall: 88,
        concernsMatch: 85,
        scheduleMatch: 90,
        personalityMatch: 85,
        communicationMatch: 90,
        goalAlignment: 88,
        breakdown: {
          sharedConcerns: 2,
          availableHours: 6,
          communicationStyle: 90,
          yearLevel: 70,
          institution: 100,
          preferences: 85,
        },
      },
      goals: [
        {
          id: 'goal_001',
          title: 'Manage Test Anxiety',
          description: 'Develop coping strategies for exam stress and anxiety',
          category: 'Mental Health',
          targetDate: '2024-05-15',
          status: 'in-progress',
          progress: 65,
          milestones: [
            {
              id: 'ms_001',
              title: 'Learn breathing techniques',
              isCompleted: true,
              completedAt: getRelativeDate(-15),
            },
            {
              id: 'ms_002',
              title: 'Practice mindfulness before exams',
              isCompleted: true,
              completedAt: getRelativeDate(-10),
            },
            { id: 'ms_003', title: 'Develop pre-exam routine', isCompleted: false },
            { id: 'ms_004', title: 'Apply strategies during midterms', isCompleted: false },
          ],
        },
        {
          id: 'goal_002',
          title: 'Improve Study Efficiency',
          description: 'Develop better time management and study strategies',
          category: 'Academic',
          targetDate: '2024-04-30',
          status: 'in-progress',
          progress: 40,
          milestones: [
            {
              id: 'ms_005',
              title: 'Time audit and analysis',
              isCompleted: true,
              completedAt: getRelativeDate(-17),
            },
            { id: 'ms_006', title: 'Create study schedule', isCompleted: false },
            { id: 'ms_007', title: 'Implement Pomodoro technique', isCompleted: false },
          ],
        },
      ],
      progress: {
        overallProgress: 52,
        goalsCompleted: 0,
        totalGoals: 2,
        sessionsCompleted: 4,
        averageRating: 4.8,
        keyAchievements: [
          'Reduced pre-exam anxiety by 50%',
          'Improved study focus duration',
          'Developed personalized coping strategies',
        ],
        challengesNoted: [
          'Time management during busy periods',
          'Maintaining consistency with new habits',
        ],
        nextSteps: [
          'Practice new techniques during upcoming exams',
          'Refine study schedule based on workload',
          'Explore additional stress management tools',
        ],
      },
      schedule: {
        frequency: 'weekly',
        preferredDuration: 45,
        preferredTimes: [{ start: '18:00', end: '19:00' }],
        timeZone: 'America/New_York',
        communicationMethod: 'video-calls',
        sessionFormat: 'goal-oriented',
      },
      lastSession: getRelativeDate(-15, 18),
      nextSession: getRelativeDate(7, 18),
      totalSessions: 4,
      isActive: true,
      satisfaction: {
        mentorRating: 4.8,
        menteeRating: 4.6,
        communicationQuality: 4.9,
        goalProgress: 4.5,
        overallExperience: 4.8,
        wouldRecommend: true,
        feedback:
          "Sarah has been incredibly helpful and supportive. The strategies we've developed are already making a difference.",
      },
    },
  ];

  useEffect(() => {
    setAvailableMentors(mockMentors);
    setMyMentorships(mockMentorships);
  }, []);

  // Filter mentors based on search and specialization
  const filteredMentors = availableMentors.filter((mentor) => {
    const matchesSearch =
      mentor.mentorProfile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.mentorProfile.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specializations.some((spec) =>
        spec.area.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSpecialization =
      selectedSpecialization === 'all' ||
      mentor.specializations.some((spec) => spec.area === selectedSpecialization);

    return matchesSearch && matchesSpecialization && mentor.currentMentees < mentor.maxMentees;
  });

  const requestMentorship = (mentorId: string) => {
    onMentorMatch?.(mentorId);
    console.log('Requesting mentorship with mentor:', mentorId);
  };

  const requestSession = (mentorId: string, sessionType: SessionType) => {
    onSessionRequest?.(mentorId, sessionType);
    console.log('Requesting session:', { mentorId, sessionType });
  };

  const applyToBeMentor = () => {
    const mentorProfile: MentorProfile = {
      bio: mentorApplication.bio,
      year: currentUser?.year || 'senior',
      major: currentUser?.major || 'Psychology',
      achievements: mentorApplication.achievements,
      mentalHealthExperience: mentorApplication.mentalHealthExperience,
      approachDescription: mentorApplication.approachDescription,
      languagesSpoken: mentorApplication.languagesSpoken,
      personalityTraits: [],
      successStories: 0,
      responseTime: 'Usually responds within 24 hours',
    };

    onBecomeMentor?.(mentorProfile);
    setMentorApplications((prev) => [...prev, 'pending']);
    console.log('Mentor application submitted:', mentorProfile);
  };

  const getSpecializationIcon = (area: string) => {
    const icons: Record<string, string> = {
      anxiety: '😰',
      depression: '😔',
      stress: '😫',
      'academic-pressure': '📚',
      perfectionism: '⭐',
      burnout: '🔥',
      'self-esteem': '🪞',
      'adjustment-issues': '🔄',
    };
    return icons[area] || '🎯';
  };

  const renderMentorCard = (mentor: Mentor) => (
    <Card key={mentor.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`/avatars/mentor-${mentor.id}.jpg`} alt={`${mentor.mentorProfile.year} ${mentor.mentorProfile.major} student mentor profile picture`} />
            <AvatarFallback>
              {mentor.mentorProfile.bio
                .split(' ')
                .slice(0, 2)
                .map((word) => word[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Anonymous Mentor</CardTitle>
                <CardDescription>
                  {mentor.mentorProfile.year} • {mentor.mentorProfile.major}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-xs text-muted-foreground">({mentor.reviewCount})</span>
                </div>
                <Badge variant="outline" className="mt-1">
                  {mentor.currentMentees}/{mentor.maxMentees} mentees
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{mentor.mentorProfile.bio}</p>

        {/* Specializations */}
        <div>
          <Label className="text-xs font-medium">Specializations</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {mentor.specializations.map((spec) => (
              <Badge key={spec.area} variant="outline" className="text-xs">
                {getSpecializationIcon(spec.area)}{' '}
                {MENTAL_HEALTH_CONCERNS[spec.area as MentalHealthConcern]?.label || spec.area}
                <span className="ml-1 text-xs opacity-70">({spec.proficiencyLevel})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Metrics */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div>
            <p className="font-semibold text-blue-600">{mentor.experience.totalMentees}</p>
            <p className="text-muted-foreground">Mentees</p>
          </div>
          <div>
            <p className="font-semibold text-green-600">{mentor.experience.successRate}%</p>
            <p className="text-muted-foreground">Success</p>
          </div>
          <div>
            <p className="font-semibold text-purple-600">{mentor.experience.totalHours}h</p>
            <p className="text-muted-foreground">Experience</p>
          </div>
        </div>

        {/* Approach */}
        <div>
          <Label className="text-xs font-medium">Mentoring Approach</Label>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {mentor.mentorProfile.approachDescription}
          </p>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{mentor.availability.hoursPerWeek}h/week available</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{mentor.mentorProfile.responseTime}</span>
          </div>
        </div>

        {/* Recent Testimonial */}
        {mentor.experience.testimonials.length > 0 && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Quote className="h-3 w-3 text-muted-foreground" />
              <Label className="text-xs font-medium">Recent Feedback</Label>
              <div className="flex items-center space-x-1">
                {[...Array(mentor.experience.testimonials[0].rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              "{mentor.experience.testimonials[0].comment}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            onClick={() => requestMentorship(mentor.id)}
            className="flex-1"
            disabled={mentor.currentMentees >= mentor.maxMentees}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Request Mentorship
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => requestSession(mentor.id, 'one-time-advice')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Quick Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMentorshipCard = (mentorship: MentorshipMatch) => {
    const mentor = availableMentors.find((m) => m.id === mentorship.mentorId);
    if (!mentor) return null;

    return (
      <Card key={mentorship.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {mentor.mentorProfile.bio
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Mentorship with Anonymous Mentor</CardTitle>
                <CardDescription>
                  {mentor.mentorProfile.year} • {mentor.mentorProfile.major} • Since{' '}
                  {new Date(mentorship.matchedAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={mentorship.status === 'active' ? 'default' : 'secondary'}
              style={{ backgroundColor: getStatusColor(mentorship.status) }}
            >
              {mentorship.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Overall Progress</Label>
              <span className="text-sm font-medium">{mentorship.progress.overallProgress}%</span>
            </div>
            <Progress value={mentorship.progress.overallProgress} className="h-2" />
          </div>

          {/* Goals */}
          <div>
            <Label className="text-sm font-medium">Active Goals ({mentorship.goals.length})</Label>
            <div className="space-y-2 mt-2">
              {mentorship.goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-3">
                    <Target className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">{goal.progress}% complete</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {goal.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Sessions Completed</Label>
              <p className="font-semibold">{mentorship.progress.sessionsCompleted}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Average Rating</Label>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="font-semibold">{mentorship.progress.averageRating}</span>
              </div>
            </div>
          </div>

          {/* Next Session */}
          {mentorship.nextSession && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium text-blue-900">Next Session</Label>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {new Date(mentorship.nextSession).toLocaleDateString()} at{' '}
                {new Date(mentorship.nextSession).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          {/* Key Achievements */}
          {mentorship.progress.keyAchievements.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Recent Achievements</Label>
              <ul className="mt-1 space-y-1">
                {mentorship.progress.keyAchievements.slice(0, 2).map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Mentor
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Mentor Matching System</h2>
        <p className="text-muted-foreground">
          Connect with experienced students who can guide your mental health and academic journey
        </p>
      </div>

      {/* User Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {isMentor ? (
                  <GraduationCap className="h-6 w-6 text-primary" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {isMentor ? 'Mentor Profile' : 'Mentee Profile'}: {generateAnonymousDisplayName()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.year || 'Junior'} • {currentUser?.major || 'Psychology'} •
                  {isMentor ? ' Verified Mentor' : ` ${myMentorships.length} active mentorships`}
                </p>
              </div>
            </div>
            {!isMentor && (
              <Button variant="outline" onClick={() => setActiveTab('become-mentor')}>
                <GraduationCap className="h-4 w-4 mr-2" />
                Become a Mentor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{availableMentors.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Available Mentors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{myMentorships.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">My Mentorships</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">4.7</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">89%</span>
            </div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="find-mentor">Find Mentor</TabsTrigger>
          <TabsTrigger value="my-mentorships">My Mentorships ({myMentorships.length})</TabsTrigger>
          <TabsTrigger value="become-mentor">Become Mentor</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Find Mentor Tab */}
        <TabsContent value="find-mentor" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors by experience, major, or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {Object.entries(MENTAL_HEALTH_CONCERNS).map(([key, concern]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <span>{concern.icon}</span>
                          <span>{concern.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Results */}
          {filteredMentors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Mentors Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or check back later for new mentors
                  </p>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {filteredMentors.length} Mentors Available
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMentors.map(renderMentorCard)}
              </div>
            </div>
          )}
        </TabsContent>

        {/* My Mentorships Tab */}
        <TabsContent value="my-mentorships" className="space-y-6">
          {myMentorships.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Active Mentorships</h3>
                  <p className="text-muted-foreground">
                    Connect with a mentor to start your guided growth journey
                  </p>
                </div>
                <Button onClick={() => setActiveTab('find-mentor')}>
                  <Search className="h-4 w-4 mr-2" />
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Mentorships</h3>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress Report
                </Button>
              </div>
              <div className="grid gap-4">{myMentorships.map(renderMentorshipCard)}</div>
            </div>
          )}
        </TabsContent>

        {/* Become Mentor Tab */}
        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Become a Peer Mentor</CardTitle>
              <CardDescription>
                Share your experience and help fellow students on their mental health journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mentorApplications.length > 0 ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Application Submitted!</h3>
                    <p className="text-muted-foreground">
                      Your mentor application is under review. We'll contact you within 3-5 business
                      days.
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Status: Under Review
                  </Badge>
                </div>
              ) : (
                <>
                  {/* Benefits Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Make a Difference</h3>
                      <p className="text-sm text-muted-foreground">
                        Help peers overcome challenges you've experienced
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold">Develop Skills</h3>
                      <p className="text-sm text-muted-foreground">
                        Build leadership and counseling abilities
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">Gain Recognition</h3>
                      <p className="text-sm text-muted-foreground">
                        Earn certified peer mentor credentials
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Application Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Mentor Application</h4>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Personal Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself, your background, and why you want to be a mentor..."
                        value={mentorApplication.bio}
                        onChange={(e) =>
                          setMentorApplication((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Mental Health Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your personal experience with mental health challenges and recovery..."
                        value={mentorApplication.mentalHealthExperience}
                        onChange={(e) =>
                          setMentorApplication((prev) => ({
                            ...prev,
                            mentalHealthExperience: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approach">Mentoring Approach</Label>
                      <Textarea
                        id="approach"
                        placeholder="How would you approach mentoring? What's your philosophy?"
                        value={mentorApplication.approachDescription}
                        onChange={(e) =>
                          setMentorApplication((prev) => ({
                            ...prev,
                            approachDescription: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hours per Week</Label>
                        <Slider
                          value={[mentorApplication.hoursPerWeek]}
                          onValueChange={(value) =>
                            setMentorApplication((prev) => ({ ...prev, hoursPerWeek: value[0] }))
                          }
                          max={20}
                          min={2}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>2 hours</span>
                          <span>{mentorApplication.hoursPerWeek} hours</span>
                          <span>20 hours</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Maximum Mentees</Label>
                        <Select
                          value={mentorApplication.maxMentees.toString()}
                          onValueChange={(value) =>
                            setMentorApplication((prev) => ({
                              ...prev,
                              maxMentees: parseInt(value),
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 mentee</SelectItem>
                            <SelectItem value="2">2 mentees</SelectItem>
                            <SelectItem value="3">3 mentees</SelectItem>
                            <SelectItem value="4">4 mentees</SelectItem>
                            <SelectItem value="5">5 mentees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={applyToBeMentor}
                      disabled={!mentorApplication.bio || !mentorApplication.mentalHealthExperience}
                      className="w-full"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Submit Mentor Application
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Mentorship Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to make the most of your mentorship experience
                </p>
                <Button variant="outline" className="w-full">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  View Guide
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Goal Setting Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Templates and worksheets for setting effective goals
                </p>
                <Button variant="outline" className="w-full">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Download Tools
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Safety Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Important safety and privacy information for peer mentoring
                </p>
                <Button variant="outline" className="w-full">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Read Guidelines
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Crisis Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Emergency contacts and crisis intervention resources
                </p>
                <Button variant="outline" className="w-full">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Access Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorMatchingSystem;
