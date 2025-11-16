"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSocket } from "@/hooks/use-socket"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

export default function DashboardPage() {
  const socket = useSocket()

  // --- STATE ---
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [recentContent, setRecentContent] = useState<any[]>([])
  const [director, setDirector] = useState<any>(null)
  const [characters, setCharacters] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // --- LOAD INITIAL DATA ---
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analytics/summary")
        const data = await res.json()
        setStats(data.stats || {})
        setRecentJobs(data.recentJobs || [])
        setRecentContent(data.recentContent || [])
        setCharacters(data.characters || [])
        setDirector(data.director || null)
      } catch (e) {
        setError("Failed to load dashboard.")
      }
      setLoading(false)
    }
    load()
  }, [])

  // --- SOCKET (LIVE UPDATES) ---
  useEffect(() => {
    if (!socket) return

    socket.on("job_update", (job) => {
      setRecentJobs((prev) => {
        const existing = prev.filter((j) => j.id !== job.id)
        return [job, ...existing].slice(0, 10)
      })
    })

    socket.on("director_update", (data) => setDirector(data))

    return () => {
      socket.off("job_update")
      socket.off("director_update")
    }
  }, [socket])

  // --- ACTIONS ---
  async function generateTestImage() {
    await fetch("/api/generate/image", { method: "POST" })
  }

  async function generateTestVideo() {
    await fetch("/api/generate/video", { method: "POST" })
  }

  async function runDirector() {
    await fetch("/api/director/plan", { method: "POST" })
  }

  async function syncTikTok() {
    await fetch("/api/social/tiktok", { method: "POST" })
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-2xl font-medium">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">AI Creator Studio Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time control center for all AI-generated content.
        </p>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* METRICS */}
        <Card>
          <CardHeader>
            <CardTitle>Stats Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Total Characters: {stats.totalCharacters}</p>
            <p>Total Content: {stats.totalContent}</p>
            <p>Jobs Pending: {stats.pendingJobs}</p>
            <p>Jobs Completed: {stats.completedJobs}</p>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Button onClick={generateTestImage}>Generate Test Image</Button>
            <Button onClick={generateTestVideo}>Generate Test Video</Button>
            <Button onClick={runDirector}>Run Director AI</Button>
            <Button onClick={syncTikTok}>Sync TikTok</Button>
          </CardContent>
        </Card>

        {/* DIRECTOR STATUS */}
        <Card>
          <CardHeader>
            <CardTitle>AI Director Status</CardTitle>
          </CardHeader>
          <CardContent>
            {director ? (
              <pre className="text-xs bg-black/10 p-2 rounded overflow-auto h-40">
                {JSON.stringify(director, null, 2)}
              </pre>
            ) : (
              <p>No director data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* CHARACTERS */}
      <Card>
        <CardHeader>
          <CardTitle>Characters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {characters.map((c: any) => (
            <div key={c.id} className="text-center bg-muted/30 p-3 rounded">
              <p className="font-medium">{c.code}</p>
              <p className="text-xs text-muted-foreground">{c.ethnicity}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECENT JOBS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentJobs.map((job) => (
            <div key={job.id} className="p-2 bg-muted/20 rounded">
              <p className="font-medium">{job.type}</p>
              <p className="text-xs text-muted-foreground">Status: {job.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECENT CONTENT */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentContent.map((item) => (
            <div key={item.id} className="bg-muted/20 p-3 rounded text-center">
              <p className="text-xs">{item.aesthetic}</p>
              <p className="text-muted-foreground text-xs">{item.id}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PERFORMANCE CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Performance</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyEngagement || []}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}