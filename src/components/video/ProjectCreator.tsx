"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2 } from "lucide-react";

export default function ProjectCreator() {
  const [loading, setLoading] = useState(false);
  const [characterCode, setCharacterCode] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [age, setAge] = useState("25");
  const [aesthetic, setAesthetic] = useState("cinematic");
  const [product, setProduct] = useState("");

  async function createProject() {
    if (!characterCode || !ethnicity) return;

    setLoading(true);
    try {
      const res = await fetch("/api/video/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterCode,
          characterData: {
            ethnicity,
            baseAge: parseInt(age),
            variant: "default",
            aestheticType: aesthetic,
          },
          product: product || undefined,
        }),
      }).then((r) => r.json());

      if (res.success) {
        alert(`Project created: ${res.project.id}`);
      }
    } catch (err) {
      console.error("Project creation error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Create Video Project
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Character Code (e.g., ID_01_A)"
          value={characterCode}
          onChange={(e) => setCharacterCode(e.target.value)}
        />

        <Select value={ethnicity} onValueChange={setEthnicity}>
          <SelectTrigger>
            <SelectValue placeholder="Select ethnicity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asian">Asian</SelectItem>
            <SelectItem value="african">African</SelectItem>
            <SelectItem value="caucasian">Caucasian</SelectItem>
            <SelectItem value="hispanic">Hispanic</SelectItem>
            <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="18"
          max="65"
        />

        <Select value={aesthetic} onValueChange={setAesthetic}>
          <SelectTrigger>
            <SelectValue placeholder="Select aesthetic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cinematic">Cinematic</SelectItem>
            <SelectItem value="influencer">Influencer</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Product (optional)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <Button
          onClick={createProject}
          disabled={loading || !characterCode || !ethnicity}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Create Project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

