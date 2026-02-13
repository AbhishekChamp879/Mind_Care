import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  EnhancedThemeSettings,
  DEFAULT_THEME_SETTINGS,
  calculateSunriseSunset,
  READING_MODE_STYLES,
} from '@/types/theme';

type Theme = 'light' | 'dark' | 'system' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The currently applied theme
  setTheme: (theme: Theme) => void;
  settings: EnhancedThemeSettings;
  updateSettings: (settings: Partial<EnhancedThemeSettings>) => void;
  readingMode: boolean;
  toggleReadingMode: () => void;
  isScheduledTime: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<EnhancedThemeSettings>(() => {
    const stored = localStorage.getItem('enhanced-theme-settings');
    return stored ? { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(stored) } : DEFAULT_THEME_SETTINGS;
  });

  const [readingMode, setReadingMode] = useState(() => {
    return settings.readingMode.enabled;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isScheduledTime, setIsScheduledTime] = useState(false);

  // Check if current time is within scheduled dark mode hours
  const checkScheduledTime = useCallback(() => {
    if (!settings.schedule.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let startTime, endTime;

    if (settings.schedule.useSunrise && settings.schedule.location) {
      // Use sunrise/sunset calculation
      const { sunrise, sunset } = calculateSunriseSunset(
        settings.schedule.location.latitude,
        settings.schedule.location.longitude,
        now
      );
      const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number);
      const [sunsetHour, sunsetMin] = sunset.split(':').map(Number);

      startTime = sunsetHour * 60 + sunsetMin;
      endTime = sunriseHour * 60 + sunriseMin;
    } else {
      // Use manual schedule
      const [startHour, startMin] = settings.schedule.darkModeStart.split(':').map(Number);
      const [endHour, endMin] = settings.schedule.darkModeEnd.split(':').map(Number);

      startTime = startHour * 60 + startMin;
      endTime = endHour * 60 + endMin;
    }

    // Handle schedule that spans midnight
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }, [settings.schedule]);

  // Determine which theme to apply
  const determineTheme = useCallback((): 'light' | 'dark' => {
    switch (settings.theme) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'auto':
        return checkScheduledTime() ? 'dark' : 'light';
      case 'system':
      default:
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }, [settings.theme, checkScheduledTime]);

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    const newTheme = determineTheme();
    const isScheduled = checkScheduledTime();

    setActualTheme(newTheme);
    setIsScheduledTime(isScheduled);

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);

    // Apply additional theme preferences
    if (settings.preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.preferences.reduceBlueLight) {
      root.classList.add('reduce-blue-light');
    } else {
      root.classList.remove('reduce-blue-light');
    }

    // Apply custom accent color if set
    if (settings.preferences.customAccentColor) {
      root.style.setProperty('--custom-accent', settings.preferences.customAccentColor);
    }

    // Apply dynamic wallpaper
    if (settings.wallpaper?.enabled) {
      if (settings.wallpaper.type === 'gradient') {
        const gradient = newTheme === 'dark' ? settings.wallpaper.dark.gradient : settings.wallpaper.light.gradient;
        if (gradient) {
          document.body.style.setProperty(
            '--dynamic-wallpaper',
            `linear-gradient(to right, ${gradient.from}, ${gradient.to})`
          );
          document.body.style.background = `linear-gradient(to right, ${gradient.from}, ${gradient.to})`;
        }
      } else {
        const imageUrl = newTheme === 'dark' ? settings.wallpaper.dark.imageUrl : settings.wallpaper.light.imageUrl;
        if (imageUrl) {
          document.body.style.setProperty('--dynamic-wallpaper', `url(${imageUrl})`);
          document.body.style.background = `url(${imageUrl})`;
        }
      }
      document.body.classList.add('has-dynamic-wallpaper');
    } else {
      document.body.classList.remove('has-dynamic-wallpaper');
      document.body.style.removeProperty('--dynamic-wallpaper');
      document.body.style.background = '';
    }

    // Save settings
    localStorage.setItem('enhanced-theme-settings', JSON.stringify(settings));
  }, [settings, determineTheme, checkScheduledTime]);

  // Apply reading mode styles
  useEffect(() => {
    const root = window.document.documentElement;

    if (readingMode && settings.readingMode.enabled) {
      root.classList.add('reading-mode');

      // Apply reading mode CSS variables
      root.style.setProperty(
        '--reading-font-size',
        READING_MODE_STYLES.fontSize[settings.readingMode.fontSize]
      );
      root.style.setProperty(
        '--reading-line-height',
        READING_MODE_STYLES.lineHeight[settings.readingMode.lineHeight]
      );
      root.style.setProperty(
        '--reading-font-family',
        READING_MODE_STYLES.fontFamily[settings.readingMode.fontFamily]
      );
      root.style.setProperty(
        '--reading-background',
        READING_MODE_STYLES.backgroundColor[settings.readingMode.backgroundColor]
      );

      if (settings.readingMode.customBackground) {
        root.style.setProperty('--reading-custom-bg', settings.readingMode.customBackground);
      }

      if (settings.readingMode.contrast === 'high') {
        root.classList.add('reading-high-contrast');
      }

      if (settings.readingMode.reducedMotion) {
        root.classList.add('reading-reduced-motion');
      }

      if (settings.readingMode.warmColors) {
        root.classList.add('reading-warm-colors');
      }
    } else {
      root.classList.remove(
        'reading-mode',
        'reading-high-contrast',
        'reading-reduced-motion',
        'reading-warm-colors'
      );
    }
  }, [readingMode, settings.readingMode]);

  // Set up auto-schedule checker
  useEffect(() => {
    if (settings.theme === 'auto' && settings.schedule.enabled) {
      const interval = setInterval(() => {
        const newTheme = determineTheme();
        if (newTheme !== actualTheme) {
          setActualTheme(newTheme);
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [settings.theme, settings.schedule.enabled, determineTheme, actualTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const updateSettings = (newSettings: Partial<EnhancedThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleReadingMode = () => {
    setReadingMode((prev) => !prev);
    setSettings((prev) => ({
      ...prev,
      readingMode: { ...prev.readingMode, enabled: !prev.readingMode.enabled },
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: settings.theme,
        actualTheme,
        setTheme,
        settings,
        updateSettings,
        readingMode,
        toggleReadingMode,
        isScheduledTime,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
