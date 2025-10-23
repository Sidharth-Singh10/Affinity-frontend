"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, Heart } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF0059]/8 via-transparent to-[#FF0059]/4"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#FF0059]/6 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FF0059]/4 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,89,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-3 mb-12"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF0059] to-[#FF0059]/80 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF0059]/25">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <span className="text-3xl font-bold tracking-tight">Affinity</span>
        </motion.div>

        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-8xl sm:text-9xl font-black text-[#FF0059]/20 mb-4">404</div>
          <div className="w-24 h-24 mx-auto bg-[#FF0059]/20 rounded-full flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-[#FF0059]" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-xl text-white/60 mb-8 leading-relaxed">
            Looks like this page went on a date and never came back. Don't worry, there are plenty of other pages in the
            app!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/dashboard">
            <Button className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-8 py-4 rounded-xl font-semibold text-lg group transition-all duration-300 hover:scale-105 shadow-lg shadow-[#FF0059]/25">
              <Home className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </Button>
          </Link>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-white/60 mb-6">Or explore these popular sections:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/matches"
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#FF0059]/50 rounded-xl transition-all duration-300"
            >
              <Heart className="h-4 w-4 text-[#FF0059]" />
              <span className="text-sm font-medium">Your Matches</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#FF0059]/50 rounded-xl transition-all duration-300"
            >
              <Search className="h-4 w-4 text-[#FF0059]" />
              <span className="text-sm font-medium">Edit Profile</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
