'use client';

import React from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { CreateTypes } from 'canvas-confetti';

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

interface ConfettiOptions {
  spread: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
  colors?: string[];
  origin?: {
    x?: number;
    y?: number;
  };
  particleCount?: number;
}

export function ConfettiEffect({ active, onComplete }: ConfettiEffectProps) {
  const [confetti, setConfetti] = React.useState<CreateTypes | null>(null);

  const makeShot = React.useCallback((opts: ConfettiOptions) => {
    confetti?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * (opts.spread / 100)),
    });
  }, [confetti]);

  const fire = React.useCallback(() => {
    makeShot({
      spread: 26,
      startVelocity: 55,
      colors: ['#4F46E5', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    makeShot({
      spread: 60,
      colors: ['#4F46E5', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    makeShot({
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#4F46E5', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    makeShot({
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#4F46E5', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    makeShot({
      spread: 120,
      startVelocity: 45,
      colors: ['#4F46E5', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });
  }, [makeShot]);

  React.useEffect(() => {
    if (active && confetti) {
      fire();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, confetti, fire, onComplete]);

  const getConfettiInstance = React.useCallback((instance: CreateTypes | null) => {
    setConfetti(instance);
  }, []);

  return (
    <ReactCanvasConfetti
      onInit={getConfettiInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    />
  );
}