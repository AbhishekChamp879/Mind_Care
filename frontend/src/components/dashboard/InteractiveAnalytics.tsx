import React, { useState, useMemo } from 'react'; // --- 1. IMPORT useMemo ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useMoodTracking,
  useActivityLog,
  useGoals,
  useSleepTracking,
} from '@/hooks/useDashboardFeatures';
import { AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Eye,
  Activity,
  Heart,
  Brain,
  Target,
  Moon,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';

export const InteractiveAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | '3months'>('week');
  const { moods, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();
  const { getWeeklyStats } = useActivityLog();
  const { goals, getWeeklyGoalProgress } = useGoals();
  const { getAverageHours } = useSleepTracking();

  const weeklyStats = getWeeklyStats();
  const moodAverage = getWeeklyMoodAverage();
  const moodTrend = getMoodTrend();
  const goalProgress = getWeeklyGoalProgress();
  const averageSleep = getAverageHours();

  // --- 2. ADD THIS DYNAMIC FILTERING LOGIC ---
  const filteredMoods = useMemo(() => {
    const now = Date.now();
    const daysToFilter = {
      week: 7,
      month: 30,
      '3months': 90,
    }[selectedTimeframe];

    const cutoffDate = now - daysToFilter * 24 * 60 * 60 * 1000;
    
    // Filter moods and then take the most recent ones matching the timeframe
    return moods
      .filter((mood) => mood.timestamp >= cutoffDate)
      .slice(-daysToFilter); // Ensure we don't show more bars than the timeframe allows
  }, [moods, selectedTimeframe]);
  // --- END OF ADDED LOGIC ---

  const getMetricTrend = (current: number, previous: number) => {
    if (current > previous + 0.1) return { trend: 'up', icon: ArrowUp, color: 'text-green-500' };
    if (current < previous - 0.1) return { trend: 'down', icon: ArrowDown, color: 'text-red-500' };
    return { trend: 'stable', icon: Minus, color: 'text-gray-500' };
  };

  const analyticsData = [
    {
      title: 'Mood Tracking',
      value: moodAverage || 3.5,
      maxValue: 5,
      unit: '/5',
      trend: moodTrend,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'from-red-50 to-red-100',
      description: 'Average mood rating this week',
    },
    {
      title: 'Activity Level',
      value: weeklyStats.total,
      maxValue: 20,
      unit: ' actions',
      trend: weeklyStats.total > 10 ? 'improving' : weeklyStats.total > 5 ? 'stable' : 'declining',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'from-blue-50 to-blue-100',
      description: 'Total wellness activities this week',
    },
    {
      title: 'Goal Progress',
      value: goalProgress,
      maxValue: 100,
      unit: '%',
      trend: goalProgress > 70 ? 'improving' : goalProgress > 40 ? 'stable' : 'declining',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'from-green-50 to-green-100',
      description: 'Weekly goal completion rate',
    },
    {
      title: 'Sleep Quality',
      value: averageSleep,
      maxValue: 10,
      unit: ' hrs',
      trend: averageSleep >= 7 ? 'improving' : averageSleep >= 6 ? 'stable' : 'declining',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'from-purple-50 to-purple-100',
      description: 'Average sleep duration',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="enhanced-card hover:shadow-medium transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Wellness Analytics</CardTitle>
              <CardDescription className="text-sm">
                Track your mental health progress over time
              </CardDescription>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detailed Analytics</DialogTitle>
                <DialogDescription>
                  In-depth view of your wellness metrics and trends
                </DialogDescription>
              </DialogHeader>

              <Tabs value={selectedTimeframe} onValueChange={(v) => setSelectedTimeframe(v as any)}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="3months">3 Months</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTimeframe} className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {analyticsData.map((metric, index) => (
                      <div
                        key={index}
                        className={`p-4 bg-gradient-to-br ${metric.bgColor} rounded-lg border`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <metric.icon className={`h-5 w-5 ${metric.color}`} />
                            <span className="font-semibold text-sm">{metric.title}</span>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold">{metric.value}</span>
                            <span className="text-sm text-muted-foreground">{metric.unit}</span>
                          </div>

                          <Progress
                            value={(metric.value / metric.maxValue) * 100}
                            className="h-2"
                          />

                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mood History Chart Placeholder */}
                  {moods.length > 0 && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        Mood Trend ({selectedTimeframe === '3months' ? '3 Months' : `This ${selectedTimeframe}`})
                      </h4>
                      <div className="flex items-end space-x-2 h-24">
                        {/* --- 3. USE THE DYNAMICALLY FILTERED DATA --- */}
                        {filteredMoods.map((mood, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              title={`Mood: ${mood.mood}/5 on ${new Date(mood.date).toLocaleDateString()}`}
                              className="w-full bg-gradient-to-t from-primary to-secondary rounded-t opacity-70 hover:opacity-100 transition-opacity"
                              style={{ height: `${(mood.mood / 5) * 100}%`, minHeight: '4px' }}
                            />
                            <span className="text-xs text-muted-foreground mt-1">
                              {new Date(mood.date).getDate()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity Breakdown */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-blue-500" />
                      Activity Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">AI Chat Sessions</span>
                        <Badge variant="secondary">{weeklyStats.chat}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Resources Accessed</span>
                        <Badge variant="secondary">{weeklyStats.resource}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Forum Interactions</span>
                        <Badge variant="secondary">{weeklyStats.forum}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sessions Booked</span>
                        <Badge variant="secondary">{weeklyStats.booking}</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {analyticsData.slice(0, 4).map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    {metric.value}
                    {metric.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((metric.value / metric.maxValue) * 100)}%
                  </span>
                </div>
                <Progress value={(metric.value / metric.maxValue) * 100} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t text-center">
          <div className="text-xs text-muted-foreground mb-2">Overall Wellness Score</div>
          <div className="flex items-center justify-center space-x-2">
            <Progress
              value={
                (analyticsData.reduce((acc, metric) => acc + metric.value / metric.maxValue, 0) /
                  analyticsData.length) *
                100
              }
              className="flex-1 h-2"
            />
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {Math.round(
                (analyticsData.reduce((acc, metric) => acc + metric.value / metric.maxValue, 0) /
                  analyticsData.length) *
                  100
              )}
              %
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};