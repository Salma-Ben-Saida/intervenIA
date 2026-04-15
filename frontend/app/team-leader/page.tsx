"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Menu,
  Bell,
  Wrench,
  Activity,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Settings,
  Package,
} from "lucide-react"

export default function TeamLeaderDashboard() {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today")
  const [view, setView] = useState<"overview" | "timetable" | "team-management">("overview")
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Team information - this leader only sees their team (Team Alpha)
  const teamInfo = {
    name: "Team Alpha",
    leaderId: "TL-001",
    zone: "North District",
    membersCount: 5,
  }

  // Team members - only this team's technicians
  const teamMembers = [
    {
      id: 1,
      name: "Alex Rivera",
      techId: "TECH-2847",
      status: "active",
      currentTask: "Broken Street Light",
      tasksToday: 2,
      tasksCompleted: 1,
      email: "alex.rivera@intervenia.com",
      phone: "+1 555-0101",
      specialty: "Electrical",
    },
    {
      id: 2,
      name: "Sam Chen",
      techId: "TECH-2901",
      status: "active",
      currentTask: "Water Leak Repair",
      tasksToday: 3,
      tasksCompleted: 1,
      email: "sam.chen@intervenia.com",
      phone: "+1 555-0102",
      specialty: "Plumbing",
    },
    {
      id: 3,
      name: "Jordan Taylor",
      techId: "TECH-3045",
      status: "break",
      currentTask: null,
      tasksToday: 2,
      tasksCompleted: 2,
      email: "jordan.taylor@intervenia.com",
      phone: "+1 555-0103",
      specialty: "Roads",
    },
    {
      id: 4,
      name: "Morgan Lee",
      techId: "TECH-3112",
      status: "active",
      currentTask: "Traffic Sign Repair",
      tasksToday: 1,
      tasksCompleted: 0,
      email: "morgan.lee@intervenia.com",
      phone: "+1 555-0104",
      specialty: "Traffic",
    },
    {
      id: 5,
      name: "Casey Brown",
      techId: "TECH-3204",
      status: "available",
      currentTask: null,
      tasksToday: 2,
      tasksCompleted: 2,
      email: "casey.brown@intervenia.com",
      phone: "+1 555-0105",
      specialty: "General",
    },
  ]

  // Team's incidents - only incidents in their zone
  const teamIncidents = [
    {
      id: 1,
      title: "Broken Street Light",
      urgency: "high",
      location: "Main St & 5th Ave (North)",
      status: "completed",
      assignedTo: "Alex Rivera",
      techId: 1,
      scheduledTime: "Today, 14:00",
      day: "Monday",
      timeSlot: "14:00",
      duration: "1h",
      reportedBy: "Jane Smith",
      completed: true, // Added completion status
    },
    {
      id: 2,
      title: "Water Leak",
      urgency: "critical",
      location: "Park Ave, Block 12 (North)",
      status: "in-progress",
      assignedTo: "Sam Chen",
      techId: 2,
      scheduledTime: "Today, 16:30",
      day: "Monday",
      timeSlot: "16:30",
      duration: "2h",
      reportedBy: "John Doe",
      completed: false, // Added completion status
    },
    {
      id: 3,
      title: "Damaged Sidewalk",
      urgency: "medium",
      location: "Oak Street (North)",
      status: "completed",
      assignedTo: "Morgan Lee",
      techId: 4,
      scheduledTime: "Today, 18:00",
      day: "Monday",
      timeSlot: "18:00",
      duration: "1.5h",
      reportedBy: "City Monitor",
      completed: true, // Added completion status
    },
    {
      id: 4,
      title: "Graffiti Removal",
      urgency: "low",
      location: "North Plaza",
      status: "pending",
      assignedTo: "Unassigned",
      techId: null,
      scheduledTime: "Tomorrow, 09:00",
      day: "Tuesday",
      timeSlot: "09:00",
      duration: "1h",
      reportedBy: "Sarah Wilson",
      completed: false, // Added completion status
    },
    {
      id: 5,
      title: "Traffic Light Repair",
      urgency: "high",
      location: "5th & Main (North)",
      status: "scheduled",
      assignedTo: "Morgan Lee",
      techId: 4,
      scheduledTime: "Wednesday, 10:00",
      day: "Wednesday",
      timeSlot: "10:00",
      duration: "2h",
      reportedBy: "Traffic Control",
      completed: false, // Added completion status
    },
    {
      id: 6,
      title: "Pothole Filling",
      urgency: "medium",
      location: "North Ave (North)",
      status: "scheduled",
      assignedTo: "Jordan Taylor",
      techId: 3,
      scheduledTime: "Wednesday, 14:00",
      day: "Wednesday",
      timeSlot: "14:00",
      duration: "1.5h",
      reportedBy: "Road Patrol",
      completed: false, // Added completion status
    },
    {
      id: 7,
      title: "Park Bench Repair",
      urgency: "low",
      location: "Central Park (North)",
      status: "scheduled",
      assignedTo: "Casey Brown",
      techId: 5,
      scheduledTime: "Thursday, 09:00",
      day: "Thursday",
      timeSlot: "09:00",
      duration: "2h",
      reportedBy: "Park Services",
      completed: false, // Added completion status
    },
    {
      id: 8,
      title: "Street Sign Replacement",
      urgency: "medium",
      location: "Elm St (North)",
      status: "scheduled",
      assignedTo: "Alex Rivera",
      techId: 1,
      scheduledTime: "Friday, 11:00",
      day: "Friday",
      timeSlot: "11:00",
      duration: "1h",
      reportedBy: "DOT",
      completed: false, // Added completion status
    },
    {
      // Added weekend incident
      id: 9,
      title: "Storm Drain Cleaning",
      urgency: "medium",
      location: "North District (Various)",
      status: "scheduled",
      assignedTo: "Sam Chen",
      techId: 2,
      scheduledTime: "Saturday, 08:00",
      day: "Saturday",
      timeSlot: "08:00",
      duration: "3h",
      reportedBy: "City Works",
      completed: false,
    },
    {
      // Added weekend incident
      id: 10,
      title: "Park Maintenance",
      urgency: "low",
      location: "Community Park (North)",
      status: "scheduled",
      assignedTo: "Casey Brown",
      techId: 5,
      scheduledTime: "Sunday, 10:00",
      day: "Sunday",
      timeSlot: "10:00",
      duration: "2h",
      reportedBy: "Park Services",
      completed: false,
    },
  ]

  // Updated weekDays to include Saturday and Sunday
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const getTasksForDayAndTech = (day: string, techId: number) => {
    return teamIncidents.filter((task) => task.day === day && task.techId === techId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "available":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "break":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      case "offline":
        return "text-muted-foreground border-border/30 bg-muted/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
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

  const activeMembers = teamMembers.filter((m) => m.status === "active").length
  const inProgressIncidents = teamIncidents.filter((i) => i.status === "in-progress").length
  const pendingIncidents = teamIncidents.filter((i) => i.status === "pending").length

  const handleDeleteMember = (memberId: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      alert(`Member ${memberId} removed successfully`)
    }
  }

  const handleEditMember = (memberId: number) => {
    setEditingMember(memberId)
  }

  const handleSaveMember = () => {
    alert("Team member updated successfully")
    setEditingMember(null)
  }

  const handleAddMember = () => {
    alert("New team member added successfully")
    setShowAddMemberForm(false)
  }

  const handleSearchByEmail = async () => {
    if (!searchEmail) {
      alert("Please enter an email address")
      return
    }

    setIsSearching(true)
    // Simulate API search - in production this would be a real API call
    setTimeout(() => {
      // Mock search results
      const mockResults = [
        {
          email: searchEmail,
          name: "John Doe",
          specialty: "Electrical",
          phone: "+1 555-0123",
          available: true,
        },
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 500)
  }

  const handleAddSearchedMember = (member: any) => {
    alert(`Successfully added ${member.name} to your team`)
    setSearchEmail("")
    setSearchResults([])
    setShowAddMemberForm(false)
  }

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
            <span className="text-sm text-muted-foreground">| Team Leader</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
              <Users className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium">{teamInfo.name}</span>
              <span className="text-xs text-muted-foreground">• {teamInfo.zone}</span>
            </div>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full"></span>
            </button>
            <Link
              href="/team-leader/profile"
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">{teamInfo.name} Command Center</h1>
          <p className="text-muted-foreground text-lg">Manage your team's operations in {teamInfo.zone}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Team Members</span>
              <Users className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{teamInfo.membersCount}</p>
            <p className="text-xs text-green-400 mt-1">{activeMembers} active now</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Activity className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{inProgressIncidents}</p>
            <p className="text-xs text-muted-foreground mt-1">Active interventions</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold">{pendingIncidents}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Efficiency</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-xs text-green-400 mt-1">+5% from last week</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            onClick={() => setView("overview")}
            variant={view === "overview" ? "default" : "outline"}
            className={
              view === "overview"
                ? "bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                : "border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            }
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
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
          <Button
            onClick={() => setView("team-management")}
            variant={view === "team-management" ? "default" : "outline"}
            className={
              view === "team-management"
                ? "bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                : "border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            }
          >
            <Users className="w-4 h-4 mr-2" />
            Team Management
          </Button>
          <Link href="/team-leader/assignments">
            <Button
              variant="outline"
              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Assignments
            </Button>
          </Link>
          <Link href="/team-leader/equipment">
            <Button
              variant="outline"
              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              <Package className="w-4 h-4 mr-2" />
              Equipment
            </Button>
          </Link>
        </div>

        {/* Weekly Timetable View */}
        {view === "timetable" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-neon-cyan" />
              Team Weekly Intervention Schedule
            </h2>
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 overflow-x-auto">
              <div className="min-w-[1400px]">
                {" "}
                {/* Adjusted min-width for 7 days */}
                {/* Timetable Header */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  {" "}
                  {/* Adjusted columns for 7 days */}
                  <div className="font-semibold text-sm text-muted-foreground px-3 py-2">Technician</div>
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
                  {teamMembers.map((member) => (
                    <div key={member.id} className="grid grid-cols-8 gap-2">
                      {" "}
                      {/* Adjusted columns for 7 days */}
                      <div className="px-3 py-2 bg-muted/20 rounded-lg border border-border/10 flex items-center gap-2">
                        {/* Technician profile photo */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-blue/30 flex items-center justify-center text-sm font-bold border-2 border-neon-cyan/40">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.specialty}</div>
                        </div>
                      </div>
                      {weekDays.map((day) => {
                        const tasksForDay = getTasksForDayAndTech(day, member.id)
                        return (
                          <div
                            key={`${member.id}-${day}`}
                            className="min-h-[100px] p-2 bg-muted/20 rounded-lg border border-border/10 hover:border-neon-cyan/30 transition-all"
                          >
                            {tasksForDay.length > 0 ? (
                              <div className="space-y-1">
                                {tasksForDay.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`p-2 rounded-md text-xs border cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all ${getUrgencyColor(task.urgency)}`}
                                    onClick={() => setSelectedTask(task.id)}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="font-semibold line-clamp-1 flex-1">{task.title}</div>
                                      {/* Completion status indicator */}
                                      {task.completed ? (
                                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 ml-1" />
                                      ) : (
                                        <Clock className="w-3 h-3 text-yellow-400 flex-shrink-0 ml-1" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{task.timeSlot}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                      <span>Duration: {task.duration}</span>
                                    </div>
                                    {/* Technician photo in intervention box */}
                                    <div className="flex items-center gap-1 mt-2">
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan/40 to-neon-blue/40 flex items-center justify-center text-[8px] font-bold border border-neon-cyan/50">
                                        {member.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </div>
                                      <span className="text-[9px] text-muted-foreground truncate">{member.name}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                Free
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-border/20 flex flex-wrap items-center gap-6 text-xs">
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
                <span className="mx-4">|</span> {/* Separator */}
                <span className="font-semibold text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-yellow-400" />
                  <span>Pending</span>
                </div>
              </div>
            </Card>

            {/* Selected Task Details */}
            {selectedTask && (
              <Card className="mt-6 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                {(() => {
                  const task = teamIncidents.find((t) => t.id === selectedTask)
                  if (!task) return null
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Intervention Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                          Close
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Incident</p>
                          <p className="font-semibold">{task.title}</p>
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
                          <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
                          <p className="font-semibold">{task.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getIncidentStatusColor(task.status)} inline-block`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </Card>
            )}
          </div>
        )}

        {view === "team-management" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-neon-cyan" />
                Team Member Management
              </h2>
              <Button
                onClick={() => setShowAddMemberForm(true)}
                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Add Member Form */}
            {showAddMemberForm && (
              <Card className="mb-6 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                <h3 className="text-lg font-bold mb-4">Add New Team Member</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Search for a technician by their email address to add them to your team
                </p>

                <div className="flex gap-3 mb-4">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                    placeholder="technician@intervenia.com"
                    onKeyPress={(e) => e.key === "Enter" && handleSearchByEmail()}
                  />
                  <Button
                    onClick={handleSearchByEmail}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddMemberForm(false)
                      setSearchEmail("")
                      setSearchResults([])
                    }}
                    variant="outline"
                    className="border-border/30 hover:border-neon-cyan/40"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <Card key={index} className="p-4 bg-muted/20 border-neon-cyan/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{result.name}</h4>
                            <p className="text-sm text-muted-foreground">{result.email}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span>
                                <span className="text-muted-foreground">Specialty:</span> {result.specialty}
                              </span>
                              <span>
                                <span className="text-muted-foreground">Phone:</span> {result.phone}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddSearchedMember(result)}
                            size="sm"
                            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                          >
                            Add to Team
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && searchEmail && !isSearching && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No technician found with this email address
                  </p>
                )}
              </Card>
            )}

            {/* Team Members List */}
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                >
                  {editingMember === member.id ? (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm text-muted-foreground block mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue={member.name}
                            className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-2">Email (Read-only)</label>
                          <input
                            type="email"
                            defaultValue={member.email}
                            disabled
                            className="w-full px-4 py-2 bg-muted/10 border border-border/20 rounded-lg text-muted-foreground cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-2">Phone</label>
                          <input
                            type="tel"
                            defaultValue={member.phone}
                            className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-2">Specialty</label>
                          <select
                            defaultValue={member.specialty}
                            className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                          >
                            <option>Electrical</option>
                            <option>Plumbing</option>
                            <option>Roads</option>
                            <option>Traffic</option>
                            <option>General</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveMember}
                          className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setEditingMember(null)}
                          variant="outline"
                          className="border-border/30 hover:border-neon-cyan/40"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">Tech ID:</span> {member.techId}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Specialty:</span> {member.specialty}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Email:</span> {member.email}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Phone:</span> {member.phone}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Tasks Today:</span> {member.tasksToday}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Completed:</span> {member.tasksCompleted}
                          </div>
                        </div>

                        {member.currentTask && (
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <Wrench className="w-4 h-4 text-neon-cyan" />
                            <span className="text-muted-foreground">Current:</span>
                            <span className="font-medium">{member.currentTask}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditMember(member.id)}
                          size="sm"
                          variant="outline"
                          className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteMember(member.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === "overview" && (
          <>
            {/* Team Members Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-neon-cyan" />
                Team Members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.techId}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {member.currentTask && (
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="w-4 h-4 text-neon-cyan" />
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">{member.currentTask}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Today's tasks:</span>
                          <span className="font-medium">{member.tasksToday}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">{member.tasksCompleted} completed</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Incidents Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-neon-cyan" />
                  Team Incidents ({teamInfo.zone})
                </h2>
                <div className="flex gap-2">
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
                    This Week
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
                    This Month
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {teamIncidents.map((incident) => (
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

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{incident.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{incident.scheduledTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            <span>
                              Assigned: <span className="text-foreground font-medium">{incident.assignedTo}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Reported by: {incident.reportedBy}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                          >
                            View Details
                          </Button>
                          {incident.assignedTo === "Unassigned" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                            >
                              Assign Technician
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
