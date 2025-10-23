'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { getAuthToken, getUserId, isAuthenticated } from '@/lib/api'
import { Button } from '@/components/ui/button'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiUrl, setApiUrl] = useState('')
  const { user, isAuthenticated: contextAuth } = useApp()
  
  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not set')
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Floating Debug Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full shadow-lg text-xs font-mono"
        aria-label="Toggle Debug Panel"
      >
        🐛 Debug
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-50 bg-black/95 border border-purple-500/50 rounded-lg p-4 max-w-md w-full text-xs font-mono shadow-2xl max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-purple-500/30">
            <h3 className="text-purple-400 font-bold">🐛 Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* API Configuration */}
            <div className="bg-purple-900/20 p-2 rounded">
              <div className="text-purple-400 font-bold mb-1">API Config</div>
              <div className="text-white/70">
                <div>URL: <span className="text-green-400">{apiUrl}</span></div>
                <div>Environment: <span className="text-green-400">{process.env.NODE_ENV}</span></div>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="bg-blue-900/20 p-2 rounded">
              <div className="text-blue-400 font-bold mb-1">Authentication</div>
              <div className="space-y-1 text-white/70">
                <div>Token: {getAuthToken() ? <span className="text-green-400">✓ Present</span> : <span className="text-red-400">✗ Missing</span>}</div>
                <div>User ID: {getUserId() ? <span className="text-green-400">{getUserId()}</span> : <span className="text-red-400">✗ Missing</span>}</div>
                <div>Is Auth: {isAuthenticated() ? <span className="text-green-400">✓ Yes</span> : <span className="text-red-400">✗ No</span>}</div>
                <div>Context Auth: {contextAuth ? <span className="text-green-400">✓ Yes</span> : <span className="text-red-400">✗ No</span>}</div>
              </div>
            </div>

            {/* User Data */}
            <div className="bg-green-900/20 p-2 rounded">
              <div className="text-green-400 font-bold mb-1">User Data</div>
              {user ? (
                <div className="space-y-1 text-white/70">
                  <div>ID: {user.id}</div>
                  <div>Name: {user.name}</div>
                  <div>Email: {user.email}</div>
                  <div>Age: {user.age || 'N/A'}</div>
                  <div>City: {user.city || 'N/A'}</div>
                </div>
              ) : (
                <div className="text-red-400">No user data</div>
              )}
            </div>

            {/* LocalStorage */}
            <div className="bg-yellow-900/20 p-2 rounded">
              <div className="text-yellow-400 font-bold mb-1">LocalStorage</div>
              <div className="space-y-1 text-white/70 text-[10px]">
                <div>auth_token: {localStorage.getItem('auth_token')?.substring(0, 20)}...</div>
                <div>user_id: {localStorage.getItem('user_id')}</div>
                <div>user_email: {localStorage.getItem('user_email')}</div>
                <div>user_name: {localStorage.getItem('user_name')}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <Button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-xs"
                size="sm"
              >
                Clear All & Reload
              </Button>
              <Button
                onClick={() => {
                  console.log('=== DEBUG INFO ===')
                  console.log('API URL:', apiUrl)
                  console.log('Token:', getAuthToken())
                  console.log('User ID:', getUserId())
                  console.log('User:', user)
                  console.log('LocalStorage:', {
                    auth_token: localStorage.getItem('auth_token'),
                    user_id: localStorage.getItem('user_id'),
                    user_email: localStorage.getItem('user_email'),
                    user_name: localStorage.getItem('user_name'),
                  })
                  console.log('==================')
                  alert('Debug info logged to console')
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                size="sm"
              >
                Log to Console
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
