"use client"

import { motion, AnimatePresence } from "framer-motion"
import { UserCard } from "@/components/dashboard/user-card"
import { Heart, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Candidate } from "@/hooks/use-recommendations"

interface CardStackProps {
  currentUser: Candidate | undefined
  recommendations: Candidate[]
  currentUserIndex: number
  isAnimating: boolean
  likedUsers: number[]
  onLike: () => void
  onReject: () => void
  convertToUserCardFormat: (candidate: Candidate) => any
}

export function CardStack({
  currentUser,
  recommendations,
  currentUserIndex,
  isAnimating,
  likedUsers,
  onLike,
  onReject,
  convertToUserCardFormat,
}: CardStackProps) {
  if (!currentUser) return null

  const remainingUsers = recommendations.length - currentUserIndex

  return (
    <div className="relative">
      {/* Background cards for depth */}
      {recommendations.slice(currentUserIndex + 1, currentUserIndex + 3).map((c: Candidate, index: number) => (
        <div
          key={c.user.id}
          className="absolute inset-0 bg-white/5 rounded-3xl border border-white/10"
          style={{
            transform: `scale(${0.95 - index * 0.05}) translateY(${(index + 1) * 8}px)`,
            zIndex: -index - 1,
            opacity: 0.5 - index * 0.2,
          }}
        />
      ))}

      {/* Current user card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUser.user.id}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{
            opacity: 0,
            scale: 0.8,
            x: isAnimating ? (likedUsers.includes(currentUser.user.id) ? 300 : -300) : 0,
            rotateZ: isAnimating ? (likedUsers.includes(currentUser.user.id) ? 15 : -15) : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10"
        >
          <UserCard
            user={convertToUserCardFormat(currentUser)}
            onLike={onLike}
            onReject={onReject}
            onSuperLike={() => {}}
            isAnimating={isAnimating}
          />
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center items-center space-x-6 sm:space-x-8 mt-6 sm:mt-8"
      >
        <Button
          onClick={onReject}
          disabled={isAnimating}
          className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-red-500/50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <X className="h-6 w-6 sm:h-8 sm:w-8 text-white/70 group-hover:text-red-500 transition-colors" />
        </Button>

        <Button
          onClick={onLike}
          disabled={isAnimating}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80 hover:from-[#FF0059]/90 hover:to-[#FF0059]/70 border-2 border-[#FF0059] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-[#FF0059]/25"
        >
          <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Progress indicator */}
      <div className="text-center mt-4 sm:mt-6">
        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 sm:px-4 py-2">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#FF0059]" />
          <span className="text-xs sm:text-sm font-medium text-white/80">
            {remainingUsers} profiles remaining
          </span>
        </div>
      </div>
    </div>
  )
}
