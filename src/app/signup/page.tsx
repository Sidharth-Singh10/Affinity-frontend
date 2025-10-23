"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationInput } from "@/components/ui/location-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Eye, EyeOff, Upload, Check, X, AlertCircle } from "lucide-react"
import { useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { useAuth, type SignupData } from "@/hooks/use-auth"
import { PublicRoute } from "@/components/auth/public-route"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  gender: string
  age: string
  username: string
  location: string
  openness: string
  relationType: string
  expectedQualities: string[]
  interests: string[]
  socialHabits: string[]
  pastRelationships: string
  profilePicture: File | null
}

// Gender mapping for backend
const genderMapping: { [key: string]: string } = {
  'male': 'M',
  'female': 'F',
  'non-binary': 'O',
  'prefer-not-to-say': 'O'
}

const steps = [
  { id: 1, title: "Basic Info", description: "Let's start with the basics" },
  { id: 2, title: "Account Setup", description: "Create your account" },
  { id: 3, title: "Personal Details", description: "Tell us about yourself" },
  { id: 4, title: "Preferences", description: "What are you looking for?" },
  { id: 5, title: "Profile Picture", description: "Add your photo" },
]

const interestOptions = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Data Science",
  "DevOps",
  "Cybersecurity",
  "Gaming",
  "Music",
  "Art",
  "Travel",
  "Fitness",
  "Reading",
  "Photography",
  "Cooking",
  "Movies",
  "Sports",
  "Startups",
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [expectedQualitiesInput, setExpectedQualitiesInput] = useState("")
  const [socialHabitsInput, setSocialHabitsInput] = useState("")
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    username: "",
    location: "",
    openness: "",
    relationType: "",
    expectedQualities: [],
    interests: [],
    socialHabits: [],
    pastRelationships: "",
    profilePicture: null,
  })

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  // Check if email already exists
  const checkEmailAvailability = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return
    }

    setIsCheckingEmail(true)
    setEmailError("")

    try {
      const result = await api.checkEmail(email)
      
      if (result.error) {
        // If backend doesn't support email check, silently continue
        console.warn("Email check not available:", result.error)
      } else if (result.exists) {
        setEmailError("This email is already registered")
        toast.error("Email Already Registered", {
          description: "This email is already in use. Please use a different email or try logging in.",
        })
      }
    } catch (error) {
      console.error("Email check failed:", error)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleNext = () => {
    // Basic validation for each step
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.gender || !formData.age || !formData.location) {
        setError("Please fill in all required fields")
        toast.error("Missing Information", {
          description: "Please fill in all required fields to continue.",
        })
        return
      }
    }
    
    if (currentStep === 2) {
      if (!formData.email || !formData.password || !formData.username) {
        setError("Please fill in all required fields")
        toast.error("Missing Information", {
          description: "Please fill in all required fields to continue.",
        })
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        toast.error("Weak Password", {
          description: "Password must be at least 6 characters long.",
        })
        return
      }
      if (emailError) {
        toast.error("Email Issue", {
          description: "Please resolve the email issue before continuing.",
        })
        return
      }
    }
    
    if (currentStep === 3) {
      if (!formData.openness || !formData.relationType || !formData.pastRelationships) {
        setError("Please complete all sections")
        toast.error("Incomplete Information", {
          description: "Please complete all sections to continue.",
        })
        return
      }
    }
    
    setError("") // Clear any existing errors
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleExpectedQualitiesKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const value = expectedQualitiesInput.trim()
      if (value && !formData.expectedQualities.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          expectedQualities: [...prev.expectedQualities, value],
        }))
        setExpectedQualitiesInput("")
      }
    }
  }

  const handleSocialHabitsKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const value = socialHabitsInput.trim()
      if (value && !formData.socialHabits.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          socialHabits: [...prev.socialHabits, value],
        }))
        setSocialHabitsInput("")
      }
    }
  }

  const removeExpectedQuality = (quality: string) => {
    setFormData((prev) => ({
      ...prev,
      expectedQualities: prev.expectedQualities.filter((q) => q !== quality),
    }))
  }

  const removeSocialHabit = (habit: string) => {
    setFormData((prev) => ({
      ...prev,
      socialHabits: prev.socialHabits.filter((h) => h !== habit),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    console.log("Form submission started", { currentStep, formData })
    
    // Comprehensive validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      const errorMsg = "Please fill in all required fields"
      setError(errorMsg)
      toast.error("Missing Information", {
        description: errorMsg,
      })
      return
    }
    
    if (!formData.gender || !formData.age || !formData.location) {
      const errorMsg = "Please complete your basic information"
      setError(errorMsg)
      toast.error("Incomplete Profile", {
        description: errorMsg,
      })
      return
    }
    
    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long"
      setError(errorMsg)
      toast.error("Weak Password", {
        description: errorMsg,
      })
      return
    }

    if (emailError) {
      toast.error("Email Already Registered", {
        description: "Please use a different email address.",
      })
      return
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Creating your account...")
    
    // Prepare signup data for backend
    const signupData: SignupData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      gender: genderMapping[formData.gender] || 'O', // Map to M/F/O
      age: parseInt(formData.age),
      city: formData.location,
    }
    
    // Call signup function
    const result = await signup(signupData)
    
    // Dismiss loading toast
    toast.dismiss(loadingToast)
    
    if (result.success) {
      // Show success toast
      toast.success("Account Created Successfully!", {
        description: "Welcome to Affinity! Redirecting to your dashboard...",
      })
      // Redirect to dashboard or profile completion page
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      const errorMsg = result.error || "Signup failed. Please try again."
      setError(errorMsg)
      
      // Show specific error toasts based on error message
      if (errorMsg.toLowerCase().includes("email") && errorMsg.toLowerCase().includes("already")) {
        toast.error("Email Already Registered", {
          description: "This email is already in use. Please try logging in or use a different email.",
        })
      } else if (errorMsg.toLowerCase().includes("password")) {
        toast.error("Password Error", {
          description: errorMsg,
        })
      } else if (errorMsg.toLowerCase().includes("network")) {
        toast.error("Connection Error", {
          description: "Unable to connect to the server. Please check your internet connection and try again.",
        })
      } else {
        toast.error("Signup Failed", {
          description: errorMsg,
        })
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-semibold text-white/80 tracking-wide">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-semibold text-white/80 tracking-wide">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="gender" className="text-sm font-semibold text-white/80 tracking-wide">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl h-14 font-medium">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="age" className="text-sm font-semibold text-white/80 tracking-wide">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-sm font-semibold text-white/80 tracking-wide">
                Location
              </Label>
              <LocationInput
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value })}
                placeholder="Start typing your city..."
                className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-white/80 tracking-wide">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setEmailError("") // Clear error on change
                  }}
                  onBlur={(e) => checkEmailAvailability(e.target.value)}
                  className={`bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30 ${
                    emailError ? "border-red-500/50" : ""
                  }`}
                  required
                />
                {isCheckingEmail && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF0059]"></div>
                  </div>
                )}
              </div>
              {emailError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm font-medium"
                >
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-semibold text-white/80 tracking-wide">
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium pr-14 transition-all duration-300 hover:border-white/30"
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
              {formData.password && (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 font-medium">
                    Strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Personality Type</Label>
              <div className="grid grid-cols-3 gap-4">
                {["introvert", "extrovert", "ambivert"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, openness: type })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-semibold ${
                      formData.openness === type
                        ? "border-[#FF0059] bg-[#FF0059]/10 text-[#FF0059] shadow-lg shadow-[#FF0059]/25"
                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Relationship Type</Label>
              <div className="grid grid-cols-3 gap-4">
                {["casual", "short-term", "long-term"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, relationType: type })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-semibold ${
                      formData.relationType === type
                        ? "border-[#FF0059] bg-[#FF0059]/10 text-[#FF0059] shadow-lg shadow-[#FF0059]/25"
                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Past Relationships</Label>
              <div className="grid grid-cols-2 gap-4">
                {["yes", "no"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, pastRelationships: option })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-semibold ${
                      formData.pastRelationships === option
                        ? "border-[#FF0059] bg-[#FF0059]/10 text-[#FF0059] shadow-lg shadow-[#FF0059]/25"
                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Expected Qualities</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Type a quality and press Enter or comma"
                  value={expectedQualitiesInput}
                  onChange={(e) => setExpectedQualitiesInput(e.target.value)}
                  onKeyDown={handleExpectedQualitiesKeyPress}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.expectedQualities.map((quality, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center bg-[#FF0059]/20 border border-[#FF0059]/40 text-[#FF0059] px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {quality}
                      <button
                        type="button"
                        onClick={() => removeExpectedQuality(quality)}
                        className="ml-2 hover:text-[#FF0059]/70 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Interests</Label>
              <div className="grid grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all duration-300 font-medium ${
                      formData.interests.includes(interest)
                        ? "border-[#FF0059] bg-[#FF0059]/10 text-[#FF0059] shadow-lg shadow-[#FF0059]/25"
                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white/80 tracking-wide">Social Habits</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Type a habit and press Enter or comma"
                  value={socialHabitsInput}
                  onChange={(e) => setSocialHabitsInput(e.target.value)}
                  onKeyDown={handleSocialHabitsKeyPress}
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] focus:ring-[#FF0059]/30 rounded-xl h-14 font-medium transition-all duration-300 hover:border-white/30"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.socialHabits.map((habit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center bg-[#FF0059]/20 border border-[#FF0059]/40 text-[#FF0059] px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {habit}
                      <button
                        type="button"
                        onClick={() => removeSocialHabit(habit)}
                        className="ml-2 hover:text-[#FF0059]/70 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-40 h-40 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/30 hover:border-[#FF0059] transition-all duration-300 cursor-pointer group">
                {formData.profilePicture ? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture) || "/default.jpg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="h-10 w-10 text-white/50 group-hover:text-[#FF0059] transition-colors" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, profilePicture: file })
                  }
                }}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FF0059]/50 rounded-xl cursor-pointer transition-all duration-300 font-medium"
              >
                <Upload className="h-5 w-5 mr-3" />
                Upload Photo
              </label>
              <p className="text-sm text-white/60 mt-4 font-medium">JPG, PNG or GIF (max 5MB)</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0059]/8 via-transparent to-[#FF0059]/4"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FF0059]/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FF0059]/4 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,89,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="w-full max-w-3xl relative z-10">
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
            Create your account
          </h1>
          <p className="text-white/60 text-lg">Join thousands of developers finding meaningful connections</p>
        </motion.div>

        {/* Enhanced progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80 text-white shadow-lg shadow-[#FF0059]/30"
                      : "bg-white/10 text-white/50 border-2 border-white/20"
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-3 rounded-full transition-all duration-500 ${
                      currentStep > step.id ? "bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-white/60 font-medium">{steps[currentStep - 1].description}</p>
          </div>
        </motion.div>

        {/* Enhanced form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-[#FF0059]/10"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Enhanced navigation buttons */}
            <div className="flex justify-between mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#FF0059] to-[#FF0059]/90 hover:from-[#FF0059]/90 hover:to-[#FF0059]/80 text-white px-8 py-3 rounded-xl font-bold group transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF0059]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Check className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#FF0059] to-[#FF0059]/90 hover:from-[#FF0059]/90 hover:to-[#FF0059]/80 text-white px-8 py-3 rounded-xl font-bold group transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF0059]/25"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
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
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF0059] hover:text-[#FF0059]/80 transition-colors font-bold">
              Sign in
            </Link>
          </p>
        </motion.div>
        </div>
      </div>
    </PublicRoute>
  )
}
