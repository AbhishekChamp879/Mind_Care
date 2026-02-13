/**
 * Loading States Components Index
 * 
 * Central export file for loading state components in the Mind Care platform.
 * Import components directly from their source files for better tree-shaking.
 * 
 * @example
 * ```tsx
 * // Import spinner components
 * import { Spinner, InlineSpinner } from '@/components/ui/spinner';
 * 
 * // Import loading animations  
 * import { HeartbeatLoader, BreathingLoader } from '@/components/ui/loading-animations';
 * 
 * // Import skeleton loaders
 * import { MoodTrackerSkeleton } from '@/components/ui/loading-skeletons';
 * ```
 */

// Re-export types for convenience
export type { SpinnerProps } from '../ui/spinner';

// Note: Import components directly from their source files for better performance:
// - Spinners: '@/components/ui/spinner'
// - Animations: '@/components/ui/loading-animations'  
// - Skeletons: '@/components/ui/loading-skeletons'
// - Enhanced Components: '@/components/dashboard/EnhancedMoodTracker'

export default {};