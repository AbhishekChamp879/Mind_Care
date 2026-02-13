import React from 'react';
import { MoodTracker } from './MoodTracker';
import { GoalsTracker } from './GoalsTracker';
import { ActivityTracker, AchievementTracker } from './ActivityTracker';
import { EnhancedDailyTips } from './EnhancedDailyTips';
import { InteractiveAnalytics } from './InteractiveAnalytics';

// Component to test all dashboard components
export const ComponentTest = () => {
  try {
    return (
      <div className="space-y-4">
        <div>✅ All dashboard components imported successfully</div>
        <div className="grid gap-4">
          <MoodTracker />
          <GoalsTracker />
          <ActivityTracker />
          <AchievementTracker />
          <EnhancedDailyTips />
          <InteractiveAnalytics />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">❌ Error loading dashboard components: {error?.toString()}</div>
    );
  }
};
