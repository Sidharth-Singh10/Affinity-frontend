"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3, Save } from "lucide-react"
import { useState } from "react"

// User profile interface to match actual API response
interface UserProfile {
  ID: number
  Name: string
  Age: number
  City: string
  Gender: string
  Lat: number
  Lon: number
  Communication: number
  Confidence: number
  Emotional: number
  Personality: number
  TotalScore: number
}

interface ProfileInfoProps {
  detailed?: boolean
  userProfile?: UserProfile | null
}

const interests = [
  "React",
  "Python",
  "AI/ML",
  "Hiking",
  "Coffee",
  "Photography",
  "Travel",
  "Music",
  "Gaming",
  "Cooking",
  "Fitness",
  "Reading",
  "Art",
  "Startups",
  "Open Source",
  "Blockchain",
  "Design",
  "Writing",
]

const socialHabits = ["Social drinker", "Non-smoker", "Gym enthusiast", "Early bird", "Night owl", "Foodie", "Traveler"]

export function ProfileInfo({ detailed = false, userProfile }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState(["React", "Python", "AI/ML", "Hiking", "Coffee"])
  const [selectedHabits, setSelectedHabits] = useState(["Social drinker", "Non-smoker", "Gym enthusiast"])

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const toggleHabit = (habit: string) => {
    setSelectedHabits((prev) => (prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {detailed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
            <p className="text-white/60">Manage your profile details and preferences</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isEditing ? "bg-green-500 hover:bg-green-600" : "bg-[#FF0059] hover:bg-[#FF0059]/90"
            }`}
          >
            {isEditing ? (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-5 w-5 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: detailed ? 0.2 : 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Basic Information</h3>
          {!detailed && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              size="sm"
              className="text-[#FF0059] hover:text-[#FF0059]/80"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white/80">Full Name</Label>
            {isEditing ? (
              <Input 
                defaultValue={userProfile?.Name || ""} 
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl" 
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {userProfile?.Name || "Not specified"}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white/80">User ID</Label>
            {isEditing ? (
              <Input 
                defaultValue={userProfile?.ID?.toString() || ""} 
                disabled
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl opacity-60" 
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {userProfile?.ID || "Not specified"}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white/80">Age</Label>
            {isEditing ? (
              <Input
                type="number"
                defaultValue={userProfile?.Age?.toString() || ""}
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {userProfile?.Age || "Not specified"}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white/80">Gender</Label>
            {isEditing ? (
              <Select defaultValue={userProfile?.Gender?.toLowerCase() || ""}>
                <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="m">Male</SelectItem>
                  <SelectItem value="f">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {userProfile?.Gender === 'M' ? 'Male' : 
                 userProfile?.Gender === 'F' ? 'Female' : 
                 userProfile?.Gender || 'Not specified'}
              </div>
            )}
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Label className="text-sm font-semibold text-white/80">Location</Label>
            {isEditing ? (
              <Input
                defaultValue={userProfile?.City || ""}
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {userProfile?.City || "Location not specified"}
                {userProfile?.Lat !== 0 && userProfile?.Lon !== 0 && userProfile && (
                  <span className="text-white/60 text-sm ml-2">
                    {/* (Lat: {userProfile.Lat.toFixed(4)}, Lon: {userProfile.Lon.toFixed(4)}) */}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Label className="text-sm font-semibold text-white/80">Occupation</Label>
            {isEditing ? (
              <Input
                defaultValue="Senior Software Engineer at Stripe"
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                Senior Software Engineer at Stripe
              </div>
            )}
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Label className="text-sm font-semibold text-white/80">Bio</Label>
            {isEditing ? (
              <Textarea
                defaultValue="Passionate full-stack developer with 8+ years of experience building scalable web applications. Love exploring new technologies, contributing to open source, and mentoring junior developers."
                className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl min-h-[100px]"
              />
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white leading-relaxed">
                Passionate full-stack developer with 8+ years of experience building scalable web applications. Love
                exploring new technologies, contributing to open source, and mentoring junior developers.
              </div>
            )}
          </div>
        </div>
      </motion.div>


      {/* Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: detailed ? 0.5 : 0.25 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Interests & Hobbies</h3>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => isEditing && toggleInterest(interest)}
              disabled={!isEditing}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedInterests.includes(interest)
                  ? "bg-[#FF0059]/20 border border-[#FF0059]/40 text-[#FF0059]"
                  : "bg-white/5 border border-white/20 text-white/70 hover:bg-white/10"
              } ${isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Social Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: detailed ? 0.7 : 0.35 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Social Habits</h3>

        <div className="flex flex-wrap gap-2">
          {socialHabits.map((habit) => (
            <button
              key={habit}
              onClick={() => isEditing && toggleHabit(habit)}
              disabled={!isEditing}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedHabits.includes(habit)
                  ? "bg-[#FF0059]/20 border border-[#FF0059]/40 text-[#FF0059]"
                  : "bg-white/5 border border-white/20 text-white/70 hover:bg-white/10"
              } ${isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
            >
              {habit}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      {detailed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Dating Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white/80">Looking For</Label>
              {isEditing ? (
                <Select defaultValue="long-term">
                  <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem value="casual">Casual Dating</SelectItem>
                    <SelectItem value="short-term">Short-term</SelectItem>
                    <SelectItem value="long-term">Long-term Relationship</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                  Long-term Relationship
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white/80">Age Range</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    defaultValue="25"
                    className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
                  />
                  <span className="text-white/60 self-center">to</span>
                  <Input
                    type="number"
                    defaultValue="35"
                    className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">25 - 35 years</div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white/80">Distance</Label>
              {isEditing ? (
                <Select defaultValue="50">
                  <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="50">Within 50 miles</SelectItem>
                    <SelectItem value="100">Within 100 miles</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">Within 50 miles</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
