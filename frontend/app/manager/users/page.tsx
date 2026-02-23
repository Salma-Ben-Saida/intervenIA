"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  Menu, Bell, Users, ArrowLeft, Search, Plus, Edit, Trash2,
  AlertCircle, Loader2, Shield, Wrench, User, Filter,
  ChevronDown, ChevronUp, ChevronRight, UserMinus, MapPin, Star
} from "lucide-react"

const API_USERS = "http://localhost:8080/api/users"
const API_TEAMS = "http://localhost:8080/api/teams"

type Role = "CITIZEN" | "TECHNICIAN" | "LEADER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN"
type ProfessionalSpeciality =
    | "PUBLIC_LIGHTING" | "ELECTRICITY" | "TRAFFIC_SIGNALS" | "GAZ"
    | "SANITATION" | "ROADS" | "ENVIRONMENT" | "FIRE_SAFETY"
    | "TELECOMMUNICATION_IOT" | "EMERGENCY"
type Zone = "NORTH" | "SOUTH" | "CENTER"

interface Team {
  id: string
  leaderId: string
  speciality: ProfessionalSpeciality
  zone: Zone
  technicianIds: string[]
}

interface UserDTO {
  id: string
  email: string
  username: string
  password?: string
  role: Role
  isAvailable: boolean
  speciality: ProfessionalSpeciality
  team: Team | null
  teamId: string | null
  shiftStart: number
  shiftEnd: number
  maxDailyHours: number
  onCall: boolean
}

const ROLES: Role[] = ["CITIZEN", "TECHNICIAN", "LEADER", "MANAGER", "ADMIN", "SUPER_ADMIN"]
// Manager can only manage technicians and leaders
const MANAGEABLE_ROLES: Role[] = ["TECHNICIAN", "LEADER"]
const SPECIALITIES: ProfessionalSpeciality[] = [
  "PUBLIC_LIGHTING", "ELECTRICITY", "TRAFFIC_SIGNALS", "GAZ",
  "SANITATION", "ROADS", "ENVIRONMENT", "FIRE_SAFETY",
  "TELECOMMUNICATION_IOT", "EMERGENCY"
]
const ZONES: Zone[] = ["NORTH", "SOUTH", "CENTER"]

const fmt = (s?: string) => s?.replace(/_/g, " ") ?? "—"
const initials = (name?: string) =>
    name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"

// Utility to shorten ObjectId-like strings for badges
const shortId = (id?: string | null) => (id ? id.slice(0, 8) + "..." : "—")

const getRoleColor = (role: Role) => {
  switch (role) {
    case "LEADER":      return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
    case "TECHNICIAN":  return "text-green-400 border-green-400/30 bg-green-400/10"
    default:            return "text-muted-foreground border-border/30 bg-muted/10"
  }
}

const getRoleIcon = (role: Role) => {
  switch (role) {
    case "LEADER":     return <Star className="w-3 h-3" />
    case "TECHNICIAN": return <Wrench className="w-3 h-3" />
    default:           return <User className="w-3 h-3" />
  }
}

