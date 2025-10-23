"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { PublicRoute } from "@/components/auth/public-route"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate form
    if (!formData.email || !formData.password) {
      const errorMsg = "Please fill in all fields"
      setError(errorMsg)
      toast.error("Missing Information", {
        description: errorMsg,
      })
      return
    }

    // Show loading toast
    const loadingToast = toast.loading("Signing you in...")

    // Call login function
    const result = await login(formData.email, formData.password)
    
    // Dismiss loading toast
    toast.dismiss(loadingToast)
    
    if (result.success) {
      // Show success toast
      toast.success("Login Successful!", {
        description: "Welcome back! Redirecting to your matches...",
      })
      // Redirect to matches page on success
      setTimeout(() => {
        router.push("/matches")
      }, 1000)
    } else {
      const errorMsg = result.error || "Login failed. Please try again."
      setError(errorMsg)
      
      // Show specific error toasts based on error message
      if (errorMsg.toLowerCase().includes("credentials") || errorMsg.toLowerCase().includes("invalid")) {
        toast.error("Invalid Credentials", {
          description: "The email or password you entered is incorrect. Please try again.",
        })
      } else if (errorMsg.toLowerCase().includes("network")) {
        toast.error("Connection Error", {
          description: "Unable to connect to the server. Please check your internet connection and try again.",
        })
      } else if (errorMsg.toLowerCase().includes("not found")) {
        toast.error("Account Not Found", {
          description: "No account found with this email. Please sign up first.",
        })
      } else {
        toast.error("Login Failed", {
          description: errorMsg,
        })
      }
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-8 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0059]/8 via-transparent to-[#FF0059]/4"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FF0059]/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FF0059]/4 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,89,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Enhanced header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <Link href="/" className="inline-flex items-center space-x-3 mb-10 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF0059] to-[#FF0059]/80 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF0059]/25 group-hover:shadow-[#FF0059]/40 transition-all duration-300">
                <span className="text-white font-black text-lg">A</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Affinity</span>
            </Link>

            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-white/60 text-lg">Sign in to your account to continue</p>
          </motion.div>

          {/* Enhanced login form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-[#FF0059]/10"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-white/80 tracking-wide">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 text-white placeholder:text-white/40 font-medium transition-all duration-300 hover:border-white/30"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-white/80 tracking-wide">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 text-white placeholder:text-white/40 font-medium pr-14 transition-all duration-300 hover:border-white/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-[#FF0059] transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-[#FF0059] focus:ring-[#FF0059]/30 transition-all duration-300"
                  />
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#FF0059] hover:text-[#FF0059]/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FF0059] to-[#FF0059]/90 hover:from-[#FF0059]/90 hover:to-[#FF0059]/80 text-white h-14 rounded-xl font-bold text-lg group transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF0059]/25 hover:shadow-[#FF0059]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Enhanced footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <p className="text-white/60 text-lg">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#FF0059] hover:text-[#FF0059]/80 transition-colors font-bold">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PublicRoute>
  )
}
