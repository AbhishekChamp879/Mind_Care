import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FaChartLine as Activity,
  FaServer as Server,
  FaDatabase as Database,
  FaWifi as Wifi,
  FaShieldAlt as Shield,
  FaExclamationTriangle as AlertTriangle,
  FaCheckCircle as CheckCircle,
  FaClock as Clock,
  FaMicrochip as Cpu,
  FaHdd as HardDrive,
  FaMemory as MemoryStick,
  FaGlobe as Globe,
  FaSync as RefreshCw,
  FaDownload as Download,
} from 'react-icons/fa';

const SystemHealth = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const serverMetrics = [
    { name: 'CPU Usage', value: 23, status: 'healthy', icon: Cpu },
    { name: 'Memory Usage', value: 67, status: 'warning', icon: MemoryStick },
    { name: 'Disk Usage', value: 45, status: 'healthy', icon: HardDrive },
    { name: 'Network I/O', value: 89, status: 'critical', icon: Wifi },
  ];

  const systemStatus = [
    { service: 'Web Server', status: 'online', uptime: '99.98%', responseTime: '45ms' },
    { service: 'Database', status: 'online', uptime: '99.95%', responseTime: '12ms' },
    { service: 'AI Chat Service', status: 'online', uptime: '99.92%', responseTime: '156ms' },
    {
      service: 'Video Call Service',
      status: 'maintenance',
      uptime: '99.87%',
      responseTime: '89ms',
    },
    { service: 'Email Service', status: 'online', uptime: '100%', responseTime: '234ms' },
    { service: 'File Storage', status: 'online', uptime: '99.99%', responseTime: '67ms' },
  ];

  const securityEvents = [
    {
      timestamp: '2024-01-15 14:23:12',
      type: 'Authentication',
      severity: 'low',
      description: 'Failed login attempt from suspicious IP',
    },
    {
      timestamp: '2024-01-15 13:45:33',
      type: 'Access Control',
      severity: 'medium',
      description: 'Privilege escalation attempt detected',
    },
    {
      timestamp: '2024-01-15 12:12:45',
      type: 'Data Protection',
      severity: 'low',
      description: 'HIPAA compliance check completed',
    },
    {
      timestamp: '2024-01-15 11:30:21',
      type: 'Network Security',
      severity: 'high',
      description: 'DDoS attack mitigated successfully',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-severity-low';
      case 'maintenance':
        return 'bg-severity-medium';
      case 'offline':
        return 'bg-severity-high';
      default:
        return 'bg-muted';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-severity-low';
      case 'warning':
        return 'bg-severity-medium';
      case 'critical':
        return 'bg-severity-high';
      default:
        return 'bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-severity-low';
      case 'medium':
        return 'bg-severity-medium';
      case 'high':
        return 'bg-severity-high';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            System Health Monitor
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time platform performance and security monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
            <span className={isRefreshing ? 'animate-spin' : ''}>
              <RefreshCw size={16} />
            </span>
            Refresh
          </Button>
          <Button variant="hero" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-calm border-0 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Activity size={24} />
              <Badge className="bg-white/20 text-white">Live</Badge>
            </div>
            <CardTitle className="text-2xl">System Status</CardTitle>
            <CardDescription className="text-white/80">Overall Health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98.5%</div>
            <p className="text-sm text-white/80">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Globe size={24} />
              <CheckCircle size={20} />
            </div>
            <CardTitle>Uptime</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-severity-low">99.97%</div>
            <p className="text-sm text-muted-foreground">23h 45m downtime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Shield size={24} />
              <AlertTriangle size={20} />
            </div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Active threats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-severity-medium">3</div>
            <p className="text-sm text-muted-foreground">2 medium, 1 high</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Clock size={24} />
              <Badge variant="secondary">Avg</Badge>
            </div>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>API latency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89ms</div>
            <p className="text-sm text-muted-foreground">-12ms from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serverMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent size={20} />
                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                      </div>
                      <Badge className={`text-white ${getMetricColor(metric.status)}`}>
                        {metric.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage</span>
                        <span className="font-medium">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server size={20} />
                <span>Service Status</span>
              </CardTitle>
              <CardDescription>Current status of all platform services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}
                      ></div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">
                          Uptime: {service.uptime} • Response: {service.responseTime}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize text-white ${getStatusColor(service.status)}`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield size={20} />
                <span>Security Events</span>
              </CardTitle>
              <CardDescription>Recent security incidents and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(event.severity)}`}
                      ></div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{event.type}</p>
                          <Badge
                            variant="secondary"
                            className={`text-xs text-white ${getSeverityColor(event.severity)}`}
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database size={20} />
                <span>System Logs</span>
              </CardTitle>
              <CardDescription>Recent system events and error logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background border rounded-lg p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                <div className="text-severity-low">
                  [2024-01-15 14:23:15] INFO: System health check completed successfully
                </div>
                <div className="text-muted-foreground">
                  [2024-01-15 14:22:45] DEBUG: Database connection pool optimized
                </div>
                <div className="text-severity-medium">
                  [2024-01-15 14:21:33] WARN: High memory usage detected on server-02
                </div>
                <div className="text-muted-foreground">
                  [2024-01-15 14:20:12] INFO: Backup process initiated
                </div>
                <div className="text-severity-high">
                  [2024-01-15 14:19:45] ERROR: Failed to connect to external API endpoint
                </div>
                <div className="text-muted-foreground">
                  [2024-01-15 14:18:23] INFO: User session cleanup completed
                </div>
                <div className="text-severity-low">
                  [2024-01-15 14:17:56] INFO: Security scan completed - no threats detected
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;
