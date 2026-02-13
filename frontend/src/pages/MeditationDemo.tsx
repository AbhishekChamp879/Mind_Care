import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Brain,
  Heart,
  Timer,
  TrendingUp,
  Award,
  Wind,
  Volume2,
  Sparkles,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Users,
} from 'lucide-react';

// Import meditation components
import { MeditationDashboard } from '@/components/meditation/MeditationDashboard';
import { MeditationTimer } from '@/components/meditation/MeditationTimer';
import { BreathingAnimation } from '@/components/meditation/BreathingAnimation';
import { AmbientSoundPlayer } from '@/components/meditation/AmbientSoundPlayer';
import { MindfulnessProgressTracker } from '@/components/meditation/MindfulnessProgressTracker';

// Import types for demo data
import { BREATHING_EXERCISES, AMBIENT_SOUNDS, MEDITATION_ACHIEVEMENTS } from '@/types/meditation';

export const MeditationDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');

  // Demo features list
  const features = [
    {
      id: 'timer',
      title: 'Real-time Meditation Timer',
      description: 'Customizable timer with session controls and completion tracking',
      icon: <Timer className="h-6 w-6" />,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      highlights: [
        'Real-time countdown',
        'Custom durations',
        'Session controls',
        'Completion bells',
      ],
    },
    {
      id: 'breathing',
      title: 'Breathing Exercise Animations',
      description: 'Visual guides for 4-7-8, box breathing, and triangle techniques',
      icon: <Wind className="h-6 w-6" />,
      color: 'bg-green-50 border-green-200 text-green-700',
      highlights: ['4-7-8 breathing', 'Box breathing', 'Visual animations', 'Cycle tracking'],
    },
    {
      id: 'ambient',
      title: 'Ambient Sound System',
      description: 'Web Audio API powered ambient sounds for meditation atmosphere',
      icon: <Volume2 className="h-6 w-6" />,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      highlights: ['Rain sounds', 'Ocean waves', 'Forest ambience', 'Volume controls'],
    },
    {
      id: 'progress',
      title: 'Progress Tracking System',
      description: 'Comprehensive analytics for mindfulness activities and achievements',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      highlights: ['Session history', 'Streak tracking', 'Goal setting', 'Achievement system'],
    },
    {
      id: 'dashboard',
      title: 'Unified Dashboard Interface',
      description: 'Complete meditation center with all features integrated',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      highlights: [
        'Quick start options',
        'Session management',
        'Real-time tracking',
        'Personalized recommendations',
      ],
    },
  ];

  // Implementation highlights
  const implementationDetails = [
    {
      category: 'Real-time Features',
      items: [
        'High-precision timer with millisecond accuracy',
        'Real-time breathing phase animations with smooth transitions',
        'Live session state management with pause/resume capability',
        'Synchronized audio-visual feedback for meditation cues',
      ],
    },
    {
      category: 'Audio Technology',
      items: [
        'Web Audio API implementation for browser-native sound generation',
        'Synthetic ambient sound creation without external audio files',
        'Real-time volume control with gain node management',
        'Cross-browser compatible audio context handling',
      ],
    },
    {
      category: 'Progress Analytics',
      items: [
        'Comprehensive session tracking with detailed metrics',
        'Streak calculation with consecutive day counting',
        'Weekly goal progress with percentage completion',
        'Achievement system with tiered unlock requirements',
      ],
    },
    {
      category: 'User Experience',
      items: [
        'Responsive design optimized for all device sizes',
        'Intuitive tab-based navigation for feature discovery',
        'Visual feedback with color-coded breathing phases',
        'Accessibility-focused controls with keyboard navigation',
      ],
    },
  ];

  // Statistics for the demo
  const demoStats = [
    { label: 'Components Built', value: '5', icon: <Brain className="h-5 w-5 text-blue-500" /> },
    {
      label: 'Breathing Techniques',
      value: BREATHING_EXERCISES.length.toString(),
      icon: <Wind className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Ambient Sounds',
      value: AMBIENT_SOUNDS.length.toString(),
      icon: <Volume2 className="h-5 w-5 text-purple-500" />,
    },
    {
      label: 'Achievements',
      value: MEDITATION_ACHIEVEMENTS.length.toString(),
      icon: <Award className="h-5 w-5 text-yellow-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">MindCare Meditation System</h1>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Feature 7 Implementation: Real-time Guided Meditation & Breathing Exercises
          </p>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-600 font-medium">Complete Implementation</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {demoStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {stat.icon}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Demo Content */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="ambient">Ambient</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Feature Cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className={`${feature.color} cursor-pointer hover:shadow-lg transition-all`}
                  onClick={() => setActiveDemo(feature.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                    <CardDescription className="text-inherit opacity-80">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 opacity-60" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Implementation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6" />
                  <span>Technical Implementation Details</span>
                </CardTitle>
                <CardDescription>
                  Advanced features and technical highlights of the meditation system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {implementationDetails.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-semibold text-lg">{section.category}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6" />
                  <span>System Architecture</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">Real-time Core</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      High-precision timers and state management
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Volume2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-medium">Audio Engine</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Web Audio API with synthetic sound generation
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">Analytics Layer</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Progress tracking and achievement system
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Demo */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Complete Meditation Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Unified interface combining all meditation features with session management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeditationDashboard className="w-full" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timer Demo */}
          <TabsContent value="timer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-6 w-6" />
                  <span>Meditation Timer Component</span>
                </CardTitle>
                <CardDescription>
                  Real-time timer with customizable durations and meditation types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeditationTimer
                  onSessionComplete={(session) => {
                    console.log('Demo session completed:', session);
                  }}
                  className="max-w-2xl mx-auto"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breathing Demo */}
          <TabsContent value="breathing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="h-6 w-6" />
                  <span>Breathing Exercise Animations</span>
                </CardTitle>
                <CardDescription>
                  Visual guides for 4-7-8 technique, box breathing, and other patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BreathingAnimation
                  onSessionComplete={(session) => {
                    console.log('Demo breathing session completed:', session);
                  }}
                  className="max-w-2xl mx-auto"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ambient Sounds Demo */}
          <TabsContent value="ambient" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-6 w-6" />
                  <span>Ambient Sound System</span>
                </CardTitle>
                <CardDescription>
                  Web Audio API powered ambient sounds with real-time generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AmbientSoundPlayer
                  onVolumeChange={(volume) => {
                    console.log('Demo volume changed:', volume);
                  }}
                  defaultVolume={30}
                  className="max-w-2xl mx-auto"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Demo */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Progress Tracking System</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics, achievements, and goal tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MindfulnessProgressTracker
                  userId="demo_user"
                  onGoalUpdate={(goal) => {
                    console.log('Demo goal updated:', goal);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-primary/5 to-purple-100/50">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-semibold">Feature 7 Complete</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real-time Guided Meditation & Breathing Exercises system fully implemented with
                meditation timer, breathing animations, ambient sounds, and comprehensive progress
                tracking.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="h-4 w-4" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>User-Centered Design</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeditationDemo;
