"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"

const API_BASE = "http://localhost:8080/api/equipments"

// Enums matching backend
type EquipmentName =
    | "INSULATED_GLOVES" | "INSULATED_TOOLS" | "THERMAL_CAMERA" | "EARTH_RESISTANCE_TESTER"
    | "PHASE_ROTATION_TESTER" | "PORTABLE_GENERATOR" | "HYDRAULIC_CRIMPER" | "CABLE_STRIPPER"
    | "SURGE_PROTECTOR_TESTER" | "BATTERY_DIAGNOSTIC_KIT" | "MULTIMETER" | "FIRST_AID_KIT"
    | "PORTABLE_LIGHTING" | "COMMUNICATION_RADIO" | "INCIDENT_TABLET" | "POWER_BANK"
    | "CAUTION_TAPE" | "BASIC_TOOLKIT" | "BRUSH_CUTTER" | "LEAF_BLOWER" | "TREE_PRUNING_TOOL"
    | "PRESSURE_SPRAYER" | "WASTE_CONTAINER_RFID_READER" | "NOISE_LEVEL_METER"
    | "SOIL_MOISTURE_SENSOR" | "PROTECTIVE_GLOVES" | "SMOKE_DETECTOR_TESTER"
    | "FIRE_EXTINGUISHER_PRESSURE_GAUGE" | "FIRE_PUMP_PRESSURE_TEST_KIT" | "HYDRANT_FLOW_METER"
    | "GAS_LEAK_DETECTOR" | "HOSE_INSPECTION_TOOL" | "PROTECTIVE_GEAR" | "GAS_LEAK_SNIFFER"
    | "MANOMETER" | "PRESSURE_REGULATOR_TOOL" | "PIPE_FREEZING_KIT" | "NON_SPARKING_TOOLS"
    | "PIPE_WELDING_MACHINE" | "HEAT_FUSION_MACHINE" | "GAS_DETECTION_METER" | "LUX_METER"
    | "LADDER" | "HARNESS" | "POLE_CLIMBING_SPIKES" | "UNDERGROUND_CABLE_TRACER"
    | "CABLE_FAULT_LOCATOR" | "VOLTAGE_DETECTOR" | "HYDRAULIC_LIFT_TRUCK" | "LED_DRIVERS"
    | "PHOTOCELLS" | "BALLASTS" | "SPARE_LAMPS" | "ASPHALT_CUTTER" | "COMPACTOR_PLATE"
    | "CRACK_SEALING_MACHINE" | "MEASURING_WHEEL" | "TRAFFIC_CONES" | "ROAD_BARRIERS"
    | "PAINT_MARKING_MACHINE" | "SURVEYING_LEVEL" | "THEODOLITE" | "DRAIN_INSPECTION_CAMERA"
    | "HIGH_PRESSURE_JET" | "MANHOLE_LIFTER" | "SLUDGE_PUMP" | "FLOW_METER" | "RODDER"
    | "PROTECTIVE_BOOT_AND_GEAR" | "FIBER_FUSION_SPLICER" | "OTDR" | "LAN_CABLE_TESTER"
    | "WIFI_ANALYZER" | "SOLDERING_STATION" | "GPS_DEVICE" | "IOT_GATEWAY_CONFIGURATOR"
    | "SIM_CARD_TESTER" | "LOOP_DETECTOR_TESTER" | "TRAFFIC_CONTROLLER_DIAGNOSTIC_TOOL"
    | "PORTABLE_TRAFFIC_LIGHTS" | "SIGNAL_HEAD_LIFTING_POLE" | "UPS_BATTERY_TESTER"
    | "OSCILLOSCOPE" | "CONTROLLER_SPARE_MODULES" | "ELECTRICAL_TOOLKIT"

type EquipmentStatus = "OPERATIONAL" | "OUT_OF_SERVICE" | "UNDER_REPAIR" | "IN_VERIFICATION" | "BROKEN"
type EquipmentType = "CONSUMABLE_MATERIALS" | "HEAVY_TECHNICAL_EQUIPMENT" | "INTERVENTION_VEHICLES" | "SAFETY_EQUIPMENT" | "TECHNICAL_TOOLS" | "SPARE_PARTS"
type Zone = string

