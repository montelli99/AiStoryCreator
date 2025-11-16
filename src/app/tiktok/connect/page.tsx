"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TikTokConnectPage() {
  const [loading, setLoading] = useState(false);

  const startConnect = async () => {
    setLoading(true);
    try {
      window.location.href = "/api/tiktok/auth/start";
    } catch (err) {
      console.error("Connect error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="bg-background border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Connect Your TikTok Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Connect your TikTok Business or Creator account to enable:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Auto-posting to TikTok</li>
            <li>Queue-based scheduled posting</li>
            <li>Performance analytics</li>
            <li>Draft uploads (Creator Accounts)</li>
            <li>Hybrid posting (Business Accounts)</li>
          </ul>

          <Button 
            onClick={startConnect} 
            disabled={loading} 
            className="w-full py-6 text-lg font-semibold"
          >
            {loading ? "Connecting…" : "Connect TikTok Account"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We'll never post without your permission. Your tokens are encrypted and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

