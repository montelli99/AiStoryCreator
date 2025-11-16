"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function DirectorPanel({ projectId }) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function runDirector() {
    setLoading(true)
    try {
      const res = await fetch("/api/director/plan", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          notes,
        })
      })

      const data = await res.json()
      setResult(data)
      
      // Auto-refresh project after Director completes
      if (data.success) {
        window.location.reload()
      }
    } catch (err) {
      console.error("Director error", err)
    }
    setLoading(false)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Director AI</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <Textarea
          placeholder="Add director notes (optional)…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={runDirector} disabled={loading}>
          {loading ? "Directing…" : "Run Director"}
        </Button>

        {result && (
          <div className="bg-muted p-4 rounded-lg border mt-4 text-sm">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result.plan, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}