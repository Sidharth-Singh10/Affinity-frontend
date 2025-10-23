"use client"

export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF0059] mx-auto mb-4"></div>
        <p className="text-white/70 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  )
}
