"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"

export function ActiveChats() {
  const [filteredMatches, setFilteredMatches] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Get matches from AppContext
  const { matches, isLoading, fetchMatches } = useApp()
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true)
      await fetchMatches()
      setLocalLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Show only matches with last_message for active chats
      const activeChats = Array.isArray(matches)
        ? matches.filter(m => m.last_message).slice(0, 5)
        : []
      setFilteredMatches(activeChats)
    } else {
      const filtered = Array.isArray(matches)
        ? matches.filter((match) =>
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          match.last_message
        )
        : []
      setFilteredMatches(filtered)
    }
  }, [searchQuery, matches])

  const handleChatClick = (matchId: number, userId: number) => {
    router.push(`/chat?match_id=${matchId}&user_id=${userId}`)
  }

  if (localLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 flex items-center justify-center min-h-[300px]"
      >
        <Loader2 className="h-6 w-6 animate-spin text-[#FF0059]" />
      </motion.div>
    )
  }

  const activeChatsCount = Array.isArray(matches)
    ? matches.filter(m => m.last_message).length
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Active Chats</h3>
        </div>
        <span className="text-sm text-white/60">{activeChatsCount}</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chat List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/60 text-sm">
            {searchQuery ? "No conversations found" : "No active chats yet"}
          </p>
          {!searchQuery && activeChatsCount === 0 && (
            <p className="text-white/50 text-xs mt-2">
              Start chatting with your matches!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((chat, index) => (
            <motion.div
              key={chat.match_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-all duration-300"
              onClick={() => handleChatClick(chat.match_id, chat.user_id)}
            >
              <div className="relative">
                <img
                  src={chat.image}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/default.jpg'
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm truncate">{chat.name}</h4>
                  <span className="text-xs text-white/50">{chat.last_message_at || 'Recently'}</span>
                </div>
                <p className="text-xs text-white/60 truncate">{chat.last_message}</p>
              </div>

              {chat.unread_count > 0 && (
                <div className="w-5 h-5 bg-[#FF0059] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{chat.unread_count}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeChatsCount > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4 border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
          onClick={() => router.push('/matches')}
        >
          View All Matches
        </Button>
      )}
    </motion.div>
  )
}