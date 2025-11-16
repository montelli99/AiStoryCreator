"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ScheduleModal({ open, onClose, date, onSaved }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    await fetch("/api/scheduler", {
      method: "POST",
      body: JSON.stringify({ date, title })
    })
    setLoading(false)
    onSaved()
    onClose()
  }

  if (!date) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}