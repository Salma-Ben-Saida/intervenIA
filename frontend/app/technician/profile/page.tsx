"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react"

export default function TechnicianProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSaveChanges = () => {
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/technician" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/technician"
          className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-blue transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-3 tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground text-lg mb-12">Manage your profile information</p>

        {/* Profile Photo */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan/40 flex items-center justify-center text-3xl font-bold">
              AR
            </div>
            <div>
              <Button
                className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Rivera"
                disabled
                className="w-full px-4 py-2 bg-muted/10 border border-border/20 rounded-lg text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Name can only be changed by administrator</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex.rivera@intervenia.com"
                disabled
                className="w-full px-4 py-2 bg-muted/10 border border-border/20 rounded-lg text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email can only be changed by administrator</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Technician ID</label>
              <input
                type="text"
                defaultValue="TECH-2847"
                disabled
                className="w-full px-4 py-2 bg-muted/10 border border-border/20 rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Specialty</label>
              <input
                type="text"
                defaultValue="Electrical"
                disabled
                className="w-full px-4 py-2 bg-muted/10 border border-border/20 rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
          >
            Save Changes
          </Button>
          <Button variant="outline" className="border-border/30 hover:border-neon-cyan/40 bg-transparent">
            <Link href="/technician">Cancel</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
