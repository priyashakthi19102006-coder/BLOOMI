import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Lock, Mail, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const TeacherLoginPage: React.FC = () => {
  const { loginTeacher, isConfigured, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim()) {
      setLocalError('Please enter your school or professional email.')
      return
    }

    if (!password) {
      setLocalError('Please enter your account password.')
      return
    }

    if (!isConfigured) {
      setLocalError(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file to sign in with live credentials.'
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
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are currently set to placeholders. Add your project credentials to <code>.env.local</code> to enable live database authentication.
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
                className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-medium focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            </div>
          </div>

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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] text-center text-xs text-[#3D6355]">
          Student accounts must sign in via the{' '}
          <Link to="/login/student" className="text-[#4A248A] font-bold underline hover:text-[#24483D]">
            Student Hub
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
