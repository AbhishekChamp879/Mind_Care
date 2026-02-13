import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logStudyGroup } from '@/services/logger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Settings,
  Filter,
  ChevronRight,
  Globe,
  Lock,
  Video,
  UserPlus,
  Award,
  TrendingUp,
} from 'lucide-react';
import { getCreationDate, getRecentActivityDate, getScheduledDate, getRelativeDate } from '../../utils/dateUtils';

import {
  StudyGroup,
  StudyGroupFocus,
  StudyGroupStatus,
  GroupSession,
  GroupSchedule,
  GroupLocation,
  SessionFeedback,
  PeerUser,
  MentalHealthConcern,
  STUDY_GROUP_FOCUSES,
  MENTAL_HEALTH_CONCERNS,
  formatMeetingFrequency,
  getStatusColor,
} from '@/types/peerMatching';

interface StudyGroupSystemProps {
  currentUser?: PeerUser;
  onGroupJoin?: (groupId: string) => void;
  onGroupCreate?: (group: StudyGroup) => void;
  onSessionJoin?: (sessionId: string) => void;
  className?: string;
}

export const StudyGroupSystem: React.FC<StudyGroupSystemProps> = ({
  currentUser,
  onGroupJoin,
  onGroupCreate,
  onSessionJoin,
  className = '',
}) => {
  // Component state
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<StudyGroupFocus | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<GroupSession[]>([]);

  // Create group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    focus: 'mental-health-awareness' as StudyGroupFocus,
    mentalHealthTopics: [] as MentalHealthConcern[],
    subjectAreas: [] as string[],
    maxMembers: 8,
    isPrivate: false,
    requiresApproval: true,
    scheduleType: 'regular' as 'regular' | 'flexible',
    dayOfWeek: 'monday',
    time: '18:00',
    duration: 60,
    locationType: 'online' as 'online' | 'in-person' | 'hybrid',
    platform: 'Zoom',
    rules: [] as string[],
  });

  // Mock data for demonstration
  const mockAvailableGroups: StudyGroup[] = [
    {
      id: 'group_001',
      name: 'Mindful Study Circle',
      description:
        'A supportive group combining academic success with mindfulness practices. We focus on stress management techniques while maintaining high academic standards.',
      focus: 'mindfulness-meditation',
      mentalHealthTopics: ['stress', 'anxiety', 'academic-pressure'],
      subjectAreas: ['Psychology', 'Neuroscience', 'Philosophy'],
      creatorId: 'user_456',
      memberIds: ['user_456', 'user_789', 'user_101', 'user_202'],
      maxMembers: 8,
      currentMembers: 4,
      isPrivate: false,
      requiresApproval: true,
      status: 'active',
      createdAt: getCreationDate(),
      lastActivity: getRecentActivityDate(),
      schedule: {
        type: 'regular',
        regularSchedule: {
          dayOfWeek: 'wednesday',
          time: '18:00',
          duration: 90,
          timeZone: 'America/New_York',
        },
        upcomingSessions: [],
      },
      location: {
        type: 'online',
        details: 'Weekly Zoom meetings',
        platform: 'Zoom',
      },
      rules: [
        'Maintain confidentiality and respect',
        'Be punctual and prepared',
        'Practice active listening',
        'Support fellow members',
      ],
      tags: ['mindfulness', 'academic-success', 'stress-relief'],
      successMetrics: {
        attendanceRate: 85,
        memberRetention: 90,
        averageRating: 4.6,
        completionRate: 75,
        memberSatisfaction: 88,
        goalsAchieved: 12,
      },
    },
    {
      id: 'group_002',
      name: 'Exam Stress Support Group',
      description:
        'Peer support for managing exam anxiety and developing healthy study habits. Share strategies and encourage each other through challenging periods.',
      focus: 'stress-management',
      mentalHealthTopics: ['anxiety', 'academic-pressure', 'perfectionism'],
      subjectAreas: ['General Studies', 'Test Prep'],
      creatorId: 'user_303',
      memberIds: ['user_303', 'user_404', 'user_505'],
      maxMembers: 6,
      currentMembers: 3,
      isPrivate: false,
      requiresApproval: false,
      status: 'forming',
      createdAt: getRelativeDate(-30),
      lastActivity: getRecentActivityDate(),
      schedule: {
        type: 'flexible',
        flexibleTimes: [
          { start: '16:00', end: '18:00' },
          { start: '19:00', end: '21:00' },
        ],
        upcomingSessions: [],
      },
      location: {
        type: 'hybrid',
        details: 'Online with optional in-person meetups',
        platform: 'Discord',
      },
      rules: [
        'No judgment zone',
        'Share study tips and resources',
        'Be encouraging and supportive',
      ],
      tags: ['exam-prep', 'anxiety-support', 'study-tips'],
      successMetrics: {
        attendanceRate: 0,
        memberRetention: 100,
        averageRating: 0,
        completionRate: 0,
        memberSatisfaction: 0,
        goalsAchieved: 0,
      },
    },
    {
      id: 'group_003',
      name: 'Wellness Warriors',
      description:
        'Holistic approach to student wellness combining mental health awareness, physical health, and academic success. Building resilient habits together.',
      focus: 'wellness-habits',
      mentalHealthTopics: ['stress', 'self-esteem', 'burnout'],
      subjectAreas: ['Health Sciences', 'Psychology', 'Nutrition'],
      creatorId: 'user_606',
      memberIds: ['user_606', 'user_707', 'user_808', 'user_909', 'user_1010', 'user_1111'],
      maxMembers: 10,
      currentMembers: 6,
      isPrivate: false,
      requiresApproval: true,
      status: 'active',
      createdAt: getRelativeDate(-120),
      lastActivity: getRecentActivityDate(),
      schedule: {
        type: 'regular',
        regularSchedule: {
          dayOfWeek: 'saturday',
          time: '10:00',
          duration: 120,
          timeZone: 'America/New_York',
        },
        upcomingSessions: [],
      },
      location: {
        type: 'in-person',
        details: 'Student Center, Room 205',
        address: '123 University Ave, Campus Building',
      },
      rules: [
        'Attend regularly and be committed',
        'Share wellness goals and progress',
        "Support each other's journey",
        'Respect diverse wellness approaches',
      ],
      tags: ['wellness', 'habits', 'resilience', 'holistic-health'],
      successMetrics: {
        attendanceRate: 92,
        memberRetention: 85,
        averageRating: 4.8,
        completionRate: 80,
        memberSatisfaction: 95,
        goalsAchieved: 18,
      },
    },
  ];

  const mockMySessions: GroupSession[] = [
    {
      id: 'session_001',
      groupId: 'group_001',
      title: 'Mindful Exam Preparation',
      description:
        'Combining mindfulness techniques with effective study strategies for upcoming midterms.',
      scheduledAt: getScheduledDate(),
      duration: 90,
      attendeeIds: ['user_123', 'user_456', 'user_789'],
      facilitatorId: 'user_456',
      status: 'scheduled',
      materials: [
        {
          id: 'mat_001',
          title: 'Mindful Study Guide',
          type: 'document',
          url: '/materials/mindful-study-guide.pdf',
          description: 'Comprehensive guide to mindful studying techniques',
        },
      ],
      feedback: [],
    },
    {
      id: 'session_002',
      groupId: 'group_003',
      title: 'Building Healthy Sleep Habits',
      description:
        'Workshop on creating sustainable sleep routines for better academic performance.',
      scheduledAt: getRelativeDate(7, 10),
      duration: 120,
      attendeeIds: ['user_123', 'user_606', 'user_707', 'user_808'],
      facilitatorId: 'user_606',
      status: 'scheduled',
      materials: [],
      feedback: [],
    },
  ];

  useEffect(() => {
    setAvailableGroups(mockAvailableGroups);
    setMyGroups(mockAvailableGroups.slice(0, 2)); // User is in first 2 groups
    setUpcomingSessions(mockMySessions);
  }, []);

  // Filter groups based on search and focus
  const filteredGroups = availableGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFocus = selectedFocus === 'all' || group.focus === selectedFocus;
    return matchesSearch && matchesFocus;
  });

  const handleCreateGroup = () => {
    const group: StudyGroup = {
      id: `group_${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      focus: newGroup.focus,
      mentalHealthTopics: newGroup.mentalHealthTopics,
      subjectAreas: newGroup.subjectAreas,
      creatorId: currentUser?.id || 'user_123',
      memberIds: [currentUser?.id || 'user_123'],
      maxMembers: newGroup.maxMembers,
      currentMembers: 1,
      isPrivate: newGroup.isPrivate,
      requiresApproval: newGroup.requiresApproval,
      status: 'forming',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      schedule: {
        type: newGroup.scheduleType,
        regularSchedule:
          newGroup.scheduleType === 'regular'
            ? {
                dayOfWeek: newGroup.dayOfWeek,
                time: newGroup.time,
                duration: newGroup.duration,
                timeZone: 'America/New_York',
              }
            : undefined,
        upcomingSessions: [],
      },
      location: {
        type: newGroup.locationType,
        details: newGroup.locationType === 'online' ? `${newGroup.platform} meetings` : 'TBD',
        platform: newGroup.locationType === 'online' ? newGroup.platform : undefined,
      },
      rules: newGroup.rules,
      tags: [newGroup.focus.replace('-', ' ')],
      successMetrics: {
        attendanceRate: 0,
        memberRetention: 100,
        averageRating: 0,
        completionRate: 0,
        memberSatisfaction: 0,
        goalsAchieved: 0,
      },
    };

    onGroupCreate?.(group);
    setShowCreateDialog(false);

    // Reset form
    setNewGroup({
      name: '',
      description: '',
      focus: 'mental-health-awareness',
      mentalHealthTopics: [],
      subjectAreas: [],
      maxMembers: 8,
      isPrivate: false,
      requiresApproval: true,
      scheduleType: 'regular',
      dayOfWeek: 'monday',
      time: '18:00',
      duration: 60,
      locationType: 'online',
      platform: 'Zoom',
      rules: [],
    });
  };

  const joinGroup = (groupId: string) => {
    onGroupJoin?.(groupId);
    logStudyGroup('User requested to join study group', { groupId, userId: currentUser?.id });
  };

  const joinSession = (sessionId: string) => {
    onSessionJoin?.(sessionId);
    logStudyGroup('User joined study group session', { sessionId, userId: currentUser?.id });
  };

  const renderGroupCard = (group: StudyGroup, showJoinButton = true) => (
    <Card key={group.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.isPrivate && <Lock className="h-4 w-4 text-gray-500" />}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {STUDY_GROUP_FOCUSES[group.focus].icon} {STUDY_GROUP_FOCUSES[group.focus].label}
              </Badge>
              <Badge variant="secondary" style={{ backgroundColor: getStatusColor(group.status) }}>
                {group.status}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>
              {group.currentMembers}/{group.maxMembers} members
            </p>
            {group.successMetrics.averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{group.successMetrics.averageRating}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

        {/* Mental Health Topics */}
        {group.mentalHealthTopics.length > 0 && (
          <div>
            <Label className="text-xs font-medium">Focus Areas</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {group.mentalHealthTopics.slice(0, 3).map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {MENTAL_HEALTH_CONCERNS[topic].icon} {MENTAL_HEALTH_CONCERNS[topic].label}
                </Badge>
              ))}
              {group.mentalHealthTopics.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{group.mentalHealthTopics.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            {group.location.type === 'online' ? (
              <Globe className="h-4 w-4" />
            ) : group.location.type === 'in-person' ? (
              <MapPin className="h-4 w-4" />
            ) : (
              <Video className="h-4 w-4" />
            )}
            <span className="capitalize">{group.location.type}</span>
          </div>
          {group.schedule.regularSchedule && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {group.schedule.regularSchedule.dayOfWeek}s at {group.schedule.regularSchedule.time}
              </span>
            </div>
          )}
        </div>

        {/* Success Metrics for Active Groups */}
        {group.status === 'active' && group.successMetrics.attendanceRate > 0 && (
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <p className="font-semibold text-green-600">{group.successMetrics.attendanceRate}%</p>
              <p className="text-muted-foreground">Attendance</p>
            </div>
            <div>
              <p className="font-semibold text-blue-600">
                {group.successMetrics.memberSatisfaction}%
              </p>
              <p className="text-muted-foreground">Satisfaction</p>
            </div>
            <div>
              <p className="font-semibold text-purple-600">{group.successMetrics.goalsAchieved}</p>
              <p className="text-muted-foreground">Goals Achieved</p>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {group.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {showJoinButton ? (
            <>
              <Button
                size="sm"
                onClick={() => joinGroup(group.id)}
                disabled={group.currentMembers >= group.maxMembers}
                className="flex-1"
              >
                {group.requiresApproval ? (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Request to Join
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Join Group
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Chat
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSessionCard = (session: GroupSession) => {
    const group = availableGroups.find((g) => g.id === session.groupId);
    const timeUntil = new Date(session.scheduledAt).getTime() - new Date().getTime();
    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
    const isUpcoming = timeUntil > 0;

    return (
      <Card key={session.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{session.title}</h3>
                <Badge variant={isUpcoming ? 'default' : 'secondary'} className="text-xs">
                  {session.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{group?.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{session.description}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(session.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{session.attendeeIds.length} attending</span>
                </div>
              </div>
              {isUpcoming && hoursUntil <= 24 && (
                <div className="flex items-center space-x-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{hoursUntil > 0 ? `In ${hoursUntil} hours` : 'Starting soon'}</span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <Button size="sm" onClick={() => joinSession(session.id)} disabled={!isUpcoming}>
                {isUpcoming ? 'Join Session' : 'View Recording'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Mental Health Study Groups</h2>
        <p className="text-muted-foreground">
          Join supportive study groups focused on mental wellness and academic success
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{availableGroups.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{myGroups.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">My Groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{upcomingSessions.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">4.6</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="create">Create Group</TabsTrigger>
        </TabsList>

        {/* Discover Groups Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search groups, topics, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedFocus}
                  onValueChange={(value) => setSelectedFocus(value as StudyGroupFocus | 'all')}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Focus Areas</SelectItem>
                    {Object.entries(STUDY_GROUP_FOCUSES).map(([key, focus]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <span>{focus.icon}</span>
                          <span>{focus.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Group Results */}
          {filteredGroups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Groups Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or create a new group
                  </p>
                </div>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{filteredGroups.length} Groups Available</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGroups.map((group) => renderGroupCard(group, true))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* My Groups Tab */}
        <TabsContent value="my-groups" className="space-y-6">
          {myGroups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Groups Joined Yet</h3>
                  <p className="text-muted-foreground">
                    Discover and join study groups to start your collaborative learning journey
                  </p>
                </div>
                <Button onClick={() => setActiveTab('discover')}>
                  <Search className="h-4 w-4 mr-2" />
                  Discover Groups
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Study Groups</h3>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {myGroups.map((group) => renderGroupCard(group, false))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground">
                    Join study groups to see and participate in scheduled sessions
                  </p>
                </div>
                <Button onClick={() => setActiveTab('discover')}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Groups
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Upcoming Sessions</h3>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              <div className="space-y-3">{upcomingSessions.map(renderSessionCard)}</div>
            </div>
          )}
        </TabsContent>

        {/* Create Group Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Study Group</CardTitle>
              <CardDescription>
                Start a supportive learning community focused on mental health and academic success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., Mindful Study Circle"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    placeholder="Describe your group's purpose, goals, and what members can expect..."
                    value={newGroup.description}
                    onChange={(e) =>
                      setNewGroup((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Focus</Label>
                  <Select
                    value={newGroup.focus}
                    onValueChange={(value) =>
                      setNewGroup((prev) => ({ ...prev, focus: value as StudyGroupFocus }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STUDY_GROUP_FOCUSES).map(([key, focus]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <span>{focus.icon}</span>
                            <div>
                              <p className="font-medium">{focus.label}</p>
                              <p className="text-xs text-muted-foreground">{focus.description}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Group Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Group Settings</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maximum Members</Label>
                    <Select
                      value={newGroup.maxMembers.toString()}
                      onValueChange={(value) =>
                        setNewGroup((prev) => ({ ...prev, maxMembers: parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="6">6 members</SelectItem>
                        <SelectItem value="8">8 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="12">12 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Meeting Type</Label>
                    <Select
                      value={newGroup.locationType}
                      onValueChange={(value) =>
                        setNewGroup((prev) => ({
                          ...prev,
                          locationType: value as 'online' | 'in-person' | 'hybrid',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>Online</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-person">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>In-Person</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hybrid">
                          <div className="flex items-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Hybrid</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-group"
                      checked={newGroup.isPrivate}
                      onCheckedChange={(checked) =>
                        setNewGroup((prev) => ({ ...prev, isPrivate: !!checked }))
                      }
                    />
                    <Label htmlFor="private-group" className="text-sm">
                      Private Group
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requires-approval"
                      checked={newGroup.requiresApproval}
                      onCheckedChange={(checked) =>
                        setNewGroup((prev) => ({ ...prev, requiresApproval: !!checked }))
                      }
                    />
                    <Label htmlFor="requires-approval" className="text-sm">
                      Require Approval
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab('discover')}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name || !newGroup.description}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroupSystem;
