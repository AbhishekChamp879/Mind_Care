import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReadingModeButton from '@/components/ui/reading-mode-button';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';
import { useTheme } from '@/contexts/ThemeContext';
import {
  BookOpen,
  Play,
  Volume2,
  Download,
  Search,
  Clock,
  Users,
  Heart,
  Brain,
  Moon,
  Coffee,
  Zap,
  Filter,
  Phone,
  Globe,
  Star,
  Tag,
  ChevronDown,
  X,
  ArrowUpDown,
  Grid,
  List,
  Bookmark,
  Share2,
} from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';

// Enhanced language support
const languages = {
  english: { name: 'English', icon: '🇺🇸', code: 'en' },
  hindi: { name: 'हिंदी', icon: '🇮🇳', code: 'hi' },
  spanish: { name: 'Español', icon: '🇪🇸', code: 'es' },
  tamil: { name: 'தமிழ்', icon: '🇮🇳', code: 'ta' },
  bengali: { name: 'বাংলা', icon: '🇧🇩', code: 'bn' },
  urdu: { name: 'اردو', icon: '🇵🇰', code: 'ur' },
  gujarati: { name: 'ગુજરાતી', icon: '🇮🇳', code: 'gu' },
  marathi: { name: 'मराठी', icon: '🇮🇳', code: 'mr' },
  french: { name: 'Français', icon: '🇫🇷', code: 'fr' },
  german: { name: 'Deutsch', icon: '🇩🇪', code: 'de' },
  portuguese: { name: 'Português', icon: '🇵🇹', code: 'pt' },
  chinese: { name: '中文', icon: '🇨🇳', code: 'zh' },
  arabic: { name: 'العربية', icon: '🇸🇦', code: 'ar' },
};

// Enhanced categories with multi-language labels
const categories = {
  all: {
    en: 'All Resources',
    hi: 'सभी संसाधन',
    es: 'Todos los Recursos',
    ta: 'அனைத்து வளங்கள்',
    color: 'bg-blue-100 text-blue-800',
    icon: BookOpen,
  },
  stress: {
    en: 'Stress Management',
    hi: 'तनाव प्रबंधन',
    es: 'Manejo del Estrés',
    ta: 'மன அழுத்த மேலாண்மை',
    color: 'bg-red-100 text-red-800',
    icon: Heart,
  },
  mindfulness: {
    en: 'Mindfulness & Meditation',
    hi: 'ध्यान और सचेतता',
    es: 'Mindfulness y Meditación',
    ta: 'மனநிறைவு மற்றும் தியானம்',
    color: 'bg-purple-100 text-purple-800',
    icon: Brain,
  },
  sleep: {
    en: 'Sleep Health',
    hi: 'नींद की स्वास्थ्य',
    es: 'Salud del Sueño',
    ta: 'தூக்க ஆரோக்கியம்',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Moon,
  },
  anxiety: {
    en: 'Anxiety & Panic',
    hi: 'चिंता और घबराहट',
    es: 'Ansiedad y Pánico',
    ta: 'கவலை மற்றும் பீதி',
    color: 'bg-orange-100 text-orange-800',
    icon: Zap,
  },
  depression: {
    en: 'Depression Support',
    hi: 'अवसाद सहायता',
    es: 'Apoyo para la Depresión',
    ta: 'மன அழுத்தத்திற்கான ஆதரவு',
    color: 'bg-blue-200 text-black dark:text-white',
    icon: Heart,
  },
  study: {
    en: 'Study Skills',
    hi: 'अध्ययन कौशल',
    es: 'Habilidades de Estudio',
    ta: 'படிப்பு திறன்கள்',
    color: 'bg-green-100 text-green-800',
    icon: Coffee,
  },
  trauma: {
    en: 'Trauma Recovery',
    hi: 'आघात से उबरना',
    es: 'Recuperación del Trauma',
    ta: 'அதிர்ச்சியிலிருந்து மீட்சி',
    color: 'bg-pink-100 text-pink-800',
    icon: Heart,
  },
  relationships: {
    en: 'Relationships',
    hi: 'रिश्ते',
    es: 'Relaciones',
    ta: 'உறவுகள்',
    color: 'bg-teal-100 text-teal-800',
    icon: Users,
  },
  crisis: {
    en: 'Crisis Resources',
    hi: 'संकट संसाधन',
    es: 'Recursos de Crisis',
    ta: 'நெருக்கடி வளங்கள்',
    color: 'bg-red-100 text-red-800',
    icon: Phone,
  },
};

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'tool' | 'pdf';
  category: keyof typeof categories;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: keyof typeof languages;
  thumbnail?: string;
  views?: number;
  rating?: number;
  url?: string;
  downloadUrl?: string;
  author?: string;
  publishedDate?: string;
  tags?: string[];
  isBookmarked?: boolean;
  culturalContext?: string;
  accessibilityFeatures?: string[];
}

