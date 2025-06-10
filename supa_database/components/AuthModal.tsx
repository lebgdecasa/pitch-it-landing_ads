// supa_database/components/AuthModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// Removed direct auth imports: signIn, signUp, signInWithMagicLink, validateAccessCode

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string; // Added for confirm password
  accessCode?: string; // Will be made mandatory for signup
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin'); // Removed 'magic'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      accessCode: '',
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    try {
      if (mode === 'signup') {
        const response = await fetch('/api/auth/signup', {
          ...fetchOptions,
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            accessCode: data.accessCode, // Access code is now mandatory
          }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
        }
        setMessage(responseData.message || 'Sign-up successful. Please check your email.');
        // Optionally reset form or switch mode after successful signup message
        // For now, keep on signup form with success message. User can close modal.
      } else { // signin
        const response = await fetch('/api/auth/signin', {
          ...fetchOptions,
          body: JSON.stringify({ email: data.email, password: data.password }), // rememberMe not typical for modals
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
        }
        // Sign-in successful via API, cookie is set.
        // AuthProvider will pick up the change. Close modal.
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 md:p-8 z-50"> {/* Responsive padding for overlay */}
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md"> {/* Responsive padding for modal content */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'} {/* Removed Magic Link */}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

          {/* Password Field (common for signin and signup) */}
          <div>
            <label htmlFor="passwordModal" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="passwordModal"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Signup Specific Fields */}
          {mode === 'signup' && (
            <>
              <div> {/* Confirm Password Field */}
                <label htmlFor="confirmPasswordModal" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPasswordModal"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
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
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div> {/* Access Code Field - Now Mandatory for Signup */}
                <label htmlFor="accessCodeModal" className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
                <input
                  id="accessCodeModal"
                  type="text"
                  {...register('accessCode', { required: 'Access code is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your access code"
                />
                {errors.accessCode && <p className="text-red-500 text-sm mt-1">{errors.accessCode.message}</p>}
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
            {loading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'signin' ? (
            <button
              onClick={() => { setMode('signup'); setError(null); setMessage(null);}}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Don't have an account? Sign up
            </button>
          ) : ( // mode === 'signup'
            <button
              onClick={() => { setMode('signin'); setError(null); setMessage(null);}}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
