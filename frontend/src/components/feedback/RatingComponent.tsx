import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Star, Heart, ThumbsUp, Smile, Frown, Meh } from 'lucide-react';

interface RatingComponentProps {
  value?: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
  showEmoji?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stars' | 'emoji' | 'thumbs' | 'hearts';
  question?: string;
  required?: boolean;
  className?: string;
}

const ratingLabels = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

const ratingEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄',
};

const ratingColors = {
  1: 'text-red-500 hover:text-red-600',
  2: 'text-orange-500 hover:text-orange-600',
  3: 'text-yellow-500 hover:text-yellow-600',
  4: 'text-green-500 hover:text-green-600',
  5: 'text-blue-500 hover:text-blue-600',
};

export const RatingComponent: React.FC<RatingComponentProps> = ({
  value = 0,
  onChange,
  disabled = false,
  showEmoji = true,
  showLabels = true,
  size = 'md',
  variant = 'stars',
  question,
  required = false,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRatingClick = (rating: number) => {
    if (disabled) return;

    setIsAnimating(true);
    onChange?.(rating);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-5 w-5';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'hearts':
        return Heart;
      case 'thumbs':
        return ThumbsUp;
      case 'emoji':
        return Smile;
      default:
        return Star;
    }
  };

  const IconComponent = getIcon();

  const renderStarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = rating <= (hoverValue || value);
        const colorClass = ratingColors[rating as keyof typeof ratingColors];

        return (
          <Tooltip key={rating}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => !disabled && setHoverValue(rating)}
                onMouseLeave={() => !disabled && setHoverValue(0)}
                disabled={disabled}
                className={`transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                } ${isAnimating && rating === value ? 'animate-pulse' : ''}`}
              >
                <IconComponent
                  className={`${getSizeClasses()} ${
                    isActive ? `${colorClass} fill-current` : 'text-gray-300 hover:text-gray-400'
                  } transition-colors duration-200`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ratingLabels[rating as keyof typeof ratingLabels]}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );

  const renderEmojiRating = () => (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = rating === value;
        const isHovered = rating === hoverValue;

        return (
          <Tooltip key={rating}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => !disabled && setHoverValue(rating)}
                onMouseLeave={() => !disabled && setHoverValue(0)}
                disabled={disabled}
                className={`text-2xl gentle-transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2 ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'
                } ${isActive || isHovered ? 'bg-primary/10' : 'hover:bg-muted'}`}
              >
                {ratingEmojis[rating as keyof typeof ratingEmojis]}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ratingLabels[rating as keyof typeof ratingLabels]}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );

  const renderThumbsRating = () => (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = rating <= (hoverValue || value);

        return (
          <Tooltip key={rating}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => !disabled && setHoverValue(rating)}
                onMouseLeave={() => !disabled && setHoverValue(0)}
                disabled={disabled}
                className={`gentle-transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'
                } ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'} ${
                  isAnimating && rating <= value ? 'animate-pulse' : ''
                }`}
              >
                <ThumbsUp className={getSizeClasses()} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ratingLabels[rating as keyof typeof ratingLabels]}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );

  const getRatingDisplay = () => {
    switch (variant) {
      case 'emoji':
        return renderEmojiRating();
      case 'thumbs':
        return renderThumbsRating();
      default:
        return renderStarRating();
    }
  };

  return (
    <TooltipProvider>
      <div className={`space-y-3 ${className}`}>
        {question && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-foreground">{question}</p>
            {required && <span className="text-red-500 text-xs">*</span>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getRatingDisplay()}

            {showEmoji && variant !== 'emoji' && value > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xl">{ratingEmojis[value as keyof typeof ratingEmojis]}</span>
              </div>
            )}
          </div>

          {showLabels && value > 0 && (
            <Badge variant="secondary" className="text-xs">
              {ratingLabels[value as keyof typeof ratingLabels]}
            </Badge>
          )}
        </div>

        {value > 0 && <div className="text-xs text-muted-foreground">Rating: {value}/5</div>}
      </div>
    </TooltipProvider>
  );
};

