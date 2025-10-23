"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, MoreHorizontal, MapPin, Clock, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/use-user-data"

export function MatchesList() {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const router = useRouter()
  
  // Get data from context
  const { matches, isLoading, error, refreshMatches } = useUserData()
  const safeMatches = Array.isArray(matches) ? matches : []

  const handleChatClick = (matchId: number) => {
    // Navigate to chat or open chat modal
    router.push(`/chat?match_id=${matchId}`)
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF0059] mx-auto mb-4" />
          <p className="text-white/60">Loading your matches...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={refreshMatches} className="bg-[#FF0059] hover:bg-[#FF0059]/90">
            Try Again
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Matches</h3>
  <span className="text-sm text-white/60">{safeMatches.length} matches</span>
      </div>

  {safeMatches.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">No matches yet</h4>
          <p className="text-white/60 mb-6">Start swiping to find your perfect match!</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-[#FF0059] hover:bg-[#FF0059]/90">
            Browse Profiles
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {safeMatches.map((match, index) => (
            <motion.div
              key={match.match_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedMatch === match.match_id ? "border-[#FF0059]/50 bg-[#FF0059]/5" : ""
              }`}
              onClick={() => setSelectedMatch(match.match_id)}
            >
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative">
                  <img
                      src={match.image || "/default.jpg"}
                      alt={match.name || 'Match'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                    />
                  {match.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF0059] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{match.unread_count}</span>
                    </div>
                  )}
                </div>

                {/* Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white truncate">
                      {match.name || 'Unknown'}, {match.age || ''}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-[#FF0059]" />
                      <span className="text-xs text-[#FF0059] font-medium">{match.compatibility}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3 text-white/50" />
                    <span className="text-xs text-white/60 truncate">{match.location}</span>
                  </div>

                  {match.last_message && (
                    <p className="text-sm text-white/70 truncate mb-2">{match.last_message}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/50" />
                      <span className="text-xs text-white/50">{match.matched_at || match.last_message_at || 'Recently'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#FF0059] hover:bg-[#FF0059]/90 h-8 px-3 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleChatClick(match.match_id)
                        }}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/user/${match.user_id}`)
                        }}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
