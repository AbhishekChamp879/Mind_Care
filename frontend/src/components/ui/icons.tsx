'use client';

import { 
  StarIcon,
  HeartIcon,
  MoonIcon,
  FaceSmileIcon,
  BeakerIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

export const icons = {
  Star: StarIcon,
  Heart: HeartIcon,
  Moon: MoonIcon,
  Smile: FaceSmileIcon,
  Brain: BeakerIcon,
  Activity: BoltIcon,
  Target: FireIcon,
  Sparkles: SparklesIcon,
  Lightbulb: LightBulbIcon,
  Rotate: ArrowPathIcon,
  CheckCircle: CheckCircleIcon,
  Bookmark: BookmarkIcon,
} as const;

export type IconName = keyof typeof icons;