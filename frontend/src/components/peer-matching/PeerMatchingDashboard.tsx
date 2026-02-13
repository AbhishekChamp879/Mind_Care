import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  MessageCircle,
  Star,
  GraduationCap,
  Clock,
  Activity,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  Heart,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  Shield,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  Radio,
  Volume2,
} from 'lucide-react';
import { getCreationDate } from '../../utils/dateUtils';

import { PeerBuddyMatching } from './PeerBuddyMatching';
import { StudyGroupSystem } from './StudyGroupSystem';
import { MentorMatchingSystem } from './MentorMatchingSystem';
import { RealTimeConnectionSystem } from './RealTimeConnectionSystem';

import {
  PeerUser,
  PeerBuddy,
  StudyGroup,
  Mentor,
  RealTimeConnection,
  generateAnonymousDisplayName,
  MENTAL_HEALTH_CONCERNS,
} from '@/types/peerMatching';

interface DashboardStats {
  activeBuddies: number;
  studyGroups: number;
  mentorSessions: number;
  totalConnections: number;
  weeklyGrowth: number;
  engagementScore: number;
}

interface NotificationItem {
  id: string;
  type: 'buddy-match' | 'group-invite' | 'mentor-request' | 'session-reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  metadata?: any;
}

interface PeerMatchingDashboardProps {
  currentUser?: PeerUser;
  className?: string;
}

