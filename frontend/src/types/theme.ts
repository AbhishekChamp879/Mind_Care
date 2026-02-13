export interface ThemeSchedule {
  enabled: boolean;
  darkModeStart: string; // HH:MM format
  darkModeEnd: string; // HH:MM format
  location?: {
    latitude: number;
    longitude: number;
  };
  useSunrise?: boolean; // Auto-calculate based on sunrise/sunset
}

export interface ReadingModeSettings {
  enabled: boolean;
  fontSize: number;
  lineHeight: number;
  contrast: number;
  isDyslexicFont: boolean;
}

export interface WallpaperSettings {
  enabled: boolean;
  type: 'gradient' | 'image';
  light: {
    gradient?: {
      from: string;
      to: string;
    };
    imageUrl?: string;
  };
  dark: {
    gradient?: {
      from: string;
      to: string;
    };
    imageUrl?: string;
  };
}

export interface EnhancedThemeSettings {
  theme: 'light' | 'dark' | 'system' | 'auto';
  schedule: ThemeSchedule;
  readingMode: ReadingModeSettings;
  wallpaper: WallpaperSettings;
  preferences: {
    smoothTransitions: boolean;
    highContrast: boolean;
    reduceBlueLight: boolean;
    // Respect user's reduced motion preference (global)
    reduceMotion?: boolean;
    customAccentColor?: string;
  };
}

export const DEFAULT_THEME_SETTINGS: EnhancedThemeSettings = {
  theme: 'system',
  schedule: {
    enabled: false,
    darkModeStart: '20:00',
    darkModeEnd: '06:00',
    useSunrise: false,
  },
  readingMode: {
    enabled: false,
    fontSize: 16,
    lineHeight: 1.5,
    contrast: 100,
    isDyslexicFont: false,
  },
  wallpaper: {
    enabled: false,
    type: 'gradient',
    light: {
      gradient: {
        from: '#fde68a',
        to: '#93c5fd',
      },
    },
    dark: {
      gradient: {
        from: '#0f172a',
        to: '#1e293b',
      },
    },
  },
  preferences: {
    smoothTransitions: true,
    highContrast: false,
    reduceBlueLight: false,
    reduceMotion: false,
  },
};

// CSS variables for reading mode
export const readingModeStyles = `
  :root {
    --content-font-size: 16px;
    --content-line-height: 1.5;
    --content-contrast: 100%;
  }

  /* Add reading mode styles to text content when reading mode is enabled */
  body.reading-mode {
    font-size: var(--content-font-size) !important;
    line-height: var(--content-line-height) !important;
    filter: contrast(var(--content-contrast)) !important;
  }

  /* Target main content areas when reading mode is active */
  body.reading-mode article,
  body.reading-mode main,
  body.reading-mode .content-area,
  body.reading-mode p,
  body.reading-mode h1,
  body.reading-mode h2,
  body.reading-mode h3,
  body.reading-mode h4,
  body.reading-mode h5,
  body.reading-mode h6 {
    font-size: var(--content-font-size) !important;
    line-height: var(--content-line-height) !important;
    font-family: var(--content-font-family, inherit) !important;
  }
`;
export const READING_MODE_STYLES = {
  fontSize: {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px',
  },
  lineHeight: {
    normal: '1.5',
    relaxed: '1.7',
    loose: '2.0',
  },
  fontFamily: {
    default: 'system-ui, -apple-system, sans-serif',
    serif: 'Georgia, Times, serif',
    mono: 'Monaco, Consolas, monospace',
    dyslexic: 'OpenDyslexic, Arial, sans-serif',
  },
  backgroundColor: {
    default: 'hsl(var(--background))',
    sepia: '#f4f1e8',
    dark: '#1a1a1a',
    custom: 'var(--reading-custom-bg)',
  },
};

// Utility functions for sunrise/sunset calculation
export function calculateSunriseSunset(latitude: number, longitude: number, date: Date) {
  // Simplified sunrise/sunset calculation
  // In a real implementation, you'd use a proper astronomy library
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const latRad = (latitude * Math.PI) / 180;

  const declinationAngle =
    (23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365) * Math.PI) / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declinationAngle));

  const sunrise = 12 - (hourAngle * 12) / Math.PI;
  const sunset = 12 + (hourAngle * 12) / Math.PI;

  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
  };
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
