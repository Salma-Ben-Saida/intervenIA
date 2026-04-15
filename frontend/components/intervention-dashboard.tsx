"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, MapPin, Users, Wrench, Calendar } from "lucide-react"

interface Technician {
  id: string
  name: string
  initials: string
  status: "available" | "busy" | "on-break"
  specialty: string
}

interface Intervention {
  id: string
  incidentName: string
  urgency: "critical" | "high" | "medium" | "low"
  location: string
  zone: string
  assignedTeam: string
  assignedTechnicians: string[]
  equipment: string[]
  scheduledTime: string
  status: "planned" | "in-progress" | "completed"
  specialty: string
  date: string
}

const mockTechnicians: Record<string, Technician> = {
  "TECH-001": { id: "TECH-001", name: "John Anderson", initials: "JA", status: "busy", specialty: "Electrical" },
  "TECH-002": { id: "TECH-002", name: "Sarah Chen", initials: "SC", status: "busy", specialty: "Electrical" },
  "TECH-003": {
    id: "TECH-003",
    name: "Mike Rodriguez",
    initials: "MR",
    status: "available",
    specialty: "Road Maintenance",
  },
  "TECH-004": { id: "TECH-004", name: "Emma Wilson", initials: "EW", status: "busy", specialty: "Road Maintenance" },
  "TECH-005": { id: "TECH-005", name: "David Kumar", initials: "DK", status: "available", specialty: "Lighting" },
  "TECH-006": {
    id: "TECH-006",
    name: "Lisa Brown",
    initials: "LB",
    status: "available",
    specialty: "Water Management",
  },
  "TECH-007": {
    id: "TECH-007",
    name: "James Martinez",
    initials: "JM",
    status: "on-break",
    specialty: "Water Management",
  },
  "TECH-008": { id: "TECH-008", name: "Nina Patel", initials: "NP", status: "available", specialty: "Sanitation" },
}

const mockInterventions: Intervention[] = [
  {
    id: "INT-001",
    incidentName: "Traffic Signal Malfunction",
    urgency: "critical",
    location: "Main St & 5th Ave",
    zone: "Downtown",
    assignedTeam: "Team Alpha",
    assignedTechnicians: ["TECH-001", "TECH-002"],
    equipment: ["Voltage Tester", "Control Panel Repair Kit"],
    scheduledTime: "09:30 AM",
    status: "in-progress",
    specialty: "Electrical",
    date: "2024-12-08",
  },
  {
    id: "INT-002",
    incidentName: "Pothole on Market Road",
    urgency: "high",
    location: "Market Rd, Sector 7",
    zone: "North",
    assignedTeam: "Team Beta",
    assignedTechnicians: ["TECH-003", "TECH-004"],
    equipment: ["Asphalt Mixer", "Compactor", "Safety Markers"],
    scheduledTime: "10:15 AM",
    status: "planned",
    specialty: "Road Maintenance",
    date: "2024-12-08",
  },
  {
    id: "INT-003",
    incidentName: "Street Light Not Working",
    urgency: "medium",
    location: "Park Avenue",
    zone: "West",
    assignedTeam: "Team Gamma",
    assignedTechnicians: ["TECH-005"],
    equipment: ["LED Bulb", "Ladder", "Testing Equipment"],
    scheduledTime: "11:00 AM",
    status: "planned",
    specialty: "Lighting",
    date: "2024-12-08",
  },
  {
    id: "INT-004",
    incidentName: "Water Pipe Leak",
    urgency: "critical",
    location: "Central Park Entrance",
    zone: "Central",
    assignedTeam: "Team Delta",
    assignedTechnicians: ["TECH-006", "TECH-007"],
    equipment: ["Pipe Wrench", "Replacement Pipe", "Pressure Gauge"],
    scheduledTime: "09:15 AM",
    status: "in-progress",
    specialty: "Water Management",
    date: "2024-12-08",
  },
  {
    id: "INT-005",
    incidentName: "Debris Cleanup",
    urgency: "low",
    location: "Riverside District",
    zone: "South",
    assignedTeam: "Team Echo",
    assignedTechnicians: ["TECH-008"],
    equipment: ["Street Sweeper", "Waste Bin", "Safety Vests"],
    scheduledTime: "02:00 PM",
    status: "planned",
    specialty: "Sanitation",
    date: "2024-12-08",
  },
  {
    id: "INT-006",
    incidentName: "Building Facade Damage",
    urgency: "medium",
    location: "Downtown Plaza",
    zone: "Downtown",
    assignedTeam: "Team Foxtrot",
    assignedTechnicians: ["TECH-005"],
    equipment: ["Scaffolding", "Repair Materials", "Safety Harness"],
    scheduledTime: "01:30 PM",
    status: "planned",
    specialty: "Construction",
    date: "2024-12-09",
  },
  {
    id: "INT-007",
    incidentName: "Electrical Grid Issue",
    urgency: "high",
    location: "Industrial Zone",
    zone: "East",
    assignedTeam: "Team Alpha",
    assignedTechnicians: ["TECH-001"],
    equipment: ["Power Analyzer", "Circuit Breaker", "Cable Tester"],
    scheduledTime: "03:45 PM",
    status: "planned",
    specialty: "Electrical",
    date: "2024-12-09",
  },
]

