"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Bell, MapPin, Clock, AlertTriangle, CheckCircle, Camera, Menu, Settings, MessageSquare, RefreshCw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { getAuth } from "@/lib/auth"

// Types matching backend IncidentDTO (subset)
interface IncidentDTO {
  id: string
  name?: string
  description?: string
  submittedAt?: string | number | Date
  incidentStatus?: string
  urgencyLevel?: string
  location?: { address?: string; lat?: number; lng?: number }
  zone?: string
}

export default function CitizenDashboard() {
  const [incidents, setIncidents] = useState<IncidentDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const auth = getAuth()
  const userId = auth?.userId
  const token = auth?.token

  const fetchIncidents = async () => {
    if (!userId || !token) {
      setError("You must be logged in as a citizen to view your incidents.")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`http://localhost:8080/api/incidents/citizen/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to load incidents")
        throw new Error(msg || `Request failed with ${res.status}`)
      }
      const data: IncidentDTO[] = await res.json()
      setIncidents(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || "Failed to load incidents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const up = (s?: string) => (s || "").toUpperCase()
    const total = incidents.length
    const inProgress = incidents.filter(i => ["IN_PROGRESS"].includes(up(i.incidentStatus))).length
    const resolved = incidents.filter(i => ["CLOSED", "RESOLVED"].includes(up(i.incidentStatus))).length
    return { total, inProgress, resolved }
  }, [incidents])

  const fmtStatusClass = (status?: string) => {
    const s = (status || "").toUpperCase()
    if (["CLOSED", "RESOLVED"].includes(s)) return "text-green-400 border-green-400/30 bg-green-400/10"
    if (["IN_PROGRESS"].includes(s)) return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
    if (["OPEN", "PENDING"].includes(s)) return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    return "text-muted-foreground border-border/30 bg-muted/10"
  }

  const fmtUrgencyClass = (urgency?: string) => {
    const u = (urgency || "").toUpperCase()
    if (u === "CRITICAL") return "text-red-400"
    if (u === "HIGH") return "text-orange-400"
    if (u === "MEDIUM") return "text-yellow-400"
    if (u === "LOW") return "text-green-400"
    return "text-muted-foreground"
  }

  const fmtTitle = (inc: IncidentDTO) => {
    // Prefer enum name if present; prettify by replacing underscores
    const raw = inc.name || "Incident"
    return raw.toString().replace(/_/g, " ")
  }

  const fmtWhen = (d?: string | number | Date) => {
    if (!d) return ""
    try {
      const date = new Date(d)
      return date.toLocaleString()
    } catch {
      return String(d)
    }
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
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/citizen/feedback"
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Give Feedback"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full"></span>
            </button>
            <Link
              href="/citizen/profile"
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Welcome Back</h1>
          <p className="text-muted-foreground text-lg">Help improve your city by reporting incidents in your area</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Your Reports</span>
              <Camera className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{loading ? "–" : stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total incidents reported</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{loading ? "–" : stats.inProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">Being addressed</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">{loading ? "–" : stats.resolved}</p>
            <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
          </Card>
        </div>

        {/* Report Incident CTA */}
        <Link href="/citizen/report">
          <Card className="group p-8 mb-12 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-balance">Report a New Incident</h2>
                <p className="text-muted-foreground">Use AI to classify incidents automatically or report manually</p>
              </div>
              <div className="p-4 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue shadow-lg shadow-neon-cyan/30">
                <Camera className="w-8 h-8 text-background" />
              </div>
            </div>
          </Card>
        </Link>

        {/* Recent Incidents */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Recent Reports</h2>

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 border-border/20">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-muted rounded w-1/3"></div>
                    <div className="flex gap-6">
                      <div className="h-4 bg-muted rounded w-40"></div>
                      <div className="h-4 bg-muted rounded w-28"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <Card className="p-6 border-red-500/30 bg-red-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 font-medium">Failed to load your incidents</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchIncidents}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && incidents.length === 0 && (
            <Card className="p-8 text-center border-border/20">
              <p className="text-muted-foreground">You haven't reported any incidents yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Start by creating your first report.</p>
            </Card>
          )}

          {/* List */}
          {!loading && !error && incidents.length > 0 && (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card
                  key={incident.id}
                  className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{fmtTitle(incident)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${fmtStatusClass(incident.incidentStatus)} capitalize`}>
                          {(incident.incidentStatus || "").toString().replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{incident.location?.address || incident.zone || "Unknown location"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{fmtWhen(incident.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${fmtUrgencyClass(incident.urgencyLevel)}`} />
                          <span className={fmtUrgencyClass(incident.urgencyLevel)}>
                            {(incident.urgencyLevel || "").toString().toLowerCase() || "unknown"} priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
