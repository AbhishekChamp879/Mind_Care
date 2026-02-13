import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  FaComments as MessageCircle,
  FaCalendar as Calendar,
  FaBook as BookOpen,
  FaUsers as Users,
  FaHeart as Heart,
  FaCheckCircle as CheckCircle,
  FaBolt as Zap,
  FaStar as Star,
  FaAward as Award,
  FaChartLine as TrendingUp,
  FaClock as Clock,
  FaBullseye as Target,
  FaMagic as Sparkles,
  FaArrowRight as ArrowRight,
  FaPlay as Play,
  FaPhone as Phone,
  FaShieldAlt as Shield,
  FaBrain as Brain,
  FaWind as Wind,
  FaBell as Bell,
  FaCog as Settings,
  FaSmile as Smile,
  FaChartArea as Activity,
  FaMoon as Moon,
  FaCoffee as Coffee,
  FaChartBar as BarChart3,
  FaLightbulb as Lightbulb,
  FaChevronRight as ChevronRight,
  FaPlus as Plus,
  FaStopwatch as Timer,
} from 'react-icons/fa';
import React, { useState, useEffect } from 'react';


// Import new functional components
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import QuickMoodCheckIn from '@/components/dashboard/QuickMoodCheckIn';
import {
  MoodSummaryWidget,
  MoodTrendWidget,
  MoodStreakWidget,
  MoodWeeklyWidget,
} from '@/components/dashboard/MoodWidgets';
import FloatingMoodButton from '@/components/dashboard/FloatingMoodButton';
import QuickMoodHeader from '@/components/dashboard/QuickMoodHeader';
import MoodAnalytics from '@/components/dashboard/MoodAnalytics';
import { GoalsTracker } from '@/components/dashboard/GoalsTracker';
import { ActivityTracker, AchievementTracker } from '@/components/dashboard/ActivityTracker';
import EnhancedDailyTips from '@/components/dashboard/EnhancedDailyTips';
import { InteractiveAnalytics } from '@/components/dashboard/InteractiveAnalytics';
import {
  useActivityLog,
  useAchievements,
  useMoodTracking,
  useGoals,
} from '@/hooks/useDashboardFeatures';

