"use client"

import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Bell, AlertTriangle, Brain, Users, CheckCircle, Clock } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: "1",
      type: "emergency",
      title: "Emergency Detected",
      message: "Critical fire incident detected in Zone A - Building fire in residential area",
      incident: "INC-1234",
      timestamp: "2024-01-15 14:32:15",
      recipients: ["Team Leader A", "Fire Brigade", "Admin"],
      status: "sent",
    },
    {
      id: "2",
      type: "planning",
      title: "Plan Generated",
      message: "AI emergency planning completed for INC-1234 - 5 technicians assigned",
      incident: "INC-1234",
      timestamp: "2024-01-15 14:32:45",
      recipients: ["Team Leader A", "Admin"],
      status: "sent",
    },
    {
      id: "3",
      type: "alert",
      title: "Team Leader Alerted",
      message: "Team Leader A notified for critical incident - Immediate response required",
      incident: "INC-1234",
      timestamp: "2024-01-15 14:33:00",
      recipients: ["Team Leader A"],
      status: "sent",
    },
    {
      id: "4",
      type: "dispatch",
      title: "Technicians Notified",
      message: "5 technicians dispatched to Zone A - ETA 8 minutes",
      incident: "INC-1234",
      timestamp: "2024-01-15 14:33:30",
      recipients: ["John Smith", "Sarah Lee", "Mike Brown", "Tom Johnson", "Emma Davis"],
      status: "sent",
    },
    {
      id: "5",
      type: "complete",
      title: "Mission Completed",
      message: "Intervention INC-1220 completed successfully - All technicians returned",
      incident: "INC-1220",
      timestamp: "2024-01-15 14:20:00",
      recipients: ["Team Leader D", "Admin"],
      status: "sent",
    },
    {
      id: "6",
      type: "emergency",
      title: "Emergency Detected",
      message: "Critical gas leak detected in Zone C - Commercial zone affected",
      incident: "INC-1235",
      timestamp: "2024-01-15 14:45:10",
      recipients: ["Team Leader C", "Gas Team", "Admin"],
      status: "sent",
    },
    {
      id: "7",
      type: "planning",
      title: "Plan Generated",
      message: "AI emergency planning completed for INC-1235 - 3 technicians assigned",
      incident: "INC-1235",
      timestamp: "2024-01-15 14:45:35",
      recipients: ["Team Leader C", "Admin"],
      status: "sent",
    },
    {
      id: "8",
      type: "planning",
      title: "Weekly Plan Generated",
      message: "Weekly optimization completed - 47 incidents planned, 76 assignments created",
      incident: null,
      timestamp: "2024-01-15 13:07:00",
      recipients: ["All Team Leaders", "Admin"],
      status: "sent",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return AlertTriangle
      case "planning":
        return Brain
      case "dispatch":
      case "alert":
        return Users
      case "complete":
        return CheckCircle
      default:
        return Bell
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "text-red-500"
      case "planning":
        return "text-[var(--neon-cyan)]"
      case "dispatch":
      case "alert":
        return "text-yellow-500"
      case "complete":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-950/30 border-red-800/50"
      case "planning":
        return "bg-[var(--neon-cyan)]/10 border-[var(--neon-cyan)]/30"
      case "dispatch":
      case "alert":
        return "bg-yellow-950/30 border-yellow-800/50"
      case "complete":
        return "bg-green-950/30 border-green-800/50"
      default:
        return "bg-[oklch(0.14_0.02_250)] border-[oklch(0.18_0.02_250)]"
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-[var(--neon-cyan)]" />
            Notification Center
          </h1>
          <p className="text-sm text-muted-foreground">Decision propagation system</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type)
            const color = getColor(notification.type)
            const bgColor = getBgColor(notification.type)
            const isCritical = notification.type === "emergency"

            return (
              <Card
                key={notification.id}
                className={`p-5 ${bgColor} ${isCritical ? "shadow-[0_0_20px_rgba(239,68,68,0.3)]" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isCritical ? "bg-red-500/20" : "bg-[oklch(0.14_0.02_250)]"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        {notification.incident && (
                          <p className="text-xs text-muted-foreground font-mono mt-1">{notification.incident}</p>
                        )}
                      </div>
                      {isCritical && (
                        <div className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-bold">URGENT</div>
                      )}
                    </div>

                    <p className="text-sm">{notification.message}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {notification.recipients.length} recipient{notification.recipients.length > 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Recipients */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {notification.recipients.slice(0, 5).map((recipient) => (
                        <span key={recipient} className="px-2 py-1 bg-[oklch(0.14_0.02_250)] rounded text-xs">
                          {recipient}
                        </span>
                      ))}
                      {notification.recipients.length > 5 && (
                        <span className="px-2 py-1 bg-[oklch(0.14_0.02_250)] rounded text-xs">
                          +{notification.recipients.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