function TechnicianAvatar({ technicianId }: { technicianId: string }) {
  const tech = mockTechnicians[technicianId]
  if (!tech) return null

  const statusColors = {
    busy: "bg-red-500/20 border-red-500/40 text-red-300",
    available: "bg-green-500/20 border-green-500/40 text-green-300",
    "on-break": "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
  }

  return (
    <div
      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${statusColors[tech.status]}`}
      title={`${tech.name} (${tech.status})`}
    >
      {tech.initials}
      <div
        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background ${
          tech.status === "busy" ? "bg-red-500" : tech.status === "available" ? "bg-green-500" : "bg-yellow-500"
        }`}
      />
    </div>
  )
}

export default function InterventionDashboard() {
  const [filters, setFilters] = useState({
    zone: "All",
    urgency: "All",
    specialty: "All",
    status: "All",
    timeRange: "today", // Added time range filter
  })

  const zones = ["All", "Downtown", "North", "West", "Central", "South", "East"]
  const urgencies = ["All", "critical", "high", "medium", "low"]
  const specialties = [
    "All",
    "Electrical",
    "Road Maintenance",
    "Lighting",
    "Water Management",
    "Sanitation",
    "Construction",
  ]
  const statuses = ["All", "planned", "in-progress", "completed"]

  const getDateRange = () => {
    const today = new Date("2024-12-08")
    const start = new Date(today)
    const end = new Date(today)

    switch (filters.timeRange) {
      case "today":
        return { start, end }
      case "4days":
        end.setDate(end.getDate() + 3)
        return { start, end }
      case "week":
        end.setDate(end.getDate() + 6)
        return { start, end }
      default:
        return { start, end }
    }
  }

  const filteredInterventions = mockInterventions.filter((intervention) => {
    const { start, end } = getDateRange()
    const interventionDate = new Date(intervention.date)

    return (
      (filters.zone === "All" || intervention.zone === filters.zone) &&
      (filters.urgency === "All" || intervention.urgency === filters.urgency) &&
      (filters.specialty === "All" || intervention.specialty === filters.specialty) &&
      (filters.status === "All" || intervention.status === filters.status) &&
      interventionDate >= start &&
      interventionDate <= end
    )
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
      case "high":
        return <AlertCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Intervention Planning & Scheduling</h1>
        <p className="text-muted-foreground">
          Real-time dashboard for planned and assigned interventions using intelligent optimization
        </p>
      </div>

      <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Scheduling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Time Range Filter */}
          <div className="space-y-2 pb-4 border-b border-neon-cyan/10">
            <label className="text-sm font-medium text-muted-foreground">Time Range</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "today", label: "Today Only" },
                { value: "4days", label: "Next 4 Days" },
                { value: "week", label: "Full Week" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, timeRange: option.value })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                    filters.timeRange === option.value
                      ? "bg-neon-cyan/30 border-neon-cyan/50 text-neon-cyan"
                      : "border-neon-cyan/20 text-muted-foreground hover:border-neon-cyan/40"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Zone Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Zone</label>
              <div className="flex flex-wrap gap-2">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setFilters({ ...filters, zone })}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                      filters.zone === zone
                        ? "bg-neon-cyan/30 border-neon-cyan/50 text-neon-cyan"
                        : "border-neon-cyan/20 text-muted-foreground hover:border-neon-cyan/40"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Urgency</label>
              <div className="flex flex-wrap gap-2">
                {urgencies.map((urg) => (
                  <button
                    key={urg}
                    onClick={() => setFilters({ ...filters, urgency: urg })}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border capitalize ${
                      filters.urgency === urg
                        ? "bg-neon-cyan/30 border-neon-cyan/50 text-neon-cyan"
                        : "border-neon-cyan/20 text-muted-foreground hover:border-neon-cyan/40"
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neon-cyan/20 bg-background text-foreground text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neon-cyan/20 bg-background text-foreground text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st === "All" ? st : st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Interventions</p>
              <p className="text-3xl font-bold text-neon-cyan">{filteredInterventions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Critical Issues</p>
              <p className="text-3xl font-bold text-red-400">
                {filteredInterventions.filter((i) => i.urgency === "critical").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-neon-blue">
                {filteredInterventions.filter((i) => i.status === "in-progress").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Teams Deployed</p>
              <p className="text-3xl font-bold text-neon-purple">
                {new Set(filteredInterventions.map((i) => i.assignedTeam)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
        <CardHeader>
          <CardTitle>Planned & Active Interventions</CardTitle>
          <CardDescription>Showing {filteredInterventions.length} interventions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neon-cyan/10">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Incident</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Urgency</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Technicians</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterventions.map((intervention) => (
                  <tr
                    key={intervention.id}
                    className="border-b border-neon-cyan/10 hover:bg-neon-cyan/5 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-neon-cyan text-xs">{intervention.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{intervention.incidentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border capitalize text-xs font-medium ${getUrgencyColor(
                          intervention.urgency,
                        )}`}
                      >
                        {getUrgencyIcon(intervention.urgency)}
                        {intervention.urgency}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs">{intervention.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {intervention.assignedTechnicians.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {intervention.assignedTechnicians.map((techId) => (
                              <TechnicianAvatar key={techId} technicianId={techId} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neon-purple" />
                        <span className="text-xs">{intervention.scheduledTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium border capitalize ${
                          intervention.status === "completed"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : intervention.status === "in-progress"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {intervention.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-cyan" />
            Technician Status
          </CardTitle>
          <CardDescription>Real-time technician availability and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(mockTechnicians).map((tech) => {
              const assignedCount = mockInterventions.filter((i) => i.assignedTechnicians.includes(tech.id)).length
              return (
                <div
                  key={tech.id}
                  className="p-4 rounded-lg border border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/5 to-neon-blue/5 hover:border-neon-cyan/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${
                          tech.status === "busy"
                            ? "bg-red-500/20 border-red-500/40 text-red-300"
                            : tech.status === "available"
                              ? "bg-green-500/20 border-green-500/40 text-green-300"
                              : "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
                        }`}
                      >
                        {tech.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold capitalize ${
                          tech.status === "available"
                            ? "text-green-400"
                            : tech.status === "busy"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {tech.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{assignedCount} assigned</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Requirements */}
      <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-neon-cyan" />
            Required Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInterventions.map((intervention) => (
              <div key={intervention.id} className="p-3 rounded-lg border border-neon-cyan/10 bg-neon-cyan/3">
                <p className="text-sm font-semibold mb-2">
                  {intervention.id}: {intervention.incidentName}
                </p>
                <div className="flex flex-wrap gap-2">
                  {intervention.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2.5 py-1 rounded-full text-xs bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card className="border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5">
        <CardHeader>
          <CardTitle>Timeline Schedule</CardTitle>
          <CardDescription>Interventions scheduled throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["09:15 AM", "09:30 AM", "10:15 AM", "11:00 AM", "01:30 PM", "02:00 PM", "03:45 PM"].map((time) => {
              const interventionsAtTime = filteredInterventions.filter((i) => i.scheduledTime === time)
              return (
                <div key={time} className="flex items-start gap-4">
                  <div className="text-sm font-semibold text-neon-cyan min-w-[80px]">{time}</div>
                  <div className="flex-1 space-y-2">
                    {interventionsAtTime.length > 0 ? (
                      interventionsAtTime.map((intervention) => (
                        <div
                          key={intervention.id}
                          className="p-4 rounded-lg border border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/5 to-neon-blue/5 hover:border-neon-cyan/40 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{intervention.incidentName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {intervention.assignedTeam} • {intervention.location}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-muted-foreground">Technicians:</span>
                                <div className="flex items-center gap-1">
                                  {intervention.assignedTechnicians.map((techId) => (
                                    <TechnicianAvatar key={techId} technicianId={techId} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium capitalize border ${getUrgencyColor(
                                intervention.urgency,
                              )}`}
                            >
                              {intervention.urgency}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic">No interventions scheduled</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
