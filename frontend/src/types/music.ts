export type MusicTrack = {
  id: string;
  title: string;
  artist?: string;
  category: MusicCategory;
  duration?: number; // in seconds
  url?: string; // For actual audio files
  icon: string;
  color: string;
  description: string;
};

export type MusicCategory = 'nature' | 'ambient' | 'classical' | 'meditation' | 'lofi' | 'binaural';

export type MusicPlayerState = {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number; // 0-100
  isMuted: boolean;
  isMinimized: boolean;
};

export type MusicPreferences = {
  autoPlay: boolean;
  defaultVolume: number;
  lastPlayedTrackId: string | null;
  enabled: boolean;
};

// Predefined calming music tracks
export const CALMING_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'lofi-relax',
    title: 'Lo-Fi Relax',
    category: 'lofi',
    icon: '🎧',
    color: 'bg-blue-500',
    description: 'Chill lo-fi beats for relaxation and focus',
    url: '/music/lofi-study.mp3',
  },
];

export const MUSIC_CATEGORIES: { label: string; value: MusicCategory; icon: string }[] = [
  { label: 'All', value: 'lofi', icon: '🌍' },
  { label: 'Lo-Fi', value: 'lofi', icon: '🎧' },
];
