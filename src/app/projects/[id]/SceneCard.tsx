"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function SceneCard({ scene }) {
  const [loadingImg, setLoadingImg] = useState(false)
  const [loadingVid, setLoadingVid] = useState(false)

  async function generateImage() {
    setLoadingImg(true)
    await fetch("/api/generate/image", {
      method: "POST",
      body: JSON.stringify({
        prompt: scene.prompt,
        sceneId: scene.id,
        projectId: scene.projectId,
      }),
    })
    setLoadingImg(false)
  }

  async function generateVideo() {
    setLoadingVid(true)
    await fetch("/api/generate/video", {
      method: "POST",
      body: JSON.stringify({
        prompt: scene.prompt,
        sceneId: scene.id,
        projectId: scene.projectId,
      }),
    })
    setLoadingVid(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{scene.title || `Scene ${scene.index}`}</span>
          <Badge>{scene.status || "pending"}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{scene.description}</p>

        <div className="flex gap-3">
          <Button disabled={loadingImg} onClick={generateImage}>
            {loadingImg ? "Generating…" : "Image"}
          </Button>

          <Button
            disabled={loadingVid}
            onClick={generateVideo}
            variant="secondary"
          >
            {loadingVid ? "Generating…" : "Video"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}