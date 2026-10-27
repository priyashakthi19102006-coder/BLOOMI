import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { teacherService, EnrolledStudent, TeacherClass } from '../services/teacher.service'
import type { AccessibilityContextType } from '../layouts/RootLayout'
import {
  GraduationCap,
  Users,
  LogOut,
  BookOpen,
  Layers,
  Search,
  ArrowRight,
  Star,
  Clock,
  Filter,
  ShieldCheck,
  RefreshCw,
  UserPlus,
  Copy,
  Check,
  AlertCircle,
  X,
  Stethoscope,
  RotateCcw,
} from 'lucide-react'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
import { classroomService } from '../services/classroom.service'
import { ConsolidatedStudentProfileModal } from '../components/ConsolidatedStudentProfileModal'
import { MappingDiagnosticsModal } from '../components/MappingDiagnosticsModal'

export const TeacherDashboardPage: React.FC = () => {
  const { profile, user, logout, isConfigured } = useAuth()
  const navigate = useNavigate()

  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false

  const teacherId = user?.id || profile?.id || (isConfigured ? '' : 'demo_teacher_id')

  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [students, setStudents] = useState<EnrolledStudent[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedWorldFilter, setSelectedWorldFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Modal states for consolidated student profile and diagnostics
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<string | null>(null)
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState<boolean>(false)

  // Enrollment and code regeneration states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false)
  const [enrollCode, setEnrollCode] = useState<string>('')
  const [enrollError, setEnrollError] = useState<string | null>(null)
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null)
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false)
  const [hasCopiedCode, setHasCopiedCode] = useState<boolean>(false)
  const [isRegeneratingCode, setIsRegeneratingCode] = useState<boolean>(false)
  const [codeFeedback, setCodeFeedback] = useState<string | null>(null)

  const loadData = async () => {
    if (isConfigured && !teacherId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setLoadError(null)
    try {
      const [loadedClasses, loadedStudents] = await Promise.all([
        teacherService.getTeacherClasses(teacherId),
        teacherService.getTeacherStudents(teacherId),
      ])
      setClasses(loadedClasses)
      setStudents(loadedStudents)
    } catch (err: any) {
      console.error('Error loading teacher data:', err)
      setLoadError(err?.message || 'Failed to load classroom records from database.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyClassCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setHasCopiedCode(true)
    setCodeFeedback('Classroom code copied to clipboard!')
    setTimeout(() => {
      setHasCopiedCode(false)
      setCodeFeedback(null)
    }, 2500)
  }

  const handleRegenerateCode = async () => {
    const activeClass = classes[0]
    if (!activeClass) return

    const confirmRegenerate = window.confirm(
      `Generate a new joining code for "${activeClass.name}"? Previously enrolled students remain enrolled, but new students must use the new code.`
    )
    if (!confirmRegenerate) return

    setIsRegeneratingCode(true)
    setCodeFeedback(null)
    try {
      const res = await classroomService.regenerateClassCode(teacherId, activeClass.id)
      if (res.success && res.newCode) {
        setClasses((prev) =>
          prev.map((c) => (c.id === activeClass.id ? { ...c, classCode: res.newCode! } : c))
        )
        setCodeFeedback(`New classroom code generated: ${res.newCode}`)
        setTimeout(() => setCodeFeedback(null), 4000)
      } else {
        alert(res.error || 'Failed to regenerate classroom code.')
      }
    } finally {
      setIsRegeneratingCode(false)
    }
  }

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enrollCode.trim()) return

    const activeClass = classes[0]
    if (!activeClass) {
      setEnrollError('No active classroom found for this educator.')
      return
    }

    setIsEnrolling(true)
    setEnrollError(null)
    setEnrollSuccess(null)

    const result = await teacherService.enrollStudentByRegistrationNumber(
      teacherId,
      activeClass.id,
      enrollCode.trim()
    )

    if (result.success && result.student) {
      setEnrollSuccess(`Successfully enrolled ${result.student.displayName} (${result.student.registrationNumber})!`)
      setEnrollCode('')
      loadData()
      setTimeout(() => {
        setIsEnrollModalOpen(false)
        setEnrollSuccess(null)
      }, 1800)
    } else {
      setEnrollError(result.error || 'Failed to enroll student.')
    }
    setIsEnrolling(false)
  }

  useEffect(() => {
    loadData()
  }, [teacherId])

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  // Filter students by search and world
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedWorldFilter !== 'all') {
      const worldCount =
        student.worldProgress[selectedWorldFilter as keyof typeof student.worldProgress]?.completedLevels || 0
      return worldCount > 0
    }

    return true
  })

  // Calculate roster aggregate metrics
  const totalStudentsCount = students.length
  const activeStudentsCount = students.filter((s) => s.completedLevelsCount > 0).length
  const totalCompletedLevels = students.reduce((acc, s) => acc + s.completedLevelsCount, 0)
  const totalStarsEarned = students.reduce((acc, s) => acc + s.totalStars, 0)

  const activeClass = classes[0]

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Educator Header Banner */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-10 shadow-[0_0_35px_rgba(168,85,247,0.2)] relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-black border-[#00f5ff] text-white'
            : 'bg-[#0e0520] border-[#a855f7]/40 text-[#fdf4ff]'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#160a33] border-2 border-[#a855f7]/50 shadow-[0_0_18px_rgba(168,85,247,0.4)]">
              <GraduationCap className="w-9 h-9 text-[#00f5ff]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-[#a855f7]/25 text-[#f5d0fe] border border-[#a855f7]/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  Verified Educator
                </span>
                <span className="text-xs text-[#00f5ff] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RLS Authorization Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka mt-1 neon-text-purple">
                Welcome, {profile?.display_name || user?.email || 'Educator Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-[#d8b4fe] font-medium">
                Grade 3 Inclusive Learning Management &bull; {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDiagnosticsModalOpen(true)}
              className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#160a33] hover:bg-[#200e47] border border-[#a855f7]/60 text-[#f5d0fe] text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              title="Run System Mapping Health Check"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#00f5ff]" />
              <span>Mapping Health Check</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#160a33] hover:bg-[#200e47] border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,245,255,0.2)]"
              title="Refresh student progress records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 text-rose-200 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Aggregate Roster Metrics */}
        <div className="mt-8 pt-6 border-t border-[#a855f7]/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-[#a855f7]/40 bg-[#160a33] shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c084fc] mb-1">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Enrolled Students</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-white">
              {totalStudentsCount}
            </div>
            <p className="text-[11px] text-[#d8b4fe]">
              Class {activeClass?.classCode || '3-A'}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#00f5ff]/40 bg-[#160a33] shadow-[0_0_15px_rgba(0,245,255,0.15)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00f5ff] mb-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Active Learners</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-white">
              {activeStudentsCount} / {totalStudentsCount}
            </div>
            <p className="text-[11px] text-[#d8b4fe]">With completed levels</p>
          </div>

          <div className="p-4 rounded-2xl border border-[#ff2a85]/40 bg-[#160a33] shadow-[0_0_15px_rgba(255,42,133,0.15)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff70a6] mb-1">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Levels Blossomed</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-white">
              {totalCompletedLevels}
            </div>
            <p className="text-[11px] text-[#d8b4fe]">Across 4 Worlds</p>
          </div>

          <div className="p-4 rounded-2xl border border-[#ffd700]/40 bg-[#160a33] shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ffd700] mb-1">
              <Star className="w-4 h-4 fill-current text-[#ffd700]" aria-hidden="true" />
              <span>Bloom Stars Earned</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-white">
              {totalStarsEarned}
            </div>
            <p className="text-[11px] text-[#d8b4fe]">3 Stars per Level</p>
          </div>
        </div>
      </div>

      {/* Database Load Error Banner */}
      {loadError && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/60 border-2 border-rose-500/70 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-bold text-sm text-white">Database Synchronization Note</h4>
              <p className="text-xs text-rose-200/90">{loadError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shrink-0"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* My Classroom Section */}
      <div className="p-5 sm:p-7 rounded-3xl border-2 border-[#a855f7]/30 bg-[#0e0520] shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-[#fdf4ff] space-y-6">
        {/* Header: Classroom Name, Joining Code, Copy & Regenerate Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-[#a855f7]/20 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/30">
                My Classroom
              </span>
              <span className="text-xs text-[#d8b4fe]">
                Grade {activeClass?.gradeLevel || 3}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-fredoka text-white">
              {activeClass?.name || 'Classroom • Grade 3 Blossom Explorers'}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-[#d8b4fe]">
              <span className="font-semibold text-white">Classroom Joining Code:</span>
              <code className="font-mono bg-[#160a33] text-[#00f5ff] px-3 py-1.5 rounded-xl font-extrabold text-sm border-2 border-[#00f5ff]/50 shadow-[0_0_12px_rgba(0,245,255,0.3)] tracking-wider">
                {activeClass?.classCode || 'BLOOMI-3A'}
              </code>
              <button
                type="button"
                onClick={() => handleCopyClassCode(activeClass?.classCode || 'BLOOMI-3A')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#160a33] hover:bg-[#200e47] border border-[#00f5ff]/50 text-[#00f5ff] text-xs font-bold transition-all shadow-sm"
                title="Copy joining code for your students"
              >
                {hasCopiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#00f5ff]" />
                    <span>Copy Joining Code</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleRegenerateCode}
                disabled={isRegeneratingCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#160a33] hover:bg-[#200e47] border border-[#a855f7]/50 text-[#d8b4fe] hover:text-white text-xs font-semibold transition-all"
                title="Regenerate a new secure code"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-[#a855f7] ${isRegeneratingCode ? 'animate-spin' : ''}`} />
                <span>{isRegeneratingCode ? 'Regenerating...' : 'Regenerate Code'}</span>
              </button>
            </div>
            {codeFeedback && (
              <p className="text-xs text-emerald-400 font-semibold animate-fade-in flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {codeFeedback}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#160a33] border border-[#a855f7]/40 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe]">Enrolled Students</span>
              <span className="text-xl font-extrabold font-fredoka text-white">{students.length}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsEnrollModalOpen(true)
                setEnrollError(null)
                setEnrollSuccess(null)
              }}
              className="btn-neon-pink min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-[0_0_15px_rgba(255,42,133,0.3)]"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>Enroll Learner</span>
            </button>
          </div>
        </div>

        {/* Search by Name or Registration Number & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a855f7]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or registration number..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white placeholder-[#9382ad] focus:outline-none focus:ring-3 focus:ring-[#ff2a85]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
            <select
              value={selectedWorldFilter}
              onChange={(e) => setSelectedWorldFilter(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-[#a855f7]/40 bg-[#160a33] text-[#fdf4ff] focus:outline-none focus:ring-3 focus:ring-[#ff2a85]"
              aria-label="Filter learners by world activity"
            >
              <option value="all">All Learning Worlds</option>
              <option value="writing">Active in Writing World</option>
              <option value="speaking">Active in Speaking World</option>
              <option value="visual">Active in Visual Discovery</option>
              <option value="social">Active in Social Adventure</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
              Classroom Roster ({filteredStudents.length} of {students.length} Students)
            </h3>
            {filteredStudents.length > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified RLS Encrypted</span>
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#d8b4fe]">
              Loading student roster...
            </div>
          ) : filteredStudents.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-6 rounded-2xl bg-[#160a33] border-2 border-dashed border-[#a855f7]/40 text-center space-y-4">
              <Users className="w-12 h-12 text-[#a855f7] mx-auto opacity-70" aria-hidden="true" />
              <div className="space-y-2">
                <h4 className="font-extrabold text-lg text-white">
                  {students.length === 0 ? 'No Students Currently Enrolled' : 'No Matching Students Found'}
                </h4>
                <p className="text-xs text-[#d8b4fe] max-w-lg mx-auto leading-relaxed">
                  {students.length === 0 ? (
                    <>
                      To invite students, share your classroom joining code:{' '}
                      <strong className="text-[#00f5ff] font-mono text-sm px-2 py-0.5 rounded bg-[#0e0520] border border-[#00f5ff]/30">
                        {activeClass?.classCode || 'BLOOMI-3A'}
                      </strong>
                      .<br />
                      During student registration, students enter this code and will automatically appear in your classroom roster.
                    </>
                  ) : (
                    'Try adjusting your search keywords or clearing world filters.'
                  )}
                </p>
              </div>
              {students.length === 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyClassCode(activeClass?.classCode || 'BLOOMI-3A')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f5ff]/15 hover:bg-[#00f5ff]/25 border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-bold transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Joining Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="btn-neon-pink min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Directly Enroll by Reg ID</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => {
                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl border-2 border-[#a855f7]/30 bg-[#160a33] flex flex-col justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#00f5ff]/60 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CompanionAvatar id={student.avatarId} size="md" className="ring-2 ring-[#a855f7]/50" />
                          <div>
                            <h4 className="font-extrabold text-base font-fredoka text-white">
                              {student.displayName}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs font-bold text-[#00f5ff]">
                                {student.registrationNumber}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                                Active Enrollment
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stars Pill */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ffd700] bg-[#ffd700]/15 px-2.5 py-1 rounded-lg border border-[#ffd700]/30 shadow-[0_0_8px_rgba(255,215,0,0.2)]">
                            <Star className="w-3.5 h-3.5 fill-[#ffd700]" aria-hidden="true" />
                            <span>{student.totalStars} Stars</span>
                          </div>
                          <div className="text-[10px] text-[#d8b4fe] mt-1">
                            {student.lastActiveAt
                              ? `Active ${new Date(student.lastActiveAt).toLocaleDateString()}`
                              : 'Recently Joined'}
                          </div>
                        </div>
                      </div>

                      {/* Progress Metrics: Completed Levels */}
                      <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-[#0e0520] border border-[#a855f7]/30">
                        <span className="text-[#d8b4fe]">Completed Levels:</span>
                        <span className="font-extrabold text-[#00f5ff]">
                          {student.completedLevelsCount} / 200
                        </span>
                      </div>

                      {/* World Progress Breakdown */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-bold">
                        <div className="p-2 rounded-lg bg-[#ff2a85]/15 text-[#ff70a6] border border-[#ff2a85]/30">
                          <div>Writing</div>
                          <div className="font-extrabold">{student.worldProgress.writing.completedLevels}/50</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#ff007f]/15 text-[#f472b6] border border-[#ff007f]/30">
                          <div>Speaking</div>
                          <div className="font-extrabold">{student.worldProgress.speaking.completedLevels}/50</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/30">
                          <div>Visual</div>
                          <div className="font-extrabold">{student.worldProgress.visual.completedLevels}/50</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30">
                          <div>Social</div>
                          <div className="font-extrabold">{student.worldProgress.social.completedLevels}/50</div>
                        </div>
                      </div>

                      {/* Accommodations tags */}
                      {student.supportAccommodations && student.supportAccommodations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {student.supportAccommodations.map((acc, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0e0520] border border-[#a855f7]/30 text-[#d8b4fe]"
                            >
                              {acc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Student Action Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForProfile(student.id)}
                      className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-neon-purple text-xs font-extrabold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#a855f7] transition-all"
                    >
                      <span>View Student</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Security & Authorization Footnote */}
        <div className="p-4 rounded-2xl bg-[#160a33] border border-[#00f5ff]/30 text-xs text-[#d8b4fe] flex items-start gap-3 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
          <BookOpen className="w-5 h-5 text-[#00f5ff] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-[#00f5ff]">Pedagogical &amp; Authorization Notice:</strong> This dashboard is protected by PostgreSQL Row-Level Security (RLS). Authorized educators can only access student records within their assigned classroom roster. Learning observations are stored separately as educational notes and never as medical or psychological diagnoses.
          </div>
        </div>
      </div>

      {/* Enroll Learner Modal Dialog */}
      {isEnrollModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e0520] border-2 border-[#ff2a85]/60 shadow-[0_0_40px_rgba(255,42,133,0.35)] text-white space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff2a85]/20 border border-[#ff2a85]/50 flex items-center justify-center text-[#ff2a85]">
                  <UserPlus className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="enroll-modal-title" className="text-lg font-extrabold font-fredoka text-white">
                    Enroll Student in Classroom
                  </h3>
                  <p className="text-xs text-[#d8b4fe]">
                    Class: {activeClass?.name} ({activeClass?.classCode})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-lg text-purple-300 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {enrollError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{enrollError}</span>
              </div>
            )}

            {enrollSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{enrollSuccess}</span>
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="enroll-code-input" className="block text-xs font-bold text-purple-200">
                  Student Registration Code:
                </label>
                <input
                  id="enroll-code-input"
                  type="text"
                  required
                  placeholder="e.g. BLOOMI-3A-01"
                  value={enrollCode}
                  onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#a855f7]/50 bg-[#160a33] text-white font-mono text-sm placeholder-[#9382ad] focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                />
                <p className="text-[11px] text-purple-300/80">
                  Enter the student&apos;s unique school registration code to link their account to this classroom roster.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold text-purple-200 bg-[#160a33] border border-[#a855f7]/40 hover:bg-[#200e47] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling || !enrollCode.trim()}
                  className="btn-neon-pink min-h-[42px] px-6 py-2 rounded-xl text-xs font-extrabold disabled:opacity-50 transition-all"
                >
                  {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consolidated Student Profile Modal */}
      {selectedStudentForProfile && (
        <ConsolidatedStudentProfileModal
          isOpen={Boolean(selectedStudentForProfile)}
          studentId={selectedStudentForProfile}
          teacherId={teacherId}
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}

      {/* System Mapping Diagnostics Modal */}
      {isDiagnosticsModalOpen && (
        <MappingDiagnosticsModal
          isOpen={isDiagnosticsModalOpen}
          teacherId={teacherId}
          onClose={() => setIsDiagnosticsModalOpen(false)}
        />
      )}
    </div>
  )
}
