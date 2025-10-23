"use client"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserProfileHeader } from "@/components/user/user-profile-header"
import { UserProfileGallery } from "@/components/user/user-profile-gallery"
import { UserProfileInfo } from "@/components/user/user-profile-info"
import { UserProfileActions } from "@/components/user/user-profile-actions"
import { SimilarProfiles } from "@/components/user/similar-profiles"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch user profile
        const profileResponse = await api.getProfile(parseInt(userId))
        
        if (profileResponse.error) {
          setError(profileResponse.error)
          return
        }

        const userData = profileResponse.data

        // Debug raw response to help detect shape mismatches
        console.debug('profileResponse.data:', userData)

        // Fetch user images
        const imagesResponse = await api.getUserImages(parseInt(userId))
        let userImages = ["/default.jpg"] // Default image

        if (!imagesResponse.error && imagesResponse.data?.images && imagesResponse.data.images.length > 0) {
          userImages = imagesResponse.data.images.map((img: any) => img.url || img.image_url || img.image)
        }

        setImages(userImages)

        // Helper to read multiple possible keys from backend (different casing / snake_case)
        const read = (obj: any, ...keys: string[]) => {
          for (const k of keys) {
            if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined && obj[k] !== null) {
              return obj[k]
            }
          }
          return undefined
        }

        // Normalize fields with fallbacks for common variants
        const transformedUser = {
          id: (read(userData, 'ID', 'id', 'user_id', 'UserID')?.toString()) || userId,
          name: read(userData, 'Name', 'name', 'full_name') || 'Unknown User',
          age: read(userData, 'Age', 'age') || 0,
          location: read(userData, 'City', 'city', 'location') || 'Unknown',
          bio: read(userData, 'Bio', 'bio') || `Lives in ${read(userData, 'City', 'city', 'location') || 'Unknown'}. Looking for meaningful connections and great conversations.`,
          interests: read(userData, 'Interests', 'interests') || ['Travel', 'Music', 'Coffee', 'Movies', 'Reading'],
          socialHabits: read(userData, 'SocialHabits', 'socialHabits', 'social_habits') || ['Social', 'Active', 'Friendly'],
          occupation: read(userData, 'Occupation', 'occupation', 'job') || 'Professional',
          education: read(userData, 'Education', 'education') || 'University Graduate',
          profileImage: userImages[0],
          images: userImages,
          compatibility: read(userData, 'TotalScore', 'total_score', 'totalScore') || 0,
          isOnline: typeof read(userData, 'isOnline', 'online') === 'boolean' ? read(userData, 'isOnline', 'online') : Math.random() > 0.5,
          lastSeen: read(userData, 'lastSeen', 'LastSeen') || 'Recently active',
          distance: read(userData, 'distance') || 'Nearby',
          joinedDate: read(userData, 'joinedDate', 'JoinedDate', 'joined') || '2024',
          verified: !!read(userData, 'verified', 'is_verified', 'isVerified'),
          mutualConnections: read(userData, 'mutualConnections', 'mutual_connections') || 0,
          responseRate: read(userData, 'responseRate', 'response_rate') || 'Usually responds within a few hours',
          lookingFor: read(userData, 'lookingFor', 'looking_for') || 'Meaningful relationship',
          relationshipType: read(userData, 'relationshipType', 'relationship_type') || 'Single',
          height: read(userData, 'height') || "5'8\"",
          languages: read(userData, 'languages') || ['English'],
        }

        setUser(transformedUser)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNav />

      {/* Main Content with proper spacing from navbar */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0059] mb-4"></div>
              <p className="text-white/70">Loading profile...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-400 text-2xl">⚠</span>
              </div>
              <p className="text-red-400 mb-2">Failed to load profile</p>
              <p className="text-white/70 text-sm">{error}</p>
            </div>
          ) : user ? (
            <>
              {/* Profile Header */}
              <UserProfileHeader user={user} />

              {/* Main Content Layout */}
              <div className="flex flex-wrap gap-6 lg:gap-8 mt-8">
                {/* Left Column - Gallery and Actions */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6 order-2 lg:order-1">
                  <UserProfileGallery images={images} name={user.name} />
                  <UserProfileActions user={user} />
                </div>

                {/* Right Column - Profile Info */}
                <div className="flex-1 min-w-0 order-1 lg:order-2 space-y-6">
                  <UserProfileInfo user={user} />
                  <SimilarProfiles currentUserId={user.id} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
