import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Loader2,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BloomiMascot } from '../components/BloomiMascot'

export const StudentLoginPage: React.FC = () => {
  const { loginStudent, loginDemoStudent, isConfigured, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedAvatar, setSelectedAvatar] = useState<string>('panda')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const avatars = [
    { id: 'lion', emoji: '🦁', name: 'Leo the Lion' },
    { id: 'panda', emoji: '🐼', name: 'Pip the Panda' },
    { id: 'fox', emoji: '🦊', name: 'Felix the Fox' },
    { id: 'dolphin', emoji: '🐬', name: 'Dara the Dolphin' },
  ]

  const validateInput = (regNo: string, pwd: string): string | null => {
    const trimmed = regNo.trim().toUpperCase()
    if (!trimmed) {
      return 'Please enter your school-issued registration number.'
    }
    if (trimmed.length < 3 || trimmed.length > 30) {
      return 'Registration number must be between 3 and 30 characters.'
    }
    if (!/^[A-Z0-9_-]+$/.test(trimmed)) {
      return 'Registration number may only contain letters, numbers, and hyphens (e.g. BLOOMI-3A-01).'
    }
    if (!pwd) {
      return 'Please enter your secret adventure password.'
    }
    if (pwd.length < 4) {
      return 'Password must be at least 4 characters.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const validationMsg = validateInput(registrationNumber, password)
    if (validationMsg) {
      setLocalError(validationMsg)
      return
    }

    if (!isConfigured) {
      setLocalError(
        'Supabase cloud backend is not configured in this environment. Live student sign-in requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, and the student-login Edge Function.'
      )
      return
    }

    try {
      setIsSubmitting(true)
      await loginStudent(registrationNumber.trim(), password)
      const targetDestination = (location.state as any)?.from?.pathname || '/student/hub'
      navigate(targetDestination, { replace: true })
    } catch (err: any) {
      setLocalError(err.message || 'Invalid school registration number or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLaunchOfflineDemo = () => {
    loginDemoStudent()
    const targetDestination = (location.state as any)?.from?.pathname || '/student/hub'
    navigate(targetDestination, { replace: true })
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
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF5EE] border border-[#F8D2B8] flex items-center justify-center shadow-xs">
            <BloomiMascot size={42} reducedMotion />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            Student Adventure Sign-In
          </h1>
          <p className="text-sm text-[#3D6355] font-medium">
            Enter your school-issued registration number and secret password to begin your learning adventure.
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBE6] border border-[#FCE58D] flex items-start gap-3 text-xs text-[#664B00]">
            <Info className="w-5 h-5 text-[#8A6400] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are currently set to placeholders. To authenticate with a live student account, configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> and deploy the <code>student-login</code> Edge Function.
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
              2. School Registration Number
            </label>
            <div className="relative">
              <input
                id="registration-number"
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. BLOOMI-3A-01"
                disabled={isSubmitting}
                autoComplete="username"
                className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] uppercase placeholder-[#3D6355]/40 font-bold focus:outline-none focus:ring-3 focus:ring-[#24483D] tracking-wide bg-[#FFFDF7]"
                required
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            </div>
            <p className="text-[11px] text-[#3D6355] font-medium mt-1">
              Your school-issued code found on your student adventure badge.
            </p>
          </div>

          {/* Password with Show/Hide Toggle */}
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                autoComplete="current-password"
                className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-medium focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#3D6355] hover:text-[#24483D] hover:bg-[rgba(36,72,61,0.06)] focus:outline-none focus:ring-2 focus:ring-[#24483D]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
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

        {/* Teacher Link Notice */}
        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] flex items-center justify-between flex-wrap gap-2 text-xs text-[#3D6355]">
          <span>Need assistance? Ask your classroom teacher for your adventure card.</span>
          <Link
            to="/login/teacher"
            className="inline-flex items-center gap-1 font-bold text-[#4A248A] hover:underline"
          >
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Teacher Portal Sign In</span>
          </Link>
        </div>

        {/* Explicitly Labelled Offline Development / Evaluation Flow */}
        <div className="mt-8 pt-6 border-t border-[rgba(36,72,61,0.12)] space-y-3">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#FCE58D] text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#FFF0B3] font-black uppercase text-[10px] tracking-wider text-[#664B00] border border-[#FCE58D]">
                Offline Preview
              </span>
              <span className="font-extrabold text-[#664B00]">Developer / Evaluation Flow Only</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#3D6355]">
              To evaluate the Grade 3 Student Hub offline without active Supabase credentials, you can enter using this mock demo session. This runs entirely in-memory and does not connect to or authenticate against a remote database.
            </p>
            <button
              type="button"
              onClick={handleLaunchOfflineDemo}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#F8D2B8] bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] text-xs font-black transition-colors focus:outline-none focus:ring-3 focus:ring-[#7A3300]"
            >
              <Sparkles className="w-4 h-4 text-[#7A3300]" aria-hidden="true" />
              <span>Launch Offline Demo Student Session (Leo M. · BLOOMI-3A-01)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
