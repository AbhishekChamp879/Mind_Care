/**
 * @fileoverview Administrative Dashboard - Comprehensive Mental Health Platform Management
 * 
 * A real-time administrative dashboard for monitoring student mental health metrics,
 * managing crisis interventions, tracking platform usage, and analyzing wellness trends.
 * 
 * Key Features:
 * - Real-time student monitoring with risk assessment
 * - Crisis alert management and intervention protocols
 * - Live session tracking and counselor availability
 * - Platform analytics and usage metrics
 * - Data export capabilities for reporting
 * - Auto-refresh functionality for live monitoring
 * 
 * Crisis Management:
 * - Immediate alerts for high-risk students
 * - Emergency protocol activation
 * - Counselor dispatch and resource allocation
 * - Risk level classification and trending
 * 
 * Analytics & Reporting:
 * - Student engagement metrics
 * - Mental health trend analysis
 * - Session completion rates
 * - Platform utilization statistics
 * - Exportable data for institutional reporting
 * 
 * @example
 * ```tsx
 * // Wrapped with AdminDataProvider for real-time data
 * <AdminDataProvider>
 *   <AdminDashboard />
 * </AdminDataProvider>
 * 
 * // The dashboard automatically:
 * // - Monitors student risk levels
 * // - Alerts on crisis situations  
 * // - Tracks live sessions
 * // - Provides real-time analytics
 * ```
 * 
 * @see {@link ../contexts/AdminDataContext} For real-time data management
 * @see {@link ../components/ui/card} For dashboard layout components
 * @see {@link https://recharts.org/} For analytics visualizations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminData, AdminDataProvider } from '../contexts/AdminDataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  MessageCircle,
  Calendar,
  TrendingUp,
  Download,
  AlertTriangle,
  Heart,
  Shield,
  BookOpen,
  Activity,
  RefreshCw,
  Search,
  Filter,
  Eye,
  UserCheck,
  Clock,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  BarChart3,
  Globe,
  Zap,
  Target,
} from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';

/**
 * AdminDashboard Component - Real-time mental health platform administration.
 * 
 * Provides comprehensive oversight of the Mind Care platform with real-time monitoring,
 * crisis management, and analytics capabilities for administrators and clinical staff.
 * 
 * State Management:
 * - searchTerm: Filter students by name, ID, or institution
 * - selectedRiskLevel: Filter by mental health risk assessment level
 * - selectedTimeframe: Analytics time window (24h, 7d, 30d, 90d)
 * - autoRefresh: Toggle for automatic data updates
 * 
 * Data Sources:
 * - students: Student roster with risk assessments and activity
 * - liveSessions: Currently active counseling sessions
 * - crisisAlerts: Emergency situations requiring immediate attention
 * - platformMetrics: Usage statistics and performance indicators
 * - activityLogs: Audit trail of platform interactions
 * 
 * Key Functions:
 * - Real-time crisis alert monitoring and response
 * - Student risk level tracking and intervention
 * - Session management and counselor oversight
 * - Data export for institutional reporting
 * - Platform health monitoring
 * 
 * @returns Comprehensive administrative dashboard with real-time capabilities
 */
