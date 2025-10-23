"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-6 lg:p-8 z-10"
      >
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#FF0059] rounded-lg flex items-center justify-center group-hover:bg-[#FF0059]/90 transition-colors">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold group-hover:text-white/90 transition-colors">Affinity</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#demo" className="text-gray-400 hover:text-white transition-colors text-sm">
              Demo
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </a>
          </nav>
          <Link href="/login">
            <Button variant="outline" size="sm" className="border-gray-800 hover:border-[#FF0059] bg-transparent text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-9">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.nav>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Enhanced heading with better typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-[#FF0059] rounded-full mr-3 animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-400">Now in beta</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[0.9] mb-4 sm:mb-6 tracking-tight px-2 sm:px-4">
            Where minds
            <br />
            <span className="text-[#FF0059] relative">
              connect
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF0059]/30 to-transparent"></div>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-6"
        >
          AI-powered matchmaking for developers and tech enthusiasts.
          <br className="hidden sm:block" />
          Connect through code, grow through collaboration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-6"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#FF0059] hover:bg-[#FF0059]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF0059]/25 min-h-[48px] touch-manipulation"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="w-full sm:w-auto text-gray-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg group min-h-[48px] touch-manipulation">
            <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Enhanced stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-2xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1">10K+</div>
            <div className="text-xs sm:text-sm text-gray-500">Developers</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1">50K+</div>
            <div className="text-xs sm:text-sm text-gray-500">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1">95%</div>
            <div className="text-xs sm:text-sm text-gray-500">Match Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FF0059]/3 pointer-events-none" />

      {/* Floating elements - more subtle */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#FF0059]/30 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-[#FF0059]/40 rounded-full animate-pulse delay-1000 hidden lg:block"></div>
    </section>
  )
}