// Enhanced Quick Action Card Component - Still needed for the action cards section
const ActionCard = ({
  title,
  description,
  icon: Icon,
  href,
  badge,
  color = 'primary',
  features = [],
  onCardClick,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
  features?: string[];
  onCardClick?: (href: string, title: string) => void;
}) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/20 text-primary border-primary/20',
    secondary: 'from-secondary/10 to-secondary/20 text-secondary border-secondary/20',
    accent: 'from-accent/10 to-accent/20 text-accent border-accent/20',
    success: 'from-green-100/50 to-green-200/50 text-green-600 border-green-200/50',
  };

  return (
    <Card className="enhanced-card group hover:shadow-aurora hover:-translate-y-2 transition-all duration-500 cursor-pointer">
      <CardHeader className="relative pb-4">
        {badge && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 text-xs bg-gradient-primary text-white shadow-soft z-10"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {badge}
          </Badge>
        )}

        <div
          className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-soft`}
        >
          <Icon className="h-8 w-8" />
        </div>

        <CardTitle className="text-xl mb-3 text-center group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-center leading-relaxed text-sm">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {features.length > 0 && (
          <div className="space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          asChild
          className="w-full bg-gradient-primary hover:shadow-glow group-hover:scale-105 transition-all duration-300 mt-4"
        >
          <Link
            to={href}
            className="flex items-center justify-center"
            onClick={() => onCardClick?.(href, title)}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

interface Institution {
  name: string;
  location?: string;
  type?: string;
  id?: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // Initialize hooks for tracking user activities and achievements
  const { logActivity } = useActivityLog();
  const { checkAchievements } = useAchievements();
  const { moods } = useMoodTracking();
  const { goals } = useGoals();

  // Handler for action card clicks
  const handleActionCardClick = (href: string, title: string) => {
    const activityTypes: Record<string, 'chat' | 'resource' | 'forum' | 'booking'> = {
      '/app/chat': 'chat',
      '/app/booking': 'booking',
      '/app/resources': 'resource',
      '/app/forum': 'forum',
    };

    const activityType = activityTypes[href];
    if (activityType) {
      logActivity(activityType, `Clicked ${title}`, `Navigated to ${title} from dashboard`);
    }
  };

  useEffect(() => {
    // Load selected institution from localStorage
    const institution = localStorage.getItem('selected_institution');
    if (institution) {
      setSelectedInstitution(JSON.parse(institution));
    }

    // Set motivational message - only changes when component mounts or once per day
    const getMotivationalMessage = () => {
      const messages = [
        'Your mental health matters. Take it one day at a time.',
        "You're stronger than you think. Keep moving forward.",
        'Every step toward wellness is a victory worth celebrating.',
        'Remember to be kind to yourself today.',
        'Your journey to better mental health starts with small steps.',
        'Progress, not perfection. Every small step counts.',
        'You have the strength to overcome any challenge today.',
        'Taking care of your mental health is a sign of strength.',
        'Today is a new opportunity to prioritize your wellbeing.',
        'You deserve happiness, peace, and self-compassion.',
      ];

      // Use current date to ensure message changes daily but stays consistent throughout the day
      const today = new Date().toDateString();
      const savedMessage = localStorage.getItem(`motivational_message_${today}`);

      if (savedMessage) {
        return savedMessage;
      } else {
        // Create a consistent seed based on the date
        const dateNumber = new Date().getDate() + new Date().getMonth();
        const messageIndex = dateNumber % messages.length;
        const todayMessage = messages[messageIndex];

        localStorage.setItem(`motivational_message_${today}`, todayMessage);
        return todayMessage;
      }
    };

    setMotivationalMessage(getMotivationalMessage());

    // Update time every minute for dynamic greeting
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    // Log dashboard visit
    logActivity('resource', 'Visited Student Dashboard', 'Dashboard access');

    // Check for achievements
    const activities = JSON.parse(localStorage.getItem('activity_log') || '[]');
    checkAchievements(activities, moods, goals);

    return () => clearInterval(timer);
  }, [logActivity, checkAchievements, moods, goals]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12 max-w-7xl">
        {/* Enhanced Welcome Section */}
        <section className="text-center space-y-6 fade-in">
          <div className="relative">
            <Badge
              variant="secondary"
              className="bg-gradient-primary text-white shadow-soft mb-6 animate-pulse"
            >
              <Heart className="h-4 w-4 mr-2" />
              {getGreeting()}, Welcome to Your Wellness Hub
            </Badge>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-heading">Hello, </span>
                <span className="bg-gradient-aurora bg-clip-text text-transparent">
                  {user?.name.split(' ')[0]}
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-medium">
                  Ready to prioritize your wellbeing?
                </span>
              </h1>

              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4 transition-all duration-500 ease-in-out">
                  {motivationalMessage || 'Welcome to your wellness journey...'}
                </p>

                {selectedInstitution && (
                  <Badge
                    variant="outline"
                    className="text-sm px-4 py-2 border-primary/30 text-primary"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {selectedInstitution.name} Student
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Cards - Responsive Grid */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
              Your Wellness Toolkit
            </h2>
            <p className="text-muted-foreground">
              Everything you need for mental health support, just a click away
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <ActionCard
              title="AI Support Chat"
              description="Instant mental health support with our compassionate AI companion"
              icon={Brain}
              href="/app/chat"
              badge="Available 24/7"
              color="primary"
              features={[
                'Instant responses',
                'Crisis detection',
                'Confidential support',
                'Available anytime',
              ]}
              onCardClick={handleActionCardClick}
            />
            <ActionCard
              title="Book Counseling"
              description="Schedule sessions with licensed mental health professionals"
              icon={Calendar}
              href="/app/booking"
              badge="Professional Care"
              color="secondary"
              features={[
                'Licensed therapists',
                'Flexible scheduling',
                'Private sessions',
                'Insurance accepted',
              ]}
              onCardClick={handleActionCardClick}
            />
            <ActionCard
              title="Wellness Resources"
              description="Self-help tools, meditations, and educational materials"
              icon={BookOpen}
              href="/app/resources"
              badge="Evidence-Based"
              color="accent"
              features={[
                'Guided meditations',
                'Coping strategies',
                'Stress management',
                'Study tips',
              ]}
              onCardClick={handleActionCardClick}
            />
            <ActionCard
              title="Peer Community"
              description="Connect anonymously with fellow students for mutual support"
              icon={Users}
              href="/app/forum"
              badge="Safe Space"
              color="success"
              features={[
                'Anonymous discussions',
                'Peer support',
                'Moderated forums',
                'Shared experiences',
              ]}
              onCardClick={handleActionCardClick}
            />
          </div>
        </section>

        {/* Quick Mood Check-in Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
              Quick Mood Check-in
            </h2>
            <p className="text-muted-foreground">
              One-tap mood logging for faster wellness tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Mood Check-in */}
            <div className="md:col-span-2">
              <QuickMoodCheckIn variant="default" showStreak={true} />
            </div>

            {/* Mood Summary Widget */}
            <MoodSummaryWidget />

            {/* Mood Streak Widget */}
            <MoodStreakWidget />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mood Trend Widget */}
            <MoodTrendWidget />

            {/* Weekly Pattern */}
            <MoodWeeklyWidget />

            {/* Mood Analytics */}
            <MoodAnalytics timeframe="week" />
          </div>
        </section>

        {/* Enhanced Progress Dashboard with Functional Components */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
              Your Wellness Journey
            </h2>
            <p className="text-muted-foreground">
              Track your progress and celebrate your achievements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Interactive Analytics */}
            <div className="xl:col-span-2">
              <InteractiveAnalytics />
            </div>

            {/* Mood Tracker */}
            <MoodTracker />

            {/* Goals Tracker */}
            <GoalsTracker />

            {/* Activity Overview */}
            <ActivityTracker />

            {/* Achievement Tracker */}
            <AchievementTracker />
          </div>
        </section>

        {/* Enhanced Daily Wellness Tips - Now Fully Functional */}
        <section className="space-y-6">
          <EnhancedDailyTips />
        </section>

        {/* Quick Wellness Tools */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
              Quick Wellness Tools
            </h2>
            <p className="text-muted-foreground">
              Instant access to stress relief and wellness features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Breathing Exercises */}
            <Card className="enhanced-card group hover:shadow-aurora hover:-translate-y-1 transition-all duration-300 cursor-pointer border-blue-200/50">
              <CardHeader className="text-center pb-4">
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-100/50 to-blue-200/50 text-blue-600 border-blue-200/50 w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-soft">
                  <Wind className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                  Breathing Exercises
                </CardTitle>
                <CardDescription className="text-center leading-relaxed">
                  Quick breathing techniques to reduce stress and improve focus
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    <span>4-7-8 breathing for anxiety</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Box breathing for focus</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Guided sessions (1-10 minutes)</span>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Link to="/app/breathing">
                    <Wind className="h-4 w-4 mr-2" />
                    Start Breathing Exercise
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="enhanced-card group hover:shadow-aurora hover:-translate-y-1 transition-all duration-300 cursor-pointer border-purple-200/50">
              <CardHeader className="text-center pb-4">
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-100/50 to-purple-200/50 text-purple-600 border-purple-200/50 w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-soft">
                  <Bell className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                  Wellness Reminders
                </CardTitle>
                <CardDescription className="text-center leading-relaxed">
                  Customize notifications for mood check-ins, breathing exercises, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>Daily mood reminders</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>Breathing exercise alerts</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>Session reminders</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  <Link to="/app/notifications">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Notifications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions Bar */}
        <section className="enhanced-card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-heading mb-2 flex items-center justify-center sm:justify-start">
                <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                Need immediate support?
              </h3>
              <p className="text-muted-foreground">
                Our AI chat is available 24/7 for instant mental health assistance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-gradient-primary hover:shadow-glow btn-enhanced">
                <Link
                  to="/app/chat"
                  onClick={() =>
                    logActivity(
                      'chat',
                      'Started AI Chat from quick access',
                      'Dashboard quick access button'
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start AI Chat
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-primary/30 hover:bg-primary/10">
                <Link
                  to="/app/booking"
                  onClick={() =>
                    logActivity(
                      'booking',
                      'Started booking session from quick access',
                      'Dashboard quick access button'
                    )
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Emergency Support */}
        <section className="enhanced-card bg-gradient-to-br from-red-50/80 to-orange-50/80 border-red-200/60 p-6 sm:p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-red-100 to-red-200 shadow-soft">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-red-800">
                  Crisis Support Available
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            <p className="text-red-700 leading-relaxed max-w-2xl mx-auto">
              If you're experiencing a mental health crisis, having thoughts of self-harm, or need
              immediate support, please don't hesitate to reach out. You are not alone, and help is
              available right now.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Button
                variant="destructive"
                size="lg"
                className="shadow-soft hover:shadow-medium btn-enhanced bg-gradient-to-r from-red-600 to-red-700"
              >
                <Phone className="h-4 w-4 mr-2" />
                Crisis Line: 988
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-700 hover:bg-red-50 shadow-soft hover:shadow-medium btn-enhanced"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Text: HOME to 741741
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-700 hover:bg-red-50 shadow-soft hover:shadow-medium btn-enhanced"
                asChild
              >
                <Link
                  to="/app/chat"
                  onClick={() =>
                    logActivity(
                      'chat',
                      'Emergency AI Chat',
                      'Crisis support - Emergency AI chat accessed'
                    )
                  }
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Emergency AI Chat
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-red-200">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-red-800 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Campus Counseling
                </h4>
                <p className="text-sm text-red-600">
                  Contact your campus counseling center for professional support and resources
                </p>
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-red-800 flex items-center justify-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Peer Support
                </h4>
                <p className="text-sm text-red-600">
                  Join our anonymous peer support community for shared experiences and mutual help
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Mood Button */}
      <FloatingMoodButton position="bottom-right" showOnlyIfNotLogged={true} />
    </div>
  );
};

export default StudentDashboard;
