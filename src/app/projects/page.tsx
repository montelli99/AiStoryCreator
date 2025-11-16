"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreateProjectModal from "./CreateProjectModal"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects")
        if (!res.ok) throw new Error("Failed to load projects")
        const data = await res.json()
        setProjects(data.projects || [])
      } catch (e) {
        setError("Unable to load projects.")
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading)
    return (
      <div className="p-10 text-center text-2xl">
        Loading projects…
      </div>
    )

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Organize scenes, run Director AI, and generate content at scale.
          </p>
        </div>
        <Button size="lg" onClick={() => setShowCreateModal(true)}>
          New Project
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`}>
            <Card className="cursor-pointer hover:bg-muted/20 transition p-4">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <p className="text-xs">
                  Scenes: <strong>{p.scenes?.length || 0}</strong>
                </p>
                <p className="text-xs">
                  Jobs: <strong>{p.jobCount || 0}</strong>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}