"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Package } from "lucide-react"
import { X } from "lucide-react"
import {
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  Menu,
  Bell,
  Wrench,
  Activity,
  TrendingUp,
  Shield,
  BarChart3,
  Zap,
  Calendar,
  Eye,
} from "lucide-react"

export default function ManagerDashboard() {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today")
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [showWeeklyPlanning, setShowWeeklyPlanning] = useState(false)
  const [showUrgentPlanning, setShowUrgentPlanning] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [showWeeklyTimetable, setShowWeeklyTimetable] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  const globalStats = {
    totalIncidents: 48,
    inProgress: 12,
    pending: 8,
    completed: 28,
    totalTechnicians: 23,
    activeTechnicians: 18,
    totalTeams: 4,
    averageResponseTime: "18 min",
    efficiency: 94,
  }

  const teams = [
    {
      id: 1,
      name: "Team Alpha",
      leader: "Sarah Johnson",
      zone: "North District",
      members: 5,
      activeMembers: 4,
      tasksToday: 12,
      tasksCompleted: 8,
      efficiency: 94,
    },
    {
      id: 2,
      name: "Team Beta",
      leader: "Michael Torres",
      zone: "South District",
      members: 6,
      activeMembers: 5,
      tasksToday: 15,
      tasksCompleted: 10,
      efficiency: 89,
    },
    {
      id: 3,
      name: "Team Gamma",
      leader: "Emily Zhang",
      zone: "East District",
      members: 7,
      activeMembers: 6,
      tasksToday: 18,
      tasksCompleted: 14,
      efficiency: 96,
    },
    {
      id: 4,
      name: "Team Delta",
      leader: "David Kim",
      zone: "West District",
      members: 5,
      activeMembers: 3,
      tasksToday: 9,
      tasksCompleted: 6,
      efficiency: 82,
    },
  ]

  const allIncidents = [
    {
      id: 1,
      title: "Broken Street Light",
      urgency: "high",
      location: "Main St & 5th Ave",
      zone: "North District",
      status: "in-progress",
      team: "Team Alpha",
      assignedTo: "Alex Rivera",
      scheduledTime: "Today, 14:00",
    },
    {
      id: 2,
      title: "Water Leak",
      urgency: "critical",
      location: "Park Ave, Block 12",
      zone: "North District",
      status: "in-progress",
      team: "Team Alpha",
      assignedTo: "Sam Chen",
      scheduledTime: "Today, 16:30",
    },
    {
      id: 3,
      title: "Pothole Repair",
      urgency: "high",
      location: "Highway 101",
      zone: "South District",
      status: "in-progress",
      team: "Team Beta",
      assignedTo: "Chris Martinez",
      scheduledTime: "Today, 15:00",
    },
    {
      id: 4,
      title: "Traffic Signal Malfunction",
      urgency: "critical",
      location: "5th & Main",
      zone: "East District",
      status: "in-progress",
      team: "Team Gamma",
      assignedTo: "Jamie Lee",
      scheduledTime: "Today, 14:30",
    },
    {
      id: 5,
      title: "Graffiti Removal",
      urgency: "low",
      location: "Community Center",
      zone: "West District",
      status: "pending",
      team: "Team Delta",
      assignedTo: "Unassigned",
      scheduledTime: "Tomorrow, 09:00",
    },
    {
      id: 6,
      title: "Damaged Sidewalk",
      urgency: "medium",
      location: "Oak Street",
      zone: "North District",
      status: "scheduled",
      team: "Team Alpha",
      assignedTo: "Morgan Lee",
      scheduledTime: "Today, 18:00",
    },
  ]

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const weeklyAssignments = [
    {
      id: 1,
      incidentId: "INC-001",
      incidentTitle: "Broken Street Light",
      team: "Team Alpha",
      teamId: 1,
      zone: "North District",
      day: "Monday",
      timeSlot: "14:00",
      duration: "1h",
      technicianId: "TECH-2847",
      technicianName: "Alex Rivera",
      urgency: "high",
      status: "scheduled",
    },
    {
      id: 2,
      incidentId: "INC-002",
      incidentTitle: "Water Leak Repair",
      team: "Team Alpha",
      teamId: 1,
      zone: "North District",
      day: "Monday",
      timeSlot: "16:30",
      duration: "2h",
      technicianId: "TECH-2901",
      technicianName: "Sam Chen",
      urgency: "critical",
      status: "scheduled",
    },
    {
      id: 3,
      incidentId: "INC-003",
      incidentTitle: "Pothole Repair",
      team: "Team Beta",
      teamId: 2,
      zone: "South District",
      day: "Tuesday",
      timeSlot: "09:00",
      duration: "3h",
      technicianId: "TECH-3105",
      technicianName: "Chris Martinez",
      urgency: "high",
      status: "scheduled",
    },
    {
      id: 4,
      incidentId: "INC-004",
      incidentTitle: "Traffic Signal Repair",
      team: "Team Gamma",
      teamId: 3,
      zone: "East District",
      day: "Wednesday",
      timeSlot: "10:00",
      duration: "2h",
      technicianId: "TECH-3304",
      technicianName: "Jamie Lee",
      urgency: "critical",
      status: "scheduled",
    },
    {
      id: 5,
      incidentId: "INC-005",
      incidentTitle: "Park Maintenance",
      team: "Team Delta",
      teamId: 4,
      zone: "West District",
      day: "Thursday",
      timeSlot: "11:00",
      duration: "2h",
      technicianId: "TECH-3501",
      technicianName: "Taylor Kim",
      urgency: "low",
      status: "scheduled",
    },
    {
      id: 6,
      incidentId: "INC-006",
      incidentTitle: "Graffiti Removal",
      team: "Team Alpha",
      teamId: 1,
      zone: "North District",
      day: "Friday",
      timeSlot: "13:00",
      duration: "1.5h",
      technicianId: "TECH-2847",
      technicianName: "Alex Rivera",
      urgency: "medium",
      status: "scheduled",
    },
    {
      id: 7,
      incidentId: "INC-007",
      incidentTitle: "Sidewalk Repair",
      team: "Team Beta",
      teamId: 2,
      zone: "South District",
      day: "Saturday",
      timeSlot: "09:00",
      duration: "4h",
      technicianId: "TECH-3105",
      technicianName: "Chris Martinez",
      urgency: "medium",
      status: "scheduled",
    },
  ]

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

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "in-progress":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "scheduled":
        return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
      case "pending":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-400"
    if (efficiency >= 80) return "text-yellow-400"
    return "text-orange-400"
  }

  const filteredIncidents = selectedZone === "all" ? allIncidents : allIncidents.filter((i) => i.zone === selectedZone)

  const zones = ["North District", "South District", "East District", "West District"]

  const getAssignmentsForDay = (day: string) => {
    return weeklyAssignments.filter((a) => a.day === day)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl"></div>
      </div>

      <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            <span className="text-sm text-muted-foreground">| Manager Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
              <Shield className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium">Global Control</span>
            </div>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Global Operations Command</h1>
          <p className="text-muted-foreground text-lg">Comprehensive overview of all interventions across the city</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/20 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Intelligent Planning</h2>
              <p className="text-sm text-muted-foreground">Generate optimized intervention schedules using AI</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowWeeklyPlanning(true)}
              className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all border border-neon-cyan/40"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Weekly Planning
            </Button>
            <Button
              onClick={() => setShowUrgentPlanning(true)}
              className="bg-gradient-to-r from-orange-400/80 to-red-400/80 text-background hover:from-orange-400 hover:to-red-400 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] transition-all border border-orange-400/40"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Planning
            </Button>
            <Button
              onClick={() => setShowWeeklyTimetable(true)}
              className="bg-gradient-to-r from-neon-blue/80 to-neon-purple/80 text-background hover:from-neon-blue hover:to-neon-purple hover:shadow-[0_0_20px_rgba(147,197,253,0.4)] transition-all border border-neon-blue/40"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Weekly Timetable
            </Button>
          </div>
        </Card>

        {showWeeklyPlanning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8 bg-background/95 backdrop-blur-xl border-neon-cyan/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Generate Weekly Planning</h3>
                <button
                  onClick={() => setShowWeeklyPlanning(false)}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                The Choco Solver will analyze all pending incidents, technician availability, equipment resources, and
                zone priorities to generate an optimized weekly intervention schedule.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Planning Period</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted/30 border border-border/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full mt-2 px-3 py-2 bg-background border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      />
                    </div>
                    <div className="p-4 bg-muted/30 border border-border/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <select className="w-full mt-2 px-3 py-2 bg-background border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none">
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Optimization Priorities</label>
                  <div className="space-y-2">
                    {["Minimize response time", "Balance workload", "Optimize equipment usage", "Zone coverage"].map(
                      (priority) => (
                        <label key={priority} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-border/30 text-neon-cyan focus:ring-neon-cyan"
                          />
                          <span className="text-sm">{priority}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {isGeneratingPlan ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Running Choco Solver optimization...</p>
                  <p className="text-sm text-muted-foreground mt-2">Analyzing constraints and generating schedule</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setIsGeneratingPlan(true)
                      setTimeout(() => {
                        setIsGeneratingPlan(false)
                        setShowWeeklyPlanning(false)
                        alert("Weekly planning generated successfully! View in Planning section.")
                      }, 3000)
                    }}
                    className="flex-1 bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Planning
                  </Button>
                  <Button
                    onClick={() => setShowWeeklyPlanning(false)}
                    variant="outline"
                    className="border-border/30 hover:border-neon-cyan/40"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {showUrgentPlanning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8 bg-background/95 backdrop-blur-xl border-orange-400/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  Emergency Planning
                </h3>
                <button
                  onClick={() => setShowUrgentPlanning(false)}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                Generate immediate intervention plan for critical incidents requiring urgent response.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Select Critical Incident</label>
                  <select className="w-full px-4 py-3 bg-muted/30 border border-orange-400/30 rounded-lg focus:border-orange-400/60 focus:outline-none">
                    <option>Water Main Break - Downtown (Critical)</option>
                    <option>Traffic Signal Failure - Highway 101 (Critical)</option>
                    <option>Gas Leak - Residential Area (Critical)</option>
                    <option>Power Outage - Hospital District (Critical)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Response Window</label>
                    <select className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none">
                      <option>Immediate (within 30 min)</option>
                      <option>Within 1 hour</option>
                      <option>Within 2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Priority Level</label>
                    <select className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none">
                      <option>Critical - Emergency</option>
                      <option>High - Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-orange-400/10 border border-orange-400/30 rounded-lg">
                  <p className="text-sm text-orange-400 font-medium mb-2">Emergency Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Will interrupt current non-critical tasks and reassign available technicians with required
                    specialties to this incident.
                  </p>
                </div>
              </div>

              {isGeneratingPlan ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing emergency resources...</p>
                  <p className="text-sm text-muted-foreground mt-2">Finding available technicians and equipment</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setIsGeneratingPlan(true)
                      setTimeout(() => {
                        setIsGeneratingPlan(false)
                        setShowUrgentPlanning(false)
                        alert("Emergency planning generated! Technicians have been notified.")
                      }, 2500)
                    }}
                    className="flex-1 bg-gradient-to-r from-orange-400/80 to-red-400/80 text-background hover:from-orange-400 hover:to-red-400 border border-orange-400/40"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Deploy Emergency Response
                  </Button>
                  <Button
                    onClick={() => setShowUrgentPlanning(false)}
                    variant="outline"
                    className="border-border/30 hover:border-neon-cyan/40"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {showWeeklyTimetable && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-7xl my-8 p-8 bg-background/95 backdrop-blur-xl border-neon-cyan/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-neon-cyan" />
                    Weekly Planning Timetable
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">View all team assignments across the week</p>
                </div>
                <button
                  onClick={() => {
                    setShowWeeklyTimetable(false)
                    setSelectedAssignment(null)
                  }}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Timetable Header */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="font-semibold text-sm text-muted-foreground px-3 py-2">Time / Day</div>
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="font-semibold text-center px-3 py-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Timetable Body - Grouped by Day */}
                  <div className="grid grid-cols-8 gap-2">
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-xs text-muted-foreground h-full flex items-center">
                        Assignments
                      </div>
                    </div>
                    {weekDays.map((day) => {
                      const dayAssignments = getAssignmentsForDay(day)
                      return (
                        <div
                          key={day}
                          className="min-h-[300px] p-3 bg-muted/20 rounded-lg border border-border/10 space-y-2"
                        >
                          {dayAssignments.length > 0 ? (
                            dayAssignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                onClick={() => setSelectedAssignment(assignment)}
                                className={`p-3 rounded-lg border cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all ${getUrgencyColor(assignment.urgency)}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold">{assignment.timeSlot}</span>
                                  <Eye className="w-3 h-3" />
                                </div>
                                <div className="font-semibold text-sm mb-1 line-clamp-2">
                                  {assignment.incidentTitle}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                                  <Users className="w-3 h-3" />
                                  <span className="font-medium">{assignment.team}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span>{assignment.zone}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                              No assignments
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
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

              {selectedAssignment && (
                <Card className="mt-6 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">Assignment Details</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAssignment(null)}
                      className="hover:bg-muted/50"
                    >
                      Close
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Incident Info */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-neon-cyan mb-3">Incident Information</h5>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Incident ID</p>
                        <p className="font-semibold">{selectedAssignment.incidentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Title</p>
                        <p className="font-semibold">{selectedAssignment.incidentTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Urgency</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(selectedAssignment.urgency)} capitalize inline-block`}
                        >
                          {selectedAssignment.urgency}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Zone</p>
                        <p className="font-semibold">{selectedAssignment.zone}</p>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-neon-cyan mb-3">Team Information</h5>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Team Name</p>
                        <p className="font-semibold">{selectedAssignment.team}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Assigned Technician</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-xs font-bold">
                            {selectedAssignment.technicianName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{selectedAssignment.technicianName}</p>
                            <p className="text-xs text-muted-foreground">{selectedAssignment.technicianId}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getIncidentStatusColor(selectedAssignment.status)} capitalize inline-block`}
                        >
                          {selectedAssignment.status}
                        </span>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-neon-cyan mb-3">Schedule</h5>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Day</p>
                        <p className="font-semibold">{selectedAssignment.day}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <p className="font-semibold">{selectedAssignment.timeSlot}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="font-semibold">{selectedAssignment.duration}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Incidents</span>
              <AlertTriangle className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{globalStats.totalIncidents}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all zones</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Activity className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{globalStats.inProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">Active now</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Technicians</span>
              <Wrench className="w-5 h-5 text-neon-purple" />
            </div>
            <p className="text-3xl font-bold">{globalStats.totalTechnicians}</p>
            <p className="text-xs text-green-400 mt-1">{globalStats.activeTechnicians} active</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Response</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold">{globalStats.averageResponseTime}</p>
            <p className="text-xs text-green-400 mt-1">-3 min from avg</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Efficiency</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">{globalStats.efficiency}%</p>
            <p className="text-xs text-green-400 mt-1">+2% this week</p>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-neon-cyan" />
            All Teams Performance
          </h2>
          <div className="mb-6">
            <Link href="/manager/equipment">
              <Button className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                <Package className="w-4 h-4 mr-2" />
                Manage Equipment
              </Button>
            </Link>
            <Link href="/manager/users" className="ml-3">
              <Button className="bg-gradient-to-r from-neon-purple/80 to-neon-blue/80 text-background hover:from-neon-purple hover:to-neon-blue border border-neon-purple/40">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Leader: {team.leader} • {team.zone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getEfficiencyColor(team.efficiency)}`}>{team.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Members</p>
                    <p className="font-semibold">
                      {team.members} <span className="text-xs text-green-400">({team.activeMembers} active)</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Today</p>
                    <p className="font-semibold">{team.tasksToday} tasks</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Completed</p>
                    <p className="font-semibold text-green-400">{team.tasksCompleted}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full transition-all duration-500"
                      style={{ width: `${(team.tasksCompleted / team.tasksToday) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-neon-cyan" />
              All City Incidents
            </h2>
            <div className="flex gap-2">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="px-4 py-2 bg-background/50 border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground text-sm"
              >
                <option value="all">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <Button
                variant={timeFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("today")}
                className={
                  timeFilter === "today"
                    ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                    : "border-border/30 hover:border-neon-cyan/40"
                }
              >
                Today
              </Button>
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("week")}
                className={
                  timeFilter === "week"
                    ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                    : "border-border/30 hover:border-neon-cyan/40"
                }
              >
                Week
              </Button>
              <Button
                variant={timeFilter === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("month")}
                className={
                  timeFilter === "month"
                    ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                    : "border-border/30 hover:border-neon-cyan/40"
                }
              >
                Month
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card
                key={incident.id}
                className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(incident.urgency)} capitalize`}
                      >
                        {incident.urgency}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getIncidentStatusColor(incident.status)}`}
                      >
                        {incident.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-neon-cyan">{incident.zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{incident.team}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        <span>
                          <span className="text-foreground font-medium">{incident.assignedTo}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{incident.scheduledTime}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                      >
                        View Full Details
                      </Button>
                      {incident.assignedTo === "Unassigned" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                        >
                          Assign Now
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-400/30 hover:border-yellow-400/60 hover:bg-yellow-400/5 bg-transparent text-yellow-400"
                      >
                        Reassign
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
