import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Loader2,
  GraduationCap,
  Smile,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BloomiMascot } from '../components/BloomiMascot'

interface StudentLoginPageProps {
  initialMode?: 'signin' | 'signup'
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ initialMode = 'signin' }) => {
  const {
    loginStudent,
    signUpStudent,
    loginDemoStudent,
    isConfigured,
    isLoading: authLoading,
    session,
    profile,
    logout,
  } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [selectedAvatar, setSelectedAvatar] = useState<string>('panda')
  const [displayName, setDisplayName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const avatars = [
    { id: 'lion', emoji: '🦁', name: 'Leo the Lion' },
    { id: 'panda', emoji: '🐼', name: 'Pip the Panda' },
    { id: 'fox', emoji: '🦊', name: 'Felix the Fox' },
    { id: 'dolphin', emoji: '🐬', name: 'Dara the Dolphin' },
  ]

  const validateSignIn = (regNo: string, pwd: string): string | null => {
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

  const validateSignUp = (
    name: string,
    regNo: string,
    pwd: string,
    confirmPwd: string
  ): string | null => {
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      return 'Please enter your explorer name (at least 2 characters).'
    }
    if (trimmedName.length > 40) {
      return 'Explorer name must be 40 characters or fewer.'
    }
    const trimmedRegNo = regNo.trim().toUpperCase()
    if (!trimmedRegNo || trimmedRegNo.length < 3 || trimmedRegNo.length > 30) {
      return 'School registration code must be between 3 and 30 characters.'
    }
    if (!/^[A-Z0-9_-]+$/.test(trimmedRegNo)) {
      return 'Registration code may only contain letters, numbers, and hyphens (e.g. BLOOMI-3A-01).'
    }
    if (!pwd || pwd.length < 6) {
      return 'Secret password must be at least 6 characters for safety.'
    }
    if (pwd !== confirmPwd) {
      return 'Passwords do not match. Please re-enter them carefully.'
    }
    return null
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const validationMsg = validateSignIn(registrationNumber, password)
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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const validationMsg = validateSignUp(displayName, registrationNumber, password, confirmPassword)
    if (validationMsg) {
      setLocalError(validationMsg)
      return
    }

    if (!isConfigured) {
      setLocalError(
        'Supabase cloud backend is not configured in this environment. Live student registration requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, and the student-signup Edge Function.'
      )
      return
    }

    try {
      setIsSubmitting(true)
      await signUpStudent(
        displayName.trim(),
        registrationNumber.trim(),
        password,
        selectedAvatar
      )
      const targetDestination = (location.state as any)?.from?.pathname || '/student/hub'
      navigate(targetDestination, { replace: true })
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed. Please check your school code and try again.')
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
        {/* Header Mascot */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF5EE] border border-[#F8D2B8] flex items-center justify-center shadow-xs">
            <BloomiMascot size={42} reducedMotion />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            {mode === 'signin' ? 'Student Adventure Sign-In' : 'Join the Adventure as a Student'}
          </h1>
          <p className="text-sm text-[#3D6355] font-medium max-w-md mx-auto">
            {mode === 'signin'
              ? 'Enter your school-issued registration number and secret password to begin!'
              : 'Create your Grade 3 student profile using your school-assigned registration code.'}
          </p>
        </div>

        {/* Child-Friendly Mode Switcher (Tabs) */}
        <div
          role="tablist"
          aria-label="Student Account Access"
          className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#FFFDF7] border-2 border-[rgba(36,72,61,0.15)] mb-6 gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            onClick={() => {
              setMode('signin')
              setLocalError(null)
            }}
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#24483D] ${
              mode === 'signin'
                ? 'bg-[#24483D] text-[#FFFDF7] shadow-xs'
                : 'text-[#3D6355] hover:text-[#24483D]'
            }`}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => {
              setMode('signup')
              setLocalError(null)
            }}
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#24483D] ${
              mode === 'signup'
                ? 'bg-[#24483D] text-[#FFFDF7] shadow-xs'
                : 'text-[#3D6355] hover:text-[#24483D]'
            }`}
          >
            <Smile className="w-4 h-4" aria-hidden="true" />
            <span>New Student (Sign Up)</span>
          </button>
        </div>

        {/* Active Session Notice & Account Switcher */}
        {session && (
          <div
            role="status"
            className="mb-6 p-4 rounded-2xl bg-[#F0FAF5] border-2 border-[#B2E6CE] text-[#16563F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <Smile className="w-5 h-5 shrink-0 text-[#16563F]" aria-hidden="true" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Active Explorer Session:</span> You are currently signed in as{' '}
                <span className="font-bold underline">{profile?.display_name || 'an explorer'}</span>
                {profile?.registration_number ? ` (${profile.registration_number})` : ''}.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={profile?.role === 'teacher' ? '/teacher/dashboard' : '/student/hub'}
                className="px-3.5 py-1.5 rounded-xl bg-[#24483D] text-[#FFFDF7] text-xs font-bold hover:bg-[#152E26] shadow-xs transition-colors"
              >
                Go to {profile?.role === 'teacher' ? 'Dashboard' : 'Hub'}
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  setLocalError(null)
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[#16563F] text-[#16563F] hover:bg-[#CDEFE0] text-xs font-bold transition-colors"
              >
                Sign Out First
              </button>
            </div>
          </div>
        )}

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBE6] border border-[#FCE58D] flex items-start gap-3 text-xs text-[#664B00]">
            <Info className="w-5 h-5 text-[#8A6400] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are currently set to placeholders. To authenticate or register live student accounts, add your project credentials to <code>.env.local</code> and deploy the student Edge Functions.
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
            <div className="space-y-1.5 flex-1">
              <div className="font-semibold">{localError}</div>
              {mode === 'signup' &&
                (localError.includes('already in use') || localError.includes('already registered')) && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin')
                        setLocalError(null)
                      }}
                      className="inline-flex items-center gap-1 font-extrabold text-rose-900 underline hover:text-rose-950 text-xs"
                    >
                      <span>Switch to Sign In tab with this code</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* SIGN-IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-6">
            {/* Companion Avatar Selection (Optional Profile Preference) */}
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
                htmlFor="signin-registration-number"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
              >
                2. School Registration Number
              </label>
              <div className="relative">
                <input
                  id="signin-registration-number"
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
                htmlFor="signin-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
              >
                3. Secret Adventure Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
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
        )}

        {/* SIGN-UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-3">
                1. Pick Your Adventure Companion
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

            {/* Display Name */}
            <div>
              <label
                htmlFor="signup-display-name"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
              >
                2. Your Explorer Name (or Nickname)
              </label>
              <div className="relative">
                <input
                  id="signup-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Leo M."
                  disabled={isSubmitting}
                  autoComplete="nickname"
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-bold focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                  required
                />
                <Smile className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#3D6355] font-medium mt-1">
                This is the name your friends and mascot will call you in BLOOMI.
              </p>
            </div>

            {/* School Registration Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="signup-registration-number"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355]"
                >
                  3. School-Issued Registration Code
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16563F] bg-[#CDEFE0] px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Grade 3 School Code</span>
                </span>
              </div>
              <div className="relative">
                <input
                  id="signup-registration-number"
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. BLOOMI-3A-01"
                  disabled={isSubmitting}
                  autoComplete="off"
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] uppercase placeholder-[#3D6355]/40 font-bold focus:outline-none focus:ring-3 focus:ring-[#24483D] tracking-wide bg-[#FFFDF7]"
                  required
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#3D6355] font-medium mt-1">
                Your school or classroom code protects child privacy and connects you to your grade.
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
              >
                4. Create a Secret Adventure Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  disabled={isSubmitting}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-2"
              >
                5. Confirm Secret Adventure Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] placeholder-[#3D6355]/40 font-medium focus:outline-none focus:ring-3 focus:ring-[#24483D] bg-[#FFFDF7]"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#3D6355]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#3D6355] hover:text-[#24483D] hover:bg-[rgba(36,72,61,0.06)] focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                >
                  {showConfirmPassword ? (
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
              className="w-full min-h-[52px] py-4 rounded-2xl font-extrabold text-base sm:text-lg bg-[#CDEFE0] hover:bg-[#B2E6CE] text-[#16563F] border-2 border-[#B2E6CE] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#16563F]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Creating Your Adventure Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span>Create Adventure Pass &amp; Start Exploring</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Teacher Link Notice */}
        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] flex items-center justify-between flex-wrap gap-2 text-xs text-[#3D6355]">
          <span>Are you a classroom teacher or specialist?</span>
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
