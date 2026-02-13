import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logMeditation } from '@/services/logger';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Timer,
  Wind,
  Volume2,
  TrendingUp,
  Award,
  Brain,
  Heart,
  Sparkles,
} from 'lucide-react';

// Import our meditation components
import { MeditationTimer } from './MeditationTimer';
import { BreathingAnimation } from './BreathingAnimation';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';
import { MindfulnessProgressTracker } from './MindfulnessProgressTracker';

// Import types
import {
  MeditationType,
  BreathingTechnique,
  AmbientSoundType,
  MeditationSession,
  BreathingSession,
  getMeditationTypeIcon,
  formatMeditationTime,
  BREATHING_EXERCISES,
} from '@/types/meditation';

interface MeditationDashboardProps {
  userId?: string;
  className?: string;
}

type ActiveSession = {
  type: 'meditation' | 'breathing';
  startTime: Date;
  isActive: boolean;
  isPaused: boolean;
  duration?: number; // target duration in seconds
  technique?: MeditationType | BreathingTechnique;
} | null;

export const MeditationDashboard: React.FC<MeditationDashboardProps> = ({
  userId = 'current_user',
  className = '',
}) => {
  // Session state
  const [activeSession, setActiveSession] = useState<ActiveSession>(null);
  const [currentTab, setCurrentTab] = useState<string>('quick-start');

  // Settings state
  const [preferences, setPreferences] = useState({
    defaultMeditationType: 'mindfulness' as MeditationType,
    defaultDuration: 10, // minutes
    ambientSoundEnabled: true,
    defaultAmbientSound: 'rain' as AmbientSoundType,
    ambientVolume: 50,
    reminderEnabled: false,
    reminderTime: '09:00',
  });

  // Quick start options
  const quickStartOptions = [
    {
      title: '5-Minute Focus',
      description: 'Quick mindfulness session',
      type: 'mindfulness' as MeditationType,
      duration: 5,
      icon: '🎯',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '10-Minute Calm',
      description: 'Guided meditation for relaxation',
      type: 'guided-meditation' as MeditationType,
      duration: 10,
      icon: '🧘‍♀️',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: '4-7-8 Breathing',
      description: 'Calming breathing exercise',
      type: 'breathing-exercise',
      duration: 5,
      icon: '🌬️',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: '15-Minute Deep',
      description: 'Body scan meditation',
      type: 'body-scan' as MeditationType,
      duration: 15,
      icon: '🌸',
      color: 'bg-pink-50 border-pink-200',
    },
  ];

  // Session management
  const startQuickSession = (option: (typeof quickStartOptions)[0]) => {
    const session: ActiveSession = {
      type: option.type === 'breathing-exercise' ? 'breathing' : 'meditation',
      startTime: new Date(),
      isActive: true,
      isPaused: false,
      duration: option.duration * 60, // convert to seconds
      technique: option.type as MeditationType,
    };

    setActiveSession(session);
    setCurrentTab('active-session');
  };

  const pauseSession = () => {
    if (activeSession) {
      setActiveSession({ ...activeSession, isPaused: !activeSession.isPaused });
    }
  };

  const endSession = () => {
    if (activeSession) {
      // Save the session data
      const sessionData = {
        type: activeSession.type,
        duration: Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000),
        technique: activeSession.technique,
      };
      
      logMeditation('Meditation session completed', sessionData);

      setActiveSession(null);
      setCurrentTab('progress');
    }
  };

  const resetSession = () => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        startTime: new Date(),
        isActive: true,
        isPaused: false,
      });
    }
  };

  // Helper function to get breathing exercise icon
  const getBreathingExerciseIcon = (exerciseId: string) => {
    switch (exerciseId) {
      case '4-7-8-breathing':
        return '🌙';
      case 'box-breathing':
        return '⬜';
      case 'triangle-breathing':
        return '🔺';
      default:
        return '🌬️';
    }
  };

  // Helper function to get breathing pattern display
  const getBreathingPattern = (exercise: (typeof BREATHING_EXERCISES)[0]) => {
    return exercise.phases.map((phase) => phase.duration).join('-');
  };

  // Calculate session elapsed time
  const getElapsedTime = () => {
    if (!activeSession) return 0;
    return Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000);
  };

  // Welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! Ready to start your day mindfully?';
    if (hour < 17) return 'Good afternoon! Take a moment to center yourself.';
    return 'Good evening! Wind down with some peaceful meditation.';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meditation Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{getWelcomeMessage()}</p>
      </div>

      {/* Active Session Indicator */}
      {activeSession && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${activeSession.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}
                  />
                  <span className="font-medium">
                    {activeSession.isPaused ? 'Paused' : 'Active'} -{' '}
                    {activeSession.technique?.replace('-', ' ')}
                  </span>
                </div>
                <Badge variant="secondary">{formatMeditationTime(getElapsedTime())}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={pauseSession}>
                  {activeSession.isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="destructive" onClick={endSession}>
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Quick Start Tab */}
        <TabsContent value="quick-start" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {quickStartOptions.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-md ${option.color}`}
                onClick={() => startQuickSession(option)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{option.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm">{option.duration} minutes</span>
                      </div>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Today's Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Today's Recommendation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <span className="text-3xl">🌅</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Morning Mindfulness</h3>
                  <p className="text-sm text-muted-foreground">
                    Start your day with a 10-minute mindfulness session. Perfect for setting
                    positive intentions.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    startQuickSession({
                      title: 'Morning Mindfulness',
                      description: 'Start your day mindfully',
                      type: 'mindfulness',
                      duration: 10,
                      icon: '🌅',
                      color: 'bg-purple-50 border-purple-200',
                    })
                  }
                >
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">12m</span>
                </div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">7</span>
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">4.2</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6">
          <MeditationTimer
            onSessionComplete={(session) => {
              logMeditation('Timer-based meditation session completed', session);
              setCurrentTab('progress');
            }}
            className="max-w-2xl mx-auto"
          />
        </TabsContent>

        {/* Breathing Tab */}
        <TabsContent value="breathing" className="space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Breathing Exercise Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="h-5 w-5" />
                  <span>Choose Your Technique</span>
                </CardTitle>
                <CardDescription>
                  Select a breathing exercise that suits your current needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {BREATHING_EXERCISES.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => {
                        const session: ActiveSession = {
                          type: 'breathing',
                          startTime: new Date(),
                          isActive: true,
                          isPaused: false,
                          technique: exercise.type,
                        };
                        setActiveSession(session);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getBreathingExerciseIcon(exercise.id)}</span>
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{getBreathingPattern(exercise)}</p>
                        <p className="text-xs text-muted-foreground">{exercise.benefits[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Breathing Animation */}
            <BreathingAnimation
              onSessionComplete={(session) => {
                logMeditation('Breathing exercise session completed', session);
                setActiveSession(null);
                setCurrentTab('progress');
              }}
              className="mt-6"
            />
          </div>
        </TabsContent>

        {/* Ambient Sounds Tab */}
        <TabsContent value="ambient" className="space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <span>Ambient Sounds</span>
              </CardTitle>
              <CardDescription>
                Create the perfect atmosphere for your meditation practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AmbientSoundPlayer
                onVolumeChange={(volume) => {
                  setPreferences((prev) => ({ ...prev, ambientVolume: volume }));
                }}
                defaultVolume={preferences.ambientVolume}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Sound Benefits Info */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Benefits of Ambient Sounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Enhanced Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Background sounds help mask distracting noises and improve concentration
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Stress Reduction</h4>
                    <p className="text-sm text-muted-foreground">
                      Natural sounds activate the parasympathetic nervous system, promoting
                      relaxation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <MindfulnessProgressTracker
            userId={userId}
            onGoalUpdate={(goal) => {
              logMeditation('Weekly meditation goal updated', { userId, goal });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeditationDashboard;
