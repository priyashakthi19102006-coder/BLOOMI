import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const TeacherLoginPage: React.FC = () => {
  const { loginTeacher, loginDemoTeacher, isConfigured, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateInput = (em: string, pwd: string): string | null => {
    const trimmed = em.trim()
    if (!trimmed) {
      return 'Please enter your school or specialist email address.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Please enter a valid email address (e.g. educator@school.edu).'
    }
    if (!pwd) {
      return 'Please enter your account password.'
    }
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const validationMsg = validateInput(email, password)
    if (validationMsg) {
      setLocalError(validationMsg)
      return
    }

    if (!isConfigured) {
      setLocalError(
        'Supabase cloud backend is not configured in this environment. Live educator authentication requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set in .env.local.'
      )
      return
    }

    try {
      setIsSubmitting(true)
      await loginTeacher(email.trim(), password)
      const targetDestination = (location.state as any)?.from?.pathname || '/teacher/dashboard'
      navigate(targetDestination, { replace: true })
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLaunchOfflineDemo = () => {
    loginDemoTeacher()
    const targetDestination = (location.state as any)?.from?.pathname || '/teacher/dashboard'
    navigate(targetDestination, { replace: true })
  }

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#24483D] hover:text-[#16563F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border-2 transition-all bg-white border-[rgba(36,72,61,0.12)] shadow-xs">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F7F4FF] border border-[#D5C2FE] text-[#4A248A] flex items-center justify-center shadow-xs">
            <GraduationCap className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            Educator &amp; Specialist Portal
          </h1>
          <p className="text-sm text-[#3D6355] font-medium">
            Sign in with your verified school email to manage classes and review learner progress.
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBE6] border border-[#FCE58D] flex items-start gap-3 text-xs text-[#664B00]">
            <Info className="w-5 h-5 text-[#8A6400] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are currently set to placeholders. Add your project credentials to <code>.env.local</code> to authenticate against a live database.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label
              htmlFor="teacher-email"
              className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
            >
              School or Specialist Email
            </label>
            <div className="relative">
              <input
                id="teacher-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="educator@school.edu"
                disabled={isSubmitting}
                autoComplete="email"
                className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-medium focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            </div>
          </div>

          {/* Password with Show/Hide Toggle */}
          <div>
            <label
              htmlFor="teacher-password"
              className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="teacher-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
            className="w-full min-h-[50px] py-3.5 rounded-2xl font-bold text-white bg-[#4A248A] hover:bg-[#3B1C70] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#D5C2FE]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In to Educator Dashboard</span>
            )}
          </button>
        </form>

        {/* Student Hub link */}
        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] flex items-center justify-between flex-wrap gap-2 text-xs text-[#3D6355]">
          <span>Student accounts must sign in via the Student Adventure Portal.</span>
          <Link
            to="/login/student"
            className="inline-flex items-center gap-1 font-bold text-[#4A248A] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Student Hub Sign In</span>
          </Link>
        </div>

        {/* Explicitly Labelled Development / Evaluation Flow */}
        <div className="mt-8 pt-6 border-t border-[rgba(36,72,61,0.12)] space-y-3">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#D5C2FE] text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#E8DEFF] font-black uppercase text-[10px] tracking-wider text-[#4A248A] border border-[#D5C2FE]">
                Offline Preview
              </span>
              <span className="font-extrabold text-[#4A248A]">Developer / Evaluation Flow Only</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#3D6355]">
              To evaluate the Educator Dashboard and student learning reports offline without active Supabase credentials, you can enter using this mock demo educator session. This runs entirely in-memory and does not connect to or authenticate against a remote database.
            </p>
            <button
              type="button"
              onClick={handleLaunchOfflineDemo}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5C2FE] bg-[#F7F4FF] hover:bg-[#E8DEFF] text-[#4A248A] text-xs font-black transition-colors focus:outline-none focus:ring-3 focus:ring-[#4A248A]"
            >
              <GraduationCap className="w-4 h-4 text-[#4A248A]" aria-hidden="true" />
              <span>Launch Offline Demo Educator Session (Ms. Clara Vance · Room 3-A)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
