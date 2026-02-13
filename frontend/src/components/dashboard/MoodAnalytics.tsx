import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import { AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Heart,
  Target,
  Activity,
  Lightbulb,
} from 'lucide-react';

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'text-red-500', bgColor: 'bg-red-50' },
  2: { emoji: '😕', label: 'Sad', color: 'text-orange-500', bgColor: 'bg-orange-50' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  4: { emoji: '😊', label: 'Happy', color: 'text-green-500', bgColor: 'bg-green-50' },
  5: { emoji: '😄', label: 'Very Happy', color: 'text-blue-500', bgColor: 'bg-blue-50' },
};

interface MoodAnalyticsProps {
  className?: string;
  timeframe?: 'week' | 'month' | 'all';
}

export const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({
  className = '',
  timeframe = 'week',
}) => {
  const { moods, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    let filteredMoods = moods;

    // Filter by timeframe
    if (timeframe === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filteredMoods = moods.filter((mood) => new Date(mood.date) >= weekAgo);
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filteredMoods = moods.filter((mood) => new Date(mood.date) >= monthAgo);
    }

    // Mood distribution
    const moodCounts = filteredMoods.reduce(
      (acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const totalEntries = filteredMoods.length;
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood: Number(mood),
        count,
        percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
        ...moodEmojis[Number(mood) as keyof typeof moodEmojis],
      }))
      .sort((a, b) => b.count - a.count);

    // Average mood
    const averageMood =
      totalEntries > 0 ? filteredMoods.reduce((sum, mood) => sum + mood.mood, 0) / totalEntries : 0;

    // Streak calculation
    const streak = moods
      .slice()
      .reverse()
      .reduce(
        (currentStreak, mood, index, array) => {
          if (index === 0) return 1;

          const currentDate = new Date(mood.date);
          const previousDate = new Date(array[index - 1].date);
          const dayDifference = Math.floor(
            (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          return dayDifference === 1 ? currentStreak + 1 : currentStreak;
        },
        moods.length > 0 ? 1 : 0
      );

    // Best and worst days
    const bestDay = filteredMoods.reduce(
      (best, mood) => (mood.mood > (best?.mood || 0) ? mood : best),
      null as (typeof filteredMoods)[0] | null
    );

    const worstDay = filteredMoods.reduce(
      (worst, mood) => (mood.mood < (worst?.mood || 6) ? mood : worst),
      null as (typeof filteredMoods)[0] | null
    );

    // Weekly pattern
    const weeklyPattern = Array.from({ length: 7 }, (_, dayIndex) => {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
      const dayMoods = filteredMoods.filter((mood) => new Date(mood.date).getDay() === dayIndex);
      const dayAverage =
        dayMoods.length > 0
          ? dayMoods.reduce((sum, mood) => sum + mood.mood, 0) / dayMoods.length
          : 0;

      return {
        day: dayName,
        average: dayAverage,
        count: dayMoods.length,
      };
    });

    return {
      totalEntries,
      averageMood,
      moodDistribution,
      streak,
      bestDay,
      worstDay,
      weeklyPattern,
      trend: getMoodTrend(),
    };
  }, [moods, timeframe, getMoodTrend]);

  const getTrendIcon = () => {
    switch (analytics.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (analytics.trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsight = () => {
    if (analytics.totalEntries === 0) return 'Start tracking your mood to see insights!';

    const insights = [];

    if (analytics.averageMood >= 4) {
      insights.push("You're doing great! Keep up the positive momentum. ✨");
    } else if (analytics.averageMood >= 3) {
      insights.push(
        "You're maintaining a good balance. Consider activities that bring you joy. 🌱"
      );
    } else {
      insights.push("Remember that tough times don't last. Consider reaching out for support. 💙");
    }

    if (analytics.streak >= 7) {
      insights.push(
        `Amazing ${analytics.streak}-day tracking streak! Consistency is key to self-awareness. 🔥`
      );
    }

    const topMood = analytics.moodDistribution[0];
    if (topMood && topMood.percentage >= 50) {
      insights.push(
        `You've been feeling ${topMood.label.toLowerCase()} most of the time (${topMood.percentage}% of entries).`
      );
    }

    return insights.join(' ');
  };

  const getMoodColor = (mood: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    return colors[mood - 1] || '#6b7280';
  };

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Mood Analytics</span>
        </CardTitle>
        <CardDescription>Insights from your mood tracking journey</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  <AnimatedCounter value={analytics.averageMood} suffix="/5" />
                </div>
                <div className="text-sm text-muted-foreground">Average Mood</div>
              </div>

              <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  <AnimatedCounter value={analytics.totalEntries} />
                </div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span className="font-medium">
                {analytics.trend === 'improving'
                  ? 'Mood Improving'
                  : analytics.trend === 'declining'
                    ? 'Needs Attention'
                    : 'Mood Stable'}
              </span>
            </div>

            {/* Mood Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Mood Distribution</h4>
              {analytics.moodDistribution.map((mood) => (
                <div key={mood.mood} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </div>
                    <span className="font-medium">{mood.percentage}%</span>
                  </div>
                  <Progress
                    value={mood.percentage}
                    className="h-2"
                    style={
                      {
                        '--progress-foreground': getMoodColor(mood.mood),
                      } as React.CSSProperties
                    }
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            {/* Weekly Pattern */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Weekly Pattern
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {analytics.weeklyPattern.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">{day.day}</div>
                    <div className="relative">
                      <div
                        className="h-8 bg-gradient-to-t from-primary/20 to-primary/10 rounded"
                        style={{ height: `${Math.max(day.average * 6, 4)}px` }}
                      />
                      <div className="text-xs mt-1 text-muted-foreground">
                        {day.count > 0 ? day.average.toFixed(1) : '·'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best and Worst Days */}
            {(analytics.bestDay || analytics.worstDay) && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Recent Highlights</h4>
                <div className="grid grid-cols-2 gap-3">
                  {analytics.bestDay && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg">{moodEmojis[analytics.bestDay.mood].emoji}</div>
                        <div className="text-xs font-medium text-green-700">Best Day</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(analytics.bestDay.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {analytics.worstDay && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg">{moodEmojis[analytics.worstDay.mood].emoji}</div>
                        <div className="text-xs font-medium text-orange-700">Challenging Day</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(analytics.worstDay.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Streak */}
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Activity className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-700">Tracking Streak</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                <AnimatedCounter
                  value={analytics.streak}
                  suffix={analytics.streak !== 1 ? ' days' : ' day'}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Personal Insights</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">{getInsight()}</p>
                </div>
              </div>

              {analytics.totalEntries >= 7 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Recommendations
                  </h4>

                  <div className="space-y-2">
                    {analytics.averageMood < 3 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-sm font-medium text-amber-800">
                          Consider Professional Support
                        </div>
                        <div className="text-xs text-amber-700 mt-1">
                          Your recent mood patterns suggest it might help to talk to a counselor or
                          therapist.
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Keep Tracking</div>
                      <div className="text-xs text-green-700 mt-1">
                        Consistent mood tracking helps identify patterns and triggers.
                      </div>
                    </div>

                    {analytics.streak < 7 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Build Your Streak</div>
                        <div className="text-xs text-blue-700 mt-1">
                          Daily tracking provides better insights. Try setting a reminder!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoodAnalytics;
