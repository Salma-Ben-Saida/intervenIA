"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InterveniaLogo } from "@/components/intervenia-logo"
import {
  ArrowLeft, Camera, Upload, MapPin, Sparkles, List,
  CheckCircle, X, Loader2, AlertCircle, Info
} from "lucide-react"

// Define types based on your DTOs
interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface IncidentName {
  id?: string;
  code: string;
  label: string;
  urgency: string;
  domain: string;
}

interface AiClassificationResponse {
  aiConfidence: number;
  aiPredictedName: string;
  citizenMessage: string;
  description: string;
  photos: string[];
}

interface IncidentAiDTO {
  description: string;
  photos: string[];
  citizenMessage?: string;
}

interface CreateIncidentDTO {
  description: string;
  photos: string[];
  citizenId: string;
  location: Location;
  finalName: String;
  aiEnabled: boolean;
  aiConfidence?: number;
  aiPredictedName?: string;
  citizenMessage?: string;
}

// Helper function to get incident details by code
const getIncidentByCode = (code: string): IncidentName | null => {
  for (const [domain, incidents] of Object.entries(INCIDENT_DOMAINS)) {
    const incident = incidents.find(inc => inc.code === code);
    if (incident) {
      return {
        code: incident.code,
        label: incident.label,
        urgency: incident.urgency,
        domain: domain
      };
    }
  }
  return null;
}

const INCIDENT_DOMAINS = {
  "Public Lighting": [
    { code: "STREET_LIGHT_OUT", label: "Street Light Out", urgency: "MEDIUM", domain: "Public Lighting" },
    { code: "FLICKERING_LIGHT", label: "Flickering Light", urgency: "LOW", domain: "Public Lighting" },
    { code: "BROKEN_LIGHT_POLE", label: "Broken Light Pole", urgency: "HIGH", domain: "Public Lighting" },
  ],
  Electricity: [
    { code: "POWER_OUTAGE", label: "Power Outage", urgency: "HIGH", domain: "Electricity" },
    { code: "ELECTRICAL_SPARK", label: "Electrical Spark", urgency: "CRITICAL", domain: "Electricity" },
    { code: "BROKEN_TRANSFORMER", label: "Broken Transformer", urgency: "CRITICAL", domain: "Electricity" },
  ],
  "Traffic Signals": [
    { code: "TRAFFIC_LIGHT_OUT", label: "Traffic Light Out", urgency: "HIGH", domain: "Traffic Signals" },
    { code: "PEDESTRIAN_LIGHT_OUT", label: "Pedestrian Light Out", urgency: "MEDIUM", domain: "Traffic Signals" },
    { code: "FAULTY_LED_PANEL", label: "Faulty LED Panel", urgency: "LOW", domain: "Traffic Signals" },
    { code: "BROKEN_TRAFFIC_SIGNAL", label: "Broken Traffic Signal", urgency: "HIGH", domain: "Traffic Signals" },
  ],
  "Water & Sanitation": [
    { code: "WATER_LEAK", label: "Water Leak", urgency: "MEDIUM", domain: "Water & Sanitation" },
    { code: "PIPE_BURST", label: "Pipe Burst", urgency: "HIGH", domain: "Water & Sanitation" },
    { code: "SEWER_OVERFLOW", label: "Sewer Overflow", urgency: "CRITICAL", domain: "Water & Sanitation" },
    { code: "CLOGGED_DRAIN", label: "Clogged Drain", urgency: "LOW", domain: "Water & Sanitation" },
  ],
  Roads: [
    { code: "POTHOLE", label: "Pothole", urgency: "LOW", domain: "Roads" },
    { code: "ROAD_DAMAGE", label: "Road Damage", urgency: "MEDIUM", domain: "Roads" },
    { code: "BROKEN_SIDEWALK", label: "Broken Sidewalk", urgency: "MEDIUM", domain: "Roads" },
  ],
  Environment: [
    { code: "FALLEN_TREE", label: "Fallen Tree", urgency: "HIGH", domain: "Environment" },
    { code: "TRASH_OVERFLOW", label: "Trash Overflow", urgency: "LOW", domain: "Environment" },
    { code: "ILLEGAL_DUMPING", label: "Illegal Dumping", urgency: "LOW", domain: "Environment" },
  ],
  "Fire & Safety": [
    { code: "FIRE_START", label: "Fire Start", urgency: "CRITICAL", domain: "Fire & Safety" },
    { code: "SMOKE_OBSERVATION", label: "Smoke Observation", urgency: "HIGH", domain: "Fire & Safety" },
    { code: "EXPLOSION_RISK", label: "Explosion Risk", urgency: "CRITICAL", domain: "Fire & Safety" },
    { code: "CHEMICAL_SMELL", label: "Chemical Smell", urgency: "CRITICAL", domain: "Fire & Safety" },
  ],
  Gas: [
    { code: "GAS_SMELL", label: "Gas Smell", urgency: "CRITICAL", domain: "Gas" },
    { code: "GAS_PIPE_LEAK", label: "Gas Pipe Leak", urgency: "CRITICAL", domain: "Gas" },
  ],
  "Telecommunication / IOT": [
    { code: "CCTV_DOWN", label: "CCTV Down", urgency: "LOW", domain: "Telecommunication / IOT" },
    { code: "IOT_SENSOR_FAILURE", label: "IoT Sensor Failure", urgency: "LOW", domain: "Telecommunication / IOT" },
    { code: "FIBRE_OPTIC", label: "Fibre Optic Issue", urgency: "MEDIUM", domain: "Telecommunication / IOT" },
  ],
  Other: [{ code: "UNKNOWN", label: "Unknown / Other", urgency: "MEDIUM", domain: "Other" }],
}

