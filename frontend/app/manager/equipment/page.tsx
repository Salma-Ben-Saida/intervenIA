"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  Menu,
  Bell,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react"

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

export default function ManagerEquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null)

  // Sample equipment data across all zones
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
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
      signature: "PIPE-WRENCH-2024-003",
      equipmentName: "Pipe Wrench",
      quantity: 25,
      inUse: 12,
      equipmentType: "TOOL",
      status: "AVAILABLE",
      model: "Ridgid 18 inch",
      zone: "South District",
    },
    {
      id: "EQ-004",
      signature: "ASPHALT-MIX-2024-004",
      equipmentName: "Asphalt Mix",
      quantity: 5000,
      inUse: 850,
      equipmentType: "CONSUMABLE",
      status: "AVAILABLE",
      model: "Cold Patch",
      zone: "East District",
    },
    {
      id: "EQ-005",
      signature: "EXCAVATOR-2024-005",
      equipmentName: "Mini Excavator",
      quantity: 3,
      inUse: 2,
      equipmentType: "VEHICLE",
      status: "IN_USE",
      model: "Caterpillar 305.5E2",
      zone: "West District",
    },
  ])

  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    equipmentName: "",
    quantity: 0,
    inUse: 0,
    equipmentType: "TOOL",
    status: "AVAILABLE",
    model: "",
    zone: "North District",
  })

  const zones = ["North District", "South District", "East District", "West District"]
  const equipmentTypes = ["TOOL", "CONSUMABLE", "VEHICLE", "SAFETY_GEAR"]

  const handleAddEquipment = () => {
    const equipment: Equipment = {
      id: `EQ-${String(equipmentList.length + 1).padStart(3, "0")}`,
      signature: `${newEquipment.equipmentName?.toUpperCase().replace(/\s/g, "-")}-2024-${String(equipmentList.length + 1).padStart(3, "0")}`,
      equipmentName: newEquipment.equipmentName || "",
      quantity: newEquipment.quantity || 0,
      inUse: 0,
      equipmentType: newEquipment.equipmentType || "TOOL",
      status: "AVAILABLE",
      model: newEquipment.model || "",
      zone: newEquipment.zone || "North District",
    }
    setEquipmentList([...equipmentList, equipment])
    setShowAddForm(false)
    setNewEquipment({
      equipmentName: "",
      quantity: 0,
      inUse: 0,
      equipmentType: "TOOL",
      status: "AVAILABLE",
      model: "",
      zone: "North District",
    })
    alert("Equipment added successfully!")
  }

  const handleDeleteEquipment = (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      setEquipmentList(equipmentList.filter((eq) => eq.id !== id))
      alert("Equipment deleted successfully!")
    }
  }

  const handleEditEquipment = (id: string) => {
    setEditingEquipment(id)
  }

  const handleSaveEdit = (id: string) => {
    setEditingEquipment(null)
    alert("Equipment updated successfully!")
  }

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

  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === "all" || eq.zone === selectedZone
    return matchesSearch && matchesZone
  })

  const totalEquipment = equipmentList.length
  const availableEquipment = equipmentList.filter((eq) => eq.status === "AVAILABLE").length
  const totalInUse = equipmentList.reduce((sum, eq) => sum + eq.inUse, 0)

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
          <Link href="/manager" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            <span className="text-sm text-muted-foreground">| Equipment Management</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/manager">
            <Button
              variant="outline"
              className="mb-4 border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Equipment Management</h1>
          <p className="text-muted-foreground text-lg">Manage all equipment across all zones</p>
        </div>

        {/* Equipment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Equipment</span>
              <Package className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold">{totalEquipment}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all zones</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">{availableEquipment}</p>
            <p className="text-xs text-green-400 mt-1">Ready for deployment</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Currently In Use</span>
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="text-3xl font-bold">{totalInUse}</p>
            <p className="text-xs text-muted-foreground mt-1">Active deployments</p>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>

          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 bg-background/50 border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground"
          >
            <option value="all">All Zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        {/* Add Equipment Form */}
        {showAddForm && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 border-neon-cyan/30">
            <h3 className="text-xl font-bold mb-4">Add New Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Equipment Name</label>
                <input
                  type="text"
                  value={newEquipment.equipmentName}
                  onChange={(e) => setNewEquipment({ ...newEquipment, equipmentName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="e.g., Safety Cones"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Model</label>
                <input
                  type="text"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="e.g., 28-inch Premium"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Equipment Type</label>
                <select
                  value={newEquipment.equipmentType}
                  onChange={(e) => setNewEquipment({ ...newEquipment, equipmentType: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                >
                  {equipmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Zone</label>
                <select
                  value={newEquipment.zone}
                  onChange={(e) => setNewEquipment({ ...newEquipment, zone: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddEquipment}
                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
              >
                Save Equipment
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-border/30 hover:border-border/60"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Equipment List */}
        <div className="space-y-4">
          {filteredEquipment.map((equipment) => (
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

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground mb-1">Model</p>
                      <p className="font-semibold">{equipment.model}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Type</p>
                      <p className="font-semibold">{equipment.equipmentType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Zone</p>
                      <p className="font-semibold text-neon-blue">{equipment.zone}</p>
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
                  <div className="mb-3">
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

                  <div className="text-xs text-muted-foreground">
                    <span className="font-mono">{equipment.signature}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEquipment(equipment.id)}
                    className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteEquipment(equipment.id)}
                    className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No equipment found matching your filters.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
