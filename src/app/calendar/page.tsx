"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/hooks/use-socket"
import ScheduleModal from "./ScheduleModal"

const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

export default function CalendarPage() {
  const [schedules, setSchedules] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const socket = useSocket()

  async function loadSchedule() {
    const res = await fetch("/api/scheduler")
    const data = await res.json()
    setSchedules(data.items || [])
  }

  useEffect(() => {
    loadSchedule()
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on("schedule_update", loadSchedule)
    return () => socket.off("schedule_update", loadSchedule)
  }, [socket])

  function openModal(date) {
    setSelectedDate(date)
    setShowModal(true)
  }

  // Calendar grid calculation
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const startingDay = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarCells = []
  for (let i = 0; i < startingDay; i++) {
    calendarCells.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(new Date(year, month, i))
  }

  return (
    <div className="p-8 space-y-8">

      <Card>
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
        </CardHeader>
        <CardContent>

          {/* Month Controls */}
          <div className="flex justify-between mb-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentDate(new Date(year, month - 1, 1))
              }
            >
              Previous
            </Button>

            <div className="text-xl font-bold">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentDate(new Date(year, month + 1, 1))
              }
            >
              Next
            </Button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 text-center font-semibold mb-2">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((date, idx) => {
              if (!date) {
                return <div key={idx} className="border h-24 bg-muted/20" />
              }

              const formatted = date.toISOString().split("T")[0]
              const daySchedules = schedules.filter(
                (s) => s.date === formatted
              )

              return (
                <div
                  key={idx}
                  className="border h-32 p-1 rounded hover:bg-muted cursor-pointer"
                  onClick={() => openModal(formatted)}
                >
                  <div className="font-bold text-sm">
                    {date.getDate()}
                  </div>

                  {/* Scheduled Items */}
                  <div className="space-y-1 mt-1">
                    {daySchedules.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs p-1 rounded bg-secondary text-secondary-foreground"
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <ScheduleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        date={selectedDate}
        onSaved={loadSchedule}
      />
    </div>
  )
}