"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VideoUploadModal({ open, setOpen, reload }: any) {
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mode, setMode] = useState("draft");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!fileUrl || !description) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tiktok/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "default",
          authId: "default",
          fileUrl,
          description,
          hashtags: hashtags.split(" ").filter(h => h),
          mode
        })
      });

      const data = await res.json();
      if (data.success) {
        setOpen(false);
        setFileUrl("");
        setDescription("");
        setHashtags("");
        setMode("draft");
        reload();
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Video to TikTok</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Video URL</label>
            <Input
              placeholder="https://example.com/video.mp4"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Write your video description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hashtags</label>
            <Input
              placeholder="#viral #trending #foryou"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Posting Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Creator)</SelectItem>
                <SelectItem value="auto">Auto-Post (Business)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full py-5" 
            disabled={loading} 
            onClick={submit}
          >
            {loading ? "Uploading…" : "Upload Video"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

