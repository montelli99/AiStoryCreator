"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wand2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ScriptAnalyzer from "@/components/viral/ScriptAnalyzer";
import ViralStatCard from "@/components/viral/ViralStatCard";
import ViralSection from "@/components/viral/ViralSection";
import ViralGrid from "@/components/viral/ViralGrid";

export default function ViralDashboard() {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState([]);
  const [insights, setInsights] = useState([]);

  // Load 7-day performance chart + insights
  useEffect(() => {
    async function loadData() {
      try {
        const perfRes = await fetch("/api/viral/performance", { method: "GET" });
        const perfJson = await perfRes.json();

        const insightsRes = await fetch("/api/viral/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: "Analyze overall performance",
            projectId: "GLOBAL"
          }),
        });
        const insightsJson = await insightsRes.json();

        setPerformance(perfJson.data || []);
        setInsights(insightsJson.insights || []);
      } catch (err) {
        console.log("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-xl">
        Loading Viral Dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Viral Dashboard</h1>

        <Button className="flex items-center gap-2">
          <Wand2 size={18} />
          Generate New Video
        </Button>
      </div>

      {/* KPI Grid */}
      <ViralGrid>
        <ViralStatCard title="7-Day Views" value="124,918" delta="+32%" />
        <ViralStatCard title="Avg Watch Time" value="4.8s" delta="+12%" />
        <ViralStatCard title="CTR" value="3.1%" delta="+4%" />
        <ViralStatCard title="Virality Score" value="89" delta="+9%" />
      </ViralGrid>

      {/* Performance Chart */}
      <ViralSection title="7-Day Performance">
        <Card>
          <CardContent className="h-72 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ViralSection>

      {/* AI Insights */}
      <ViralSection title="AI Insights (GLM-4.6)">
        <ViralGrid>
          {insights.slice(0, 3).map((insight, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} />
                  Insight #{i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>{insight}</CardContent>
            </Card>
          ))}
        </ViralGrid>
      </ViralSection>

      {/* Script Analyzer */}
      <ViralSection title="Script Analyzer">
        <ScriptAnalyzer />
      </ViralSection>
    </div>
  );
}

