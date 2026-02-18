"use client"

import { AppLayout } from "@/components/app-layout"
import { AlertTriangle, CheckCircle, Users, Wrench, Activity, Zap, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function CommandDashboard() {
  const stats = [
    {
      label: "Active Incidents",
      value: "23",
      icon: AlertTriangle,
      color: "text-red-500",
      bgGlow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
      trend: "+3 from yesterday",
    },
    {
      label: "Ongoing Interventions",
      value: "12",
      icon: Activity,
      color: "text-[var(--neon-cyan)]",
      bgGlow: "shadow-[0_0_20px_rgba(0,200,255,0.3)]",
      trend: "8 completed today",
    },
    {
      label: "Deployed Technicians",
      value: "34",
      icon: Users,
      color: "text-green-500",
      bgGlow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      trend: "42 available",
    },
    {
      label: "Equipment in Use",
      value: "56",
      icon: Wrench,
      color: "text-yellow-500",
      bgGlow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
      trend: "89 total units",
    },
  ]

  const criticalIncidents = [
    { id: "INC-1234", zone: "Zone A", specialty: "Fire", urgency: "CRITICAL", status: "In Progress", time: "14:32" },
    { id: "INC-1235", zone: "Zone C", specialty: "Gas Leak", urgency: "CRITICAL", status: "Planned", time: "14:45" },
    { id: "INC-1236", zone: "Zone B", specialty: "Electricity", urgency: "HIGH", status: "Pending", time: "15:10" },
  ]

  const activityFeed = [
    {
      type: "critical",
      message: "Critical incident detected in Zone A - Fire emergency",
      time: "2 min ago",
      icon: Zap,
    },
    {
      type: "planning",
      message: "AI planning triggered for INC-1234 - 3 technicians assigned",
      time: "3 min ago",
      icon: Activity,
    },
    {
      type: "equipment",
      message: "Equipment reserved: Fire truck, Hoses, Safety gear",
      time: "5 min ago",
      icon: Wrench,
    },
    { type: "dispatch", message: "Technicians dispatched to Zone A - ETA 8 minutes", time: "6 min ago", icon: Users },
    {
      type: "complete",
      message: "Intervention INC-1220 completed successfully",
      time: "12 min ago",
      icon: CheckCircle,
    },
    {
      type: "planning",
      message: "Weekly optimization plan generated for 47 incidents",
      time: "25 min ago",
      icon: Activity,
    },
  ]

  const incidentLocations = [
    { zone: "Zone A", incidents: 8, x: "25%", y: "30%" },
    { zone: "Zone B", incidents: 5, x: "65%", y: "40%" },
    { zone: "Zone C", incidents: 7, x: "45%", y: "65%" },
    { zone: "Zone D", incidents: 3, x: "75%", y: "70%" },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className={`bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6 ${stat.bgGlow}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Incidents */}
          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Incidents by Urgency
            </h3>
            <div className="space-y-3">
              {criticalIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    incident.urgency === "CRITICAL"
                      ? "bg-red-950/30 border-red-800/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "bg-[oklch(0.14_0.02_250)] border-[oklch(0.18_0.02_250)]"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <p className="font-mono font-semibold text-sm">{incident.id}</p>
                      <p className="text-xs text-muted-foreground">{incident.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{incident.zone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-md text-xs font-bold ${
                        incident.urgency === "CRITICAL" ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                      }`}
                    >
                      {incident.urgency}
                    </div>
                    <div className="text-sm text-muted-foreground">{incident.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Incident Map */}
          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--neon-cyan)]" />
              City Zones
            </h3>
            <div className="relative h-64 bg-[oklch(0.08_0.01_250)] rounded-lg border border-[oklch(0.18_0.02_250)] overflow-hidden">
              {/* Grid pattern for city */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute h-px bg-[var(--neon-cyan)]"
                    style={{ top: `${(i + 1) * 12.5}%`, left: 0, right: 0 }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute w-px bg-[var(--neon-cyan)]"
                    style={{ left: `${(i + 1) * 12.5}%`, top: 0, bottom: 0 }}
                  />
                ))}
              </div>

              {/* Incident markers */}
              {incidentLocations.map((location, idx) => (
                <div
                  key={location.zone}
                  className="absolute"
                  style={{ left: location.x, top: location.y, transform: "translate(-50%, -50%)" }}
                >
                  <div className={`relative ${location.incidents >= 5 ? "animate-pulse" : ""}`}>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        location.incidents >= 5
                          ? "bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                          : "bg-[var(--neon-cyan)]/30 shadow-[0_0_15px_rgba(0,200,255,0.5)]"
                      }`}
                    >
                      <span className="text-xs font-bold">{location.incidents}</span>
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                      {location.zone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--neon-cyan)]" />
            Live Activity Feed
          </h3>
          <div className="space-y-3">
            {activityFeed.map((activity, idx) => {
              const Icon = activity.icon
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 bg-[oklch(0.14_0.02_250)] rounded-lg border border-[oklch(0.18_0.02_250)]"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "critical"
                        ? "bg-red-500/20 text-red-500"
                        : activity.type === "planning"
                          ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                          : activity.type === "complete"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
