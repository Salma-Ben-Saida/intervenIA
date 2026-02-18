"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  Users,
  Menu,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Wrench,
  UserCircle,
  X,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"

const PROFESSIONAL_SPECIALITIES = [
  "PUBLIC_LIGHTING",
  "ELECTRICITY",
  "TRAFFIC_SIGNALS",
  "GAZ",
  "SANITATION",
  "ROADS",
  "ENVIRONMENT",
  "FIRE_SAFETY",
  "TELECOMMUNICATION_IOT",
  "EMERGENCY",
]

const TEAMS_BY_SPECIALITY: Record<string, string[]> = {
  PUBLIC_LIGHTING: ["Team Alpha - Lighting North", "Team Beta - Lighting South"],
  ELECTRICITY: ["Team Gamma - Electric West", "Team Delta - Electric East"],
  TRAFFIC_SIGNALS: ["Team Epsilon - Traffic Central"],
  GAZ: ["Team Zeta - Gas Response"],
  SANITATION: ["Team Eta - Sanitation Main", "Team Theta - Sanitation Backup"],
  ROADS: ["Team Iota - Roads North", "Team Kappa - Roads South"],
  ENVIRONMENT: ["Team Lambda - Environment"],
  FIRE_SAFETY: ["Team Mu - Fire Safety"],
  TELECOMMUNICATION_IOT: ["Team Nu - Telecom/IoT"],
  EMERGENCY: ["Team Xi - Emergency Response"],
}

