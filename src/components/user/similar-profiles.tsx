"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { api } from "@/lib/api"

interface SimilarProfile {
  id: string
  name: string
  age: number
  image: string
  compatibility: number
  location: string
}

interface SimilarProfilesProps {
  currentUserId: string
}

const similarProfiles: SimilarProfile[] = [
  {
    id: "2",
    name: "Emily Watson",
    age: 26,
    image: "/placeholder.svg?height=200&width=200",
    compatibility: 92,
    location: "Seattle, WA",
  },
  {
    id: "3",
    name: "Jordan Kim",
    age: 29,
    image: "/placeholder.svg?height=200&width=200",
    compatibility: 90,
    location: "Los Angeles, CA",
  },
  {
    id: "4",
    name: "Alex Rivera",
    age: 31,
    image: "/placeholder.svg?height=200&width=200",
    compatibility: 88,
    location: "Austin, TX",
  },
]

export function SimilarProfiles({ currentUserId }: SimilarProfilesProps) {
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])

  const handleLike = async (profileId: string) => {
    try {
      // Convert string ID to number for API call
      const numericId = parseInt(profileId)
      const response = await api.sendMatchRequest(numericId)
      if (response.error) {
        console.error('Failed to send match request:', response.error)
      } else {
        console.log('Match request sent successfully')
        setLikedProfiles(prev => [...prev, profileId])
      }
    } catch (error) {
      console.error('Error sending match request:', error)
    }
  }
  const filteredProfiles = similarProfiles.filter((profile) => profile.id !== currentUserId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Similar Profiles</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 group"
          >
            <Link href={`/user/${profile.id}`}>
              <div className="relative mb-3 cursor-pointer">
                <img
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-32 object-cover rounded-xl group-hover:opacity-90 transition-opacity"
                />

                {/* Compatibility Badge */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80 rounded-full px-2 py-1">
                  <span className="text-white font-bold text-xs">{profile.compatibility}%</span>
                </div>
              </div>
            </Link>

            <div className="text-center">
              <h4 className="font-semibold text-white mb-1">
                {profile.name}, {profile.age}
              </h4>
              <p className="text-xs text-white/60 mb-3">{profile.location}</p>

              <div className="flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  onClick={() => handleLike(profile.id)}
                  disabled={likedProfiles.includes(profile.id)}
                  className={`px-3 py-1 rounded-lg ${
                    likedProfiles.includes(profile.id) 
                      ? "bg-[#FF0059]/50 cursor-not-allowed" 
                      : "bg-[#FF0059] hover:bg-[#FF0059]/90"
                  }`}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  {likedProfiles.includes(profile.id) ? "Liked" : "Like"}
                </Button>
                <Link href={`/user/${profile.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-6 border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
      >
        Discover More Profiles
      </Button>
    </motion.div>
  )
}
