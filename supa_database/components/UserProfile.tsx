// supa_database/components/UserProfile.tsx
import React, { useState } from 'react'
import { useAuthContext } from './AuthProvider'
import { updateUserProfile, signOut } from '../auth'

export const UserProfile: React.FC = () => {
  const { user, profile } = useAuthContext()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    university: profile?.university || ''
  })

  const handleUpdate = async () => {
    if (!user) return

    setLoading(true)
    try {
      await updateUserProfile(user.id, formData)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user || !profile) return null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button
          onClick={handleSignOut}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          {editing ? (
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile.full_name || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">University</label>
          {editing ? (
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile.university || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subscription</label>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 capitalize">{profile.subscription_tier}</span>
            <span className="text-sm text-gray-500">
              {profile.subscription_tier === 'free' ? `${profile.credits_remaining} credits remaining` : 'Unlimited'}
            </span>
          </div>
        </div>

        <div className="flex space-x-4">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
