"use client"

import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Users, MapPin, Clock, Activity } from "lucide-react"

export default function TechniciansPage() {
  const technicians = [
    {
      id: "1",
      name: "John Smith",
      specialty: "Fire Brigade",
      zone: "Zone A",
      availability: "On Mission",
      shift: "08:00 - 16:00",
      currentAssignment: "INC-1234",
      onCall: true,
    },
    {
      id: "2",
      name: "Sarah Lee",
      specialty: "Fire Brigade",
      zone: "Zone A",
      availability: "On Mission",
      shift: "08:00 - 16:00",
      currentAssignment: "INC-1234",
      onCall: false,
    },
    {
      id: "3",
      name: "David Chen",
      specialty: "Gas Specialist",
      zone: "Zone C",
      availability: "Available",
      shift: "12:00 - 20:00",
      currentAssignment: null,
      onCall: true,
    },
    {
      id: "4",
      name: "Emma Wilson",
      specialty: "Safety Officer",
      zone: "Zone C",
      availability: "Available",
      shift: "12:00 - 20:00",
      currentAssignment: null,
      onCall: false,
    },
    {
      id: "5",
      name: "Tom Anderson",
      specialty: "Electrician",
      zone: "Zone B",
      availability: "On-Call",
      shift: "16:00 - 00:00",
      currentAssignment: null,
      onCall: true,
    },
    {
      id: "6",
      name: "Lisa Martinez",
      specialty: "Electrician",
      zone: "Zone B",
      availability: "Available",
      shift: "08:00 - 16:00",
      currentAssignment: null,
      onCall: false,
    },
  ]

  const stats = [
    { label: "Total Technicians", value: "76", color: "text-[var(--neon-cyan)]" },
    { label: "Available", value: "42", color: "text-green-500" },
    { label: "On Mission", value: "28", color: "text-yellow-500" },
    { label: "On-Call Ready", value: "6", color: "text-orange-500" },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-[var(--neon-cyan)]" />
            Technician Management
          </h1>
          <p className="text-sm text-muted-foreground">Human resources in motion</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-4">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Technician Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <Card
              key={tech.id}
              className={`bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-5 ${
                tech.availability === "On Mission"
                  ? "border-yellow-500/50"
                  : tech.availability === "On-Call"
                    ? "border-orange-500/50"
                    : "border-[oklch(0.18_0.02_250)]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                      tech.availability === "On Mission"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : tech.availability === "Available"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-orange-500/20 text-orange-500"
                    }`}
                  >
                    {tech.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                  </div>
                </div>
                {tech.onCall && (
                  <div className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded text-xs font-semibold">
                    ON-CALL
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{tech.zone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{tech.shift}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span
                    className={
                      tech.availability === "On Mission"
                        ? "text-yellow-500"
                        : tech.availability === "Available"
                          ? "text-green-500"
                          : "text-orange-500"
                    }
                  >
                    {tech.availability}
                  </span>
                </div>
                {tech.currentAssignment && (
                  <div className="mt-3 p-2 bg-[oklch(0.14_0.02_250)] rounded text-xs">
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-mono font-semibold">{tech.currentAssignment}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
