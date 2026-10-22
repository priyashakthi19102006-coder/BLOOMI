import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Sparkles, User, Lock, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BloomiMascot } from '../components/BloomiMascot'

export const StudentLoginPage: React.FC = () => {
  const { loginStudent, isConfigured, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedAvatar, setSelectedAvatar] = useState<string>('panda')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const avatars = [
    { id: 'lion', emoji: '🦁', name: 'Leo the Lion' },
    { id: 'panda', emoji: '🐼', name: 'Pip the Panda' },
    { id: 'fox', emoji: '🦊', name: 'Felix the Fox' },
    { id: 'dolphin', emoji: '🐬', name: 'Dara the Dolphin' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!registrationNumber.trim()) {
      setLocalError('Please enter your school registration number.')
      return
    }

    if (password.length < 4) {
      setLocalError('Password must be at least 4 characters.')
      return
    }

    if (!isConfigured) {
      setLocalError(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file, and deploy the student-login Edge Function.'
      )
      return
    }

    try {
      setIsSubmitting(true)
      await loginStudent(registrationNumber.trim(), password)
      const targetDestination = (location.state as any)?.from?.pathname || '/student/hub'
      navigate(targetDestination, { replace: true })
    } catch (err: any) {
      setLocalError(err.message || 'Invalid registration number or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6">
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#24483D] hover:text-[#16563F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border-2 transition-all bg-white border-[rgba(36,72,61,0.12)] shadow-xs">
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF5EE] border border-[#F8D2B8] flex items-center justify-center shadow-xs">
            <BloomiMascot size={42} reducedMotion />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            Student Adventure Sign-In
          </h1>
          <p className="text-sm text-[#3D6355] font-medium">
            Enter your school-issued registration number and password to begin!
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBE6] border border-[#FCE58D] flex items-start gap-3 text-xs text-[#664B00]">
            <Info className="w-5 h-5 text-[#8A6400] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are currently set to placeholders. Add your project credentials to <code>.env.local</code> and deploy the <code>student-login</code> Supabase Edge Function to authenticate against a live database.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {localError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="font-semibold">{localError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-3">
              1. Choose Your Companion Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`min-h-[64px] p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                    selectedAvatar === av.id
                      ? 'border-[#24483D] bg-[#CDEFE0] scale-105 shadow-xs'
                      : 'border-[rgba(36,72,61,0.15)] hover:border-[#24483D] bg-[#FFFDF7]'
                  }`}
                  aria-pressed={selectedAvatar === av.id}
                >
                  <span className="text-3xl" role="img" aria-label={av.name}>
                    {av.emoji}
                  </span>
                  <span className="text-xs font-bold text-[#24483D]">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* School Registration Number */}
          <div>
            <label
              htmlFor="registration-number"
              className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
            >
              2. Student Registration Number
            </label>
            <div className="relative">
              <input
                id="registration-number"
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. BLOOMI-3A-01"
                disabled={isSubmitting}
                className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] uppercase placeholder-[#3D6355]/40 font-bold focus:outline-none focus:ring-3 focus:ring-[#24483D] tracking-wide bg-[#FFFDF7]"
                required
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            </div>
            <p className="text-[11px] text-[#3D6355] font-medium mt-1">
              School code found on your student adventure card.
            </p>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="student-password"
              className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
            >
              3. Secret Adventure Password
            </label>
            <div className="relative">
              <input
                id="student-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-medium focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full min-h-[52px] py-4 rounded-2xl font-extrabold text-base sm:text-lg bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border-2 border-[#F8D2B8] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#7A3300]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Checking Adventure Pass...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Enter Adventure</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] text-center text-xs text-[#3D6355]">
          Need assistance? Ask your classroom teacher for your adventure card.
        </div>
      </div>
    </div>
  )
}
