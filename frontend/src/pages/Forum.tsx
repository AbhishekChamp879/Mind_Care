import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  ThumbsUp,
  Reply,
  Shield,
  Heart,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  MoreVertical,
  Send,
  X,
  AlertCircle,
  Star,
  Bookmark,
  Share2,
  Flag,
  ChevronDown,
  ChevronUp,
  Pin,
  Zap,
  Award,
  List,
  Grid,
} from 'lucide-react';

interface ForumReply {
  id: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: Date;
  likes: number;
  isVerifiedMentor?: boolean;
  parentId?: string; // For nested replies
  isModerated?: boolean;
  isReported?: boolean;
  reportCount?: number;
  isHidden?: boolean;
  aiSentimentScore?: number;
  supportiveScore?: number;
}

interface ModerationAction {
  id: string;
  postId: string;
  action: 'approve' | 'hide' | 'warn' | 'ban';
  reason: string;
  moderatorId: string;
  timestamp: Date;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: Date;
  category: string;
  replies: ForumReply[];
  likes: number;
  views: number;
  isVerifiedMentor?: boolean;
  tags: string[];
  isPinned?: boolean;
  isLocked?: boolean;
  isModerated?: boolean;
  isReported?: boolean;
  reportCount?: number;
  likedBy: string[];
  bookmarkedBy: string[];
  aiSentimentScore?: number;
  supportiveScore?: number;
  helpfulness?: number;
  lastActive?: Date;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Dealing with exam anxiety - any tips?',
    content:
      "I have finals coming up next week and I'm feeling overwhelmed. My heart races every time I think about the exams. Has anyone found effective ways to manage this?",
    author: 'Anonymous Student',
    isAnonymous: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Academic Stress',
    replies: [
      {
        id: 'r1',
        content: 'Deep breathing exercises really help me! Try the 4-7-8 technique.',
        author: 'StudyBuddy',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 5,
      },
      {
        id: 'r2',
        content: 'I found that breaking study sessions into smaller chunks reduces my anxiety.',
        author: 'Anonymous Student',
        isAnonymous: true,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        likes: 3,
      },
    ],
    likes: 18,
    views: 156,
    tags: ['anxiety', 'exams', 'stress-management'],
    isPinned: false,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: '2',
    title: 'Meditation apps that actually work?',
    content:
      "I've tried several meditation apps but haven't found one that clicks with me. Looking for recommendations, especially for beginners.",
    author: 'MindfulStudent22',
    isAnonymous: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'Mindfulness',
    replies: [
      {
        id: 'r3',
        content:
          'Headspace worked great for me as a beginner. The guided sessions are very helpful.',
        author: 'ZenMaster',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 7,
      },
    ],
    likes: 14,
    views: 89,
    tags: ['meditation', 'apps', 'mindfulness'],
    isPinned: false,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: '3',
    title: 'How I improved my sleep schedule as a college student',
    content:
      'After struggling with insomnia for months, I finally found a routine that works. Sharing what helped me in case it helps others...',
    author: 'Dr. Sarah Wilson',
    isAnonymous: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'Sleep Health',
    replies: [
      {
        id: 'r4',
        content: 'Thank you for sharing! The consistent bedtime tip really resonates with me.',
        author: 'NightOwl',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
        likes: 2,
      },
      {
        id: 'r5',
        content: 'As a fellow insomniac, I appreciate the detailed routine you shared.',
        author: 'Anonymous Student',
        isAnonymous: true,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 4,
      },
    ],
    likes: 45,
    views: 234,
    isVerifiedMentor: true,
    tags: ['sleep', 'routine', 'self-care'],
    isPinned: true,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: '4',
    title: 'Support group for social anxiety?',
    content:
      'Is there interest in starting a weekly virtual support group for students dealing with social anxiety? I think it could be really helpful.',
    author: 'Anonymous Student',
    isAnonymous: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'Peer Support',
    replies: [
      {
        id: 'r6',
        content: 'I would definitely be interested! This sounds like a great idea.',
        author: 'ShyStudent',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 3,
      },
    ],
    likes: 11,
    views: 67,
    tags: ['social-anxiety', 'support-group', 'community'],
    isPinned: false,
    likedBy: [],
    bookmarkedBy: [],
  },
];

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(true);
  const [showModeration, setShowModeration] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [threadedView, setThreadedView] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General Discussion',
    isAnonymous: true,
    tags: '',
  });

  // AI-powered content analysis
  const analyzeContent = (
    content: string
  ): { sentiment: number; supportive: number; helpful: number } => {
    // Simplified AI analysis - in real app would use actual AI service
    const supportiveWords = [
      'support',
      'help',
      'understand',
      'care',
      'listen',
      'here for you',
      'not alone',
    ];
    const negativeWords = ['hate', 'stupid', 'worthless', 'terrible', 'awful'];
    const helpfulWords = ['advice', 'tip', 'suggest', 'recommend', 'experience', 'worked for me'];

    const words = content.toLowerCase().split(' ');
    const supportiveCount = supportiveWords.filter((word) =>
      content.toLowerCase().includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      content.toLowerCase().includes(word)
    ).length;
    const helpfulCount = helpfulWords.filter((word) => content.toLowerCase().includes(word)).length;

    return {
      sentiment: Math.max(
        0,
        Math.min(1, ((supportiveCount - negativeCount) / words.length) * 10 + 0.5)
      ),
      supportive: Math.min(1, supportiveCount / 3),
      helpful: Math.min(1, helpfulCount / 2),
    };
  };

  // Enhanced moderation actions
  const moderatePost = (
    postId: string,
    action: 'approve' | 'hide' | 'warn' | 'ban',
    reason: string
  ) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isModerated: true, isHidden: action === 'hide' } : post
      )
    );
  };

  const reportPost = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isReported: true, reportCount: (post.reportCount || 0) + 1 }
          : post
      )
    );
    setReportDialogOpen(null);
    setReportReason('');
  };

  // Community interaction features
  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const bookmarked = post.bookmarkedBy.includes(user?.id || '');
          return {
            ...post,
            bookmarkedBy: bookmarked
              ? post.bookmarkedBy.filter((id) => id !== user?.id)
              : [...post.bookmarkedBy, user?.id || ''],
          };
        }
        return post;
      })
    );
  };

  const categories = [
    'all',
    'Academic Stress',
    'Mindfulness',
    'Sleep Health',
    'Peer Support',
    'General Discussion',
    'Crisis Support',
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-replies', label: 'Most Replies' },
    { value: 'trending', label: 'Trending' },
  ];

  // Enhanced filtering and sorting
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'most-liked':
          return b.likes - a.likes;
        case 'most-replies':
          return b.replies.length - a.replies.length;
        case 'trending': {
          // Simple trending algorithm based on recent activity and engagement
          const aScore =
            (a.likes * 2 + a.replies.length * 3 + a.views) /
            Math.max(1, (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60));
          const bScore =
            (b.likes * 2 + b.replies.length * 3 + b.views) /
            Math.max(1, (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60));
          return bScore - aScore;
        }
        default: // newest
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    })
    // Pinned posts always at top
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  // Update views when post is expanded
  useEffect(() => {
    expandedPosts.forEach((postId) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, views: post.views + 1 } : post))
      );
    });
  }, [expandedPosts]);

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in both title and content to create your post.');
      return;
    }

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.isAnonymous ? 'Anonymous Student' : user?.name || 'Current User',
      isAnonymous: newPost.isAnonymous,
      timestamp: new Date(),
      category: newPost.category,
      replies: [],
      likes: 0,
      views: 0,
      tags: newPost.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      isPinned: false,
      likedBy: [],
      bookmarkedBy: [],
    };

    setPosts([post, ...posts]);
    setNewPost({
      title: '',
      content: '',
      category: 'General Discussion',
      isAnonymous: true,
      tags: '',
    });
    setShowNewPostForm(false);

    // Success notification
    toast.success('Your post has been created successfully!', {
      description: `"${post.title}" is now live in the ${post.category} category.`,
      duration: 4000,
      action: {
        label: 'View Post',
        onClick: () => {
          const postElement = document.getElementById(`post-${post.id}`);
          if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        },
      },
    });
  };

  const handleLikePost = (postId: string) => {
    const userId = user?.id || 'anonymous-user';
    const targetPost = posts.find((post) => post.id === postId);
    const isCurrentlyLiked = targetPost?.likedBy.includes(userId);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter((id) => id !== userId)
              : [...post.likedBy, userId],
          };
        }
        return post;
      })
    );

    // Show feedback notification
    if (isCurrentlyLiked) {
      toast('Like removed', {
        description: `You've unliked "${targetPost?.title}".`,
        duration: 2000,
      });
    } else {
      toast.success('Post liked!', {
        description: `You liked "${targetPost?.title}".`,
        duration: 2000,
      });
    }
  };

  const handleBookmarkPost = (postId: string) => {
    const userId = user?.id || 'anonymous-user';
    const targetPost = posts.find((post) => post.id === postId);
    const isCurrentlyBookmarked = targetPost?.bookmarkedBy.includes(userId);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isBookmarked = post.bookmarkedBy.includes(userId);
          return {
            ...post,
            bookmarkedBy: isBookmarked
              ? post.bookmarkedBy.filter((id) => id !== userId)
              : [...post.bookmarkedBy, userId],
          };
        }
        return post;
      })
    );

    // Show feedback notification
    if (isCurrentlyBookmarked) {
      toast('Bookmark removed', {
        description: `"${targetPost?.title}" has been removed from your bookmarks.`,
        duration: 2000,
      });
    } else {
      toast.success('Post bookmarked!', {
        description: `"${targetPost?.title}" has been saved to your bookmarks.`,
        duration: 2000,
      });
    }
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply before submitting.');
      return;
    }

    const reply: ForumReply = {
      id: Date.now().toString(),
      content: replyContent,
      author: isReplyAnonymous ? 'Anonymous Student' : user?.name || 'Current User',
      isAnonymous: isReplyAnonymous,
      timestamp: new Date(),
      likes: 0,
    };

    // Find the post to get its title for the notification
    const targetPost = posts.find((post) => post.id === postId);

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, replies: [...post.replies, reply] } : post
      )
    );

    setReplyContent('');
    setReplyingTo(null);
    setIsReplyAnonymous(true);

    // Success notification for reply
    toast.success('Reply posted successfully!', {
      description: `Your response has been added to "${targetPost?.title || 'the discussion'}".`,
      duration: 3000,
    });
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-6xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 fade-in">
        <div className="flex items-center justify-center space-x-3 mb-4 group">
          <div className="relative">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-hero rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">Peer Support Forum</h1>
            <div className="h-1 w-20 bg-gradient-primary rounded-full mx-auto"></div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Connect with fellow students in a safe, anonymous space. Share experiences, get support,
          and help others on their mental wellness journey.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3">
          <Badge variant="secondary" className="bg-gradient-primary text-white shadow-soft">
            <Heart className="h-3 w-3 mr-1" />
            Safe Space
          </Badge>
          <Badge variant="outline" className="border-secondary/30 text-secondary">
            <Shield className="h-3 w-3 mr-1" />
            Anonymous Support
          </Badge>
          <Badge variant="outline" className="border-primary/30 text-primary">
            <Users className="h-3 w-3 mr-1" />
            {posts.length} Active Discussions
          </Badge>
        </div>
      </div>

      {/* Enhanced Search & Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus-enhanced"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="bg-gradient-primary hover:shadow-glow btn-enhanced"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize transition-all duration-300"
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced New Post Form */}
      {showNewPostForm && (
        <Card className="enhanced-card slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Create New Discussion</span>
            </CardTitle>
            <CardDescription>
              Share your thoughts, ask for advice, or start a supportive conversation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">Title *</Label>
                <Input
                  id="post-title"
                  placeholder="What would you like to discuss?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="focus-enhanced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-category">Category</Label>
                <Select
                  value={newPost.category}
                  onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== 'all')
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Content *</Label>
              <Textarea
                id="post-content"
                placeholder="Share your thoughts, experiences, or questions... Be respectful and supportive."
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="focus-enhanced"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-tags">Tags (comma-separated)</Label>
              <Input
                id="post-tags"
                placeholder="e.g., anxiety, study-tips, self-care"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                className="focus-enhanced"
              />
            </div>

            <div className="flex items-center space-x-2 p-3 bg-secondary/10 rounded-lg">
              <Switch
                id="anonymous"
                checked={newPost.isAnonymous}
                onCheckedChange={(checked) => setNewPost({ ...newPost, isAnonymous: checked })}
              />
              <Label htmlFor="anonymous" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Post anonymously (recommended for sensitive topics)</span>
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="bg-gradient-primary hover:shadow-glow btn-enhanced"
              >
                Post Discussion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedPosts.has(post.id);
          const isLiked = post.likedBy.includes(user?.id || 'anonymous-user');
          const isBookmarked = post.bookmarkedBy.includes(user?.id || 'anonymous-user');

          return (
            <Card
              key={post.id}
              id={`post-${post.id}`}
              className="enhanced-card group hover:shadow-aurora transition-all duration-500"
            >
              {post.isPinned && (
                <div className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-t-lg">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <Pin className="h-4 w-4" />
                    <span>Pinned Post</span>
                  </div>
                </div>
              )}

              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{post.author}</span>
                      {post.isVerifiedMentor && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-secondary text-white shadow-soft"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verified Mentor
                        </Badge>
                      )}
                      {post.isAnonymous && (
                        <Badge variant="outline" className="text-xs border-primary/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Anonymous
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(post.timestamp)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <CardTitle
                    className="text-lg leading-tight hover:text-primary cursor-pointer transition-colors group-hover:text-primary"
                    onClick={() => togglePostExpansion(post.id)}
                  >
                    {post.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="w-fit bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                    >
                      {post.category}
                    </Badge>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs hover:bg-primary/10 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {isExpanded
                    ? post.content
                    : post.content.length > 200
                      ? `${post.content.substring(0, 200)}...`
                      : post.content}
                  {post.content.length > 200 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => togglePostExpansion(post.id)}
                      className="p-0 ml-2 text-primary hover:text-primary/80"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Read more
                        </>
                      )}
                    </Button>
                  )}
                </CardDescription>

                <Separator />

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.replies.length} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className={`hover:shadow-soft transition-all duration-300 ${
                        isLiked ? 'text-primary bg-primary/10' : ''
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(post.id)}
                      className="hover:shadow-soft transition-all duration-300"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(post.id)}
                      className={`hover:shadow-soft transition-all duration-300 ${
                        isBookmarked ? 'text-secondary bg-secondary/10' : ''
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Saved' : 'Save'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReportDialogOpen(post.id)}
                      className="hover:shadow-soft transition-all duration-300 text-orange-600 hover:text-orange-700"
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>

                    {/* Moderation controls for admins/counselors */}
                    {user?.role === 'admin' || user?.role === 'counselor' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowModeration(!showModeration)}
                          className="hover:shadow-soft transition-all duration-300 text-red-600 hover:text-red-700"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Moderate
                        </Button>
                      </>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/forum/post/${post.id}`
                        );
                      }}
                      className="hover:shadow-soft transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* AI Analysis Indicators */}
                {post.supportiveScore && post.supportiveScore > 0.7 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Community recognizes this as a supportive post
                      </span>
                    </div>
                  </div>
                )}

                {/* Moderation Panel */}
                {showModeration && (user?.role === 'admin' || user?.role === 'counselor') && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
                    <h4 className="font-medium text-red-800 mb-2">Moderation Actions</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moderatePost(post.id, 'approve', 'Approved by moderator')}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moderatePost(post.id, 'hide', 'Hidden by moderator')}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Hide
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moderatePost(post.id, 'warn', 'User warned')}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Warn User
                      </Button>
                    </div>
                    {post.reportCount && post.reportCount > 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        This post has been reported {post.reportCount} time(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post.id && (
                  <div className="mt-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Reply className="h-4 w-4" />
                      <span>Replying to this discussion</span>
                    </div>

                    <Textarea
                      placeholder="Share your thoughts or advice..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={3}
                      className="focus-enhanced"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`reply-anonymous-${post.id}`}
                          checked={isReplyAnonymous}
                          onCheckedChange={setIsReplyAnonymous}
                        />
                        <Label htmlFor={`reply-anonymous-${post.id}`} className="text-sm">
                          Reply anonymously
                        </Label>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                            setIsReplyAnonymous(true);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(post.id)}
                          disabled={!replyContent.trim()}
                          className="bg-gradient-primary hover:shadow-glow btn-enhanced"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Replies Section */}
                {post.replies.length > 0 && isExpanded && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies.length} Replies</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setThreadedView(!threadedView)}
                        className="text-xs"
                      >
                        {threadedView ? (
                          <List className="h-3 w-3 mr-1" />
                        ) : (
                          <Grid className="h-3 w-3 mr-1" />
                        )}
                        {threadedView ? 'Linear View' : 'Threaded View'}
                      </Button>
                    </div>

                    {post.replies.map((reply) => {
                      const replyAnalysis = analyzeContent(reply.content);
                      return (
                        <div
                          key={reply.id}
                          className={`${
                            reply.parentId && threadedView ? 'ml-8' : 'ml-4'
                          } p-3 bg-background/50 rounded-lg border border-border/40 hover:shadow-sm transition-shadow group`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{reply.author}</span>
                              {reply.isAnonymous && (
                                <Badge variant="outline" className="text-xs">
                                  Anonymous
                                </Badge>
                              )}
                              {reply.isVerifiedMentor && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gradient-secondary text-white"
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {reply.supportiveScore && reply.supportiveScore > 0.8 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  <Heart className="h-3 w-3 mr-1" />
                                  Helpful
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">
                                {timeAgo(reply.timestamp)}
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setReportDialogOpen(reply.id)}
                                >
                                  <Flag className="h-3 w-3 text-orange-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    /* Reply to this specific reply */
                                  }}
                                >
                                  <Reply className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed mb-2">{reply.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </button>
                              <button
                                className="flex items-center space-x-1 hover:text-primary transition-colors"
                                onClick={() => setReplyingTo(reply.id)}
                              >
                                <Reply className="h-3 w-3" />
                                <span>Reply</span>
                              </button>
                            </div>
                            {/* AI Analysis Indicator */}
                            {replyAnalysis.supportive > 0.7 && (
                              <div className="flex items-center space-x-1 text-xs text-green-600">
                                <Heart className="h-3 w-3" />
                                <span>Supportive</span>
                              </div>
                            )}
                          </div>

                          {/* Moderation warning for reported replies */}
                          {reply.reportCount && reply.reportCount > 0 && (
                            <div className="mt-2 bg-orange-50 border border-orange-200 rounded p-2">
                              <p className="text-xs text-orange-700">
                                This reply is under review ({reply.reportCount} report(s))
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Empty State */}
      {filteredPosts.length === 0 && (
        <Card className="enhanced-card text-center py-12">
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-fit mx-auto">
                <MessageCircle className="h-12 w-12 text-primary mx-auto" />
              </div>
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-sm opacity-30 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-heading">No discussions found</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search terms or category filters, or be the first to start a discussion on this topic!'
                  : 'Be the first to start a meaningful conversation in our supportive community!'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setShowNewPostForm(true)}
                className="bg-gradient-primary hover:shadow-glow btn-enhanced"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start a Discussion
              </Button>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Community Guidelines */}
      <Card className="enhanced-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-heading">Community Guidelines</CardTitle>
              <div className="h-1 w-16 bg-gradient-primary rounded-full mx-auto mt-2"></div>
            </div>
          </div>
          <CardDescription className="text-base leading-relaxed">
            Our forum is a safe, supportive space for everyone. Together, we create a community
            where students can find help, hope, and healing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3 group">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-heading mb-2">Stay Safe & Secure</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Protect your privacy by not sharing personal information. Use anonymous posting
                  when discussing sensitive topics.
                </p>
              </div>
            </div>

            <div className="text-center space-y-3 group">
              <div className="p-4 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-heading mb-2">Be Supportive & Kind</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Offer encouragement, empathy, and hope. Share your experiences to help others feel
                  less alone in their journey.
                </p>
              </div>
            </div>

            <div className="text-center space-y-3 group">
              <div className="p-4 rounded-full bg-gradient-to-br from-accent/10 to-accent/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-heading mb-2">Respect & Include</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Treat everyone with dignity and respect. No judgment, discrimination, hate speech,
                  or harmful content allowed.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Need immediate help? Crisis resources are available 24/7</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Badge variant="outline" className="text-xs">
                Crisis Line: 988
              </Badge>
              <Badge variant="outline" className="text-xs">
                Crisis Text: HOME to 741741
              </Badge>
              <Badge variant="outline" className="text-xs">
                Campus Counseling Available
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forum;
