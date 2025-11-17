"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";

export default function HashtagEngineUI() {
  const [category, setCategory] = useState("discipline");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/viral/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      }).then((r) => r.json());

      setTags(res.data || []);
    } catch (err) {
      console.error("Hashtag generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="discipline">Discipline</SelectItem>
          <SelectItem value="motivation">Motivation</SelectItem>
          <SelectItem value="stoicism">Stoicism</SelectItem>
          <SelectItem value="self_improvement">Self Improvement</SelectItem>
          <SelectItem value="fitness">Fitness</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        onClick={generate} 
        className="w-full" 
        disabled={loading}
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {loading ? "Generating..." : "Generate Hashtags"}
      </Button>

      {tags.length > 0 && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Generated Hashtags ({tags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {tag}
              </Badge>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(tags.join(" "));
            }}
          >
            Copy All
          </Button>
        </div>
      )}
    </div>
  );
}

