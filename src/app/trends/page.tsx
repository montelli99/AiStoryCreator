'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Hash,
  Music,
  Eye,
  Play,
  Clock,
  RefreshCw,
  Filter,
  BarChart3
} from 'lucide-react';

interface Trend {
  id: string;
  type: 'hashtag' | 'sound' | 'visual' | 'pacing';
  title: string;
  description: string;
  popularity: number;
  metadata: any;
  source: string;
  isActive: boolean;
  discoveredAt: string;
  expiresAt: string;
}

export default function TrendsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchTrends();
    }
  }, [status, router]);

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends/tiktok');
      const data = await response.json();
      setTrends(data.trends || []);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hashtag': return <Hash className="w-4 h-4" />;
      case 'sound': return <Music className="w-4 h-4" />;
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'pacing': return <Play className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hashtag': return 'bg-blue-100 text-blue-800';
      case 'sound': return 'bg-green-100 text-green-800';
      case 'visual': return 'bg-purple-100 text-purple-800';
      case 'pacing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrends = activeTab === 'all' ? trends : trends.filter(trend => trend.type === activeTab);

  const getExpirationDays = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trends</h1>
            <p className="text-muted-foreground">
              Monitor trending topics, sounds, and visual styles for content creation
            </p>
          </div>
          <Button variant="outline" onClick={fetchTrends} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trends</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trends.length}</div>
              <p className="text-xs text-muted-foreground">Active trends</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Popularity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trends.length > 0 ? Math.round(trends.reduce((sum, trend) => sum + trend.popularity, 0) / trends.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trends.filter(trend => {
                  const days = getExpirationDays(trend.expiresAt);
                  return days <= 7;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">In 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trends.filter(trend => {
                  const discovered = new Date(trend.discoveredAt);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return discovered > weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Trends</p>
            </CardContent>
          </Card>
        </div>

        {/* Trends List */}
        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>
              Current trending content on TikTok with performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Trends</TabsTrigger>
                <TabsTrigger value="hashtag">Hashtags</TabsTrigger>
                <TabsTrigger value="sound">Sounds</TabsTrigger>
                <TabsTrigger value="visual">Visuals</TabsTrigger>
                <TabsTrigger value="pacing">Pacing</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTrends.map((trend) => (
                    <div key={trend.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getTypeColor(trend.type)}`}>
                            {getTypeIcon(trend.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{trend.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {trend.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize">
                                {trend.type}
                              </Badge>
                              <Badge variant="secondary">
                                {trend.source}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{trend.popularity.toFixed(1)}</div>
                          <p className="text-xs text-muted-foreground">popularity</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Expires in {getExpirationDays(trend.expiresAt)} days</span>
                          <Progress value={Math.max(0, 100 - (getExpirationDays(trend.expiresAt) / 30) * 100)} className="w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {['hashtag', 'sound', 'visual', 'pacing'].map((type) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {trends.filter(trend => trend.type === type).map((trend) => (
                      <div key={trend.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getTypeColor(trend.type)}`}>
                              {getTypeIcon(trend.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{trend.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {trend.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">
                                  {trend.type}
                                </Badge>
                                <Badge variant="secondary">
                                  {trend.source}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{trend.popularity.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">popularity</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground">
                            {trend.metadata && Object.keys(trend.metadata).length > 0 && (
                              <div className="space-y-1">
                                {Object.entries(trend.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Expires in {getExpirationDays(trend.expiresAt)} days</span>
                            <Progress value={Math.max(0, 100 - (getExpirationDays(trend.expiresAt) / 30) * 100)} className="w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}