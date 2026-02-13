import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Users,
  Search,
  Heart,
  MessageCircle,
  Clock,
  Star,
  Shield,
  Zap,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Filter,
  SortAsc,
} from 'lucide-react';
import { getCreationDate, getRelativeDate, getRecentActivityDate } from '../../utils/dateUtils';

import {
  PeerUser,
  PeerBuddy,
  MatchingRequest,
  MatchResult,
  PotentialMatch,
  CompatibilityScore,
  MentalHealthConcern,
  StudentYear,
  CommunicationStyle,
  MeetingFrequency,
  AnonymityLevel,
  MENTAL_HEALTH_CONCERNS,
  calculateCompatibilityScore,
  generateAnonymousDisplayName,
  getStatusColor,
  formatMeetingFrequency,
} from '@/types/peerMatching';

interface PeerBuddyMatchingProps {
  currentUser?: PeerUser;
  onMatchFound?: (match: PeerBuddy) => void;
  onConnectionStart?: (buddyId: string) => void;
  className?: string;
}

export const PeerBuddyMatching: React.FC<PeerBuddyMatchingProps> = ({
  currentUser,
  onMatchFound,
  onConnectionStart,
  className = '',
}) => {
  // Component state
  const [activeTab, setActiveTab] = useState<string>('find-buddy');
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [currentMatches, setCurrentMatches] = useState<PotentialMatch[]>([]);
  const [activeBuddies, setActiveBuddies] = useState<PeerBuddy[]>([]);
  const [matchingPreferences, setMatchingPreferences] = useState({
    concernsWeight: 0.4,
    scheduleWeight: 0.2,
    personalityWeight: 0.2,
    communicationWeight: 0.2,
    minimumCompatibility: 60,
  });

  // Mock current user if not provided
  const [user, setUser] = useState<PeerUser>(
    currentUser || {
      id: 'user_123',
      anonymousId: 'anonymous_123',
      displayName: generateAnonymousDisplayName(),
      isOnline: true,
      lastActive: new Date().toISOString(),
      year: 'junior',
      major: 'Psychology',
      institution: 'University College',
      mentalHealthConcerns: ['anxiety', 'academic-pressure', 'stress'],
      interests: ['reading', 'meditation', 'outdoor activities'],
      availableHours: {
        monday: [{ start: '14:00', end: '16:00' }],
        tuesday: [{ start: '10:00', end: '12:00' }],
        wednesday: [{ start: '14:00', end: '16:00' }],
        thursday: [{ start: '10:00', end: '12:00' }],
        friday: [{ start: '15:00', end: '17:00' }],
        saturday: [{ start: '09:00', end: '11:00' }],
        sunday: [{ start: '14:00', end: '16:00' }],
      },
      timeZone: 'America/New_York',
      preferences: {
        genderPreference: 'any',
        ageRange: { min: 18, max: 25 },
        communicationStyle: 'text-only',
        meetingFrequency: 'weekly',
        groupSizePreference: 'one-on-one',
        anonymityLevel: 'first-name-only',
        supportType: ['emotional-support', 'study-buddy'],
      },
      profileComplete: true,
      verificationStatus: 'verified',
      createdAt: getCreationDate(),
    }
  );

  // Mock potential matches
  const mockMatches: PotentialMatch[] = [
    {
      targetId: 'peer_456',
      compatibility: {
        overall: 87,
        concernsMatch: 85,
        scheduleMatch: 90,
        personalityMatch: 80,
        communicationMatch: 95,
        goalAlignment: 85,
        breakdown: {
          sharedConcerns: 2,
          availableHours: 8,
          communicationStyle: 100,
          yearLevel: 100,
          institution: 100,
          preferences: 85,
        },
      },
      rank: 1,
      reasons: [
        'Shares anxiety and academic pressure concerns',
        'Excellent schedule compatibility (8 hours overlap)',
        'Same communication preference (text-only)',
        'Similar academic year and institution',
      ],
      warnings: [],
      estimatedWaitTime: 5,
    },
    {
      targetId: 'peer_789',
      compatibility: {
        overall: 76,
        concernsMatch: 70,
        scheduleMatch: 75,
        personalityMatch: 85,
        communicationMatch: 80,
        goalAlignment: 75,
        breakdown: {
          sharedConcerns: 1,
          availableHours: 6,
          communicationStyle: 80,
          yearLevel: 90,
          institution: 100,
          preferences: 75,
        },
      },
      rank: 2,
      reasons: [
        'Shares stress management focus',
        'Good schedule overlap (6 hours)',
        'Similar year level',
        'Both interested in emotional support',
      ],
      warnings: ['Different communication style preference'],
      estimatedWaitTime: 10,
    },
    {
      targetId: 'peer_101',
      compatibility: {
        overall: 68,
        concernsMatch: 60,
        scheduleMatch: 70,
        personalityMatch: 75,
        communicationMatch: 65,
        goalAlignment: 70,
        breakdown: {
          sharedConcerns: 1,
          availableHours: 5,
          communicationStyle: 60,
          yearLevel: 80,
          institution: 100,
          preferences: 70,
        },
      },
      rank: 3,
      reasons: [
        'Shared interest in study support',
        'Compatible weekly meeting preference',
        'Same institution',
      ],
      warnings: ['Lower concern overlap', 'Different communication preferences'],
      estimatedWaitTime: 15,
    },
  ];

  // Mock active buddies
  const mockActiveBuddies: PeerBuddy[] = [
    {
      id: 'buddy_001',
      user1Id: user.id,
      user2Id: 'peer_456',
      matchedAt: getRelativeDate(-15, 10),
      status: 'active',
      compatibility: mockMatches[0].compatibility,
      sharedConcerns: ['anxiety', 'academic-pressure'],
      connectionType: 'peer-buddy',
      lastInteraction: getRecentActivityDate(),
      totalInteractions: 15,
      averageResponseTime: 45,
      connectionStrength: 85,
      isActive: true,
    },
    {
      id: 'buddy_002',
      user1Id: user.id,
      user2Id: 'peer_789',
      matchedAt: getRelativeDate(-20, 15),
      status: 'paused',
      compatibility: mockMatches[1].compatibility,
      sharedConcerns: ['stress'],
      connectionType: 'support-buddy',
      lastInteraction: getRelativeDate(-3, 16, 20),
      totalInteractions: 8,
      averageResponseTime: 120,
      connectionStrength: 65,
      isActive: false,
      endReason: 'Mutual agreement to pause',
    },
  ];

  useEffect(() => {
    setCurrentMatches(mockMatches);
    setActiveBuddies(mockActiveBuddies);
  }, []);

  // Matching simulation
  const startMatching = async () => {
    setIsMatching(true);
    setMatchingProgress(0);

    // Simulate matching progress
    const progressInterval = setInterval(() => {
      setMatchingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsMatching(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate finding matches after 5 seconds
    setTimeout(() => {
      setCurrentMatches(mockMatches);
      if (onMatchFound && mockMatches.length > 0) {
        // Create a buddy from the best match
        const bestMatch = mockMatches[0];
        const newBuddy: PeerBuddy = {
          id: `buddy_${Date.now()}`,
          user1Id: user.id,
          user2Id: bestMatch.targetId,
          matchedAt: new Date().toISOString(),
          status: 'pending-acceptance',
          compatibility: bestMatch.compatibility,
          sharedConcerns: user.mentalHealthConcerns.slice(0, 2) as MentalHealthConcern[],
          connectionType: 'peer-buddy',
          lastInteraction: new Date().toISOString(),
          totalInteractions: 0,
          averageResponseTime: 0,
          connectionStrength: bestMatch.compatibility.overall,
          isActive: false,
        };
        onMatchFound(newBuddy);
      }
    }, 5000);
  };

  const acceptMatch = (matchId: string) => {
    console.log('Accepting match:', matchId);
    // In real app, this would send acceptance to the other user
  };

  const declineMatch = (matchId: string) => {
    setCurrentMatches((prev) => prev.filter((match) => match.targetId !== matchId));
  };

  const startConversation = (buddyId: string) => {
    onConnectionStart?.(buddyId);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const renderMatchCard = (match: PotentialMatch) => (
    <Card key={match.targetId} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Anonymous Peer #{match.rank}</CardTitle>
              <CardDescription>
                {generateAnonymousDisplayName()} • Junior • Psychology
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getCompatibilityColor(match.compatibility.overall)} border-0`}>
            {match.compatibility.overall}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shared Concerns */}
        <div>
          <Label className="text-sm font-medium">Shared Concerns</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.mentalHealthConcerns
              .slice(0, match.compatibility.breakdown.sharedConcerns)
              .map((concern) => (
                <Badge key={concern} variant="outline" className="text-xs">
                  {MENTAL_HEALTH_CONCERNS[concern].icon} {MENTAL_HEALTH_CONCERNS[concern].label}
                </Badge>
              ))}
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Compatibility Details</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Concerns:</span>
              <span className="font-medium">{match.compatibility.concernsMatch}%</span>
            </div>
            <div className="flex justify-between">
              <span>Schedule:</span>
              <span className="font-medium">{match.compatibility.scheduleMatch}%</span>
            </div>
            <div className="flex justify-between">
              <span>Communication:</span>
              <span className="font-medium">{match.compatibility.communicationMatch}%</span>
            </div>
            <div className="flex justify-between">
              <span>Goals:</span>
              <span className="font-medium">{match.compatibility.goalAlignment}%</span>
            </div>
          </div>
        </div>

        {/* Match Reasons */}
        <div>
          <Label className="text-sm font-medium">Why This Match?</Label>
          <ul className="mt-1 space-y-1">
            {match.reasons.slice(0, 3).map((reason, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {match.warnings.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-yellow-600">Considerations</Label>
            <ul className="mt-1 space-y-1">
              {match.warnings.map((warning, index) => (
                <li key={index} className="flex items-start space-x-2 text-xs text-yellow-600">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated Wait Time */}
        {match.estimatedWaitTime && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Usually responds within {match.estimatedWaitTime} minutes</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" onClick={() => acceptMatch(match.targetId)} className="flex-1">
            <UserCheck className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button size="sm" variant="outline" onClick={() => declineMatch(match.targetId)}>
            <XCircle className="h-4 w-4 mr-2" />
            Pass
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveBuddy = (buddy: PeerBuddy) => (
    <Card key={buddy.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  buddy.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{generateAnonymousDisplayName()}</CardTitle>
              <CardDescription>
                {buddy.connectionType.replace('-', ' ')} •{' '}
                {new Date(buddy.matchedAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={buddy.status === 'active' ? 'default' : 'secondary'}
            style={{ backgroundColor: getStatusColor(buddy.status) }}
          >
            {buddy.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{buddy.totalInteractions}</p>
            <p className="text-xs text-muted-foreground">Messages</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{buddy.connectionStrength}</p>
            <p className="text-xs text-muted-foreground">Connection</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{buddy.averageResponseTime}m</p>
            <p className="text-xs text-muted-foreground">Response</p>
          </div>
        </div>

        {/* Shared Concerns */}
        <div>
          <Label className="text-sm font-medium">Shared Focus Areas</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {buddy.sharedConcerns.map((concern) => (
              <Badge key={concern} variant="outline" className="text-xs">
                {MENTAL_HEALTH_CONCERNS[concern].icon} {MENTAL_HEALTH_CONCERNS[concern].label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Interaction */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last interaction:</span>
          <span>{new Date(buddy.lastInteraction).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {buddy.status === 'active' ? (
            <Button size="sm" onClick={() => startConversation(buddy.id)} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Continue Chat
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => startConversation(buddy.id)}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reconnect
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Peer Buddy Matching</h2>
        <p className="text-muted-foreground">
          Connect anonymously with peers who share similar concerns and experiences
        </p>
      </div>

      {/* User Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Anonymous Profile: {user.displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.year} • {user.mentalHealthConcerns.length} focus areas •{' '}
                  {user.verificationStatus}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-buddy">Find Buddy</TabsTrigger>
          <TabsTrigger value="active-buddies">My Buddies ({activeBuddies.length})</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Find Buddy Tab */}
        <TabsContent value="find-buddy" className="space-y-6">
          {!isMatching && currentMatches.length === 0 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Search className="h-6 w-6" />
                  <span>Find Your Peer Buddy</span>
                </CardTitle>
                <CardDescription>
                  We'll match you with peers based on shared concerns, availability, and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Anonymous & Safe</h3>
                    <p className="text-sm text-muted-foreground">
                      Your identity remains protected while connecting with peers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Smart Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered matching based on concerns and compatibility
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Real-time Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant messaging with your matched peer buddies
                    </p>
                  </div>
                </div>

                <Button size="lg" onClick={startMatching} className="w-full md:w-auto">
                  <Users className="h-5 w-5 mr-2" />
                  Start Finding Buddies
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Matching Progress */}
          {isMatching && (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Finding Your Perfect Buddies...</h3>
                  <p className="text-muted-foreground">
                    Analyzing compatibility with available peers
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={matchingProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{matchingProgress}% Complete</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Match Results */}
          {!isMatching && currentMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Found {currentMatches.length} Compatible Buddies
                </h3>
                <Button variant="outline" size="sm" onClick={startMatching}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Find More
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">{currentMatches.map(renderMatchCard)}</div>
            </div>
          )}
        </TabsContent>

        {/* Active Buddies Tab */}
        <TabsContent value="active-buddies" className="space-y-6">
          {activeBuddies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Active Buddies Yet</h3>
                  <p className="text-muted-foreground">
                    Start by finding your first peer buddy to begin your support journey
                  </p>
                </div>
                <Button onClick={() => setActiveTab('find-buddy')}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Your First Buddy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Peer Buddies</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeBuddies.map(renderActiveBuddy)}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matching Preferences</CardTitle>
              <CardDescription>Customize how we find your ideal peer buddies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Anonymity Level */}
              <div className="space-y-3">
                <Label>Anonymity Level</Label>
                <Select defaultValue={user.preferences.anonymityLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully-anonymous">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4" />
                        <span>Fully Anonymous</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="first-name-only">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>First Name Only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Matching Weights */}
              <div className="space-y-4">
                <Label>Matching Priority</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shared Concerns</span>
                    <span className="text-sm font-medium">
                      {Math.round(matchingPreferences.concernsWeight * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Schedule Compatibility</span>
                    <span className="text-sm font-medium">
                      {Math.round(matchingPreferences.scheduleWeight * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Communication Style</span>
                    <span className="text-sm font-medium">
                      {Math.round(matchingPreferences.communicationWeight * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-3">
                <Label>Preferred Communication</Label>
                <Select defaultValue={user.preferences.communicationStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-only">Text Messages Only</SelectItem>
                    <SelectItem value="voice-calls">Voice Calls</SelectItem>
                    <SelectItem value="video-calls">Video Calls</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meeting Frequency */}
              <div className="space-y-3">
                <Label>Meeting Frequency</Label>
                <Select defaultValue={user.preferences.meetingFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="few-times-week">Few times a week</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeerBuddyMatching;