interface EquipmentDTO {
  id: string
  equipmentName: EquipmentName
  equipmentType: EquipmentType
  quantity: number
  inUse: number
  status: EquipmentStatus
  zone: Zone
  model: string
}

const EQUIPMENT_NAMES: EquipmentName[] = [
  "INSULATED_GLOVES", "INSULATED_TOOLS", "THERMAL_CAMERA", "EARTH_RESISTANCE_TESTER",
  "PHASE_ROTATION_TESTER", "PORTABLE_GENERATOR", "HYDRAULIC_CRIMPER", "CABLE_STRIPPER",
  "MULTIMETER", "FIRST_AID_KIT", "PORTABLE_LIGHTING", "COMMUNICATION_RADIO",
  "INCIDENT_TABLET", "POWER_BANK", "CAUTION_TAPE", "BASIC_TOOLKIT", "BRUSH_CUTTER",
  "LEAF_BLOWER", "LADDER", "HARNESS", "TRAFFIC_CONES", "ROAD_BARRIERS", "GPS_DEVICE",
  "ELECTRICAL_TOOLKIT", "MULTIMETER", "PROTECTIVE_GEAR", "PROTECTIVE_GLOVES"
]

const EQUIPMENT_TYPES: EquipmentType[] = [
  "CONSUMABLE_MATERIALS", "HEAVY_TECHNICAL_EQUIPMENT", "INTERVENTION_VEHICLES",
  "SAFETY_EQUIPMENT", "TECHNICAL_TOOLS", "SPARE_PARTS"
]

const ZONES = ["NORTH", "SOUTH", "CENTER"]

