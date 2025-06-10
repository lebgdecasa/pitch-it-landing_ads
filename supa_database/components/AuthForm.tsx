// supa_database/components/AuthForm.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router' // Added useRouter
import { signIn, signUp, validateAccessCode, resetPassword } from '../auth'

// Interface for form data
interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  accessCode?: string
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'resetPassword'>('signin') // Removed 'magic'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter(); // Added router instance

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
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
      if (mode === 'resetPassword') {
        const { error: resetError } = await resetPassword(data.email)
        if (resetError) throw resetError
        setMessage('If an account with that email exists, a password reset link has been sent. Please check your inbox.')
        // Optionally, switch mode back to signin after a delay or keep user on this view with the message.
        // For now, we'll keep them on the view.
        return;
      }

      if (mode === 'signup') {
        const validation = await validateAccessCode(data.accessCode!)
        if (!validation.valid) {
          throw new Error(validation.university === 'used' ? 'Access code has already been used.' : 'Invalid access code.')
        }
        const { error: signUpError } = await signUp(data.email, data.password, data.accessCode)
        if (signUpError) throw signUpError
        setMessage('Check your email to confirm your account!')
      } else if (mode === 'signin') {
        const { error: signInError } = await signIn(data.email, data.password)
        if (signInError) throw signInError
        // setMessage('Signed in successfully!') // Removed message
        router.push('/dashboard'); // Redirect to dashboard
        return; // Early return to prevent further state updates if not necessary
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">
          {mode === 'signin' ? 'Sign In'
            : mode === 'signup' ? 'Sign Up'
            : 'Reset Password'} {/* Removed Magic Link title */}
        </h2>
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

        {(mode === 'signin' || mode === 'signup') && ( // Show password only for signin and signup
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register('password', {
                  required: (mode === 'signin' || mode === 'signup') ? 'Password is required' : false,
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10" // Added pr-10 for button spacing
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (mode === 'signin' || mode === 'signup') && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <> {/* Use a fragment to group signup-specific fields */}
            <div> {/* Confirm Password Field */}
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password', // Always required in signup
                    validate: value =>
                      value === watch('password') || 'Passwords do not match'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div> {/* Access Code Field */}
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <input
                id="accessCode"
                {...register('accessCode', {
                    required: 'Access code is required' // Always required in signup
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your access code"
              />
              {errors.accessCode && ( // Error shown if present
                <p className="text-red-500 text-sm mt-1">{errors.accessCode.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                A valid access code is required to sign up.
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {loading ? 'Loading...'
            : mode === 'signin' ? 'Sign In'
            : mode === 'signup' ? 'Sign Up'
            : 'Send Reset Link'} {/* Removed Magic Link button text */}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center">
        {mode === 'signin' && (
          <>
            <button
              type="button"
              onClick={() => { setMode('resetPassword'); setError(null); setMessage(null); }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
            >
              Forgot Password?
            </button>
            <hr className="my-2"/> {/* Visual separator */}
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
            >
              Don't have an account? Sign up
            </button>
            {/* Magic Link button removed */}
          </>
        )}

        {(mode === 'signup' || mode === 'resetPassword') && ( // Removed 'magic' from condition
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
            className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthForm;
