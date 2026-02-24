"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, Lock } from "lucide-react"
import { InterveniaLogo } from "@/components/intervenia-logo"
import { saveAuth } from "@/lib/auth"

// Backend roles
type BackendRole = "CITIZEN" | "TECHNICIAN" | "LEADER" | "MANAGER" | "ADMIN"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Map backend roles to frontend routes
  const roleRoutes: Record<BackendRole, string> = {
    "CITIZEN": "/citizen",
    "TECHNICIAN": "/technician",
    "LEADER": "/team-leader",
    "MANAGER": "/manager",
    "ADMIN": "/admin"
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = "Login failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, try text
          try {
            errorMessage = await res.text();
          } catch {
            // If can't read response, use status
            errorMessage = `Login failed with status: ${res.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await res.json()

      // Validate response has required fields
      if (!data.token || !data.role) {
        throw new Error("Invalid response from server")
      }

      console.log("Login successful:", data);

      // Store authentication data
      saveAuth({
        token:    data.token,
        userId:   data.userId,
        role:     data.role,
        username: data.username,
        zone:       data.zone,
        speciality: data.speciality,
      })

      // Redirect based on backend role
      const route = roleRoutes[data.role as BackendRole]
      if (route) {
        console.log(`Redirecting to: ${route} for role: ${data.role}`)
        window.location.href = route
      } else {
        // Fallback to a default dashboard
        console.warn(`No route configured for role: ${data.role}. Defaulting to dashboard.`)
        window.location.href = "/dashboard"
      }

    } catch (err: any) {
      console.error("Login error details:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      // For signup, we might need a different endpoint
      // Since you have a createUser endpoint that requires role
      // We'll need to handle this differently or create a public signup endpoint

      // For now, show that signup isn't implemented
      throw new Error("Signup is currently not available. Please contact your administrator.")

    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Background Network Pattern */}
        <div className="fixed inset-0 -z-10">
          {/* Subtle geometric grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

          {/* Glow effects */}
          <div className="absolute top-20 right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <nav className="border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 text-neon-cyan">
                <InterveniaLogo />
              </div>
              <span className="font-bold text-lg tracking-tight">IntervenIA</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                  }}
                  className="text-neon-cyan hover:text-neon-cyan/80 transition-colors font-semibold"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                    ? "Sign in to access your smart city management dashboard"
                    : "Register for an account to manage city interventions"}
              </p>
            </div>

            {/* Auth Form Card */}
            <div className="group relative p-8 rounded-2xl border border-neon-cyan/15 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

              {/* Error Message */}
              {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
              )}

              {/* Email & Password Form */}
              <form onSubmit={isLogin ? handleAuth : handleSignup} className="relative z-10 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      className="bg-background/50 border-neon-cyan/20 focus:border-neon-cyan/50 text-foreground placeholder:text-muted-foreground/50"
                      required
                      disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError(null)
                      }}
                      className="bg-background/50 border-neon-cyan/20 focus:border-neon-cyan/50 text-foreground placeholder:text-muted-foreground/50"
                      required
                      disabled={loading}
                  />
                </div>

                {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-neon-cyan/30 bg-background/50 focus:ring-neon-cyan/50"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                          Remember me
                        </label>
                      </div>
                      <Link href="#" className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-neon-cyan/80 to-neon-blue/80 text-background hover:from-neon-cyan hover:to-neon-blue border border-neon-cyan/40 transition-all duration-300 shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                      <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                        {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                  ) : (
                      <>
                        {isLogin ? "Sign in" : "Create account"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                  )}
                </Button>
              </form>

              {/* Divider - Only show for login */}
              {isLogin && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neon-cyan/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-gradient-to-br from-neon-cyan/5 to-neon-blue/5 text-muted-foreground">
                      Or continue with
                    </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                      <button
                          onClick={() => alert("Google login will be available soon")}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-neon-cyan/20 bg-background/30 hover:bg-background/50 hover:border-neon-cyan/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                          />
                          <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                          />
                          <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                          />
                          <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                          />
                        </svg>
                        <span className="text-sm font-medium">Google</span>
                      </button>
                    </div>
                  </>
              )}
            </div>

            {/* Demo Credentials Hint */}
            {isLogin && (
                <div className="mt-6 p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    For testing purposes, you can use:
                  </p>
                  <p className="text-xs font-mono text-neon-cyan">
                    Email: any existing user email • Password: 1234
                  </p>
                </div>
            )}

            {/* Footer Text */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-neon-cyan hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-neon-cyan hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}