// Quick satisfaction component for immediate feedback
interface QuickSatisfactionProps {
  onSelect?: (satisfaction: 'satisfied' | 'neutral' | 'dissatisfied') => void;
  value?: 'satisfied' | 'neutral' | 'dissatisfied';
  disabled?: boolean;
  question?: string;
  className?: string;
}

export const QuickSatisfaction: React.FC<QuickSatisfactionProps> = ({
  onSelect,
  value,
  disabled = false,
  question = 'How satisfied are you with this session?',
  className = '',
}) => {
  const options = [
    {
      key: 'dissatisfied' as const,
      icon: Frown,
      label: 'Dissatisfied',
      color: 'text-red-500 hover:text-red-600 hover:bg-red-50',
      activeColor: 'text-red-600 bg-red-100',
    },
    {
      key: 'neutral' as const,
      icon: Meh,
      label: 'Neutral',
      color: 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50',
      activeColor: 'text-yellow-600 bg-yellow-100',
    },
    {
      key: 'satisfied' as const,
      icon: Smile,
      label: 'Satisfied',
      color: 'text-green-500 hover:text-green-600 hover:bg-green-50',
      activeColor: 'text-green-600 bg-green-100',
    },
  ];

  return (
    <TooltipProvider>
      <div className={`space-y-3 ${className}`}>
        <p className="text-sm font-medium text-foreground">{question}</p>

        <div className="flex items-center justify-center space-x-4">
          {options.map(({ key, icon: Icon, label, color, activeColor }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => !disabled && onSelect?.(key)}
                  disabled={disabled}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'
                  } ${
                    value === key
                      ? `${activeColor} border-current`
                      : `${color} border-transparent hover:border-gray-200`
                  }`}
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rate as {label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

// Composite rating card for sessions
interface SessionRatingCardProps {
  sessionId?: string;
  counselorName?: string;
  sessionDate?: string;
  onRatingChange?: (ratings: {
    overall: number;
    helpfulness?: number;
    communication?: number;
    environment?: number;
  }) => void;
  disabled?: boolean;
  className?: string;
}

export const SessionRatingCard: React.FC<SessionRatingCardProps> = ({
  sessionId,
  counselorName,
  sessionDate,
  onRatingChange,
  disabled = false,
  className = '',
}) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    helpfulness: 0,
    communication: 0,
    environment: 0,
  });

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    const newRatings = { ...ratings, [category]: value };
    setRatings(newRatings);
    onRatingChange?.(newRatings);
  };

  return (
    <Card className={`hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-primary" />
          <span>Session Rating</span>
        </CardTitle>
        {(counselorName || sessionDate) && (
          <CardDescription>
            {counselorName && `Session with ${counselorName}`}
            {counselorName && sessionDate && ' • '}
            {sessionDate && new Date(sessionDate).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <RatingComponent
          question="Overall session experience"
          value={ratings.overall}
          onChange={(value) => handleRatingChange('overall', value)}
          disabled={disabled}
          required
          variant="stars"
          showEmoji
          showLabels
        />

        <RatingComponent
          question="How helpful was your counselor?"
          value={ratings.helpfulness}
          onChange={(value) => handleRatingChange('helpfulness', value)}
          disabled={disabled}
          variant="stars"
          size="sm"
        />

        <RatingComponent
          question="Communication effectiveness"
          value={ratings.communication}
          onChange={(value) => handleRatingChange('communication', value)}
          disabled={disabled}
          variant="stars"
          size="sm"
        />

        <RatingComponent
          question="Session environment"
          value={ratings.environment}
          onChange={(value) => handleRatingChange('environment', value)}
          disabled={disabled}
          variant="stars"
          size="sm"
        />

        {ratings.overall > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Rating:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  {(
                    Object.values(ratings).reduce((a, b) => a + b, 0) /
                    Object.values(ratings).filter((v) => v > 0).length
                  ).toFixed(1)}
                </span>
                <Star className="h-4 w-4 text-primary fill-current" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingComponent;
