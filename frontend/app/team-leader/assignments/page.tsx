"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Users, MapPin, Clock, Menu, Bell, Settings, ChevronDown, ChevronUp, Edit, Wrench, Package } from "lucide-react"

// Planning assignment structure based on backend
interface PlanningAssignment {
  id: string
  incidentId: string
  speciality: string
  teamId: string
  technicianId: string
  technicianName: string
  startTime: string
  endTime: string
  zone: string
  equipmentUsed: { name: string; quantity: number }[]
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
}

// Grouped by incident
interface IncidentGroup {
  incidentId: string
  incidentTitle: string
  location: string
  urgency: string
  assignments: PlanningAssignment[]
}

export default function AssignmentsPage() {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null)
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState<string>("")

  // Sample data: Planning assignments grouped by incident
  const incidentGroups: IncidentGroup[] = [
    {
      incidentId: "INC-001",
      incidentTitle: "Major Water Leak - Park Avenue",
      location: "Park Ave, Block 12 (North)",
      urgency: "critical",
      assignments: [
        {
          id: "PA-001",
          incidentId: "INC-001",
          speciality: "Plumbing",
          teamId: "TEAM-ALPHA",
          technicianId: "TECH-2901",
          technicianName: "Sam Chen",
          startTime: "2024-01-15T14:00:00Z",
          endTime: "2024-01-15T16:00:00Z",
          zone: "North District",
          equipmentUsed: [
            { name: "Pipe Wrench", quantity: 2 },
            { name: "Sealing Tape", quantity: 5 },
          ],
          status: "SCHEDULED",
        },
        {
          id: "PA-002",
          incidentId: "INC-001",
          speciality: "Plumbing",
          teamId: "TEAM-ALPHA",
          technicianId: "TECH-3112",
          technicianName: "Morgan Lee",
          startTime: "2024-01-15T14:00:00Z",
          endTime: "2024-01-15T16:00:00Z",
          zone: "North District",
          equipmentUsed: [{ name: "Excavator", quantity: 1 }],
          status: "SCHEDULED",
        },
      ],
    },
    {
      incidentId: "INC-002",
      incidentTitle: "Broken Street Light Cluster",
      location: "Main St & 5th Ave (North)",
      urgency: "high",
      assignments: [
        {
          id: "PA-003",
          incidentId: "INC-002",
          speciality: "Electrical",
          teamId: "TEAM-ALPHA",
          technicianId: "TECH-2847",
          technicianName: "Alex Rivera",
          startTime: "2024-01-15T10:00:00Z",
          endTime: "2024-01-15T12:00:00Z",
          zone: "North District",
          equipmentUsed: [
            { name: "LED Bulbs", quantity: 10 },
            { name: "Ladder", quantity: 1 },
          ],
          status: "IN_PROGRESS",
        },
      ],
    },
    {
      incidentId: "INC-003",
      incidentTitle: "Road Pothole Repair",
      location: "Oak Street (North)",
      urgency: "medium",
      assignments: [
        {
          id: "PA-004",
          incidentId: "INC-003",
          speciality: "Roads",
          teamId: "TEAM-ALPHA",
          technicianId: "TECH-3045",
          technicianName: "Jordan Taylor",
          startTime: "2024-01-16T09:00:00Z",
          endTime: "2024-01-16T11:30:00Z",
          zone: "North District",
          equipmentUsed: [
            { name: "Asphalt Mix", quantity: 50 },
            { name: "Compactor", quantity: 1 },
          ],
          status: "SCHEDULED",
        },
        {
          id: "PA-005",
          incidentId: "INC-003",
          speciality: "Roads",
          teamId: "TEAM-ALPHA",
          technicianId: "TECH-3204",
          technicianName: "Casey Brown",
          startTime: "2024-01-16T09:00:00Z",
          endTime: "2024-01-16T11:30:00Z",
          zone: "North District",
          equipmentUsed: [{ name: "Safety Cones", quantity: 20 }],
          status: "SCHEDULED",
        },
      ],
    },
  ]

  // Available technicians in the team
  const availableTechnicians = [
    { id: "TECH-2847", name: "Alex Rivera", specialty: "Electrical" },
    { id: "TECH-2901", name: "Sam Chen", specialty: "Plumbing" },
    { id: "TECH-3045", name: "Jordan Taylor", specialty: "Roads" },
    { id: "TECH-3112", name: "Morgan Lee", specialty: "Traffic" },
    { id: "TECH-3204", name: "Casey Brown", specialty: "General" },
  ]

  const toggleIncident = (incidentId: string) => {
    setExpandedIncident(expandedIncident === incidentId ? null : incidentId)
  }

  const handleEditAssignment = (assignmentId: string, currentTechId: string) => {
    setEditingAssignment(assignmentId)
    setSelectedTechnician(currentTechId)
  }

  const handleSaveAssignment = (assignmentId: string) => {
    // In real app, this would call an API to update the assignment
    alert(`Assignment ${assignmentId} updated with technician ${selectedTechnician}`)
    setEditingAssignment(null)
  }

  const handleCancelEdit = () => {
    setEditingAssignment(null)
    setSelectedTechnician("")
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "IN_PROGRESS":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "SCHEDULED":
        return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
      case "CANCELLED":
        return "text-red-400 border-red-400/30 bg-red-400/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
          <Link href="/team-leader" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            <span className="text-sm text-muted-foreground">| Planning Assignments</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/team-leader/profile" className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Planning Assignments</h1>
          <p className="text-muted-foreground text-lg">Manage technician assignments for each incident</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex gap-4">
          <Link href="/team-leader">
            <Button
              variant="outline"
              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/team-leader/equipment">
            <Button
              variant="outline"
              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              <Package className="w-4 h-4 mr-2" />
              View Equipment
            </Button>
          </Link>
        </div>

        {/* Incidents with Assignments */}
        <div className="space-y-6">
          {incidentGroups.map((incident) => (
            <Card
              key={incident.incidentId}
              className="bg-gradient-to-br from-card to-card/50 border-border/20 overflow-hidden"
            >
              {/* Incident Header */}
              <button
                onClick={() => toggleIncident(incident.incidentId)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{incident.incidentTitle}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(incident.urgency)} capitalize`}
                      >
                        {incident.urgency}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {incident.assignments.length} assignment{incident.assignments.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{incident.location}</span>
                    </div>
                  </div>
                </div>
                {expandedIncident === incident.incidentId ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Assignments */}
              {expandedIncident === incident.incidentId && (
                <div className="border-t border-border/20 bg-muted/10 p-6 space-y-4">
                  {incident.assignments.map((assignment) => (
                    <Card
                      key={assignment.id}
                      className="p-4 bg-background/50 border-border/20 hover:border-neon-cyan/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-neon-cyan">{assignment.speciality}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(assignment.status)}`}
                            >
                              {assignment.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Assigned Technician</p>
                              {editingAssignment === assignment.id ? (
                                <select
                                  value={selectedTechnician}
                                  onChange={(e) => setSelectedTechnician(e.target.value)}
                                  className="w-full px-3 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                                >
                                  {availableTechnicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>
                                      {tech.name} ({tech.specialty})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <p className="font-semibold flex items-center gap-2">
                                  <Users className="w-4 h-4 text-neon-cyan" />
                                  {assignment.technicianName}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Time Slot</p>
                              <p className="font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neon-blue" />
                                {formatDateTime(assignment.startTime)} - {formatDateTime(assignment.endTime)}
                              </p>
                            </div>
                          </div>

                          {/* Equipment Used */}
                          <div className="mt-3">
                            <p className="text-muted-foreground text-sm mb-2">Equipment Required:</p>
                            <div className="flex flex-wrap gap-2">
                              {assignment.equipmentUsed.map((eq, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full"
                                >
                                  <Wrench className="w-3 h-3 inline mr-1" />
                                  {eq.name} x{eq.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {editingAssignment === assignment.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSaveAssignment(assignment.id)}
                                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="border-border/30 hover:border-border/60 bg-transparent"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAssignment(assignment.id, assignment.technicianId)}
                              className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Modify
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
