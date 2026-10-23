import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { teacherService, EnrolledStudent, TeacherClass } from '../services/teacher.service'
import type { AccessibilityContextType } from '../layouts/RootLayout'
import {
  GraduationCap,
  Users,
  LogOut,
  BookOpen,
  Calendar,
  Layers,
  Search,
  ArrowRight,
  Star,
  Clock,
  Filter,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'

export const TeacherDashboardPage: React.FC = () => {
  const { profile, user, logout } = useAuth()
  const navigate = useNavigate()

  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false

  const teacherId = user?.id || profile?.id || 'demo_teacher_id'

  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [students, setStudents] = useState<EnrolledStudent[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedWorldFilter, setSelectedWorldFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [loadedClasses, loadedStudents] = await Promise.all([
        teacherService.getTeacherClasses(teacherId),
        teacherService.getTeacherStudents(teacherId),
      ])
      setClasses(loadedClasses)
      setStudents(loadedStudents)
    } catch (err) {
      console.error('Error loading teacher data:', err)
    } finally {
      setIsLoading(false)
    }
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

      {/* Classroom Information Card */}
      <div className="p-5 sm:p-7 rounded-3xl border-2 border-[#a855f7]/30 bg-[#0e0520] shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-[#fdf4ff] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#a855f7]/20 pb-4">
          <div>
            <h2 className="text-xl font-bold font-fredoka text-white">
              {activeClass?.name || 'Classroom • Grade 3 Blossom Explorers'}
            </h2>
            <p className="text-xs text-[#d8b4fe] mt-0.5">
              Class Registration Code:{' '}
              <code className="font-mono bg-[#160a33] text-[#00f5ff] px-2.5 py-0.5 rounded font-bold border border-[#00f5ff]/40 shadow-[0_0_8px_rgba(0,245,255,0.3)]">
                {activeClass?.classCode || 'BLOOMI-3A'}
              </code>
            </p>
          </div>
          <div className="text-xs text-[#d8b4fe] flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <span>Academic Year 2026–2027</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
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
              placeholder="Search by learner name or registration ID..."
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
            Authorized Learner Roster ({filteredStudents.length} Students)
          </h3>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#d8b4fe]">
              Loading student roster...
            </div>
          ) : filteredStudents.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 rounded-2xl bg-[#160a33] border-2 border-dashed border-[#a855f7]/30 text-center space-y-3">
              <Users className="w-10 h-10 text-[#a855f7] mx-auto opacity-70" aria-hidden="true" />
              <h4 className="font-extrabold text-base text-white">
                {students.length === 0 ? 'No Students Currently Enrolled' : 'No Matching Learners Found'}
              </h4>
              <p className="text-xs text-[#d8b4fe] max-w-md mx-auto">
                {students.length === 0
                  ? `Students will appear in this classroom automatically when they register using your classroom code: ${activeClass?.classCode || 'BLOOMI-3A'}.`
                  : 'Try adjusting your search keywords or clearing world filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => {
                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl border-2 border-[#a855f7]/30 bg-[#160a33] flex flex-col justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#ff2a85] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CompanionAvatar id={student.avatarId} size="md" className="ring-2 ring-[#a855f7]/50" />
                          <div>
                            <h4 className="font-extrabold text-base font-fredoka text-white">
                              {student.displayName}
                            </h4>
                            <span className="font-mono text-xs font-bold text-[#00f5ff]">
                              {student.registrationNumber}
                            </span>
                          </div>
                        </div>

                        {/* Stars Pill */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ffd700] bg-[#ffd700]/15 px-2.5 py-1 rounded-lg border border-[#ffd700]/30 shadow-[0_0_8px_rgba(255,215,0,0.2)]">
                            <Star className="w-3.5 h-3.5 fill-[#ffd700]" aria-hidden="true" />
                            <span>{student.totalStars} Stars</span>
                          </div>
                        </div>
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
                    </div>

                    {/* View Report Link */}
                    <Link
                      to={`/teacher/students/${student.id}`}
                      className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl btn-neon-purple text-xs font-extrabold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
                    >
                      <span>View Learning Report</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
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
    </div>
  )
}
