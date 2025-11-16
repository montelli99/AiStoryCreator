"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ScriptAnalyzer() {
  const [script, setScript] = useState("");
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  async function analyzeScript() {
    try {
      setLoading(true);

      const res = await fetch("/api/viral/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          projectId: "MANUAL"
        }),
      });

      const json = await res.json();
      setInsights(json.insights || []);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">AI Script Analyzer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your script here..."
          className="min-h-[150px]"
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />

        <Button onClick={analyzeScript} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Script"}
        </Button>

        {insights.length > 0 && (
          <div className="mt-6 space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg bg-muted text-sm"
              >
                {insight}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

