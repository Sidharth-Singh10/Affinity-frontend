"use client"

import { motion } from "framer-motion"
import { Bot, Code, MessageCircle, Users, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Matching",
    description:
      "Smart algorithms connect you with compatible developers based on skills, interests, and coding style.",
  },
  {
    icon: Code,
    title: "Code Challenges",
    description: "Collaborative coding sessions that help you learn while building meaningful connections.",
  },
  {
    icon: MessageCircle,
    title: "Smart Conversations",
    description: "AI-powered conversation starters tailored to your technical background and interests.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a growing network of passionate developers and tech enthusiasts worldwide.",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Instant notifications and real-time collaboration tools for seamless interaction.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is protected with enterprise-grade security and privacy controls.",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4 sm:mb-6 tracking-tight px-2">Built for developers</h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed px-2">
            Everything you need to find meaningful connections in the tech community, powered by cutting-edge AI
            technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 sm:p-8 bg-gray-900/30 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/50 touch-manipulation"
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#FF0059]/10 group-hover:border group-hover:border-[#FF0059]/20 transition-all duration-300">
                <feature.icon className="h-6 sm:h-7 w-6 sm:w-7 text-gray-400 group-hover:text-[#FF0059] transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
