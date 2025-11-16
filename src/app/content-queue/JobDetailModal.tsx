"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export default function JobDetailModal({ job, onClose }) {
  const [fullJob, setFullJob] = useState<any>(job)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/queue/status/${job.id}`)
      const data = await res.json()
      setFullJob(data.job)
      setLoading(false)
    }
    load()
  }, [job.id])

  if (!job) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{fullJob.type}</p>
              <Badge>{fullJob.status}</Badge>
            </div>

            <pre className="bg-black/10 p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(fullJob, null, 2)}
            </pre>

            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}