"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Zap, Settings } from "lucide-react";
import ProjectCreator from "@/components/video/ProjectCreator";
import RenderQueueMonitor from "@/components/video/RenderQueueMonitor";
import ViralScoreDisplay from "@/components/video/ViralScoreDisplay";
import PremiumSection from "@/components/theme/PremiumSection";
import PremiumCard from "@/components/theme/PremiumCard";
import PremiumGrid from "@/components/theme/PremiumGrid";
import PremiumBadge from "@/components/theme/PremiumBadge";

export default function CreatorCommandCenter() {
  const [activeTab, setActiveTab] = useState("factory");
  const { viewMode, tokens } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        padding: "24px",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PremiumSection title="Creator Command Center V2" subtitle="AI-powered video factory with Director AI, viral scoring, and TikTok auto-posting">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8" style={{ color: tokens.colors.accent }} />
          </div>
        </PremiumSection>

        {/* Stats */}
        <PremiumGrid columns={3} gap={16} className="mb-8">
          <PremiumCard>
            <div className="text-3xl font-bold" style={{ color: tokens.colors.accent }}>∞</div>
            <div style={{ color: tokens.colors.textMuted, fontSize: "14px" }}>Video Variations</div>
          </PremiumCard>
          <PremiumCard>
            <div className="text-3xl font-bold" style={{ color: tokens.colors.accent }}>AI</div>
            <div style={{ color: tokens.colors.textMuted, fontSize: "14px" }}>Director AI Planning</div>
          </PremiumCard>
          <PremiumCard>
            <div className="text-3xl font-bold" style={{ color: tokens.colors.accent }}>🚀</div>
            <div style={{ color: tokens.colors.textMuted, fontSize: "14px" }}>Auto-Post to TikTok</div>
          </PremiumCard>
        </PremiumGrid>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger value="factory" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Video Factory
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Render Queue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Video Factory Tab */}
          <TabsContent value="factory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProjectCreator />
              </div>
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <Badge className="mt-1">1</Badge>
                      <div>
                        <div className="font-semibold">Create Project</div>
                        <div className="text-muted-foreground">
                          Select character, ethnicity, age, and aesthetic
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="mt-1">2</Badge>
                      <div>
                        <div className="font-semibold">Director AI Plans</div>
                        <div className="text-muted-foreground">
                          GLM-4.6 generates scenes, scripts, and variations
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="mt-1">3</Badge>
                      <div>
                        <div className="font-semibold">Generate Assets</div>
                        <div className="text-muted-foreground">
                          Vidu-Q1 creates videos, CogView-4 creates images
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="mt-1">4</Badge>
                      <div>
                        <div className="font-semibold">Score & Render</div>
                        <div className="text-muted-foreground">
                          Viral scoring, FFmpeg rendering, queue management
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="mt-1">5</Badge>
                      <div>
                        <div className="font-semibold">Auto-Post</div>
                        <div className="text-muted-foreground">
                          Automatically post to TikTok with optimal timing
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Render Queue Tab */}
          <TabsContent value="queue">
            <RenderQueueMonitor />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Viral Score Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ViralScoreDisplay scores={new Map()} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

