"use client"

import { useEffect, useMemo, useState } from "react"
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
  User,
  Calendar,
  Settings,
  Users,
  Star,
  Wifi,
  WifiOff,
  LogOut
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getAuth, clearAuth } from "@/lib/auth"


type PlanningAssignment = {
  id: string
  incidentId: string | null
  speciality: string
  teamId: string
  technicianId: string
  startTime: string | null
  endTime: string | null
  zone: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  equipmentUsed?: { name: string; quantity: number; usageType: string }[]
}

type TechnicianProfile = {
  id: string
  username: string
  speciality: string
  zone?: string
  teamId?: string
}

type Team = {
  id: string
  leaderId: string
  speciality: string
  zone: string
  technicianIds: string[]
}

type TeamMember = {
  id: string
  username: string
  speciality: string
  role: string
  isAvailable: boolean | null
}

type Task = {
  id: string
  incident: string
  urgency: "low" | "medium" | "high" | "critical"
  location: string
  scheduledTime: string
  day: string
  timeSlot: string
  status: string
  equipment: string[]
  estimatedDuration: string
  reporter: string
}

function formatZone(z?: string | null) {
  if (!z) return "Unknown"
  return z.replace(/_/g, " ")
}

function formatSpeciality(s?: string | null) {
  if (!s) return "General task"
  return s.replace(/_/g, " ")
}

function toDayName(iso?: string | null) {
  if (!iso) return "TBD"
  return new Date(iso).toLocaleDateString(undefined, { weekday: "long" })
}

function toTimeSlot(iso?: string | null) {
  if (!iso) return "--:--"
  const d = new Date(iso)
  const hh = d.getHours().toString().padStart(2, "0")
  const mm = d.getMinutes().toString().padStart(2, "0")
  return `${hh}:${mm}`
}

function formatScheduled(iso?: string | null) {
  if (!iso) return "TBD"
  return new Date(iso).toLocaleString()
}

