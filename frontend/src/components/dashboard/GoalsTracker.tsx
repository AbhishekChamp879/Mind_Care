import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGoals, Goal } from '@/hooks/useDashboardFeatures';
import { useRealTimeUpdates, useSmoothAnimations } from '@/hooks/useRealTimeFeatures';
import {
  showRealTimeNotification,
  ProgressFeedback,
  AnimatedCounter,
} from '@/components/dashboard/RealTimeFeedback';
import { Target, Plus, Check, Calendar, Trash2, Edit, Sparkles } from 'lucide-react';

const categoryColors = {
  wellness: 'bg-green-100 text-green-700 border-green-200',
  academic: 'bg-blue-100 text-blue-700 border-blue-200',
  social: 'bg-purple-100 text-purple-700 border-purple-200',
  personal: 'bg-orange-100 text-orange-700 border-orange-200',
};

const categoryEmojis = {
  wellness: '🌿',
  academic: '📚',
  social: '👥',
  personal: '✨',
};

export const GoalsTracker = () => {
  const {
    goals,
    addGoal,
    updateGoalProgress,
    completeGoal,
    deleteGoal, // --- 1. GET THE NEW FUNCTION ---
    getActiveGoals,
    getWeeklyGoalProgress,
  } = useGoals();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition, isAnimating } = useSmoothAnimations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'wellness' as Goal['category'],
  });

  const activeGoals = getActiveGoals();
  const weeklyProgress = getWeeklyGoalProgress();

  const handleSubmit = () => {
    if (newGoal.title && newGoal.targetDate) {
      smoothTransition(() => {
        addGoal(newGoal.title, newGoal.description, newGoal.targetDate, newGoal.category);
        triggerUpdate('goal_created', newGoal);

        showRealTimeNotification('success', `New goal created: ${newGoal.title}`);

        setNewGoal({ title: '', description: '', targetDate: '', category: 'wellness' });
        setIsDialogOpen(false);
      });
    }
  };

  const handleProgressUpdate = (goalId: string, progress: number) => {
    smoothTransition(() => {
      const oldGoal = goals.find((g) => g.id === goalId);
      updateGoalProgress(goalId, progress);
      triggerUpdate('goal_progress_updated', { goalId, progress });

      showRealTimeNotification('success', `Progress updated: ${progress}%`);

      // Check for completion
      if (progress >= 100 && oldGoal && !oldGoal.completed) {
        showRealTimeNotification('achievement', `🎉 Goal completed: ${oldGoal.title}`);
      }
    });
  };

  const handleCompleteGoal = (goalId: string) => {
    smoothTransition(() => {
      const goal = goals.find((g) => g.id === goalId);
      completeGoal(goalId);
      triggerUpdate('goal_completed', { goalId });

      if (goal) {
        showRealTimeNotification('achievement', `🏆 Goal completed: ${goal.title}`);
      }
    });
  };
  
  // --- 2. ADD THIS NEW HANDLER FUNCTION ---
  const handleDeleteGoal = (goalId: string) => {
    smoothTransition(() => {
      const goal = goals.find((g) => g.id === goalId);
      deleteGoal(goalId);
      triggerUpdate('goal_deleted', { goalId });

      if (goal) {
        showRealTimeNotification('info', `Goal removed: ${goal.title}`);
      }
    });
  };
  // --- END OF ADDED HANDLER ---

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (targetDate: string) => {
    return new Date(targetDate) < new Date();
  };

  return (
    <Card
      className={`enhanced-card hover:shadow-medium transition-all duration-300 ${
        isAnimating ? 'scale-105 shadow-lg' : ''
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/20 transition-all duration-300 ${
                isAnimating ? 'scale-110' : ''
              }`}
            >
              <Target className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>Goals & Progress</span>
                {activeGoals.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-secondary/10 to-accent/10"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    <AnimatedCounter value={activeGoals.length} />
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                <AnimatedCounter value={activeGoals.length} suffix=" active goals" />
              </CardDescription>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-secondary text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a wellness goal to track your progress and stay motivated.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal Title</label>
                  <Input
                    placeholder="e.g., Exercise 3 times per week"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Add more details about your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value: Goal['category']) =>
                        setNewGoal({ ...newGoal, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wellness">🌿 Wellness</SelectItem>
                        <SelectItem value="academic">📚 Academic</SelectItem>
                        <SelectItem value="social">👥 Social</SelectItem>
                        <SelectItem value="personal">✨ Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Date</label>
                    <Input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!newGoal.title || !newGoal.targetDate}
                    className="flex-1 bg-gradient-secondary hover:shadow-glow"
                  >
                    Create Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewGoal({
                        title: '',
                        description: '',
                        targetDate: '',
                        category: 'wellness',
                      });
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {weeklyProgress > 0 && (
          <div className="p-3 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg transition-all duration-300 hover:scale-102">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weekly Progress</span>
              <span className="text-sm font-semibold text-secondary">
                <AnimatedCounter value={weeklyProgress} suffix="%" duration={1500} />
              </span>
            </div>
            <ProgressFeedback progress={weeklyProgress} label="" isAnimating={isAnimating} />
          </div>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activeGoals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active goals yet.</p>
              <p className="text-xs">Create your first goal to start tracking progress!</p>
            </div>
          ) : (
            activeGoals.slice(0, 4).map((goal) => (
              <div
                key={goal.id}
                className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{categoryEmojis[goal.category]}</span>
                      <h4 className="font-semibold text-sm truncate">{goal.title}</h4>
                    </div>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <Badge variant="outline" className={`text-xs ${categoryColors[goal.category]}`}>
                      {goal.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium">
                      <AnimatedCounter value={goal.progress} suffix="%" />
                    </span>
                  </div>
                  <ProgressFeedback progress={goal.progress} label="" isAnimating={isAnimating} />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className={isOverdue(goal.targetDate) ? 'text-red-500' : ''}>
                        {formatDate(goal.targetDate)}
                        {isOverdue(goal.targetDate) && ' (Overdue)'}
                      </span>
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105 hover:bg-secondary/10"
                        onClick={() =>
                          handleProgressUpdate(goal.id, Math.min(goal.progress + 25, 100))
                        }
                      >
                        +25%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 hover:scale-105"
                        onClick={() => handleCompleteGoal(goal.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>

                      {/* --- 3. ADD THE DELETE BUTTON HERE --- */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      {/* --- END OF ADDED BUTTON --- */}

                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {activeGoals.length > 4 && (
          <div className="text-center pt-2 border-t">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View all {activeGoals.length} goals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};