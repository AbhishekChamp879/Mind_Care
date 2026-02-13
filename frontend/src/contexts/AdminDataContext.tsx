// Real-time admin dashboard data context with anonymous student protection
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types for anonymous, stigma-free admin dashboard
export interface AnonymousStudentData {
  id: string; // Anonymous ID like "ANON-STU-2024-001"
  anonymousHandle: string; // Display name like "Student-Alpha", "Student-Beta"
  institution: string;
  joinDate: string;
  lastActive: string;
  status: 'online' | 'offline' | 'away';
  mentalHealthScore: number; // 1-100 (anonymous scoring)
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  sessionCount: number;
  chatCount: number;
  resourcesAccessed: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  academicYear: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
  department?: string; // General category only
  location?: {
    region: string; // General region, not specific location
    timezone: string;
  };
  // Privacy-safe metadata
  engagementLevel: 'low' | 'medium' | 'high';
  preferredCommunication: 'chat' | 'video' | 'audio';
  riskFactors?: string[]; // Anonymous risk indicators
}

export interface AnonymousLiveSession {
  id: string;
  studentAnonymousId: string;
  counselorId: string;
  type: 'video' | 'audio' | 'chat';
  status: 'active' | 'scheduled' | 'completed';
  startTime: string;
  duration?: number;
  priority: 'normal' | 'high' | 'crisis';
  sessionNotes?: string; // Anonymous session notes
  satisfaction?: number; // 1-5 rating
}

export interface AnonymousCrisisAlert {
  id: string;
  studentAnonymousId: string;
  severity: 'high' | 'crisis';
  type: 'self_harm' | 'suicidal' | 'panic' | 'substance_abuse' | 'academic_stress';
  timestamp: string;
  triggerContent: string; // Content that triggered alert (anonymized)
  status: 'active' | 'addressed' | 'monitoring';
  assignedCounselorId?: string;
  interventionType?: 'chat_support' | 'video_session' | 'emergency_contact' | 'resources_provided';
  resolution?: string;
  followUpRequired: boolean;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  activeSessions: number;
  totalCrisisAlerts: number;
  resolvedAlerts: number;
  systemUptime: number;
  averageResponseTime: number;
  serverLoad: number;
  satisfactionScore: number;
}

export interface ActivityLog {
  id: string;
  type:
    | 'login'
    | 'session_start'
    | 'crisis_alert'
    | 'system_update'
    | 'user_registration'
    | 'risk_update';
  description: string;
  timestamp: string;
  userId?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  details?: Record<string, unknown>;
}

interface AdminDataContextType {
  // Anonymous Data
  students: AnonymousStudentData[];
  liveSessions: AnonymousLiveSession[];
  crisisAlerts: AnonymousCrisisAlert[];
  platformMetrics: PlatformMetrics;
  activityLogs: ActivityLog[];

  // Real-time status
  isConnected: boolean;
  lastUpdate: string;

  // Privacy-Safe Actions
  refreshData: () => void;
  handleCrisisAlert: (
    alertId: string,
    action: 'acknowledge' | 'assign' | 'resolve',
    data?: Record<string, unknown>
  ) => void;
  updateStudentRiskLevel: (
    studentAnonymousId: string,
    riskLevel: AnonymousStudentData['riskLevel']
  ) => void;
  exportData: (type: 'anonymous_students' | 'sessions' | 'metrics' | 'all') => void;

  // Anonymous Filters and search
  filterStudents: (filters: {
    riskLevel?: AnonymousStudentData['riskLevel'];
    status?: AnonymousStudentData['status'];
    institution?: string;
    department?: string;
    academicYear?: AnonymousStudentData['academicYear'];
    engagementLevel?: AnonymousStudentData['engagementLevel'];
    searchTerm?: string;
  }) => AnonymousStudentData[];

