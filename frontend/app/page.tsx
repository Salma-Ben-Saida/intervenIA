import { Button } from "@/components/ui/button"
import { Camera, Zap, Users, Network } from "lucide-react"
import Link from "next/link"
import { InterveniaLogo } from "@/components/intervenia-logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-neon-cyan">
              <InterveniaLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervenIA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Benefits
            </Link>
            <Link
              href="/command"
              className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-300 font-medium"
            >
              Control Center
            </Link>
            <Button
              className="bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/30 transition-all duration-300 shadow-lg shadow-neon-cyan/20"
              asChild
            >
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Background Network Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Glow effects */}
        <div className="absolute top-40 right-20 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-neon-purple/3 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 backdrop-blur-sm">
            <span className="text-xs font-medium text-neon-cyan tracking-wide">SMART CITY CONTROL CENTER</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance leading-tight">
            Smart City Interventions.{" "}
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Made Intelligent.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance leading-relaxed">
            IntervenIA leverages AI to optimize city services, manage incidents, and streamline interventions with
            precision and speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-xl shadow-neon-cyan/25 hover:shadow-neon-cyan/40"
              asChild
            >
              <Link href="/auth">
                Report an Incident
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-neon-cyan/0 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neon-cyan/30 bg-neon-cyan/5 text-foreground hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
            >
              Learn More →
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-8 border-t border-neon-cyan/10">
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                85%
              </div>
              <p className="text-xs text-muted-foreground">Faster Response</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                24/7
              </div>
              <p className="text-xs text-muted-foreground">AI Monitoring</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                Real-Time
              </div>
              <p className="text-xs text-muted-foreground">Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-neon-cyan/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Core Capabilities</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Powerful tools designed to streamline your city's incident management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative p-6 rounded-xl border border-neon-cyan/15 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 rounded-lg flex items-center justify-center mb-4 border border-neon-cyan/20 group-hover:border-neon-cyan/50 group-hover:shadow-lg group-hover:shadow-neon-cyan/20 transition-all duration-300">
                  <Camera className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="text-lg font-semibold mb-3">AI Incident Recognition</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatically detect incidents from camera feeds and sensor data with intelligent pattern recognition.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-6 rounded-xl border border-neon-cyan/15 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 hover:border-neon-blue/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg flex items-center justify-center mb-4 border border-neon-blue/20 group-hover:border-neon-blue/50 group-hover:shadow-lg group-hover:shadow-neon-blue/20 transition-all duration-300">
                  <Zap className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Intelligent Planning & Scheduling</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI analyzes incident data and creates optimal response strategies in milliseconds.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-6 rounded-xl border border-neon-cyan/15 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 hover:border-neon-purple/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg flex items-center justify-center mb-4 border border-neon-purple/20 group-hover:border-neon-purple/50 group-hover:shadow-lg group-hover:shadow-neon-purple/20 transition-all duration-300">
                  <Users className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Resource Optimization</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Intelligently match technicians based on skills, location, and availability in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 px-6 border-t border-neon-cyan/10 bg-gradient-to-b from-neon-cyan/3 to-transparent"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-muted-foreground">From incident to resolution in four intelligent steps</p>
          </div>

          <div className="space-y-6">
            {[
              {
                number: "01",
                title: "Incident Detection",
                description: "Manual reports or AI automatically detects anomalies in real-time",
              },
              {
                number: "02",
                title: "Intelligent Analysis",
                description: "System assesses priority, severity, and resource requirements instantly",
              },
              {
                number: "03",
                title: "Technician Assignment",
                description: "Optimal match sent to most qualified nearby technician automatically",
              },
              {
                number: "04",
                title: "Resolution Tracking",
                description: "Real-time monitoring and updates until incident is fully resolved",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="group relative flex items-center gap-6 p-6 rounded-xl border border-neon-cyan/15 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-blue/5 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex-shrink-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                    {step.number}
                  </div>
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 border-t border-neon-cyan/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why Choose IntervenIA</h2>
            <p className="text-muted-foreground">Proven results in smart city management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "85%", label: "Faster response times" },
              { metric: "60%", label: "Cost reduction" },
              { metric: "99.9%", label: "System uptime" },
              { metric: "24/7", label: "AI monitoring" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-xl border border-neon-cyan/15 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent mb-2">
                    {item.metric}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 border-t border-neon-cyan/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-blue/5 to-neon-purple/5"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Transform Your City?</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Join cities worldwide using IntervenIA to deliver smarter, faster incident response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-xl shadow-neon-cyan/25 hover:shadow-neon-cyan/40"
              asChild
            >
              <Link href="/auth">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neon-cyan/30 bg-neon-cyan/5 text-foreground hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
            >
              Schedule a Demo →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/10 py-16 px-6 bg-gradient-to-b from-transparent to-neon-cyan/3">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-neon-cyan/50 to-neon-blue/50 rounded border border-neon-cyan/30 flex items-center justify-center">
                  <Network className="w-4 h-4 text-neon-cyan" />
                </div>
                <span className="font-bold">IntervenIA</span>
              </div>
              <p className="text-sm text-muted-foreground">Intelligent city management for the modern world.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neon-cyan transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neon-cyan/10 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 IntervenIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
