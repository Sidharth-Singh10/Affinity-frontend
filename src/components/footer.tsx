"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#FF0059] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">A</span>
                </div>
                <span className="text-xl sm:text-2xl font-semibold">Affinity</span>
              </div>

              <p className="text-gray-400 mb-6 sm:mb-8 max-w-md leading-relaxed text-sm sm:text-base">
                Connecting brilliant minds through AI-powered matchmaking and collaborative coding. Join the future of
                developer networking.
              </p>

              <div className="flex items-center space-x-3 sm:space-x-4">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "#", label: "Email" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 sm:w-10 h-9 sm:h-10 bg-gray-900 hover:bg-[#FF0059]/10 border border-gray-800 hover:border-[#FF0059]/30 rounded-lg flex items-center justify-center transition-all duration-300 group touch-manipulation"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-hover:text-[#FF0059] transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Product</h4>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { label: "Features", href: "/#features" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "API", href: "/api" },
                  { label: "Documentation", href: "/docs" },
                  { label: "Changelog", href: "/changelog" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm touch-manipulation">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Company</h4>
              <ul className="space-y-3 sm:space-y-4">
                {["About", "Blog", "Careers", "Contact", "Privacy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm touch-manipulation">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-500 text-xs sm:text-sm text-center md:text-left"
          >
            © 2024 Affinity. All rights reserved.
          </motion.p>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors touch-manipulation">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors touch-manipulation">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors touch-manipulation">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
