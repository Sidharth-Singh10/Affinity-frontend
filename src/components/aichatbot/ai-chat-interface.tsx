"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, Plus } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    type: "ai",
    content:
      "Hey there! 👋 I'm your friendly AI dating companion. I'm here to chat with you about anything relationship-related - whether you need conversation starters, dating tips, advice on your profile, or just want to talk through your thoughts about dating. What's on your mind today?",
    timestamp: new Date("2024-01-01T00:00:00.000Z"),
  },
]

let socket: Socket

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null) // Track current chat ID
  const messagesEndRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    setIsClient(true)

    // Connect socket
    socket = io("https://affinityx.onrender.com")

    socket.on("botReply", ({ botMessage, chatHistoryId }) => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: "ai",
        content: botMessage.content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      
      // Update current chat ID if we received one (for new chats)
      if (chatHistoryId && !currentChatId) {
        setCurrentChatId(chatHistoryId)
        console.log(`💬 New chat created with ID: ${chatHistoryId}`)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Hardcoded test data for now
    const payload = {
      userId: "12345",
      chatHistoryId: currentChatId || "new", // Use current chat ID or "new" to create a new one
      content: userMessage.content,
      user_id: 12345, // for score POST
      location: "Bangalore",
      openness: "high",
      interests: "hiking, coding, movies",
      exp_qual: "B.Tech in CS",
      relation_type: "long-term",
      social_habits: "outgoing",
      past_relations: "2 past relationships",
      values: "honesty, growth, kindness",
      style: "casual-modern",
      traits: "empathetic, curious",
      commitment: "high",
      resolution: "peaceful, communicative",
      image_url: "https://example.com/image.jpg",
      score: 0.0,
    }

    socket.emit("sendMessage", payload)
  }

  const startNewChat = () => {
    setCurrentChatId(null)
    setMessages(initialMessages)
    console.log("🆕 Starting new chat...")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden h-[800px] flex flex-col"
    >
      {/* Chat Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF0059] to-[#FF0059]/80 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Dating Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60">Online</span>
                {currentChatId && (
                  <span className="text-xs text-white/40">• Chat ID: {currentChatId.slice(-6)}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={startNewChat}
            variant="outline"
            size="sm"
            className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.type === "ai" && (
              <div className="w-8 h-8 bg-[#FF0059]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-[#FF0059]" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                message.type === "user" ? "bg-[#FF0059] text-white" : "bg-white/10 border border-white/20 text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-60">
                  {isClient ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
                {message.type === "ai" && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-8 h-8 bg-[#FF0059]/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-[#FF0059]" />
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything about dating..."
            className="flex-1 bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-4 py-2 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
