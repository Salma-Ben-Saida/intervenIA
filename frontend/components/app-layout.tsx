"use client"

import { type ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { InterveniaLogo } from "./intervenia-logo"
import { LayoutDashboard, AlertTriangle, Brain, Users, Wrench, Bell, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { href: "/command", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/command/incidents", icon: AlertTriangle, label: "Incidents" },
    { href: "/command/planning", icon: Brain, label: "AI Planning" },
    { href: "/command/technicians", icon: Users, label: "Technicians" },
    { href: "/command/equipment", icon: Wrench, label: "Equipment" },
    { href: "/command/notifications", icon: Bell, label: "Notifications" },
  ]

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[oklch(0.09_0.01_250)] border-r border-[oklch(0.18_0.02_250)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[oklch(0.18_0.02_250)]">
          <div className="flex items-center gap-3">
            <InterveniaLogo className="w-10 h-10 text-[var(--neon-cyan)]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">IntervenIA</h1>
              <p className="text-xs text-muted-foreground">Urban Control</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-[oklch(0.14_0.02_250)]",
                  isActive
                    ? "bg-[oklch(0.14_0.02_250)] text-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,200,255,0.2)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[oklch(0.18_0.02_250)]">
          <div className="flex items-center gap-3 px-4 py-3 bg-[oklch(0.14_0.02_250)] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center text-black font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-[var(--neon-cyan)]">System Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[oklch(0.09_0.01_250)] border-b border-[oklch(0.18_0.02_250)] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Urban Control Center</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Clock */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[oklch(0.14_0.02_250)] rounded-lg border border-[oklch(0.18_0.02_250)]">
              <Clock className="w-4 h-4 text-[var(--neon-cyan)]" />
              <span className="text-sm font-mono font-medium">{currentTime}</span>
            </div>

            {/* User Role Badge */}
            <div className="px-3 py-1 bg-[var(--neon-cyan)] text-black rounded-md text-sm font-semibold">ADMIN</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black">{children}</main>
      </div>
    </div>
  )
}
