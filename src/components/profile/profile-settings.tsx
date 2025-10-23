"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Globe, Smartphone, Mail, Lock, Trash2, Download, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function ProfileSettings() {
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    likes: false,
    profileViews: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    showOnline: true,
    showDistance: true,
    showAge: true,
    incognito: false,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-white/60">Manage your account preferences and privacy settings</p>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>

        <div className="space-y-6">
          {[
            { key: "newMatches", label: "New Matches", description: "Get notified when you have a new match" },
            { key: "messages", label: "Messages", description: "Receive notifications for new messages" },
            { key: "likes", label: "Likes", description: "Get notified when someone likes your profile" },
            { key: "profileViews", label: "Profile Views", description: "Know when someone views your profile" },
            { key: "marketing", label: "Marketing", description: "Receive updates about new features and promotions" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{item.label}</div>
                <div className="text-sm text-white/60">{item.description}</div>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-blue-400" />
            <span className="font-medium text-white text-sm">Push Notifications</span>
          </div>
          <p className="text-xs text-white/70">
            Enable push notifications on your device to receive real-time updates even when the app is closed.
          </p>
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Privacy & Visibility</h3>
        </div>

        <div className="space-y-6">
          {[
            { key: "showOnline", label: "Show Online Status", description: "Let others see when you're active" },
            { key: "showDistance", label: "Show Distance", description: "Display your distance to other users" },
            { key: "showAge", label: "Show Age", description: "Display your age on your profile" },
            { key: "incognito", label: "Incognito Mode", description: "Browse profiles without being seen" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{item.label}</div>
                <div className="text-sm text-white/60">{item.description}</div>
              </div>
              <Switch
                checked={privacy[item.key as keyof typeof privacy]}
                onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, [item.key]: checked }))}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
          >
            <Mail className="h-4 w-4 mr-3" />
            Change Email Address
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
          >
            <Lock className="h-4 w-4 mr-3" />
            Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
          >
            <Shield className="h-4 w-4 mr-3" />
            Two-Factor Authentication
          </Button>
        </div>
      </motion.div>

      {/* Data & Account Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-lg font-semibold text-white">Data & Account</h3>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start border-white/20 hover:border-green-500/50 bg-white/5 hover:bg-green-500/10"
          >
            <Download className="h-4 w-4 mr-3" />
            Download My Data
          </Button>

          <div className="border-t border-white/10 pt-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="font-medium text-red-400 text-sm">Danger Zone</span>
              </div>
              <p className="text-xs text-white/70">
                These actions are permanent and cannot be undone. Please proceed with caution.
              </p>
            </div>

            <Button
              variant="destructive"
              className="w-full justify-start bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Changes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 justify-end"
      >
        <Button
          variant="outline"
          className="border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-8 py-3"
        >
          Reset to Defaults
        </Button>
        <Button className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-8 py-3 font-semibold">Save All Changes</Button>
      </motion.div>
    </div>
  )
}
