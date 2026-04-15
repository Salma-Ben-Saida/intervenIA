"use client"

import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Play, Clock, Users, Wrench, AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"

export default function PlanningPage() {
  const [isPlanning, setIsPlanning] = useState(false)
  const [planningMode, setPlanningMode] = useState<"weekly" | "emergency" | null>(null)

  const handleStartPlanning = (mode: "weekly" | "emergency") => {
    setPlanningMode(mode)
    setIsPlanning(true)
    setTimeout(() => setIsPlanning(false), 3000)
  }

  const planningResults = [
    {
      incident: "INC-1234",
      specialty: "Fire",
      urgency: "CRITICAL",
      zone: "Zone A",
      technicians: [
        { name: "John Smith", role: "Fire Chief" },
        { name: "Sarah Lee", role: "Firefighter" },
        { name: "Mike Brown", role: "Paramedic" },
      ],
      equipment: ["Fire truck", "Hoses", "Safety gear"],
      startTime: "14:45",
      endTime: "17:00",
      duration: "2h 15m",
    },
    {
      incident: "INC-1235",
      specialty: "Gas Leak",
      urgency: "CRITICAL",
      zone: "Zone C",
      technicians: [
        { name: "David Chen", role: "Gas Specialist" },
        { name: "Emma Wilson", role: "Safety Officer" },
      ],
      equipment: ["Gas detector", "Safety equipment"],
      startTime: "15:00",
      endTime: "16:30",
      duration: "1h 30m",
    },
    {
      incident: "INC-1236",
      specialty: "Electricity",
      urgency: "HIGH",
      zone: "Zone B",
      technicians: [
        { name: "Tom Anderson", role: "Lead Electrician" },
        { name: "Lisa Martinez", role: "Electrician" },
        { name: "Bob Taylor", role: "Grid Specialist" },
      ],
      equipment: ["Voltage tester", "Cable repair kit"],
      startTime: "16:00",
      endTime: "19:30",
      duration: "3h 30m",
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-[var(--neon-cyan)]" />
            AI Planning Engine
          </h1>
          <p className="text-sm text-muted-foreground">The brain of IntervenIA</p>
        </div>

        {/* Planning Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[var(--neon-cyan)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Weekly Optimization</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Plan all pending incidents considering technician shifts, equipment availability, and zone
                    constraints
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleStartPlanning("weekly")}
                disabled={isPlanning}
                className="w-full gap-2 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-black"
              >
                <Play className="w-4 h-4" />
                Run Weekly Planning
              </Button>
            </div>
          </Card>

          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6 border-red-800/50">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Emergency Planning</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instant planning for critical incidents - triggers automatically on CRITICAL urgency
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleStartPlanning("emergency")}
                disabled={isPlanning}
                variant="outline"
                className="w-full gap-2 border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <Play className="w-4 h-4" />
                Run Emergency Planning
              </Button>
            </div>
          </Card>
        </div>

        {/* Planning Status */}
        {isPlanning && (
          <Card className="bg-[oklch(0.11_0.01_250)] border-[var(--neon-cyan)] p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 text-[var(--neon-cyan)] animate-spin" />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--neon-cyan)]">AI Solver Running</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluating technicians, shifts, equipment, and constraints...
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Planning Results */}
        {!isPlanning && (
          <Card className="bg-[oklch(0.11_0.01_250)] border-[oklch(0.18_0.02_250)] p-6">
            <h3 className="text-lg font-semibold mb-4">Planning Results</h3>
            <div className="space-y-4">
              {planningResults.map((result) => (
                <div
                  key={result.incident}
                  className={`p-4 rounded-lg border ${
                    result.urgency === "CRITICAL"
                      ? "bg-red-950/20 border-red-800/50"
                      : "bg-[oklch(0.14_0.02_250)] border-[oklch(0.18_0.02_250)]"
                  }`}
                >
                  {/* Incident Header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[oklch(0.18_0.02_250)]">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${result.urgency === "CRITICAL" ? "text-red-500" : "text-orange-500"}`}
                      />
                      <div>
                        <p className="font-mono font-semibold">{result.incident}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.specialty} - {result.zone}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-md text-xs font-bold ${
                        result.urgency === "CRITICAL" ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                      }`}
                    >
                      {result.urgency}
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {result.startTime} - {result.endTime}
                      </span>
                      <span className="text-xs text-muted-foreground">({result.duration})</span>
                    </div>
                    <div className="h-2 bg-[oklch(0.18_0.02_250)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--neon-cyan)] rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Assigned Technicians */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Assigned Technicians</span>
                      </div>
                      <div className="space-y-1">
                        {result.technicians.map((tech) => (
                          <div key={tech.name} className="text-xs">
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-muted-foreground"> - {tech.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment Allocated */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Equipment Allocated</span>
                      </div>
                      <div className="space-y-1">
                        {result.equipment.map((eq) => (
                          <div key={eq} className="text-xs">
                            {eq}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
