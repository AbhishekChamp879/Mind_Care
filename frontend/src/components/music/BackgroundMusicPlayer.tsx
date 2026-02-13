import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';

export const BackgroundMusicPlayer: React.FC = () => {
  const { playerState, preferences, togglePlay } = useMusic();

  const { isPlaying, currentTrack } = playerState;

  // Don't render if music is disabled
  if (!preferences.enabled) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full shadow-md px-2 py-1 hover:bg-black/70 transition-all duration-200">
          {/* Music Icon with Status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative px-1">
                <Music2
                  className={cn(
                    'h-4 w-4 transition-all',
                    isPlaying ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                {isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="flex items-center gap-1">
                🎧 {currentTrack?.title || 'Lo-Fi Music Player'}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Play/Pause Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={togglePlay}
                className={cn(
                  'h-8 w-8 p-0 rounded-full transition-all',
                  isPlaying ? 'bg-primary hover:bg-primary/90' : 'bg-primary/20 hover:bg-primary/30'
                )}
                variant="ghost"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isPlaying ? 'Pause' : 'Play'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Now Playing Text - Minimal */}
        {currentTrack && isPlaying && (
          <div className="mt-1.5 text-center animate-in fade-in slide-in-from-bottom-1">
            <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
              <span className="flex gap-0.5">
                <span
                  className="w-0.5 h-2 bg-primary animate-pulse"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-0.5 h-2 bg-primary animate-pulse"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-0.5 h-2 bg-primary animate-pulse"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </span>
              <span className="text-[10px] font-medium text-white/90">
                {currentTrack.icon} {currentTrack.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default BackgroundMusicPlayer;
