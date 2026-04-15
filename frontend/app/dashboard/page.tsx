import InterventionDashboard from "@/components/intervention-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Intervention Dashboard - IntervenIA",
  description: "Real-time intervention planning, scheduling, and technician assignment dashboard",
}

export default function DashboardPage() {
  return <InterventionDashboard />
}
