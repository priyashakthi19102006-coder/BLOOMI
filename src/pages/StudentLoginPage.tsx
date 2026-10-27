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
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'

interface StudentLoginPageProps {
  initialMode?: 'signin' | 'signup'
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ initialMode = 'signin' }) => {
  const {
    loginStudent,
    signUpStudent,
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
  const [classCode, setClassCode] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('code') || ''
    } catch {
      return ''
    }
  })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const avatars = [
    { id: 'lion', avatarKey: 'bear', name: 'Barnaby Bear', realm: 'Amusement Park' },
    { id: 'dolphin', avatarKey: 'bunny', name: 'Pip Bunny', realm: 'Food World' },
    { id: 'panda', avatarKey: 'panda', name: 'Koa Panda', realm: 'Animal World' },
    { id: 'fox', avatarKey: 'fox', name: 'Nova Star Fox', realm: 'Space World' },
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
    classroomCode: string,
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
    const trimmedClassCode = classroomCode.trim().toUpperCase()
    if (!trimmedClassCode || trimmedClassCode.length < 3) {
      return "Please enter your teacher's classroom joining code (e.g. BLOOMI-3A)."
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

    const validationMsg = validateSignUp(
      displayName,
      registrationNumber,
      classCode,
      password,
      confirmPassword
    )
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
        classCode.trim(),
        selectedAvatar
      )
      const targetDestination = (location.state as any)?.from?.pathname || '/student/hub'
      navigate(targetDestination, { replace: true })
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed. Please check your classroom code and school code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6">
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#d8b4fe] hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border-2 transition-all bg-[#0e0520] border-[#ff2a85]/40 shadow-[0_0_40px_rgba(255,42,133,0.2)] text-[#fdf4ff]">
        {/* Header Mascot */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#160a33] border-2 border-[#ff2a85]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,42,133,0.4)]">
            <BloomiMascot size={42} reducedMotion />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka neon-text-pink">
            {mode === 'signin' ? 'Student Adventure Sign-In' : 'Join the Adventure as a Student'}
          </h1>
          <p className="text-sm text-[#d8b4fe] font-medium max-w-md mx-auto">
            {mode === 'signin'
              ? 'Enter your school-issued registration number and secret password to enter your world!'
              : 'Create your Grade 3 student profile using your school-assigned registration code.'}
          </p>
        </div>

        {/* Child-Friendly Mode Switcher (Tabs) */}
        <div
          role="tablist"
          aria-label="Student Account Access"
          className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#160a33] border-2 border-[#a855f7]/30 mb-6 gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            onClick={() => {
              setMode('signin')
              setLocalError(null)
            }}
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
              mode === 'signin'
                ? 'bg-[#ff2a85] text-white shadow-[0_0_15px_rgba(255,42,133,0.8)]'
                : 'text-[#d8b4fe] hover:text-white'
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
            className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
              mode === 'signup'
                ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.8)]'
                : 'text-[#d8b4fe] hover:text-white'
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
            className="mb-6 p-4 rounded-2xl bg-[#160a33] border-2 border-[#00f5ff]/40 text-[#fdf4ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
          >
            <div className="flex items-center gap-2.5">
              <Smile className="w-5 h-5 shrink-0 text-[#00f5ff]" aria-hidden="true" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[#00f5ff]">Active Session:</span> Signed in as{' '}
                <span className="font-bold underline text-white">{profile?.display_name || 'an explorer'}</span>
                {profile?.registration_number ? ` (${profile.registration_number})` : ''}.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={profile?.role === 'teacher' ? '/teacher/dashboard' : '/student/hub'}
                className="px-3.5 py-1.5 rounded-xl bg-[#ff2a85] text-white text-xs font-bold hover:bg-[#ff007f] shadow-[0_0_10px_rgba(255,42,133,0.6)] transition-all"
              >
                Go to {profile?.role === 'teacher' ? 'Dashboard' : 'Hub'}
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  setLocalError(null)
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[#a855f7]/50 text-[#d8b4fe] hover:text-white hover:bg-[#a855f7]/20 text-xs font-bold transition-colors"
              >
                Sign Out First
              </button>
            </div>
          </div>
        )}

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/60 flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Backend Configuration Notice:</span> Supabase environment variables are missing. Live student authentication requires <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
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
                      className="inline-flex items-center gap-1 font-extrabold text-[#00f5ff] underline hover:text-white text-xs"
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-3">
                1. Choose Your Companion Avatar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`min-h-[72px] p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#ff2a85] ${
                      selectedAvatar === av.id
                        ? 'border-[#ff2a85] bg-[#ff2a85]/20 scale-105 shadow-[0_0_18px_rgba(255,42,133,0.5)]'
                        : 'border-[#a855f7]/30 hover:border-[#ff2a85]/60 bg-[#160a33]'
                    }`}
                    aria-pressed={selectedAvatar === av.id}
                  >
                    <CompanionAvatar id={av.avatarKey} size="md" />
                    <span className="text-xs font-black text-white text-center leading-tight">{av.name}</span>
                    <span className="text-[10px] font-bold text-[#d8b4fe]">{av.realm}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* School Registration Number */}
            <div>
              <label
                htmlFor="signin-registration-number"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-2"
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[#a855f7]/40 text-white uppercase placeholder-[#9382ad] font-bold focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] tracking-wide bg-[#160a33]"
                  required
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#d8b4fe] font-medium mt-1">
                Your school-issued code found on your student adventure badge.
              </p>
            </div>

            {/* Password with Show/Hide Toggle */}
            <div>
              <label
                htmlFor="signin-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-2"
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] bg-[#160a33]"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#d8b4fe] hover:text-white hover:bg-[#ff2a85]/20 focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
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
              className="w-full min-h-[52px] py-4 rounded-2xl font-extrabold text-base sm:text-lg btn-neon-pink flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#ff2a85]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Checking Adventure Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-3">
                1. Pick Your Adventure Companion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`min-h-[72px] p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#ff2a85] ${
                      selectedAvatar === av.id
                        ? 'border-[#ff2a85] bg-[#ff2a85]/20 scale-105 shadow-[0_0_18px_rgba(255,42,133,0.5)]'
                        : 'border-[#a855f7]/30 hover:border-[#ff2a85]/60 bg-[#160a33]'
                    }`}
                    aria-pressed={selectedAvatar === av.id}
                  >
                    <CompanionAvatar id={av.avatarKey} size="md" />
                    <span className="text-xs font-black text-white text-center leading-tight">{av.name}</span>
                    <span className="text-[10px] font-bold text-[#d8b4fe]">{av.realm}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="signup-display-name"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-2"
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-bold focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] bg-[#160a33]"
                  required
                />
                <Smile className="absolute left-3.5 top-3.5 w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#d8b4fe] font-medium mt-1">
                This is the name your friends and mascot will call you in BLOOMI.
              </p>
            </div>

            {/* School Registration Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="signup-registration-number"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe]"
                >
                  3. School-Issued Registration Code
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00f5ff] bg-[#00f5ff]/20 px-2 py-0.5 rounded-md border border-[#00f5ff]/40">
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[#a855f7]/40 text-white uppercase placeholder-[#9382ad] font-bold focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] tracking-wide bg-[#160a33]"
                  required
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#d8b4fe] font-medium mt-1">
                Your school code identifies your grade level and preserves your child privacy.
              </p>
            </div>

            {/* Teacher Classroom Joining Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="signup-classroom-code"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe]"
                >
                  4. Teacher's Classroom Joining Code
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ffd700] bg-[#ffd700]/15 px-2 py-0.5 rounded-md border border-[#ffd700]/40">
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>One-Time Joining Code</span>
                </span>
              </div>
              <div className="relative">
                <input
                  id="signup-classroom-code"
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="e.g. BLOOMI-3A"
                  disabled={isSubmitting}
                  autoComplete="off"
                  className="w-full min-h-[48px] px-4 py-3 pl-10 rounded-xl border border-[#a855f7]/40 text-white uppercase placeholder-[#9382ad] font-bold focus:outline-none focus:ring-3 focus:ring-[#ffd700] focus:border-[#ffd700] tracking-wider bg-[#160a33]"
                  required
                />
                <GraduationCap className="absolute left-3.5 top-3.5 w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[#d8b4fe] font-medium mt-1">
                Enter the unique code from your teacher. You only enter this once — your account will stay automatically linked!
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-2"
              >
                5. Create a Secret Adventure Password
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] bg-[#160a33]"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#d8b4fe] hover:text-white hover:bg-[#ff2a85]/20 focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
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
                className="block text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe] mb-2"
              >
                6. Confirm Secret Adventure Password
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
                  className="w-full min-h-[48px] px-4 py-3 pl-10 pr-12 rounded-xl border border-[#a855f7]/40 text-white placeholder-[#9382ad] font-medium focus:outline-none focus:ring-3 focus:ring-[#ff2a85] focus:border-[#ff2a85] bg-[#160a33]"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] absolute right-1.5 top-0.5 flex items-center justify-center rounded-lg text-[#d8b4fe] hover:text-white hover:bg-[#ff2a85]/20 focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
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
              className="w-full min-h-[52px] py-4 rounded-2xl font-extrabold text-base sm:text-lg btn-neon-purple flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Creating Your Adventure Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  <span>Create Adventure Pass &amp; Start Exploring</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Teacher Link Notice */}
        <div className="mt-8 pt-4 border-t border-[#ff2a85]/20 flex items-center justify-between flex-wrap gap-2 text-xs text-[#d8b4fe]">
          <span>Are you a classroom teacher or specialist?</span>
          <Link
            to="/login/teacher"
            className="inline-flex items-center gap-1 font-bold text-[#00f5ff] hover:text-white hover:underline"
          >
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Teacher Portal Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
