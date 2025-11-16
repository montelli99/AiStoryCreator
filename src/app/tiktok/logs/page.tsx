"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PostLogTable from "@/components/viral/PostLogTable";

export default function TikTokLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tiktok/logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Logs load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posting Logs</h1>
          <p className="text-muted-foreground mt-1">View all TikTok posting history</p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={loadLogs}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-background shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Posts</CardTitle>
        </CardHeader>

        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No logs yet</p>
          ) : (
            <PostLogTable logs={logs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

