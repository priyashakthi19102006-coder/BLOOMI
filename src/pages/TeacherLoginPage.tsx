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
  CheckCircle,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const TeacherLoginPage: React.FC = () => {
  const { loginTeacher, signUpTeacher, isConfigured, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState<'signin' | 'onboard'>('signin')

  // Sign In state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Onboarding state
  const [displayName, setDisplayName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [onboardEmail, setOnboardEmail] = useState('')
  const [onboardPassword, setOnboardPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [showOnboardPassword, setShowOnboardPassword] = useState(false)

  const [localError, setLocalError] = useState<string | null>(null)
  const [localSuccess, setLocalSuccess] = useState<string | null>(null)
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setLocalSuccess(null)

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

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setLocalSuccess(null)

    if (!displayName.trim()) {
      setLocalError('Please enter your full name and title (e.g., Ms. Sarah Jenkins).')
      return
    }
    if (!schoolName.trim()) {
      setLocalError('Please enter your school or district name.')
      return
    }
    const valMsg = validateInput(onboardEmail, onboardPassword)
    if (valMsg) {
      setLocalError(valMsg)
      return
    }
    if (onboardPassword !== confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    if (!invitationCode.trim()) {
      setLocalError('School invitation code is required for educator onboarding.')
      return
    }

    try {
      setIsSubmitting(true)
      await signUpTeacher(
        onboardEmail.trim(),
        onboardPassword,
        displayName.trim(),
        schoolName.trim(),
        invitationCode.trim()
      )
      setLocalSuccess('Educator account onboarded successfully! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/teacher/dashboard', { replace: true })
      }, 1200)
    } catch (err: any) {
      setLocalError(err.message || 'Failed to complete educator onboarding.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#d8b4fe] hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border-2 transition-all bg-[#0e0520] border-[#a855f7]/40 shadow-[0_0_40px_rgba(168,85,247,0.25)] text-[#fdf4ff]">
        {/* Header Icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#160a33] border-2 border-[#a855f7]/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <GraduationCap className="w-8 h-8 text-[#00f5ff]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka neon-text-purple">
            Educator &amp; Specialist Portal
          </h1>
          <p className="text-sm text-[#d8b4fe] font-medium max-w-sm mx-auto">
            Authorized access to classroom rosters, genuine student learning progress, and inclusive observations.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Verified Onboarding */}
        <div
          role="tablist"
          aria-label="Educator Access"
          className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#160a33] border-2 border-[#a855f7]/30 mb-6 gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signin'}
            onClick={() => {
              setActiveTab('signin')
              setLocalError(null)
              setLocalSuccess(null)
            }}
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#a855f7] ${
              activeTab === 'signin'
                ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.8)]'
                : 'text-[#d8b4fe] hover:text-white'
            }`}
          >
            <span>Educator Sign In</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'onboard'}
            onClick={() => {
              setActiveTab('onboard')
              setLocalError(null)
              setLocalSuccess(null)
            }}
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#a855f7] ${
              activeTab === 'onboard'
                ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.8)]'
                : 'text-[#d8b4fe] hover:text-white'
            }`}
          >
            <span>School Onboarding</span>
          </button>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/60 flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are missing. Live educator sign-in requires <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {localError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/60 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="font-semibold">{localError}</div>
          </div>
        )}

        {/* Success Alert */}
        {localSuccess && (
          <div
            role="status"
            className="mb-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="font-semibold">{localSuccess}</div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="teacher-email"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                School Email Address
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] focus:border-[#a855f7] bg-[#160a33]"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="teacher-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                Account Password
              </label>
              <div className="relative">
                <input
                  id="teacher-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] focus:border-[#a855f7] bg-[#160a33]"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#d8b4fe] hover:text-white hover:bg-[#a855f7]/20 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
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
              className="w-full min-h-[50px] py-3.5 rounded-2xl font-bold text-white btn-neon-purple shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Verifying Educator Authorization...</span>
                </>
              ) : (
                <span>Access Educator Dashboard</span>
              )}
            </button>
          </form>
        )}

        {/* VERIFIED ONBOARDING FORM */}
        {activeTab === 'onboard' && (
          <form onSubmit={handleOnboard} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#00f5ff]/30 text-xs text-[#d8b4fe] space-y-1">
              <span className="font-bold text-[#00f5ff]">School Verification Required:</span> Public registration cannot self-elevate to teacher without an approved school administrator code.
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="onboard-name"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                Full Name &amp; Title
              </label>
              <input
                id="onboard-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ms. Clara Vance"
                disabled={isSubmitting}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                required
              />
            </div>

            {/* School / District Name */}
            <div>
              <label
                htmlFor="onboard-school"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                School / Learning Center
              </label>
              <input
                id="onboard-school"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Maple Glen Elementary (Grade 3)"
                disabled={isSubmitting}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="onboard-email"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                School Email Address
              </label>
              <input
                id="onboard-email"
                type="email"
                value={onboardEmail}
                onChange={(e) => setOnboardEmail(e.target.value)}
                placeholder="c.vance@mapleglen.edu"
                disabled={isSubmitting}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                required
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="onboard-pwd"
                    className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowOnboardPassword(!showOnboardPassword)}
                    className="text-[11px] font-bold text-[#00f5ff] hover:underline"
                  >
                    {showOnboardPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="onboard-pwd"
                  type={showOnboardPassword ? 'text' : 'password'}
                  value={onboardPassword}
                  onChange={(e) => setOnboardPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#a855f7]/40 text-white font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="onboard-confirm-pwd"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="onboard-confirm-pwd"
                  type={showOnboardPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#a855f7]/40 text-white font-medium focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                  required
                />
              </div>
            </div>

            {/* Invitation Code */}
            <div>
              <label
                htmlFor="onboard-code"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-1.5"
              >
                School Invitation / District Code
              </label>
              <input
                id="onboard-code"
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                placeholder="BLOOMI-TEACH-2026"
                disabled={isSubmitting}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#a855f7]/40 text-[#ffd700] font-mono font-bold tracking-wider focus:outline-none focus:ring-3 focus:ring-[#a855f7] bg-[#160a33]"
                required
              />
              <p className="text-[11px] text-[#d8b4fe] mt-1">
                Issued by your school administrator. Standard educator code: <code>BLOOMI-TEACH-2026</code>
              </p>
            </div>

            {/* Submit Onboarding */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full min-h-[50px] py-3.5 rounded-2xl font-bold text-white btn-neon-purple shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Verifying School Code &amp; Onboarding...</span>
                </>
              ) : (
                <span>Complete Educator Onboarding</span>
              )}
            </button>
          </form>
        )}

        {/* Student Hub link */}
        <div className="mt-8 pt-4 border-t border-[#a855f7]/20 flex items-center justify-between flex-wrap gap-2 text-xs text-[#d8b4fe]">
          <span>Student accounts must sign in via the Student Adventure Portal.</span>
          <Link
            to="/login/student"
            className="inline-flex items-center gap-1 font-bold text-[#ff2a85] hover:text-white hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Student Hub Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
