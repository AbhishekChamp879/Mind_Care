import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Phone, MessageCircle, Star } from 'lucide-react';

interface SessionData {
  id: string;
  counsellorName: string;
  counsellorImage: string;
  counsellorSpecialty: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'chat';
  rating?: number;
  notes?: string;
}

const mockSessions: SessionData[] = [
  {
    id: '1',
    counsellorName: 'Dr. Sarah Ahmed',
    counsellorImage: '/placeholder.svg',
    counsellorSpecialty: 'Anxiety & Depression',
    date: '2024-09-20',
    time: '10:00 AM',
    duration: 50,
    status: 'upcoming',
    type: 'video',
  },
  {
    id: '2',
    counsellorName: 'Dr. Michael Chen',
    counsellorImage: '/placeholder.svg',
    counsellorSpecialty: 'Relationship Counseling',
    date: '2024-09-15',
    time: '2:30 PM',
    duration: 45,
    status: 'completed',
    type: 'video',
    rating: 5,
    notes: 'Great session, felt very comfortable discussing my concerns.',
  },
  {
    id: '3',
    counsellorName: 'Dr. Fatima Khan',
    counsellorImage: '/placeholder.svg',
    counsellorSpecialty: 'Stress Management',
    date: '2024-09-18',
    time: '4:00 PM',
    duration: 30,
    status: 'completed',
    type: 'audio',
    rating: 4,
    notes: 'Helpful breathing techniques learned.',
  },
  {
    id: '4',
    counsellorName: 'Dr. James Wilson',
    counsellorImage: '/placeholder.svg',
    counsellorSpecialty: 'Career Counseling',
    date: '2024-09-25',
    time: '11:30 AM',
    duration: 60,
    status: 'upcoming',
    type: 'chat',
  },
];

const Sessions = () => {
  const upcomingSessions = mockSessions.filter((session) => session.status === 'upcoming');
  const completedSessions = mockSessions.filter((session) => session.status === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge variant="default" className="bg-trust/20 text-trust border-trust/30">
            Upcoming
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="bg-severity/20 text-severity border-severity/30">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'chat':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-xl" />
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-elegant">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                My Sessions
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your counselling sessions and connect with your therapists
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Upcoming Sessions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-trust" />
              Upcoming Sessions
            </h2>

            {upcomingSessions.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-soft">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                  <Button className="mt-4" variant="default">
                    Book a Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="bg-card/60 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-trust/20">
                            <AvatarImage src={session.counsellorImage} alt={`${session.counsellorName}'s profile picture`} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {session.counsellorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{session.counsellorName}</CardTitle>
                            <CardDescription className="text-trust font-medium">
                              {session.counsellorSpecialty}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(session.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {session.time} • {session.duration} minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getTypeIcon(session.type)}
                          <span className="capitalize">{session.type} Session</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Join Session
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Past Sessions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent" />
              Past Sessions
            </h2>

            <div className="grid gap-4">
              {completedSessions.map((session) => (
                <Card
                  key={session.id}
                  className="bg-card/40 backdrop-blur-sm border-border/30 shadow-soft"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-1 ring-border">
                          <AvatarImage src={session.counsellorImage} alt={`${session.counsellorName}'s profile picture`} />
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {session.counsellorName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{session.counsellorName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.counsellorSpecialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(session.status)}
                        {session.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(session.rating)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(session.type)}
                        <span className="capitalize">{session.type}</span>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {session.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Book Again
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
