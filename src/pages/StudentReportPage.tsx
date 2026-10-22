import React, { useState, useEffect } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { teacherService, StudentLearningReport } from '../services/teacher.service'
import type { AccessibilityContextType } from '../layouts/RootLayout'
import {
  ArrowLeft,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  Clock,
  PlusCircle,
  Lightbulb,
  Info,
  Mic,
  Eye,
  HeartHandshake,
} from 'lucide-react'

export const StudentReportPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const { user } = useAuth()

  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false

  const teacherId = user?.id || 'demo_teacher_id'

  const [report, setReport] = useState<StudentLearningReport | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Active tab: 'progress' | 'timeline' | 'observations' | 'suggestions'
  const [activeTab, setActiveTab] = useState<'progress' | 'timeline' | 'observations' | 'suggestions'>('progress')

  // New observation form state
  const [newObsContext, setNewObsContext] = useState<string>('')
  const [newObsContent, setNewObsContent] = useState<string>('')
  const [newObsStrategy, setNewObsStrategy] = useState<string>('')
  const [newObsFollowUp, setNewObsFollowUp] = useState<string>('')
  const [obsDate, setObsDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [obsSubmitSuccess, setObsSubmitSuccess] = useState<boolean>(false)

  const loadReport = async () => {
    if (!studentId) return
    setIsLoading(true)
    const result = await teacherService.getStudentLearningReport(teacherId, studentId)
    setIsAuthorized(result.authorized)
    if (result.authorized && result.report) {
      setReport(result.report)
    } else {
      setErrorMessage(result.error || 'You are not authorized to view this student.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadReport()
  }, [teacherId, studentId])

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return

    const result = teacherService.addStudentObservation(teacherId, studentId, {
      observationDate: obsDate,
      activityContext: newObsContext,
      observedContent: newObsContent,
      strategyTried: newObsStrategy,
      followUpNotes: newObsFollowUp,
    })

    if (result.success) {
      setObsSubmitSuccess(true)
      setNewObsContext('')
      setNewObsContent('')
      setNewObsStrategy('')
      setNewObsFollowUp('')
      loadReport()
      setTimeout(() => setObsSubmitSuccess(false), 4000)
    }
  }

  // Unauthorized access state
  if (!isLoading && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFFBE6] text-[#664B00] border-2 border-[#FCE58D] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            Access Denied
          </h2>
          <p className="text-sm text-[#3D6355] max-w-md mx-auto leading-relaxed">
            {errorMessage || 'You do not have authorization to view records for this learner. Educators can only access students enrolled in their assigned classrooms.'}
          </p>
        </div>
        <Link
          to="/teacher/dashboard"
          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] font-bold text-sm shadow-xs hover:bg-[#152E26] focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Teacher Dashboard</span>
        </Link>
      </div>
    )
  }

  if (isLoading || !report) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#CDEFE0] border-t-[#24483D] rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#3D6355]">Loading student learning report...</p>
      </div>
    )
  }

  const { student, worldSummaries, rewardSummary, demonstratedSuccesses, areasForGrowth, timeline, observations, suggestions } = report

  const avatarMap: Record<string, string> = {
    lion: '🦁',
    panda: '🐼',
    fox: '🦊',
    dolphin: '🐬',
  }

  const avatar = avatarMap[student.avatarId] || '🌟'

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/teacher/dashboard"
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-extrabold text-[#24483D] hover:text-[#16563F] bg-white border border-[rgba(36,72,61,0.15)] px-4 py-2.5 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Classroom Roster</span>
        </Link>

        {student.isDemo && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFBE6] border border-[#FCE58D] text-xs font-bold text-[#664B00]">
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Demo Student Record</span>
          </div>
        )}
      </div>

      {/* Student Profile Banner */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-white border-[rgba(36,72,61,0.15)] text-[#24483D]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF5EE] border-2 border-[#F8D2B8] flex items-center justify-center text-3xl shadow-xs">
              {avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8DEFF] text-[#4A248A] font-extrabold uppercase">
                  Grade {student.gradeLevel} Learner
                </span>
                <span className="font-mono text-xs font-bold text-[#16563F] bg-[#F2FAF6] px-2 py-0.5 rounded border border-[#B2E6CE]">
                  {student.registrationNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka mt-1">
                {student.displayName}
              </h1>
              <p className="text-xs text-[#3D6355] dark:text-[#D3E5DC]">
                Classroom: {student.className} ({student.classCode})
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#FFFBE6] border border-[#FCE58D] text-center">
              <div className="text-lg font-extrabold font-fredoka text-[#664B00]">
                {rewardSummary.totalStars}
              </div>
              <div className="text-[11px] font-bold text-[#8A6400]">Bloom Stars</div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#F0FAF5] border border-[#B2E6CE] text-center">
              <div className="text-lg font-extrabold font-fredoka text-[#16563F]">
                {rewardSummary.totalCompletedLevels} / 200
              </div>
              <div className="text-[11px] font-bold text-[#16563F]">Levels Finished</div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#FFF5EE] border border-[#F8D2B8] text-center">
              <div className="text-lg font-extrabold font-fredoka text-[#7A3300]">
                {rewardSummary.earnedBadges.length}
              </div>
              <div className="text-[11px] font-bold text-[#7A3300]">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Support Accommodations */}
        <div className="mt-6 pt-4 border-t border-[rgba(36,72,61,0.08)] flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[#3D6355] dark:text-[#D3E5DC]">Enabled Universal Support Accommodations:</span>
          {student.supportAccommodations.map((acc) => (
            <span
              key={acc}
              className="px-2.5 py-0.5 rounded-full bg-[#FFFDF7] border border-[rgba(36,72,61,0.2)] text-[#24483D] font-semibold text-xs"
            >
              {acc}
            </span>
          ))}
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex border-b border-[rgba(36,72,61,0.15)] gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('progress')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'progress'
              ? 'border-[#24483D] text-[#24483D] bg-white shadow-xs'
              : 'border-transparent text-[#3D6355] hover:text-[#24483D]'
          }`}
        >
          Curriculum Progress
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'timeline'
              ? 'border-[#24483D] text-[#24483D] bg-white shadow-xs'
              : 'border-transparent text-[#3D6355] hover:text-[#24483D]'
          }`}
        >
          Activity Timeline ({timeline.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('observations')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'observations'
              ? 'border-[#24483D] text-[#24483D] bg-white shadow-xs'
              : 'border-transparent text-[#3D6355] hover:text-[#24483D]'
          }`}
        >
          Teacher Observations ({observations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('suggestions')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'suggestions'
              ? 'border-[#24483D] text-[#24483D] bg-white shadow-xs'
              : 'border-transparent text-[#3D6355] hover:text-[#24483D]'
          }`}
        >
          Support Strategies ({suggestions.length})
        </button>
      </div>

      {/* TAB 1: CURRICULUM PROGRESS & STRENGTHS */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* 4 Worlds Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Writing World */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#F8D2B8] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#7A3300] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Writing World</span>
                </span>
                <span className="text-xs font-bold text-[#7A3300]">
                  {worldSummaries.writing.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-[#24483D]">
                Level {worldSummaries.writing.currentLevelNumber}
              </div>
              <p className="text-xs text-[#3D6355] font-medium">
                {worldSummaries.writing.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#FFE0CC] overflow-hidden">
                <div
                  className="h-full bg-[#7A3300] rounded-full"
                  style={{ width: `${worldSummaries.writing.percentage}%` }}
                />
              </div>
            </div>

            {/* Speaking World */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#D5C2FE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#4A248A] flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  <span>Speaking World</span>
                </span>
                <span className="text-xs font-bold text-[#4A248A]">
                  {worldSummaries.speaking.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-[#24483D]">
                Level {worldSummaries.speaking.currentLevelNumber}
              </div>
              <p className="text-xs text-[#3D6355] font-medium">
                {worldSummaries.speaking.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#E8DEFF] overflow-hidden">
                <div
                  className="h-full bg-[#4A248A] rounded-full"
                  style={{ width: `${worldSummaries.speaking.percentage}%` }}
                />
              </div>
            </div>

            {/* Visual Discovery */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#B2E6CE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#16563F] flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Visual Discovery</span>
                </span>
                <span className="text-xs font-bold text-[#16563F]">
                  {worldSummaries.visual.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-[#24483D]">
                Level {worldSummaries.visual.currentLevelNumber}
              </div>
              <p className="text-xs text-[#3D6355] font-medium">
                {worldSummaries.visual.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#CDEFE0] overflow-hidden">
                <div
                  className="h-full bg-[#16563F] rounded-full"
                  style={{ width: `${worldSummaries.visual.percentage}%` }}
                />
              </div>
            </div>

            {/* Social Adventure */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#FCE58D] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#664B00] flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Social Adventure</span>
                </span>
                <span className="text-xs font-bold text-[#664B00]">
                  {worldSummaries.social.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-[#24483D]">
                Level {worldSummaries.social.currentLevelNumber}
              </div>
              <p className="text-xs text-[#3D6355] font-medium">
                {worldSummaries.social.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#FFF0B3] overflow-hidden">
                <div
                  className="h-full bg-[#664B00] rounded-full"
                  style={{ width: `${worldSummaries.social.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Demonstrated Successes & Practice Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#B2E6CE] shadow-xs space-y-3">
              <h3 className="text-base font-extrabold font-fredoka text-[#16563F] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#16563F]" />
                <span>Demonstrated Successes (Observed Evidence)</span>
              </h3>
              <ul className="space-y-2">
                {demonstratedSuccesses.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[#24483D] flex items-start gap-2">
                    <span className="text-[#16563F] font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#F8D2B8] shadow-xs space-y-3">
              <h3 className="text-base font-extrabold font-fredoka text-[#7A3300] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7A3300]" />
                <span>Areas for Continued Exploration</span>
              </h3>
              <ul className="space-y-2">
                {areasForGrowth.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[#24483D] flex items-start gap-2">
                    <span className="text-[#7A3300] font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[rgba(36,72,61,0.12)] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-extrabold font-fredoka text-[#24483D]">
              Recorded Activity History
            </h3>
            <span className="text-xs text-[#3D6355] font-semibold">
              {timeline.length} Recorded Milestone(s)
            </span>
          </div>

          {timeline.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#3D6355]">
              No recorded level completions yet. The timeline will populate as the learner finishes adventure levels.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FFFDF7] text-[#3D6355] uppercase text-[11px] font-extrabold border-b">
                  <tr>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">World</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Tasks</th>
                    <th className="py-3 px-4">Stars Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(36,72,61,0.06)] font-medium text-[#24483D]">
                  {timeline.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F2FAF6]">
                      <td className="py-3 px-4 font-mono text-xs text-[#3D6355]">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold capitalize">{item.worldId}</td>
                      <td className="py-3 px-4 font-bold">Level {item.levelNumber}: {item.levelTitle}</td>
                      <td className="py-3 px-4 text-[#16563F] font-bold">{item.tasksCompleted} / 5 completed</td>
                      <td className="py-3 px-4 text-[#7A3300] font-bold">⭐ {item.stars} Stars</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEACHER OBSERVATIONS & SUPPORT NOTES */}
      {activeTab === 'observations' && (
        <div className="space-y-6">
          {/* Add Observation Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[rgba(36,72,61,0.12)] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold font-fredoka text-[#24483D] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#16563F]" />
              <span>Record Educational Observation</span>
            </h3>
            <p className="text-xs text-[#3D6355]">
              Record objective observations of learner engagement, tactile strategies tried, and pedagogical follow-ups.
            </p>

            {obsSubmitSuccess && (
              <div className="p-3 rounded-xl bg-[#CDEFE0] border border-[#B2E6CE] text-[#16563F] text-xs font-bold">
                ✓ Educational observation saved securely!
              </div>
            )}

            <form onSubmit={handleAddObservation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D6355] mb-1">Observation Date</label>
                  <input
                    type="date"
                    required
                    value={obsDate}
                    onChange={(e) => setObsDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[rgba(36,72,61,0.2)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D6355] mb-1">Activity Context / Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Writing World: Level 2 Tracing & Blends"
                    value={newObsContext}
                    onChange={(e) => setNewObsContext(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[rgba(36,72,61,0.2)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D6355] mb-1">Directly Observed Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe factual actions and behaviors (e.g. 'Paused on similar letter shapes b vs d; tried sound clue twice before choosing correctly.')"
                  value={newObsContent}
                  onChange={(e) => setNewObsContent(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm border border-[rgba(36,72,61,0.2)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D6355] mb-1">Pedagogical Strategy Tried (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Provided sandpaper letters and enabled large font"
                    value={newObsStrategy}
                    onChange={(e) => setNewObsStrategy(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[rgba(36,72,61,0.2)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D6355] mb-1">Follow-up Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Revisit tactile phonics pairing tomorrow morning"
                    value={newObsFollowUp}
                    onChange={(e) => setNewObsFollowUp(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[rgba(36,72,61,0.2)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] font-bold text-xs sm:text-sm shadow-xs transition-colors focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>

          {/* Observations List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D6355]">
              Recorded Observations ({observations.length})
            </h4>

            {observations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border text-center text-xs text-[#3D6355]">
                No observations recorded yet.
              </div>
            ) : (
              observations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-5 rounded-2xl bg-white border border-[rgba(36,72,61,0.12)] shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="font-extrabold text-sm text-[#24483D]">
                      {obs.activityContext}
                    </span>
                    <span className="text-xs font-mono text-[#3D6355] font-semibold">
                      {obs.observationDate}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#24483D] leading-relaxed">
                    {obs.observedContent}
                  </p>

                  {(obs.strategyTried || obs.followUpNotes) && (
                    <div className="pt-2 flex flex-wrap gap-4 text-xs">
                      {obs.strategyTried && (
                        <div>
                          <strong className="text-[#16563F]">Strategy:</strong> {obs.strategyTried}
                        </div>
                      )}
                      {obs.followUpNotes && (
                        <div>
                          <strong className="text-[#4A248A]">Follow-up:</strong> {obs.followUpNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EDUCATIONAL SUPPORT SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#CDEFE0] text-xs text-[#16563F] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#16563F] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Non-Diagnostic Support Suggestions:</strong> These strategies are actionable educational suggestions grounded directly in recorded task activities. They are designed to support universal learning access and are never clinical or psychological classifications.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-5 rounded-2xl bg-white border-2 border-[rgba(36,72,61,0.12)] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8DEFF] text-[#4A248A]">
                    {sug.activityArea}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-[#24483D]">
                    {sug.suggestion}
                  </h4>
                  <p className="text-xs text-[#3D6355] mt-1 leading-relaxed">
                    <strong>Evidence:</strong> {sug.evidence}
                  </p>
                  <p className="text-xs text-[#16563F] mt-1 leading-relaxed">
                    <strong>Pedagogical Rationale:</strong> {sug.strategyRationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
