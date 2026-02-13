import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logAudioError } from '@/services/logger';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Music,
  Waves,
  TreePine,
  Flame,
  Zap,
  Bell,
  Coffee,
} from 'lucide-react';
import { AmbientSound, AmbientSoundType, SoundCategory, AMBIENT_SOUNDS } from '@/types/meditation';

interface AmbientSoundPlayerProps {
  onSoundChange?: (sound: AmbientSoundType | null) => void;
  onVolumeChange?: (volume: number) => void;
  autoPlay?: boolean;
  defaultSound?: AmbientSoundType;
  defaultVolume?: number;
  className?: string;
}

export const AmbientSoundPlayer: React.FC<AmbientSoundPlayerProps> = ({
  onSoundChange,
  onVolumeChange,
  autoPlay = false,
  defaultSound,
  defaultVolume = 50,
  className = '',
}) => {
  // State
  const [selectedSound, setSelectedSound] = useState<AmbientSoundType | null>(defaultSound || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio context and nodes for web audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // For simulated audio (since we don't have actual audio files)
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize audio context
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      analyserRef.current = audioContextRef.current.createAnalyser();

      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Generate noise buffer for nature sounds
  const createNoiseBuffer = useCallback((type: 'white' | 'pink' | 'brown', length: number = 2) => {
    if (!audioContextRef.current) return null;

    const bufferSize = audioContextRef.current.sampleRate * length;
    const buffer = audioContextRef.current.createBuffer(
      1,
      bufferSize,
      audioContextRef.current.sampleRate
    );
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (type === 'white') {
        output[i] = Math.random() * 2 - 1;
      } else if (type === 'pink') {
        // Simplified pink noise generation
        output[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.cos((i / bufferSize) * Math.PI));
      } else if (type === 'brown') {
        // Simplified brown noise generation
        output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
    }

    return buffer;
  }, []);

  // Create synthetic audio for different sound types
  const createSyntheticAudio = useCallback(
    async (soundType: AmbientSoundType) => {
      await initAudioContext();
      if (!audioContextRef.current || !gainNodeRef.current) return;

      // Stop any existing audio
      stopAudio();

      try {
        switch (soundType) {
          case 'white-noise':
          case 'pink-noise':
          case 'brown-noise': {
            const noiseType = soundType.replace('-noise', '') as 'white' | 'pink' | 'brown';
            const noiseBuffer = createNoiseBuffer(noiseType);
            if (noiseBuffer) {
              noiseNodeRef.current = audioContextRef.current.createBufferSource();
              noiseNodeRef.current.buffer = noiseBuffer;
              noiseNodeRef.current.loop = true;
              noiseNodeRef.current.connect(gainNodeRef.current);
              noiseNodeRef.current.start();
            }
            break;
          }

          case 'rain': {
            // Simulate rain with filtered white noise
            const rainBuffer = createNoiseBuffer('white');
            if (rainBuffer) {
              noiseNodeRef.current = audioContextRef.current.createBufferSource();
              noiseNodeRef.current.buffer = rainBuffer;
              noiseNodeRef.current.loop = true;

              // Add low-pass filter for rain effect
              const filter = audioContextRef.current.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(800, audioContextRef.current.currentTime);

              noiseNodeRef.current.connect(filter);
              filter.connect(gainNodeRef.current);
              noiseNodeRef.current.start();
            }
            break;
          }

          case 'ocean-waves': {
            // Simulate ocean waves with oscillating low frequency
            oscillatorRef.current = audioContextRef.current.createOscillator();
            const waveFilter = audioContextRef.current.createBiquadFilter();
            waveFilter.type = 'lowpass';
            waveFilter.frequency.setValueAtTime(200, audioContextRef.current.currentTime);

            oscillatorRef.current.type = 'sine';
            oscillatorRef.current.frequency.setValueAtTime(
              0.3,
              audioContextRef.current.currentTime
            );

            // Modulate amplitude for wave effect
            const waveLfo = audioContextRef.current.createOscillator();
            const waveLfoGain = audioContextRef.current.createGain();
            waveLfo.frequency.setValueAtTime(0.1, audioContextRef.current.currentTime);
            waveLfo.connect(waveLfoGain);
            waveLfoGain.connect(gainNodeRef.current.gain);

            oscillatorRef.current.connect(waveFilter);
            waveFilter.connect(gainNodeRef.current);
            oscillatorRef.current.start();
            waveLfo.start();
            break;
          }

          case 'forest': {
            // Simulate forest with multiple oscillators
            const frequencies = [220, 440, 880, 1760];
            frequencies.forEach((freq, index) => {
              const osc = audioContextRef.current!.createOscillator();
              const oscGain = audioContextRef.current!.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(
                freq + Math.random() * 20,
                audioContextRef.current!.currentTime
              );
              oscGain.gain.setValueAtTime(0.05, audioContextRef.current!.currentTime);

              osc.connect(oscGain);
              oscGain.connect(gainNodeRef.current!);
              osc.start();

              setTimeout(() => osc.stop(), 2000 + Math.random() * 3000);
            });
            break;
          }

          case 'fireplace': {
            // Simulate fireplace crackling
            const crackling = createNoiseBuffer('brown');
            if (crackling) {
              noiseNodeRef.current = audioContextRef.current.createBufferSource();
              noiseNodeRef.current.buffer = crackling;
              noiseNodeRef.current.loop = true;

              const crackleFilter = audioContextRef.current.createBiquadFilter();
              crackleFilter.type = 'bandpass';
              crackleFilter.frequency.setValueAtTime(400, audioContextRef.current.currentTime);

              noiseNodeRef.current.connect(crackleFilter);
              crackleFilter.connect(gainNodeRef.current);
              noiseNodeRef.current.start();
            }
            break;
          }

          case 'tibetan-bowls': {
            // Simulate singing bowls with harmonics
            const bowlFreqs = [256, 384, 512, 768];
            bowlFreqs.forEach((freq, index) => {
              setTimeout(() => {
                const bowlOsc = audioContextRef.current!.createOscillator();
                const bowlGain = audioContextRef.current!.createGain();
                bowlOsc.type = 'sine';
                bowlOsc.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
                bowlGain.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
                bowlGain.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContextRef.current!.currentTime + 3
                );

                bowlOsc.connect(bowlGain);
                bowlGain.connect(gainNodeRef.current!);
                bowlOsc.start();
                bowlOsc.stop(audioContextRef.current!.currentTime + 3);
              }, index * 4000);
            });
            break;
          }

          default: {
            // Default to soft sine wave
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.type = 'sine';
            oscillatorRef.current.frequency.setValueAtTime(
              220,
              audioContextRef.current.currentTime
            );
            oscillatorRef.current.connect(gainNodeRef.current);
            oscillatorRef.current.start();
          }
        }

        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setError('Failed to play audio');
        logAudioError('Ambient sound playback error', err as Error, { soundType: selectedSound });
      }
    },
    [initAudioContext, createNoiseBuffer]
  );

  // Stop audio
  const stopAudio = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      noiseNodeRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      const gainValue = isMuted ? 0 : volume / 100;
      gainNodeRef.current.gain.setValueAtTime(gainValue, audioContextRef.current?.currentTime || 0);
    }
  }, [volume, isMuted]);

  // Handle sound selection
  const handleSoundSelect = async (sound: AmbientSoundType) => {
    setSelectedSound(sound);
    setIsLoading(true);

    if (isPlaying) {
      stopAudio();
    }

    try {
      await createSyntheticAudio(sound);
      onSoundChange?.(sound);
    } catch (err) {
      setError('Failed to load sound');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play/pause
  const handlePlayPause = async () => {
    if (!selectedSound) return;

    if (isPlaying) {
      stopAudio();
    } else {
      await handleSoundSelect(selectedSound);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    onVolumeChange?.(newVolume[0]);
  };

  // Get icon for sound type
  const getSoundIcon = (soundType: AmbientSoundType) => {
    const iconMap = {
      rain: '🌧️',
      'ocean-waves': '🌊',
      forest: '🌲',
      'mountain-stream': '🏔️',
      fireplace: '🔥',
      'white-noise': '📊',
      'pink-noise': '📈',
      'brown-noise': '📉',
      thunder: '⛈️',
      wind: '💨',
      birds: '🐦',
      crickets: '🦗',
      'cafe-ambience': '☕',
      'tibetan-bowls': '🎵',
      chimes: '🔔',
      silence: '🤫',
    };
    return iconMap[soundType] || '🔊';
  };

  // Group sounds by category
  const groupedSounds = AMBIENT_SOUNDS.reduce(
    (groups, sound) => {
      const category = sound.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(sound);
      return groups;
    },
    {} as Record<SoundCategory, AmbientSound[]>
  );

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && selectedSound && !isPlaying) {
      handleSoundSelect(selectedSound);
    }
  }, [autoPlay, selectedSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Music className="h-5 w-5" />
          <span>Ambient Sounds</span>
        </CardTitle>
        <CardDescription>
          Create the perfect atmosphere for your meditation practice
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Sound Display */}
        {selectedSound && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getSoundIcon(selectedSound)}</span>
              <div>
                <h3 className="font-medium">
                  {AMBIENT_SOUNDS.find((s) => s.type === selectedSound)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {AMBIENT_SOUNDS.find((s) => s.type === selectedSound)?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePlayPause}
                disabled={isLoading}
                size="sm"
                className="flex items-center space-x-1"
              >
                {isLoading ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Volume</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono">{volume}%</span>
              <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="flex-1"
              disabled={!selectedSound}
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Sound Categories */}
        <div className="space-y-4">
          {Object.entries(groupedSounds).map(([category, sounds]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold capitalize flex items-center space-x-2">
                <span>{category.replace('-', ' ')}</span>
                <Badge variant="outline" className="text-xs">
                  {sounds.length}
                </Badge>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sounds.map((sound) => (
                  <Button
                    key={sound.id}
                    variant={selectedSound === sound.type ? 'default' : 'outline'}
                    onClick={() => handleSoundSelect(sound.type)}
                    disabled={isLoading}
                    className="h-auto p-3 flex flex-col items-center space-y-2 text-center"
                  >
                    <span className="text-xl">{sound.icon}</span>
                    <span className="text-xs font-medium leading-tight">{sound.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Audio Visualization */}
        {isPlaying && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground text-center">
              Audio visualization would appear here in a full implementation
            </div>
            <div className="flex justify-center space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 5}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-between items-center border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopAudio();
              setSelectedSound(null);
            }}
          >
            <VolumeX className="h-4 w-4 mr-1" />
            Silence
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const randomSound = AMBIENT_SOUNDS[Math.floor(Math.random() * AMBIENT_SOUNDS.length)];
              handleSoundSelect(randomSound.type);
            }}
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Random
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbientSoundPlayer;
