import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Wind,
  Timer,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  BreathingExercise,
  BreathingSession,
  BreathingTechnique,
  BreathingPhase,
  BREATHING_EXERCISES,
  formatMeditationTime,
  getBreathingPhaseColor,
} from '@/types/meditation';

interface BreathingAnimationProps {
  onSessionComplete?: (session: BreathingSession) => void;
  onSessionStart?: () => void;
  onSessionPause?: () => void;
  selectedTechnique?: BreathingTechnique;
  className?: string;
}

export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  onSessionComplete,
  onSessionStart,
  onSessionPause,
  selectedTechnique = '4-7-8-breathing',
  className = '',
}) => {
  // Get the selected exercise
  const exercise =
    BREATHING_EXERCISES.find((ex) => ex.type === selectedTechnique) || BREATHING_EXERCISES[0];

  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(exercise.phases[0].duration);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [targetCycles, setTargetCycles] = useState(exercise.recommendedCycles);

  // Animation state
  const [animationScale, setAnimationScale] = useState(1);
  const [animationColor, setAnimationColor] = useState(exercise.phases[0].color);
  const [breathingInstruction, setBreathingInstruction] = useState(exercise.phases[0].instruction);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number | null>(null);

  const currentPhase = exercise.phases[currentPhaseIndex];
  const totalDuration = targetCycles * exercise.totalCycleDuration;
  const progress = isCompleted ? 100 : (totalElapsed / totalDuration) * 100;

  // Reset when exercise changes
  useEffect(() => {
    handleReset();
  }, [selectedTechnique]);

  // Animation effect for breathing phases
  useEffect(() => {
    if (!isActive || isPaused) return;

    const updateAnimation = () => {
      const phase = exercise.phases[currentPhaseIndex];
      const elapsed =
        phaseTimeRemaining === phase.duration ? 0 : phase.duration - phaseTimeRemaining;
      const phaseProgress = elapsed / phase.duration;

      // Update animation based on phase type
      switch (phase.animation) {
        case 'expand':
        case 'inhale':
          setAnimationScale(1 + phaseProgress * 0.8); // Scale from 1 to 1.8
          break;
        case 'contract':
        case 'exhale':
          setAnimationScale(1.8 - phaseProgress * 0.8); // Scale from 1.8 to 1
          break;
        case 'hold':
        case 'pause':
          setAnimationScale(1.8); // Hold at expanded state
          break;
        default:
          setAnimationScale(1);
      }

      setAnimationColor(phase.color);
      setBreathingInstruction(phase.instruction);
    };

    updateAnimation();
  }, [currentPhaseIndex, phaseTimeRemaining, isActive, isPaused, exercise.phases]);

  // Timer logic
  const updateTimer = useCallback(() => {
    if (!sessionStartRef.current || !phaseStartRef.current) return;

    const now = Date.now();
    const sessionElapsed = Math.floor((now - sessionStartRef.current) / 1000);
    const phaseElapsed = Math.floor((now - phaseStartRef.current) / 1000);
    const remaining = Math.max(currentPhase.duration - phaseElapsed, 0);

    setTotalElapsed(sessionElapsed);
    setPhaseTimeRemaining(remaining);

    // Check if current phase is complete
    if (remaining === 0) {
      moveToNextPhase();
    }
  }, [currentPhase.duration, currentCycle, currentPhaseIndex]);

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(updateTimer, 100);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive, isPaused, updateTimer]);

  const moveToNextPhase = () => {
    const nextPhaseIndex = (currentPhaseIndex + 1) % exercise.phases.length;

    // If we've completed all phases, increment cycle
    if (nextPhaseIndex === 0) {
      const nextCycle = currentCycle + 1;
      setCurrentCycle(nextCycle);

      // Check if we've completed all cycles
      if (nextCycle >= targetCycles) {
        handleComplete();
        return;
      }
    }

    setCurrentPhaseIndex(nextPhaseIndex);
    setPhaseTimeRemaining(exercise.phases[nextPhaseIndex].duration);
    phaseStartRef.current = Date.now();
  };

  const handleStart = () => {
    const now = Date.now();

    if (!isActive) {
      // Starting fresh session
      sessionStartRef.current = now;
      phaseStartRef.current = now;
      onSessionStart?.();
    } else if (isPaused) {
      // Resuming from pause - adjust start times
      const pauseDuration = now - (pauseStartRef.current || now);
      if (sessionStartRef.current) sessionStartRef.current += pauseDuration;
      if (phaseStartRef.current) phaseStartRef.current += pauseDuration;
    }

    setIsActive(true);
    setIsPaused(false);
  };

  const pauseStartRef = useRef<number | null>(null);

  const handlePause = () => {
    pauseStartRef.current = Date.now();
    setIsPaused(true);
    onSessionPause?.();
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const sessionData: BreathingSession = {
      id: `breathing_${Date.now()}`,
      userId: 'current_user', // This would come from auth context
      technique: exercise.type,
      cyclesCompleted: currentCycle,
      targetCycles: targetCycles,
      duration: totalElapsed,
      startTime: new Date(sessionStartRef.current || Date.now()).toISOString(),
      endTime: new Date().toISOString(),
      completed: false,
    };

    onSessionComplete?.(sessionData);
    handleReset();
  };

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsCompleted(true);
    setIsActive(false);

    const sessionData: BreathingSession = {
      id: `breathing_${Date.now()}`,
      userId: 'current_user',
      technique: exercise.type,
      cyclesCompleted: targetCycles,
      targetCycles: targetCycles,
      duration: totalElapsed,
      startTime: new Date(sessionStartRef.current || Date.now()).toISOString(),
      endTime: new Date().toISOString(),
      completed: true,
    };

    onSessionComplete?.(sessionData);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentCycle(0);
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(exercise.phases[0].duration);
    setTotalElapsed(0);
    setAnimationScale(1);
    setAnimationColor(exercise.phases[0].color);
    setBreathingInstruction(exercise.phases[0].instruction);

    sessionStartRef.current = null;
    phaseStartRef.current = null;
    pauseStartRef.current = null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isRunning = isActive && !isPaused;

  return (
    <Card className={`w-full max-w-lg mx-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Wind className="h-5 w-5" />
          <span>{exercise.name}</span>
        </CardTitle>
        <CardDescription className="space-y-2">
          <p>{exercise.description}</p>
          <div className="flex justify-center space-x-2">
            <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline">{exercise.totalCycleDuration}s cycle</Badge>
            <Badge variant="outline">{targetCycles} cycles</Badge>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Breathing Animation Circle */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Outer ring for progress */}
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>

            {/* Animated breathing circle */}
            <div
              className="absolute inset-8 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center"
              style={{
                transform: `scale(${animationScale})`,
                backgroundColor: animationColor,
                opacity: 0.8,
                boxShadow: `0 0 30px ${animationColor}80`,
              }}
            >
              <div className="text-center text-white font-medium">
                <div className="text-lg">{currentPhase.name}</div>
                <div className="text-sm opacity-90">{phaseTimeRemaining}s</div>
              </div>
            </div>

            {/* Center content when not animating */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Wind className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Ready to breathe</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Instruction */}
        {isActive && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{breathingInstruction}</h3>
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <span>
                Cycle: {currentCycle + 1}/{targetCycles}
              </span>
              <span>Phase: {currentPhase.name}</span>
              <span>{formatMeditationTime(phaseTimeRemaining)} remaining</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Session Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {formatMeditationTime(totalElapsed)} / {formatMeditationTime(totalDuration)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Start Breathing</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={isRunning ? handlePause : handleStart}
                size="lg"
                variant="outline"
                className="flex items-center space-x-2"
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isRunning ? 'Pause' : 'Resume'}</span>
              </Button>
              <Button
                onClick={handleStop}
                size="lg"
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Square className="h-5 w-5" />
                <span>Stop</span>
              </Button>
            </>
          )}

          <Button onClick={handleReset} size="lg" variant="ghost" disabled={isActive && !isPaused}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Cycle Settings */}
        {!isActive && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Target Cycles</label>
              <div className="flex space-x-2">
                {[3, 4, 6, 8, 10].map((cycles) => (
                  <Button
                    key={cycles}
                    size="sm"
                    variant={targetCycles === cycles ? 'default' : 'outline'}
                    onClick={() => setTargetCycles(cycles)}
                  >
                    {cycles}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Estimated duration: {formatMeditationTime(targetCycles * exercise.totalCycleDuration)}
            </div>
          </div>
        )}

        {/* Exercise Benefits */}
        {!isActive && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span className="font-medium">Benefits:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
              {exercise.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div className="text-center space-y-2 border-t pt-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Breathing exercise completed!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You completed {targetCycles} cycles of {exercise.name} in{' '}
              {formatMeditationTime(totalElapsed)}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Technique Selector Component
interface BreathingTechniqueSelectorProps {
  selectedTechnique: BreathingTechnique;
  onTechniqueChange: (technique: BreathingTechnique) => void;
  disabled?: boolean;
  className?: string;
}

export const BreathingTechniqueSelector: React.FC<BreathingTechniqueSelectorProps> = ({
  selectedTechnique,
  onTechniqueChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Choose a Breathing Technique</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BREATHING_EXERCISES.map((exercise) => (
          <Card
            key={exercise.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTechnique === exercise.type
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onTechniqueChange(exercise.type)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{exercise.totalCycleDuration}s cycle</span>
                  <span>{exercise.recommendedCycles} cycles</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {exercise.benefits.slice(0, 2).map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit.split(' ').slice(0, 2).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 bg-green-50';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-50';
    case 'advanced':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default BreathingAnimation;
