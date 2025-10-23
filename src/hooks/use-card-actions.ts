"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import type { Candidate } from "@/hooks/use-recommendations"

export function useCardActions() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLike = async (user: Candidate, onSuccess?: () => void) => {
    if (isAnimating || !user) return

    setIsAnimating(true)

    try {
      const response = await api.sendMatchRequest(user.user.id)
      if (response.error) {
        console.error('Failed to send match request:', response.error)
      } else {
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error sending match request:', error)
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const handleReject = async (user: Candidate, onSuccess?: () => void) => {
    if (isAnimating || !user) return

    setIsAnimating(true)

    try {
      await api.rejectUser(user.user.id)
      onSuccess?.()
    } catch (error) {
      console.error('Error rejecting user:', error)
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return {
    isAnimating,
    handleLike,
    handleReject,
  }
}
