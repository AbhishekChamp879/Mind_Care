declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  export const BookOpen: FC<IconProps>;
  export const BookOpenCheck: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const Type: FC<IconProps>;
  export const LineHeight: FC<IconProps>;
  export const Contrast: FC<IconProps>;
  export const Sun: FC<IconProps>;
}

declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    forcedTheme?: string;
    themes?: string[];
    attribute?: string;
    value?: { [themeName: string]: string };
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
  }
  export const ThemeProvider: React.FC<ThemeProviderProps>;
  
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    themes: string[];
    systemTheme?: string;
  };
}