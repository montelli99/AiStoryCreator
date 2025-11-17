"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface QueueStats {
  total: number;
  queued: number;
  processing: number;
  complete: number;
  failed: number;
}

export default function RenderQueueMonitor() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/video/render-queue").then((r) => r.json());
        if (res.success) {
          setStats(res.stats);
          setJobs(res.jobs);
        }
      } catch (err) {
        console.error("Queue fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading queue...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">{stats?.queued || 0}</div>
            <div className="text-xs text-muted-foreground">Queued</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/20 border-yellow-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">{stats?.processing || 0}</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">{stats?.complete || 0}</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </CardContent>
        </Card>
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-400">{stats?.failed || 0}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {jobs.slice(0, 10).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="text-sm">
                  <div className="font-mono text-xs">{job.id}</div>
                  <div className="text-xs text-muted-foreground">{job.projectId}</div>
                </div>
                <Badge
                  variant={
                    job.status === "complete"
                      ? "default"
                      : job.status === "processing"
                      ? "secondary"
                      : job.status === "failed"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

