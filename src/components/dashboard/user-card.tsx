"use client"
import { Heart, X, Zap, MapPin, Briefcase, Wifi, WifiOff } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  age: number
  location: string
  bio: string
  interests: string[]
  profileImage: string
  images: string[]
  compatibility: number
  isOnline: boolean
  lastSeen: string
  occupation: string
}

interface UserCardProps {
  user: User
  onLike: () => void
  onReject: () => void
  onSuperLike?: () => void // Made optional since we're removing super like
  isAnimating: boolean
}

export function UserCard({ user, onLike, onReject, onSuperLike, isAnimating }: UserCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Provide default values to prevent undefined issues
  const safeUser = {
    ...user,
    name: user?.name || 'User',
    age: user?.age || 0,
    location: user?.location || 'Unknown',
    bio: user?.bio || 'No bio available',
    interests: user?.interests || [],
    images: user?.images?.filter(img => img) || ['/default.jpg'],
    profileImage: user?.profileImage || '/default.jpg',
    compatibility: user?.compatibility || 0,
    occupation: user?.occupation || 'Not specified',
    isOnline: user?.isOnline || false,
    lastSeen: user?.lastSeen || 'Recently'
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % safeUser.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + safeUser.images.length) % safeUser.images.length)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or navigation arrows
    const target = e.target as HTMLElement
    if (target.closest('button')) {
      return
    }
    router.push(`/user/${user.id}`)
  }

  return (
    <div 
      onClick={handleCardClick}
      className="w-full max-w-sm mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-[#FF0059]/10 relative cursor-pointer hover:border-white/20 transition-colors"
    >
      {/* Image Section */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          key={safeUser.images[currentImageIndex]} 
          width={800}
          height={600}
          src={safeUser.images[currentImageIndex] || "/default.jpg"}
          alt={safeUser.name}
          className="w-full h-full object-cover"
        />

        {/* Image navigation */}
        {safeUser.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
            >
              →
            </button>

            {/* Image indicators */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {safeUser.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Online status */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
          {safeUser.isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-green-400" />
              <span className="text-xs text-white font-medium hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-white/50" />
              <span className="text-xs text-white/70 hidden sm:inline">{safeUser.lastSeen}</span>
            </>
          )}
        </div>

        {/* Compatibility badge */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80 rounded-full px-3 sm:px-4 py-1 sm:py-2 shadow-lg shadow-[#FF0059]/25">
          <span className="text-white font-bold text-xs sm:text-sm">{safeUser.compatibility}% Match</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate flex-1 mr-2">
              {safeUser.name}{safeUser.age ? `, ${safeUser.age}` : ''}
            </h2>

          </div>

          <div className="flex items-center text-white/60 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{safeUser.location}</span>
          </div>

          <div className="flex items-center text-white/60 text-sm">
            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{safeUser.occupation}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">{safeUser.bio}</p>

        {/* Interests */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {safeUser.interests.slice(0, 6).map((interest, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-[#FF0059]/20 border border-[#FF0059]/30 text-[#FF0059] text-xs font-medium rounded-full"
              >
                {interest}
              </span>
            ))}
            {safeUser.interests.length > 6 && (
              <span className="px-2 sm:px-3 py-1 bg-white/10 border border-white/20 text-white/60 text-xs font-medium rounded-full">
                +{safeUser.interests.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
