import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import notificationService from '@/services/notificationService';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Phone,
  Heart,
  User,
  Mail,
  CheckCircle,
  AlertTriangle,
  PhoneCall,
  Star,
  Filter,
  Search,
  Award,
  MessageCircle,
  FileText,
  Bell,
  Users,
  Eye,
  Calendar as CalIcon,
  Loader,
  RefreshCw,
  Zap,
  EyeOff,
  X,
  Info,
  Globe,
  Shield,
  Lock,
  UserX,
  Shuffle,
  Key,
  Database,
  AlertCircle,
} from 'lucide-react';
import { getScheduledDate, getRelativeDate } from '../utils/dateUtils';

// Helper function to get a Date object for future appointments
const getNextAvailableSlot = (daysFromNow: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
};
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';

interface Review {
  id: string;
  clientInitials: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  avatar: string;
  rating: number;
  reviewCount: number;
  experience: string;
  languages: string[];
  availableSlots: { [key: string]: string[] };
  bio: string;
  education: string[];
  certifications: string[];
  approaches: string[];
  nextAvailable: Date;
  responseTime: string;
  reviews: Review[];
  isOnline: boolean;
  timezone: string;
}

const mockCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Academic Stress', 'CBT', 'PTSD'],
    avatar: '/api/placeholder/150/150',
    rating: 4.9,
    reviewCount: 127,
    experience: '8 years',
    languages: ['Hindi', 'English', 'Punjabi'],
    availableSlots: {
      '2025-09-22': ['09:00', '11:00', '14:00', '16:00'],
      '2025-09-23': ['10:00', '13:00', '15:00'],
      '2025-09-24': ['09:00', '11:00', '14:00', '16:00', '17:00'],
      '2025-09-25': ['08:00', '10:00', '13:00', '15:00'],
    },
    bio: 'Dr. Sharma specializes in helping students navigate academic stress and develop healthy coping strategies. She uses evidence-based approaches including CBT and mindfulness techniques rooted in both Western and Eastern practices.',
    education: ['PhD in Clinical Psychology - AIIMS', 'MS in Counseling Psychology - JNU'],
    certifications: [
      'Licensed Clinical Psychologist (India)',
      'Certified CBT Therapist',
      'Mindfulness-Based Stress Reduction Practitioner',
    ],
    approaches: [
      'Cognitive Behavioral Therapy',
      'Mindfulness-Based Therapy',
      'Solution-Focused Therapy',
      'Cultural Integration Therapy',
    ],
    nextAvailable: getNextAvailableSlot(1, 9),
    responseTime: '< 2 hours',
    isOnline: true,
    timezone: 'IST',
    reviews: [
      {
        id: '1',
        clientInitials: 'A.K.',
        rating: 5,
        comment:
          'डॉ. शर्मा ने मेरी चिंता के साथ बहुत मदद की। उनका दृष्टिकोण दयालु और व्यावहारिक है।',
        date: '2025-09-15',
        verified: true,
      },
      {
        id: '2',
        clientInitials: 'R.M.',
        rating: 5,
        comment:
          'Excellent therapist. Very understanding of Indian family dynamics and cultural context.',
        date: '2025-09-10',
        verified: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Dr. Arjun Patel',
    title: 'Licensed Therapist & ADHD Specialist',
    specialties: ['ADHD', 'Study Skills', 'Social Anxiety', 'Mindfulness', 'Executive Function'],
    avatar: '/api/placeholder/150/150',
    rating: 4.8,
    reviewCount: 89,
    experience: '12 years',
    languages: ['English', 'Hindi', 'Gujarati'],
    availableSlots: {
      '2025-09-22': ['10:00', '13:00', '15:00', '17:00'],
      '2025-09-23': ['09:00', '11:00', '14:00'],
      '2025-09-24': ['10:00', '13:00', '15:00', '17:00'],
      '2025-09-25': ['09:00', '12:00', '15:00'],
    },
    bio: 'Dr. Patel is an expert in ADHD support and helping students develop effective study strategies and social confidence. He combines traditional therapy with innovative coaching techniques, incorporating mindfulness practices from Indian traditions.',
    education: [
      'PhD in Counseling Psychology - NIMHANS',
      'MA in Educational Psychology - Tata Institute',
    ],
    certifications: [
      'Licensed Professional Counselor',
      'ADHD Clinical Services Provider',
      'Certified Executive Function Coach',
    ],
    approaches: [
      'Cognitive Behavioral Therapy',
      'Executive Function Coaching',
      'Mindfulness Training',
      'Social Skills Training',
    ],
    nextAvailable: getNextAvailableSlot(2, 10),
    responseTime: '< 4 hours',
    isOnline: true,
    timezone: 'IST',
    reviews: [
      {
        id: '3',
        clientInitials: 'S.G.',
        rating: 5,
        comment:
          'Dr. Patel understood my ADHD challenges and provided practical tools that really work in Indian academic environment.',
        date: '2025-09-12',
        verified: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Dr. Kavita Menon',
    title: 'Counseling Psychologist & Trauma Specialist',
    specialties: ['Trauma', 'PTSD', 'Crisis Intervention', 'DBT', 'Grief Counseling'],
    avatar: '/api/placeholder/150/150',
    rating: 4.9,
    reviewCount: 156,
    experience: '10 years',
    languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
    availableSlots: {
      '2025-09-22': ['08:00', '12:00', '15:30', '18:00'],
      '2025-09-23': ['09:00', '13:00', '16:00'],
      '2025-09-24': ['08:00', '11:00', '14:00', '17:00'],
      '2025-09-25': ['09:00', '13:00', '16:00', '18:00'],
    },
    bio: 'Dr. Menon specializes in trauma-informed care and crisis intervention with deep understanding of Indian cultural contexts. She creates a safe, supportive environment for healing and recovery using evidence-based approaches.',
    education: [
      'PhD in Clinical Psychology - AIIMS',
      'MA in Trauma Counseling - Christ University',
    ],
    certifications: [
      'Licensed Clinical Psychologist',
      'Certified EMDR Therapist',
      'DBT Intensive Training',
    ],
    approaches: [
      'Trauma-Informed Therapy',
      'EMDR',
      'Dialectical Behavior Therapy',
      'Somatic Therapy',
    ],
    nextAvailable: getNextAvailableSlot(1, 8),
    responseTime: '< 1 hour',
    isOnline: true,
    timezone: 'IST',
    reviews: [
      {
        id: '4',
        clientInitials: 'M.N.',
        rating: 5,
        comment:
          'Dr. Menon helped me through a very difficult time with incredible compassion and cultural understanding.',
        date: '2025-09-08',
        verified: true,
      },
      {
        id: '5',
        clientInitials: 'L.S.',
        rating: 5,
        comment:
          'Professional, caring, and highly skilled. She understands Indian family dynamics perfectly.',
        date: '2025-09-05',
        verified: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Dr. Rajesh Kumar',
    title: 'Licensed Marriage & Family Therapist',
    specialties: ['Couples Therapy', 'Family Dynamics', 'Communication', 'Relationship Issues'],
    avatar: '/api/placeholder/150/150',
    rating: 4.7,
    reviewCount: 73,
    experience: '15 years',
    languages: ['Hindi', 'English', 'Bengali'],
    availableSlots: {
      '2025-09-22': ['11:00', '14:00', '16:00'],
      '2025-09-23': ['10:00', '13:00', '17:00'],
      '2025-09-24': ['09:00', '12:00', '15:00'],
      '2025-09-25': ['11:00', '14:00', '16:00'],
    },
    bio: 'Dr. Kumar specializes in couples and family therapy with deep understanding of Indian joint family systems, helping clients build stronger relationships and improve communication patterns within cultural contexts.',
    education: ['PhD in Marriage & Family Therapy - TISS', 'MA in Clinical Psychology - DU'],
    certifications: [
      'Licensed Marriage & Family Therapist',
      'Certified Family Systems Therapist',
      'EFT Certified',
    ],
    approaches: [
      'Family Systems Therapy',
      'Emotionally Focused Therapy',
      'Solution-Focused Therapy',
      'Cultural Integration Therapy',
    ],
    nextAvailable: getNextAvailableSlot(3, 11),
    responseTime: '< 6 hours',
    isOnline: true,
    timezone: 'IST',
    reviews: [
      {
        id: '6',
        clientInitials: 'P.V.',
        rating: 5,
        comment:
          'Dr. Kumar helped us navigate complex family relationships with great cultural sensitivity.',
        date: '2025-09-01',
        verified: true,
      },
    ],
  },
  {
    id: '5',
    name: 'Dr. Sneha Joshi',
    title: 'Child & Adolescent Psychologist',
    specialties: [
      'Teen Counseling',
      'Academic Pressure',
      'Self-Esteem',
      'Anxiety',
      'Career Guidance',
    ],
    avatar: '/api/placeholder/150/150',
    rating: 4.8,
    reviewCount: 94,
    experience: '9 years',
    languages: ['Hindi', 'English', 'Marathi'],
    availableSlots: {
      '2025-09-22': ['09:30', '12:00', '16:30'],
      '2025-09-23': ['10:30', '14:00', '17:00'],
      '2025-09-24': ['09:00', '13:00', '16:00'],
      '2025-09-25': ['11:00', '15:00', '17:30'],
    },
    bio: 'Dr. Joshi specializes in adolescent mental health and academic stress management. She understands the unique pressures faced by Indian students and provides culturally relevant support for teens and young adults.',
    education: [
      'PhD in Child Psychology - NIMHANS',
      'MA in Developmental Psychology - Mumbai University',
    ],
    certifications: [
      'Licensed Child Psychologist',
      'Adolescent Therapy Specialist',
      'Career Counseling Certification',
    ],
    approaches: [
      'Cognitive Behavioral Therapy',
      'Play Therapy',
      'Narrative Therapy',
      'Strength-Based Counseling',
    ],
    nextAvailable: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(9, 30, 0, 0);
      return date;
    })(),
    responseTime: '< 3 hours',
    isOnline: true,
    timezone: 'IST',
    reviews: [
      {
        id: '7',
        clientInitials: 'A.D.',
        rating: 5,
        comment:
          'Dr. Joshi really understands the pressure of competitive exams and helped me cope better.',
        date: '2025-09-14',
        verified: true,
      },
      {
        id: '8',
        clientInitials: 'V.P.',
        rating: 4,
        comment: 'Great with teenagers. My daughter felt comfortable talking to her immediately.',
        date: '2025-09-11',
        verified: true,
      },
    ],
  },
];

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'availability'>('rating');
  const [showReviews, setShowReviews] = useState<string>('');
  const [sessionGoal, setSessionGoal] = useState<string>('');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    previousTherapy: '',
    notes: '',
    emergencyContact: '',
    dateOfBirth: '',
    preferredContactMethod: 'email',
  });
  const [step, setStep] = useState<'counselor' | 'datetime' | 'details' | 'confirmation'>(
    'counselor'
  );

  // Anonymous booking state management
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [anonymousId, setAnonymousId] = useState<string>('');
  const [privacyLevel, setPrivacyLevel] = useState<'basic' | 'enhanced' | 'maximum'>('basic');
  const [useEncryption, setUseEncryption] = useState<boolean>(false);
  const [dataRetention, setDataRetention] = useState<'session-only' | '30-days' | '90-days'>(
    '30-days'
  );
  const [anonymousForm, setAnonymousForm] = useState({
    alias: '',
    ageRange: '',
    concerns: '',
    previousExperience: '',
    communicationStyle: '',
    sessionNotes: '',
    emergencyCode: '',
    preferredAnonymity: 'partial',
  });

  // Real-time state management
  const [liveAvailability, setLiveAvailability] = useState<{ [key: string]: string[] }>({});
  const [counselorStatus, setCounselorStatus] = useState<{
    [key: string]: 'online' | 'busy' | 'offline';
  }>({});
  const [bookingProgress, setBookingProgress] = useState(0);
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [slotWatchers, setSlotWatchers] = useState<{ [key: string]: number }>({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time availability updater
  useEffect(() => {
    const updateAvailability = () => {
      setIsLiveUpdate(true);

      // Simulate real-time slot updates
      const newAvailability: { [key: string]: string[] } = {};
      const newStatus: { [key: string]: 'online' | 'busy' | 'offline' } = {};
      const newWatchers: { [key: string]: number } = {};

      mockCounselors.forEach((counselor) => {
        // Random status updates
        const statuses: ('online' | 'busy' | 'offline')[] = ['online', 'busy', 'offline'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        newStatus[counselor.id] = counselor.isOnline
          ? Math.random() > 0.3
            ? 'online'
            : 'busy'
          : 'offline';

        // Update available slots based on current time
        const today = format(new Date(), 'yyyy-MM-dd');
        const currentSlots = counselor.availableSlots[today] || [];

        // Simulate some slots being booked in real-time
        const updatedSlots = currentSlots.filter(() => Math.random() > 0.1); // 10% chance slot gets booked
        newAvailability[counselor.id] = updatedSlots;

        // Simulate people watching slots
        newWatchers[counselor.id] = Math.floor(Math.random() * 5) + 1;
      });

      setLiveAvailability(newAvailability);
      setCounselorStatus(newStatus);
      setSlotWatchers(newWatchers);
      setLastUpdate(new Date());

      setTimeout(() => setIsLiveUpdate(false), 500);
    };

    if (autoRefresh) {
      const interval = setInterval(updateAvailability, 15000); // Update every 15 seconds
      updateAvailability(); // Initial update

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Generate anonymous ID when switching to anonymous mode
  useEffect(() => {
    if (isAnonymous && !anonymousId) {
      const generateAnonymousId = () => {
        const prefixes = ['ANON', 'PRIV', 'CONF', 'SAFE', 'PEER'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomNum = Math.floor(Math.random() * 99999)
          .toString()
          .padStart(5, '0');
        return `${prefix}-${randomNum}`;
      };
      setAnonymousId(generateAnonymousId());

      // Generate random alias suggestions
      const aliasOptions = ['Student', 'Learner', 'Friend', 'Peer', 'Seeker'];
      const randomAlias = aliasOptions[Math.floor(Math.random() * aliasOptions.length)];
      setAnonymousForm((prev) => ({
        ...prev,
        alias: prev.alias || `${randomAlias}${Math.floor(Math.random() * 999)}`,
      }));
    }
  }, [isAnonymous, anonymousId]);

  // Update booking progress
  useEffect(() => {
    let progress = 0;
    if (selectedCounselor) progress += 25;
    if (selectedDate && selectedTime) progress += 25;
    if (bookingForm.name && bookingForm.email && bookingForm.reason) progress += 30;
    if (step === 'confirmation') progress = 100;

    setBookingProgress(progress);
  }, [selectedCounselor, selectedDate, selectedTime, bookingForm, step]);

  const selectedCounselorData = mockCounselors.find((c) => c.id === selectedCounselor);

  // Get available time slots for selected date with real-time updates
  const getAvailableSlots = (counselor: Counselor, date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const liveSlots = liveAvailability[counselor.id];

    if (liveSlots !== undefined) {
      return liveSlots; // Use real-time data if available
    }

    return counselor.availableSlots[dateKey] || [];
  };

  // Get counselor's live status
  const getCounselorStatus = (counselorId: string) => {
    return counselorStatus[counselorId] || 'offline';
  };

  // Manual refresh function
  const refreshAvailability = () => {
    setIsLiveUpdate(true);
    setLastUpdate(new Date());
    // The useEffect will handle the actual refresh
  };

  // Filter and sort counselors
  const filteredCounselors = mockCounselors
    .filter((counselor) => {
      const matchesSearch =
        counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counselor.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSpecialty =
        filterSpecialty === 'all' || counselor.specialties.includes(filterSpecialty);

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'availability':
          return a.nextAvailable.getTime() - b.nextAvailable.getTime();
        default:
          return 0;
      }
    });

  // Get all unique specialties for filter
  const allSpecialties = Array.from(new Set(mockCounselors.flatMap((c) => c.specialties))).sort();

  const handleBooking = async () => {
    // Validate required fields based on booking type
    if (isAnonymous) {
      if (
        !selectedCounselor ||
        !selectedTime ||
        !selectedDate ||
        !anonymousForm.alias ||
        !anonymousForm.ageRange ||
        !anonymousForm.concerns
      ) {
        alert('Please complete all required fields for anonymous booking.');
        return;
      }
    } else {
      if (
        !selectedCounselor ||
        !selectedTime ||
        !selectedDate ||
        !bookingForm.name ||
        !bookingForm.email ||
        !bookingForm.phone ||
        !bookingForm.reason
      ) {
        alert('Please fill in all required fields and select a counselor and time slot.');
        return;
      }
    }

    try {
      // Show instant loading state
      setBookingProgress(80);

      const bookingData = isAnonymous
        ? {
            anonymousId,
            counselor: selectedCounselorData?.name,
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            time: selectedTime,
            sessionType,
            anonymousClient: anonymousForm,
            privacySettings: {
              level: privacyLevel,
              encryption: useEncryption,
              dataRetention: dataRetention,
            },
          }
        : {
            counselor: selectedCounselorData?.name,
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            time: selectedTime,
            sessionType,
            client: bookingForm,
          };

      console.log(`Processing ${isAnonymous ? 'anonymous' : 'standard'} booking...`, bookingData);

      // Simulate real-time slot verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if slot is still available (simulate real-time conflict)
      const currentSlots = getAvailableSlots(selectedCounselorData!, selectedDate);
      if (!currentSlots.includes(selectedTime)) {
        alert('Sorry, this slot was just booked by another user. Please select a different time.');
        setSelectedTime('');
        return;
      }

      // Enhanced privacy processing for anonymous bookings
      if (isAnonymous) {
        console.log('Applying privacy protections...');
        // Simulate encryption of sensitive data
        if (useEncryption) {
          console.log('Data encrypted with end-to-end encryption');
        }

        // Simulate privacy-level processing
        switch (privacyLevel) {
          case 'maximum':
            console.log('Maximum privacy: No logs, no retention, encrypted communication');
            break;
          case 'enhanced':
            console.log('Enhanced privacy: Minimal logs, short retention, secure communication');
            break;
          default:
            console.log('Basic privacy: Standard protections applied');
        }
      }

      // Simulate booking processing
      setBookingProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update live availability (remove booked slot)
      setLiveAvailability((prev) => ({
        ...prev,
        [selectedCounselor]: currentSlots.filter((slot) => slot !== selectedTime),
      }));

      // Success - navigate to confirmation with instant feedback
      setBookingProgress(100);

      // Schedule session reminder notification
      if (selectedCounselorData && selectedDate && selectedTime) {
        const sessionDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        sessionDateTime.setHours(hours, minutes, 0, 0);

        const sessionId = `session-${Date.now()}`;
        notificationService.scheduleSessionReminder(
          sessionId,
          sessionDateTime,
          selectedCounselorData.name
        );
      }

      setStep('confirmation');
    } catch (error) {
      console.error(`${isAnonymous ? 'Anonymous' : 'Standard'} booking failed:`, error);
      alert('Booking failed. Please try again.');
      setBookingProgress(Math.max(0, bookingProgress - 20));
    }
  };

  const renderCounselorSelection = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Choose Your Counselor</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Find a licensed professional who specializes in your area of concern.
        </p>
      </div>

      {/* Enhanced Search & Filters */}
      <Card className="p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {allSpecialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: 'rating' | 'availability') => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="availability">Next Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 px-1">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCounselors.length} counsellor{filteredCounselors.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || filterSpecialty !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterSpecialty('all');
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Enhanced Counselor Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {filteredCounselors.map((counselor) => (
          <Card
            key={counselor.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
              selectedCounselor === counselor.id ? 'ring-2 ring-primary shadow-glow' : ''
            }`}
            onClick={() => setSelectedCounselor(counselor.id)}
          >
            <CardHeader className="space-y-3 md:space-y-4 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-hero rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>

                  {/* Real-time status indicator */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-background flex items-center justify-center ${
                      getCounselorStatus(counselor.id) === 'online'
                        ? 'bg-green-500'
                        : getCounselorStatus(counselor.id) === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-1 sm:space-y-0">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base md:text-lg flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <span className="truncate">{counselor.name}</span>
                        {getCounselorStatus(counselor.id) === 'online' && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700 flex-shrink-0 w-fit"
                          >
                            Available Now
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-muted-foreground">{counselor.title}</p>
                    </div>

                    {/* Live activity indicator */}
                    {slotWatchers[counselor.id] > 0 && (
                      <div className="flex items-center text-xs text-orange-600 flex-shrink-0">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{slotWatchers[counselor.id]} watching</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(counselor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{counselor.rating}/5</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{counselor.reviewCount} reviews</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{counselor.experience}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>Response: {counselor.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <CalIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>Next: {format(counselor.nextAvailable, 'MMM d, h:mm a')}</span>
                    </div>

                    {/* Real-time slots available */}
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
                      <span className="text-blue-600 font-medium">
                        {getAvailableSlots(counselor, new Date()).length} slots today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">{counselor.bio}</p>

              <div className="space-y-3">
                {/* Specialties */}
                <div>
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {counselor.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {counselor.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{counselor.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="text-sm">
                  <p className="font-medium mb-1">Languages:</p>
                  <p className="text-muted-foreground">{counselor.languages.join(', ')}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReviews(counselor.id);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Reviews
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show more info
                    }}
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    More Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCounselors.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <Users className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-medium mb-2">No counselors found</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterSpecialty('all');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center md:justify-end pt-4">
        <Button
          onClick={() => setStep('datetime')}
          disabled={!selectedCounselor}
          variant="hero"
          size="lg"
          className="w-full md:w-auto"
        >
          Continue to Date & Time
          <CalendarIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Select Date & Time</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Choose your preferred session date and time with {selectedCounselorData?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <CalendarIcon className="h-5 w-5" />
              <span>Choose Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Available Times</span>
                  {isLiveUpdate && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
                </div>

                {selectedDate && selectedCounselorData && (
                  <Badge variant="outline" className="text-xs">
                    {getAvailableSlots(selectedCounselorData, selectedDate).length} slots
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              {selectedDate && selectedCounselorData && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                    <span className="text-xs md:text-sm">
                      Available slots for {format(selectedDate, 'EEE, MMM d')}
                    </span>
                    <span className="text-xs">Last updated: {format(lastUpdate, 'HH:mm')}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getAvailableSlots(selectedCounselorData, selectedDate).map((time) => {
                      const isSelected = selectedTime === time;
                      const isPopular = Math.random() > 0.7; // Simulate popular times

                      return (
                        <Button
                          key={time}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setSelectedTime(time)}
                          className={`h-10 md:h-12 relative transition-all duration-200 text-xs md:text-sm ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          } ${isPopular && !isSelected ? 'border-orange-300 bg-orange-50' : ''}`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{time}</span>
                            {isPopular && !isSelected && (
                              <span className="text-xs text-orange-600">Popular</span>
                            )}
                          </div>

                          {/* Live booking indicator */}
                          {isPopular && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {getAvailableSlots(selectedCounselorData, selectedDate).length === 0 && (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          No slots available on this date
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Try selecting a different date or check back later
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshAvailability}
                          disabled={isLiveUpdate}
                        >
                          <RefreshCw
                            className={`h-3 w-3 mr-1 ${isLiveUpdate ? 'animate-spin' : ''}`}
                          />
                          Check Again
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Real-time availability notice */}
                  {selectedTime && (
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <span>Slot reserved for 10 minutes</span>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Type */}
          <Card>
            <CardHeader>
              <CardTitle>Session Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={sessionType}
                onValueChange={(value: 'online' | 'in-person') => setSessionType(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    <span>Online Session</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="flex items-center space-x-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    <span>In-Person Session</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Urgency Level</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="urgent">This is urgent (within 24-48 hours)</Label>
              </div>
              {isUrgent && (
                <div className="mt-3 p-3 bg-severity-medium/10 rounded-lg">
                  <p className="text-sm text-severity-medium">
                    For immediate crisis support, please call the crisis helpline: 988
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <Button variant="outline" onClick={() => setStep('counselor')} className="w-full sm:w-auto">
          Back to Counselors
        </Button>
        <Button
          onClick={() => setStep('details')}
          disabled={!selectedDate || !selectedTime}
          variant="hero"
          className="w-full sm:w-auto"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Session Details</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Help us prepare for your session by providing some background information.
        </p>
      </div>

      {/* Anonymous Booking Toggle */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Privacy & Anonymity Options
          </CardTitle>
          <CardDescription>
            Protect your privacy with anonymous booking features designed for sensitive
            conversations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="anonymous" className="font-medium cursor-pointer">
                Book Anonymously
              </Label>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">
                Use anonymous booking to protect your identity while still receiving professional
                support.
              </p>
            </div>
          </div>

          {isAnonymous && (
            <div className="space-y-4 pt-4 border-t border-blue-200">
              {/* Anonymous ID Display */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Your Anonymous ID</p>
                    <code className="text-sm bg-white px-2 py-1 rounded border text-blue-700 font-mono">
                      {anonymousId}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const prefixes = ['ANON', 'PRIV', 'CONF', 'SAFE', 'PEER'];
                      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                      const randomNum = Math.floor(Math.random() * 99999)
                        .toString()
                        .padStart(5, '0');
                      setAnonymousId(`${prefix}-${randomNum}`);
                    }}
                  >
                    <Shuffle className="h-4 w-4 mr-1" />
                    New ID
                  </Button>
                </div>
                <p className="text-xs text-blue-700">
                  Save this ID to access your session details later. This is your only identifier.
                </p>
              </div>

              {/* Privacy Level Selection */}
              <div className="space-y-3">
                <Label className="font-medium">Privacy Protection Level</Label>
                <RadioGroup
                  value={privacyLevel}
                  onValueChange={(value: 'basic' | 'enhanced' | 'maximum') =>
                    setPrivacyLevel(value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="basic" id="basic" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="basic" className="font-medium cursor-pointer">
                        Basic Privacy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Standard data protection with minimal personal information required.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg border-blue-200 bg-blue-50">
                    <RadioGroupItem value="enhanced" id="enhanced" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="enhanced" className="font-medium cursor-pointer">
                        Enhanced Privacy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypted communication, minimal data retention, secure session management.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg border-green-200 bg-green-50">
                    <RadioGroupItem value="maximum" id="maximum" className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor="maximum"
                        className="font-medium cursor-pointer flex items-center"
                      >
                        Maximum Privacy
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Recommended
                        </Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        No logs, immediate data deletion post-session, end-to-end encryption.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Additional Privacy Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="encryption"
                    checked={useEncryption}
                    onChange={(e) => setUseEncryption(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="encryption" className="flex items-center text-sm">
                    <Lock className="h-4 w-4 mr-1" />
                    End-to-end encrypt all communications
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Retention Period</Label>
                  <Select
                    value={dataRetention}
                    onValueChange={(value: 'session-only' | '30-days' | '90-days') =>
                      setDataRetention(value)
                    }
                  >
                    <SelectTrigger>
                      <Database className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="session-only">Delete immediately after session</SelectItem>
                      <SelectItem value="30-days">Keep for 30 days (recommended)</SelectItem>
                      <SelectItem value="90-days">Keep for 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Fields - Conditional based on booking type */}
      {isAnonymous ? (
        /* Anonymous Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <UserX className="h-5 w-5 mr-2" />
              Anonymous Session Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alias" className="text-sm font-medium">
                  Preferred Alias *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="alias"
                    placeholder="How should we address you?"
                    value={anonymousForm.alias}
                    onChange={(e) => setAnonymousForm({ ...anonymousForm, alias: e.target.value })}
                    className={`flex-1 ${!anonymousForm.alias ? 'border-red-200 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      const aliases = [
                        'Student',
                        'Learner',
                        'Friend',
                        'Peer',
                        'Seeker',
                        'Helper',
                        'Traveler',
                      ];
                      const randomAlias = aliases[Math.floor(Math.random() * aliases.length)];
                      setAnonymousForm({
                        ...anonymousForm,
                        alias: `${randomAlias}${Math.floor(Math.random() * 999)}`,
                      });
                    }}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This name will only be used during your session for a personal touch.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageRange" className="text-sm font-medium">
                  Age Range *
                </Label>
                <Select
                  value={anonymousForm.ageRange}
                  onValueChange={(value) => setAnonymousForm({ ...anonymousForm, ageRange: value })}
                >
                  <SelectTrigger className={!anonymousForm.ageRange ? 'border-red-200' : ''}>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16-18">16-18 years</SelectItem>
                    <SelectItem value="19-22">19-22 years</SelectItem>
                    <SelectItem value="23-26">23-26 years</SelectItem>
                    <SelectItem value="27-30">27-30 years</SelectItem>
                    <SelectItem value="31+">31+ years</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concerns">What would you like to discuss? *</Label>
              <textarea
                id="concerns"
                placeholder="Describe your concerns or what you'd like to work on. No personal details needed."
                value={anonymousForm.concerns}
                onChange={(e) => setAnonymousForm({ ...anonymousForm, concerns: e.target.value })}
                rows={3}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  !anonymousForm.concerns ? 'border-red-200 focus-visible:ring-red-500' : ''
                }`}
                required
              />
              <p className="text-xs text-muted-foreground">
                Keep this general - avoid specific names, places, or identifying details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousExperience">Previous Therapy Experience</Label>
                <Select
                  value={anonymousForm.previousExperience}
                  onValueChange={(value) =>
                    setAnonymousForm({ ...anonymousForm, previousExperience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-time">First time seeking help</SelectItem>
                    <SelectItem value="some-experience">Some previous experience</SelectItem>
                    <SelectItem value="experienced">Experienced with therapy</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communicationStyle">Communication Preference</Label>
                <Select
                  value={anonymousForm.communicationStyle}
                  onValueChange={(value) =>
                    setAnonymousForm({ ...anonymousForm, communicationStyle: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How do you like to communicate?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct and straightforward</SelectItem>
                    <SelectItem value="gentle">Gentle and supportive</SelectItem>
                    <SelectItem value="collaborative">Collaborative discussion</SelectItem>
                    <SelectItem value="structured">Structured approach</SelectItem>
                    <SelectItem value="flexible">Whatever feels natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyCode">Emergency Contact Code (Optional)</Label>
              <Input
                id="emergencyCode"
                placeholder="A code word for emergency situations"
                value={anonymousForm.emergencyCode}
                onChange={(e) =>
                  setAnonymousForm({ ...anonymousForm, emergencyCode: e.target.value })
                }
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Optional: A private code that can be used to identify you in emergency situations
                only.
              </p>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Privacy Guarantee:</span> Your session information is
                protected by our anonymous booking system. Only your chosen alias and anonymous ID
                will be used during the session.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        /* Standard Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className={`${!bookingForm.name ? 'border-red-200 focus-visible:ring-red-500' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={bookingForm.dateOfBirth}
                  onChange={(e) => setBookingForm({ ...bookingForm, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  className={!bookingForm.email ? 'border-red-200 focus-visible:ring-red-500' : ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className={!bookingForm.phone ? 'border-red-200 focus-visible:ring-red-500' : ''}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Session *</Label>
              <textarea
                id="reason"
                placeholder="Please describe what you'd like to discuss or work on during your session..."
                value={bookingForm.reason}
                onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                rows={3}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  !bookingForm.reason ? 'border-red-200 focus-visible:ring-red-500' : ''
                }`}
                required
                aria-label="Describe what you'd like to discuss in your counseling session"
                aria-describedby="reason-help"
                aria-required="true"
                aria-invalid={!bookingForm.reason ? 'true' : 'false'}
              />
              <p id="reason-help" className="text-xs text-muted-foreground">
                This information helps your counselor prepare for your session and is kept
                confidential.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <Select
                  value={bookingForm.preferredContactMethod}
                  onValueChange={(value) =>
                    setBookingForm({ ...bookingForm, preferredContactMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </SelectItem>
                    <SelectItem value="phone">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Call
                    </SelectItem>
                    <SelectItem value="text">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Text Message
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Name and phone number"
                  value={bookingForm.emergencyContact}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, emergencyContact: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Session Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                <SelectTrigger>
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Marathi">Marathi</SelectItem>
                  <SelectItem value="Gujarati">Gujarati</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session Reminders</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reminders" className="rounded" defaultChecked />
                <Label htmlFor="reminders" className="text-sm">
                  {isAnonymous
                    ? 'Send anonymous reminders to session platform'
                    : 'Send me reminders 24hrs and 1hr before'}
                </Label>
              </div>
            </div>
          </div>

          {selectedCounselorData && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Session Details</p>
                  <p className="text-sm text-muted-foreground">
                    {sessionType === 'online' ? 'Online' : 'In-Person'} Session with{' '}
                    {selectedCounselorData.name}
                    {isAnonymous && ' (Anonymous Booking)'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-green-600">
                  ✓ Free consultation service. No upfront charges required.
                </p>
                {isAnonymous && (
                  <p className="text-sm text-blue-600">
                    ✓ Protected by advanced privacy features and anonymous booking system.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <Button variant="outline" onClick={() => setStep('datetime')} className="w-full sm:w-auto">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Back to Date & Time
        </Button>
        <Button
          onClick={handleBooking}
          disabled={
            isAnonymous
              ? !selectedCounselor ||
                !selectedTime ||
                !selectedDate ||
                !anonymousForm.alias ||
                !anonymousForm.ageRange ||
                !anonymousForm.concerns
              : !selectedCounselor ||
                !selectedTime ||
                !selectedDate ||
                !bookingForm.name ||
                !bookingForm.email ||
                !bookingForm.phone ||
                !bookingForm.reason
          }
          variant="hero"
          size="lg"
          className="w-full sm:w-auto"
        >
          <span className="truncate">
            {!selectedCounselor
              ? 'Select Counselor First'
              : !selectedTime
                ? 'Select Time Slot First'
                : isAnonymous
                  ? !anonymousForm.alias || !anonymousForm.ageRange || !anonymousForm.concerns
                    ? 'Complete Required Fields'
                    : 'Book Anonymous Session'
                  : !bookingForm.name ||
                      !bookingForm.email ||
                      !bookingForm.phone ||
                      !bookingForm.reason
                    ? 'Complete Required Fields'
                    : 'Book Session'}
          </span>
          <CheckCircle className="h-4 w-4 ml-2 flex-shrink-0" />
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4 md:space-y-6 text-center max-w-4xl mx-auto">
      {/* Success Animation */}
      <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
        <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-white animate-bounce" />
      </div>

      <div className="space-y-2 px-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {isAnonymous ? 'Anonymous Booking Confirmed!' : 'Instant Booking Confirmed!'}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {isAnonymous
            ? 'Your confidential anonymous session was secured with maximum privacy protection.'
            : 'Your confidential session was booked in real-time and confirmed instantly.'}
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Zap className="h-4 w-4" />
          <span>{isAnonymous ? 'Anonymous booking secured' : 'Booking confirmed instantly'}</span>
        </div>
        {isAnonymous && (
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <Shield className="h-4 w-4" />
            <span>
              Privacy level: {privacyLevel.charAt(0).toUpperCase() + privacyLevel.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Session Details with Enhanced Info */}
      <Card
        className={`text-left max-w-lg mx-auto ${isAnonymous ? 'border-blue-200 bg-blue-50/30' : 'border-green-200 bg-green-50/30'}`}
      >
        <CardHeader
          className={`${isAnonymous ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white rounded-t-lg`}
        >
          <CardTitle className="flex items-center space-x-2">
            {isAnonymous ? <Shield className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            <span>{isAnonymous ? 'Anonymous Session Details' : 'Live Session Details'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          {isAnonymous && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">Your Anonymous ID</span>
                <Badge className="bg-blue-100 text-blue-700 text-xs">Save This ID</Badge>
              </div>
              <code className="text-sm bg-white px-2 py-1 rounded border text-blue-700 font-mono block text-center">
                {anonymousId}
              </code>
              <p className="text-xs text-blue-600">
                Use this ID to access your session and any follow-up communications.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                {isAnonymous ? 'Your Counselor' : 'Counselor'}
              </span>
              <div className="font-medium flex items-center space-x-2">
                <div
                  className={`w-2 h-2 ${isAnonymous ? 'bg-blue-500' : 'bg-green-500'} rounded-full`}
                />
                <span>{selectedCounselorData?.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={
                  isAnonymous ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }
              >
                {isAnonymous
                  ? 'Anonymous Session'
                  : getCounselorStatus(selectedCounselor) === 'online'
                    ? 'Available Now'
                    : 'Confirmed'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <div className="font-medium">
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''} at {selectedTime}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Session Type</span>
              <div className="font-medium flex items-center">
                {sessionType === 'online' ? (
                  <>
                    <Video className="h-4 w-4 mr-1" /> Online
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-1" /> In-Person
                  </>
                )}
              </div>
            </div>
          </div>

          {isAnonymous && (
            <div className="space-y-2 border-t pt-3">
              <div className="text-sm font-medium text-blue-900">Privacy Protections Applied:</div>
              <div className="space-y-1 text-xs text-blue-700">
                <div className="flex items-center space-x-2">
                  <Lock className="h-3 w-3" />
                  <span>
                    {privacyLevel === 'maximum'
                      ? 'Maximum privacy with no data retention'
                      : privacyLevel === 'enhanced'
                        ? 'Enhanced privacy with encrypted communication'
                        : 'Basic privacy with standard protections'}
                  </span>
                </div>
                {useEncryption && (
                  <div className="flex items-center space-x-2">
                    <Key className="h-3 w-3" />
                    <span>End-to-end encrypted communication</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Database className="h-3 w-3" />
                  <span>
                    Data retention:{' '}
                    {dataRetention === 'session-only'
                      ? 'Deleted immediately after session'
                      : dataRetention === '30-days'
                        ? 'Kept for 30 days'
                        : 'Kept for 90 days'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserX className="h-3 w-3" />
                  <span>Identity protected with alias: "{anonymousForm.alias}"</span>
                </div>
              </div>
            </div>
          )}

          {/* Live booking ID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {isAnonymous ? 'Session Reference' : 'Booking Reference'}
            </div>
            <div className="font-mono text-sm font-medium">
              {isAnonymous
                ? `ANON-${anonymousId.split('-')[1]}`
                : `MB-${Date.now().toString().slice(-6)}-${selectedCounselor}`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Privacy Notice for Anonymous Bookings */}
      {isAnonymous && (
        <Alert className="max-w-lg mx-auto text-left">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Your Privacy is Protected</p>
              <div className="text-sm space-y-1">
                <p>• Your real identity is not stored or shared with the counselor</p>
                <p>• Session communications use your anonymous ID only</p>
                <p>• Data handling follows your selected privacy level</p>
                <p>• Emergency protocols available if needed using your emergency code</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Instant Action Buttons */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Button
            variant="outline"
            className={`flex items-center space-x-2 ${isAnonymous ? 'border-blue-200 hover:bg-blue-50' : 'border-green-200 hover:bg-green-50'}`}
            onClick={() => window.open('https://meet.google.com/new', '_blank')}
          >
            <Video className="h-4 w-4" />
            <span>{isAnonymous ? 'Join Anonymous Session' : 'Join Session Now'}</span>
            <Zap className={`h-3 w-3 ml-1 ${isAnonymous ? 'text-blue-500' : 'text-green-500'}`} />
          </Button>

          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => alert('Calendar event created!')}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Add to Calendar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-lg mx-auto text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert('Reminder set!')}
            className={
              isAnonymous ? 'text-blue-600 hover:bg-blue-50' : 'text-green-600 hover:bg-green-50'
            }
          >
            <Bell className="h-4 w-4 mr-1" />
            {isAnonymous ? 'Anonymous Reminder' : 'Set Reminder'}
          </Button>

          {isAnonymous ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Accessing anonymous portal...')}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Shield className="h-4 w-4 mr-1" />
              Privacy Portal
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Details shared!')}
              className="text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Share Details
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            className="text-purple-600 hover:bg-purple-50"
          >
            <FileText className="h-4 w-4 mr-1" />
            Print Receipt
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Alert
          className={`max-w-lg mx-auto ${isAnonymous ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}
        >
          {isAnonymous ? <Shield className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          <AlertDescription>
            <div className="text-sm">
              <strong>Next Steps:</strong>{' '}
              {isAnonymous
                ? 'You will receive anonymous session access instructions through the secure portal. Your counselor has your alias and session preferences.'
                : 'You will receive instant WhatsApp and email confirmations. Your counselor will contact you 10 minutes before the session.'}
            </div>
          </AlertDescription>
        </Alert>

        <p className="text-sm text-muted-foreground">
          {isAnonymous
            ? 'Anonymous booking secured • Identity protected • Privacy guaranteed'
            : 'Real-time booking confirmed • Session protected • Privacy guaranteed'}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <Button
            variant="hero"
            onClick={() => (window.location.href = '/')}
            className="w-full sm:w-auto"
          >
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStep('counselor');
              setSelectedCounselor('');
              setSelectedTime('');
              setSelectedDate(new Date());
              if (isAnonymous) {
                setAnonymousForm({
                  alias: '',
                  ageRange: '',
                  concerns: '',
                  previousExperience: '',
                  communicationStyle: '',
                  sessionNotes: '',
                  emergencyCode: '',
                  preferredAnonymity: 'partial',
                });
                setAnonymousId('');
                setIsAnonymous(false);
              } else {
                setBookingForm({
                  name: '',
                  email: '',
                  phone: '',
                  reason: '',
                  previousTherapy: '',
                  notes: '',
                  emergencyContact: '',
                  dateOfBirth: '',
                  preferredContactMethod: 'email',
                });
              }
            }}
            className="w-full sm:w-auto"
          >
            Book Another Session
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Confidential Counseling
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Book a private session with a licensed mental health professional. Your privacy and
          confidentiality are our top priority.
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>Licensed Professionals</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>Crisis Support Available</span>
          </div>
        </div>
      </div>

      {/* Real-time Status & Progress Bar */}
      <div className="mb-6 space-y-3">
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Booking Progress</span>
            <span>{Math.round(bookingProgress)}%</span>
          </div>
          <Progress value={bookingProgress} className="h-2" />
        </div>

        {/* Live Status & Controls */}
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0 lg:space-x-4">
              {/* Live Status */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isLiveUpdate ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}
                  />
                  <span className="text-sm font-medium">
                    {isLiveUpdate ? 'Updating...' : 'Live Availability'}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last updated: {format(lastUpdate, 'HH:mm:ss')}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Auto-refresh toggle */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm">Auto-refresh</label>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`p-1 rounded ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <Zap className="h-4 w-4" />
                  </button>
                </div>

                {/* Manual refresh */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshAvailability}
                  disabled={isLiveUpdate}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLiveUpdate ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Support Banner */}
      <Card className="mb-6 bg-severity-high/10 border-severity-high/20">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <AlertTriangle className="h-5 w-5 text-severity-high flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-severity-high">In Crisis? Get Immediate Help</p>
              <p className="text-sm text-muted-foreground mt-1">
                If you're having thoughts of self-harm, call 988 (Suicide & Crisis Lifeline) or
                visit your nearest emergency room.
              </p>
            </div>
            <Button variant="destructive" size="sm" className="flex-shrink-0">
              <PhoneCall className="h-4 w-4 mr-1" />
              Call 988
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking Steps */}
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-6 px-2">
          <div className="flex justify-between items-center">
            {['counselor', 'datetime', 'details', 'confirmation'].map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['counselor', 'datetime', 'details', 'confirmation'].indexOf(step) > index
                        ? 'bg-severity-low text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mx-1 md:mx-2 ${
                      ['counselor', 'datetime', 'details', 'confirmation'].indexOf(step) > index
                        ? 'bg-severity-low'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1 mt-2 text-xs md:text-sm text-center">
            <span className="truncate">Choose Counsellor</span>
            <span className="truncate">Date & Time</span>
            <span className="truncate">Details</span>
            <span className="truncate">Confirmation</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 'counselor' && renderCounselorSelection()}
        {step === 'datetime' && renderDateTimeSelection()}
        {step === 'details' && renderDetailsForm()}
        {step === 'confirmation' && renderConfirmation()}
      </div>
    </div>
  );
};

export default Booking;
