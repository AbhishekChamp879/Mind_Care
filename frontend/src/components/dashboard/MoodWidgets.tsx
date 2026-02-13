import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import { AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
  Clock,
  Zap,
} from 'lucide-react';

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  2: { emoji: '😕', label: 'Sad', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '😊', label: 'Happy', color: 'text-green-500' },
  5: { emoji: '😄', label: 'Very Happy', color: 'text-blue-500' },
};

interface MoodWidgetProps {
  variant?: 'summary' | 'trend' | 'streak' | 'weekly' | 'recent';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodSummaryWidget: React.FC<MoodWidgetProps> = ({ className = '', size = 'md' }) => {
  const { getTodayMood, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();

  const todayMood = getTodayMood();
  const weeklyAverage = getWeeklyMoodAverage();
  const trend = getMoodTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>Mood Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Today's Mood */}
          <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
            {todayMood ? (
              <>
                <div className="text-2xl mb-1">{moodEmojis[todayMood.mood].emoji}</div>
                <div className="text-xs font-medium">Today</div>
                <div className={`text-xs ${moodEmojis[todayMood.mood].color}`}>
                  {moodEmojis[todayMood.mood].label}
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl mb-1">❓</div>
                <div className="text-xs font-medium text-muted-foreground">Not logged</div>
              </>
            )}
          </div>

          {/* Weekly Average */}
          <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">
              <AnimatedCounter value={weeklyAverage || 0} suffix="/5" />
            </div>
            <div className="text-xs font-medium">Weekly Avg</div>
            <div className="text-xs text-muted-foreground">out of 5</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div
          className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${getTrendColor()}`}
        >
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {trend === 'improving'
              ? 'Improving'
              : trend === 'declining'
                ? 'Needs attention'
                : 'Stable'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const MoodTrendWidget: React.FC<MoodWidgetProps> = ({ className = '', size = 'md' }) => {
  const { moods, getWeeklyMoodAverage } = useMoodTracking();

  const recentMoods = moods.slice(-7);
  const weeklyAverage = getWeeklyMoodAverage();

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Mood Trend</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium">{weeklyAverage ? `${weeklyAverage}/5` : 'No data'}</span>
          </div>
          <Progress value={(weeklyAverage || 0) * 20} className="h-2" />
        </div>

        {/* Recent Mood History */}
        {recentMoods.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Last 7 days</div>
            <div className="flex justify-center space-x-1">
              {recentMoods.map((mood, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-1"
                  title={`${mood.date}: ${moodEmojis[mood.mood].label}`}
                >
                  <span className="text-lg">{moodEmojis[mood.mood].emoji}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(mood.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MoodStreakWidget: React.FC<MoodWidgetProps> = ({ className = '', size = 'md' }) => {
  const { moods } = useMoodTracking();

  // Calculate mood tracking streak
  const streak = React.useMemo(() => {
    const today = new Date();
    let currentStreak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayString = checkDate.toISOString().split('T')[0];

      const hasEntry = moods.some((mood) => mood.date === dayString);

      if (hasEntry) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    return currentStreak;
  }, [moods]);

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'Amazing consistency!';
    return 'Incredible dedication!';
  };

  const getStreakEmoji = () => {
    if (streak === 0) return '🎯';
    if (streak < 7) return '🌱';
    if (streak < 30) return '🔥';
    return '🏆';
  };

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Tracking Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <div className="text-4xl">{getStreakEmoji()}</div>
          <div className="text-3xl font-bold text-primary">
            <AnimatedCounter value={streak} />
          </div>
          <div className="text-sm text-muted-foreground">day{streak !== 1 ? 's' : ''} in a row</div>
          <Badge variant={streak > 0 ? 'default' : 'secondary'} className="text-xs">
            {getStreakMessage()}
          </Badge>
        </div>

        {streak > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Next milestone: {Math.ceil((streak + 1) / 7) * 7} days
            </div>
            <Progress value={((streak % 7) / 7) * 100} className="h-1 mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MoodWeeklyWidget: React.FC<MoodWidgetProps> = ({ className = '', size = 'md' }) => {
  const { moods } = useMoodTracking();

  // Get current week's moods
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekMoods = moods.filter((mood) => {
    const moodDate = new Date(mood.date);
    return moodDate >= weekStart;
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + index);
            const dayString = dayDate.toISOString().split('T')[0];

            const dayMood = weekMoods.find((mood) => mood.date === dayString);
            const isToday = index === today;
            const isFuture = index > today;

            return (
              <div key={day} className="text-center">
                <div
                  className={`text-xs font-medium mb-1 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {day}
                </div>
                <div
                  className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm ${
                    isFuture
                      ? 'bg-gray-100 text-gray-400'
                      : dayMood
                        ? 'bg-primary/10 border border-primary/20'
                        : isToday
                          ? 'bg-orange-100 border border-orange-200'
                          : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  {isFuture ? '·' : dayMood ? moodEmojis[dayMood.mood].emoji : isToday ? '?' : '○'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          {weekMoods.length} of {today + 1} days logged this week
        </div>
      </CardContent>
    </Card>
  );
};

const MoodQuickInsightWidget: React.FC<MoodWidgetProps> = ({ className = '', size = 'md' }) => {
  const { moods, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();

  const weeklyAverage = getWeeklyMoodAverage();
  const trend = getMoodTrend();
  const recentMoods = moods.slice(-7);

  // Calculate most frequent mood this week
  const moodCounts = recentMoods.reduce(
    (acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const mostFrequentMood = Object.entries(moodCounts).reduce(
    (max, [mood, count]) => (count > max[1] ? [Number(mood), count] : max),
    [0, 0] as [number, number]
  );

  const getInsight = () => {
    if (recentMoods.length === 0) return 'Start tracking to see insights';
    if (trend === 'improving') return 'Your mood is trending upward! 📈';
    if (trend === 'declining') return 'Consider reaching out for support 💙';
    if (weeklyAverage >= 4) return "You're having a great week! ✨";
    if (weeklyAverage >= 3) return 'Maintaining good balance 🌱';
    return "Remember: it's okay to have tough days 🤗";
  };

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Quick Insight</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            This week you've been
          </div>
          {mostFrequentMood[0] > 0 ? (
            <>
              <div className="text-2xl mb-1">{moodEmojis[mostFrequentMood[0]].emoji}</div>
              <div className={`text-sm font-medium ${moodEmojis[mostFrequentMood[0]].color}`}>
                {moodEmojis[mostFrequentMood[0]].label}
              </div>
              <div className="text-xs text-muted-foreground">
                {mostFrequentMood[1]} day{mostFrequentMood[1] !== 1 ? 's' : ''}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data yet</div>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground italic">{getInsight()}</div>
      </CardContent>
    </Card>
  );
};

// Export all widgets
export {
  MoodSummaryWidget as MoodWidget,
  MoodTrendWidget,
  MoodStreakWidget,
  MoodWeeklyWidget,
  MoodQuickInsightWidget,
};
