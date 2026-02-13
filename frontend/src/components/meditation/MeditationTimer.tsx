/**
 * @fileoverview MeditationTimer - Comprehensive guided meditation and mindfulness timer
 * 
 * A feature-rich meditation timer component that supports various meditation types,
 * ambient soundscapes, session tracking, and progress monitoring for mental wellness.
 * 
 * Features:
 * - Multiple meditation types (breathing, mindfulness, body scan, loving-kindness)
 * - Customizable session duration (5 min to 2+ hours)
 * - Ambient sound integration for enhanced focus
 * - Session completion tracking and analytics
 * - Interruption handling and resume capability
 * - Visual progress indicators and calming animations
 * - Accessibility support for meditation guidance
 * 
 * Meditation Types:
 * - Breathing: Focused breath awareness exercises
 * - Mindfulness: Present-moment awareness practice
 * - Body Scan: Progressive relaxation technique
 * - Loving-Kindness: Compassion and empathy cultivation
 * - Walking: Moving meditation for active practice
 * 
 * @example
 * ```tsx
 * // Basic meditation timer
 * <MeditationTimer />
 * 
 * // With session completion tracking
 * <MeditationTimer
 *   onSessionComplete={(data) => {
 *     console.log('Session completed:', data.duration);
 *     updateWellnessMetrics(data);
 *   }}
 *   onSessionStart={() => setMeditating(true)}
 * />
 * 
 * // Custom styling for different contexts
 * <MeditationTimer 
 *   className="crisis-mode-timer"
 *   onSessionPause={() => logInterruption()}
 * />
 * ```
 * 
 * @see {@link ../../types/meditation} For meditation-related type definitions
 * @see {@link ../ui/progress} For progress visualization components
 * @see {@link ./AmbientSoundPlayer} For integrated sound features
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Settings,
  Bell,
  Heart,
} from 'lucide-react';
import {
  MeditationTimer as TimerType,
  MeditationType,
  AmbientSoundType,
  formatMeditationTime,
  calculateSessionCompletion,
} from '@/types/meditation';

/**
 * Props interface for the MeditationTimer component.
 * 
 * @interface MeditationTimerProps
 */
interface MeditationTimerProps {
  /**
   * Callback fired when a meditation session completes successfully.
   * 
   * Provides comprehensive session data for analytics and progress tracking:
   * - duration: Intended session length in minutes
   * - actualDuration: Actual time meditated (may differ if interrupted)
   * - type: Type of meditation practiced
   * - ambientSound: Background sound used (if any)
   * - interrupted: Whether the session was paused/stopped early
   * 
   * @param sessionData - Complete session metrics and metadata
   */
  onSessionComplete?: (sessionData: {
    duration: number;
    actualDuration: number;
    type: MeditationType;
    ambientSound?: AmbientSoundType;
    interrupted: boolean;
  }) => void;
  
  /**
   * Callback fired when a meditation session begins.
   * Useful for updating parent component state or triggering analytics.
   */
  onSessionStart?: () => void;
  
  /**
   * Callback fired when a meditation session is paused.
   * Can be used to log interruptions or provide supportive feedback.
   */
  onSessionPause?: () => void;
  
