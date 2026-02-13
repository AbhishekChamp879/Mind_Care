import React from 'react';
type FC<P = Record<string, never>> = React.FunctionComponent<P>;
import { Progress } from '@/components/ui/progress';
import { User as UserType } from '@/types/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ProfileCompletenessProps {
  user: UserType;
}

export const ProfileCompleteness: FC<ProfileCompletenessProps> = ({ user }) => {
  const calculateCompleteness = () => {
    const requiredFields = ['name', 'email', 'phone', 'dateOfBirth'] as const;
    const roleSpecificFields = {
      student: ['university', 'major', 'year', 'studentId'] as const,
      counselor: ['license', 'experience', 'specialization'] as const,
      admin: ['department', 'permissions'] as const
    } as const;

    const fieldsToCheck = [...requiredFields, ...(roleSpecificFields[user.role] || [])];
    const totalFields = fieldsToCheck.length;
    const completedFields = fieldsToCheck.filter(field => {
      const value = user[field as keyof UserType];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    }).length;

    return Math.round((completedFields / totalFields) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Profile Completeness</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </TooltipTrigger>
            <TooltipContent>
              <p>Complete your profile to unlock all features</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={completeness} className="h-2 mb-2" />
      <p className="text-sm text-muted-foreground">
        {completeness}% Complete {' '}
        {Number(completeness) < 100 && '• Fill in missing information'}
      </p>
    </div>
  );
};