"use client"

import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, Filter, MapPin, Clock, Users, Wrench, Brain } from "lucide-react"
import { useState } from "react"

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)

  const incidents = [
    {
      id: "INC-1234",
      zone: "Zone A",
      specialty: "Fire",
      urgency: "CRITICAL",
      status: "In Progress",
      reported: "2024-01-15 14:32",
      description: "Building fire in residential area, multiple floors affected",
      aiDecision: {
        specialties: ["Fire Brigade", "Medical Support"],
        duration: "2-3 hours",
        technicians: 5,
        equipment: ["Fire truck", "Hoses", "Safety gear", "Medical kit"],
      },
    },
    {
      id: "INC-1235",
      zone: "Zone C",
      specialty: "Gas Leak",
      urgency: "CRITICAL",
      status: "Planned",
      reported: "2024-01-15 14:45",
      description: "Gas leak detected near commercial zone",
      aiDecision: {
        specialties: ["Gas Specialist", "Safety Team"],
        duration: "1-2 hours",
        technicians: 3,
        equipment: ["Gas detector", "Safety equipment", "Repair tools"],
      },
    },
    {
      id: "INC-1236",
      zone: "Zone B",
      specialty: "Electricity",
      urgency: "HIGH",
      status: "Pending",
      reported: "2024-01-15 15:10",
      description: "Power outage affecting 200+ households",
      aiDecision: {
        specialties: ["Electrician", "Grid Specialist"],
        duration: "3-4 hours",
        technicians: 4,
        equipment: ["Voltage tester", "Cable repair kit", "Safety gear"],
      },
    },
    {
      id: "INC-1237",
      zone: "Zone D",
      specialty: "Road",
      urgency: "MEDIUM",
      status: "Completed",
      reported: "2024-01-15 10:20",
      description: "Pothole repair on main street",
      aiDecision: {
        specialties: ["Road Maintenance"],
        duration: "2 hours",
        technicians: 2,
        equipment: ["Asphalt mix", "Compactor", "Safety cones"],
      },
    },
  ]

  const selected = incidents.find((i) => i.id === selectedIncident)

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Incident Management</h1>
            <p className="text-sm text-muted-foreground">From report to action</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-black">
              <Plus className="w-4 h-4" />
              Report Incident
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6 lg:col-span-2">
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedIncident === incident.id
                      ? "border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,200,255,0.3)]"
                      : "border-[oklch(0.18_0.02_250)] hover:border-[oklch(0.22_0.02_250)]"
                  } ${incident.urgency === "CRITICAL" ? "bg-red-950/20" : "bg-[oklch(0.14_0.02_250)]"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          incident.urgency === "CRITICAL"
                            ? "text-red-500"
                            : incident.urgency === "HIGH"
                              ? "text-orange-500"
                              : "text-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="font-mono font-semibold">{incident.id}</p>
                        <p className="text-xs text-muted-foreground">{incident.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-md text-xs font-bold ${
                          incident.urgency === "CRITICAL"
                            ? "bg-red-500 text-white"
                            : incident.urgency === "HIGH"
                              ? "bg-orange-500 text-white"
                              : "bg-yellow-500 text-black"
                        }`}
                      >
                        {incident.urgency}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-md text-xs ${
                          incident.status === "In Progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : incident.status === "Planned"
                              ? "bg-purple-500/20 text-purple-400"
                              : incident.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {incident.status}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{incident.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {incident.zone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {incident.reported}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Decision Summary */}
          {selected ? (
            <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[oklch(0.18_0.02_250)]">
                  <Brain className="w-5 h-5 text-[var(--neon-cyan)]" />
                  <h3 className="font-semibold">AI Decision Summary</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Required Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.aiDecision.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] rounded text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Estimated Duration</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selected.aiDecision.duration}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Required Technicians</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selected.aiDecision.technicians} technicians</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Required Equipment</p>
                    <div className="space-y-2">
                      {selected.aiDecision.equipment.map((eq) => (
                        <div key={eq} className="flex items-center gap-2">
                          <Wrench className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{eq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selected.urgency === "CRITICAL" && (
                  <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg">
                    <p className="text-xs text-red-400 font-semibold">Emergency planning triggered automatically</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Select an incident to view AI decision summary</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
