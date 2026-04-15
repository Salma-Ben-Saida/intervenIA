"use client"

import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Wrench, MapPin, AlertTriangle } from "lucide-react"

export default function EquipmentPage() {
  const equipment = [
    {
      name: "Fire Truck",
      zone: "Zone A",
      quantity: 3,
      inUse: 2,
      status: "Limited",
      reservedFor: ["INC-1234"],
    },
    {
      name: "Gas Detector",
      zone: "Zone C",
      quantity: 8,
      inUse: 3,
      status: "Available",
      reservedFor: [],
    },
    {
      name: "Voltage Tester",
      zone: "Zone B",
      quantity: 12,
      inUse: 4,
      status: "Available",
      reservedFor: ["INC-1236"],
    },
    {
      name: "Safety Gear Set",
      zone: "All Zones",
      quantity: 50,
      inUse: 18,
      status: "Available",
      reservedFor: [],
    },
    {
      name: "Cable Repair Kit",
      zone: "Zone B",
      quantity: 5,
      inUse: 4,
      status: "Critical",
      reservedFor: ["INC-1236"],
    },
    {
      name: "Asphalt Mix Unit",
      zone: "Zone D",
      quantity: 6,
      inUse: 2,
      status: "Available",
      reservedFor: [],
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="w-7 h-7 text-[var(--neon-cyan)]" />
            Equipment Management
          </h1>
          <p className="text-sm text-muted-foreground">Physical constraints and availability</p>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => {
            const availabilityPercent = ((item.quantity - item.inUse) / item.quantity) * 100
            const isCritical = availabilityPercent < 30
            const isLimited = availabilityPercent < 50 && !isCritical

            return (
              <Card
                key={`${item.name}-${item.zone}`}
                className={`bg-[oklch(0.11_0.01_250)] p-5 ${
                  isCritical
                    ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : isLimited
                      ? "border-yellow-500/50"
                      : "border-[oklch(0.18_0.02_250)]"
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{item.zone}</span>
                      </div>
                    </div>
                    {isCritical && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  </div>

                  {/* Availability Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Availability</span>
                      <span className="font-semibold">
                        {item.quantity - item.inUse} / {item.quantity}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-[oklch(0.18_0.02_250)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCritical ? "bg-red-500" : isLimited ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${availabilityPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{item.inUse} in use</span>
                      <span
                        className={`text-xs font-semibold ${
                          isCritical ? "text-red-500" : isLimited ? "text-yellow-500" : "text-green-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Reserved For */}
                  {item.reservedFor.length > 0 && (
                    <div className="pt-3 border-t border-[oklch(0.18_0.02_250)]">
                      <p className="text-xs text-muted-foreground mb-2">Reserved for:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.reservedFor.map((incident) => (
                          <span
                            key={incident}
                            className="px-2 py-1 bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] rounded text-xs font-mono"
                          >
                            {incident}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
