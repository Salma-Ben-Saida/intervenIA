"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Package, Users, MapPin, Clock, AlertTriangle, Menu, Bell,
  Wrench, Activity, TrendingUp, Shield, BarChart3, Zap,
  LogOut, Loader2, RefreshCw, CheckCircle, XCircle, PlayCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getAuth, clearAuth } from "@/lib/auth"

const API = "http://localhost:8080"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Team {
  id: string
  leaderId: string
  speciality: string
  zone: string
  technicianIds: string[]
}

interface UserDTO {
  id: string
  username: string
  email: string
  role: string
  isAvailable: boolean
  speciality: string
  teamId: string | null
}

interface Incident {
  id: string
  name?: string
  description?: string
  incidentStatus: string
  urgencyLevel?: string
  zone?: string
  submittedAt?: string
  location?: { lat: number; lng: number }
  speciality?: string[]
  incidentType?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (s?: string) => s?.replace(/_/g, " ") ?? "—"

const getUrgencyColor = (urgency: string) => {
  switch (urgency?.toLowerCase()) {
    case "critical": return "text-red-400 border-red-400/30 bg-red-400/10"
    case "high":     return "text-orange-400 border-orange-400/30 bg-orange-400/10"
    case "medium":   return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    case "low":      return "text-green-400 border-green-400/30 bg-green-400/10"
    default:         return "text-muted-foreground border-border/30 bg-muted/10"
  }
}

const getStatusColor = (incidentStatus: string) => {
  switch (incidentStatus?.toUpperCase()) {
    case "CLOSED":
    case "RESOLVED":    return "text-green-400 border-green-400/30 bg-green-400/10"
    case "IN_PROGRESS": return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
    case "ASSIGNED":
    case "SCHEDULED":   return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
    case "OPEN":
    case "PENDING":     return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    default:            return "text-muted-foreground border-border/30 bg-muted/10"
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManagerDashboard() {
  const router = useRouter()

  const [token, setToken]             = useState("")
  const [managerZone, setManagerZone] = useState("")
  const [speciality, setSpeciality]   = useState("")
  const [username, setUsername]       = useState("")
  const [h, setH]                     = useState<Record<string, string>>({})
  const [authReady, setAuthReady]     = useState(false)
  const [selectedZone, setSelectedZone] = useState<string>("")


  useEffect(() => {
    const auth = getAuth()
    if (!auth) { router.push("/auth"); return }
    setToken(auth.token)
    setManagerZone(auth.zone ?? "")
    setSpeciality(auth.speciality ?? "")
    setUsername(auth.username ?? "Manager")
    setH({ "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" })
    setSelectedZone(auth.zone ?? "")
    setAuthReady(true)
  }, [])

// Trigger data load only after auth is ready
  useEffect(() => {
    if (!authReady) return
    const auth = getAuth()
    if (!auth) return
    loadDashboard(
        { "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" },
        auth.zone ?? ""
    )
  }, [authReady])

  // ── State ──────────────────────────────────────────────────────────────────
  const [timeFilter, setTimeFilter]     = useState<"today" | "week" | "month">("today")
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)

  const [teams, setTeams]               = useState<Team[]>([])
  const [technicians, setTechnicians]   = useState<UserDTO[]>([])
  const [incidents, setIncidents]       = useState<Incident[]>([])
  const [leaderNames, setLeaderNames]   = useState<Record<string, string>>({})

  // Planning modal state
  type PlanningPhase = "idle" | "confirm" | "running" | "done" | "error"
  interface PlanningAssignmentRes {
    id: string
    incidentId: string
    speciality?: string
    teamId?: string
    technicianId?: string
    startTime?: string
    endTime?: string
    zone?: string
    status?: string
  }
  interface PlanningSolutionRes {
    assignments?: PlanningAssignmentRes[]
    feasible?: boolean
    solverMessage?: string
  }
  const [planningOpen, setPlanningOpen]   = useState(false)
  const [planningPhase, setPlanningPhase] = useState<PlanningPhase>("confirm")
  const [planningResult, setPlanningResult] = useState<PlanningSolutionRes | null>(null)
  const [planningError, setPlanningError] = useState<string | null>(null)

  // ── Data loading ───────────────────────────────────────────────────────────
  const loadDashboard = async (
      headers = h,
      zone    = managerZone
  ) => {
    if (!authReady && !headers["Authorization"]) return
    setLoading(true)
    setError(null)
    try {
      const [teamsRes, techRes, incRes] = await Promise.all([
        fetch(`${API}/api/teams`,                 { headers }),
        fetch(`${API}/api/users/role/TECHNICIAN`, { headers }),
        fetch(`${API}/api/incidents/search/${zone || "NORTH"}`, { headers }),
      ])

      if ([teamsRes, techRes].some(r => r.status === 401)) {
        clearAuth(); router.push("/auth"); return
      }

      const teamsData: Team[]     = teamsRes.ok ? await teamsRes.json() : []
      const techDataAll: UserDTO[] = techRes.ok  ? await techRes.json()  : []
      const incData:   Incident[]  = incRes.ok  ? await incRes.json()   : []

      // Restrict to manager's zone: teams and technicians
      const myTeams = zone
          ? teamsData.filter(t => t.zone === zone)
          : teamsData
      setTeams(myTeams)

      const myTeamIds = new Set(myTeams.map(t => t.id))
      const myTechs = techDataAll.filter(t => t.teamId ? myTeamIds.has(t.teamId) : false)
      setTechnicians(myTechs)
      setIncidents(incData)

      // Resolve leader names for visible teams only
      const ids = [...new Set(myTeams.map(t => t.leaderId).filter(Boolean))] as string[]
      if (ids.length > 0) {
        const pairs = await Promise.all(ids.map(async id => {
          try {
            const r = await fetch(`${API}/api/users/${id}`, { headers })
            if (!r.ok) return [id, "Unknown"] as const
            const u: UserDTO = await r.json()
            return [id, u.username] as const
          } catch { return [id, "Unknown"] as const }
        }))
        setLeaderNames(Object.fromEntries(pairs))
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = {
    totalIncidents:    incidents.length,
    inProgress:        incidents.filter(i => ["IN_PROGRESS"].includes(i.incidentStatus?.toUpperCase())).length,
    pending:           incidents.filter(i => ["OPEN","PENDING"].includes(i.incidentStatus?.toUpperCase())).length,
    completed:         incidents.filter(i => ["CLOSED","RESOLVED"].includes(i.incidentStatus?.toUpperCase())).length,
    totalTechnicians:  technicians.length,
    activeTechnicians: technicians.filter(t => t.isAvailable).length,
    totalTeams:        teams.length,
  }

  // Filter incidents: show zone-filtered, with technicians from this zone if possible
  const zoneTechnicians = managerZone
      ? technicians.filter(t => {
        const myTeamIds = teams.map(t => t.id)
        return myTeamIds.includes(t.teamId ?? "")
      })
      : technicians

  const filteredIncidents = incidents.filter(i => {
    // Filter by selected zone dropdown
    if (selectedZone !== "all" && i.zone !== selectedZone) return false
    // Always filter by manager's zone
    if (managerZone && i.zone !== managerZone) return false
    // Filter by manager's speciality — incident must include the manager's speciality
    if (speciality && i.speciality && !i.speciality.includes(speciality)) return false
    return true
  })

  const zones = [...new Set(incidents.map(i => i.zone).filter(Boolean))] as string[]

  const handleLogout = () => { clearAuth(); router.push("/auth") }

  // ── Actions: Run Weekly Planning (zone-restricted) ──
  const runWeeklyPlanning = async () => {
    if (!token || !managerZone) {
      setPlanningError("Authentication or manager zone missing. Please re-login.")
      setPlanningPhase("error")
      return
    }
    setPlanningPhase("running")
    setPlanningError(null)
    setPlanningResult(null)

    try {
      const url = `${API}/api/planning/run-weekly?zone=${encodeURIComponent(managerZone)}`
      const res = await fetch(url, {
        method: "POST",
        headers: h,
        body: JSON.stringify({ zone: managerZone })
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Planning request failed with status ${res.status}`)
      }

      const data: PlanningSolutionRes = await res.json()
      // Extra safety: filter assignments to managerZone only if zone field exists
      if (data?.assignments) {
        data.assignments = data.assignments.filter(a => !a.zone || String(a.zone) === String(managerZone))
      }
      setPlanningResult(data)
      setPlanningPhase("done")

      // Refresh dashboard data to reflect new assignments/planning
      await loadDashboard()
    } catch (e: any) {
      setPlanningError(e?.message ?? "Failed to run planning")
      setPlanningPhase("error")
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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
              <span className="text-sm text-muted-foreground">| Manager Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                <Shield className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-medium">{managerZone ? `${managerZone} Zone` : "All Zones"}</span>
              </div>
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
              </button>
              <button
                  onClick={() => {
                    const auth = getAuth()
                    if (!auth) return
                    loadDashboard(
                        { "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" },
                        auth.managedZone ?? ""
                    )
                  }}
                  disabled={loading}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-neon-cyan" : ""}`} />
              </button>
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-400/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400"
                  title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">

          {/* ── Header ── */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Welcome, {username}
            </h1>
            <p className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap">
              {speciality && <span className="text-neon-cyan">{fmt(speciality)}</span>}
              {speciality && <span>·</span>}
              <span>Zone Manager</span>
              {managerZone && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />{managerZone}
                </span>
                  </>
              )}
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
              <Card className="p-4 mb-8 border-red-400/30 bg-red-400/5 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm flex-1">{error}</p>
                <Button size="sm" variant="outline" onClick={() => {
                  const auth = getAuth()
                  if (!auth) return
                  loadDashboard(
                      { "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" },
                      auth.zone ?? ""
                  )
                }} className="border-red-400/30">
                  Retry
                </Button>
              </Card>
          )}

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: "Total Incidents",  value: stats.totalIncidents,   sub: "Across all zones",       icon: <AlertTriangle className="w-5 h-5 text-neon-cyan" /> },
              { label: "In Progress",      value: stats.inProgress,       sub: "Active now",             icon: <Activity className="w-5 h-5 text-neon-blue" /> },
              { label: "Pending",          value: stats.pending,          sub: "Awaiting assignment",    icon: <Clock className="w-5 h-5 text-yellow-400" /> },
              { label: "Completed",        value: stats.completed,        sub: "Resolved incidents",     icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
              { label: "Technicians",      value: stats.totalTechnicians, sub: `${stats.activeTechnicians} available`, icon: <Wrench className="w-5 h-5 text-neon-cyan" /> },
            ].map(({ label, value, sub, icon }) => (
                <Card key={label} className="p-5 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    {icon}
                  </div>
                  {loading
                      ? <div className="h-8 w-16 bg-muted/30 rounded animate-pulse" />
                      : <p className="text-3xl font-bold">{value}</p>
                  }
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </Card>
            ))}
          </div>

          {/* ── Quick Actions ── */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/manager/equipment">
              <Button className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                <Package className="w-4 h-4 mr-2" />Manage Equipment
              </Button>
            </Link>
            <Link href="/manager/users">
              <Button className="bg-gradient-to-r from-neon-blue/80 to-neon-cyan/80 text-background hover:from-neon-blue hover:to-neon-cyan border border-neon-blue/40">
                <Users className="w-4 h-4 mr-2" />Manage Users & Teams
              </Button>
            </Link>
            {/* New primary action: Run Weekly Planning / Assignments */}
            <Button
              onClick={() => { setPlanningOpen(true); setPlanningPhase("confirm"); setPlanningResult(null); setPlanningError(null); }}
              className="bg-gradient-to-r from-red-500/80 via-orange-500/80 to-neon-cyan/80 text-background hover:from-red-500 hover:via-orange-500 hover:to-neon-cyan border border-red-400/40 shadow-md"
              title="Run the weekly optimization for your zone only"
            >
              <PlayCircle className="w-4 h-4 mr-2" />Run Weekly Planning / Assignments
            </Button>
          </div>

          {/* ── Teams ── */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-neon-cyan" />
              My Teams
              {managerZone && <span className="text-sm font-normal text-muted-foreground ml-2">· {managerZone} Zone</span>}
            </h2>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mr-3" />
                  <span className="text-muted-foreground">Loading teams...</span>
                </div>
            ) : teams.length === 0 ? (
                <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No teams found for your zone.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map(team => {
                    const memberCount = team.technicianIds?.length ?? 0
                    return (
                        <Card key={team.id} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{fmt(team.speciality)}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Leader: <span className="text-foreground ml-1">{leaderNames[team.leaderId] ?? "Unknown"}</span>
                              </p>
                            </div>
                            <div className="text-right">
                        <span className="text-xs px-2 py-1 rounded-full border text-neon-blue border-neon-blue/30 bg-neon-blue/10">
                          {memberCount} technician{memberCount !== 1 ? "s" : ""}
                        </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground mb-1">Zone</p>
                              <p className="font-semibold text-neon-cyan flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{team.zone}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Speciality</p>
                              <p className="font-semibold">{fmt(team.speciality)}</p>
                            </div>
                          </div>

                          {/* Member count bar */}
                          <div>
                            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                              <div
                                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full transition-all duration-500"
                                  style={{ width: memberCount > 0 ? "100%" : "0%" }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{memberCount} member{memberCount !== 1 ? "s" : ""} assigned</p>
                          </div>
                        </Card>
                    )
                  })}
                </div>
            )}
          </section>

          {/* ── Incidents ── */}
          <section>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-neon-cyan" />
                Incidents
              </h2>
              <div className="flex gap-2 flex-wrap">

                {(["today", "week", "month"] as const).map(f => (
                    <Button
                        key={f}
                        variant={timeFilter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter(f)}
                        className={timeFilter === f
                            ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                            : "border-border/30 hover:border-neon-cyan/40"}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
              </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mr-3" />
                  <span className="text-muted-foreground">Loading incidents...</span>
                </div>
            ) : filteredIncidents.length === 0 ? (
                <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No incidents found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                  {filteredIncidents.map(incident => (
                      <Card
                          key={incident.id}
                          className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-semibold text-lg">
                                {incident.name ?? incident.description ?? "Incident"}
                              </h3>
                              {incident.urgencyLevel && (
                                  <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getUrgencyColor(incident.urgencyLevel)}`}>
                            {incident.urgencyLevel}
                          </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(incident.incidentStatus)}`}>
                          {incident.incidentStatus?.replace(/_/g, " ")}
                        </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="truncate">{incident.location?.lat ?? "-"} — {incident.location?.lng?? "-"}</span>
                              </div>
                              {incident.zone && (
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 shrink-0" />
                                    <span className="text-neon-cyan">{incident.zone}</span>
                                  </div>
                              )}
                              {incident.submittedAt && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    <span>{new Date(incident.submittedAt).toLocaleString()}</span>
                                  </div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {incident.incidentStatus?.toUpperCase() === "CLOSED" || incident.incidentStatus?.toUpperCase() === "RESOLVED" ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : incident.urgencyLevel?.toLowerCase() === "critical" ? (
                                <XCircle className="w-6 h-6 text-red-400" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                            )}
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>
            )}
          </section>


          {/* ── Planning Modal ── */}
          <Dialog open={planningOpen} onOpenChange={(o) => { setPlanningOpen(o); if (!o) { setPlanningPhase("confirm"); setPlanningError(null); setPlanningResult(null); } }}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-400">Zone-restricted</span>
                  Run Weekly Planning / Assignments
                </DialogTitle>
                <DialogDescription>
                  This operation triggers the optimization solver for your zone only. It will generate assignments for new incidents and update the weekly planning. Other zones are never included.
                </DialogDescription>
              </DialogHeader>

              {planningPhase === "confirm" && (
                <div className="space-y-4">
                  <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Manager Zone</div>
                      <div className="text-sm font-semibold text-neon-cyan flex items-center gap-1"><Shield className="w-4 h-4" />{managerZone || "—"}</div>
                    </div>
                  </Card>
                  <p className="text-sm text-muted-foreground">
                    Please confirm you want to run the weekly planning. This may take up to a minute. You can continue to browse; results will appear here once completed.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPlanningOpen(false)}>Cancel</Button>
                    <Button onClick={runWeeklyPlanning} className="bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30">
                      <PlayCircle className="w-4 h-4 mr-2" />Run Now
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {planningPhase === "running" && (
                <div className="py-10 flex flex-col items-center text-center gap-3">
                  <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                  <p className="text-sm text-muted-foreground">Running solver for zone <span className="text-neon-cyan font-medium">{managerZone}</span>…</p>
                </div>
              )}

              {planningPhase === "done" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {planningResult?.feasible ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm">
                      {planningResult?.feasible ? "Feasible plan generated" : "No feasible plan — see solver message"}
                    </span>
                  </div>
                  {planningResult?.solverMessage && (
                    <Card className="p-3 text-sm text-muted-foreground border-border/30 bg-muted/10">
                      {planningResult.solverMessage}
                    </Card>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Assignments ({planningResult?.assignments?.length ?? 0}) — {managerZone}</h4>
                    {planningResult?.assignments && planningResult.assignments.length > 0 ? (
                      <div className="max-h-64 overflow-auto rounded border border-border/20">
                        <div className="divide-y divide-border/20">
                          {planningResult.assignments.slice(0, 50).map((a) => (
                            <div key={a.id} className="px-3 py-2 text-sm grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                              <div className="truncate"><span className="text-muted-foreground">Incident:</span> {a.incidentId}</div>
                              <div className="truncate"><span className="text-muted-foreground">Technician:</span> {a.technicianId || "TBD"}</div>
                              <div className="truncate"><span className="text-muted-foreground">Start:</span> {a.startTime ? new Date(a.startTime).toLocaleString() : "—"}</div>
                              <div className="truncate"><span className="text-muted-foreground">End:</span> {a.endTime ? new Date(a.endTime).toLocaleString() : "—"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Card className="p-4 text-sm text-muted-foreground">No assignments were produced for your zone.</Card>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setPlanningOpen(false)}>Close</Button>
                  </DialogFooter>
                </div>
              )}

              {planningPhase === "error" && (
                <div className="space-y-4">
                  <Card className="p-4 border-red-400/30 bg-red-400/5 text-red-400 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{planningError || "An unexpected error occurred."}</span>
                    </div>
                  </Card>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setPlanningPhase("confirm"); setPlanningError(null); }}>Back</Button>
                    <Button onClick={runWeeklyPlanning} className="bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30">
                      Retry
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </main>
      </div>
  )
}
