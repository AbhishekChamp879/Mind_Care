import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Settings, Play, Pause, RotateCcw, Eye } from 'lucide-react';

// Import loading components from their respective modules
import {
  Spinner,
  InlineSpinner,
  LoadingOverlay,
  CardSpinner
} from '@/components/ui/spinner';

import {
  HeartbeatLoader,
  BreathingLoader,
  WaveLoader,
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
} from '@/components/ui/loading-animations';

import {
  MoodTrackerSkeleton,
  MoodAnalyticsSkeleton,
  MoodWidgetSkeleton,
  InteractiveAnalyticsSkeleton,
  QuickMoodSkeleton
} from '@/components/ui/loading-skeletons';

import {
  LoadingDashboardDemo,
  LoadingAnimationsShowcase
} from '@/components/dashboard/LoadingStatesDemo';

/**
 * Loading States Showcase Page
 * 
 * Interactive demonstration of all loading state components
 * for the Mind Care mental health platform.
 */

const LoadingStatesShowcase: React.FC = () => {
  const [showFullDemo, setShowFullDemo] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const handleShowOverlay = () => {
    setShowLoadingOverlay(true);
    setTimeout(() => setShowLoadingOverlay(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Loading States Showcase
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive demonstration of loading states designed for mental health applications
          with anxiety-reducing animations and accessibility-first design.
        </p>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Switch
              checked={slowLoading}
              onCheckedChange={setSlowLoading}
              id="slow-loading"
            />
            <label htmlFor="slow-loading" className="text-sm font-medium">
              Slow Loading
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
              id="reduce-motion"
            />
            <label htmlFor="reduce-motion" className="text-sm font-medium">
              Reduce Motion
            </label>
          </div>
          
          <Button onClick={handleShowOverlay} size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Show Overlay
          </Button>
        </div>
      </div>

      <Tabs defaultValue="spinners" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="spinners">Spinners</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {/* Spinners Tab */}
        <TabsContent value="spinners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Basic Spinners</span>
              </CardTitle>
              <CardDescription>
                Basic spinner components for various loading scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <Spinner size="xs" />
                  <p className="text-sm font-medium">Extra Small</p>
                </div>
                <div className="text-center space-y-3">
                  <Spinner size="sm" variant="primary" />
                  <p className="text-sm font-medium">Small Primary</p>
                </div>
                <div className="text-center space-y-3">
                  <Spinner size="md" variant="gentle" />
                  <p className="text-sm font-medium">Medium Gentle</p>
                </div>
                <div className="text-center space-y-3">
                  <Spinner size="lg" variant="success" />
                  <p className="text-sm font-medium">Large Success</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inline & Specialty Spinners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button disabled className="min-w-[120px]">
                  <InlineSpinner size="sm" className="mr-2" />
                  Loading...
                </Button>
                <Button variant="outline" disabled className="min-w-[120px]">
                  <InlineSpinner size="sm" className="mr-2" />
                  Submitting
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <CardSpinner text="Loading card content..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Animations Tab */}
        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health-Themed Animations</CardTitle>
              <CardDescription>
                Calming animations designed specifically for mental health applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <HeartbeatLoader 
                    size="md" 
                    text="Loading mood data..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Mood Content</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <BreathingLoader 
                    size="md" 
                    text="Preparing meditation..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Meditation</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <WaveLoader 
                    size="md" 
                    text="Analyzing trends..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Analytics</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <GentlePulseLoader 
                    size="md" 
                    text="Loading gently..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Sensitive Content</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <ActivityRingsLoader 
                    size="md" 
                    text="Tracking progress..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Progress</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <ZenDotsLoader 
                    size="md" 
                    text="Finding peace..." 
                    reduceMotion={reduceMotion}
                  />
                  <Badge variant="outline">Mindfulness</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <TypingIndicator text="AI is thinking..." />
                  <Badge variant="outline">Chat AI</Badge>
                </div>
                
                <div className="text-center space-y-3 p-4 border rounded-lg">
                  <DashboardLoader size="sm" text="Loading dashboard..." />
                  <Badge variant="outline">Full Dashboard</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skeletons Tab */}
        <TabsContent value="skeletons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>
                Skeleton components that match the actual component layouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Mood Tracker Skeleton</h3>
                <MoodTrackerSkeleton />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Mood Widget Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MoodWidgetSkeleton variant="summary" />
                  <MoodWidgetSkeleton variant="trend" />
                  <MoodWidgetSkeleton variant="streak" />
                  <MoodWidgetSkeleton variant="weekly" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Analytics Skeletons</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MoodAnalyticsSkeleton />
                  <InteractiveAnalyticsSkeleton />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Mood Skeleton</h3>
                <div className="max-w-md">
                  <QuickMoodSkeleton />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Demo Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Loading Demo</CardTitle>
              <CardDescription>
                Complete dashboard with progressive loading states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowFullDemo(!showFullDemo)}
                  className="min-w-[150px]"
                >
                  {showFullDemo ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Hide Demo
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Show Demo
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFullDemo(false);
                    setTimeout(() => setShowFullDemo(true), 100);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </div>
              
              {showFullDemo && (
                <div className="border rounded-lg p-4 bg-muted/5">
                  <LoadingDashboardDemo 
                    progressiveLoading={slowLoading}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>
                Code examples showing how to integrate loading states in your components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Component with Loading</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import { MoodTrackerSkeleton } from '@/components/loading';

const MoodTracker = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <MoodTrackerSkeleton />;
  }

  return <div>Mood Tracker Content</div>;
};`}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Button with Inline Spinner</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import { InlineSpinner } from '@/components/loading';

<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <InlineSpinner size="sm" className="mr-2" />
      Saving...
    </>
  ) : (
    'Save Mood'
  )}
</Button>`}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Progressive Loading Pattern</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`const [loadingStates, setLoadingStates] = useState({
  summary: true,
  trend: true,
  analytics: true
});

// Load components progressively
useEffect(() => {
  const loadComponents = async () => {
    await delay(500);
    setLoadingStates(prev => ({ ...prev, summary: false }));
    
    await delay(500);
    setLoadingStates(prev => ({ ...prev, trend: false }));
    
    await delay(500);
    setLoadingStates(prev => ({ ...prev, analytics: false }));
  };
  
  loadComponents();
}, []);`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <LoadingOverlay text="Loading your mental wellness dashboard..." />
      )}
    </div>
  );
};

export default LoadingStatesShowcase;