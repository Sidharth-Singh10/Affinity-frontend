import type { Candidate } from "@/hooks/use-recommendations"

export function convertCandidateToUserCard(candidate: Candidate) {
  const user = candidate.user
  return {
    id: String(user.id),
    name: user.name,
    age: user.age,
    location: user.city,
    bio: `Lives in ${user.city}. Looking for meaningful connections and great conversations.`,
    interests: ["Travel", "Music", "Coffee", "Movies", "Reading"],
    profileImage: (user.images && user.images[0]) || "/default.jpg",
    images: user.images && user.images.length ? user.images : ["/default.jpg"],
    compatibility: candidate.match_score || Math.round(candidate.score * 100),
    isOnline: Math.random() > 0.5,
    lastSeen: "2 hours ago",
    occupation: "Professional",
  }
}
