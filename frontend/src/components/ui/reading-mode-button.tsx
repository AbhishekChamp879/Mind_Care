import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BookOpen, BookOpenCheck, Settings, Type } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type ReadingModeSettings = {
  enabled: boolean;
  fontSize: number;
  lineHeight: number;
  contrast: number;
  isDyslexicFont: boolean;
};

type ReadingModeButtonProps = {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ReadingModeButton = ({
  className = '',
  size = 'default',
  variant = 'outline',
}: ReadingModeButtonProps) => {
  const { useEffect } = React;
  const { settings, updateSettings } = useTheme();
  const readingMode = settings.readingMode || {
    enabled: false,
    fontSize: 16,
    lineHeight: 1.5,
    contrast: 100,
    isDyslexicFont: false,
  };

  useEffect(() => {
    if (readingMode.enabled) {
      applyReadingModeStyles(readingMode);
    } else {
      removeReadingModeStyles();
    }
  }, [readingMode]);

  const applyReadingModeStyles = (settings: ReadingModeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--content-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--content-line-height', `${settings.lineHeight}`);
    root.style.setProperty('--content-contrast', `${settings.contrast}%`);

    if (settings.isDyslexicFont) {
      root.style.setProperty(
        '--content-font-family',
        '"OpenDyslexic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      );
    } else {
      root.style.removeProperty('--content-font-family');
    }

    document.body.classList.add('reading-mode');
  };

  const removeReadingModeStyles = () => {
    const root = document.documentElement;
    root.style.removeProperty('--content-font-size');
    root.style.removeProperty('--content-line-height');
    root.style.removeProperty('--content-contrast');
    root.style.removeProperty('--content-font-family');
    document.body.classList.remove('reading-mode');
  };

  const updateReadingMode = (updates: Partial<ReadingModeSettings>) => {
    updateSettings({
      readingMode: {
        ...readingMode,
        ...updates,
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={`transition-all duration-200 ${readingMode.enabled ? 'bg-primary text-primary-foreground' : ''} ${className}`}
              aria-label="Reading mode settings"
            >
              {readingMode.enabled ? <BookOpenCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              {size !== 'sm' && (
                <span className="ml-2">{readingMode.enabled ? 'Reading Mode' : 'Reading Mode'}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adjust reading mode settings</p>
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <Label>Reading Mode</Label>
            </div>
            <Switch
              checked={readingMode.enabled}
              onCheckedChange={(checked: boolean) => updateReadingMode({ enabled: checked })}
              aria-label="Toggle reading mode"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            {/* Font Size Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span>Font Size</span>
                </Label>
                <span className="text-sm text-muted-foreground">{readingMode.fontSize}px</span>
              </div>
              <Slider
                min={12}
                max={24}
                step={1}
                value={[readingMode.fontSize]}
                onValueChange={(values: number[]) => updateReadingMode({ fontSize: values[0] })}
                aria-label="Adjust font size"
              />
            </div>

            {/* Line Height Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Line Spacing</span>
                </Label>
                <span className="text-sm text-muted-foreground">{readingMode.lineHeight}x</span>
              </div>
              <Slider
                min={1}
                max={2}
                step={0.1}
                value={[readingMode.lineHeight]}
                onValueChange={(values: number[]) => updateReadingMode({ lineHeight: values[0] })}
                aria-label="Adjust line spacing"
              />
            </div>

            {/* Contrast Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Contrast</span>
                </Label>
                <span className="text-sm text-muted-foreground">{readingMode.contrast}%</span>
              </div>
              <Slider
                min={75}
                max={125}
                step={5}
                value={[readingMode.contrast]}
                onValueChange={([value]: number[]) => updateReadingMode({ contrast: value })}
                aria-label="Adjust contrast"
              />
            </div>

            {/* Dyslexic Font Toggle */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Dyslexia-friendly Font</span>
              </Label>
              <Switch
                checked={readingMode.isDyslexicFont}
                onCheckedChange={(checked: boolean) => updateReadingMode({ isDyslexicFont: checked })}
                aria-label="Toggle dyslexia-friendly font"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReadingModeButton;
