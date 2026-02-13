import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  MusicTrack,
  MusicPlayerState,
  MusicPreferences,
  CALMING_MUSIC_TRACKS,
} from '@/types/music';
import { logAudioError, logUserPrefs } from '@/services/logger';

interface MusicContextType {
  playerState: MusicPlayerState;
  preferences: MusicPreferences;
  tracks: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseMusic: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleMinimize: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setEnabled: (enabled: boolean) => void;
  updatePreferences: (prefs: Partial<MusicPreferences>) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const STORAGE_KEY = 'mind_care_music_preferences';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load preferences from localStorage
  const loadPreferences = (): MusicPreferences => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logAudioError('Failed to load music preferences from localStorage', error as Error);
    }
    return {
      autoPlay: false,
      defaultVolume: 30,
      lastPlayedTrackId: null,
      enabled: true,
    };
  };

  const [preferences, setPreferences] = useState<MusicPreferences>(loadPreferences);
  const [playerState, setPlayerState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentTrack: null,
    volume: preferences.defaultVolume,
    isMuted: false,
    isMinimized: true,
  });

  // HTML5 Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = preferences.defaultVolume / 100;

      // Add event listeners
      audioRef.current.addEventListener('ended', () => {
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      });

      audioRef.current.addEventListener('error', (e) => {
        const audioError = new Error(`Audio playback error: ${e.type}`);
        logAudioError('Audio playback error occurred', audioError, { currentTrack: playerState.currentTrack?.id });
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [preferences.defaultVolume]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      logUserPrefs('Failed to save music preferences to localStorage', { preferences, error: error as Error });
    }
  }, [preferences]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.isMuted ? 0 : playerState.volume / 100;
    }
  }, [playerState.volume, playerState.isMuted]);

  const playTrack = useCallback(
    (track: MusicTrack) => {
      if (!audioRef.current || !track.url) return;

      try {
        // Stop current audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        // Load new track
        audioRef.current.src = track.url;
        audioRef.current.volume = playerState.volume / 100;
        audioRef.current.loop = true; // Ensure looping is enabled

        // Play the audio
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayerState((prev) => ({
                ...prev,
                currentTrack: track,
                isPlaying: true,
              }));

              setPreferences((prev) => ({
                ...prev,
                lastPlayedTrackId: track.id,
              }));
            })
            .catch((error) => {
              logAudioError('Failed to play audio track', error as Error, { trackId: track.id, trackName: track.title });
              setPlayerState((prev) => ({ ...prev, isPlaying: false }));
            });
        }
      } catch (error) {
        logAudioError('Failed to load audio track', error as Error, { trackId: track.id, trackUrl: track.url });
      }
    },
    [playerState.volume]
  );

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      pauseMusic();
    } else if (playerState.currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayerState((prev) => ({ ...prev, isPlaying: true }));
          })
          .catch((error) => {
            logAudioError('Failed to resume audio playback', error as Error, { currentTrack: playerState.currentTrack?.id });
          });
      }
    } else {
      // Play first track if none selected
      const firstTrack = CALMING_MUSIC_TRACKS[0];
      playTrack(firstTrack);
    }
  }, [playerState.isPlaying, playerState.currentTrack, playTrack, pauseMusic]);

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(100, volume));

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }

    setPlayerState((prev) => ({
      ...prev,
      volume: newVolume,
      isMuted: false,
    }));

    setPreferences((prev) => ({
      ...prev,
      defaultVolume: newVolume,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  const nextTrack = useCallback(() => {
    const currentIndex = playerState.currentTrack
      ? CALMING_MUSIC_TRACKS.findIndex((t) => t.id === playerState.currentTrack?.id)
      : -1;

    const nextIndex = (currentIndex + 1) % CALMING_MUSIC_TRACKS.length;
    playTrack(CALMING_MUSIC_TRACKS[nextIndex]);
  }, [playerState.currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    const currentIndex = playerState.currentTrack
      ? CALMING_MUSIC_TRACKS.findIndex((t) => t.id === playerState.currentTrack?.id)
      : -1;

    const prevIndex = currentIndex <= 0 ? CALMING_MUSIC_TRACKS.length - 1 : currentIndex - 1;
    playTrack(CALMING_MUSIC_TRACKS[prevIndex]);
  }, [playerState.currentTrack, playTrack]);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      setPreferences((prev) => ({
        ...prev,
        enabled,
      }));

      if (!enabled && playerState.isPlaying) {
        pauseMusic();
      }
    },
    [playerState.isPlaying, pauseMusic]
  );

  const updatePreferences = useCallback((prefs: Partial<MusicPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...prefs,
    }));
  }, []);

  const value: MusicContextType = {
    playerState,
    preferences,
    tracks: CALMING_MUSIC_TRACKS,
    playTrack,
    pauseMusic,
    togglePlay,
    setVolume,
    toggleMute,
    toggleMinimize,
    nextTrack,
    previousTrack,
    setEnabled,
    updatePreferences,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};
