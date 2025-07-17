import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { supabase } from '@/supa_database/config/supabase'
import { useAuthContext } from './AuthProvider'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import NoAccessCodeModal from 'components/modals/NoAccessCodeModal'
import Link from 'next/link'
import { useTranslation, Trans } from 'next-i18next'

type FormData = {
  email: string
  password: string
  confirmPassword?: string
  accessCode?: string
  acceptTerms?: boolean
}

type AuthMode = 'signin' | 'signup' | 'resetPassword'

interface AuthFormProps {
  initialMode?: AuthMode;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'signin' }) => {
  const { t } = useTranslation('common');
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showNoAccessCodeModal, setShowNoAccessCodeModal] = useState(false)

  const router = useRouter()
  const { checkUser } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'resetPassword') {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
        setMessage(t('auth_reset_password_success'))
      } else if (mode === 'signup') {
        if (!data.acceptTerms) {
          setError(t('auth_accept_terms_required'))
          return
        }

        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
        const response = await fetch('/api/auth/signup', {
          ...fetchOptions,
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            accessCode: data.accessCode
          }),
        })
        const responseData = await response.json()
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
        }
        setMessage(responseData.message || t('auth_signup_success'))
        reset() // Clear the form fields
      } else if (mode === 'signin') {
        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
        const response = await fetch('/api/auth/signin', {
          ...fetchOptions,
          body: JSON.stringify({ email: data.email, password: data.password, rememberMe }),
        })
        const responseData = await response.json()
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
        }
        await supabase.auth.getSession()
        router.push('/dashboard').then(() => window.location.reload())
        return
      }
    } catch (err: any) {
      setError(err.message || t('auth_error_unexpected'))
    } finally {
      setLoading(false)
    }
  }

  const showForm = !(message && !error && mode === 'signup');

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto my-10 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">
          {mode === 'signin' ? t('auth_signin')
            : mode === 'signup' ? t('auth_signup')
            : t('auth_reset_password')}
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

      {showForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth_email_label')}
              </label>
              <input
                id="email"
                {...register('email', {
                  required: t('auth_email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth_email_invalid')
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth_email_placeholder')}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {mode !== 'resetPassword' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth_password_label')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    {...register('password', {
                      required: t('auth_password_required'),
                      minLength: { value: 6, message: t('auth_password_min_length') }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showPassword ? t('auth_password_aria_hide') : t('auth_password_aria_show')}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (mode === 'signin' || mode === 'signup') && (
                  <p id="password-error" className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    {t('auth_remember_me')}
                  </label>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth_confirm_password_label')}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      {...register('confirmPassword', {
                        required: mode === 'signup' ? t('auth_confirm_password_required') : false,
                        validate: value =>
                          value === watch('password') || t('auth_confirm_password_mismatch')
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="••••••••"
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                      aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                      aria-label={showConfirmPassword ? t('auth_password_aria_hide') : t('auth_password_aria_show')}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p id="confirm-password-error" className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">{t('auth_access_code_label')}</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNoAccessCodeModal(true)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-xs text-blue-600 hover:text-blue-700 focus:outline-none z-10"
                      aria-label="Don't have an access code?"
                    >
                      No code?
                    </button>
                  </div>
                  <input
                    id="accessCode"
                    {...register('accessCode')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('auth_access_code_placeholder')}
                    aria-invalid={errors.accessCode ? "true" : "false"}
                    aria-describedby={errors.accessCode ? "accessCode-error" : undefined}
                  />
                  {errors.accessCode && (
                    <p id="accessCode-error" className="text-red-500 text-sm mt-1">{errors.accessCode.message}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    {...register('acceptTerms', {
                      required: t('auth_accept_terms_required')
                    })}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    <Trans i18nKey="auth_accept_terms_label" t={t} components={[
                        <Link href="/terms-of-service" key="terms" className="text-blue-600 hover:text-blue-700 underline" target="_blank" />,
                        <Link href="/privacy-policy" key="privacy" className="text-blue-600 hover:text-blue-700 underline" target="_blank" />
                    ]} />
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {loading ? t('auth_loading')
                : mode === 'signin' ? t('auth_signin')
                : mode === 'signup' ? t('auth_signup')
                : t('auth_reset_password')}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => { setMode('resetPassword'); setError(null); setMessage(null); reset(); }}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
                >
                  {t('auth_forgot_password')}
                </button>
                <hr className="my-2"/>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); setMessage(null); reset(); }}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
                >
                  {t('auth_prompt_signup')}
                </button>
              </>
            )}

            {(mode === 'signup' || mode === 'resetPassword') && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setMessage(null); reset(); }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
              >
                {t('auth_go_to_signin')}
              </button>
            )}
          </div>
        </>
      )}

      {!showForm && (
        <div className="mt-6 text-center">
            <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setMessage(null); reset(); }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm py-1"
              >
                {t('auth_go_to_signin')}
            </button>
        </div>
      )}

            <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
          {t('auth_back_to_home', 'Back to Homepage')}
        </Link>
      </div>

      <NoAccessCodeModal
        isOpen={showNoAccessCodeModal}
        onClose={() => setShowNoAccessCodeModal(false)}
      />
    </div>
  )
}

export default AuthForm;
