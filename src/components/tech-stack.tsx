"use client"

import { motion } from "framer-motion"

const technologies = [
  {
    name: "React",
    description: "UI Library",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Next.js",
    description: "Full-stack Framework",
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "TypeScript",
    description: "Type Safety",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Tailwind",
    description: "CSS Framework",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "Node.js",
    description: "Runtime Environment",
    color: "from-green-400 to-green-600",
  },
  {
    name: "MongoDB",
    description: "Database",
    color: "from-green-500 to-green-700",
  },
  {
    name: "OpenAI",
    description: "AI Integration",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Vercel",
    description: "Deployment",
    color: "from-gray-500 to-gray-700",
  },
]

const stats = [
  { label: "Uptime", value: "99.9%" },
  { label: "Response Time", value: "<100ms" },
  { label: "Security", value: "SOC 2" },
  { label: "Scale", value: "Global CDN" },
]

export function TechStack() {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Technology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4 sm:mb-6 tracking-tight px-2">
            Built with
            <span className="text-[#FF0059] relative ml-2 sm:ml-3">
              modern tools
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF0059]/30 to-transparent"></div>
            </span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
            Powered by industry-leading technologies to deliver exceptional performance, security, and scalability.
          </p>
        </motion.div>

        {/* Enhanced tech grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-all duration-500 hover:bg-gray-900/60 relative overflow-hidden touch-manipulation">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-2xl`}
                ></div>

                {/* Icon placeholder with gradient */}
                <div
                  className={`relative w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br ${tech.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-md opacity-90"></div>
                </div>

                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300">
                  {tech.name}
                </h3>

                <p className="text-gray-500 text-xs sm:text-sm group-hover:text-gray-400 transition-colors duration-300">
                  {tech.description}
                </p>

                {/* Subtle glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-16 px-2"
        >
          <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>GDPR Compliant</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