export default function ManagerEquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null)
  const [equipmentList, setEquipmentList] = useState<EquipmentDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [newEquipment, setNewEquipment] = useState<Partial<EquipmentDTO>>({
    equipmentName: "LADDER",
    quantity: 0,
    inUse: 0,
    equipmentType: "TECHNICAL_TOOLS",
    status: "OPERATIONAL",
    model: "",
    zone: "NORTH",
  })

  // =====================
  // FETCH ALL
  // =====================
  const fetchEquipments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_BASE)
      if (!res.ok) throw new Error("Failed to fetch equipment")
      const data: EquipmentDTO[] = await res.json()
      setEquipmentList(data)
    } catch (e: any) {
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipments()
  }, [])

  // =====================
  // ADD
  // =====================
  const handleAddEquipment = async () => {
    setSaving(true)
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEquipment),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to create equipment")
      }
      await fetchEquipments()
      setShowAddForm(false)
      setNewEquipment({
        equipmentName: "LADDER",
        quantity: 0,
        inUse: 0,
        equipmentType: "TECHNICAL_TOOLS",
        status: "OPERATIONAL",
        model: "",
        zone: "NORTH",
      })
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  // =====================
  // DELETE
  // =====================
  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete equipment")
      setEquipmentList((prev) => prev.filter((eq) => eq.id !== id))
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }

  // =====================
  // EDIT (status update)
  // =====================
  const handleSaveEdit = async (equipment: EquipmentDTO) => {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/${equipment.id}/status?status=${equipment.status}`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Failed to update status")
      const updated: EquipmentDTO = await res.json()
      setEquipmentList((prev) => prev.map((eq) => (eq.id === updated.id ? updated : eq)))
      setEditingEquipment(null)
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const updateLocalEquipment = (id: string, field: keyof EquipmentDTO, value: any) => {
    setEquipmentList((prev) =>
        prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    )
  }

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case "OPERATIONAL":     return "text-green-400 border-green-400/30 bg-green-400/10"
      case "OUT_OF_SERVICE":  return "text-red-400 border-red-400/30 bg-red-400/10"
      case "UNDER_REPAIR":    return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      case "IN_VERIFICATION": return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
      case "BROKEN":          return "text-orange-400 border-orange-400/30 bg-orange-400/10"
      default:                return "text-muted-foreground border-border/30 bg-muted/10"
    }
  }

  const getAvailabilityPercentage = (equipment: EquipmentDTO) => {
    if (equipment.quantity === 0) return 0
    return ((equipment.quantity - equipment.inUse) / equipment.quantity) * 100
  }

  const filteredEquipment = equipmentList.filter((eq) => {
    const name = eq.equipmentName?.toLowerCase().replace(/_/g, " ") ?? ""
    const model = eq.model?.toLowerCase() ?? ""
    const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        model.includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === "all" || eq.zone === selectedZone
    return matchesSearch && matchesZone
  })

  const totalEquipment = equipmentList.length
  const availableEquipment = equipmentList.filter((eq) => eq.status === "OPERATIONAL").length
  const totalInUse = equipmentList.reduce((sum, eq) => sum + (eq.inUse ?? 0), 0)

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
                <span className="text-sm text-muted-foreground">Operational</span>
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

          {/* Error Banner */}
          {error && (
              <Card className="p-4 mb-6 border-red-400/30 bg-red-400/5 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
                <Button size="sm" variant="outline" onClick={fetchEquipments} className="ml-auto border-red-400/30">
                  Retry
                </Button>
              </Card>
          )}

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
              {ZONES.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
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
                    <select
                        value={newEquipment.equipmentName}
                        onChange={(e) => setNewEquipment({ ...newEquipment, equipmentName: e.target.value as EquipmentName })}
                        className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                    >
                      {EQUIPMENT_NAMES.map((name) => (
                          <option key={name} value={name}>{name.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Model / Description</label>
                    <input
                        type="text"
                        value={newEquipment.model}
                        onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                        placeholder="e.g., Caterpillar 305E2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Quantity</label>
                    <input
                        type="number"
                        value={newEquipment.quantity}
                        onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                        placeholder="0"
                        min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Equipment Type</label>
                    <select
                        value={newEquipment.equipmentType}
                        onChange={(e) => setNewEquipment({ ...newEquipment, equipmentType: e.target.value as EquipmentType })}
                        className="w-full px-4 py-2 bg-background border border-neon-cyan/30 rounded-lg text-foreground focus:border-neon-cyan/60 focus:outline-none"
                    >
                      {EQUIPMENT_TYPES.map((type) => (
                          <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
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
                      {ZONES.map((zone) => (
                          <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                      onClick={handleAddEquipment}
                      disabled={saving}
                      className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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

          {/* Loading State */}
          {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mr-3" />
                <span className="text-muted-foreground">Loading equipment...</span>
              </div>
          ) : (
              <>
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
                              <h3 className="font-semibold text-lg">
                                {equipment.equipmentName?.replace(/_/g, " ")}
                              </h3>

                              {/* Status: editable when editing, badge otherwise */}
                              {editingEquipment === equipment.id ? (
                                  <select
                                      value={equipment.status}
                                      onChange={(e) => updateLocalEquipment(equipment.id, "status", e.target.value as EquipmentStatus)}
                                      className="text-xs px-2 py-1 rounded-full border bg-background border-neon-cyan/30 text-foreground focus:outline-none"
                                  >
                                    {(["OPERATIONAL", "OUT_OF_SERVICE", "UNDER_REPAIR", "IN_VERIFICATION", "BROKEN"] as EquipmentStatus[]).map((s) => (
                                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                                    ))}
                                  </select>
                              ) : (
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(equipment.status)}`}>
                            {equipment.status?.replace(/_/g, " ")}
                          </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-muted-foreground mb-1">Model</p>
                                <p className="font-semibold">{equipment.model || "—"}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Type</p>
                                <p className="font-semibold">{equipment.equipmentType?.replace(/_/g, " ")}</p>
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
                              <span className="font-mono">ID: {equipment.id}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {editingEquipment === equipment.id ? (
                                <>
                                  <Button
                                      size="sm"
                                      onClick={() => handleSaveEdit(equipment)}
                                      disabled={saving}
                                      className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                                  >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                  </Button>
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => { setEditingEquipment(null); fetchEquipments() }}
                                      className="border-border/30 hover:border-border/60"
                                  >
                                    Cancel
                                  </Button>
                                </>
                            ) : (
                                <>
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingEquipment(equipment.id)}
                                      className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent text-foreground hover:text-neon-cyan"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteEquipment(equipment.id)}
                                      className="border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5 bg-transparent text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </Button>
                                </>
                            )}
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>

                {filteredEquipment.length === 0 && !loading && (
                    <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border-border/20">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No equipment found matching your filters.</p>
                    </Card>
                )}
              </>
          )}
        </main>
      </div>
  )
}