export default function ReportIncident() {
  // User state
  const [citizenId, setCitizenId] = useState<string>("");

  // Form state
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 })
  const [citizenMessage, setCitizenMessage] = useState("")

  // AI Classification state
  const [aiResult, setAiResult] = useState<{
    aiPredictedName?: string; // Changed to string
    aiConfidence?: number;
    aiEnabled: boolean;
    aiCitizenMessage?: string; // Added separate field for citizen message
    incidentDetails?: IncidentName; // Added to store incident details
  } | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)

  // Manual reporting state
  const [showManualForm, setShowManualForm] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedIncident, setSelectedIncident] = useState<IncidentName | null>(null)
  const [otherDescription, setOtherDescription] = useState("")

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Get citizen ID from localStorage on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    if (userId && userRole === "CITIZEN") {
      setCitizenId(userId);
    } else {
      // Redirect if not citizen
      window.location.href = "/auth";
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      setPhotos([...photos, ...newPhotos])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: ""
            };
            setLocation(newLocation)
            setAddress(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
          },
          (error) => {
            console.error("Error getting location:", error)
            alert("Unable to get your location. Please enter address manually.")
          },
      )
    }
  }

  const handleAIClassification = async () => {
    if (!description.trim()) {
      alert("Please provide a description first")
      return
    }

    setIsClassifying(true)
    setError(null)
    setAiResult(null)

    try {
      // Prepare AI request
      const aiRequest: IncidentAiDTO = {
        description,
        photos: [], // Empty array for now
        citizenMessage: citizenMessage
      };

      const response = await fetch("http://localhost:8080/api/ai/incidents/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(aiRequest)
      });

      if (!response.ok) {
        throw new Error(`AI classification failed: ${response.status}`);
      }

      const aiResponse: AiClassificationResponse = await response.json();

      // Get incident details from the code
      const incidentDetails = getIncidentByCode(aiResponse.aiPredictedName);

      // Update AI result state
      setAiResult({
        aiPredictedName: aiResponse.aiPredictedName,
        aiConfidence: aiResponse.aiConfidence,
        aiCitizenMessage: aiResponse.citizenMessage,
        aiEnabled: true,
        incidentDetails: incidentDetails || undefined
      });

      // Show AI result message
      if (aiResponse.aiPredictedName === "UNKNOWN") {
        setError("AI couldn't confidently classify this incident. Please use manual reporting.");
      }

    } catch (err: any) {
      console.error("AI classification error:", err);
      setError(err.message || "Failed to classify with AI. Please try manual reporting.");
    } finally {
      setIsClassifying(false);
    }
  }

  const handleConfirmAIReport = async () => {
    if (!description.trim() || !address.trim()) {
      setError("Please fill in all required fields (description and address)");
      return;
    }

    if (!aiResult?.aiPredictedName || !aiResult.incidentDetails) {
      setError("Please use AI classification first or switch to manual reporting");
      return;
    }

    await submitReport({
      aiEnabled: true,
      finalName: aiResult.incidentDetails,
      aiConfidence: aiResult.aiConfidence,
      aiPredictedName: aiResult.aiPredictedName
    });
  }

  const handleManualReport = async () => {
    if (!description.trim() || !address.trim() || !selectedIncident) {
      setError("Please fill in all required fields");
      return;
    }

    if (selectedDomain === "Other" && !otherDescription.trim()) {
      setError("Please provide a description for 'Other' incident type");
      return;
    }

    await submitReport({
      aiEnabled: false,
      finalName: selectedIncident,
      aiConfidence: undefined,
      aiPredictedName: undefined
    });
  }

  const submitReport = async (reportData: {
    aiEnabled: boolean;
    finalName: IncidentName;
    aiConfidence?: number;
    aiPredictedName?: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not authenticated. Please login again.");
      }

      // Create incident request - EXTRACT THE CODE FROM THE IncidentName OBJECT
      const createRequest: CreateIncidentDTO = {
        description,
        photos: [], // Empty array for now - photos not being sent to backend
        citizenId: userId,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: address
        },
        finalName: reportData.finalName.code, // CHANGED: Send only the code, not the object
        aiEnabled: reportData.aiEnabled,
        aiConfidence: reportData.aiConfidence,
        aiPredictedName: reportData.aiPredictedName,
        citizenMessage: citizenMessage
      };

      console.log("Submitting incident:", createRequest); // Debug log

      const response = await fetch("http://localhost:8080/api/incidents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(createRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit report: ${response.status} - ${errorText}`);
      }

      const incident = await response.json();
      console.log("Incident created successfully:", incident);

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/citizen";
      }, 2000);

    } catch (err: any) {
      console.error("Report submission error:", err);
      setError(err.message || "Failed to submit incident report");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getIncidentsForDomain = () => {
    if (!selectedDomain) return [];
    const incidents = INCIDENT_DOMAINS[selectedDomain as keyof typeof INCIDENT_DOMAINS] || [];
    return incidents.map(inc => ({
      code: inc.code,
      label: inc.label,
      urgency: inc.urgency,
      domain: inc.domain
    }));
  }

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain)
    setSelectedIncident(null)
    setOtherDescription("")
  }

  const handleIncidentSelect = (incidentCode: string) => {
    const incidents = getIncidentsForDomain();
    const selected = incidents.find(inc => inc.code === incidentCode);
    setSelectedIncident(selected || null);
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
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

  if (!citizenId) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-neon-cyan" />
            <p>Loading...</p>
          </div>
        </div>
    );
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
            <Link href="/citizen" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 text-neon-cyan">
                  <InterveniaLogo />
                </div>
                <span className="font-bold text-lg tracking-tight">Back to Dashboard</span>
              </div>
            </Link>
            <div className="text-sm text-muted-foreground">
              User ID: <span className="font-mono text-xs">{citizenId.substring(0, 8)}...</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 tracking-tight text-balance">Report an Incident</h1>
            <p className="text-muted-foreground text-lg">Help us keep your city safe and well-maintained</p>
          </div>

          {/* Success Message */}
          {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Incident reported successfully!</p>
                  <p className="text-sm opacity-80">Redirecting to dashboard...</p>
                </div>
              </div>
          )}

          {/* Error Message */}
          {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
          )}

          {/* Description Section */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>Description</span>
              <span className="text-red-400">*</span>
            </h2>
            <Textarea
                placeholder="Describe the incident in detail (e.g., 'Street light not working on Main Street near the park entrance')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 bg-background/50 border-neon-cyan/20 focus:border-neon-cyan/50"
                disabled={isSubmitting}
            />
          </Card>

          {/* Photo Upload Section - Frontend only for now */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
            <h2 className="text-xl font-semibold mb-4">Photos (Optional)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Note: Photo upload to backend is currently disabled. Photos will only be displayed locally.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      capture="environment"
                      disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neon-cyan/30 rounded-lg hover:border-neon-cyan/60 hover:bg-neon-cyan/5 transition-all disabled:opacity-50">
                    <Camera className="w-5 h-5 text-neon-cyan" />
                    <span className="text-sm font-medium">Take Photo</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neon-cyan/30 rounded-lg hover:border-neon-cyan/60 hover:bg-neon-cyan/5 transition-all disabled:opacity-50">
                    <Upload className="w-5 h-5 text-neon-cyan" />
                    <span className="text-sm font-medium">Upload from Gallery</span>
                  </div>
                </label>
              </div>

              {photos.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {photos.length} photo{photos.length !== 1 ? 's' : ''} selected (local preview only)
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(photo) || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-neon-cyan/20"
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                disabled={isSubmitting}
                                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </Card>






          {/* Location Section */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>Location</span>
              <span className="text-red-400">*</span>
            </h2>
            <div className="space-y-4">
              <div className="w-full h-64 bg-muted/20 rounded-lg border border-neon-cyan/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-neon-cyan mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Location will be sent with your report</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {location.lat !== 0 && location.lng !== 0
                        ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
                        : "Location not set"}
                  </p>
                  <Button
                      onClick={handleUseLocation}
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use My Current Location
                  </Button>
                </div>
              </div>

              {/* Address Description Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Address Description (Optional)</label>
                <Textarea
                    placeholder="Please provide as much detail as possible for accurate location..."
                    value={citizenMessage}
                    onChange={(e) => setCitizenMessage(e.target.value)}
                    className="min-h-24 bg-background/50 border-neon-cyan/20 focus:border-neon-cyan/50"
                    disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Add extra details like floor number, building color, nearby landmarks, etc.
                </p>
              </div>
            </div>
          </Card>

          {/* AI Classification Section */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              <span>AI Classification</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Let our AI analyze your description to suggest the incident type and urgency
            </p>

            <div className="space-y-4">
              <Button
                  onClick={handleAIClassification}
                  disabled={isClassifying || isSubmitting || !description.trim()}
                  className="w-full bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50"
              >
                {isClassifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Classify Incident with AI
                    </>
                )}
              </Button>

              {aiResult && aiResult.incidentDetails && (
                  <div className="mt-4 p-4 bg-background/50 rounded-lg border border-neon-cyan/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">AI Suggested Classification:</p>
                        <p className="text-lg font-semibold">{aiResult.incidentDetails.label}</p>
                        <p className="text-sm text-muted-foreground">{aiResult.incidentDetails.domain}</p>
                      </div>
                      <span
                          className={`text-xs px-3 py-1 rounded-full border ${getUrgencyColor(aiResult.incidentDetails.urgency || '')}`}
                      >
                    {aiResult.incidentDetails.urgency || 'MEDIUM'} Priority
                  </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="w-4 h-4 text-neon-cyan" />
                        <span>Confidence: <strong>{aiResult.aiConfidence}%</strong></span>
                      </div>

                      {/* Citizen Message from AI */}
                      {aiResult.aiCitizenMessage && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium mb-1">AI Safety Message:</p>
                            <p className="text-sm text-blue-600">{aiResult.aiCitizenMessage}</p>
                          </div>
                      )}

                      {aiResult.aiPredictedName === "UNKNOWN" ? (
                          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-sm text-yellow-600">
                              AI couldn't confidently classify this incident. Please use manual reporting below.
                            </p>
                          </div>
                      ) : (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-600">
                              AI has classified your incident with high confidence. Please review and confirm.
                            </p>
                          </div>
                      )}

                      <Button
                          onClick={handleConfirmAIReport}
                          disabled={isSubmitting || aiResult.aiPredictedName === "UNKNOWN"}
                          className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white hover:from-green-500 hover:to-emerald-500 border border-green-500/40 transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                        ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm AI Classification & Submit Report
                            </>
                        )}
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </Card>

          {/* Manual Reporting Section */}
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <List className="w-5 h-5 text-neon-blue" />
                <span>Manual Reporting</span>
              </h2>
              {showManualForm && (
                  <Button
                      onClick={() => {
                        setShowManualForm(false)
                        setSelectedDomain("")
                        setSelectedIncident(null)
                        setOtherDescription("")
                      }}
                      variant="outline"
                      size="sm"
                      className="border-border/30 hover:border-border/60"
                      disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Prefer to select the incident type yourself? Use manual reporting
            </p>

            {!showManualForm ? (
                <Button
                    onClick={() => setShowManualForm(true)}
                    variant="outline"
                    className="w-full border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5"
                    disabled={isSubmitting}
                >
                  <List className="w-4 h-4 mr-2" />
                  Report Manually
                </Button>
            ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Incident Domain / Specialty *</label>
                    <select
                        value={selectedDomain}
                        onChange={(e) => handleDomainChange(e.target.value)}
                        className="w-full px-4 py-2 bg-background/50 border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                      <option value="">Select incident domain</option>
                      {Object.keys(INCIDENT_DOMAINS).map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                      ))}
                    </select>
                  </div>

                  {selectedDomain && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Specific Incident *</label>
                        <select
                            value={selectedIncident?.code || ""}
                            onChange={(e) => handleIncidentSelect(e.target.value)}
                            className="w-full px-4 py-2 bg-background/50 border border-neon-cyan/20 focus:border-neon-cyan/50 rounded-lg text-foreground disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                          <option value="">Select incident type</option>
                          {getIncidentsForDomain().map((incident) => (
                              <option key={incident.code} value={incident.code}>
                                {incident.label} - {incident.urgency} Priority
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  {selectedDomain === "Other" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe the incident *</label>
                        <Input
                            placeholder="Please provide details about this incident..."
                            value={otherDescription}
                            onChange={(e) => setOtherDescription(e.target.value)}
                            className="bg-background/50 border-neon-cyan/20 focus:border-neon-cyan/50"
                            disabled={isSubmitting}
                        />
                      </div>
                  )}

                  <Button
                      onClick={handleManualReport}
                      disabled={isSubmitting || !selectedDomain || !selectedIncident}
                      className="w-full bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                    ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Manual Report
                        </>
                    )}
                  </Button>
                </div>
            )}
          </Card>
        </main>
      </div>
  )
}