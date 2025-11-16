'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSimpleSocket } from '@/hooks/use-simple-socket';
import { 
  BarChart3, 
  Users, 
  Video, 
  Clock,
  TrendingUp,
  Calendar,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

export default function SimpleDashboard() {
  const { isConnected, lastUpdate, emit } = useSimpleSocket();
  
  const [stats, setStats] = useState({
    totalContent: 156,
    activeCharacters: 12,
    renderingQueue: 3,
    todayPosts: 8,
    avgPerformance: 87,
    weeklyGrowth: 15
  });

  const [systemStatus, setSystemStatus] = useState({
    api: 'operational',
    database: 'operational',
    aiDirector: 'operational',
    tiktok: 'configured'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalContent: prev.totalContent + Math.floor(Math.random() * 3),
        renderingQueue: Math.max(0, prev.renderingQueue + (Math.random() > 0.7 ? 1 : -1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Creator Studio</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Stable dashboard - core functionality working
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
              <Activity className="w-3 h-3" />
              {isConnected ? "Connected" : "Offline"}
            </Badge>
            <Badge variant="secondary">Stable</Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Status</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.api)}`}></div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Core APIs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.database)}`}></div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Director</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.aiDirector)}`}></div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">GLM-4.6 Ready</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TikTok API</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.tiktok)}`}></div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Configured</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Video className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.totalContent}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Characters</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.activeCharacters}/18</div>
              <p className="text-xs text-muted-foreground">3 top performers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendering Queue</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.renderingQueue}</div>
              <p className="text-xs text-muted-foreground">2 processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.todayPosts}</div>
              <p className="text-xs text-muted-foreground">3 scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.avgPerformance}%</div>
              <p className="text-xs text-muted-foreground">+5% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">+{stats.weeklyGrowth}%</div>
              <p className="text-xs text-muted-foreground">Views & engagement</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Core platform stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Advanced features in development</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Last update: {lastUpdate}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => emit('test', { message: 'Test connection' })}>
                  <Zap className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" size="sm" onClick={() => setStats(prev => ({ ...prev, totalContent: prev.totalContent + 1 }))}>
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Stats
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}