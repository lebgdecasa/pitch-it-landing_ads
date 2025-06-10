// supa_database/components/AuthForm.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, signUp, signInWithMagicLink, validateAccessCode } from '../auth' // Assuming this path is correct

// Interface for form data
interface AuthFormData {
  email: string
  password: string // Password is not used for magic link, but field is present
  accessCode?: string // Conditionally required for signup
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      accessCode: '',
    }
  })

  // We don't need to watch accessCode here anymore as conditional requirement is handled by register
  // const accessCode = watch('accessCode')

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'magic') {
        const { error: magicLinkError } = await signInWithMagicLink(data.email)
        if (magicLinkError) throw magicLinkError
        setMessage('Check your email for the magic link!')
        return // Early return after sending magic link
      }

      if (mode === 'signup') {
        // Access code is now required by form validation if mode is 'signup'
        // if (!data.accessCode) { // This check is now handled by react-hook-form's required validation
        //   throw new Error('Access code is required for sign up.')
        // }
        const validation = await validateAccessCode(data.accessCode!) // Non-null assertion as it's required
        if (!validation.valid) {
          throw new Error(validation.university === 'used' ? 'Access code has already been used.' : 'Invalid access code.')
        }
        const { error: signUpError } = await signUp(data.email, data.password, data.accessCode)
        if (signUpError) throw signUpError
        setMessage('Check your email to confirm your account!')
      } else { // signin
        const { error: signInError } = await signIn(data.email, data.password)
        if (signInError) throw signInError
        setMessage('Signed in successfully!') // Provide feedback for sign-in
        // onClose() // Removed as this is no longer a modal
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Adjusted container for page layout instead of modal
    <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto my-10 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Sign In with Magic Link'}
        </h2>
        {/* Close button removed */}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              {...register('password', {
                required: mode !== 'magic' ? 'Password is required' : false,
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
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <input
              id="accessCode"
              {...register('accessCode', {
                  required: mode === 'signup' ? 'Access code is required' : false
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your access code"
            />
            {errors.accessCode && mode === 'signup' && ( // Ensure message only shows for signup
              <p className="text-red-500 text-sm mt-1">{errors.accessCode.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              A valid access code is required to sign up.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Magic Link'}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center">
        {mode === 'signin' && (
          <>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
            >
              Don't have an account? Sign up
            </button>
            <button
              type="button"
              onClick={() => { setMode('magic'); setError(null); setMessage(null); }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
            >
              Sign in with magic link
            </button>
          </>
        )}

        {mode === 'signup' && (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
            className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
          >
            Already have an account? Sign in
          </button>
        )}

        {mode === 'magic' && (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
            className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthForm;