const AdminDashboard = () => {
  const {
    students,
    liveSessions,
    crisisAlerts,
    platformMetrics,
    activityLogs,
    isConnected,
    lastUpdate,
    refreshData,
    handleCrisisAlert,
    exportData,
    filterStudents,
    getStudentAnalytics,
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  // Get analytics data
  const studentAnalytics = getStudentAnalytics();

  // Filter students based on search and filters
  const filteredStudents = filterStudents({
    searchTerm: searchTerm || undefined,
    riskLevel: selectedRiskLevel === 'all' ? undefined : (selectedRiskLevel as any),
  });

  // Transform data for charts
  const riskLevelData = Object.entries(studentAnalytics.riskDistribution).map(([level, count]) => ({
    level: level.charAt(0).toUpperCase() + level.slice(1),
    count,
    fill:
      level === 'crisis'
        ? '#dc2626'
        : level === 'high'
          ? '#ea580c'
          : level === 'medium'
            ? '#ca8a04'
            : '#16a34a',
  }));

  const institutionData = Object.entries(studentAnalytics.institutionBreakdown)
    .slice(0, 6)
    .map(([institution, count]) => ({
      institution: institution.length > 15 ? institution.substring(0, 15) + '...' : institution,
      count,
    }));

  const moodTrendData = Object.entries(studentAnalytics.moodTrendAnalysis).map(
    ([trend, count]) => ({
      trend: trend.charAt(0).toUpperCase() + trend.slice(1),
      count,
      fill: trend === 'improving' ? '#16a34a' : trend === 'declining' ? '#dc2626' : '#6b7280',
    })
  );

  // Generate activity timeline data (last 7 days)
  const activityTimelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en', { weekday: 'short' });

    return {
      day: dayName,
      students: Math.floor(Math.random() * 20 + 15),
      sessions: Math.floor(Math.random() * 8 + 5),
      chats: Math.floor(Math.random() * 30 + 20),
      alerts: Math.floor(Math.random() * 3),
    };
  });

  const stats = [
    {
      title: 'Total Students',
      value: platformMetrics.totalUsers.toLocaleString(),
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Users,
      description: `${studentAnalytics.activeToday} active today`,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Sessions',
      value: platformMetrics.activeSessions.toString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Calendar,
      description: `${platformMetrics.totalSessions} total sessions`,
      color: 'bg-green-500',
    },
    {
      title: 'Chat Interactions',
      value: platformMetrics.totalSessions.toLocaleString(),
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: MessageCircle,
      description: `${Math.floor(platformMetrics.averageResponseTime)}s avg response`,
      color: 'bg-purple-500',
    },
    {
      title: 'Crisis Alerts',
      value: crisisAlerts.filter((alert) => alert.status === 'active').length.toString(),
      change: crisisAlerts.length > 2 ? '+15.7%' : '-8.3%',
      changeType: crisisAlerts.length > 2 ? ('negative' as const) : ('positive' as const),
      icon: AlertTriangle,
      description: `${crisisAlerts.length} total alerts`,
      color: 'bg-red-500',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="relative container mx-auto px-6 py-8 space-y-8 max-w-7xl">
          {/* Header with Real-time Status */}
        <ScrollFadeIn yOffset={32}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 animate-fade-in">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text text-transparent leading-tight">
                  Admin Dashboard
                </h1>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500 animate-pulse" />
                  )}
                  <Badge variant={isConnected ? 'secondary' : 'destructive'}>
                    {isConnected ? 'Live' : 'Offline'}
                  </Badge>
                </div>
              </div>
              <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl leading-relaxed">
                Real-time student mental health monitoring and platform analytics
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                </Button>
                <Button variant="outline" size="sm" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportData('all')}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </ScrollFadeIn>

          {/* Search and Filters */}
          <ScrollFadeIn yOffset={18} delay={0.10}><Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search students, institutions, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="crisis">Crisis</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card></ScrollFadeIn>

          {/* Key Stats */}
          <ScrollFadeIn yOffset={16} delay={0.13}><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-up">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="group hover:shadow-floating transition-all duration-500 animate-fade-in bg-white/10 backdrop-blur-xl border-white/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-semibold text-muted-foreground/90 uppercase tracking-wide">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-3 rounded-2xl ${stat.color}/20 backdrop-blur-sm border ${stat.color.replace('bg-', 'border-')}/20 group-hover:scale-110 transition-all duration-300`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')} transition-colors duration-300`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`
                        px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300
                        ${stat.changeType === 'positive'
                          ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-orange-500/20 text-orange-600 border border-orange-500/30 hover:bg-orange-500/30'
                        }
                      `}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div></ScrollFadeIn>

          {/* Charts Row 1 - Analytics Overview */}
          <ScrollFadeIn yOffset={16} delay={0.17}><div
            className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-up"
            style={{ animationDelay: '400ms' }}
          >
            {/* Activity Timeline */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    7-Day Activity Overview
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Daily platform activity trends and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={activityTimelineData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-20"
                        stroke="currentColor"
                      />
                      <XAxis dataKey="day" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: 'currentColor',
                        }}
                      />
                      <Area
                        dataKey="students"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.3)"
                      />
                      <Area
                        dataKey="sessions"
                        stackId="1"
                        stroke="hsl(var(--secondary))"
                        fill="hsl(var(--secondary) / 0.3)"
                      />
                      <Area
                        dataKey="chats"
                        stackId="1"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent) / 0.3)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Level Distribution */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">
                    Student Risk Levels
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Current mental health risk assessment distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={riskLevelData} cx="50%" cy="50%" outerRadius={80} dataKey="count">
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`risk-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div></ScrollFadeIn>

          {/* Charts Row 2 - Institution & Mood Analysis */}
          <ScrollFadeIn yOffset={16} delay={0.19}><div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Institution Distribution */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20">
                    <Globe className="h-6 w-6 text-accent" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                    Top Institutions
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Student enrollment by educational institution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={institutionData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-20"
                        stroke="currentColor"
                      />
                      <XAxis
                        dataKey="institution"
                        className="text-muted-foreground"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mood Trend Analysis */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">
                    Mood Trends
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Student mental health trend distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={moodTrendData} cx="50%" cy="50%" outerRadius={80} dataKey="count">
                        {moodTrendData.map((entry, index) => (
                          <Cell key={`mood-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div></ScrollFadeIn>

          {/* Live Student Monitoring */}
          <ScrollFadeIn yOffset={20} delay={0.20}><Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Live Student Monitoring
                </span>
                <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-600">
                  {filteredStudents.length} students
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                Real-time student status and mental health monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredStudents.slice(0, 9).map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 bg-white/5 border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${student.status === 'online'
                                ? 'bg-green-500'
                                : student.status === 'away'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-500'
                              }`}
                          />
                          <h4 className="font-medium text-sm">{student.anonymousHandle}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{student.id}</p>
                        <p className="text-xs text-muted-foreground mb-2">{student.institution}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${student.riskLevel === 'crisis'
                                ? 'bg-red-500/20 text-red-600'
                                : student.riskLevel === 'high'
                                  ? 'bg-orange-500/20 text-orange-600'
                                  : student.riskLevel === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-600'
                                    : 'bg-green-500/20 text-green-600'
                              }`}
                          >
                            {student.riskLevel} risk
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${student.moodTrend === 'improving'
                                ? 'border-green-500 text-green-600'
                                : student.moodTrend === 'declining'
                                  ? 'border-red-500 text-red-600'
                                  : 'border-gray-500 text-gray-600'
                              }`}
                          >
                            {student.moodTrend}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last active: {new Date(student.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card></ScrollFadeIn>

          {/* System Health & Quick Actions */}
          <ScrollFadeIn yOffset={12} delay={0.23}><div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Health */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/20">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-green-600 bg-clip-text text-transparent">
                    System Health
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Real-time platform performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Server Uptime</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                      {platformMetrics.systemUptime}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${platformMetrics.systemUptime}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Time</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                      {platformMetrics.averageResponseTime}ms
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(100 - platformMetrics.averageResponseTime / 2, 60)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Server Load</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                      {platformMetrics.serverLoad}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${platformMetrics.serverLoad}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Satisfaction Score</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-600">
                      {platformMetrics.satisfactionScore}/5.0
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(platformMetrics.satisfactionScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                    Quick Actions
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  Common administrative tasks and system controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Crisis Alerts
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-500/10">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-500/10">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-500/10">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-500/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={() => exportData('all')}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div></ScrollFadeIn>

          {/* Recent Activity Log */}
          <ScrollFadeIn yOffset={12} delay={0.27}><Card className="group bg-white/5 backdrop-blur-xl border-white/20 hover:shadow-floating transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Recent Activity
                </span>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                Latest platform events and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {activityLogs.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${log.severity === 'error'
                          ? 'bg-red-500'
                          : log.severity === 'warning'
                            ? 'bg-yellow-500'
                            : log.severity === 'success'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                        }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${log.severity === 'error'
                          ? 'bg-red-500/20 text-red-600'
                          : log.severity === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-600'
                            : log.severity === 'success'
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-blue-500/20 text-blue-600'
                        }`}
                    >
                      {log.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </ScrollFadeIn>
        </div>
      </div>
    </PageTransition>
  );
};

// Main Dashboard Component with Provider
const Dashboard = () => {
  return (
    <AdminDataProvider>
      <AdminDashboard />
    </AdminDataProvider>
  );
};

export default Dashboard;