"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { ArrowLeft, Star, Send } from "lucide-react"

export default function CitizenFeedback() {
  const [uiRating, setUiRating] = useState(0)
  const [uxRating, setUxRating] = useState(0)
  const [overallRating, setOverallRating] = useState(0)

  const handleSubmit = () => {
    alert("Thank you for your feedback! Your response has been submitted.")
  }

  const RatingStars = ({
    rating,
    setRating,
    label,
  }: {
    rating: number
    setRating: (rating: number) => void
    label: string
  }) => (
    <div>
      <label className="text-sm text-muted-foreground block mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} className="transition-all hover:scale-110">
            <Star
              className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          </button>
        ))}
      </div>
    </div>
  )

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
          <Link href="/citizen" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/citizen"
          className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-blue transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-3 tracking-tight">Share Your Feedback</h1>
        <p className="text-muted-foreground text-lg mb-12">Help us improve IntervenIA by sharing your experience</p>

        {/* Ratings Section */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-6">Rate Your Experience</h2>
          <div className="space-y-6">
            <RatingStars rating={overallRating} setRating={setOverallRating} label="Overall Experience" />
            <RatingStars rating={uiRating} setRating={setUiRating} label="User Interface (Design & Layout)" />
            <RatingStars rating={uxRating} setRating={setUxRating} label="User Experience (Ease of Use)" />
          </div>
        </Card>

        {/* Feedback Text */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-4">Tell Us More</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                What do you like most about IntervenIA?
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none resize-none"
                placeholder="Share what you enjoy about using the app..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">What could we improve or add?</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none resize-none"
                placeholder="Suggest features, improvements, or changes you'd like to see..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Did you encounter any issues or bugs?</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none resize-none"
                placeholder="Describe any problems or technical issues you experienced..."
              />
            </div>
          </div>
        </Card>

        {/* Feature Requests */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <h2 className="text-xl font-bold mb-4">Feature Suggestions</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Dark mode / Light mode toggle</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Push notifications for incident updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Mobile app version</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Incident tracking map with real-time updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Ability to attach videos to incident reports</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-neon-cyan" />
              <span>Community forum or discussion board</span>
            </label>
          </div>
          <div className="mt-4">
            <label className="text-sm text-muted-foreground block mb-2">Other feature ideas:</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 bg-muted/30 border border-border/30 rounded-lg focus:border-neon-cyan/60 focus:outline-none resize-none"
              placeholder="Suggest any other features you'd like to see..."
            />
          </div>
        </Card>

        {/* Contact Permission */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-card to-card/50 border-border/20">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-1 accent-neon-cyan" />
            <span className="text-sm">
              I'm willing to be contacted by the IntervenIA team for follow-up questions about my feedback
            </span>
          </label>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
          <Button variant="outline" className="border-border/30 hover:border-neon-cyan/40 bg-transparent">
            <Link href="/citizen">Cancel</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