function durationLabel(start?: string | null, end?: string | null) {
  if (!start) return "TBD"
  if (!end) return "In progress"
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms <= 0) return "0 mins"
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${mins} mins`
  return `${Math.round(mins / 60)} hours`
}

function urgencyFromStatus(status: PlanningAssignment["status"]): "low" | "medium" | "high" | "critical" {
  switch (status) {
    case "IN_PROGRESS": return "high"
    case "SCHEDULED":   return "medium"
    default:            return "low"
  }
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "critical": return "text-red-400 border-red-400/30 bg-red-400/10"
    case "high":     return "text-orange-400 border-orange-400/30 bg-orange-400/10"
    case "medium":   return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    case "low":      return "text-green-400 border-green-400/30 bg-green-400/10"
    default:         return "text-muted-foreground border-border/30 bg-muted/10"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":   return "text-green-400 border-green-400/30 bg-green-400/10"
    case "in_progress": return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
    case "scheduled":   return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
    default:            return "text-muted-foreground border-border/30 bg-muted/10"
  }
}

function Spinner({ light }: { light?: boolean }) {
  return (
      <div className={`w-4 h-4 mr-2 rounded-full border-2 animate-spin ${
          light ? "border-white/40 border-t-white" : "border-background/40 border-t-background"
      }`} />
  )
}


  // ----- Main component -----


export default function TechnicianDashboard() {
  // ─── All state inside the component ──────────────────────────

  const router = useRouter()
  const auth   = getAuth()

  useEffect(() => {
    if (!auth) router.push("/login")
  }, [])

  const token  = auth?.token  ?? ""
  const userId = auth?.userId ?? ""

  const h = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }

  const [selectedTask, setSelectedTask]   = useState<string | null>(null)
  const [view, setView]                   = useState<"schedule" | "timetable">("schedule")
  const [assignments, setAssignments]     = useState<PlanningAssignment[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [startingId, setStartingId]       = useState<string | null>(null)
  const [completingId, setCompletingId]   = useState<string | null>(null)
  const [profile, setProfile]             = useState<TechnicianProfile | null>(null)
  const [team, setTeam]                   = useState<Team | null>(null)
  const [teamMembers, setTeamMembers]     = useState<TeamMember[]>([])
  const [leader, setLeader]               = useState<TeamMember | null>(null)
  const [showTeam, setShowTeam]           = useState(false)

  // ─── Data Loading ─────────────────────────────────────────────
  const loadAssignments = async () => {
    setLoading(true)
    setError(null)
    try {
      const [assignmentsRes, profileRes] = await Promise.all([
        fetch(`http://localhost:8080/api/planning/technician/${userId}`, { headers: h }),
        fetch(`http://localhost:8080/api/users/${userId}`, { headers: h}),
      ])
      if (!assignmentsRes.ok) throw new Error(await assignmentsRes.text())
      if (!profileRes.ok) throw new Error(await profileRes.text())

      const [assignmentsData, profileData]: [PlanningAssignment[], TechnicianProfile] =
          await Promise.all([assignmentsRes.json(), profileRes.json()])

      setAssignments(assignmentsData)
      setProfile(profileData)

      if (profileData.teamId) {
        const [teamRes, membersRes] = await Promise.all([
          fetch(`http://localhost:8080/api/teams/${profileData.teamId}`, { cache: "no-store" }),
          fetch(`http://localhost:8080/api/users/team/${profileData.teamId}`, { cache: "no-store" }),
        ])

        if (teamRes.ok && membersRes.ok) {
          const [teamData, membersData]: [Team, TeamMember[]] =
              await Promise.all([teamRes.json(), membersRes.json()])

          setTeam(teamData)
          setTeamMembers(membersData)

          if (teamData.leaderId) {
            const leaderRes = await fetch(
                `http://localhost:8080/api/users/${teamData.leaderId}`,
                { cache: "no-store" }
            )
            if (leaderRes.ok) setLeader(await leaderRes.json())
          }
        }
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAssignments() }, [])

  // ─── Derived Data ─────────────────────────────────────────────
  const assignedTasks: Task[] = useMemo(() =>
      assignments.map((a) => ({
        id: a.id,
        incident: formatSpeciality(a.speciality),
        urgency: urgencyFromStatus(a.status),
        location: formatZone(a.zone),
        scheduledTime: formatScheduled(a.startTime),
        day: toDayName(a.startTime),
        timeSlot: toTimeSlot(a.startTime),
        status: a.status.toLowerCase(),
        equipment: (a.equipmentUsed || []).map((e) => `${e.quantity}x ${e.name}`),
        estimatedDuration: durationLabel(a.startTime, a.endTime),
        reporter: "Dispatcher",
      })), [assignments])

  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d
  }, [])

  const todayTasks = useMemo(() =>
          assignments
              .filter((a) => {
                if (!a.startTime) return false
                const d = new Date(a.startTime)
                return (
                    d.getFullYear() === today.getFullYear() &&
                    d.getMonth() === today.getMonth() &&
                    d.getDate() === today.getDate()
                )
              })
              .map((a) => assignedTasks.find((t) => t.id === a.id)!)
              .filter(Boolean),
      [assignments, today, assignedTasks]
  )

  const completedCount    = assignments.filter((a) => a.status === "COMPLETED").length
  const upcomingCount     = useMemo(() => {
    const end = new Date(today); end.setHours(23, 59, 59, 999)
    return assignments.filter((a) => a.startTime && new Date(a.startTime) > end).length
  }, [assignments, today])
  const equipmentUniqueCount = useMemo(() => {
    const set = new Set<string>()
    assignments.forEach((a) => (a.equipmentUsed || []).forEach((e) => set.add(e.name)))
    return set.size
  }, [assignments])

  // ─── Actions ──────────────────────────────────────────────────
  const handleStartTask = async (assignmentId: string) => {
    setStartingId(assignmentId)
    try {
      const res = await fetch(
          `http://localhost:8080/api/planning/assignments/${assignmentId}/start`,
          { method: "PATCH" }
      )
      if (res.status === 401) {
        clearAuth()
        router.push("/login")
        return
      }

      if (!res.ok) throw new Error(await res.text())


      const updated: PlanningAssignment = await res.json()
      setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? updated : a)))
    } catch (e: any) {
      alert("Error: " + (e?.message || "Failed to start"))
    } finally {
      setStartingId(null)
    }
  }

  const handleCompleteTask = async (assignmentId: string) => {
    setCompletingId(assignmentId)
    try {
      const res = await fetch(
          `http://localhost:8080/api/planning/assignments/${assignmentId}/complete`,
          { method: "PATCH" }
      )
      if (res.status === 401) { clearAuth(); router.push("/login"); return }
      if (!res.ok) throw new Error(await res.text())
      const updated: PlanningAssignment = await res.json()
      setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? updated : a)))
    } catch (e: any) {
      alert("Error: " + (e?.message || "Failed to complete"))
    } finally {
      setCompletingId(null)
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  const getTasksForDayAndTime = (day: string, time: string) =>
      assignedTasks.filter((t) => t.day === day && t.timeSlot.startsWith(time.slice(0, 2)))

  // ─── Action Buttons sub-component ────────────────────────────
  const ActionButtons = ({ assignmentId }: { assignmentId: string }) => {
    const assignment   = assignments.find((a) => a.id === assignmentId)
    if (!assignment) return null
    const isStarting   = startingId === assignmentId
    const isCompleting = completingId === assignmentId

    return (
        <div className="flex gap-3 flex-wrap">
          {assignment.status === "SCHEDULED" && (
              <Button
                  onClick={() => handleStartTask(assignmentId)}
                  disabled={isStarting}
                  className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
              >
                {isStarting ? <Spinner /> : <Navigation className="w-4 h-4 mr-2" />}
                Start & Navigate
              </Button>
          )}
          {assignment.status === "IN_PROGRESS" && (
              <Button
                  onClick={() => handleCompleteTask(assignmentId)}
                  disabled={isCompleting}
                  className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white hover:from-green-500 hover:to-emerald-500 border border-green-500/40"
              >
                {isCompleting ? <Spinner light /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Mark Complete
              </Button>
          )}
          {assignment.status === "COMPLETED" && (
              <span className="text-xs px-4 py-2 rounded-full border text-green-400 border-green-400/30 bg-green-400/10 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />Completed
          </span>
          )}
          {assignment.status === "CANCELLED" && (
              <span className="text-xs px-4 py-2 rounded-full border text-muted-foreground border-border/30 bg-muted/10">
            Cancelled
          </span>
          )}
        </div>
    )
  }

  // ─── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-10 h-10 rounded-full border-2 border-neon-cyan/40 border-t-neon-cyan animate-spin" />
            <div className="text-sm">Loading your assignments…</div>
          </div>
        </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────────
  if (error) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <Card className="p-6 max-w-md w-full bg-gradient-to-br from-card to-card/50 border-border/20 text-center">
            <div className="text-red-400 font-semibold mb-2">Failed to load data</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <Button
                onClick={loadAssignments}
                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background border border-neon-cyan/40"
            >
              Retry
            </Button>
          </Card>
        </div>
    )
  }

  // ─── Main Render ──────────────────────────────────────────────
  return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl" />
        </div>

        {/* Nav */}
        <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 text-neon-cyan"><InterveniaLogo /></div>
              <span className="font-bold text-lg tracking-tight">IntervenIA</span>
              <span className="text-sm text-muted-foreground">| Technician</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full" />
              </button>
              <Link href="/technician/profile" className="p-2 hover:bg-muted/50 rounded-lg transition-colors" title="Profile Settings">
                <Settings className="w-5 h-5" />
              </Link>
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </button>

              <button
                  onClick={() => { clearAuth(); router.push("/login") }}
                  className="p-2 hover:bg-red-400/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400"
                  title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>


            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">

          {/* ── Welcome ── */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Welcome, {profile?.username ?? auth?.username ?? "Technician"}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
            <span className="text-neon-cyan font-medium">
              {profile?.speciality?.replace(/_/g, " ") ?? "—"}
            </span>
              <span className="text-muted-foreground">Technician</span>
              {team && (
                  <>
                    <span className="text-border">·</span>
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{team.zone.replace(/_/g, " ")} Zone</span>
                  </>
              )}
              {team && (
                  <button
                      onClick={() => setShowTeam(!showTeam)}
                      className="ml-2 text-xs px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors flex items-center gap-1"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {showTeam ? "Hide Team" : "View My Team"}
                  </button>
              )}
            </div>
          </div>

          {/* ── My Team Panel ── */}
          {showTeam && team && (
              <Card className="mb-12 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-neon-cyan" />
                    My Team
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {team.zone.replace(/_/g, " ")} Zone
                </span>
                    <span className="text-border">·</span>
                    <span>{team.speciality.replace(/_/g, " ")}</span>
                  </div>
                </div>

                {/* Leader */}
                {leader && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Team Leader</p>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center">
                          <Star className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div>
                          <p className="font-semibold">{leader.username}</p>
                          <p className="text-xs text-muted-foreground">{leader.speciality?.replace(/_/g, " ")}</p>
                        </div>
                        <span className="ml-auto text-xs px-2 py-1 rounded-full border text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10">
                    Leader
                  </span>
                      </div>
                    </div>
                )}

                {/* Colleagues */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Colleagues ({teamMembers.filter((m) => m.role === "TECHNICIAN" && m.id !== userId).length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teamMembers
                        .filter((m) => m.role === "TECHNICIAN" && m.id !== userId)
                        .map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/20 hover:border-neon-cyan/20 transition-all"
                            >
                              <div className="w-9 h-9 rounded-full bg-muted/40 border border-border/30 flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{member.username}</p>
                                <p className="text-xs text-muted-foreground">{member.speciality?.replace(/_/g, " ")}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {member.isAvailable === true && (
                                    <span className="flex items-center gap-1 text-xs text-green-400">
                            <Wifi className="w-3 h-3" />Available
                          </span>
                                )}
                                {member.isAvailable === false && (
                                    <span className="flex items-center gap-1 text-xs text-orange-400">
                            <WifiOff className="w-3 h-3" />Busy
                          </span>
                                )}
                              </div>
                            </div>
                        ))}
                  </div>
                </div>
              </Card>
          )}

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Today's Tasks", value: todayTasks.length,    sub: "Tasks scheduled for today", icon: <Wrench className="w-5 h-5 text-neon-cyan" /> },
              { label: "Completed",     value: completedCount,       sub: "Successfully completed",    icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
              { label: "Upcoming",      value: upcomingCount,        sub: "Future scheduled tasks",    icon: <Clock className="w-5 h-5 text-neon-blue" /> },
              { label: "Equipment",     value: equipmentUniqueCount, sub: "Unique items assigned",     icon: <Package className="w-5 h-5 text-purple-400" /> },
            ].map(({ label, value, sub, icon }) => (
                <Card key={label} className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    {icon}
                  </div>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </Card>
            ))}
          </div>

          {/* ── View Toggle ── */}
          <div className="mb-8 flex items-center gap-4">
            {(["schedule", "timetable"] as const).map((v) => (
                <Button
                    key={v}
                    onClick={() => setView(v)}
                    variant={view === v ? "default" : "outline"}
                    className={
                      view === v
                          ? "bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                          : "border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                    }
                >
                  {v === "schedule"
                      ? <><Clock className="w-4 h-4 mr-2" />Daily Schedule</>
                      : <><Calendar className="w-4 h-4 mr-2" />Weekly Timetable</>
                  }
                </Button>
            ))}
          </div>

          {/* ══════════ TIMETABLE VIEW ══════════ */}
          {view === "timetable" ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-neon-cyan" />
                  Weekly Mission Timetable
                </h2>
                <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      <div className="font-semibold text-sm text-muted-foreground px-3 py-2">Time</div>
                      {weekDays.map((day) => (
                          <div key={day} className="font-semibold text-center px-3 py-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
                            {day}
                          </div>
                      ))}
                    </div>
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
                              )
                            })}
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-border/20 flex items-center gap-6 text-xs">
                    <span className="font-semibold text-muted-foreground">Urgency Levels:</span>
                    {[
                      { label: "Critical", color: "bg-red-400/20 border-red-400/30" },
                      { label: "High",     color: "bg-orange-400/20 border-orange-400/30" },
                      { label: "Medium",   color: "bg-yellow-400/20 border-yellow-400/30" },
                      { label: "Low",      color: "bg-green-400/20 border-green-400/30" },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded border ${color}`} />
                          <span>{label}</span>
                        </div>
                    ))}
                  </div>
                </Card>

                {/* Selected Task Detail Panel */}
                {selectedTask && (() => {
                  const task = assignedTasks.find((t) => t.id === selectedTask)
                  if (!task) return null
                  return (
                      <Card className="mt-6 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">Task Details</h3>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>Close</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {[
                            { label: "Incident",       value: task.incident },
                            { label: "Location",       value: task.location },
                            { label: "Scheduled Time", value: task.scheduledTime },
                            { label: "Duration",       value: task.estimatedDuration },
                            { label: "Reporter",       value: task.reporter },
                          ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                                <p className="font-semibold">{value}</p>
                              </div>
                          ))}
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Urgency</p>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(task.urgency)} capitalize inline-block`}>
                        {task.urgency} priority
                      </span>
                          </div>
                        </div>
                        {task.equipment.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground mb-2">Required Equipment</p>
                              <div className="flex flex-wrap gap-2">
                                {task.equipment.map((item, idx) => (
                                    <span key={idx} className="text-xs px-3 py-1 rounded-full bg-muted/30 border border-neon-cyan/20">{item}</span>
                                ))}
                              </div>
                            </div>
                        )}
                        <ActionButtons assignmentId={task.id} />
                      </Card>
                  )
                })()}
              </div>

          ) : (
              /* ══════════ DAILY SCHEDULE VIEW ══════════ */
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-neon-cyan" />
                  Today's Schedule
                </h2>

                {assignedTasks.length === 0 ? (
                    <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Wrench className="w-8 h-8" />
                        <div className="font-semibold">No assignments yet</div>
                        <div className="text-sm">Your scheduled tasks will appear here once planning is run</div>
                      </div>
                    </Card>
                ) : todayTasks.length === 0 ? (
                    <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Clock className="w-8 h-8" />
                        <div className="font-semibold">No tasks scheduled for today</div>
                        <div className="text-sm">Check the Weekly Timetable for upcoming assignments</div>
                      </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                      {todayTasks.map((task) => (
                          <Card
                              key={task.id}
                              className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <h3 className="font-semibold text-xl">{task.incident}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(task.urgency)} capitalize`}>
                            {task.urgency} priority
                          </span>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                            {task.status.replace("_", " ")}
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
                                    <Clock className="w-4 h-4" />
                                    <span>{task.estimatedDuration}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Reported by: {task.reporter}</span>
                                  </div>
                                </div>

                                {task.equipment.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-sm text-muted-foreground mb-2">Required Equipment:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {task.equipment.map((item, idx) => (
                                            <span key={idx} className="text-xs px-3 py-1 rounded-full bg-muted/30 border border-neon-cyan/20">
                                  <Package className="w-3 h-3 inline mr-1" />
                                              {item}
                                </span>
                                        ))}
                                      </div>
                                    </div>
                                )}

                                <ActionButtons assignmentId={task.id} />
                              </div>
                            </div>
                          </Card>
                      ))}
                    </div>
                )}
              </div>
          )}
        </main>
      </div>
  )
}
