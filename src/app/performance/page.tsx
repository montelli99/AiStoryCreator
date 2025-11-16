'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  Globe,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  activeConnections: number;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cacheHitRate: number;
  queueLength: number;
  processingTime: number;
}

interface ContentMetrics {
  totalContent: number;
  dailyGrowth: number;
  avgEngagement: number;
  topPerforming: {
    character: string;
    performance: number;
    content: number;
  }[];
  recentPerformance: {
    date: string;
    views: number;
    engagement: number;
  }[];
}

export default function PerformanceMonitoring() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: 0,
    activeConnections: 0
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    cacheHitRate: 0,
    queueLength: 0,
    processingTime: 0
  });

  const [contentMetrics, setContentMetrics] = useState<ContentMetrics>({
    totalContent: 0,
    dailyGrowth: 0,
    avgEngagement: 0,
    topPerforming: [],
    recentPerformance: []
  });

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'High CPU usage detected',
      time: '2 minutes ago',
      icon: AlertTriangle
    },
    {
      id: '2',
      type: 'info',
      message: 'AI Director analysis completed',
      time: '15 minutes ago',
      icon: CheckCircle
    }
  ]);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 50) + 10
      }));

      setPerformanceMetrics(prev => ({
        ...prev,
        responseTime: Math.random() * 200 + 50,
        throughput: Math.random() * 1000 + 500,
        errorRate: Math.random() * 5,
        cacheHitRate: Math.random() * 30 + 70,
        queueLength: Math.floor(Math.random() * 20),
        processingTime: Math.random() * 5000 + 1000
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch content metrics
    const fetchContentMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/summary');
        const data = await response.json();
        
        setContentMetrics({
          totalContent: data.totalContent || 156,
          dailyGrowth: data.dailyGrowth || 12,
          avgEngagement: data.avgEngagement || 8.5,
          topPerforming: [
            { character: 'ID_01_A', performance: 92, content: 24 },
            { character: 'ID_03_B', performance: 88, content: 18 },
            { character: 'ID_05_C', performance: 85, content: 22 }
          ],
          recentPerformance: [
            { date: 'Mon', views: 12500, engagement: 8.2 },
            { date: 'Tue', views: 15200, engagement: 9.1 },
            { date: 'Wed', views: 18900, engagement: 8.8 },
            { date: 'Thu', views: 22100, engagement: 9.5 },
            { date: 'Fri', views: 25800, engagement: 8.9 },
            { date: 'Sat', views: 31200, engagement: 9.2 },
            { date: 'Sun', views: 28900, engagement: 8.7 }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch content metrics:', error);
      }
    };

    fetchContentMetrics();
    const interval = setInterval(fetchContentMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Performance Monitoring</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Real-time system and content performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              Live Monitoring
            </Badge>
            <Badge variant="secondary">Last updated: {new Date().toLocaleTimeString()}</Badge>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <alert.icon className="w-4 h-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                    <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className={`text-lg sm:text-2xl font-bold ${getStatusColor(systemMetrics.cpu, { good: 50, warning: 80 })}`}>
                {Math.round(systemMetrics.cpu)}%
              </div>
              <Progress value={systemMetrics.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Memory</CardTitle>
              <Database className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className={`text-lg sm:text-2xl font-bold ${getStatusColor(systemMetrics.memory, { good: 60, warning: 85 })}`}>
                {Math.round(systemMetrics.memory)}%
              </div>
              <Progress value={systemMetrics.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className={`text-lg sm:text-2xl font-bold ${getStatusColor(performanceMetrics.responseTime, { good: 100, warning: 200 })}`}>
                {Math.round(performanceMetrics.responseTime)}ms
              </div>
              <p className="text-xs text-muted-foreground">Avg response</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Throughput</CardTitle>
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg sm:text-2xl font-bold text-green-500">
                {Math.round(performanceMetrics.throughput)}
              </div>
              <p className="text-xs text-muted-foreground">Req/sec</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className={`text-lg sm:text-2xl font-bold ${getStatusColor(performanceMetrics.errorRate, { good: 1, warning: 3 })}`}>
                {performanceMetrics.errorRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Last hour</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Queue Length</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-lg sm:text-2xl font-bold">
                {performanceMetrics.queueLength}
              </div>
              <p className="text-xs text-muted-foreground">Jobs pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Performance Tabs */}
        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="w-full flex flex-wrap h-auto p-1">
            <TabsTrigger value="system" className="flex-1 min-w-[100px] text-xs">System</TabsTrigger>
            <TabsTrigger value="content" className="flex-1 min-w-[100px] text-xs">Content</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 min-w-[100px] text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="alerts" className="flex-1 min-w-[100px] text-xs">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">System Resources</CardTitle>
                  <CardDescription className="text-sm">
                    Real-time system resource utilization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{Math.round(systemMetrics.cpu)}%</span>
                    </div>
                    <Progress value={systemMetrics.cpu} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{Math.round(systemMetrics.memory)}%</span>
                    </div>
                    <Progress value={systemMetrics.memory} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span>{Math.round(systemMetrics.disk)}%</span>
                    </div>
                    <Progress value={systemMetrics.disk} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span>{Math.round(systemMetrics.network)}%</span>
                    </div>
                    <Progress value={systemMetrics.network} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Performance Metrics</CardTitle>
                  <CardDescription className="text-sm">
                    Application performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(performanceMetrics.responseTime)}ms</div>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(performanceMetrics.throughput)}</div>
                      <p className="text-xs text-muted-foreground">Requests/sec</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{performanceMetrics.cacheHitRate.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(performanceMetrics.processingTime / 1000)}s</div>
                      <p className="text-xs text-muted-foreground">Processing Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Content Performance</CardTitle>
                  <CardDescription className="text-sm">
                    Content generation and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{contentMetrics.totalContent}</div>
                      <p className="text-xs text-muted-foreground">Total Content</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">+{contentMetrics.dailyGrowth}</div>
                      <p className="text-xs text-muted-foreground">Daily Growth</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{contentMetrics.avgEngagement}%</div>
                      <p className="text-xs text-muted-foreground">Avg Engagement</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{systemMetrics.activeConnections}</div>
                      <p className="text-xs text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Top Performing Characters</CardTitle>
                  <CardDescription className="text-sm">
                    Characters with highest engagement rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contentMetrics.topPerforming.map((character, index) => (
                      <div key={character.character} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{character.character}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{character.content} content</span>
                          <Badge variant="secondary" className="text-xs">
                            {character.performance}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Weekly Performance</CardTitle>
                <CardDescription className="text-sm">
                  Content views and engagement trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentMetrics.recentPerformance.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{day.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-500" />
                          <span className="text-sm">{day.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-sm">{day.engagement}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">System Alerts</CardTitle>
                <CardDescription className="text-sm">
                  Recent system notifications and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <alert.icon className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                      <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}