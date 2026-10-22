import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Sparkles, User, Lock, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border transition-all bg-white border-purple-100 shadow-md">
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shadow-xs">
            🎒
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-slate-900">
            Student Adventure Sign-In
          </h1>
          <p className="text-sm text-slate-500">
            Enter your school-issued registration number and password to begin!
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium">{localError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Choose Your Companion Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    selectedAvatar === av.id
                      ? 'border-purple-600 bg-purple-50 scale-105'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                  aria-pressed={selectedAvatar === av.id}
                >
                  <span className="text-3xl" role="img" aria-label={av.name}>
                    {av.emoji}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* School Registration Number */}
          <div>
            <label
              htmlFor="registration-number"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
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
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 uppercase placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase tracking-wide"
                required
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Issued by your school or classroom teacher.
            </p>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="student-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
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
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full py-4 rounded-2xl font-extrabold text-base sm:text-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-amber-950 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking Adventure Pass...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Enter Adventure</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Need assistance? Ask your teacher or learning specialist for your card.
        </div>
      </div>
    </div>
  )
}