const mockResources: Resource[] = [
  // Stress Management Resources
  {
    id: '1',
    title: 'Deep Breathing for Exam Anxiety',
    description:
      'Learn the 4-7-8 breathing technique specifically designed for Indian students to calm pre-exam nerves and improve focus during competitive exams.',
    type: 'video',
    category: 'anxiety',
    duration: '8 min',
    difficulty: 'beginner',
    language: 'english',
    views: 15247,
    rating: 4.8,
    url: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
    author: 'Dr. Priya Sharma, Clinical Psychologist',
    publishedDate: '2024-08-15',
    tags: ['breathing', 'exam-stress', 'anxiety-relief'],
  },
  {
    id: '2',
    title: 'प्रगतिशील मांसपेशी विश्राम (Progressive Muscle Relaxation)',
    description:
      'हिंदी में शारीरिक तनाव मुक्त करने और गहरी विश्राम को बढ़ावा देने के लिए ऑडियो गाइड। भारतीय संस्कृति के अनुकूल तकनीकें।',
    type: 'audio',
    category: 'stress',
    duration: '15 min',
    difficulty: 'beginner',
    language: 'hindi',
    views: 8924,
    rating: 4.9,
    url: 'https://open.spotify.com/episode/4rOtJKE7VcBXq9b2X8sT6h',
    downloadUrl: '/audio/pmr-hindi.mp3',
    author: 'डॉ. अर्जुन पटेल',
    publishedDate: '2024-09-01',
    tags: ['तनाव-मुक्ति', 'विश्राम', 'मांसपेशी'],
  },
  {
    id: '3',
    title: 'Sleep Hygiene for Indian Students',
    description:
      'Evidence-based strategies to improve sleep quality considering Indian lifestyle, late-night study culture, and family dynamics. Includes tips for hostels and shared rooms.',
    type: 'article',
    category: 'sleep',
    duration: '7 min read',
    difficulty: 'beginner',
    language: 'english',
    views: 12134,
    rating: 4.7,
    url: 'https://www.sleepfoundation.org/how-sleep-works/sleep-hygiene-tips',
    downloadUrl: '/pdfs/sleep-hygiene-indian-students.pdf',
    author: 'Dr. Kavita Menon, Sleep Specialist',
    publishedDate: '2024-08-20',
    tags: ['sleep', 'student-life', 'hostel-life'],
  },
  {
    id: '4',
    title: 'Mindful Study Planner & Pomodoro Timer',
    description:
      'Interactive web tool designed for Indian academic calendar. Plan focused study sessions with built-in mindfulness breaks, exam countdown, and stress monitoring.',
    type: 'tool',
    category: 'study',
    difficulty: 'intermediate',
    language: 'english',
    views: 5672,
    rating: 4.6,
    url: 'https://pomofocus.io/',
    author: 'Mind Buddy Team',
    publishedDate: '2024-09-10',
    tags: ['productivity', 'study-planning', 'mindfulness'],
  },
  {
    id: '5',
    title: 'JEE/NEET Stress Management Guide',
    description:
      'Comprehensive PDF guide specifically for competitive exam aspirants. Covers managing parental pressure, peer comparison, and maintaining mental health during preparation.',
    type: 'pdf',
    category: 'anxiety',
    duration: '25 min read',
    difficulty: 'intermediate',
    language: 'english',
    views: 18765,
    rating: 4.9,
    url: 'https://www.apa.org/topics/stress/manage',
    downloadUrl: '/pdfs/competitive-exam-stress-management.pdf',
    author: 'Dr. Rajesh Kumar & Dr. Sneha Joshi',
    publishedDate: '2024-07-15',
    tags: ['competitive-exams', 'parental-pressure', 'academic-stress'],
  },
  {
    id: '6',
    title: 'Depression Awareness in Indian Context',
    description:
      'Understanding depression symptoms, cultural stigma, and when to seek help. Addresses misconceptions common in Indian families and provides practical coping strategies.',
    type: 'video',
    category: 'depression',
    duration: '18 min',
    difficulty: 'intermediate',
    language: 'english',
    views: 9876,
    rating: 4.8,
    url: 'https://www.youtube.com/watch?v=z-IR48Mb3W0',
    author: 'Dr. Priya Sharma',
    publishedDate: '2024-08-30',
    tags: ['depression', 'mental-health-awareness', 'cultural-context'],
  },
  {
    id: '7',
    title: 'Yoga Nidra for Deep Relaxation',
    description:
      'Traditional Indian relaxation technique combining mindfulness with yogic practices. Perfect for students dealing with academic pressure and sleep issues.',
    type: 'audio',
    category: 'mindfulness',
    duration: '30 min',
    difficulty: 'beginner',
    language: 'english',
    views: 7432,
    rating: 4.7,
    url: 'https://www.youtube.com/watch?v=M0u9GST_j3s',
    downloadUrl: '/audio/yoga-nidra-students.mp3',
    author: 'Yogacharya Ramesh Sharma',
    publishedDate: '2024-08-25',
    tags: ['yoga', 'relaxation', 'traditional-healing'],
  },
  {
    id: '8',
    title: 'তনাব মোকাবেলার কৌশল (Stress Management Techniques)',
    description:
      'Bengali language guide for stress management incorporating Bengali cultural values and family dynamics. Practical techniques for students and working professionals.',
    type: 'article',
    category: 'stress',
    duration: '10 min read',
    difficulty: 'beginner',
    language: 'bengali',
    views: 3456,
    rating: 4.6,
    url: 'https://example.com/bengali-stress-guide',
    downloadUrl: '/pdfs/stress-management-bengali.pdf',
    author: 'ডঃ সুমিত্রা বসু',
    publishedDate: '2024-09-05',
    tags: ['তনাব', 'মানসিক-স্বাস্থ্য', 'বাঙালি-সংস্কৃতি'],
  },
  {
    id: '9',
    title: 'Digital Detox for Mental Health',
    description:
      'How to manage social media addiction, reduce screen time, and create healthy boundaries with technology. Essential for Gen Z mental health.',
    type: 'tool',
    category: 'anxiety',
    difficulty: 'intermediate',
    language: 'english',
    views: 6789,
    rating: 4.5,
    url: 'https://freedom.to/',
    author: 'Dr. Kavita Menon',
    publishedDate: '2024-09-12',
    tags: ['digital-wellness', 'social-media', 'technology-balance'],
  },
  {
    id: '10',
    title: 'Relationship Counseling for Indian Couples',
    description:
      'Navigate relationship challenges in the context of Indian family structures, arranged marriages, and cultural expectations. Communication techniques and conflict resolution.',
    type: 'video',
    category: 'relationships',
    duration: '22 min',
    difficulty: 'advanced',
    language: 'english',
    views: 4321,
    rating: 4.7,
    url: 'https://www.youtube.com/watch?v=example',
    author: 'Dr. Rajesh Kumar, Marriage Therapist',
    publishedDate: '2024-08-18',
    tags: ['relationships', 'marriage', 'family-dynamics'],
  },
  {
    id: '11',
    title: 'PTSD Recovery Resources',
    description:
      'Trauma-informed healing approaches combining Western therapy with Indian spiritual practices. Safe space information and emergency resources.',
    type: 'article',
    category: 'trauma',
    duration: '15 min read',
    difficulty: 'advanced',
    language: 'english',
    views: 2134,
    rating: 4.9,
    url: 'https://www.ptsd.va.gov/understand/what/index.asp',
    downloadUrl: '/pdfs/trauma-recovery-guide.pdf',
    author: 'Dr. Kavita Menon, Trauma Specialist',
    publishedDate: '2024-07-30',
    tags: ['trauma', 'ptsd', 'recovery', 'healing'],
  },
  {
    id: '12',
    title: 'தமிழ் மனநல வழிகாட்டி (Tamil Mental Health Guide)',
    description:
      'Tamil language comprehensive mental health guide covering anxiety, depression, and stress management with cultural sensitivity for Tamil-speaking communities.',
    type: 'pdf',
    category: 'anxiety',
    duration: '20 min read',
    difficulty: 'beginner',
    language: 'tamil',
    views: 1876,
    rating: 4.8,
    url: 'https://example.com/tamil-mental-health',
    downloadUrl: '/pdfs/tamil-mental-health-guide.pdf',
    author: 'டாக்டர் கமலா சுந்தரம்',
    publishedDate: '2024-08-12',
    tags: ['மனநலம்', 'தமிழ்', 'கவலை'],
  },
  {
    id: '13',
    title: 'Mindfulness Meditation for Beginners',
    description:
      'Start your mindfulness journey with simple 5-minute daily practices. Includes guided meditations in English and Hindi for Indian practitioners.',
    type: 'audio',
    category: 'mindfulness',
    duration: '45 min',
    difficulty: 'beginner',
    language: 'english',
    views: 11234,
    rating: 4.6,
    url: 'https://www.headspace.com/meditation/mindfulness',
    downloadUrl: '/audio/mindfulness-beginners.mp3',
    author: 'Mind Buddy Meditation Team',
    publishedDate: '2024-09-01',
    tags: ['meditation', 'mindfulness', 'beginners'],
  },
  {
    id: '14',
    title: 'Academic Burnout Prevention Toolkit',
    description:
      'Early warning signs, prevention strategies, and recovery techniques for students experiencing academic burnout. Includes self-assessment tools and action plans.',
    type: 'tool',
    category: 'stress',
    difficulty: 'intermediate',
    language: 'english',
    views: 8765,
    rating: 4.7,
    url: 'https://burnout-assessment.vercel.app/',
    author: 'Dr. Sneha Joshi',
    publishedDate: '2024-08-28',
    tags: ['burnout', 'academic-stress', 'prevention'],
  },
  {
    id: '15',
    title: 'Crisis Support & Emergency Resources',
    description:
      'Comprehensive list of mental health crisis support resources in India. Includes helpline numbers, online chat services, and immediate safety planning.',
    type: 'article',
    category: 'depression',
    duration: '5 min read',
    difficulty: 'beginner',
    language: 'english',
    views: 15432,
    rating: 5.0,
    url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders',
    downloadUrl: '/pdfs/crisis-support-resources-india.pdf',
    author: 'Mind Buddy Crisis Team',
    publishedDate: '2024-09-15',
    tags: ['crisis', 'emergency', 'support', 'helpline'],
  },
];

