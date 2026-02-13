import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  GraduationCap,
  CheckCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Star,
  Clock,
  Eye,
  Heart,
  SortAsc,
  SortDesc,
  X,
  Info,
  Phone,
  Mail,
  Globe,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
  city: string;
  state: string;
  students: number;
  established: string;
  featured?: boolean;
  rating: number;
  description: string;
  website: string;
  email: string;
  phone: string;
  programs: string[];
  facilities: string[];
  lastViewed?: Date;
  isFavorite?: boolean;
}

// Extended mock data with comprehensive Indian institutions
const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'BP Poddar Institute of Management and Technology',
    type: 'Engineering & Management',
    location: 'Kolkata, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    students: 2500,
    established: '2001',
    featured: true,
    rating: 4.2,
    description:
      'A premier institute offering quality education in engineering and management with state-of-the-art facilities.',
    website: 'https://bppimt.ac.in',
    email: 'info@bppimt.ac.in',
    phone: '+91-33-2414-6100',
    programs: ['B.Tech', 'M.Tech', 'MBA', 'BBA'],
    facilities: ['Library', 'Labs', 'Hostel', 'Sports Complex', 'Cafeteria'],
  },
  {
    id: '2',
    name: 'Indian Institute of Technology Delhi',
    type: 'Engineering & Technology',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 8500,
    established: '1961',
    rating: 4.8,
    description:
      "One of India's premier engineering institutions known for excellence in research and academics.",
    website: 'https://iitd.ac.in',
    email: 'info@iitd.ac.in',
    phone: '+91-11-2659-1785',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'MBA'],
    facilities: ['Research Labs', 'Library', 'Hostels', 'Sports Complex', 'Medical Center'],
  },
  {
    id: '3',
    name: 'Delhi University',
    type: 'Multi-disciplinary',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 130000,
    established: '1922',
    rating: 4.3,
    description:
      "One of India's largest and most prestigious universities offering diverse academic programs.",
    website: 'https://du.ac.in',
    email: 'info@du.ac.in',
    phone: '+91-11-2766-7049',
    programs: ['BA', 'BSc', 'BCom', 'MA', 'MSc', 'PhD'],
    facilities: ['Multiple Libraries', 'Research Centers', 'Sports Facilities', 'Cultural Centers'],
  },
  {
    id: '4',
    name: 'Jadavpur University',
    type: 'Engineering & Arts',
    location: 'Kolkata, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    students: 12000,
    established: '1955',
    rating: 4.4,
    description:
      'Renowned for engineering and liberal arts education with a strong research focus.',
    website: 'https://jaduniv.edu.in',
    email: 'info@jaduniv.edu.in',
    phone: '+91-33-2414-6666',
    programs: ['B.E', 'M.E', 'BA', 'MA', 'PhD'],
    facilities: ['Central Library', 'Research Labs', 'Hostels', 'Auditorium'],
  },
  {
    id: '5',
    name: 'Indian Institute of Management Calcutta',
    type: 'Management',
    location: 'Kolkata, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    students: 1200,
    established: '1961',
    rating: 4.7,
    description: 'Premier business school known for producing top management professionals.',
    website: 'https://iimcal.ac.in',
    email: 'info@iimcal.ac.in',
    phone: '+91-33-2467-8300',
    programs: ['MBA', 'Executive MBA', 'PhD', 'Fellow Programme'],
    facilities: ['Business Library', 'Case Study Rooms', 'Hostels', 'Recreation Center'],
  },
  {
    id: '6',
    name: 'Christ University',
    type: 'Multi-disciplinary',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    students: 25000,
    established: '1969',
    rating: 4.1,
    description: 'A leading educational institution known for holistic education and research.',
    website: 'https://christuniversity.in',
    email: 'info@christuniversity.in',
    phone: '+91-80-4012-9000',
    programs: ['Various UG/PG Programs', 'PhD', 'Diploma Courses'],
    facilities: ['Multiple Campuses', 'Libraries', 'Sports Complex', 'Research Centers'],
  },
  {
    id: '7',
    name: 'Indian Institute of Science',
    type: 'Science & Research',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    students: 3500,
    established: '1909',
    featured: true,
    rating: 4.9,
    description: "India's premier institute for advanced scientific and technological research.",
    website: 'https://iisc.ac.in',
    email: 'info@iisc.ac.in',
    phone: '+91-80-2293-2001',
    programs: ['MSc', 'PhD', 'MTech', 'Research Programs'],
    facilities: ['World-class Labs', 'Central Library', 'Hostels', 'Research Centers'],
  },
  {
    id: '8',
    name: 'Jawaharlal Nehru University',
    type: 'Liberal Arts & Social Sciences',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 8500,
    established: '1969',
    rating: 4.2,
    description: 'Known for excellence in social sciences, languages, and international studies.',
    website: 'https://jnu.ac.in',
    email: 'info@jnu.ac.in',
    phone: '+91-11-2670-4000',
    programs: ['BA', 'MA', 'MPhil', 'PhD'],
    facilities: ['Central Library', 'Language Labs', 'Hostels', 'Cultural Centers'],
  },
  // Additional IITs
  {
    id: '9',
    name: 'Indian Institute of Technology Bombay',
    type: 'Engineering & Technology',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    students: 10000,
    established: '1958',
    featured: true,
    rating: 4.9,
    description: "India's top engineering institute known for innovation and entrepreneurship.",
    website: 'https://iitb.ac.in',
    email: 'info@iitb.ac.in',
    phone: '+91-22-2572-2545',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'Dual Degree'],
    facilities: ['Advanced Labs', 'Central Library', 'Hostels', 'Incubation Center'],
  },
  {
    id: '10',
    name: 'Indian Institute of Technology Madras',
    type: 'Engineering & Technology',
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    students: 9500,
    established: '1959',
    rating: 4.8,
    description: 'Premier technical institute with strong industry connections and research.',
    website: 'https://iitm.ac.in',
    email: 'info@iitm.ac.in',
    phone: '+91-44-2257-4802',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'MS'],
    facilities: ['Research Parks', 'Libraries', 'Hostels', 'Innovation Labs'],
  },
  {
    id: '11',
    name: 'Indian Institute of Technology Kanpur',
    type: 'Engineering & Technology',
    location: 'Kanpur, Uttar Pradesh',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    students: 7500,
    established: '1959',
    rating: 4.7,
    description: 'Known for academic excellence and cutting-edge research in engineering.',
    website: 'https://iitk.ac.in',
    email: 'info@iitk.ac.in',
    phone: '+91-512-259-7410',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'MS'],
    facilities: ['Computer Center', 'Libraries', 'Hostels', 'Sports Complex'],
  },
  {
    id: '12',
    name: 'Indian Institute of Technology Kharagpur',
    type: 'Engineering & Technology',
    location: 'Kharagpur, West Bengal',
    city: 'Kharagpur',
    state: 'West Bengal',
    students: 12000,
    established: '1951',
    rating: 4.6,
    description: "India's first IIT, known for comprehensive technical education.",
    website: 'https://iitkgp.ac.in',
    email: 'info@iitkgp.ac.in',
    phone: '+91-3222-255221',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'Integrated Programs'],
    facilities: ['Central Library', 'Research Labs', 'Hostels', 'Medical Center'],
  },
  // Additional IIMs
  {
    id: '13',
    name: 'Indian Institute of Management Ahmedabad',
    type: 'Management',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    students: 1800,
    established: '1961',
    featured: true,
    rating: 4.8,
    description: "India's premier management institute with global recognition.",
    website: 'https://iima.ac.in',
    email: 'info@iima.ac.in',
    phone: '+91-79-6632-4000',
    programs: ['PGP', 'Executive MBA', 'PhD', 'Fellow Programme'],
    facilities: ['Louis Kahn Plaza', 'Library', 'Hostels', 'Sports Complex'],
  },
  {
    id: '14',
    name: 'Indian Institute of Management Bangalore',
    type: 'Management',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    students: 1500,
    established: '1973',
    rating: 4.7,
    description: 'Leading business school with strong industry partnerships.',
    website: 'https://iimb.ac.in',
    email: 'info@iimb.ac.in',
    phone: '+91-80-2699-3000',
    programs: ['PGP', 'Executive MBA', 'PhD', 'Management Programs'],
    facilities: ['Management Library', 'Computing Center', 'Hostels', 'Guest House'],
  },
  // NITs
  {
    id: '15',
    name: 'National Institute of Technology Trichy',
    type: 'Engineering & Technology',
    location: 'Tiruchirappalli, Tamil Nadu',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    students: 8000,
    established: '1964',
    rating: 4.5,
    description: 'Premier technical institute known for quality engineering education.',
    website: 'https://nitt.edu',
    email: 'info@nitt.edu',
    phone: '+91-431-250-3000',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'MBA'],
    facilities: ['Central Library', 'Computer Center', 'Hostels', 'Sports Complex'],
  },
  {
    id: '16',
    name: 'National Institute of Technology Warangal',
    type: 'Engineering & Technology',
    location: 'Warangal, Telangana',
    city: 'Warangal',
    state: 'Telangana',
    students: 7500,
    established: '1959',
    rating: 4.4,
    description: 'Renowned NIT with excellence in engineering and technology.',
    website: 'https://nitw.ac.in',
    email: 'info@nitw.ac.in',
    phone: '+91-870-246-2721',
    programs: ['B.Tech', 'M.Tech', 'PhD', 'MBA'],
    facilities: ['Central Library', 'Labs', 'Hostels', 'Medical Center'],
  },
  // Medical Colleges
  {
    id: '17',
    name: 'All India Institute of Medical Sciences Delhi',
    type: 'Medical & Health Sciences',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 3500,
    established: '1956',
    featured: true,
    rating: 4.9,
    description: "India's premier medical institute and hospital.",
    website: 'https://aiims.edu',
    email: 'info@aiims.edu',
    phone: '+91-11-2658-8500',
    programs: ['MBBS', 'MD', 'MS', 'PhD'],
    facilities: ['Teaching Hospital', 'Medical Library', 'Research Labs', 'Hostels'],
  },
  {
    id: '18',
    name: 'Christian Medical College',
    type: 'Medical & Health Sciences',
    location: 'Vellore, Tamil Nadu',
    city: 'Vellore',
    state: 'Tamil Nadu',
    students: 2500,
    established: '1900',
    rating: 4.7,
    description: 'Leading medical college with excellent healthcare facilities.',
    website: 'https://cmch-vellore.edu',
    email: 'info@cmch-vellore.edu',
    phone: '+91-416-228-1000',
    programs: ['MBBS', 'MD', 'MS', 'Nursing'],
    facilities: ['Multi-specialty Hospital', 'Medical Library', 'Research Centers', 'Hostels'],
  },
  // Arts & Commerce Colleges
  {
    id: '19',
    name: "St. Stephen's College",
    type: 'Liberal Arts & Sciences',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 1200,
    established: '1881',
    featured: true,
    rating: 4.6,
    description: 'Prestigious liberal arts college affiliated with Delhi University.',
    website: 'https://ststephens.edu',
    email: 'info@ststephens.edu',
    phone: '+91-11-2766-7491',
    programs: ['BA', 'BSc', 'MA', 'MSc'],
    facilities: ['Historic Library', 'Chapel', 'Sports Grounds', 'Auditorium'],
  },
  {
    id: '20',
    name: 'Lady Shri Ram College for Women',
    type: 'Liberal Arts & Commerce',
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    students: 2000,
    established: '1956',
    rating: 4.5,
    description: "Premier women's college known for academic excellence.",
    website: 'https://lsr.edu.in',
    email: 'info@lsr.edu.in',
    phone: '+91-11-2434-2893',
    programs: ['BA', 'BCom', 'BSc', 'MA'],
    facilities: ['Library', 'Auditorium', 'Sports Facilities', 'Cafeteria'],
  },
  // Mumbai Universities
  {
    id: '21',
    name: 'University of Mumbai',
    type: 'Multi-disciplinary',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    students: 350000,
    established: '1857',
    rating: 4.1,
    description: "One of India's oldest and largest universities.",
    website: 'https://mu.ac.in',
    email: 'info@mu.ac.in',
    phone: '+91-22-2270-5000',
    programs: ['Various UG/PG Programs', 'PhD', 'Professional Courses'],
    facilities: ['Multiple Campuses', 'Libraries', 'Research Centers', 'Sports Facilities'],
  },
  {
    id: '22',
    name: 'Tata Institute of Fundamental Research',
    type: 'Science & Research',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    students: 1500,
    established: '1945',
    rating: 4.8,
    description: 'Premier research institute in fundamental sciences.',
    website: 'https://tifr.res.in',
    email: 'info@tifr.res.in',
    phone: '+91-22-2278-2000',
    programs: ['MSc', 'PhD', 'Integrated PhD'],
    facilities: ['Research Labs', 'Library', 'Computer Center', 'Hostels'],
  },
  // Pune Colleges
  {
    id: '23',
    name: 'Pune University',
    type: 'Multi-disciplinary',
    location: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    students: 450000,
    established: '1949',
    rating: 4.0,
    description: 'Major university serving the Pune metropolitan region.',
    website: 'https://unipune.ac.in',
    email: 'info@unipune.ac.in',
    phone: '+91-20-2569-2000',
    programs: ['Various UG/PG Programs', 'PhD', 'Distance Education'],
    facilities: ['Multiple Departments', 'Libraries', 'Sports Complex', 'Guest House'],
  },
  {
    id: '24',
    name: 'College of Engineering Pune',
    type: 'Engineering & Technology',
    location: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    students: 4500,
    established: '1854',
    rating: 4.3,
    description: "One of India's oldest engineering colleges.",
    website: 'https://coep.org.in',
    email: 'info@coep.org.in',
    phone: '+91-20-2550-7001',
    programs: ['B.Tech', 'M.Tech', 'PhD'],
    facilities: ['Historic Campus', 'Labs', 'Library', 'Hostels'],
  },
  // Hyderabad Colleges
  {
    id: '25',
    name: 'University of Hyderabad',
    type: 'Multi-disciplinary',
    location: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    students: 5000,
    established: '1974',
    rating: 4.4,
    description: 'Central university known for research and academics.',
    website: 'https://uohyd.ac.in',
    email: 'info@uohyd.ac.in',
    phone: '+91-40-2313-4000',
    programs: ['Various UG/PG Programs', 'PhD', 'Integrated Programs'],
    facilities: ['Beautiful Campus', 'Libraries', 'Research Centers', 'Hostels'],
  },
  {
    id: '26',
    name: 'International Institute of Information Technology Hyderabad',
    type: 'Information Technology',
    location: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    students: 3000,
    established: '1998',
    rating: 4.5,
    description: 'Premier IT institute with strong industry connections.',
    website: 'https://iiit.ac.in',
    email: 'info@iiit.ac.in',
    phone: '+91-40-6653-1000',
    programs: ['B.Tech', 'M.Tech', 'MS', 'PhD'],
    facilities: ['Modern Campus', 'Labs', 'Library', 'Research Centers'],
  },
  // Additional State Universities
  {
    id: '27',
    name: 'Banaras Hindu University',
    type: 'Multi-disciplinary',
    location: 'Varanasi, Uttar Pradesh',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    students: 28000,
    established: '1916',
    rating: 4.2,
    description: 'Historic university with comprehensive academic programs.',
    website: 'https://bhu.ac.in',
    email: 'info@bhu.ac.in',
    phone: '+91-542-230-7000',
    programs: ['Various UG/PG Programs', 'PhD', 'Professional Courses'],
    facilities: ['Large Campus', 'Multiple Libraries', 'Sports Complex', 'Medical College'],
  },
  {
    id: '28',
    name: 'Anna University',
    type: 'Engineering & Technology',
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    students: 200000,
    established: '1978',
    rating: 4.1,
    description: 'Major technical university in South India.',
    website: 'https://annauniv.edu',
    email: 'info@annauniv.edu',
    phone: '+91-44-2235-7000',
    programs: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
    facilities: ['Multiple Campuses', 'Research Centers', 'Libraries', 'Sports Facilities'],
  },
  // Private Universities
  {
    id: '29',
    name: 'Manipal Academy of Higher Education',
    type: 'Multi-disciplinary',
    location: 'Manipal, Karnataka',
    city: 'Manipal',
    state: 'Karnataka',
    students: 35000,
    established: '1953',
    rating: 4.2,
    description: 'Leading private university with global campuses.',
    website: 'https://manipal.edu',
    email: 'info@manipal.edu',
    phone: '+91-820-292-3000',
    programs: ['Medical', 'Engineering', 'Management', 'Arts & Sciences'],
    facilities: ['Multiple Campuses', 'Hospitals', 'Research Centers', 'Sports Complex'],
  },
  {
    id: '30',
    name: 'SRM Institute of Science and Technology',
    type: 'Engineering & Technology',
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    students: 45000,
    established: '1985',
    rating: 4.0,
    description: 'Large private university with diverse programs.',
    website: 'https://srmist.edu.in',
    email: 'info@srmist.edu.in',
    phone: '+91-44-4743-5000',
    programs: ['B.Tech', 'M.Tech', 'MBA', 'Medical Programs'],
    facilities: ['Modern Campus', 'Research Centers', 'Hostels', 'Sports Complex'],
  },
];