  /**
   * Additional CSS classes for custom styling.
   * Allows integration with different dashboard layouts or themes.
   */
  className?: string;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  onSessionComplete,
  onSessionStart,
  onSessionPause,
  className = '',
}) => {
  // Timer state
  const [timer, setTimer] = useState<TimerType>({
    duration: 300, // 5 minutes default
    elapsed: 0,
    remaining: 300,
    isActive: false,
    isPaused: false,
    isCompleted: false,
    pausedTime: 0,
    intervals: [],
  });

  // Settings state
  const [selectedDuration, setSelectedDuration] = useState(5); // minutes
  const [meditationType, setMeditationType] = useState<MeditationType>('mindfulness');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('rain');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(50);
  const [bellEnabled, setBellEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Refs for timer management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Preset durations in minutes
  const presetDurations = [3, 5, 10, 15, 20, 25, 30, 45, 60];

  // Update timer duration when preset changes
  useEffect(() => {
    if (!timer.isActive) {
      const newDuration = selectedDuration * 60;
      setTimer((prev) => ({
        ...prev,
        duration: newDuration,
        remaining: newDuration,
        elapsed: 0,
      }));
    }
  }, [selectedDuration, timer.isActive]);

  // Timer logic
  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
    const remaining = Math.max(timer.duration - elapsed, 0);
    const isCompleted = remaining === 0;

    setTimer((prev) => ({
      ...prev,
      elapsed,
      remaining,
      isCompleted,
    }));

    // Handle completion
    if (isCompleted && timer.isActive) {
      handleComplete();
    }
  }, [timer.duration, timer.isActive]);

  // Start timer effect
  useEffect(() => {
    if (timer.isActive && !timer.isPaused) {
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
  }, [timer.isActive, timer.isPaused, updateTimer]);

  const handleStart = () => {
    const now = Date.now();

    if (!timer.isActive) {
      // Starting fresh session
      startTimeRef.current = now;
      pausedTimeRef.current = 0;
      onSessionStart?.();
    } else if (timer.isPaused) {
      // Resuming from pause
      const pauseDuration = now - (timer.pausedStartTime || now);
      pausedTimeRef.current += pauseDuration;
    }

    setTimer((prev) => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime: startTimeRef.current,
      pausedStartTime: undefined,
    }));
  };

  const handlePause = () => {
    setTimer((prev) => ({
      ...prev,
      isPaused: true,
      pausedStartTime: Date.now(),
    }));
    onSessionPause?.();
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Calculate session data
    const sessionData = {
      duration: timer.duration,
      actualDuration: timer.elapsed,
      type: meditationType,
      ambientSound: soundEnabled ? ambientSound : undefined,
      interrupted: timer.elapsed < timer.duration * 0.8, // Less than 80% completed
    };

    onSessionComplete?.(sessionData);
    handleReset();
  };

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Play completion bell if enabled
    if (bellEnabled) {
      playCompletionBell();
    }

    const sessionData = {
      duration: timer.duration,
      actualDuration: timer.duration,
      type: meditationType,
      ambientSound: soundEnabled ? ambientSound : undefined,
      interrupted: false,
    };

    onSessionComplete?.(sessionData);

    setTimer((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      isCompleted: true,
    }));
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    const newDuration = selectedDuration * 60;
    setTimer({
      duration: newDuration,
      elapsed: 0,
      remaining: newDuration,
      isActive: false,
      isPaused: false,
      isCompleted: false,
      pausedTime: 0,
      intervals: [],
    });
  };

  const playCompletionBell = () => {
    // In a real implementation, you would play an actual audio file
    if ('AudioContext' in window) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const getMeditationTypeColor = (type: MeditationType): string => {
    const colors = {
      mindfulness: 'bg-blue-500',
      'breathing-exercise': 'bg-green-500',
      'guided-meditation': 'bg-purple-500',
      'body-scan': 'bg-indigo-500',
      'loving-kindness': 'bg-pink-500',
      'zen-meditation': 'bg-gray-500',
      'free-meditation': 'bg-yellow-500',
    };
    return colors[type] || 'bg-blue-500';
  };

  const getAmbientSoundIcon = (sound: AmbientSoundType): string => {
    const icons = {
      rain: '🌧️',
      'ocean-waves': '🌊',
      forest: '🌲',
      fireplace: '🔥',
      'white-noise': '📊',
      'tibetan-bowls': '🎵',
      'mountain-stream': '🏔️',
      thunder: '⛈️',
      wind: '💨',
      birds: '🐦',
      crickets: '🦗',
      'cafe-ambience': '☕',
      chimes: '🔔',
      'pink-noise': '📈',
      'brown-noise': '📉',
      silence: '🤫',
    };
    return icons[sound] || '🔊';
  };

  const progress = calculateSessionCompletion(timer.elapsed, timer.duration);
  const isRunning = timer.isActive && !timer.isPaused;

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Meditation Timer</span>
        </CardTitle>
        <CardDescription>
          {timer.isCompleted
            ? 'Session Complete!'
            : timer.isActive
              ? `${meditationType.replace('-', ' ').toUpperCase()}`
              : 'Ready to begin your practice'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div
            className={`relative w-48 h-48 mx-auto rounded-full border-8 ${getMeditationTypeColor(meditationType)} border-opacity-20 flex items-center justify-center`}
          >
            {/* Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`${getMeditationTypeColor(meditationType).replace('bg-', 'text-')} transition-all duration-300`}
                strokeLinecap="round"
              />
            </svg>

            {/* Time Display */}
            <div className="text-center z-10">
              <div className="text-3xl font-mono font-bold text-foreground">
                {formatMeditationTime(timer.remaining)}
              </div>
              <div className="text-sm text-muted-foreground">
                {timer.isActive ? `${formatMeditationTime(timer.elapsed)} elapsed` : 'remaining'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">{Math.round(progress)}% complete</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3">
          {!timer.isActive ? (
            <Button 
              onClick={handleStart} 
              size="lg" 
              className="flex items-center space-x-2"
              aria-label="Start meditation timer"
            >
              <Play className="h-5 w-5" />
              <span>Start</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={isRunning ? handlePause : handleStart}
                size="lg"
                variant="outline"
                className="flex items-center space-x-2"
                aria-label={isRunning ? 'Pause meditation timer' : 'Resume meditation timer'}
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isRunning ? 'Pause' : 'Resume'}</span>
              </Button>
              <Button
                onClick={handleStop}
                size="lg"
                variant="destructive"
                className="flex items-center space-x-2"
                aria-label="Stop meditation timer"
              >
                <Square className="h-5 w-5" />
                <span>Stop</span>
              </Button>
            </>
          )}

          <Button
            onClick={handleReset}
            size="lg"
            variant="ghost"
            aria-label="Reset meditation timer"
            disabled={timer.isActive && !timer.isPaused}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button onClick={() => setShowSettings(!showSettings)} size="lg" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Session Settings</h3>

            {/* Duration Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <div className="flex flex-wrap gap-2">
                {presetDurations.map((duration) => (
                  <Button
                    key={duration}
                    size="sm"
                    variant={selectedDuration === duration ? 'default' : 'outline'}
                    onClick={() => setSelectedDuration(duration)}
                    disabled={timer.isActive}
                  >
                    {duration}m
                  </Button>
                ))}
              </div>
            </div>

            {/* Meditation Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['mindfulness', 'breathing-exercise', 'guided-meditation', 'body-scan'].map(
                  (type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={meditationType === type ? 'default' : 'outline'}
                      onClick={() => setMeditationType(type as MeditationType)}
                      disabled={timer.isActive}
                      className="justify-start"
                    >
                      {type.replace('-', ' ')}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Ambient Sound */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Ambient Sound</label>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              {soundEnabled && (
                <>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      'rain',
                      'ocean-waves',
                      'forest',
                      'fireplace',
                      'white-noise',
                      'tibetan-bowls',
                    ].map((sound) => (
                      <Button
                        key={sound}
                        size="sm"
                        variant={ambientSound === sound ? 'default' : 'outline'}
                        onClick={() => setAmbientSound(sound as AmbientSoundType)}
                        className="flex flex-col items-center p-2 h-auto"
                      >
                        <span className="text-lg mb-1">
                          {getAmbientSoundIcon(sound as AmbientSoundType)}
                        </span>
                        <span className="text-xs">{sound.replace('-', ' ')}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Volume</span>
                      <span className="text-sm font-mono">{soundVolume}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <VolumeX className="h-4 w-4" />
                      <Slider
                        value={[soundVolume]}
                        onValueChange={(value) => setSoundVolume(value[0])}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Completion Bell */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <label className="text-sm font-medium">Completion Bell</label>
              </div>
              <Switch checked={bellEnabled} onCheckedChange={setBellEnabled} />
            </div>
          </div>
        )}

        {/* Session Status */}
        {(timer.isActive || timer.isCompleted) && (
          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-2">
              <Badge variant={timer.isCompleted ? 'default' : 'secondary'}>
                {timer.isCompleted ? 'Complete' : timer.isPaused ? 'Paused' : 'Active'}
              </Badge>
              {soundEnabled && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>{getAmbientSoundIcon(ambientSound)}</span>
                  <span className="text-xs">{ambientSound.replace('-', ' ')}</span>
                </Badge>
              )}
            </div>

            {timer.isCompleted && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Great work! Session completed successfully.</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeditationTimer;
