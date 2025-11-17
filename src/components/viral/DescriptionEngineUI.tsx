"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Copy, RefreshCw } from "lucide-react";

export default function DescriptionEngineUI() {
  const [category, setCategory] = useState("discipline");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/viral/descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      }).then((r) => r.json());

      setDesc(res.data || "");
    } catch (err) {
      console.error("Description generation error:", err);
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
        {loading ? "Generating..." : "Generate Description"}
      </Button>

      {desc && (
        <div className="space-y-3">
          <Textarea
            className="min-h-[120px] resize-none"
            value={desc}
            readOnly
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(desc);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={generate}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

