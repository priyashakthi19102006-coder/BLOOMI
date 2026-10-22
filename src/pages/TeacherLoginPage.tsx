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
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border transition-all bg-white border-purple-100 shadow-md">
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-slate-900">
            Educator &amp; Specialist Portal
          </h1>
          <p className="text-sm text-slate-500">
            Sign in with your verified school email to manage classes and view learner progress.
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium">{localError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="teacher-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
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
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="teacher-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
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
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In to Educator Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Student accounts must sign in via the <Link to="/login/student" className="text-purple-600 font-semibold underline">Student Hub</Link>.
        </div>
      </div>
    </div>
  )
}
