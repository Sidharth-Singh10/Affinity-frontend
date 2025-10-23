"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, MessageCircle, RefreshCw } from "lucide-react"

interface Chat {
  _id: string
  title: string
  createdAt: string
}

export function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const userId = "12345" // Temporary hardcoded user ID

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://affinityx.onrender.com/chat-history/${userId}`)
      const data = await res.json()
      setChatHistory(data)
    } catch (err) {
      console.error("❌ Failed to fetch chat history:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl h-[800px] flex flex-col"
    >
      <div className="pt-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF0059]" />
            <h3 className="text-lg font-semibold text-white">Chat History</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchChats}
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {chatHistory.length === 0 ? (
          <p className="text-white/40 text-sm">No chats yet.</p>
        ) : (
          chatHistory.map((chat, index) => (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-3 w-3 text-[#FF0059] flex-shrink-0" />
                    <h4 className="font-medium text-white text-sm truncate">
                      {chat.title || "Untitled Conversation"}
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 truncate mb-2">...</p>
                  <span className="text-xs text-white/50">{formatTimestamp(chat.createdAt)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 sm:p-6 border-t border-white/10">
        <Button
          variant="outline"
          className="w-full border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
        >
          View All Conversations
        </Button>
      </div>
    </motion.div>
  )
}
