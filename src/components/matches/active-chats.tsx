"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Search, MoreHorizontal, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Match {
  match_id: number
  user_id: number
  name: string
  image: string
  last_message?: string
  last_message_at?: string
  unread_count: number
}

export function ActiveChats() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMatches()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMatches(matches)
    } else {
      const filtered = matches.filter((match) =>
        match.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMatches(filtered)
    }
  }, [searchQuery, matches])

  const fetchMatches = async () => {
    setLoading(true)
    const { data } = await api.getRecentMatches()
    
    if (data?.matches) {
      // Filter only matches with messages for active chats
      const activeChats = data.matches
        .filter((match: Match) => match.last_message)
        .slice(0, 5) // Show only top 5 recent chats
      setMatches(activeChats)
      setFilteredMatches(activeChats)
    }
    setLoading(false)
  }

  const handleChatClick = (matchId: number) => {
    router.push(`/chat?match_id=${matchId}`)
  }

  if (loading) {
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
        <span className="text-sm text-white/60">{matches.length}</span>
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
              onClick={() => handleChatClick(chat.match_id)}
            >
              <div className="relative">
                <img
                  src={chat.image || "/default.jpg"}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
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

      {matches.length > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4 border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
          onClick={() => router.push('/matches')}
        >
          View All Conversations
        </Button>
      )}
    </motion.div>
  )
}
