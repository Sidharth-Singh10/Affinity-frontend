"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Match {
  match_id: number
  user_id: number
  name: string
  image: string
  matched_at: string
  last_message?: string
  last_message_at?: string
}

interface RecentMatchesCardProps {
  matches: Match[]
  isLoading: boolean
}

export function RecentMatchesCard({ matches, isLoading }: RecentMatchesCardProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">Recent Matches</h3>
        <div className="w-2 h-2 bg-[#FF0059] rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 rounded-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-white/10 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="py-6 text-center text-white/60">No recent matches yet</div>
        ) : (
          matches.slice(0, 5).map((match) => (
            <div
              key={match.match_id}
              onClick={() => router.push(`/user/${match.user_id}`)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Image
                width={40}
                height={40}
                src={match.image || "/default.jpg"}
                alt={match.name || "Match"}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex-shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{match.name || "Unknown"}</div>
                <div className="text-white/60 text-xs">{match.last_message_at || match.matched_at || 'Recently'}</div>
              </div>
              <MessageCircle className="h-4 w-4 text-[#FF0059] flex-shrink-0" />
            </div>
          ))
        )}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
      >
        View All Matches
      </Button>
    </motion.div>
  )
}
