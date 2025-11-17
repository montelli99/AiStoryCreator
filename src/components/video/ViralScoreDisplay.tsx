"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap } from "lucide-react";

interface ViralScore {
  overall: number;
  engagement: number;
  retention: number;
  shareability: number;
  hooks: string[];
  recommendations: string[];
}

interface Props {
  scores: Map<string, ViralScore>;
}

export default function ViralScoreDisplay({ scores }: Props) {
  const topVariation = Array.from(scores.entries()).sort(
    (a, b) => b[1].overall - a[1].overall
  )[0];

  if (!topVariation) {
    return <div>No scores available</div>;
  }

  const [varId, score] = topVariation;

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Viral Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score.engagement)}`}>
              {score.engagement}
            </div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score.retention)}`}>
              {score.retention}
            </div>
            <div className="text-xs text-muted-foreground">Retention</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score.shareability)}`}>
              {score.shareability}
            </div>
            <div className="text-xs text-muted-foreground">Shareability</div>
          </div>
        </div>

        {score.hooks.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Hooks
            </div>
            <div className="flex flex-wrap gap-2">
              {score.hooks.map((hook, i) => (
                <Badge key={i} variant="secondary">
                  {hook}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {score.recommendations.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">Recommendations</div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {score.recommendations.map((rec, i) => (
                <li key={i}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