export default function UserManagementPage() {
  const [selectedRole, setSelectedRole] = useState<"all" | "citizen" | "technician" | "team-leader">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [newUserRole, setNewUserRole] = useState<"citizen" | "technician" | "team-leader">("citizen")
  const [selectedSpeciality, setSelectedSpeciality] = useState("")
  const [viewingCitizen, setViewingCitizen] = useState<any | null>(null)

  // Mock users data
  const [users, setUsers] = useState([
    // Citizens
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@email.com",
      phone: "+1 555-0101",
      role: "citizen",
      address: "123 Main St, Apt 4B, North District",
      photo: "AJ",
      joinedDate: "2024-01-15",
      reportsSubmitted: 12,
      status: "active",
      incidents: [
        { id: 101, title: "Broken Street Light", date: "2024-12-10", status: "completed" },
        { id: 102, title: "Pothole on Oak St", date: "2024-12-14", status: "in-progress" },
      ],
      feedback: {
        uiRating: 4,
        uxRating: 5,
        comments: "Very easy to report incidents. The AI detection is amazing!",
        suggestions: "Would love to see real-time updates on my reports.",
      },
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "+1 555-0102",
      role: "citizen",
      address: "456 Elm Avenue, South District",
      photo: "BS",
      joinedDate: "2024-02-20",
      reportsSubmitted: 5,
      status: "active",
      incidents: [{ id: 103, title: "Water Leak", date: "2024-12-12", status: "scheduled" }],
      feedback: {
        uiRating: 5,
        uxRating: 4,
        comments: "Great app overall. Interface is very modern.",
        suggestions: "",
      },
    },
    // Technicians
    {
      id: 3,
      name: "Alex Rivera",
      email: "alex.rivera@intervenia.com",
      phone: "+1 555-0201",
      role: "technician",
      specialty: "ELECTRICITY",
      team: "Team Gamma - Electric West",
      joinedDate: "2023-06-10",
      tasksCompleted: 145,
      status: "active",
    },
    {
      id: 4,
      name: "Sam Chen",
      email: "sam.chen@intervenia.com",
      phone: "+1 555-0202",
      role: "technician",
      specialty: "SANITATION",
      team: "Team Eta - Sanitation Main",
      joinedDate: "2023-07-15",
      tasksCompleted: 132,
      status: "active",
    },
    {
      id: 5,
      name: "Chris Martinez",
      email: "chris.m@intervenia.com",
      phone: "+1 555-0203",
      role: "technician",
      specialty: "ROADS",
      team: "Team Iota - Roads North",
      joinedDate: "2023-08-20",
      tasksCompleted: 98,
      status: "active",
    },
    // Team Leaders
    {
      id: 6,
      name: "Sarah Johnson",
      email: "sarah.j@intervenia.com",
      phone: "+1 555-0301",
      role: "team-leader",
      specialty: "ELECTRICITY",
      team: "Team Gamma - Electric West",
      zone: "West District",
      joinedDate: "2023-01-10",
      teamSize: 5,
      status: "active",
    },
    {
      id: 7,
      name: "Michael Torres",
      email: "michael.t@intervenia.com",
      phone: "+1 555-0302",
      role: "team-leader",
      specialty: "ROADS",
      team: "",
      zone: "",
      joinedDate: "2023-02-15",
      teamSize: 6,
      status: "active",
    },
  ])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "citizen":
        return <UserCircle className="w-4 h-4" />
      case "technician":
        return <Wrench className="w-4 h-4" />
      case "team-leader":
        return <Shield className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "citizen":
        return "text-blue-400 border-blue-400/30 bg-blue-400/10"
      case "technician":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "team-leader":
        return "text-neon-purple border-neon-purple/30 bg-neon-purple/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter((u) => u.id !== userId))
      alert("User deleted successfully")
    }
  }

  const handleEditUser = (userId: number) => {
    setEditingUser(userId)
  }

  const handleSaveUser = () => {
    alert("User information updated successfully")
    setEditingUser(null)
  }

  const handleAddUser = () => {
    alert(`New ${newUserRole} account created successfully`)
    setShowAddUserForm(false)
    setSelectedSpeciality("")
  }

  const stats = {
    totalUsers: users.length,
    citizens: users.filter((u) => u.role === "citizen").length,
    technicians: users.filter((u) => u.role === "technician").length,
    teamLeaders: users.filter((u) => u.role === "team-leader").length,
  }

  const availableTeams = selectedSpeciality ? TEAMS_BY_SPECIALITY[selectedSpeciality] || [] : []

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/manager" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            <span className="text-sm text-muted-foreground">| User Management</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">User Management</h1>
            <p className="text-muted-foreground text-lg">Manage all users across the platform</p>
          </div>
          <Button
            onClick={() => setShowAddUserForm(true)}
            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <Users className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-400/5 to-blue-500/5 border-blue-400/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Citizens</span>
              <UserCircle className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">{stats.citizens}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-cyan/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Technicians</span>
              <Wrench className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{stats.technicians}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-purple/5 to-neon-purple/5 border-neon-purple/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Team Leaders</span>
              <Shield className="w-5 h-5 text-neon-purple" />
            </div>
            <p className="text-3xl font-bold">{stats.teamLeaders}</p>
          </Card>
        </div>

        {viewingCitizen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-3xl my-8 p-8 bg-background/95 backdrop-blur-xl border-blue-400/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Citizen Details</h3>
                <button
                  onClick={() => setViewingCitizen(null)}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-start gap-6 p-6 bg-muted/30 rounded-lg">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-background">
                    {viewingCitizen.photo}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">{viewingCitizen.name}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{viewingCitizen.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{viewingCitizen.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <MapPin className="w-4 h-4" />
                        <span>{viewingCitizen.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reported Incidents */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                    Reported Incidents ({viewingCitizen.incidents.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingCitizen.incidents.map((incident: any) => (
                      <div
                        key={incident.id}
                        className="p-4 bg-muted/20 border border-border/20 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{incident.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Report #{incident.id} • {incident.date}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${
                            incident.status === "completed"
                              ? "text-green-400 border-green-400/30 bg-green-400/10"
                              : incident.status === "in-progress"
                                ? "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
                                : "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    User Feedback
                  </h4>
                  <div className="p-6 bg-muted/20 border border-border/20 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">UI Rating</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < viewingCitizen.feedback.uiRating ? "text-yellow-400" : "text-muted-foreground/30"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 font-bold">{viewingCitizen.feedback.uiRating}/5</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">UX Rating</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < viewingCitizen.feedback.uxRating ? "text-yellow-400" : "text-muted-foreground/30"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 font-bold">{viewingCitizen.feedback.uxRating}/5</span>
                        </div>
                      </div>
                    </div>
                    {viewingCitizen.feedback.comments && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Comments</p>
                        <p className="text-sm bg-muted/30 p-3 rounded-lg">{viewingCitizen.feedback.comments}</p>
                      </div>
                    )}
                    {viewingCitizen.feedback.suggestions && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Suggestions</p>
                        <p className="text-sm bg-muted/30 p-3 rounded-lg">{viewingCitizen.feedback.suggestions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setViewingCitizen(null)}
                  variant="outline"
                  className="border-border/30 hover:border-neon-cyan/40"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Add User Form */}
        {showAddUserForm && (
          <Card className="mb-8 p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Create New User</h3>
              <button
                onClick={() => {
                  setShowAddUserForm(false)
                  setSelectedSpeciality("")
                }}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground block mb-2">User Role</label>
              <div className="flex gap-3">
                {[
                  { value: "citizen", label: "Citizen", icon: UserCircle },
                  { value: "technician", label: "Technician", icon: Wrench },
                  { value: "team-leader", label: "Team Leader", icon: Shield },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setNewUserRole(role.value as any)
                      setSelectedSpeciality("")
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      newUserRole === role.value
                        ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                        : "border-border/30 hover:border-neon-cyan/30"
                    }`}
                  >
                    <role.icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="john.doe@email.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="+1 555-0100"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {newUserRole === "technician" && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Speciality *</label>
                    <select
                      value={selectedSpeciality}
                      onChange={(e) => setSelectedSpeciality(e.target.value)}
                      className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                    >
                      <option value="">Select Speciality</option>
                      {PROFESSIONAL_SPECIALITIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Assign to Team *</label>
                    <select
                      disabled={!selectedSpeciality}
                      className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{selectedSpeciality ? "Select Team" : "Select speciality first"}</option>
                      {availableTeams.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {newUserRole === "team-leader" && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Speciality *</label>
                    <select className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none">
                      <option value="">Select Speciality</option>
                      {PROFESSIONAL_SPECIALITIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Team Name (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      placeholder="Leave empty if no team yet"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Zone (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      placeholder="Leave empty if unassigned"
                    />
                  </div>
                </>
              )}

              {newUserRole === "citizen" && (
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground block mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                    placeholder="123 Main St, District"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
              >
                Create User
              </Button>
              <Button
                onClick={() => {
                  setShowAddUserForm(false)
                  setSelectedSpeciality("")
                }}
                variant="outline"
                className="border-border/30 hover:border-neon-cyan/40"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedRole === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("all")}
              className={
                selectedRole === "all"
                  ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                  : "border-border/30 hover:border-neon-cyan/40"
              }
            >
              All Users
            </Button>
            <Button
              variant={selectedRole === "citizen" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("citizen")}
              className={
                selectedRole === "citizen"
                  ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                  : "border-border/30 hover:border-neon-cyan/40"
              }
            >
              Citizens
            </Button>
            <Button
              variant={selectedRole === "technician" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("technician")}
              className={
                selectedRole === "technician"
                  ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                  : "border-border/30 hover:border-neon-cyan/40"
              }
            >
              Technicians
            </Button>
            <Button
              variant={selectedRole === "team-leader" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("team-leader")}
              className={
                selectedRole === "team-leader"
                  ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                  : "border-border/30 hover:border-neon-cyan/40"
              }
            >
              Leaders
            </Button>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
            >
              {editingUser === user.id ? (
                <div>
                  {/* Edit form remains similar but should be updated with new fields */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                      />
                    </div>
                    {user.role === "technician" && (
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Specialty</label>
                        <select
                          defaultValue={user.specialty}
                          className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                        >
                          {PROFESSIONAL_SPECIALITIES.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveUser}
                      className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setEditingUser(null)}
                      variant="outline"
                      className="border-border/30 hover:border-neon-cyan/40"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                          user.role === "citizen"
                            ? "from-blue-400 to-blue-500"
                            : user.role === "technician"
                              ? "from-neon-cyan to-neon-blue"
                              : "from-neon-purple to-neon-blue"
                        } flex items-center justify-center text-sm font-bold text-background`}
                      >
                        {user.role === "citizen" && user.photo ? user.photo : user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRoleColor(user.role)} capitalize`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role.replace("-", " ")}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      {user.role === "citizen" && user.address && (
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-4 h-4" />
                          <span>{user.address}</span>
                        </div>
                      )}
                      {user.role === "technician" && (
                        <>
                          <div>
                            <span className="text-foreground font-medium">Specialty:</span>{" "}
                            {user.specialty?.replace(/_/g, " ")}
                          </div>
                          <div>
                            <span className="text-foreground font-medium">Team:</span> {user.team}
                          </div>
                          <div>
                            <span className="text-foreground font-medium">Tasks Completed:</span> {user.tasksCompleted}
                          </div>
                        </>
                      )}
                      {user.role === "team-leader" && (
                        <>
                          <div>
                            <span className="text-foreground font-medium">Specialty:</span>{" "}
                            {user.specialty?.replace(/_/g, " ")}
                          </div>
                          {user.team && (
                            <div>
                              <span className="text-foreground font-medium">Team:</span> {user.team}
                            </div>
                          )}
                          {user.zone && (
                            <div>
                              <span className="text-foreground font-medium">Zone:</span> {user.zone}
                            </div>
                          )}
                          <div>
                            <span className="text-foreground font-medium">Team Size:</span> {user.teamSize}
                          </div>
                        </>
                      )}
                      {user.role === "citizen" && (
                        <div>
                          <span className="text-foreground font-medium">Reports Submitted:</span>{" "}
                          {user.reportsSubmitted}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {user.role === "citizen" && (
                        <Button
                          onClick={() => setViewingCitizen(user)}
                          size="sm"
                          variant="outline"
                          className="border-blue-400/30 hover:border-blue-400/60 hover:bg-blue-400/5 bg-transparent text-blue-400"
                        >
                          <UserCircle className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      )}
                      <Button
                        onClick={() => handleEditUser(user.id)}
                        size="sm"
                        variant="outline"
                        className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        )}
      </main>
    </div>
  )
}
