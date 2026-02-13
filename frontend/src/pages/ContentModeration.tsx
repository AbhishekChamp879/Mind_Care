import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Flag,
  MessageCircle,
  Users,
  BookOpen,
  Clock,
  Filter,
  Download,
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'chat' | 'forum' | 'resource' | 'comment';
  content: string;
  author: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reports: number;
  reason?: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'chat',
    content: "I've been having really dark thoughts lately and I don't know what to do...",
    author: 'Anonymous User',
    timestamp: '2024-01-15 14:23:12',
    status: 'flagged',
    severity: 'high',
    reports: 3,
    reason: 'Self-harm mentions',
  },
  {
    id: '2',
    type: 'forum',
    content: 'Great tips for managing anxiety during exams! This really helped me stay calm.',
    author: 'Sarah J.',
    timestamp: '2024-01-15 13:45:33',
    status: 'approved',
    severity: 'low',
    reports: 0,
  },
  {
    id: '3',
    type: 'comment',
    content: 'This is stupid advice, nobody understands what real depression feels like',
    author: 'Mike123',
    timestamp: '2024-01-15 12:12:45',
    status: 'pending',
    severity: 'medium',
    reports: 2,
    reason: 'Inappropriate language',
  },
  {
    id: '4',
    type: 'resource',
    content: 'Mindfulness meditation techniques for stress relief - A comprehensive guide...',
    author: 'Dr. Wilson',
    timestamp: '2024-01-15 11:30:21',
    status: 'approved',
    severity: 'low',
    reports: 0,
  },
  {
    id: '5',
    type: 'chat',
    content: 'I want to hurt myself and end everything. Life is meaningless.',
    author: 'Anonymous User',
    timestamp: '2024-01-15 10:15:44',
    status: 'flagged',
    severity: 'critical',
    reports: 5,
    reason: 'Suicide ideation',
  },
];

const ContentModeration = () => {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Debounce search term to avoid excessive filtering operations
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtering logic to prevent unnecessary recalculations
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesSearch =
        item.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
      return matchesSearch && matchesType && matchesStatus && matchesSeverity;
    });
  }, [content, debouncedSearchTerm, typeFilter, statusFilter, severityFilter]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleSeverityFilterChange = useCallback((value: string) => {
    setSeverityFilter(value);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return MessageCircle;
      case 'forum':
        return Users;
      case 'resource':
        return BookOpen;
      case 'comment':
        return MessageCircle;
      default:
        return MessageCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-severity-low text-white';
      case 'rejected':
        return 'bg-severity-high text-white';
      case 'flagged':
        return 'bg-severity-medium text-white';
      case 'pending':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-severity-low text-white';
      case 'medium':
        return 'bg-severity-medium text-white';
      case 'high':
        return 'bg-severity-high text-white';
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (id: string) => {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' as const } : item))
    );
  };

  const handleReject = (id: string) => {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' as const } : item))
    );
  };

  const handleFlag = (id: string) => {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'flagged' as const } : item))
    );
  };

  const contentStats = {
    total: content.length,
    pending: content.filter((c) => c.status === 'pending').length,
    flagged: content.filter((c) => c.status === 'flagged').length,
    critical: content.filter((c) => c.severity === 'critical').length,
    highReports: content.filter((c) => c.reports >= 3).length,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Content Moderation
          </h1>
          <p className="text-lg text-muted-foreground">
            Review and moderate platform content for safety and quality
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="hero">
            <Shield className="h-4 w-4 mr-2" />
            Safety Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <MessageCircle className="h-5 w-5 text-primary" />
              <Badge variant="secondary">Total</Badge>
            </div>
            <CardTitle className="text-2xl">{contentStats.total}</CardTitle>
            <CardDescription>Content Items</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-secondary" />
              <Badge className="bg-secondary text-secondary-foreground">Pending</Badge>
            </div>
            <CardTitle className="text-2xl">{contentStats.pending}</CardTitle>
            <CardDescription>Awaiting Review</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Flag className="h-5 w-5 text-severity-medium" />
              <Badge className="bg-severity-medium text-white">Flagged</Badge>
            </div>
            <CardTitle className="text-2xl">{contentStats.flagged}</CardTitle>
            <CardDescription>Requires Action</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
            </div>
            <CardTitle className="text-2xl">{contentStats.critical}</CardTitle>
            <CardDescription>Critical Issues</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Shield className="h-5 w-5 text-severity-high" />
              <Badge className="bg-severity-high text-white">Reports</Badge>
            </div>
            <CardTitle className="text-2xl">{contentStats.highReports}</CardTitle>
            <CardDescription>Multiple Reports</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Content Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Content</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content Type</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="chat">Chat Messages</option>
                <option value="forum">Forum Posts</option>
                <option value="resource">Resources</option>
                <option value="comment">Comments</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={severityFilter}
                onChange={(e) => handleSeverityFilterChange(e.target.value)}
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content Review ({filteredContent.length})</span>
            <div className="text-sm text-muted-foreground">
              Showing {filteredContent.length} of {content.length} items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="p-6 rounded-lg bg-muted/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <TypeIcon className="h-5 w-5 text-primary" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                          {item.reports > 0 && (
                            <Badge variant="destructive">{item.reports} reports</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>By: {item.author}</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-md border">
                    <p className="text-sm">{item.content}</p>
                  </div>

                  {item.reason && (
                    <div className="bg-severity-medium/10 p-3 rounded-md">
                      <p className="text-sm font-medium text-severity-medium">
                        Flagged for: {item.reason}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="text-severity-low hover:text-severity-low"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlag(item.id)}
                        className="text-severity-medium hover:text-severity-medium"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Flag
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;
