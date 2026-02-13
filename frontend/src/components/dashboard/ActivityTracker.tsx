import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActivityLog, useAchievements } from '@/hooks/useDashboardFeatures';
import { useRealTimeUpdates, useSmoothAnimations } from '@/hooks/useRealTimeFeatures';
import { ProgressFeedback, AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import {
  Activity,
  MessageCircle,
  BookOpen,
  Users,
  Calendar,
  Trophy,
  Star,
  Zap,
  TrendingUp,
} from 'lucide-react';

const activityIcons = {
  chat: MessageCircle,
  resource: BookOpen,
  forum: Users,
  booking: Calendar,
};

const activityColors = {
  chat: 'bg-blue-100 text-blue-700',
  resource: 'bg-green-100 text-green-700',
  forum: 'bg-purple-100 text-purple-700',
  booking: 'bg-orange-100 text-orange-700',
};

export const ActivityTracker = () => {
  const { activities, getWeeklyStats, getRecentActivities } = useActivityLog();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition } = useSmoothAnimations();
  const weeklyStats = getWeeklyStats();
  const recentActivities = getRecentActivities(5);

  // Calculate activity streak (simplified)
  const activityStreak = React.useMemo(() => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayString = checkDate.toDateString();
      const hasActivity = activities.some(
        (activity) => new Date(activity.timestamp).toDateString() === dayString
      );
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [activities]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card className="enhanced-card hover:shadow-medium transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 transform transition-transform hover:scale-105">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
              <CardDescription className="text-sm">
                <AnimatedCounter value={weeklyStats.total} suffix=" activities this week" />
              </CardDescription>
            </div>
          </div>

          {activityStreak > 0 && (
            <div className="flex items-center space-x-1 text-orange-600 animate-in slide-in-from-right duration-300">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">{activityStreak} day streak</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weekly Stats with Progress Feedback */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg hover:shadow-sm transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Chats</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-xl font-bold text-blue-600">
                <AnimatedCounter value={weeklyStats.chat} />
              </div>
              <ProgressFeedback
                progress={Math.min((weeklyStats.chat / 10) * 100, 100)}
                label={`${weeklyStats.chat}/10`}
              />
            </div>
            <div className="text-xs text-muted-foreground">this week</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg hover:shadow-sm transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Resources</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-xl font-bold text-green-600">
                <AnimatedCounter value={weeklyStats.resource} />
              </div>
              <ProgressFeedback
                progress={Math.min((weeklyStats.resource / 5) * 100, 100)}
                label={`${weeklyStats.resource}/5`}
              />
            </div>
            <div className="text-xs text-muted-foreground">accessed</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg hover:shadow-sm transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Forum</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-xl font-bold text-purple-600">
                <AnimatedCounter value={weeklyStats.forum} />
              </div>
              <ProgressFeedback
                progress={Math.min((weeklyStats.forum / 3) * 100, 100)}
                label={`${weeklyStats.forum}/3`}
              />
            </div>
            <div className="text-xs text-muted-foreground">interactions</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg hover:shadow-sm transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-xl font-bold text-orange-600">
                <AnimatedCounter value={weeklyStats.booking} />
              </div>
              <ProgressFeedback
                progress={Math.min((weeklyStats.booking / 2) * 100, 100)}
                label={`${weeklyStats.booking}/2`}
              />
            </div>
            <div className="text-xs text-muted-foreground">booked</div>
          </div>
        </div>

        {/* Recent Activities with Smooth Transitions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
            <span>Recent Activity</span>
            {recentActivities.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {recentActivities.length}
              </Badge>
            )}
          </h4>
          {recentActivities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm animate-in fade-in duration-300">
              Start using the platform to see your activity here
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recentActivities.map((activity, index) => {
                const IconComponent = activityIcons[activity.type];
                return (
                  <div
                    key={activity.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-in slide-in-from-left duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => triggerUpdate('activity_viewed', { activity })}
                  >
                    <div
                      className={`p-1.5 rounded ${activityColors[activity.type]} transition-transform hover:scale-105`}
                    >
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AchievementTracker = () => {
  const { achievements, getUnlockedCount, getTotalCount } = useAchievements();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition } = useSmoothAnimations();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const recentUnlocked = unlockedAchievements.slice(-3);

  const completionPercentage = Math.round((getUnlockedCount() / getTotalCount()) * 100);

  return (
    <Card className="enhanced-card hover:shadow-medium transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 transform transition-transform hover:scale-105">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Achievements</CardTitle>
              <CardDescription className="text-sm">
                <AnimatedCounter
                  value={getUnlockedCount()}
                  suffix={` of ${getTotalCount()} unlocked`}
                />
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ProgressFeedback
              progress={completionPercentage}
              label={`${completionPercentage}%`}
              isAnimating={completionPercentage > 0}
            />
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 animate-in slide-in-from-right duration-300"
            >
              <Star className="h-3 w-3 mr-1" />
              {completionPercentage}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {getUnlockedCount() === 0 ? (
          <div className="text-center py-6 text-muted-foreground animate-in fade-in duration-500">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No achievements yet</p>
            <p className="text-xs">Start using features to unlock achievements!</p>
          </div>
        ) : (
          <>
            {/* Recent Unlocked with Celebration Animation */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <span>Recently Unlocked</span>
                {recentUnlocked.length > 0 && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                    {recentUnlocked.length} new
                  </Badge>
                )}
              </h4>
              <div className="space-y-2">
                {recentUnlocked.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200/50 animate-in slide-in-from-left duration-300 hover:shadow-sm transition-all cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => triggerUpdate('achievement_viewed', { achievement })}
                  >
                    <div className="text-2xl animate-pulse">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-yellow-600 font-medium">
                          Unlocked {formatTimeAgo(achievement.unlockedAt)}
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Achievements Preview with Hover Effects */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-sm font-medium text-muted-foreground">All Achievements</h4>
              <div className="grid grid-cols-6 gap-2">
                {achievements.slice(0, 12).map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`p-2 rounded-lg text-center transition-all duration-200 cursor-pointer animate-in zoom-in-50 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 hover:scale-110 hover:shadow-sm'
                        : 'bg-gray-100 opacity-50 hover:opacity-75'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    title={`${achievement.title}: ${achievement.description}${achievement.unlocked ? ' ✓ Unlocked' : ' 🔒 Locked'}`}
                    onClick={() => triggerUpdate('achievement_clicked', { achievement })}
                  >
                    <div className="text-lg">{achievement.icon}</div>
                    {achievement.unlocked && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1 animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs hover:bg-yellow-50 hover:border-yellow-200 transition-all duration-200"
          onClick={() => triggerUpdate('view_all_achievements')}
        >
          <Trophy className="h-3 w-3 mr-1" />
          View All Achievements
        </Button>
      </CardContent>
    </Card>
  );
};

// Helper function for formatting time
const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};
