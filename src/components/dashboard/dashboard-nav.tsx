"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, MessageCircle, Heart, UserCheck, User, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect, useRef } from "react"
import { api } from "@/lib/api"
import Image from "next/image"

const navItems = [
  { name: "Search", href: "/dashboard", icon: Search },
  { name: "Chatbot", href: "/chatbot", icon: MessageCircle },
  { name: "Matches", href: "/matches", icon: Heart },
  { name: "Requests", href: "/requests", icon: UserCheck },
  { name: "My Profile", href: "/profile", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<string>("/default.jpg")
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const userMenuRef = useRef<HTMLDivElement>(null)
  // console.log("DashboardNav user:", user)

  // Fetch user's primary image
  useEffect(() => {
    const fetchPrimaryImage = async () => {
      setIsLoadingImage(true)
      try {
        const response = await api.listUserImages(user?.id)

        const imageUrl = typeof response.data === "string" ? response.data : null

        if (imageUrl) {
          setPrimaryImage(imageUrl)
        } else {
          setPrimaryImage("/default.jpg")
        }
      } catch (err) {
        console.error("Failed to fetch primary image:", err)
        setPrimaryImage("/default.jpg")
      } finally {
        setIsLoadingImage(false)
      }
    }

    if (user?.id) {
      fetchPrimaryImage()
    }
  }, [user?.id])
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF0059] to-[#FF0059]/80 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF0059]/25 group-hover:shadow-[#FF0059]/40 transition-all duration-300">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">Affinity</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${isActive
                      ? "bg-[#FF0059]/20 text-[#FF0059] border border-[#FF0059]/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-[#FF0059]" : ""}`}
                  />
                  <span className="font-medium">{item.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#FF0059]/10 rounded-xl border border-[#FF0059]/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-white/10 rounded-xl p-2">
              <Bell className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF0059] rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>

            <Button variant="ghost" size="sm" className="hover:bg-white/10 rounded-xl p-2">
              <Settings className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
            </Button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF0059]/20 to-[#FF0059]/10 rounded-full border-2 border-[#FF0059]/30 flex items-center justify-center cursor-pointer hover:border-[#FF0059]/50 transition-all duration-300 overflow-hidden">
                  {isLoadingImage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF0059]"></div>
                  ) : primaryImage !== "/default.jpg" ? (
                    <Image src={primaryImage} alt={user?.name || "Profile"} width={40} height={40} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-[#FF0059]" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name || "Loading..."}</p>
                  <p className="text-xs text-white/60">{user?.email || ""}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-[#FF0059]/10 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FF0059]/20 to-[#FF0059]/10 rounded-full border-2 border-[#FF0059]/30 flex items-center justify-center overflow-hidden">
                        {isLoadingImage ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF0059]"></div>
                        ) : primaryImage !== "/default.jpg" ? (
                          <Image src={primaryImage} alt={user?.name || "Profile"} width={48} height={48} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-[#FF0059]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user?.name || "Loading..."}</p>
                        <p className="text-sm text-white/60">{user?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                      }}
                      className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="hover:bg-white/10 rounded-xl p-2">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-white/70"></div>
                <div className="w-full h-0.5 bg-white/70"></div>
                <div className="w-full h-0.5 bg-white/70"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${isActive ? "bg-[#FF0059]/20 text-[#FF0059]" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
