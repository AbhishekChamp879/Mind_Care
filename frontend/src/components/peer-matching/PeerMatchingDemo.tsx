import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  MessageCircle,
  Star,
  BookOpen,
  Shield,
  Heart,
  Zap,
  Activity,
  Clock,
  Target,
  Award,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { getCreationDate } from '../../utils/dateUtils';

import { PeerMatchingDashboard } from './PeerMatchingDashboard';
import { PeerBuddyMatching } from './PeerBuddyMatching';
import { StudyGroupSystem } from './StudyGroupSystem';
import { MentorMatchingSystem } from './MentorMatchingSystem';
import { RealTimeConnectionSystem } from './RealTimeConnectionSystem';

import {
  PeerUser,
  generateAnonymousDisplayName,
  MENTAL_HEALTH_CONCERNS,
} from '@/types/peerMatching';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  icon: React.ReactNode;
  features: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: 'matching' | 'groups' | 'mentorship' | 'communication' | 'overview';
}

interface FeatureHighlight {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'implemented' | 'partial' | 'planned';
}

interface PeerMatchingDemoProps {
  className?: string;
}

export const PeerMatchingDemo: React.FC<PeerMatchingDemoProps> = ({ className = '' }) => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');
  const [demoUser, setDemoUser] = useState<PeerUser | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Demo scenarios
  const demoScenarios: DemoScenario[] = [
    {
      id: 'overview',
      title: 'Unified Dashboard',
      description: 'Complete peer matching hub with integrated features',
      component: PeerMatchingDashboard,
      icon: <Activity className="h-5 w-5" />,
      features: [
        'Real-time notifications',
        'Activity tracking',
        'Cross-system integration',
        'Privacy controls',
      ],
      difficulty: 'basic',
      estimatedTime: '5 min',
      category: 'overview',
    },
    {
      id: 'peer-buddy',
      title: 'Anonymous Peer Matching',
      description: 'Find compatible study buddies with privacy protection',
      component: PeerBuddyMatching,
      icon: <Users className="h-5 w-5" />,
      features: [
        'Compatibility scoring',
        'Anonymous profiles',
        'Safety features',
        'Real-time matching',
      ],
      difficulty: 'intermediate',
      estimatedTime: '8 min',
      category: 'matching',
    },
    {
      id: 'study-groups',
      title: 'Mental Health Study Groups',
      description: 'Collaborative learning focused on wellbeing',
      component: StudyGroupSystem,
      icon: <BookOpen className="h-5 w-5" />,
      features: [
        'Topic-based groups',
        'Session scheduling',
        'Progress tracking',
        'Group analytics',
      ],
      difficulty: 'intermediate',
      estimatedTime: '10 min',
      category: 'groups',
    },
    {
      id: 'mentorship',
      title: 'Senior-Junior Mentorship',
      description: 'Connect with experienced peers for guidance',
      component: MentorMatchingSystem,
      icon: <Star className="h-5 w-5" />,
      features: ['Goal tracking', 'Mentor verification', 'Progress milestones', 'Resource sharing'],
      difficulty: 'advanced',
      estimatedTime: '12 min',
      category: 'mentorship',
    },
    {
      id: 'real-time',
      title: 'Secure Real-time Chat',
      description: 'Encrypted peer-to-peer communication',
      component: RealTimeConnectionSystem,
      icon: <MessageCircle className="h-5 w-5" />,
      features: [
        'End-to-end encryption',
        'Typing indicators',
        'Connection quality',
        'Message reactions',
      ],
      difficulty: 'advanced',
      estimatedTime: '6 min',
      category: 'communication',
    },
  ];

  const featureHighlights: FeatureHighlight[] = [
    {
      title: 'Privacy-First Design',
      description: 'Anonymous matching with granular privacy controls',
      icon: <Shield className="h-6 w-6 text-green-500" />,
      status: 'implemented',
    },
    {
      title: 'AI-Powered Matching',
      description: 'Intelligent compatibility scoring based on concerns and preferences',
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      status: 'implemented',
    },
    {
      title: 'Real-time Communication',
      description: 'Secure, encrypted chat with typing indicators and reactions',
      icon: <Radio className="h-6 w-6 text-purple-500" />,
      status: 'implemented',
    },
    {
      title: 'Mental Health Focus',
      description: 'Specialized support for 20+ mental health concerns',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      status: 'implemented',
    },
    {
      title: 'Progress Tracking',
      description: 'Goal setting and achievement monitoring for growth',
      icon: <Target className="h-6 w-6 text-orange-500" />,
      status: 'implemented',
    },
    {
      title: 'Safety & Moderation',
      description: 'Comprehensive reporting and moderation systems',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      status: 'partial',
    },
  ];

  // Initialize demo user
  useEffect(() => {
    const mockUser: PeerUser = {
      id: 'demo_user_123',
      anonymousId: 'demo_anonymous_123',
      displayName: generateAnonymousDisplayName(),
      year: 'junior',
      major: 'Computer Science',
      institution: 'Demo University',
      mentalHealthConcerns: ['anxiety', 'academic-pressure'],
      interests: ['coding', 'mindfulness', 'peer-support'],
      availableHours: {
        monday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        tuesday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        wednesday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        thursday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        friday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        saturday: [{ start: '10:00', end: '16:00' }],
        sunday: [{ start: '10:00', end: '16:00' }],
      },
      timeZone: 'EST',
      preferences: {
        genderPreference: 'any',
        ageRange: { min: 18, max: 25 },
        communicationStyle: 'text-only',
        meetingFrequency: 'weekly',
        groupSizePreference: 'any',
        anonymityLevel: 'first-name-only',
        supportType: ['emotional-support', 'study-buddy'],
      },
      isOnline: true,
      lastActive: new Date().toISOString(),
      profileComplete: true,
      verificationStatus: 'verified',
      createdAt: getCreationDate(),
    };

    setDemoUser(mockUser);
  }, []);

  const getDifficultyColor = (difficulty: DemoScenario['difficulty']) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusColor = (status: FeatureHighlight['status']) => {
    switch (status) {
      case 'implemented':
        return 'text-green-500';
      case 'partial':
        return 'text-yellow-500';
      case 'planned':
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: FeatureHighlight['status']) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4" />;
      case 'partial':
        return <Clock className="h-4 w-4" />;
      case 'planned':
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const renderDemoComponent = () => {
    const scenario = demoScenarios.find((s) => s.id === activeDemo);
    if (!scenario || !demoUser) return null;

    const Component = scenario.component;
    return <Component currentUser={demoUser} className="w-full" />;
  };

  const startGuidedTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    // Simulate guided tour steps
    const totalSteps = 5;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Real-time Peer Matching System</h1>
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive mental health support platform connecting students through anonymous peer
          matching, study groups, and mentorship programs with end-to-end encryption and privacy
          protection.
        </p>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button onClick={startGuidedTour} className="flex items-center space-x-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause Tour' : 'Start Guided Tour'}</span>
          </Button>
          <Button variant="outline" onClick={() => setActiveDemo('overview')}>
            <Eye className="h-4 w-4 mr-2" />
            Live Demo
          </Button>
          <Button variant="outline">
            <Code className="h-4 w-4 mr-2" />
            View Code
          </Button>
        </div>

        {/* Guided Tour Progress */}
        {isPlaying && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">
                  Guided Tour - Step {currentStep + 1} of 5
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Key Features</span>
          </CardTitle>
          <CardDescription>
            Comprehensive mental health support with privacy and security at the core
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureHighlights.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                {feature.icon}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <div
                      className={`flex items-center space-x-1 ${getStatusColor(feature.status)}`}
                    >
                      {getStatusIcon(feature.status)}
                      <span className="text-xs capitalize">{feature.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">20+</div>
            <p className="text-sm text-muted-foreground">Mental Health Concerns Supported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-sm text-muted-foreground">Privacy Protection</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <p className="text-sm text-muted-foreground">Real-time Matching</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">E2E</div>
            <p className="text-sm text-muted-foreground">Encrypted Communication</p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Interactive Demo</span>
          </CardTitle>
          <CardDescription>
            Explore different components of the peer matching system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {demoScenarios.map((scenario) => (
                <TabsTrigger
                  key={scenario.id}
                  value={scenario.id}
                  className="flex items-center space-x-2"
                >
                  {scenario.icon}
                  <span className="hidden sm:inline">{scenario.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Scenario Info */}
            <div className="mt-6 mb-4">
              {demoScenarios.map((scenario) => (
                <div key={scenario.id} className={activeDemo === scenario.id ? 'block' : 'hidden'}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{scenario.title}</h3>
                      <p className="text-muted-foreground">{scenario.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(scenario.difficulty)}>
                        {scenario.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {scenario.estimatedTime}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {scenario.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Demo Component */}
            <div className="min-h-[600px]">{renderDemoComponent()}</div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Technical Implementation</span>
          </CardTitle>
          <CardDescription>
            Built with modern technologies for scalability and security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend Technologies</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">React 18.3.1 with TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Tailwind CSS + shadcn/ui Components</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time WebSocket Simulation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Responsive Design</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Security & Privacy</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">End-to-end Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Anonymous Identity Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Granular Privacy Controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Safety & Moderation Systems</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Connect?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students finding support, building connections, and improving their
            mental health through peer-to-peer interactions.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg">
              <Users className="h-5 w-5 mr-2" />
              Start Matching
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerMatchingDemo;
