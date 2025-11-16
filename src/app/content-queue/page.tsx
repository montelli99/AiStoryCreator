"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/use-socket"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import JobDetailModal from "./JobDetailModal"

export default function ContentQueuePage() {
  const socket = useSocket()

  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Load initial jobs
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/queue")
        if (!res.ok) throw new Error("Failed to load queue")
        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (e) {
        setError("Unable to load job queue.")
      }
      setLoading(false)
    }
    load()
  }, [])

  // WebSocket live updates
  useEffect(() => {
    if (!socket) return

    socket.on("job_update", (job) => {
      setJobs((prev) => {
        const others = prev.filter((j) => j.id !== job.id)
        return [job, ...others].slice(0, 40)
      })
    })

    socket.on("job_new", (job) => {
      setJobs((prev) => [job, ...prev].slice(0, 40))
    })

    return () => {
      socket.off("job_update")
      socket.off("job_new")
    }
  }, [socket])

  if (loading)
    return (
      <div className="p-10 text-center text-2xl">Loading content queue…</div>
    )

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">Content Queue</h1>
      <p className="text-muted-foreground">
        Real-time job processing for all AI generation.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="p-3 rounded border hover:bg-muted cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{job.type}</p>
                <p className="text-xs text-muted-foreground">
                  {job.createdAt}
                </p>
              </div>
              <Badge
                variant={
                  job.status === "completed"
                    ? "default"
                    : job.status === "processing"
                    ? "secondary"
                    : job.status === "failed"
                    ? "destructive"
                    : "outline"
                }
              >
                {job.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}