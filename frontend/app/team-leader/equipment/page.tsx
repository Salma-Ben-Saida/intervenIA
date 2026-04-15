"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { Menu, Bell, Settings, Package, CheckCircle, Clock, ArrowLeft } from "lucide-react"

// Equipment structure based on backend
interface Equipment {
  id: string
  signature: string
  equipmentName: string
  quantity: number
  inUse: number
  equipmentType: string
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OUT_OF_SERVICE"
  model: string
  zone: string
}

export default function TeamLeaderEquipmentPage() {
  const teamSpeciality = "Electrical" // Team leader's speciality

  // Equipment filtered by speciality
  const equipmentList: Equipment[] = [
    {
      id: "EQ-001",
      signature: "LED-BULB-2024-001",
      equipmentName: "LED Bulbs",
      quantity: 500,
      inUse: 120,
      equipmentType: "CONSUMABLE",
      status: "AVAILABLE",
      model: "Philips 60W Equivalent",
      zone: "North District",
    },
    {
      id: "EQ-002",
      signature: "LADDER-EXT-2024-002",
      equipmentName: "Extension Ladder",
      quantity: 10,
      inUse: 3,
      equipmentType: "TOOL",
      status: "AVAILABLE",
      model: "Werner 24ft",
      zone: "North District",
    },
    {
      id: "EQ-003",
      signature: "MULTIMETER-2024-003",
      equipmentName: "Digital Multimeter",
      quantity: 15,
      inUse: 5,
      equipmentType: "TOOL",
      status: "AVAILABLE",
      model: "Fluke 87V",
      zone: "North District",
    },
    {
      id: "EQ-004",
      signature: "WIRE-CUTTER-2024-004",
      equipmentName: "Wire Cutters",
      quantity: 20,
      inUse: 8,
      equipmentType: "TOOL",
      status: "AVAILABLE",
      model: "Klein Tools Heavy Duty",
      zone: "North District",
    },
    {
      id: "EQ-005",
      signature: "CABLE-ELECT-2024-005",
      equipmentName: "Electrical Cable",
      quantity: 2000,
      inUse: 450,
      equipmentType: "CONSUMABLE",
      status: "AVAILABLE",
      model: "12 AWG Copper",
      zone: "North District",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "IN_USE":
        return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "MAINTENANCE":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      case "OUT_OF_SERVICE":
        return "text-red-400 border-red-400/30 bg-red-400/10"
      default:
        return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const getAvailabilityPercentage = (equipment: Equipment) => {
    return ((equipment.quantity - equipment.inUse) / equipment.quantity) * 100
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
            <span className="text-sm text-muted-foreground">| Equipment ({teamSpeciality})</span>
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
        <div className="mb-8">
          <Link href="/team-leader">
            <Button
              variant="outline"
              className="mb-4 border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">
            Equipment Inventory - {teamSpeciality}
          </h1>
          <p className="text-muted-foreground text-lg">
            View equipment related to your team's speciality in North District
          </p>
        </div>

        {/* Equipment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Items</span>
              <Package className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{equipmentList.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Equipment types</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">{equipmentList.filter((eq) => eq.status === "AVAILABLE").length}</p>
            <p className="text-xs text-green-400 mt-1">Ready for use</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Use</span>
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{equipmentList.reduce((sum, eq) => sum + eq.inUse, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently deployed</p>
          </Card>
        </div>

        {/* Equipment List */}
        <div className="space-y-4">
          {equipmentList.map((equipment) => (
            <Card
              key={equipment.id}
              className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20 hover:border-neon-cyan/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-5 h-5 text-neon-cyan" />
                    <h3 className="font-semibold text-lg">{equipment.equipmentName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(equipment.status)}`}>
                      {equipment.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground mb-1">Model</p>
                      <p className="font-semibold">{equipment.model}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Type</p>
                      <p className="font-semibold">{equipment.equipmentType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total Quantity</p>
                      <p className="font-semibold text-neon-cyan">{equipment.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">In Use</p>
                      <p className="font-semibold text-yellow-400">{equipment.inUse}</p>
                    </div>
                  </div>

                  {/* Availability Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">Availability</span>
                      <span className="font-semibold">
                        {equipment.quantity - equipment.inUse} / {equipment.quantity} available (
                        {getAvailabilityPercentage(equipment).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full transition-all duration-500"
                        style={{ width: `${getAvailabilityPercentage(equipment)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-mono">{equipment.signature}</span> • {equipment.zone}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
