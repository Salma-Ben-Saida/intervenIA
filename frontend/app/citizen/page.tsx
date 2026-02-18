"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Bell, MapPin, Clock, AlertTriangle, CheckCircle, Camera, Menu, Settings, MessageSquare } from "lucide-react"

export default function CitizenDashboard() {
  // Sample recent incidents data
  const recentIncidents = [
    {
      id: 1,
      title: "Broken Street Light",
      status: "in-progress",
      urgency: "medium",
      location: "Main St & 5th Ave",
      reportedAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Pothole on Highway",
      status: "completed",
      urgency: "high",
      location: "Highway 101, Exit 42",
      reportedAt: "1 day ago",
    },
    {
      id: 3,
      title: "Graffiti on Public Wall",
      status: "pending",
      urgency: "low",
      location: "Park Avenue",
      reportedAt: "3 days ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "in-progress":
        return "text-neon-blue border-neon-blue/30 bg-neon-blue/10"
      case "pending":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-muted-foreground"
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
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">Total incidents reported</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">Being addressed</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">9</p>
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
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <Card
                key={incident.id}
                className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(incident.status)} capitalize`}
                      >
                        {incident.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{incident.reportedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${getUrgencyColor(incident.urgency)}`} />
                        <span className={getUrgencyColor(incident.urgency)}>{incident.urgency} priority</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