export const PeerMatchingDashboard: React.FC<PeerMatchingDashboardProps> = ({
  currentUser,
  className = '',
}) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    activeBuddies: 3,
    studyGroups: 2,
    mentorSessions: 1,
    totalConnections: 15,
    weeklyGrowth: 25,
    engagementScore: 85,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeConnections, setActiveConnections] = useState<RealTimeConnection[]>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Mock user data
  const user =
    currentUser ||
    ({
      id: 'user_123',
      anonymousId: 'anonymous_123',
      displayName: generateAnonymousDisplayName(),
      year: 'junior' as const,
      major: 'Computer Science',
      institution: 'University Demo',
      mentalHealthConcerns: ['anxiety', 'academic-pressure'] as const,
      interests: ['coding', 'meditation', 'peer-support'],
      availableHours: {
        monday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        tuesday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        wednesday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        thursday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        friday: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
        saturday: [{ start: '10:00', end: '16:00' }],
        sunday: [{ start: '10:00', end: '16:00' }],
      },
      timeZone: 'EST',
      preferences: {
        genderPreference: 'any' as const,
        ageRange: { min: 18, max: 25 },
        communicationStyle: 'text-only' as const,
        meetingFrequency: 'weekly' as const,
        groupSizePreference: 'any' as const,
        anonymityLevel: 'first-name-only' as const,
        supportType: ['emotional-support', 'study-buddy'] as const,
      },
      isOnline: true,
      lastActive: new Date().toISOString(),
      profileComplete: true,
      verificationStatus: 'verified' as const,
      createdAt: getCreationDate(),
    } as PeerUser);

  // Initialize mock data
  useEffect(() => {
    // Mock notifications
    const mockNotifications: NotificationItem[] = [
      {
        id: 'notif_1',
        type: 'buddy-match',
        title: 'New Buddy Match Available!',
        message:
          'We found a highly compatible study buddy who shares your concerns about academic stress.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        metadata: { matchScore: 92, concerns: ['academic-stress', 'anxiety'] },
      },
      {
        id: 'notif_2',
        type: 'group-invite',
        title: 'Study Group Invitation',
        message:
          'You\'ve been invited to join "Mindful Coding" study group focusing on stress management.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionRequired: true,
        metadata: { groupName: 'Mindful Coding', memberCount: 8 },
      },
      {
        id: 'notif_3',
        type: 'mentor-request',
        title: 'Mentorship Opportunity',
        message: 'A senior student with experience in anxiety management wants to mentor you.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        actionRequired: false,
        metadata: { mentorName: 'Anonymous Senior', experience: '3 years' },
      },
      {
        id: 'notif_4',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: "You've completed 5 peer support sessions this week. Great job!",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        actionRequired: false,
        metadata: { achievement: 'Supportive Peer', level: 2 },
      },
    ];

    setNotifications(mockNotifications);

    // Mock active connections
    const mockConnections: RealTimeConnection[] = [
      {
        id: 'conn_1',
        participants: [user.id, 'peer_456'],
        type: 'peer-buddy-chat',
        status: 'active',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        lastActivity: new Date().toISOString(),
        metadata: {
          priority: 'normal',
          duration: 600,
          participantStates: [
            {
              userId: user.id,
              status: 'online',
              lastSeen: new Date().toISOString(),
              isTyping: false,
              connectionQuality: 95,
              deviceType: 'desktop',
            },
          ],
          features: ['text-chat', 'end-to-end-encryption'],
        },
        messages: [],
        isEncrypted: true,
        connectionQuality: 95,
      },
    ];

    setActiveConnections(mockConnections);
  }, [user.id]);

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'buddy-match':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'group-invite':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'mentor-request':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'session-reminder':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif))
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Buddies</p>
                <p className="text-2xl font-bold">{stats.activeBuddies}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+2 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Groups</p>
                <p className="text-2xl font-bold">{stats.studyGroups}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">3 sessions this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mentor Sessions</p>
                <p className="text-2xl font-bold">{stats.mentorSessions}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <Target className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-600">2 goals achieved</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">{stats.engagementScore}%</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={stats.engagementScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed study session</p>
                  <p className="text-xs text-muted-foreground">
                    Anxiety Management Group • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New buddy match</p>
                  <p className="text-xs text-muted-foreground">92% compatibility • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mentor session scheduled</p>
                  <p className="text-xs text-muted-foreground">Goal tracking • Tomorrow 3 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Radio className="h-5 w-5" />
              <span>Active Connections</span>
              <Badge variant="secondary">{activeConnections.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeConnections.length > 0 ? (
              <div className="space-y-3">
                {activeConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium">Anonymous Peer</p>
                        <p className="text-xs text-muted-foreground">
                          {connection.type.replace('-', ' ')} •{' '}
                          {Math.floor(
                            (Date.now() - new Date(connection.createdAt).getTime()) / 60000
                          )}{' '}
                          min
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConnectionId(connection.id);
                        setShowConnectionModal(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active connections. Start by finding a buddy or joining a study group!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              <Badge variant="destructive">{notifications.filter((n) => !n.isRead).length}</Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                    !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    {notification.actionRequired && (
                      <Badge variant="outline" className="mt-2">
                        Action Required
                      </Badge>
                    )}
                  </div>
                  {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Peer Matching Hub</h1>
          <p className="text-muted-foreground">
            Connect with peers, join study groups, and find mentors in a safe, anonymous environment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Match
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Your privacy is protected.</strong> All connections are anonymous by default,
              and you can control what information you share.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="peer-buddies">Peer Buddies</TabsTrigger>
          <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="peer-buddies">
          <PeerBuddyMatching currentUser={user} />
        </TabsContent>

        <TabsContent value="study-groups">
          <StudyGroupSystem currentUser={user} />
        </TabsContent>

        <TabsContent value="mentorship">
          <MentorMatchingSystem currentUser={user} />
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
              <CardDescription>Manage your real-time connections and chat history</CardDescription>
            </CardHeader>
            <CardContent>
              {activeConnections.length > 0 ? (
                <div className="space-y-4">
                  {activeConnections.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium">
                                {connection.type
                                  .replace('-', ' ')
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Started {formatTimeAgo(connection.createdAt)} • Quality:{' '}
                                {connection.connectionQuality}%
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedConnectionId(connection.id);
                              setShowConnectionModal(true);
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Open Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No Active Connections</p>
                  <p className="text-muted-foreground mb-6">
                    Start connecting with peers through buddy matching or study groups
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={() => setActiveTab('peer-buddies')}>Find Buddy</Button>
                    <Button variant="outline" onClick={() => setActiveTab('study-groups')}>
                      Join Group
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connection Modal */}
      {showConnectionModal && selectedConnectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Real-Time Connection</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowConnectionModal(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4">
              <RealTimeConnectionSystem
                currentUser={user}
                connectionId={selectedConnectionId}
                onConnectionEnd={() => setShowConnectionModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerMatchingDashboard;