  // Anonymous Analytics
  getStudentAnalytics: () => {
    totalStudents: number;
    activeToday: number;
    riskDistribution: Record<AnonymousStudentData['riskLevel'], number>;
    institutionBreakdown: Record<string, number>;
    moodTrendAnalysis: Record<AnonymousStudentData['moodTrend'], number>;
    engagementDistribution: Record<AnonymousStudentData['engagementLevel'], number>;
    academicYearDistribution: Record<AnonymousStudentData['academicYear'], number>;
    regionDistribution: Record<string, number>;
  };
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

// Generate anonymous mock student data (privacy-protected)
const generateAnonymousStudents = (): AnonymousStudentData[] => {
  const institutions = [
    'Harvard University',
    'MIT',
    'Stanford University',
    'UCLA',
    'NYU',
    'University of Toronto',
    'Oxford University',
  ];
  const regions = ['Northeast', 'West Coast', 'Midwest', 'Southeast', 'Southwest', 'International'];
  const departments = [
    'Computer Science',
    'Psychology',
    'Engineering',
    'Business',
    'Medicine',
    'Arts',
    'Biology',
  ];

  // Generate anonymous animal-based handles for stigma-free identification
  const animalNames = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Pi',
    'Rho',
    'Sigma',
    'Tau',
    'Phi',
    'Chi',
  ];

  return animalNames.map((handle, index) => ({
    id: `ANON-STU-2024-${String(index + 1).padStart(3, '0')}`,
    anonymousHandle: `Student-${handle}`,
    institution: institutions[Math.floor(Math.random() * institutions.length)],
    joinDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ).toISOString(),
    lastActive: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
    mentalHealthScore: Math.floor(Math.random() * 40 + 40), // 40-80 range
    riskLevel:
      Math.random() > 0.9
        ? 'crisis'
        : Math.random() > 0.8
          ? 'high'
          : Math.random() > 0.6
            ? 'medium'
            : 'low',
    sessionCount: Math.floor(Math.random() * 20),
    chatCount: Math.floor(Math.random() * 50),
    resourcesAccessed: Math.floor(Math.random() * 30),
    moodTrend: Math.random() > 0.6 ? 'stable' : Math.random() > 0.3 ? 'improving' : 'declining',
    academicYear: ['freshman', 'sophomore', 'junior', 'senior', 'graduate'][
      Math.floor(Math.random() * 5)
    ] as any,
    department: departments[Math.floor(Math.random() * departments.length)],
    location: {
      region: regions[Math.floor(Math.random() * regions.length)],
      timezone: 'UTC' + (Math.floor(Math.random() * 24) - 12),
    },
    engagementLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    preferredCommunication: ['chat', 'video', 'audio'][Math.floor(Math.random() * 3)] as any,
    riskFactors: Math.random() > 0.7 ? ['academic_pressure', 'social_anxiety'] : undefined,
  }));
};

const generateAnonymousSessions = (students: AnonymousStudentData[]): AnonymousLiveSession[] => {
  return Array.from({ length: 12 }, (_, index) => ({
    id: `SESS-${String(index + 1).padStart(3, '0')}`,
    studentAnonymousId: students[Math.floor(Math.random() * students.length)].id,
    counselorId: `COUN-${Math.floor(Math.random() * 8) + 1}`,
    type: Math.random() > 0.7 ? 'video' : Math.random() > 0.5 ? 'audio' : 'chat',
    status: Math.random() > 0.6 ? 'active' : Math.random() > 0.3 ? 'scheduled' : 'completed',
    startTime: new Date(Date.now() + Math.random() * 86400000).toISOString(),
    duration: Math.random() > 0.5 ? Math.floor(Math.random() * 60 + 30) : undefined,
    priority: Math.random() > 0.9 ? 'crisis' : Math.random() > 0.8 ? 'high' : 'normal',
    sessionNotes: 'Anonymous session completed - privacy protected',
    satisfaction: Math.floor(Math.random() * 3 + 3), // 3-5 rating
  }));
};

