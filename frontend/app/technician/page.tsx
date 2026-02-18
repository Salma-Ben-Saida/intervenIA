"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  Wrench,
  MapPin,
  Clock,
  CheckCircle,
  Menu,
  Bell,
  Navigation,
  Package,
  ChevronRight,
  User,
  Calendar,
  Settings,
} from "lucide-react"

export default function TechnicianDashboard() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [view, setView] = useState<"schedule" | "timetable">("schedule")

  // Sample assigned tasks
  const assignedTasks = [
    {
      id: 1,
      incident: "Broken Street Light",
      urgency: "high",
      location: "Main St & 5th Ave",
      distance: "0.8 km",
      scheduledTime: "Today, 14:00",
      day: "Monday",
      timeSlot: "14:00",
      status: "assigned",
      equipment: ["Ladder", "Light Bulb (LED 40W)", "Safety Vest"],
      estimatedDuration: "45 mins",
      reporter: "Jane Smith",
    },
    {
      id: 2,
      incident: "Water Leak",
      urgency: "critical",
      location: "Park Avenue, Block 12",
      distance: "1.2 km",
      scheduledTime: "Today, 16:30",
      day: "Monday",
      timeSlot: "16:30",
      status: "assigned",
      equipment: ["Pipe Wrench", "Sealant", "Replacement Valve"],
      estimatedDuration: "2 hours",
      reporter: "John Doe",
    },
    {
      id: 3,
      incident: "Damaged Traffic Sign",
      urgency: "medium",
      location: "Highway 101, Exit 42",
      distance: "5.3 km",
      scheduledTime: "Tomorrow, 09:00",
      day: "Tuesday",
      timeSlot: "09:00",
      status: "scheduled",
      equipment: ["New Sign", "Bolts", "Drill"],
      estimatedDuration: "1 hour",
      reporter: "City Monitor",
    },
    {
      id: 4,
      incident: "Pothole Repair",
      urgency: "high",
      location: "Oak Street",
      distance: "2.1 km",
      scheduledTime: "Yesterday, 10:00",
      day: "Sunday",
      timeSlot: "10:00",
      status: "completed",
      equipment: ["Asphalt Mix", "Tamper", "Safety Cones"],
      estimatedDuration: "1.5 hours",
      reporter: "Mike Johnson",
    },
    {
      id: 5,
      incident: "Graffiti Removal",
      urgency: "low",
      location: "Central Park Bench",
      distance: "1.5 km",
      scheduledTime: "Wednesday, 11:00",
      day: "Wednesday",
      timeSlot: "11:00",
      status: "scheduled",
      equipment: ["Cleaning Solution", "Brushes", "Protective Gear"],
      estimatedDuration: "1 hour",
      reporter: "Park Manager",
    },
    {
      id: 6,
      incident: "Faulty Traffic Light",
      urgency: "high",
      location: "Intersection 7th & Market",
      distance: "3.2 km",
      scheduledTime: "Wednesday, 15:00",
      day: "Wednesday",
      timeSlot: "15:00",
      status: "scheduled",
      equipment: ["Traffic Light Controller", "Testing Equipment"],
      estimatedDuration: "2 hours",
      reporter: "Traffic Control",
    },
    {
      id: 7,
      incident: "Park Bench Repair",
      urgency: "low",
      location: "Riverside Park",
      distance: "2.8 km",
      scheduledTime: "Thursday, 10:00",
      day: "Thursday",
      timeSlot: "10:00",
      status: "scheduled",
      equipment: ["Wood Planks", "Screws", "Paint"],
      estimatedDuration: "2.5 hours",
      reporter: "Park Services",
    },
    {
      id: 8,
      incident: "Street Sign Replacement",
      urgency: "medium",
      location: "Elm Street",
      distance: "1.9 km",
      scheduledTime: "Friday, 09:30",
      day: "Friday",
      timeSlot: "09:30",
      status: "scheduled",
      equipment: ["New Sign", "Post", "Concrete Mix"],
      estimatedDuration: "1.5 hours",
      reporter: "Department of Transportation",
    },
    {
      id: 9,
      incident: "Manhole Cover Adjustment",
      urgency: "high",
      location: "Broadway & 12th",
      distance: "2.5 km",
      scheduledTime: "Friday, 14:00",
      day: "Friday",
      timeSlot: "14:00",
      status: "scheduled",
      equipment: ["Crowbar", "Level", "Safety Equipment"],
      estimatedDuration: "1 hour",
      reporter: "City Engineer",
    },
  ]

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const getTasksForDayAndTime = (day: string, time: string) => {
    return assignedTasks.filter((task) => task.day === day && task.timeSlot.startsWith(time.slice(0, 2)))
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-400 border-red-400/30 bg-red-400/10"
      case "high":
        return "text-orange-400 border-orange-400/30 bg-orange-400/10"
      case "medium":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      case "low":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "assigned":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "scheduled":
        return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const handleStartTask = (taskId: number) => {
    alert(`Starting task ${taskId}. Navigation will open with directions.`)
  }

  const handleCompleteTask = (taskId: number) => {
    alert(`Task ${taskId} marked as completed!`)
  }

  const todayTasks = assignedTasks.filter((task) => task.scheduledTime.includes("Today"))
  const upcomingTasks = assignedTasks.filter((task) => task.scheduledTime.includes("Tomorrow"))
  const completedTasks = assignedTasks.filter((task) => task.status === "completed")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Network Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            <span className="text-sm text-muted-foreground">| Technician</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full"></span>
            </button>
            {/* CHANGE: Added profile settings link */}
            <Link
              href="/technician/profile"
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Profile Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Welcome, Tech #2847</h1>
          <p className="text-muted-foreground text-lg">Your assigned interventions and task schedule</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Today's Tasks</span>
              <Wrench className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{todayTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Tasks scheduled for today</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">{completedTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{upcomingTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Future scheduled tasks</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Equipment</span>
              <Package className="w-5 h-5 text-neon-purple" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-muted-foreground mt-1">Items in your van</p>
          </Card>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Button
            onClick={() => setView("schedule")}
            variant={view === "schedule" ? "default" : "outline"}
            className={
              view === "schedule"
                ? "bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                : "border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            }
          >
            <Clock className="w-4 h-4 mr-2" />
            Daily Schedule
          </Button>
          <Button
            onClick={() => setView("timetable")}
            variant={view === "timetable" ? "default" : "outline"}
            className={
              view === "timetable"
                ? "bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                : "border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            }
          >
            <Calendar className="w-4 h-4 mr-2" />
            Weekly Timetable
          </Button>
        </div>

        {view === "timetable" ? (
          // Weekly Timetable View
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-neon-cyan" />
              Weekly Mission Timetable
            </h2>
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timetable Header */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-sm text-muted-foreground px-3 py-2">Time</div>
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="font-semibold text-center px-3 py-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Timetable Body */}
                <div className="space-y-2">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 gap-2">
                      <div className="text-sm text-muted-foreground px-3 py-2 font-medium">{time}</div>
                      {weekDays.map((day) => {
                        const tasksInSlot = getTasksForDayAndTime(day, time)
                        return (
                          <div
                            key={`${day}-${time}`}
                            className="min-h-[80px] p-2 bg-muted/20 rounded-lg border border-border/10 hover:border-neon-cyan/30 transition-all"
                          >
                            {tasksInSlot.length > 0 ? (
                              <div className="space-y-1">
                                {tasksInSlot.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`p-2 rounded-md text-xs border cursor-pointer hover:scale-105 transition-transform ${getUrgencyColor(task.urgency)}`}
                                    onClick={() => setSelectedTask(task.id)}
                                  >
                                    <div className="font-semibold mb-1 line-clamp-1">{task.incident}</div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <MapPin className="w-3 h-3" />
                                      <span className="line-clamp-1">{task.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{task.estimatedDuration}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-border/20 flex items-center gap-6 text-xs">
                <span className="font-semibold text-muted-foreground">Urgency Levels:</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400/20 border border-red-400/30 rounded"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400/20 border border-orange-400/30 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400/20 border border-yellow-400/30 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400/20 border border-green-400/30 rounded"></div>
                  <span>Low</span>
                </div>
              </div>
            </Card>

            {/* Selected Task Details */}
            {selectedTask && (
              <Card className="mt-6 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                {(() => {
                  const task = assignedTasks.find((t) => t.id === selectedTask)
                  if (!task) return null
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Task Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                          Close
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Incident</p>
                          <p className="font-semibold">{task.incident}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Urgency</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(task.urgency)} capitalize inline-block`}
                          >
                            {task.urgency} priority
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Location</p>
                          <p className="font-semibold">{task.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Scheduled Time</p>
                          <p className="font-semibold">{task.scheduledTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold">{task.estimatedDuration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Reporter</p>
                          <p className="font-semibold">{task.reporter}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Required Equipment</p>
                        <div className="flex flex-wrap gap-2">
                          {task.equipment.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-muted/30 border border-neon-cyan/20"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleStartTask(task.id)}
                          className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Start & Navigate
                        </Button>
                        <Button
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white hover:from-green-500 hover:to-emerald-500 border border-green-500/40"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </Card>
            )}
          </div>
        ) : (
          // Daily Schedule View (existing content)
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-neon-cyan" />
              Today's Schedule
            </h2>
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-xl">{task.incident}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(task.urgency)} capitalize`}
                        >
                          {task.urgency} priority
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{task.scheduledTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          <span>{task.distance} away</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Reported by: {task.reporter}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Required Equipment:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.equipment.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-muted/30 border border-neon-cyan/20"
                            >
                              <Package className="w-3 h-3 inline mr-1" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleStartTask(task.id)}
                          className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Start & Navigate
                        </Button>
                        <Button
                          variant="outline"
                          className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white hover:from-green-500 hover:to-emerald-500 border border-green-500/40"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
