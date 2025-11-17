"use client";

import { useEffect, useState } from "react";
import { ViralSection } from "@/components/viral/ViralSection";
import { ViralStatCard } from "@/components/viral/ViralStatCard";
import { ViralGrid } from "@/components/viral/ViralGrid";
import ScriptAnalyzer from "@/components/viral/ScriptAnalyzer";
import HashtagEngineUI from "@/components/viral/HashtagEngineUI";
import DescriptionEngineUI from "@/components/viral/DescriptionEngineUI";
import VariantSelector from "@/components/viral/VariantSelector";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViralDashboard() {
  const [performance, setPerformance] = useState([]);
  const [tiktokStats, setTiktokStats] = useState([]);
  const [splitTests, setSplitTests] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    try {
      const [perf, stats, tests, queue] = await Promise.all([
        fetch("/api/viral/performance").then((r) => r.json()),
        fetch("/api/tiktok/logs").then((r) => r.json()),
        fetch("/api/viral/split-test").then((r) => r.json()),
        fetch("/api/tiktok/queue/run", { method: "POST" }).then((r) => r.json()),
      ]);

      setPerformance(perf.data || []);
      setTiktokStats(stats.logs || []);
      setSplitTests(tests.data || []);
      setUploadQueue(queue.queue || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalViews = tiktokStats.reduce((sum, x) => sum + (x.views || 0), 0);
  const totalLikes = tiktokStats.reduce((sum, x) => sum + (x.likes || 0), 0);
  const totalComments = tiktokStats.reduce((sum, x) => sum + (x.comments || 0), 0);
  const avgEngagement = tiktokStats.length > 0
    ? ((totalLikes + totalComments) / (totalViews || 1) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-10 p-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Hybrid Viral Dashboard</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* TOP STATS */}
      <ViralSection title="Performance Overview">
        <ViralGrid cols={4}>
          <ViralStatCard
            label="Total Views"
            value={totalViews.toLocaleString()}
          />
          <ViralStatCard
            label="Total Likes"
            value={totalLikes.toLocaleString()}
          />
          <ViralStatCard
            label="Total Comments"
            value={totalComments.toLocaleString()}
          />
          <ViralStatCard
            label="Avg Engagement"
            value={`${avgEngagement}%`}
          />
        </ViralGrid>
      </ViralSection>

      {/* TREND CHART */}
      <ViralSection title="7-Day Trend">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance}>
              <defs>
                <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="35%" stopColor="#6366f1" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                fill="url(#viewGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ViralSection>

      {/* SPLIT TEST WINNERS */}
      <ViralSection title="Split Test Winners">
        <ViralGrid cols={3}>
          {splitTests.length > 0 ? (
            splitTests.map((t) => (
              <Card key={t.id} className="bg-background shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-600">Winner: {t.winner}</Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Performance: {t.performance}%
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No split tests yet</p>
          )}
        </ViralGrid>
      </ViralSection>

      {/* UPLOAD QUEUE STATUS */}
      <ViralSection title="Upload Queue Status">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-500/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Queued</p>
              <p className="text-2xl font-bold">
                {uploadQueue.filter(q => q.status === "queued").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold">
                {uploadQueue.filter(q => q.status === "processing").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Done</p>
              <p className="text-2xl font-bold">
                {uploadQueue.filter(q => q.status === "done").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">
                {uploadQueue.filter(q => q.status === "failed").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </ViralSection>

      {/* AI ENGINES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ViralSection title="Hashtag AI Engine">
          <HashtagEngineUI />
        </ViralSection>

        <ViralSection title="Description AI Engine">
          <DescriptionEngineUI />
        </ViralSection>

        <ViralSection title="Variant Generator">
          <VariantSelector />
        </ViralSection>
      </div>

      {/* SCRIPT ANALYZER */}
      <ViralSection title="AI Script Analyzer">
        <ScriptAnalyzer />
      </ViralSection>
    </div>
  );
}

