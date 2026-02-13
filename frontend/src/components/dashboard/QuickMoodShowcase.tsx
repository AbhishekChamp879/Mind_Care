import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QuickMoodCheckIn from '@/components/dashboard/QuickMoodCheckIn';
import {
  MoodSummaryWidget,
  MoodStreakWidget,
  MoodWeeklyWidget,
} from '@/components/dashboard/MoodWidgets';
import { Heart, Zap, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export const QuickMoodShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Quick Mood Check-ins
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Feature 3: One-tap mood logging with enhanced widgets for faster wellness tracking
        </p>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          ✅ Fully Implemented
        </Badge>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span>One-Tap Logging</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick emoji-based mood selection with instant feedback and streak tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Smart Widgets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compact mood widgets for dashboard with trends, streaks, and weekly patterns.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Floating Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Floating action button and header shortcuts for instant mood logging access.
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive mood analytics with patterns, insights, and recommendations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Mood Check-in Demo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">🎯 Quick Mood Check-in Component</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Default Variant */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Badge variant="outline">Default</Badge>
              <span>Full Interface</span>
            </h3>
            <QuickMoodCheckIn variant="default" showStreak={true} />
          </div>

          {/* Compact Variant */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Badge variant="outline">Compact</Badge>
              <span>Dashboard Widget</span>
            </h3>
            <QuickMoodCheckIn variant="compact" showStreak={true} />
          </div>
        </div>

        {/* Minimal Variant */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Badge variant="outline">Minimal</Badge>
            <span>Inline Quick Access</span>
          </h3>
          <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
            <QuickMoodCheckIn variant="minimal" className="justify-center" />
          </div>
        </div>
      </div>

      {/* Mood Widgets Demo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">📊 Mood Tracking Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Mood Summary</h3>
            <MoodSummaryWidget />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Tracking Streak</h3>
            <MoodStreakWidget />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Weekly Pattern</h3>
            <MoodWeeklyWidget />
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Implementation Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">🚀 Quick Access Elements:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Floating action button (bottom-right)</li>
                <li>• Header dropdown for students</li>
                <li>• Inline mood selectors</li>
                <li>• Dashboard widget integration</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">📈 Analytics & Insights:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real-time mood trend analysis</li>
                <li>• Weekly pattern recognition</li>
                <li>• Streak tracking with milestones</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">🎨 User Experience:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• One-tap emoji-based logging</li>
                <li>• Smooth animations and feedback</li>
                <li>• Multiple widget variants</li>
                <li>• Responsive design for all devices</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">💾 Data Management:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• localStorage persistence</li>
                <li>• Real-time updates and sync</li>
                <li>• Notification integration</li>
                <li>• Progress tracking and streaks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickMoodShowcase;
