import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  Star,
  Flame,
  BarChart3,
  Activity,
  Heart,
  Brain,
  Zap,
} from 'lucide-react';
import {
  MindfulnessProgress,
  Achievement,
  WeeklyStats,
  MeditationType,
  BreathingSession,
  MeditationSession,
  MEDITATION_ACHIEVEMENTS,
  formatMeditationTime,
  getMeditationTypeIcon,
  getNextAchievement,
  calculateWeeklyGoalProgress,
} from '@/types/meditation';

interface MindfulnessProgressTrackerProps {
  userId?: string;
  onGoalUpdate?: (goal: number) => void;
  className?: string;
}

export const MindfulnessProgressTracker: React.FC<MindfulnessProgressTrackerProps> = ({
  userId = 'current_user',
  onGoalUpdate,
  className = '',
}) => {
  // Mock progress data - in real app, this would come from a context or API
  const [progress, setProgress] = useState<MindfulnessProgress>({
    userId,
    totalSessions: 47,
    totalMeditationTime: 1245, // minutes
    currentStreak: 7,
    longestStreak: 14,
    lastSessionDate: new Date().toISOString().split('T')[0],
    weeklyGoal: 150, // minutes
    weeklyProgress: 85, // minutes completed this week
    favoriteType: 'mindfulness',
    averageSessionDuration: 12.5,
    averageRating: 4.2,
    sessionsThisWeek: 6,
    sessionsThisMonth: 23,
    achievements: [
      {
        ...MEDITATION_ACHIEVEMENTS[0],
        isUnlocked: true,
        unlockedDate: '2024-01-01',
        currentProgress: 1,
      },
      {
        ...MEDITATION_ACHIEVEMENTS[1],
        isUnlocked: true,
        unlockedDate: '2024-01-08',
        currentProgress: 7,
      },
      { ...MEDITATION_ACHIEVEMENTS[2], isUnlocked: false, currentProgress: 20.75 },
      { ...MEDITATION_ACHIEVEMENTS[3], isUnlocked: false, currentProgress: 2 },
    ],
    weeklyStats: [
      {
        weekStartDate: '2024-01-15',
        sessionsCompleted: 6,
        totalMinutes: 85,
        averageRating: 4.2,
        mostUsedTechnique: 'mindfulness',
        goalCompletion: 56.7,
      },
      {
        weekStartDate: '2024-01-08',
        sessionsCompleted: 5,
        totalMinutes: 75,
        averageRating: 4.0,
        mostUsedTechnique: 'breathing-exercise',
        goalCompletion: 50.0,
      },
      {
        weekStartDate: '2024-01-01',
        sessionsCompleted: 4,
        totalMinutes: 60,
        averageRating: 3.8,
        mostUsedTechnique: 'mindfulness',
        goalCompletion: 40.0,
      },
    ],
  });

  const [recentSessions] = useState<(MeditationSession | BreathingSession)[]>([
    {
      id: 'session_1',
      userId,
      type: 'mindfulness',
      duration: 900, // 15 minutes
      startTime: new Date(Date.now() - 86400000).toISOString(), // yesterday
      endTime: new Date(Date.now() - 86400000 + 900000).toISOString(),
      completed: true,
      ambientSound: 'rain',
      soundVolume: 60,
      rating: 4,
      interruptions: 0,
      actualDuration: 900,
    },
    {
      id: 'session_2',
      userId,
      technique: '4-7-8-breathing',
      cyclesCompleted: 4,
      targetCycles: 4,
      duration: 456, // 7.6 minutes
      startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      endTime: new Date(Date.now() - 172800000 + 456000).toISOString(),
      completed: true,
    },
  ]);

  const weeklyGoalProgress = calculateWeeklyGoalProgress(
    progress.weeklyProgress,
    progress.weeklyGoal
  );
  const nextAchievement = getNextAchievement(progress);

  // Mock function to update weekly goal
  const updateWeeklyGoal = (newGoal: number) => {
    setProgress((prev) => ({ ...prev, weeklyGoal: newGoal }));
    onGoalUpdate?.(newGoal);
  };

  // Get streak flame color based on length
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-red-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-blue-500';
  };

  // Get achievement rarity styling
  const getAchievementStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'border-purple-500 bg-purple-50 text-purple-700';
      case 'epic':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'rare':
        return 'border-green-500 bg-green-50 text-green-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  // Calculate meditation type distribution
  const meditationTypeStats = {
    mindfulness: 45,
    'breathing-exercise': 30,
    'guided-meditation': 15,
    'body-scan': 10,
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {formatMeditationTime(progress.totalMeditationTime * 60)}
                </p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{progress.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className={`h-8 w-8 ${getStreakColor(progress.currentStreak)}`} />
              <div>
                <p className="text-2xl font-bold">{progress.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{progress.averageRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>This Week's Progress</span>
                </CardTitle>
                <CardDescription>
                  {progress.weeklyProgress} of {progress.weeklyGoal} minutes completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Goal</span>
                    <span>{Math.round(weeklyGoalProgress)}%</span>
                  </div>
                  <Progress value={weeklyGoalProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{progress.sessionsThisWeek}</p>
                    <p className="text-muted-foreground">Sessions</p>
                  </div>
                  <div>
                    <p className="font-medium">
                      {formatMeditationTime(progress.averageSessionDuration * 60)}
                    </p>
                    <p className="text-muted-foreground">Avg Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.slice(0, 4).map((session, index) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {'type' in session ? getMeditationTypeIcon(session.type) : '🌬️'}
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {'type' in session
                              ? session.type.replace('-', ' ')
                              : session.technique.replace('-', ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.startTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatMeditationTime(session.duration)}
                        </p>
                        {'rating' in session && session.rating && (
                          <div className="flex items-center space-x-1">
                            {[...Array(session.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.weeklyStats.map((week, index) => (
                  <div
                    key={week.weekStartDate}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">{week.sessionsCompleted}</p>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{week.totalMinutes}m</p>
                        <p className="text-xs text-muted-foreground">Total Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{week.goalCompletion.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Goal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Week of {new Date(week.weekStartDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-sm">
                          {getMeditationTypeIcon(week.mostUsedTechnique)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {week.mostUsedTechnique.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Weekly Goal</span>
              </CardTitle>
              <CardDescription>Set your weekly meditation time goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[60, 90, 120, 150, 180, 210].map((goal) => (
                  <Button
                    key={goal}
                    size="sm"
                    variant={progress.weeklyGoal === goal ? 'default' : 'outline'}
                    onClick={() => updateWeeklyGoal(goal)}
                  >
                    {goal}m
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold">{progress.weeklyProgress}m</p>
                  <p className="text-muted-foreground">of {progress.weeklyGoal}m goal</p>
                </div>
                <Progress value={weeklyGoalProgress} className="h-4" />
                <p className="text-sm text-center text-muted-foreground">
                  {progress.weeklyGoal - progress.weeklyProgress}m remaining this week
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Streak Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flame className={`h-5 w-5 ${getStreakColor(progress.currentStreak)}`} />
                <span>Meditation Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">{progress.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{progress.longestStreak}</p>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next milestone</span>
                  <span>
                    {Math.min(
                      progress.currentStreak + (7 - (progress.currentStreak % 7)),
                      progress.currentStreak + 7
                    )}{' '}
                    days
                  </span>
                </div>
                <Progress value={(progress.currentStreak % 7) * (100 / 7)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Next Achievement */}
          {nextAchievement && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Next Achievement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{nextAchievement.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{nextAchievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
                    <div className="mt-2">
                      <Progress
                        value={
                          (nextAchievement.currentProgress / nextAchievement.requirement) * 100
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {nextAchievement.currentProgress} / {nextAchievement.requirement}
                      </p>
                    </div>
                  </div>
                  <Badge className={getAchievementStyle(nextAchievement.rarity)}>
                    {nextAchievement.rarity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {progress.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${achievement.isUnlocked ? 'border-green-200 bg-green-50' : 'opacity-60'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className={`text-3xl ${achievement.isUnlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <Badge
                          variant="outline"
                          className={getAchievementStyle(achievement.rarity)}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>

                      {achievement.isUnlocked ? (
                        <p className="text-xs text-green-600 mt-1">
                          Unlocked on {new Date(achievement.unlockedDate!).toLocaleDateString()}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <Progress
                            value={(achievement.currentProgress / achievement.requirement) * 100}
                            className="h-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.currentProgress} / {achievement.requirement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Meditation Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Meditation Type Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(meditationTypeStats).map(([type, percentage]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{getMeditationTypeIcon(type as MeditationType)}</span>
                        <span className="capitalize">{type.replace('-', ' ')}</span>
                      </div>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Personal Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Most Active Day</p>
                    <p className="text-xs text-muted-foreground">
                      You tend to meditate most on Sundays with an average of 25 minutes per
                      session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Progress Trend</p>
                    <p className="text-xs text-muted-foreground">
                      Your session duration has increased by 15% over the past month. Great
                      consistency!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Favorite Practice</p>
                    <p className="text-xs text-muted-foreground">
                      Mindfulness meditation is your go-to practice, making up 45% of your sessions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindfulnessProgressTracker;
