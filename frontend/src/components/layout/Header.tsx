import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import QuickMoodHeader from '@/components/dashboard/QuickMoodHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Globe,
  Phone,
  BarChart,
  Palette,
  Bell,
  Music2,
  FileText,
  LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/app/dashboard', icon: BarChart },
    { name: 'Chat', href: '/app/chat', icon: MessageCircle },
    { name: 'Resources', href: '/app/resources', icon: BookOpen },
    { name: 'Forum', href: '/app/forum', icon: Users },
    { name: 'Blog', href: '/app/blog', icon: FileText },
    { name: 'About', href: '/about', icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-subtle">
      <div className="container flex h-20 items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 mr-10 group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 gentle-transition">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <span className="hidden font-bold text-2xl sm:inline-block text-primary">MindBuddy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent gentle-transition"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Quick Mood Header */}
          <div className="hidden md:block">
            <QuickMoodHeader variant="dropdown" showTrend={false} />
          </div>

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative rounded-lg bg-muted/50 hover:bg-muted gentle-transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/80 backdrop-blur-sm fade-in">
          <div className="container py-6 px-6">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
