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
  Info,
  Clock,
  Filter,
} from 'lucide-react'

export const TeacherDashboardPage: React.FC = () => {
  const { profile, user, logout } = useAuth()
  const navigate = useNavigate()

  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false

  const teacherId = user?.id || 'demo_teacher_id'

  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [students, setStudents] = useState<EnrolledStudent[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedWorldFilter, setSelectedWorldFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [loadedClasses, loadedStudents] = await Promise.all([
          teacherService.getTeacherClasses(teacherId),
          teacherService.getTeacherStudents(teacherId),
        ])
        if (isMounted) {
          setClasses(loadedClasses)
          setStudents(loadedStudents)
        }
      } catch (err) {
        console.error('Error loading teacher data:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
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

  const avatarMap: Record<string, string> = {
    lion: '🦁',
    panda: '🐼',
    fox: '🦊',
    dolphin: '🐬',
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Educator Header Banner */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.15)] text-[#24483D]'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs border ${
                highContrast
                  ? 'bg-[#152E26] border-[#FFF0B3] text-[#FFF0B3]'
                  : 'bg-[#F7F4FF] border-[#D5C2FE] text-[#4A248A]'
              }`}
            >
              <GraduationCap className="w-9 h-9" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                    highContrast
                      ? 'bg-[#FFF0B3] text-[#0C1210]'
                      : 'bg-[#E8DEFF] text-[#4A248A]'
                  }`}
                >
                  Verified Educator
                </span>
                <span className="text-xs text-[#3D6355] font-semibold dark:text-[#D3E5DC]">
                  Session Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka mt-1">
                Welcome, {profile?.display_name || user?.email || 'Teacher Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-[#3D6355] dark:text-[#D3E5DC] font-medium">
                Grade 3 Inclusive Learning Management &bull; {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFFBE6] border border-[#FCE58D] text-xs font-bold text-[#664B00]">
              <Info className="w-4 h-4 text-[#8A6400] shrink-0" aria-hidden="true" />
              <span>Demo Classroom Mode Active</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                highContrast
                  ? 'bg-[#152E26] border border-[#3D6355] text-[#FFFDF7] hover:bg-[#24483D]'
                  : 'bg-[#FFFDF7] hover:bg-[#F2FAF6] border border-[rgba(36,72,61,0.2)] text-[#24483D]'
              }`}
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Aggregate Roster Metrics */}
        <div className="mt-8 pt-6 border-t border-[rgba(36,72,61,0.12)] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-2xl border ${
              highContrast ? 'bg-[#152E26] border-[#3D6355]' : 'bg-[#F7F4FF] border-[#D5C2FE]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A248A] dark:text-[#E8DEFF] mb-1">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Enrolled Students</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-[#24483D] dark:text-[#FFFDF7]">
              {totalStudentsCount}
            </div>
            <p className="text-[11px] text-[#3D6355] dark:text-[#D3E5DC]">In Class BLOOM-3A</p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              highContrast ? 'bg-[#152E26] border-[#3D6355]' : 'bg-[#F0FAF5] border-[#B2E6CE]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#16563F] dark:text-[#CDEFE0] mb-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Active Learners</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-[#24483D] dark:text-[#FFFDF7]">
              {activeStudentsCount} / {totalStudentsCount}
            </div>
            <p className="text-[11px] text-[#3D6355] dark:text-[#D3E5DC]">With recorded levels</p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              highContrast ? 'bg-[#152E26] border-[#3D6355]' : 'bg-[#FFF5EE] border-[#F8D2B8]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#7A3300] dark:text-[#FFE0CC] mb-1">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Levels Blossomed</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-[#24483D] dark:text-[#FFFDF7]">
              {totalCompletedLevels}
            </div>
            <p className="text-[11px] text-[#3D6355] dark:text-[#D3E5DC]">Across 4 Worlds</p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              highContrast ? 'bg-[#152E26] border-[#3D6355]' : 'bg-[#FFFBE6] border-[#FCE58D]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#664B00] dark:text-[#FFF0B3] mb-1">
              <Star className="w-4 h-4 fill-[#FFF0B3]" aria-hidden="true" />
              <span>Bloom Stars Earned</span>
            </div>
            <div className="text-2xl font-extrabold font-fredoka text-[#24483D] dark:text-[#FFFDF7]">
              {totalStarsEarned}
            </div>
            <p className="text-[11px] text-[#3D6355] dark:text-[#D3E5DC]">3 Stars per Level</p>
          </div>
        </div>
      </div>

      {/* Classroom Information Card */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border-2 shadow-xs space-y-4 ${
          highContrast
            ? 'bg-[#0C1210] border-[#3D6355] text-[#FFFDF7]'
            : 'bg-white border-[rgba(36,72,61,0.12)] text-[#24483D]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(36,72,61,0.08)] pb-4">
          <div>
            <h2 className="text-xl font-bold font-fredoka">
              {activeClass?.name || 'Classroom • Grade 3 Blossom Explorers'}
            </h2>
            <p className="text-xs text-[#3D6355] dark:text-[#D3E5DC] mt-0.5">
              Class Code:{' '}
              <code className="font-mono bg-[#F7F4FF] text-[#4A248A] px-2 py-0.5 rounded font-bold border border-[#D5C2FE]">
                {activeClass?.classCode || 'BLOOM-3A'}
              </code>
            </p>
          </div>
          <div className="text-xs text-[#3D6355] dark:text-[#D3E5DC] flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Academic Year 2026–2027</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D6355]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by learner name or registration ID..."
              className={`w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                highContrast
                  ? 'bg-[#152E26] border-[#3D6355] text-[#FFFDF7]'
                  : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.2)] text-[#24483D]'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3D6355]" aria-hidden="true" />
            <select
              value={selectedWorldFilter}
              onChange={(e) => setSelectedWorldFilter(e.target.value)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                highContrast
                  ? 'bg-[#152E26] border-[#3D6355] text-[#FFFDF7]'
                  : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.2)] text-[#24483D]'
              }`}
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D6355] dark:text-[#D3E5DC]">
            Authorized Learner Roster ({filteredStudents.length} Students)
          </h3>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#3D6355]">
              Loading student roster...
            </div>
          ) : filteredStudents.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 rounded-2xl bg-[#FFFDF7] border border-dashed border-[rgba(36,72,61,0.2)] text-center space-y-2">
              <Users className="w-8 h-8 text-[#3D6355] mx-auto opacity-60" aria-hidden="true" />
              <h4 className="font-extrabold text-sm text-[#24483D]">No matching learners found</h4>
              <p className="text-xs text-[#3D6355]">
                Try adjusting your search keywords or clearing world filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => {
                const avatar = avatarMap[student.avatarId] || '🌟'
                return (
                  <div
                    key={student.id}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 shadow-xs hover:border-[#24483D] ${
                      highContrast
                        ? 'bg-[#152E26] border-[#3D6355]'
                        : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.12)]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-[rgba(36,72,61,0.15)] flex items-center justify-center text-2xl shadow-xs">
                            {avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-base font-fredoka text-[#24483D] dark:text-[#FFFDF7]">
                                {student.displayName}
                              </h4>
                              {student.isDemo && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFFBE6] text-[#664B00] font-bold border border-[#FCE58D]">
                                  Demo
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-xs font-bold text-[#4A248A] dark:text-[#E8DEFF]">
                              {student.registrationNumber}
                            </span>
                          </div>
                        </div>

                        {/* Stars & Badges Pill */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7A3300] bg-[#FFE0CC] px-2.5 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-[#7A3300]" aria-hidden="true" />
                            <span>{student.totalStars} Stars</span>
                          </div>
                        </div>
                      </div>

                      {/* World Progress Breakdown */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-bold">
                        <div className="p-1.5 rounded-lg bg-[#FFF5EE] text-[#7A3300] border border-[#F8D2B8]">
                          <div>Writing</div>
                          <div className="font-extrabold">{student.worldProgress.writing.completedLevels}/50</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE]">
                          <div>Speaking</div>
                          <div className="font-extrabold">{student.worldProgress.speaking.completedLevels}/50</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE]">
                          <div>Visual</div>
                          <div className="font-extrabold">{student.worldProgress.visual.completedLevels}/50</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D]">
                          <div>Social</div>
                          <div className="font-extrabold">{student.worldProgress.social.completedLevels}/50</div>
                        </div>
                      </div>

                      {/* Accommodations tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {student.supportAccommodations.map((acc) => (
                          <span
                            key={acc}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[rgba(36,72,61,0.12)] text-[#3D6355]"
                          >
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Report Link */}
                    <Link
                      to={`/teacher/students/${student.id}`}
                      className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] text-xs font-extrabold shadow-xs transition-colors focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
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
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#CDEFE0] text-xs text-[#16563F] flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[#16563F] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong>Pedagogical &amp; Authorization Notice:</strong> This dashboard is protected by Supabase Row-Level Security (RLS). Authorized educators can only access student records within their assigned classroom roster. Learning observations are stored separately as educational notes and never as medical or psychological diagnoses.
          </div>
        </div>
      </div>
    </div>
  )
}
