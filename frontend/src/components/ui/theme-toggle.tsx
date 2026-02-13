import { Moon, Sun, Monitor, Clock, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function ThemeToggle() {
  const { theme, actualTheme, setTheme, readingMode, toggleReadingMode, isScheduledTime } =
    useTheme();

  const getThemeIcon = () => {
    if (actualTheme === 'dark') {
      return <Moon className="h-6 w-6 gentle-transition" />;
    }
    return <Sun className="h-6 w-6 gentle-transition" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200 group h-12 w-12"
        >
          {getThemeIcon()}
          {(isScheduledTime || readingMode) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-background" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-floating rounded-2xl min-w-[220px]"
      >
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme: {actualTheme}</span>
            {isScheduledTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Auto
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Sun className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Light</span>
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Moon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Monitor className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">System</span>
          {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('auto')}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Clock className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Auto Schedule</span>
          {theme === 'auto' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={toggleReadingMode}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <BookOpen className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Reading Mode</span>
          {readingMode && (
            <Badge variant="outline" className="ml-auto text-xs">
              ON
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Link to="/app/theme-settings">
            <Settings className="mr-3 h-5 w-5" />
            <span className="font-medium">Advanced Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