export default function ManagerUsersPage() {
  const [activeTab, setActiveTab] = useState<"users" | "teams">("users")

  // USERS STATE
  const [users, setUsers] = useState<UserDTO[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<Role | "">("")
  const [filterSpeciality, setFilterSpeciality] = useState<ProfessionalSpeciality | "">("")
  const [filterEmail, setFilterEmail] = useState("")
  const [savingUser, setSavingUser] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editUserData, setEditUserData] = useState<Partial<UserDTO>>({})
  const [newUser, setNewUser] = useState<Partial<UserDTO>>({
    email: "", username: "", password: "",
    role: "TECHNICIAN", speciality: "ELECTRICITY",
    shiftStart: 8, shiftEnd: 16, maxDailyHours: 8,
    onCall: false, isAvailable: true,
  })

  // TEAMS STATE
  const [teams, setTeams] = useState<Team[]>([])
  const [teamMembers, setTeamMembers] = useState<Record<string, UserDTO[]>>({})
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [teamError, setTeamError] = useState<string | null>(null)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)
  const [loadingMembers, setLoadingMembers] = useState<string | null>(null)
  const [savingTeam, setSavingTeam] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editTeamZone, setEditTeamZone] = useState<Zone>("NORTH")
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [newTeamTechInput, setNewTeamTechInput] = useState("")
  const [newTeam, setNewTeam] = useState<{ speciality: ProfessionalSpeciality; zone: Zone; leaderId: string; technicianIds: string[] }>({
    speciality: "ELECTRICITY", zone: "NORTH", leaderId: "", technicianIds: []
  })

  // Teams tab filters and leader names
  const [teamFilterSpeciality, setTeamFilterSpeciality] = useState<ProfessionalSpeciality | "">("")
  const [teamFilterZone, setTeamFilterZone] = useState<Zone | "">("")
  const [teamFilterLeaderEmail, setTeamFilterLeaderEmail] = useState("")
  const [leaderEmailSearching, setLeaderEmailSearching] = useState(false)
  const [leaderEmailMatchedIds, setLeaderEmailMatchedIds] = useState<Set<string> | null>(null)
  const [leaderNames, setLeaderNames] = useState<Record<string, string>>({})

  // Refs to team cards for smooth scrolling when navigating from Users tab
  const teamRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (activeTab === "teams") fetchTeams()
  }, [activeTab])

  // Debounced leader email contains search for Teams tab (300ms)
  useEffect(() => {
    const q = teamFilterLeaderEmail.trim()
    if (!q) {
      setLeaderEmailMatchedIds(null)
      setLeaderEmailSearching(false)
      return
    }
    setLeaderEmailSearching(true)
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`${API_USERS}/email/contains/${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error("Search failed")
        const list: UserDTO[] = await res.json()
        // Managers can only target leaders for leader email filter
        const leaderList = list.filter(u => u.role === "LEADER")
        const ids = new Set(leaderList.map(u => u.id))
        setLeaderEmailMatchedIds(ids)
      } catch {
        setLeaderEmailMatchedIds(new Set())
      } finally {
        setLeaderEmailSearching(false)
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [teamFilterLeaderEmail])


  // Debounced email contains search (300ms)
  const [emailSearching, setEmailSearching] = useState(false)
  useEffect(() => {
    const q = filterEmail.trim()
    if (!q) return
    setHasSearched(true)
    setEmailSearching(true)
    setUserError(null)
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`${API_USERS}/email/contains/${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error("Search failed")
        let list: UserDTO[] = await res.json()
        // Manager can only fetch leaders and technicians
        list = list.filter(u => MANAGEABLE_ROLES.includes(u.role))
        if (filterRole) list = list.filter(u => u.role === filterRole)
        if (filterSpeciality) list = list.filter(u => (u.speciality as any) === filterSpeciality)
        setUsers(list)
      } catch (e: any) {
        setUserError(e.message)
        setUsers([])
      } finally {
        setEmailSearching(false)
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [filterEmail, filterRole, filterSpeciality])

  const fetchTeams = async () => {
    setLoadingTeams(true)
    setTeamError(null)
    try {
      const res = await fetch(API_TEAMS)
      if (!res.ok) throw new Error("Failed to fetch teams")
      const list: Team[] = await res.json()
      setTeams(list)
      // Batch fetch leader usernames
      const uniqueLeaderIds = Array.from(new Set(list.map(t => t.leaderId).filter(Boolean))) as string[]
      if (uniqueLeaderIds.length > 0) {
        const results = await Promise.all(uniqueLeaderIds.map(async (id) => {
          try {
            const r = await fetch(`${API_USERS}/${id}`)
            if (!r.ok) throw new Error("not found")
            const u: UserDTO = await r.json()
            return [id, u.username] as const
          } catch {
            return [id, undefined] as const
          }
        }))
        const map: Record<string, string> = {}
        for (const [id, name] of results) {
          if (name) map[id] = name
        }
        setLeaderNames(map)
      } else {
        setLeaderNames({})
      }
    } catch (e: any) {
      setTeamError(e.message)
    } finally {
      setLoadingTeams(false)
    }
  }

  const handleExpandTeam = async (team: Team) => {
    if (expandedTeam === team.id) { setExpandedTeam(null); return }
    setExpandedTeam(team.id)
    if (teamMembers[team.id]) return
    setLoadingMembers(team.id)
    try {
      const res = await fetch(`${API_USERS}/team/${team.id}`)
      if (!res.ok) throw new Error("Failed to fetch members")
      const members = await res.json()
      setTeamMembers(prev => ({ ...prev, [team.id]: members }))
    } catch {
      setTeamMembers(prev => ({ ...prev, [team.id]: [] }))
    } finally {
      setLoadingMembers(null)
    }
  }

  // Navigate to a specific team from Users tab: switch tab, ensure data, expand, and scroll
  const navigateToTeam = async (teamId: string) => {
    if (!teamId) return
    // Switch to Teams tab (useEffect will also attempt fetch)
    setActiveTab("teams")

    // Ensure teams are loaded before we try to expand
    if (!teams || teams.length === 0) {
      try {
        await fetchTeams()
      } catch {
        // existing error UI will handle this
      }
    }

    // Try to find the team and expand it
    const team = teams.find(t => t.id === teamId)
    if (team) {
      await handleExpandTeam(team)
    } else {
      // Fallback so once it appears, it's marked expanded
      setExpandedTeam(teamId)
    }

    // Smooth scroll to the team card after the DOM updates
    setTimeout(() => {
      teamRefs.current[teamId]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  // SEARCH — fetch by most selective filter, client-side intersect
  const handleSearch = async () => {
    // Only handle role/speciality searches here; email search is live & debounced above
    if (!filterRole && !filterSpeciality) return
    if (filterEmail.trim()) return
    setLoadingUsers(true)
    setUserError(null)
    setHasSearched(true)
    try {
      let fetched: UserDTO[] = []
      if (filterSpeciality) {
        const res = await fetch(`${API_USERS}/speciality/${filterSpeciality}`)
        if (!res.ok) throw new Error("Search failed")
        fetched = await res.json()
        // Only allow leaders and technicians for manager
        fetched = fetched.filter(u => MANAGEABLE_ROLES.includes(u.role))
        if (filterRole) fetched = fetched.filter(u => u.role === filterRole)
      } else if (filterRole) {
        const res = await fetch(`${API_USERS}/role/${filterRole}`)
        if (!res.ok) throw new Error("Search failed")
        fetched = await res.json()
        // Only allow leaders and technicians for manager
        fetched = fetched.filter(u => MANAGEABLE_ROLES.includes(u.role))
      }
      setUsers(fetched)
    } catch (e: any) {
      setUserError(e.message)
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const clearFilters = () => {
    setFilterRole(""); setFilterSpeciality(""); setFilterEmail("")
    setUsers([]); setHasSearched(false); setUserError(null)
  }

  const handleAddUser = async () => {
    setSavingUser(true)
    try {
      const res = await fetch(API_USERS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error(await res.text())
      const created: UserDTO = await res.json()
      setUsers(prev => [created, ...prev])
      setShowAddUser(false)
      setNewUser({ email: "", username: "", password: "", role: "TECHNICIAN", speciality: "ELECTRICITY", shiftStart: 8, shiftEnd: 16, maxDailyHours: 8, onCall: false, isAvailable: true })
    } catch (e: any) { alert("Error: " + e.message) }
    finally { setSavingUser(false) }
  }

  const handleUpdateUser = async (id: string) => {
    setSavingUser(true)
    try {
      const res = await fetch(`${API_USERS}/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUserData),
      })
      if (!res.ok) throw new Error(await res.text())
      const updated: UserDTO = await res.json()
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
      setEditingUserId(null)
    } catch (e: any) { alert("Error: " + e.message) }
    finally { setSavingUser(false) }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return
    try {
      const res = await fetch(`${API_USERS}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e: any) { alert("Error: " + e.message) }
  }

  const handleCreateTeam = async () => {
    setSavingTeam(true)
    try {
      const res = await fetch(API_TEAMS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      })
      if (!res.ok) throw new Error(await res.text())
      const created: Team = await res.json()
      setTeams(prev => [created, ...prev])
      setShowAddTeam(false)
      setNewTeam({ speciality: "ELECTRICITY", zone: "NORTH", leaderId: "", technicianIds: [] })
      setNewTeamTechInput("")
    } catch (e: any) { alert("Error: " + e.message) }
    finally { setSavingTeam(false) }
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Delete this team? Members will be unassigned.")) return
    try {
      const res = await fetch(`${API_TEAMS}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setTeams(prev => prev.filter(t => t.id !== id))
      if (expandedTeam === id) setExpandedTeam(null)
    } catch (e: any) { alert("Error: " + e.message) }
  }

  const handleUpdateTeamZone = async (teamId: string) => {
    setSavingTeam(true)
    try {
      const res = await fetch(`${API_TEAMS}/${teamId}/zone?zone=${editTeamZone}`, { method: "PUT" })
      if (!res.ok) throw new Error(await res.text())
      const updated: Team = await res.json()
      setTeams(prev => prev.map(t => t.id === teamId ? updated : t))
      setEditingTeamId(null)
    } catch (e: any) { alert("Error: " + e.message) }
    finally { setSavingTeam(false) }
  }

  const handleRemoveTechnician = async (teamId: string, techId: string) => {
    if (!confirm("Remove this technician from the team?")) return
    try {
      const res = await fetch(`${API_TEAMS}/${teamId}/remove-technician/${techId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setTeamMembers(prev => ({ ...prev, [teamId]: (prev[teamId] ?? []).filter(m => m.id !== techId) }))
      setTeams(prev => prev.map(t =>
          t.id === teamId ? { ...t, technicianIds: t.technicianIds.filter(id => id !== techId) } : t
      ))
    } catch (e: any) { alert("Error: " + e.message) }
  }

  // Derived filtered teams for Teams tab
  const filteredTeams = teams.filter(t => {
    if (teamFilterSpeciality && t.speciality !== teamFilterSpeciality) return false
    if (teamFilterZone && t.zone !== teamFilterZone) return false
    if (teamFilterLeaderEmail.trim()) {
      // if search ran but produced no matches, leaderEmailMatchedIds could be empty Set
      if (!leaderEmailMatchedIds) return true // still typing or empty input handled earlier
      return leaderEmailMatchedIds.has(t.leaderId)
    }
    return true
  })

  const clearTeamFilters = () => {
    setTeamFilterSpeciality("")
    setTeamFilterZone("")
    setTeamFilterLeaderEmail("")
    setLeaderEmailMatchedIds(null)
  }

  return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl" />
        </div>

        <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/manager" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 text-neon-cyan"><InterveniaLogo /></div>
              <span className="font-bold text-lg tracking-tight">IntervenIA</span>
              <span className="text-sm text-muted-foreground">| People Management</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors"><Menu className="w-5 h-5" /></button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link href="/manager">
              <Button variant="outline" className="mb-4 border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">People Management</h1>
            <p className="text-muted-foreground text-lg">Manage users and teams across all zones</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted/20 border border-border/20 rounded-xl w-fit mb-8">
            {(["users", "teams"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === tab
                                ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}>
                  {tab === "users" ? <><User className="w-4 h-4" />Users</> : <><Users className="w-4 h-4" />Teams</>}
                </button>
            ))}
          </div>

          {/* ══════════ USERS TAB ══════════ */}
          {activeTab === "users" && (
              <div>
                <Card className="p-6 mb-8 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-neon-cyan" />
                    <h2 className="text-lg font-semibold">Search Users</h2>
                    <span className="text-xs text-muted-foreground ml-1">— combine filters for precise results</span>
                  </div>

                  {/* Top email search bar (contains, debounced) */}
                  <div className="mb-4">
                    <label className="block text-xs text-muted-foreground mb-2">Email</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={filterEmail}
                        onChange={e => setFilterEmail(e.target.value)}
                        placeholder="Search by email..."
                        className="w-full pl-9 pr-9 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                      />
                      {emailSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan animate-spin" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Type to search by email. Results update live.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Role</label>
                      <select value={filterRole} onChange={e => setFilterRole(e.target.value as Role | "")}
                              className="w-full px-4 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground focus:outline-none text-sm">
                        <option value="">Any role</option>
                        {MANAGEABLE_ROLES.map(r => <option key={r} value={r}>{fmt(r)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Speciality</label>
                      <select
                        value={filterSpeciality}
                        onChange={e => setFilterSpeciality(e.target.value as ProfessionalSpeciality | "")}
                        disabled={filterRole === "CITIZEN"}
                        className={`w-full px-4 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground focus:outline-none text-sm ${filterRole === "CITIZEN" ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Any speciality</option>
                        {SPECIALITIES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                      </select>
                      {filterRole === "CITIZEN" && (
                        <p className="text-[11px] text-muted-foreground mt-1">Citizens have no speciality</p>
                      )}
                    </div>
                    <div>
                      {/* reserved column for future filters */}
                    </div>
                  </div>

                  {/* Active filter chips */}
                  {(filterRole || filterSpeciality || filterEmail) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {filterRole && (
                            <span className="text-xs px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center gap-1">
                      Role: {fmt(filterRole)}<button onClick={() => setFilterRole("")} className="ml-1 hover:text-white font-bold">×</button>
                    </span>
                        )}
                        {filterSpeciality && (
                            <span className="text-xs px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center gap-1">
                      Spec: {fmt(filterSpeciality)}<button onClick={() => setFilterSpeciality("")} className="ml-1 hover:text-white font-bold">×</button>
                    </span>
                        )}
                        {filterEmail && (
                            <span className="text-xs px-3 py-1 rounded-full bg-green-400/10 border border-green-400/30 text-green-400 flex items-center gap-1">
                      Email: {filterEmail}<button onClick={() => setFilterEmail("")} className="ml-1 hover:text-white font-bold">×</button>
                    </span>
                        )}
                      </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={handleSearch}
                            disabled={loadingUsers || (!!filterEmail.trim()) || (!filterRole && !filterSpeciality)}
                            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                      {loadingUsers ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}Search
                    </Button>
                    {hasSearched && (
                        <Button onClick={clearFilters} variant="outline" className="border-border/30 hover:border-border/60 text-foreground">Clear</Button>
                    )}
                    <Button onClick={() => setShowAddUser(!showAddUser)} variant="outline"
                            className="ml-auto border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent text-foreground hover:text-neon-cyan">
                      <Plus className="w-4 h-4 mr-2" />Add User
                    </Button>
                  </div>
                </Card>

                {showAddUser && (
                    <Card className="p-6 mb-8 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                      <h3 className="text-xl font-bold mb-4">Add New User</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {([
                          { label: "Username", key: "username", type: "text", placeholder: "e.g. john.doe" },
                          { label: "Email", key: "email", type: "email", placeholder: "john@intervenia.com" },
                          { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
                        ] as const).map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                              <label className="block text-sm text-muted-foreground mb-2">{label}</label>
                              <input type={type} value={(newUser as any)[key] ?? ""} placeholder={placeholder}
                                     onChange={e => setNewUser({ ...newUser, [key]: e.target.value })}
                                     className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none" />
                            </div>
                        ))}
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Role</label>
                          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:outline-none">
                            {MANAGEABLE_ROLES.map(r => <option key={r} value={r}>{fmt(r)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Speciality</label>
                          <select
                            value={newUser.speciality as any}
                            onChange={e => setNewUser({ ...newUser, speciality: e.target.value as ProfessionalSpeciality })}
                          >
                            <option value="">Select speciality</option>
                            {SPECIALITIES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Shift Start</label>
                          <input type="number" min={0} max={23} value={newUser.shiftStart}
                                 onChange={e => setNewUser({ ...newUser, shiftStart: parseInt(e.target.value) })}
                                 className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Shift End</label>
                          <input type="number" min={0} max={23} value={newUser.shiftEnd}
                                 onChange={e => setNewUser({ ...newUser, shiftEnd: parseInt(e.target.value) })}
                                 className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={newUser.onCall} onChange={e => setNewUser({ ...newUser, onCall: e.target.checked })} className="w-4 h-4" />On Call
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={newUser.isAvailable} onChange={e => setNewUser({ ...newUser, isAvailable: e.target.checked })} className="w-4 h-4" />Available
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleAddUser} disabled={savingUser}
                                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                          {savingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save User
                        </Button>
                        <Button onClick={() => setShowAddUser(false)} variant="outline" className="border-border/30">Cancel</Button>
                      </div>
                    </Card>
                )}

                {userError && (
                    <Card className="p-4 mb-6 border-red-400/30 bg-red-400/5 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <p className="text-red-400 text-sm">{userError}</p>
                    </Card>
                )}

                {loadingUsers && (
                    <div className="flex items-center justify-center py-24">
                      <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mr-3" />
                      <span className="text-muted-foreground">Searching...</span>
                    </div>
                )}

                {!hasSearched && !loadingUsers && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-16 h-16 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-neon-cyan/50" />
                      </div>
                      <p className="text-muted-foreground text-lg mb-2">No search performed yet</p>
                      <p className="text-muted-foreground text-sm">Combine role + speciality for precise results, or search by exact email</p>
                    </div>
                )}

                {hasSearched && !loadingUsers && (
                    <>
                      {users.length > 0 && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Found <span className="text-neon-cyan font-semibold">{users.length}</span> user{users.length !== 1 ? "s" : ""}
                          </p>
                      )}
                      <div className="space-y-4">
                        {users.map(user => (
                            <Card key={user.id} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-sm font-bold text-neon-cyan shrink-0">
                                    {initials(user.username)}
                                  </div>
                                  <div className="flex-1">
                                    {editingUserId === user.id ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                          {([
                                            { label: "Username", key: "username", type: "text" },
                                            { label: "Email", key: "email", type: "email" },
                                          ] as const).map(({ label, key, type }) => (
                                              <div key={key}>
                                                <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                                                <input type={type} value={(editUserData as any)[key] ?? ""}
                                                       onChange={e => setEditUserData({ ...editUserData, [key]: e.target.value })}
                                                       className="w-full px-3 py-1.5 bg-background border border-neon-cyan/30 rounded-lg text-sm text-foreground focus:outline-none" />
                                              </div>
                                          ))}
                                          <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Role</label>
                                            <select value={editUserData.role} onChange={e => setEditUserData({ ...editUserData, role: e.target.value as Role })}
                                                    className="w-full px-3 py-1.5 bg-background border border-neon-cyan/30 rounded-lg text-sm text-foreground focus:outline-none">
                                              {MANAGEABLE_ROLES.map(r => <option key={r} value={r}>{fmt(r)}</option>)}
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Speciality</label>
                                            <select
                                              value={editUserData.speciality as any}
                                              onChange={e => setEditUserData({ ...editUserData, speciality: e.target.value as ProfessionalSpeciality })}
                                                 >
                                              <option value="">Select speciality</option>
                                              {SPECIALITIES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Shift Start</label>
                                            <input type="number" min={0} max={23} value={editUserData.shiftStart ?? 8}
                                                   onChange={e => setEditUserData({ ...editUserData, shiftStart: parseInt(e.target.value) })}
                                                   className="w-full px-3 py-1.5 bg-background border border-neon-cyan/30 rounded-lg text-sm text-foreground focus:outline-none" />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Shift End</label>
                                            <input type="number" min={0} max={23} value={editUserData.shiftEnd ?? 16}
                                                   onChange={e => setEditUserData({ ...editUserData, shiftEnd: parseInt(e.target.value) })}
                                                   className="w-full px-3 py-1.5 bg-background border border-neon-cyan/30 rounded-lg text-sm text-foreground focus:outline-none" />
                                          </div>
                                          <div className="flex items-center gap-4 mt-1">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                              <input type="checkbox" checked={editUserData.onCall ?? false} onChange={e => setEditUserData({ ...editUserData, onCall: e.target.checked })} className="w-4 h-4" />On Call
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                              <input type="checkbox" checked={editUserData.isAvailable ?? true} onChange={e => setEditUserData({ ...editUserData, isAvailable: e.target.checked })} className="w-4 h-4" />Available
                                            </label>
                                          </div>
                                        </div>
                                    ) : (
                                        <>
                                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <h3 className="font-semibold text-lg">{user.username}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                    {getRoleIcon(user.role)}{fmt(user.role)}
                                  </span>
                                            {user.isAvailable
                                                ? <span className="text-xs px-2 py-1 rounded-full border text-green-400 border-green-400/30 bg-green-400/10">Available</span>
                                                : <span className="text-xs px-2 py-1 rounded-full border text-red-400 border-red-400/30 bg-red-400/10">Unavailable</span>
                                            }
                                            {user.onCall && <span className="text-xs px-2 py-1 rounded-full border text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10">On Call</span>}
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div><p className="text-muted-foreground mb-1">Email</p><p className="font-semibold truncate">{user.email}</p></div>
                                            <div><p className="text-muted-foreground mb-1">Speciality</p><p className="font-semibold text-neon-cyan">{fmt(user.speciality)}</p></div>
                                            <div><p className="text-muted-foreground mb-1">Shift</p><p className="font-semibold">{user.shiftStart}:00 – {user.shiftEnd}:00</p></div>
                                            <div>
                                              <p className="text-muted-foreground mb-1">Team</p>
                                              {user.teamId ? (
                                                <button
                                                  type="button"
                                                  onClick={() => navigateToTeam(user.teamId!)}
                                                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-full border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors"
                                                  title={`Go to team ${user.teamId}`}
                                                >
                                                  <ChevronRight className="w-3 h-3" />
                                                  {shortId(user.teamId)}
                                                </button>
                                              ) : (
                                                <span className="text-xs text-muted-foreground">No team</span>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                  {editingUserId === user.id ? (
                                      <>
                                        <Button size="sm" onClick={() => handleUpdateUser(user.id)} disabled={savingUser}
                                                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                                          {savingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => { setEditingUserId(null); setEditUserData({}) }}
                                                className="border-border/30 text-foreground">Cancel</Button>
                                      </>
                                  ) : (
                                      <>
                                        <Button size="sm" variant="outline"
                                                onClick={() => { setEditingUserId(user.id); setEditUserData({ ...user }) }}
                                                className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent text-foreground hover:text-neon-cyan">
                                          <Edit className="w-4 h-4 mr-2" />Edit
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}
                                                className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400 hover:text-red-300">
                                          <Trash2 className="w-4 h-4 mr-2" />Delete
                                        </Button>
                                      </>
                                  )}
                                </div>
                              </div>
                            </Card>
                        ))}
                        {users.length === 0 && (
                            <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">No users found for this search.</p>
                            </Card>
                        )}
                      </div>
                    </>
                )}
              </div>
          )}

          {/* ══════════ TEAMS TAB ══════════ */}
          {activeTab === "teams" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    {teams.length > 0 ? <><span className="text-neon-cyan font-semibold">{filteredTeams.length}</span> of <span className="font-semibold">{teams.length}</span> teams</> : "No teams yet"}
                  </p>
                  <Button onClick={() => setShowAddTeam(!showAddTeam)}
                          className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                    <Plus className="w-4 h-4 mr-2" />Create Team
                  </Button>
                </div>

                {/* Teams filter panel */}
                <Card className="p-6 mb-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-neon-cyan" />
                    <h2 className="text-lg font-semibold">Filter Teams</h2>
                    <span className="text-xs text-muted-foreground ml-1">— refine by speciality, zone, or leader email</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Speciality</label>
                      <select value={teamFilterSpeciality} onChange={e => setTeamFilterSpeciality(e.target.value as ProfessionalSpeciality | "")} className="w-full px-4 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground focus:outline-none text-sm">
                        <option value="">Any speciality</option>
                        {SPECIALITIES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Zone</label>
                      <select value={teamFilterZone} onChange={e => setTeamFilterZone(e.target.value as Zone | "")} className="w-full px-4 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground focus:outline-none text-sm">
                        <option value="">Any zone</option>
                        {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Leader email</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={teamFilterLeaderEmail}
                          onChange={e => setTeamFilterLeaderEmail(e.target.value)}
                          placeholder="Search leader by email..."
                          className="w-full pl-9 pr-9 py-2 bg-background border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                        />
                        {leaderEmailSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active filter chips */}
                  {(teamFilterSpeciality || teamFilterZone || teamFilterLeaderEmail) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {teamFilterSpeciality && (
                        <span className="text-xs px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center gap-1">
                          Spec: {fmt(teamFilterSpeciality as string)}<button onClick={() => setTeamFilterSpeciality("")} className="ml-1 hover:text-white font-bold">×</button>
                        </span>
                      )}
                      {teamFilterZone && (
                        <span className="text-xs px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center gap-1">
                          Zone: {teamFilterZone}<button onClick={() => setTeamFilterZone("")} className="ml-1 hover:text-white font-bold">×</button>
                        </span>
                      )}
                      {teamFilterLeaderEmail && (
                        <span className="text-xs px-3 py-1 rounded-full bg-green-400/10 border border-green-400/30 text-green-400 flex items-center gap-1">
                          Leader: {teamFilterLeaderEmail}<button onClick={() => setTeamFilterLeaderEmail("")} className="ml-1 hover:text-white font-bold">×</button>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={clearTeamFilters} className="border-border/30 text-foreground">Clear</Button>
                    <p className="text-xs text-muted-foreground ml-auto">Showing <span className="text-neon-cyan font-semibold">{filteredTeams.length}</span> of <span className="font-semibold">{teams.length}</span> teams</p>
                  </div>
                </Card>

                {showAddTeam && (
                    <Card className="p-6 mb-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
                      <h3 className="text-xl font-bold mb-4">Create New Team</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Speciality</label>
                          <select value={newTeam.speciality} onChange={e => setNewTeam({ ...newTeam, speciality: e.target.value as ProfessionalSpeciality })}
                                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:outline-none">
                            {SPECIALITIES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Zone</label>
                          <select value={newTeam.zone} onChange={e => setNewTeam({ ...newTeam, zone: e.target.value as Zone })}
                                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:outline-none">
                            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Leader ID</label>
                          <input type="text" value={newTeam.leaderId} placeholder="Leader user ID"
                                 onChange={e => setNewTeam({ ...newTeam, leaderId: e.target.value })}
                                 className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Technician IDs (comma-separated)</label>
                          <input type="text" value={newTeamTechInput} placeholder="id1, id2, id3..."
                                 onChange={e => {
                                   setNewTeamTechInput(e.target.value)
                                   setNewTeam({ ...newTeam, technicianIds: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
                                 }}
                                 className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleCreateTeam} disabled={savingTeam}
                                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40">
                          {savingTeam && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Create Team
                        </Button>
                        <Button onClick={() => setShowAddTeam(false)} variant="outline" className="border-border/30">Cancel</Button>
                      </div>
                    </Card>
                )}

                {teamError && (
                    <Card className="p-4 mb-6 border-red-400/30 bg-red-400/5 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <p className="text-red-400 text-sm">{teamError}</p>
                      <Button size="sm" variant="outline" onClick={fetchTeams} className="ml-auto border-red-400/30">Retry</Button>
                    </Card>
                )}

                {loadingTeams ? (
                    <div className="flex items-center justify-center py-24">
                      <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mr-3" />
                      <span className="text-muted-foreground">Loading teams...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {filteredTeams.map(team => (
                          <Card key={team.id} className="bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all overflow-hidden">
                            <div ref={el => { teamRefs.current[team.id] = el }} className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6 text-neon-blue" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h3 className="font-semibold text-lg">{fmt(team.speciality)}</h3>
                                      <span className="text-xs px-2 py-1 rounded-full border text-neon-blue border-neon-blue/30 bg-neon-blue/10 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{team.zone}
                              </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400" />Leader: <span className="text-foreground ml-1">{leaderNames[team.leaderId] ?? "Unknown"}</span>
                              </span>
                                      <span className="flex items-center gap-1">
                                <Wrench className="w-3 h-3" />{team.technicianIds?.length ?? 0} technician{(team.technicianIds?.length ?? 0) !== 1 ? "s" : ""}
                              </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {editingTeamId === team.id ? (
                                      <div className="flex items-center gap-2">
                                        <select value={editTeamZone} onChange={e => setEditTeamZone(e.target.value as Zone)}
                                                className="px-3 py-1.5 bg-background border border-neon-cyan/30 rounded-lg text-sm text-foreground focus:outline-none">
                                          {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                        </select>
                                        <Button size="sm" onClick={() => handleUpdateTeamZone(team.id)} disabled={savingTeam}
                                                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background border border-neon-cyan/40">
                                          {savingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditingTeamId(null)} className="border-border/30 text-foreground">Cancel</Button>
                                      </div>
                                  ) : (
                                      <Button size="sm" variant="outline"
                                              onClick={() => { setEditingTeamId(team.id); setEditTeamZone(team.zone) }}
                                              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent text-foreground hover:text-neon-cyan">
                                        <Edit className="w-4 h-4 mr-1" />Zone
                                      </Button>
                                  )}
                                  <Button size="sm" variant="outline" onClick={() => handleDeleteTeam(team.id)}
                                          className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <button onClick={() => handleExpandTeam(team)}
                                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                    {expandedTeam === team.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {expandedTeam === team.id && (
                                <div className="border-t border-border/20 bg-muted/5 p-6">
                                  {loadingMembers === team.id ? (
                                      <div className="flex items-center gap-3 py-4">
                                        <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
                                        <span className="text-sm text-muted-foreground">Loading members...</span>
                                      </div>
                                  ) : (
                                      <>
                                        <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Team Members</h4>
                                        {(teamMembers[team.id] ?? []).length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-4">No members found for this team.</p>
                                        ) : (
                                            <div className="space-y-3">
                                              {(teamMembers[team.id] ?? []).map(member => (
                                                  <div key={member.id}
                                                       className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/20 hover:border-neon-cyan/20 transition-all">
                                                    <div className="flex items-center gap-3">
                                                      <div className="w-9 h-9 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-xs font-bold text-neon-cyan">
                                                        {initials(member.username)}
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                          <p className="font-semibold text-sm">{member.username}</p>
                                                          {member.id === team.leaderId && (
                                                              <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 flex items-center gap-1">
                                              <Star className="w-2.5 h-2.5" />Leader
                                            </span>
                                                          )}
                                                          <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                                            {getRoleIcon(member.role)}{fmt(member.role)}
                                          </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{member.email} · Shift {member.shiftStart}:00–{member.shiftEnd}:00</p>
                                                      </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      {member.isAvailable
                                                          ? <span className="text-xs px-2 py-0.5 rounded-full border text-green-400 border-green-400/30 bg-green-400/10">Available</span>
                                                          : <span className="text-xs px-2 py-0.5 rounded-full border text-red-400 border-red-400/30 bg-red-400/10">Unavailable</span>
                                                      }
                                                      {member.id !== team.leaderId && (
                                                          <Button size="sm" variant="outline"
                                                                  onClick={() => handleRemoveTechnician(team.id, member.id)}
                                                                  className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400 hover:text-red-300 h-7 px-2">
                                                            <UserMinus className="w-3 h-3" />
                                                          </Button>
                                                      )}
                                                    </div>
                                                  </div>
                                              ))}
                                            </div>
                                        )}
                                      </>
                                  )}
                                </div>
                            )}
                          </Card>
                      ))}

                      {teams.length === 0 && !loadingTeams && (
                          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No teams yet. Create one to get started.</p>
                          </Card>
                      )}
                    </div>
                )}
              </div>
          )}
        </main>
      </div>
  )
}