const Resources = () => {
  const { settings } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof languages | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'all' | 'beginner' | 'intermediate' | 'advanced'
  >('all');
  const [selectedType, setSelectedType] = useState<
    'all' | 'article' | 'video' | 'audio' | 'tool' | 'pdf'
  >('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'rating' | 'recent'>(
    'relevance'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [currentLanguageContext, setCurrentLanguageContext] =
    useState<keyof typeof languages>('english');

  // Reading mode classes
  const readingModeClasses = settings.readingMode?.enabled
    ? [
        'reading-mode',
        settings.readingMode.backgroundColor && `${settings.readingMode.backgroundColor}-bg`,
        settings.readingMode.contrast === 'high' && 'reading-high-contrast',
        settings.readingMode.warmColors && 'reading-warm-colors',
        settings.readingMode.reducedMotion && 'reading-reduced-motion',
        settings.readingMode.fontFamily && `font-${settings.readingMode.fontFamily}`,
        settings.readingMode.fontSize && `text-${settings.readingMode.fontSize}`,
        settings.readingMode.lineHeight && `leading-${settings.readingMode.lineHeight}`,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  // Enhanced filtering and search
  const filteredResources = useMemo(() => {
    const filtered = mockResources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
      const matchesDifficulty =
        selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      const matchesBookmark = !bookmarkedOnly || resource.isBookmarked;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLanguage &&
        matchesDifficulty &&
        matchesType &&
        matchesBookmark
      );
    });

    // Sort results
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.publishedDate || '').getTime() - new Date(a.publishedDate || '').getTime()
        );
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    selectedLanguage,
    selectedDifficulty,
    selectedType,
    sortBy,
    bookmarkedOnly,
  ]);

  const toggleBookmark = (resourceId: string) => {
    // In a real app, this would update the backend
    const resourceIndex = mockResources.findIndex((r) => r.id === resourceId);
    if (resourceIndex !== -1) {
      mockResources[resourceIndex].isBookmarked = !mockResources[resourceIndex].isBookmarked;
    }
  };

  const shareResource = (resource: Resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url || window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${resource.title}: ${resource.url || window.location.href}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'audio':
        return Volume2;
      case 'article':
        return BookOpen;
      case 'tool':
        return Zap;
      case 'pdf':
        return Download;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-severity-high text-white';
      case 'audio':
        return 'bg-severity-medium text-white';
      case 'article':
        return 'bg-primary text-primary-foreground';
      case 'tool':
        return 'bg-secondary text-secondary-foreground';
      case 'pdf':
        return 'bg-severity-low text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-severity-low text-white';
      case 'intermediate':
        return 'bg-severity-medium text-white';
      case 'advanced':
        return 'bg-severity-high text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PageTransition>
      <div className={`container mx-auto px-4 py-8 space-y-8 ${readingModeClasses} overflow-hidden`}>
        {/* Header */}
        <ScrollFadeIn yOffset={32}>
          <div className="text-center space-y-4 relative">
            <div className="absolute top-0 right-0">
              <ReadingModeButton />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Psychoeducational Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto reading-content">
              Evidence-based resources to support your mental health journey. All content is reviewed by
              licensed professionals.
            </p>
          </div>
        </ScrollFadeIn>

      {/* Search & Filters */}
      <ScrollFadeIn yOffset={24} delay={0.1}>
        <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Find Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

              {/* Filter Tabs */}
              <Tabs defaultValue="category" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="category">Category</TabsTrigger>
                  <TabsTrigger value="type">Type</TabsTrigger>
                  <TabsTrigger value="language">Language</TabsTrigger>
                </TabsList>

                <TabsContent value="category" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categories).map(([key, category]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(key as keyof typeof categories)}
                        className={`flex items-center space-x-1 ${category.color.replace('bg-', 'hover:bg-')}`}
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category[currentLanguageContext] || category.en}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="type" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'article', 'video', 'audio', 'tool', 'pdf'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className="capitalize"
                      >
                        {type === 'all' ? 'All Types' : type === 'pdf' ? 'PDF Documents' : type}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

            <TabsContent value="language" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {(['all', ...Object.keys(languages)] as const).map((language) => (
                  <Button
                    key={language}
                    variant={selectedLanguage === language ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLanguage(language as typeof selectedLanguage)}
                    className="flex items-center space-x-1"
                  >
                    {language === 'all' ? (
                      <span>All Languages</span>
                    ) : (
                      <>
                        <span>{languages[language as keyof typeof languages]?.icon}</span>
                        <span>{languages[language as keyof typeof languages]?.name}</span>
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredResources.length} of {mockResources.length} resources
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Generate a comprehensive PDF with all resources
            const resourceList = filteredResources
              .map(
                (r) =>
                  `${r.title}\n${r.description}\nType: ${r.type} | Duration: ${r.duration} | Language: ${r.language}\nAuthor: ${r.author || 'N/A'}\nURL: ${r.url || 'N/A'}\n---\n`
              )
              .join('\n');

            const blob = new Blob([`Mind Buddy Resources Collection\n\n${resourceList}`], {
              type: 'text/plain',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'mind-buddy-resources.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Resources
        </Button>
      </div>
      </ScrollFadeIn>

        {/* Results Summary */}
        <ScrollFadeIn yOffset={24} delay={0.1}>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredResources.length} of {mockResources.length} resources
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Generate a comprehensive PDF with all resources
                const resourceList = filteredResources
                  .map(
                    (r) =>
                      `${r.title}\n${r.description}\nType: ${r.type} | Duration: ${r.duration} | Language: ${r.language}\nAuthor: ${r.author || 'N/A'}\nURL: ${r.url || 'N/A'}\n---\n`
                  )
                  .join('\n');

                const blob = new Blob([`Mind Buddy Resources Collection\n\n${resourceList}`], {
                  type: 'text/plain',
                });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'mind-buddy-resources.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Resources
            </Button>
          </div>
        </ScrollFadeIn>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, idx) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <ScrollFadeIn key={resource.id} delay={0.05 * idx}>
                <Card
                  key={resource.id}
                  className="group hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-md ${getTypeColor(resource.type)}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${categories[resource.category]?.color} flex items-center space-x-1`}
                        >
                          {(() => {
                            const CategoryIcon = categories[resource.category]?.icon || BookOpen;
                            return <CategoryIcon className="h-3 w-3" />;
                          })()}
                          <span>
                            {categories[resource.category]?.[currentLanguageContext] ||
                              categories[resource.category]?.en}
                          </span>
                        </Badge>
                        <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <span>{languages[resource.language]?.icon}</span>
                          <span className="text-xs">{languages[resource.language]?.name}</span>
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toggleBookmark(resource.id)}
                          title={resource.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          <Bookmark
                            className={`h-3 w-3 ${resource.isBookmarked ? 'fill-current text-primary' : 'text-muted-foreground'}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => shareResource(resource)}
                          title="Share resource"
                        >
                          <Share2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <h3 className="font-semibold text-lg leading-tight">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm">{resource.description}</p>

                    {resource.author && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">By:</span> {resource.author}
                      </div>
                    )}

                    {resource.tags && (
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {resource.rating && (
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Heart
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(resource.rating!)
                                  ? 'text-primary fill-current'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{resource.rating}/5</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => {
                          if (resource.url) {
                            if (resource.type === 'tool') {
                              // Open tools in the same tab
                              window.location.href = resource.url;
                            } else {
                              // Open articles, videos, etc. in new tab
                              window.open(resource.url, '_blank', 'noopener,noreferrer');
                            }
                          }
                        }}
                      >
                        {resource.type === 'article'
                          ? currentLanguageContext === 'hindi'
                            ? 'लेख पढ़ें'
                            : currentLanguageContext === 'spanish'
                              ? 'Leer Artículo'
                              : 'Read Article'
                          : resource.type === 'video'
                            ? currentLanguageContext === 'hindi'
                              ? 'वीडियो देखें'
                              : currentLanguageContext === 'spanish'
                                ? 'Ver Video'
                                : 'Watch Video'
                            : resource.type === 'audio'
                              ? currentLanguageContext === 'hindi'
                                ? 'सुनें'
                                : currentLanguageContext === 'spanish'
                                  ? 'Escuchar'
                                  : 'Listen Now'
                              : resource.type === 'pdf'
                                ? currentLanguageContext === 'hindi'
                                  ? 'PDF देखें'
                                  : currentLanguageContext === 'spanish'
                                    ? 'Ver PDF'
                                    : 'View PDF'
                                : currentLanguageContext === 'hindi'
                                  ? 'उपकरण का उपयोग करें'
                                  : currentLanguageContext === 'spanish'
                                    ? 'Usar Herramienta'
                                    : 'Use Tool'}
                      </Button>
                      {resource.downloadUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Create a temporary link to trigger download
                            const link = document.createElement('a');
                            link.href = resource.downloadUrl!;
                            link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '-')}.${resource.type === 'pdf' ? 'pdf' : 'mp3'}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          title={
                            currentLanguageContext === 'hindi'
                              ? 'डाउनलोड'
                              : currentLanguageContext === 'spanish'
                                ? 'Descargar'
                                : 'Download'
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                  {/* Cultural Context Indicator */}
                  {resource.culturalContext && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
                    >
                      {currentLanguageContext === 'hindi'
                        ? 'स्थानीय संदर्भ'
                        : currentLanguageContext === 'spanish'
                          ? 'Contexto Local'
                          : 'Local Context'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollFadeIn>
            );
          })}
        </div>

        {/* No resources found */}
        {filteredResources.length === 0 && (
          <ScrollFadeIn delay={0.2}>
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          </ScrollFadeIn>
        )}

        {/* Help Section */}
        <ScrollFadeIn yOffset={32} delay={0.1}>
          <Card className="bg-gradient-calm border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Need Immediate Support?</span>
              </CardTitle>
              <CardDescription>
                If you're experiencing a mental health crisis, don't wait - reach out for immediate
                help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="safety"
                  onClick={() => window.open('tel:+91-9152987821', '_self')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Phone className="h-5 w-5 mb-2" />
                  <span className="font-semibold">AASRA</span>
                  <span className="text-xs">24x7 Helpline</span>
                  <span className="text-xs">+91-91529-87821</span>
                </Button>
                <Button
                  variant="trust"
                  onClick={() => window.open('tel:+91-80-25497777', '_self')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Phone className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Vandrevala</span>
                  <span className="text-xs">Foundation</span>
                  <span className="text-xs">+91-80-2549-7777</span>
                </Button>
                <Button
                  variant="gentle"
                  onClick={() => window.open('tel:+91-22-25563291', '_self')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Phone className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Connecting</span>
                  <span className="text-xs">Trust</span>
                  <span className="text-xs">+91-22-2556-3291</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('/booking', '_self')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Users className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Book Session</span>
                  <span className="text-xs">Professional Help</span>
                  <span className="text-xs">Available 24/7</span>
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>
                  In case of emergency, please call <strong>102</strong> (National Emergency Helpline)
                  or visit your nearest hospital.
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>
      </div>
    </PageTransition>
  );
};

export default Resources;