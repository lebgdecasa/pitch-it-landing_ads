// supa_database/components/AuthModal.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, signUp, signInWithMagicLink, validateAccessCode } from '../auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AuthFormData {
  email: string
  password: string
  accessCode?: string
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>()

  const accessCode = watch('accessCode')

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'magic') {
        const { error } = await signInWithMagicLink(data.email)
        if (error) throw error
        setMessage('Check your email for the magic link!')
        return
      }

      if (mode === 'signup') {
        if (data.accessCode) {
          const validation = await validateAccessCode(data.accessCode)
          if (!validation.valid) {
            throw new Error('Invalid access code')
          }
        }
        const { error } = await signUp(data.email, data.password, data.accessCode)
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      } else {
        const { error } = await signIn(data.email, data.password)
        if (error) throw error
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Magic Link'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {mode !== 'magic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Code (Optional)
              </label>
              <input
                {...register('accessCode')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your university access code"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your university access code to get additional features
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Magic Link'}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('signup')}
                className="w-full text-blue-600 hover:text-blue-700 text-sm"
              >
                Don't have an account? Sign up
              </button>
              <button
                onClick={() => setMode('magic')}
                className="w-full text-blue-600 hover:text-blue-700 text-sm"
              >
                Sign in with magic link
              </button>
            </>
          )}

          {mode === 'signup' && (
            <button
              onClick={() => setMode('signin')}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              Already have an account? Sign in
            </button>
          )}

          {mode === 'magic' && (
            <button
              onClick={() => setMode('signin')}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