// Skeleton component for loading state - Enhanced Mobile Responsive
const InstitutionCardSkeleton = () => (
  <Card className="cursor-pointer h-fit">
    <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <Skeleton className="h-4 sm:h-6 w-3/4 mb-2" />
      <Skeleton className="h-3 sm:h-4 w-1/2" />
    </CardHeader>
    <CardContent className="pt-0 p-4 sm:p-6">
      <div className="space-y-1.5 sm:space-y-2">
        <Skeleton className="h-3 sm:h-4 w-full" />
        <Skeleton className="h-3 sm:h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-7 sm:h-9 w-full mt-3" />
    </CardContent>
  </Card>
);

type SortOption = 'name' | 'students' | 'established' | 'rating';
type SortDirection = 'asc' | 'desc';

const InstitutionSelection = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSelections, setRecentSelections] = useState<string[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Simulate API call
  useEffect(() => {
    const fetchInstitutions = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Load favorites and recent selections from localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('institution_favorites') || '[]');
      const savedRecent = JSON.parse(localStorage.getItem('recent_institutions') || '[]');

      setFavorites(savedFavorites);
      setRecentSelections(savedRecent);

      // Add favorites and recent view data to institutions
      const institutionsWithMeta = mockInstitutions.map((inst) => ({
        ...inst,
        isFavorite: savedFavorites.includes(inst.id),
        lastViewed: savedRecent.includes(inst.id) ? new Date() : undefined,
      }));

      setInstitutions(institutionsWithMeta);
      setIsLoading(false);
    };

    fetchInstitutions();
  }, []);

  // Filter and sort institutions
  const filteredAndSortedInstitutions = useMemo(() => {
    const filtered = institutions.filter((institution) => {
      const matchesSearch =
        institution.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        institution.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        institution.type.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesType = filterType === 'all' || institution.type === filterType;
      const matchesState = filterState === 'all' || institution.state === filterState;

      return matchesSearch && matchesType && matchesState;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'students':
          comparison = a.students - b.students;
          break;
        case 'established':
          comparison = parseInt(a.established) - parseInt(b.established);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [institutions, debouncedSearch, filterType, filterState, sortBy, sortDirection]);

  // Get unique types and states for filters
  const institutionTypes = useMemo(() => {
    return Array.from(new Set(institutions.map((inst) => inst.type)));
  }, [institutions]);

  const institutionStates = useMemo(() => {
    return Array.from(new Set(institutions.map((inst) => inst.state)));
  }, [institutions]);

  const handleInstitutionSelect = (institutionId: string) => {
    setSelectedInstitution(institutionId);

    // Add to recent selections
    const updatedRecent = [
      institutionId,
      ...recentSelections.filter((id) => id !== institutionId),
    ].slice(0, 5);
    setRecentSelections(updatedRecent);
    localStorage.setItem('recent_institutions', JSON.stringify(updatedRecent));
  };

  const toggleFavorite = (institutionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFavorites = favorites.includes(institutionId)
      ? favorites.filter((id) => id !== institutionId)
      : [...favorites, institutionId];

    setFavorites(updatedFavorites);
    localStorage.setItem('institution_favorites', JSON.stringify(updatedFavorites));

    // Update institutions state
    setInstitutions((prev) =>
      prev.map((inst) =>
        inst.id === institutionId ? { ...inst, isFavorite: !inst.isFavorite } : inst
      )
    );
  };

  const handleContinue = () => {
    if (selectedInstitution) {
      const selectedInst = institutions.find((inst) => inst.id === selectedInstitution);
      localStorage.setItem('selected_institution', JSON.stringify(selectedInst));
      navigate('/');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterState('all');
    setSortBy('name');
    setSortDirection('asc');
  };

  const toggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header - Improved Mobile Responsive */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            Select Your Institution
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-2 px-4 sm:px-0">
            Welcome {user?.name}! Choose your college or university to continue.
          </p>
          <Badge variant="secondary" className="mb-4 sm:mb-6">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Badge>
        </div>

        {/* Search and Filters - Enhanced Mobile Responsive */}
        <div className="bg-card rounded-xl p-3 sm:p-4 md:p-6 shadow-soft mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Bar - Better Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {/* Filters and Sorting - Enhanced Mobile Layout */}
          <div className="space-y-3 sm:space-y-4">
            {/* Filters Row - Improved Mobile Stacking */}
            <div className="space-y-3 sm:space-y-0">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Institution Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {institutionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="truncate">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {institutionStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        <span className="truncate">{state}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters Button - Better Mobile Placement */}
                {(searchTerm || filterType !== 'all' || filterState !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2 text-muted-foreground hover:text-foreground h-10 col-span-1 sm:col-span-2 lg:col-span-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="hidden sm:inline">Clear Filters</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Sort Row - Enhanced Mobile Layout */}
            <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3 sm:items-center pt-3 border-t">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className="gap-1 h-8 text-xs sm:text-sm"
                >
                  Name
                  {sortBy === 'name' &&
                    (sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </Button>
                <Button
                  variant={sortBy === 'students' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('students')}
                  className="gap-1 h-8 text-xs sm:text-sm"
                >
                  Students
                  {sortBy === 'students' &&
                    (sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </Button>
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('rating')}
                  className="gap-1 h-8 text-xs sm:text-sm"
                >
                  Rating
                  {sortBy === 'rating' &&
                    (sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </Button>
                <Button
                  variant={sortBy === 'established' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('established')}
                  className="gap-1 h-8 text-xs sm:text-sm"
                >
                  Year
                  {sortBy === 'established' &&
                    (sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info - Better Mobile Layout */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-1">
          <p className="text-sm sm:text-base text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading institutions...
              </span>
            ) : (
              <span>
                Showing{' '}
                <span className="font-semibold">{filteredAndSortedInstitutions.length}</span> of{' '}
                <span className="font-semibold">{institutions.length}</span> institutions
              </span>
            )}
          </p>
          {selectedInstitution && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary text-xs sm:text-sm px-2 py-1"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                {institutions.find((inst) => inst.id === selectedInstitution)?.name} selected
              </span>
            </Badge>
          )}
        </div>

        {/* Recent and Favorites - Enhanced Mobile Responsive */}
        {recentSelections.length > 0 && !searchTerm && (
          <div className="mb-4 sm:mb-6 px-1">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Recently Viewed
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSelections.slice(0, 3).map((instId) => {
                const inst = institutions.find((i) => i.id === instId);
                return inst ? (
                  <Button
                    key={instId}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInstitutionSelect(instId)}
                    className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <Eye className="h-3 w-3" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px] lg:max-w-none">
                      {inst.name}
                    </span>
                  </Button>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Enhanced Responsive Institution Grid - Fixed Column Breakpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-1">
          {isLoading ? (
            // Loading skeletons - responsive count based on screen size
            Array.from({ length: 8 }).map((_, index) => <InstitutionCardSkeleton key={index} />)
          ) : filteredAndSortedInstitutions.length > 0 ? (
            filteredAndSortedInstitutions.map((institution) => (
              <InstitutionCard
                key={institution.id}
                institution={institution}
                isSelected={selectedInstitution === institution.id}
                onSelect={() => handleInstitutionSelect(institution.id)}
                onToggleFavorite={(e) => toggleFavorite(institution.id, e)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12 px-4">
              <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No institutions found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Mobile-First Continue Button */}
        <div className="sticky bottom-0 sm:static bg-background/95 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-3 sm:p-0 rounded-t-xl sm:rounded-none border sm:border-none shadow-lg sm:shadow-none mb-4 sm:mb-0 -mx-4 sm:mx-0">
          <div className="text-center max-w-md mx-auto sm:max-w-none">
            <Button
              onClick={handleContinue}
              disabled={!selectedInstitution}
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold shadow-elegant"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {!selectedInstitution && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Please select an institution to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Institution Card Component
interface InstitutionCardProps {
  institution: Institution;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({
  institution,
  isSelected,
  onSelect,
  onToggleFavorite,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] ${
          isSelected ? 'ring-2 ring-primary shadow-elegant scale-[1.02]' : 'hover:shadow-medium'
        } ${institution.featured ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : ''} h-fit`}
        onClick={onSelect}
      >
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2 flex-shrink-0" />
            <div className="flex items-center gap-1 flex-shrink-0">
              {institution.lastViewed && (
                <Badge variant="outline" className="text-xs px-1 py-0.5 hidden sm:flex">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 sm:h-8 sm:w-8 hover:bg-muted"
                onClick={onToggleFavorite}
              >
                <Heart
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    institution.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                />
              </Button>
              {isSelected && (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              )}
            </div>
          </div>
          <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] leading-tight pr-2">
            {institution.name}
            {institution.featured && (
              <Badge variant="secondary" className="ml-2 text-xs py-0.5 px-1.5">
                <Star className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Featured</span>
                <span className="sm:hidden">⭐</span>
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs sm:text-sm">
            {institution.type}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 p-4 sm:p-6 space-y-2 sm:space-y-3">
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate text-xs sm:text-sm">{institution.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {institution.students > 1000
                  ? `${Math.round(institution.students / 1000)}k students`
                  : `${institution.students.toLocaleString()} students`}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs">Est. {institution.established}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">{institution.rating}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 sm:h-9 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Institution Details Modal - Enhanced Mobile Responsive */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-start sm:items-center gap-2 text-base sm:text-lg leading-tight">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="line-clamp-2 sm:line-clamp-1">{institution.name}</span>
              {institution.featured && (
                <Badge variant="secondary" className="text-xs ml-auto sm:ml-2 flex-shrink-0">
                  <Star className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Featured</span>
                  <span className="sm:hidden">⭐</span>
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">About</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {institution.description}
              </p>
            </div>

            {/* Stats - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">Location:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6 leading-relaxed">
                  {institution.location}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">Students:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {institution.students.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">Established:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{institution.established}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">Rating:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{institution.rating}/5.0</p>
              </div>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Programs Offered</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {institution.programs.map((program, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Facilities</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {institution.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {institution.website}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${institution.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {institution.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <a href={`tel:${institution.phone}`} className="text-primary hover:underline">
                    {institution.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  onSelect();
                  setShowDetails(false);
                }}
                className="flex-1 w-full sm:w-auto"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Select This Institution
              </Button>
              <Button
                variant="outline"
                onClick={onToggleFavorite}
                className="gap-2 w-full sm:w-auto"
                size="sm"
              >
                <Heart
                  className={`h-4 w-4 ${
                    institution.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
                <span className="text-sm">
                  {institution.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstitutionSelection;
