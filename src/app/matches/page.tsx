"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MatchesList } from "@/components/matches/matches-list"
import { ActiveChats } from "@/components/matches/active-chats"
import { MatchFilters } from "@/components/matches/match-filters"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function MatchesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <DashboardNav />

        {/* Main Content with proper spacing from navbar */}
        <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Matches</h1>
              <p className="text-white/60 text-lg">Connect with people who liked you back</p>
            </div>
            <MatchFilters />
          </motion.div>

          {/* Flex-based responsive layout */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            {/* Left Sidebar - Active Chats */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-2 lg:order-1">
              <ActiveChats />
            </div>

            {/* Center - Matches List */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <MatchesList />
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
