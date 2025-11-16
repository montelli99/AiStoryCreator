"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function AddSceneModal({ open, onClose, projectId }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [camera, setCamera] = useState("")
  const [loading, setLoading] = useState(false)

  async function createScene() {
    setLoading(true)
    await fetch(`/api/projects/${projectId}`, {
      method: "POST",
      body: JSON.stringify({
        type: "createScene",
        title,
        description,
        camera,
      }),
    })
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Scene</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Scene Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Scene Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Textarea
            placeholder="Camera Notes (optional)"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>

          <Button onClick={createScene} disabled={loading}>
            {loading ? "Creating…" : "Create Scene"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}