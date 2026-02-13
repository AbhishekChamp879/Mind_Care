import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Heart,
  CheckCircle,
} from 'lucide-react';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdEmpty?: number;
  };
  totalDuration: number; // in minutes
  benefits: string[];
}

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'A calming technique that helps reduce anxiety and promote sleep',
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    totalDuration: 3,
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal-count breathing used by Navy SEALs for stress management',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
    totalDuration: 5,
    benefits: ['Reduces stress', 'Improves focus', 'Enhances performance'],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Simple 5-second in, 5-second out pattern for balance',
    pattern: { inhale: 5, hold: 0, exhale: 5 },
    totalDuration: 10,
    benefits: ['Balances nervous system', 'Improves heart rate variability', 'Reduces stress'],
  },
  {
    id: 'bellows',
    name: 'Bellows Breath',
    description: 'Energizing breath to increase alertness and focus',
    pattern: { inhale: 2, hold: 0, exhale: 2 },
    totalDuration: 2,
    benefits: ['Increases energy', 'Improves alertness', 'Enhances focus'],
  },
];

const BreathingExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(
    BREATHING_EXERCISES[0]
  );
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>(
    'inhale'
  );
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const totalCycles =
    (selectedExercise.totalDuration * 60) /
    (selectedExercise.pattern.inhale +
      selectedExercise.pattern.hold +
      selectedExercise.pattern.exhale +
      (selectedExercise.pattern.holdEmpty || 0));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !sessionComplete) {
      interval = setInterval(() => {
        setPhaseProgress((prev) => {
          const currentPhaseDuration = selectedExercise.pattern[currentPhase];

          if (prev >= 100) {
            // Move to next phase
            const phases: Array<keyof typeof selectedExercise.pattern> = [
              'inhale',
              'hold',
              'exhale',
            ];
            if (selectedExercise.pattern.holdEmpty) {
              phases.push('holdEmpty');
            }

            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;

            if (nextIndex === 0) {
              // Completed a full cycle
              setCycleCount((prev) => {
                const newCount = prev + 1;
                const newTotalProgress = (newCount / totalCycles) * 100;
                setTotalProgress(newTotalProgress);

                if (newCount >= totalCycles) {
                  setSessionComplete(true);
                  setIsActive(false);
                }

                return newCount;
              });
            }

            setCurrentPhase(phases[nextIndex]);
            return 0;
          }

          return prev + 100 / ((currentPhaseDuration * 1000) / 100); // Update every 100ms
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, selectedExercise, totalCycles, sessionComplete]);

  const startExercise = () => {
    setIsActive(true);
    setSessionComplete(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setCycleCount(0);
    setTotalProgress(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setSessionComplete(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setCycleCount(0);
    setTotalProgress(0);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdEmpty':
        return 'Hold Empty';
      default:
        return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'text-blue-600';
      case 'hold':
        return 'text-yellow-600';
      case 'exhale':
        return 'text-green-600';
      case 'holdEmpty':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return `scale(${1 + (phaseProgress / 100) * 0.5})`;
      case 'exhale':
        return `scale(${1.5 - (phaseProgress / 100) * 0.5})`;
      default:
        return 'scale(1.5)';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20">
            <Wind className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-heading">Breathing Exercises</h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to reconnect with your breath. These guided exercises help reduce stress,
          improve focus, and promote overall well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Choose Exercise</CardTitle>
            <CardDescription>
              Select a breathing pattern that suits your current needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedExercise.id}
              onValueChange={(value) => {
                const exercise = BREATHING_EXERCISES.find((ex) => ex.id === value);
                if (exercise) {
                  setSelectedExercise(exercise);
                  resetExercise();
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BREATHING_EXERCISES.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-3">
              <h4 className="font-medium">Pattern</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Inhale:</span>
                  <span className="font-medium">{selectedExercise.pattern.inhale}s</span>
                </div>
                {selectedExercise.pattern.hold > 0 && (
                  <div className="flex justify-between">
                    <span>Hold:</span>
                    <span className="font-medium">{selectedExercise.pattern.hold}s</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Exhale:</span>
                  <span className="font-medium">{selectedExercise.pattern.exhale}s</span>
                </div>
                {selectedExercise.pattern.holdEmpty && (
                  <div className="flex justify-between">
                    <span>Hold Empty:</span>
                    <span className="font-medium">{selectedExercise.pattern.holdEmpty}s</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Benefits</h4>
              <ul className="text-sm space-y-1">
                {selectedExercise.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span className="text-sm">{selectedExercise.totalDuration} minutes</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Breathing Animation */}
        <Card className="lg:col-span-2">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-8">
              {/* Breathing Circle */}
              <div className="relative flex items-center justify-center w-64 h-64">
                <div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-green-500/30 transition-transform duration-1000 ease-in-out flex items-center justify-center"
                  style={{ transform: getCircleScale() }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 opacity-80" />
                </div>

                {/* Progress Ring */}
                <svg className="absolute w-64 h-64 -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - phaseProgress / 100)}`}
                    className={`transition-all duration-100 ${getPhaseColor()}`}
                  />
                </svg>
              </div>

              {/* Phase Instruction */}
              <div className="text-center space-y-2">
                <h2
                  className={`text-3xl font-bold transition-colors duration-300 ${getPhaseColor()}`}
                >
                  {getPhaseInstruction()}
                </h2>
                <p className="text-muted-foreground">
                  {selectedExercise.pattern[currentPhase]} seconds
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {!isActive && !sessionComplete ? (
                  <Button onClick={startExercise} size="lg" className="px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : isActive ? (
                  <Button onClick={pauseExercise} variant="outline" size="lg" className="px-8">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                ) : null}

                <Button onClick={resetExercise} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Progress */}
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {cycleCount} of {Math.ceil(totalCycles)} cycles
                  </span>
                </div>
                <Progress value={totalProgress} className="h-2" />
              </div>

              {/* Session Complete */}
              {sessionComplete && (
                <Card className="w-full max-w-md bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Session Complete!</h3>
                    <p className="text-sm text-green-600 mt-1">
                      Great job! You've completed your {selectedExercise.totalDuration}-minute
                      breathing session.
                    </p>
                    <Button onClick={resetExercise} className="mt-3" size="sm">
                      Start New Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathingExercises;