const generateAnonymousAlerts = (students: AnonymousStudentData[]): AnonymousCrisisAlert[] => {
  const alertTypes = [
    'self_harm',
    'suicidal',
    'panic',
    'substance_abuse',
    'academic_stress',
  ] as const;
  const interventionTypes = [
    'chat_support',
    'video_session',
    'emergency_contact',
    'resources_provided',
  ] as const;
  const highRiskStudents = students.filter(
    (s) => s.riskLevel === 'high' || s.riskLevel === 'crisis'
  );

  return highRiskStudents.slice(0, 5).map((student, index) => ({
    id: `ALERT-${String(index + 1).padStart(3, '0')}`,
    studentAnonymousId: student.id,
    severity: student.riskLevel as 'high' | 'crisis',
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    triggerContent: 'Anonymous content analysis detected concerning patterns - privacy protected',
    status: Math.random() > 0.5 ? 'active' : Math.random() > 0.3 ? 'addressed' : 'monitoring',
    assignedCounselorId: `COUN-${Math.floor(Math.random() * 8) + 1}`,
    interventionType: interventionTypes[Math.floor(Math.random() * interventionTypes.length)],
    resolution: Math.random() > 0.5 ? 'Anonymous intervention completed successfully' : undefined,
    followUpRequired: Math.random() > 0.6,
  }));
};

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<AnonymousStudentData[]>([]);
  const [liveSessions, setLiveSessions] = useState<AnonymousLiveSession[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<AnonymousCrisisAlert[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());

  // Initialize anonymous data
  useEffect(() => {
    const initialStudents = generateAnonymousStudents();
    setStudents(initialStudents);
    setLiveSessions(generateAnonymousSessions(initialStudents));
    setCrisisAlerts(generateAnonymousAlerts(initialStudents));

    // Initial activity logs (privacy-safe)
    setActivityLogs([
      {
        id: 'log_1',
        type: 'crisis_alert',
        description: 'High-severity crisis alert triggered for anonymous student',
        timestamp: new Date().toISOString(),
        severity: 'error',
      },
      {
        id: 'log_2',
        type: 'session_start',
        description: 'Anonymous counseling session initiated',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        severity: 'info',
      },
      {
        id: 'log_3',
        type: 'user_registration',
        description: 'New anonymous student registered to platform',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        severity: 'success',
      },
      {
        id: 'log_4',
        type: 'system_update',
        description: 'Privacy protection systems updated successfully',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        severity: 'success',
      },
    ]);
  }, []);

  // Real-time data updates (anonymous)
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({
          ...student,
          status:
            Math.random() > 0.9
              ? student.status === 'online'
                ? 'away'
                : 'online'
              : student.status,
          lastActive: Math.random() > 0.95 ? 'Just now' : student.lastActive,
        }))
      );
      setLastUpdate(new Date().toISOString());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => {
    setIsConnected(false);
    setTimeout(() => {
      const newStudents = generateAnonymousStudents();
      setStudents(newStudents);
      setLiveSessions(generateAnonymousSessions(newStudents));
      setCrisisAlerts(generateAnonymousAlerts(newStudents));
      setLastUpdate(new Date().toISOString());
      setIsConnected(true);
    }, 1000);
  }, []);

  const handleCrisisAlert = useCallback(
    (alertId: string, action: 'acknowledge' | 'assign' | 'resolve', data?: Record<string, unknown>) => {
      setCrisisAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: action === 'resolve' ? 'addressed' as const : 'monitoring' as const,
                assignedCounselorId:
                  action === 'assign' ? (data?.counselorId as string) : alert.assignedCounselorId,
                resolution: (data?.response as string) || alert.resolution,
              }
            : alert
        )
      );

      // Add activity log (anonymous)
      setActivityLogs((prev) => [
        {
          id: `crisis_${Date.now()}`,
          type: 'crisis_alert',
          description: `Crisis alert ${alertId} ${action === 'resolve' ? 'resolved' : 'updated'} - anonymous intervention`,
          timestamp: new Date().toISOString(),
          severity: action === 'resolve' ? 'success' : 'warning',
        },
        ...prev.slice(0, 49),
      ]);
    },
    []
  );

  const updateStudentRiskLevel = useCallback(
    (studentAnonymousId: string, riskLevel: AnonymousStudentData['riskLevel']) => {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentAnonymousId ? { ...student, riskLevel } : student
        )
      );

      // Add activity log (anonymous)
      const anonymousHandle = students.find((s) => s.id === studentAnonymousId)?.anonymousHandle;
      setActivityLogs((prev) => [
        {
          id: `risk_${Date.now()}`,
          type: 'risk_update',
          description: `Risk level updated for ${anonymousHandle} to ${riskLevel} - privacy protected`,
          timestamp: new Date().toISOString(),
          severity: riskLevel === 'crisis' ? 'error' : 'warning',
        },
        ...prev.slice(0, 49),
      ]);
    },
    [students]
  );

  const exportData = useCallback(
    (type: 'anonymous_students' | 'sessions' | 'metrics' | 'all') => {
      const data = {
        students: type === 'anonymous_students' || type === 'all' ? students : undefined,
        sessions: type === 'sessions' || type === 'all' ? liveSessions : undefined,
        metrics: type === 'metrics' || type === 'all' ? platformMetrics : undefined,
        exportNote: 'All student data is anonymized for privacy protection',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindbuddy_anonymous_${type}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [students, liveSessions]
  );

  const filterStudents = useCallback(
    (filters: {
      riskLevel?: AnonymousStudentData['riskLevel'];
      status?: AnonymousStudentData['status'];
      institution?: string;
      department?: string;
      academicYear?: AnonymousStudentData['academicYear'];
      engagementLevel?: AnonymousStudentData['engagementLevel'];
      searchTerm?: string;
    }) => {
      return students.filter((student) => {
        if (filters.riskLevel && student.riskLevel !== filters.riskLevel) return false;
        if (filters.status && student.status !== filters.status) return false;
        if (filters.institution && student.institution !== filters.institution) return false;
        if (filters.department && student.department !== filters.department) return false;
        if (filters.academicYear && student.academicYear !== filters.academicYear) return false;
        if (filters.engagementLevel && student.engagementLevel !== filters.engagementLevel)
          return false;
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          return (
            student.anonymousHandle.toLowerCase().includes(term) ||
            student.institution.toLowerCase().includes(term) ||
            (student.department && student.department.toLowerCase().includes(term))
          );
        }
        return true;
      });
    },
    [students]
  );

  const getStudentAnalytics = useCallback(() => {
    const riskDistribution = students.reduce(
      (acc, student) => {
        acc[student.riskLevel] = (acc[student.riskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<AnonymousStudentData['riskLevel'], number>
    );

    const institutionBreakdown = students.reduce(
      (acc, student) => {
        acc[student.institution] = (acc[student.institution] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const moodTrendAnalysis = students.reduce(
      (acc, student) => {
        acc[student.moodTrend] = (acc[student.moodTrend] || 0) + 1;
        return acc;
      },
      {} as Record<AnonymousStudentData['moodTrend'], number>
    );

    const engagementDistribution = students.reduce(
      (acc, student) => {
        acc[student.engagementLevel] = (acc[student.engagementLevel] || 0) + 1;
        return acc;
      },
      {} as Record<AnonymousStudentData['engagementLevel'], number>
    );

    const academicYearDistribution = students.reduce(
      (acc, student) => {
        acc[student.academicYear] = (acc[student.academicYear] || 0) + 1;
        return acc;
      },
      {} as Record<AnonymousStudentData['academicYear'], number>
    );

    const regionDistribution = students.reduce(
      (acc, student) => {
        if (student.location?.region) {
          acc[student.location.region] = (acc[student.location.region] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalStudents: students.length,
      activeToday: students.filter((s) => s.status === 'online').length,
      riskDistribution,
      institutionBreakdown,
      moodTrendAnalysis,
      engagementDistribution,
      academicYearDistribution,
      regionDistribution,
    };
  }, [students]);

  // Real-time platform metrics calculation
  const platformMetrics: PlatformMetrics = {
    totalUsers: students.length,
    activeUsers: students.filter((s) => s.status === 'online').length,
    totalSessions: liveSessions.length,
    activeSessions: liveSessions.filter((s) => s.status === 'active').length,
    totalCrisisAlerts: crisisAlerts.length,
    resolvedAlerts: crisisAlerts.filter((a) => a.status === 'addressed').length,
    systemUptime: 99.8,
    averageResponseTime: 145,
    serverLoad: 68,
    satisfactionScore: 4.2,
  };

  return (
    <AdminDataContext.Provider
      value={{
        students,
        liveSessions,
        crisisAlerts,
        platformMetrics,
        activityLogs,
        isConnected,
        lastUpdate,
        refreshData,
        handleCrisisAlert,
        updateStudentRiskLevel,
        exportData,
        filterStudents,
        getStudentAnalytics,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
