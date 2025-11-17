"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

export default function VariantSelector() {
  const [script, setScript] = useState("");
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!script.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/viral/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      }).then((r) => r.json());

      setVariants(res.data || []);
    } catch (err) {
      console.error("Variant generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your video script..."
        className="min-h-[100px] resize-none"
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />

      <Button
        onClick={generate}
        className="w-full"
        disabled={loading || !script.trim()}
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {loading ? "Generating..." : "Generate Variants"}
      </Button>

      {variants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {variants.map((v, i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="font-semibold text-sm mb-2">{v.type || `Variant ${i + 1}`}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {v.description || v.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

