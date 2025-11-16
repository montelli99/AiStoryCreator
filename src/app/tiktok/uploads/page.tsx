"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, RefreshCw } from "lucide-react";
import VideoUploadModal from "@/components/viral/VideoUploadModal";
import UploadQueueTable from "@/components/viral/UploadQueueTable";

export default function TikTokUploadsPage() {
  const [open, setOpen] = useState(false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tiktok/queue/run", { method: "POST" });
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (err) {
      console.error("Queue load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your TikTok video uploads</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadQueue}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      <VideoUploadModal open={open} setOpen={setOpen} reload={loadQueue} />

      <Card className="bg-background shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Upload Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No uploads yet</p>
          ) : (
            <UploadQueueTable items={queue} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

