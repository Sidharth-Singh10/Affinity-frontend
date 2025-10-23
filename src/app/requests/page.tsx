"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { RequestsList } from "@/components/requests/requests-list"
import { RequestStats } from "@/components/requests/request-stats"
import { RequestFilters } from "@/components/requests/request-filters"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RequestsPage() {
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
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Match Requests</h1>
              <p className="text-white/60 text-lg">People who are interested in connecting with you</p>
            </div>
            <RequestFilters />
          </motion.div>

          {/* Flex-based responsive layout */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            {/* Left Sidebar - Request Stats */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-2 lg:order-1">
              <RequestStats />
            </div>

            {/* Center - Requests List */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <RequestsList />
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
