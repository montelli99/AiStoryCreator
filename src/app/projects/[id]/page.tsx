"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SceneCard from "./SceneCard"
import AddSceneModal from "./AddSceneModal"
import DirectorPanel from "./DirectorPanel"
import { useSocket } from "@/hooks/use-socket"

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddScene, setShowAddScene] = useState(false)

  const socket = useSocket()

  async function loadProject() {
    try {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) throw new Error("Failed to load project")
      const data = await res.json()
      setProject(data.project)
    } catch (e) {
      setError("Unable to load project data.")
    }
    setLoading(false)
  }

  // Load project initially
  useEffect(() => {
    if (id) loadProject()
  }, [id])

  // Listen for job updates via socket
  useEffect(() => {
    if (!socket) return
    socket.on("job_update", loadProject)
    socket.on("job_new", loadProject)
    return () => {
      socket.off("job_update", loadProject)
      socket.off("job_new", loadProject)
    }
  }, [socket])

  if (loading)
    return <div className="p-10 text-center text-2xl">Loading project…</div>

  if (!project)
    return <div className="p-10 text-center text-red-500">{error}</div>

  return (
    <div className="p-8 space-y-8">

      {/* PROJECT HEADER */}
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <p className="text-muted-foreground">{project.description}</p>
        </CardHeader>
        <CardContent className="flex gap-4">

          <Button onClick={() => setShowAddScene(true)}>
            Add Scene
          </Button>

          <Button variant="secondary" onClick={() => alert("Director Plan in 2B-2")}>
            Run Director
          </Button>

          <Button variant="outline" onClick={() => alert("Batch generation in 2B-3")}>
            Generate All Scenes
          </Button>
        </CardContent>
      </Card>

      {/* DIRECTOR PANEL */}
      <DirectorPanel
        projectId={id}
      />

      {/* SCENE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.scenes?.map((scene: any) => (
          <SceneCard key={scene.id} scene={scene} />
        ))}
      </div>

      {/* ADD SCENE MODAL */}
      <AddSceneModal
        open={showAddScene}
        onClose={() => {
          setShowAddScene(false)
          loadProject()
        }}
        projectId={id}
      />
    </div>
  )
}