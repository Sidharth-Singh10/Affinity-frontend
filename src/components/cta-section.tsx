"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Check, Star, Users, Zap } from "lucide-react"
import Link from "next/link"

const benefits = [
  { icon: Users, text: "Join 10,000+ developers" },
  { icon: Zap, text: "Start matching in 2 minutes" },
  { icon: Star, text: "95% success rate" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "Stripe",
    avatar: "/placeholder.svg?height=40&width=40",
    quote: "Found my co-founder through Affinity. The AI matching is incredibly accurate.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Tech Lead",
    company: "Vercel",
    avatar: "/placeholder.svg?height=40&width=40",
    quote: "Best platform for connecting with like-minded developers. Highly recommend!",
  },
  {
    name: "Emily Watson",
    role: "Full Stack Engineer",
    company: "GitHub",
    avatar: "/placeholder.svg?height=40&width=40",
    quote: "The coding challenges helped me find amazing collaborators for my side projects.",
  },
]

export function CTASection() {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0059]/3 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF0059]/5 via-transparent to-transparent"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#FF0059]/10 border border-[#FF0059]/20 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-[#FF0059] mr-2 animate-pulse" />
            <span className="text-xs sm:text-sm text-[#FF0059] font-medium">Limited time: Free premium features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium mb-6 sm:mb-8 tracking-tight leading-tight px-2">
            Ready to find your
            <br />
            <span className="text-[#FF0059] relative">
              perfect match?
              <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF0059]/40 to-transparent"></div>
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            Join thousands of developers who have already found meaningful connections, collaborators, and career
            opportunities through Affinity.
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-2 sm:px-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group w-full sm:w-auto">
              <div className="absolute inset-0 bg-[#FF0059] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl"></div>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="relative bg-[#FF0059] hover:bg-[#FF0059]/90 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-semibold text-lg sm:text-xl group transition-all duration-300 shadow-2xl shadow-[#FF0059]/25 w-full sm:w-auto min-h-[56px] touch-manipulation"
                >
                  <Sparkles className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:rotate-12 transition-transform" />
                  Start Matching Now
                  <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-700 hover:border-[#FF0059] bg-gray-900/40 backdrop-blur-sm px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-2xl hover:bg-[#FF0059]/5 transition-all duration-300 w-full sm:w-auto min-h-[56px] touch-manipulation"
              >
                View Live Demo
              </Button>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-2">
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs sm:text-sm">
              <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs sm:text-sm">
              <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs sm:text-sm">
              <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center px-2">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Active Developers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Successful Matches</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400 text-xs sm:text-sm">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-xs sm:text-sm">AI Matching</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
