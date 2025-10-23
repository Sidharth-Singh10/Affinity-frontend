"use client"

import { motion } from "framer-motion"
import { Heart, Users, Globe, Coffee, MapPin, Calendar } from "lucide-react"

interface User {
  interests: string[]
  socialHabits: string[]
  lookingFor: string
  relationshipType: string
  height: string
  languages: string[]
  joinedDate: string
}

interface UserProfileInfoProps {
  user: User
}

export function UserProfileInfo({ user }: UserProfileInfoProps) {
  const isLoading = !user
  const safeUser = {
    interests: user?.interests || [],
    socialHabits: user?.socialHabits || [],
    lookingFor: user?.lookingFor || '',
    relationshipType: user?.relationshipType || '',
    height: user?.height || '',
    languages: user?.languages || [],
    joinedDate: user?.joinedDate || '',
  }
  return (
    <div className="space-y-6">
      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">About</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-[#FF0059] flex-shrink-0" />
            <div>
              <span className="text-white/60">Looking for:</span>
              <span className="text-white ml-2 font-medium">{user.lookingFor}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-[#FF0059] flex-shrink-0" />
            <div>
              <span className="text-white/60">Relationship:</span>
              <span className="text-white ml-2 font-medium">{user.relationshipType}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-[#FF0059] flex-shrink-0" />
            <div>
              <span className="text-white/60">Height:</span>
              <span className="text-white ml-2 font-medium">{user.height}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-[#FF0059] flex-shrink-0" />
            <div>
              <span className="text-white/60">Joined:</span>
              <span className="text-white ml-2 font-medium">{user.joinedDate}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Languages</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {(safeUser.languages || []).map((language, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg"
            >
              {language}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Interests & Hobbies</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {(safeUser.interests || []).map((interest, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-[#FF0059]/20 border border-[#FF0059]/40 text-[#FF0059] text-sm font-medium rounded-lg"
            >
              {interest}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Social Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Lifestyle</h3>

        <div className="flex flex-wrap gap-2">
          {user.socialHabits.map((habit, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium rounded-lg"
            >
              {habit}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
