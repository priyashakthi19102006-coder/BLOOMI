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
  Download,
  Sparkles,
  Lock,
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

  // Active tab: 'progress' | 'timeline' | 'observations' | 'suggestions' | 'support'
  const [activeTab, setActiveTab] = useState<'progress' | 'timeline' | 'observations' | 'suggestions' | 'support'>('progress')

  // New observation form state
  const [newObsContext, setNewObsContext] = useState<string>('')
  const [newObsContent, setNewObsContent] = useState<string>('')
  const [newObsStrategy, setNewObsStrategy] = useState<string>('')
  const [newObsFollowUp, setNewObsFollowUp] = useState<string>('')
  const [obsDate, setObsDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [obsSubmitSuccess, setObsSubmitSuccess] = useState<boolean>(false)

  // New sensitive support record state
  const [suppDocBy, setSuppDocBy] = useState<string>('')
  const [suppLawfulBasis, setSuppLawfulBasis] = useState<'Parent Consent' | 'IEP Education Plan' | 'Specialist Assessment'>('IEP Education Plan')
  const [suppCategory, setSuppCategory] = useState<'Accommodations' | 'Communication Preferences' | 'Sensory Needs' | 'Documented Educational Support'>('Accommodations')
  const [suppDetails, setSuppDetails] = useState<string>('')
  const [suppReviewDate, setSuppReviewDate] = useState<string>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split('T')[0])
  const [suppSubmitSuccess, setSuppSubmitSuccess] = useState<boolean>(false)

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

  const handleAddSupportRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !suppDocBy.trim() || !suppDetails.trim()) return

    const result = teacherService.addSensitiveSupportRecord(teacherId, studentId, {
      documentedBy: suppDocBy,
      lawfulBasis: suppLawfulBasis,
      category: suppCategory,
      details: suppDetails,
      reviewDate: suppReviewDate,
      recordedAt: new Date().toISOString().split('T')[0],
      studentId,
    })

    if (result.success) {
      setSuppSubmitSuccess(true)
      setSuppDocBy('')
      setSuppDetails('')
      loadReport()
      setTimeout(() => setSuppSubmitSuccess(false), 4000)
    }
  }

  const handleExportReport = () => {
    if (!report) return
    const text = teacherService.exportReportToText(report)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `BLOOMI_Report_${report.student.registrationNumber}_${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Unauthorized access state
  if (!isLoading && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#160a33] text-[#ff2a85] border-2 border-[#ff2a85]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,42,133,0.3)]">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-white">
            Access Restricted
          </h2>
          <p className="text-sm text-purple-200/80 max-w-md mx-auto leading-relaxed">
            {errorMessage || 'You do not have authorization to view records for this learner. Educators can only access students enrolled in their assigned classrooms through verified RLS policies.'}
          </p>
        </div>
        <Link
          to="/teacher/dashboard"
          className="btn-neon-pink min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Teacher Portal</span>
        </Link>
      </div>
    )
  }

  if (isLoading || !report) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#ff2a85]/20 border-t-[#ff2a85] rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(255,42,133,0.5)]" />
        <p className="text-sm font-bold text-pink-300">Loading student learning report from verified database...</p>
      </div>
    )
  }

  const { student, worldSummaries, rewardSummary, demonstratedSuccesses, areasForGrowth, timeline, observations, suggestions, supportRecords = [] } = report

  const avatarMap: Record<string, string> = {
    lion: '🦁',
    panda: '🐼',
    fox: '🦊',
    dolphin: '🐬',
  }

  const avatar = avatarMap[student.avatarId] || '🌟'

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/teacher/dashboard"
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-extrabold text-pink-300 hover:text-white bg-[#0e0520] border border-[#a855f7]/40 hover:border-[#ff2a85]/60 px-4 py-2.5 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Classroom Roster</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#160a33] hover:bg-[#200e48] border-2 border-[#a855f7]/50 text-purple-200 text-xs sm:text-sm font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
          >
            <Download className="w-4 h-4 text-[#ff2a85]" />
            <span>Export Learning Report (.txt)</span>
          </button>

          {student.isDemo && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2e1a06] border border-[#ffd700]/50 text-xs font-bold text-amber-300">
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Demo Fixture</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Profile Banner - Dark Neon */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-black border-pink-400 text-white'
            : 'bg-[#0e0520]/90 border-[#ff2a85]/35 text-white shadow-[0_0_30px_rgba(255,42,133,0.12)]'
        }`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff2a85]/15 via-[#a855f7]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-[#160a33] border-2 border-[#ff2a85]/60 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,42,133,0.35)]">
              {avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/50 font-extrabold uppercase">
                  Grade {student.gradeLevel} Learner
                </span>
                <span className="font-mono text-xs font-bold text-[#00f5ff] bg-[#00f5ff]/10 px-2 py-0.5 rounded border border-[#00f5ff]/40">
                  {student.registrationNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka mt-1 text-white flex items-center gap-2">
                <span>{student.displayName}</span>
                <Sparkles className="w-5 h-5 text-[#ffd700]" />
              </h1>
              <p className="text-xs text-purple-200/80">
                Classroom: {student.className} ({student.classCode})
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#160a33] border border-[#ffd700]/50 text-center shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <div className="text-xl font-extrabold font-fredoka text-[#ffd700]">
                ⭐ {rewardSummary.totalStars}
              </div>
              <div className="text-[11px] font-bold text-amber-200/80">Bloom Stars</div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#160a33] border border-[#00f5ff]/50 text-center shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              <div className="text-xl font-extrabold font-fredoka text-[#00f5ff]">
                {rewardSummary.totalCompletedLevels} / 200
              </div>
              <div className="text-[11px] font-bold text-cyan-200/80">Levels Finished</div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#160a33] border border-[#ff2a85]/50 text-center shadow-[0_0_15px_rgba(255,42,133,0.2)]">
              <div className="text-xl font-extrabold font-fredoka text-[#ff2a85]">
                {rewardSummary.earnedBadges.length}
              </div>
              <div className="text-[11px] font-bold text-pink-200/80">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Support Accommodations */}
        <div className="mt-6 pt-4 border-t border-[#a855f7]/20 flex flex-wrap items-center gap-2 text-xs relative z-10">
          <span className="font-bold text-purple-200">Enabled Universal Accommodations:</span>
          {student.supportAccommodations.map((acc) => (
            <span
              key={acc}
              className="px-2.5 py-0.5 rounded-full bg-[#160a33] border border-[#a855f7]/40 text-purple-200 font-semibold text-xs"
            >
              {acc}
            </span>
          ))}
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex border-b border-[#a855f7]/30 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('progress')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'progress'
              ? 'border-[#ff2a85] text-white bg-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.2)]'
              : 'border-transparent text-purple-300/70 hover:text-pink-300'
          }`}
        >
          Curriculum Progress
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'timeline'
              ? 'border-[#ff2a85] text-white bg-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.2)]'
              : 'border-transparent text-purple-300/70 hover:text-pink-300'
          }`}
        >
          Activity Timeline ({timeline.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('observations')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'observations'
              ? 'border-[#ff2a85] text-white bg-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.2)]'
              : 'border-transparent text-purple-300/70 hover:text-pink-300'
          }`}
        >
          Educator Observations ({observations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('suggestions')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'suggestions'
              ? 'border-[#ff2a85] text-white bg-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.2)]'
              : 'border-transparent text-purple-300/70 hover:text-pink-300'
          }`}
        >
          Support Strategies ({suggestions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`min-h-[44px] px-5 py-2 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
            activeTab === 'support'
              ? 'border-[#ff2a85] text-white bg-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.2)]'
              : 'border-transparent text-purple-300/70 hover:text-pink-300'
          }`}
        >
          Protected Support Records ({supportRecords.length})
        </button>
      </div>

      {/* TAB 1: CURRICULUM PROGRESS & STRENGTHS */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* 4 Worlds Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Writing World - Hot-Pink Neon */}
            <div className="p-4 rounded-2xl bg-[#0e0520] border-2 border-[#ff2a85]/50 shadow-[0_0_20px_rgba(255,42,133,0.15)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#ff2a85] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Magic Amusement</span>
                </span>
                <span className="text-xs font-bold text-pink-300 font-mono">
                  {worldSummaries.writing.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-white">
                Level {worldSummaries.writing.currentLevelNumber}
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                {worldSummaries.writing.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#160a33] overflow-hidden border border-[#ff2a85]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#ff2a85] to-[#f43f5e] rounded-full shadow-[0_0_8px_#ff2a85]"
                  style={{ width: `${worldSummaries.writing.percentage}%` }}
                />
              </div>
            </div>

            {/* Speaking World - Electric-Purple Neon */}
            <div className="p-4 rounded-2xl bg-[#0e0520] border-2 border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#c084fc] flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  <span>Magic Food World</span>
                </span>
                <span className="text-xs font-bold text-purple-300 font-mono">
                  {worldSummaries.speaking.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-white">
                Level {worldSummaries.speaking.currentLevelNumber}
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                {worldSummaries.speaking.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#160a33] overflow-hidden border border-[#a855f7]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#a855f7] to-[#c084fc] rounded-full shadow-[0_0_8px_#a855f7]"
                  style={{ width: `${worldSummaries.speaking.percentage}%` }}
                />
              </div>
            </div>

            {/* Visual Discovery - Electric-Cyan Neon */}
            <div className="p-4 rounded-2xl bg-[#0e0520] border-2 border-[#00f5ff]/50 shadow-[0_0_20px_rgba(0,245,255,0.15)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#00f5ff] flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Magic Space World</span>
                </span>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {worldSummaries.visual.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-white">
                Level {worldSummaries.visual.currentLevelNumber}
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                {worldSummaries.visual.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#160a33] overflow-hidden border border-[#00f5ff]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#00f5ff] to-[#38bdf8] rounded-full shadow-[0_0_8px_#00f5ff]"
                  style={{ width: `${worldSummaries.visual.percentage}%` }}
                />
              </div>
            </div>

            {/* Social Adventure - Radiant-Gold Neon */}
            <div className="p-4 rounded-2xl bg-[#0e0520] border-2 border-[#ffd700]/50 shadow-[0_0_20px_rgba(255,215,0,0.15)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#ffd700] flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Magic Animal World</span>
                </span>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {worldSummaries.social.percentage}%
                </span>
              </div>
              <div className="text-2xl font-extrabold font-fredoka text-white">
                Level {worldSummaries.social.currentLevelNumber}
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                {worldSummaries.social.completedLevels} of 50 levels completed
              </p>
              <div className="w-full h-2 rounded-full bg-[#160a33] overflow-hidden border border-[#ffd700]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#ffd700] to-[#f59e0b] rounded-full shadow-[0_0_8px_#ffd700]"
                  style={{ width: `${worldSummaries.social.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Demonstrated Successes & Practice Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0520] border-2 border-[#00f5ff]/40 shadow-[0_0_20px_rgba(0,245,255,0.1)] space-y-3">
              <h3 className="text-base font-extrabold font-fredoka text-[#00f5ff] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00f5ff]" />
                <span>Demonstrated Successes (Observed Evidence)</span>
              </h3>
              <ul className="space-y-2.5">
                {demonstratedSuccesses.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-purple-100 flex items-start gap-2">
                    <span className="text-[#00f5ff] font-bold">&bull;</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0520] border-2 border-[#ff2a85]/40 shadow-[0_0_20px_rgba(255,42,133,0.1)] space-y-3">
              <h3 className="text-base font-extrabold font-fredoka text-[#ff2a85] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ff2a85]" />
                <span>Areas for Continued Exploration</span>
              </h3>
              <ul className="space-y-2.5">
                {areasForGrowth.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-purple-100 flex items-start gap-2">
                    <span className="text-[#ff2a85] font-bold">&bull;</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-[#0e0520] rounded-3xl p-6 sm:p-8 border-2 border-[#a855f7]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#a855f7]/20 pb-3">
            <h3 className="text-base font-extrabold font-fredoka text-white">
              Recorded Activity History
            </h3>
            <span className="text-xs text-purple-300 font-semibold font-mono">
              {timeline.length} Recorded Milestone(s)
            </span>
          </div>

          {timeline.length === 0 ? (
            <div className="py-12 text-center text-xs text-purple-300/70">
              No recorded level completions yet. The timeline will populate automatically as the learner finishes adventure levels.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#160a33] text-purple-200 uppercase text-[11px] font-extrabold border-b border-[#a855f7]/30">
                  <tr>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">World</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Tasks</th>
                    <th className="py-3 px-4">Stars Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a855f7]/15 font-medium text-white">
                  {timeline.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#160a33]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-purple-300">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold capitalize text-pink-300">{item.worldId}</td>
                      <td className="py-3 px-4 font-bold">Level {item.levelNumber}: {item.levelTitle}</td>
                      <td className="py-3 px-4 text-[#00f5ff] font-bold">{item.tasksCompleted} / 5 completed</td>
                      <td className="py-3 px-4 text-[#ffd700] font-bold">⭐ {item.stars} Stars</td>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0520] border-2 border-[#a855f7]/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] space-y-4">
            <h3 className="text-base font-extrabold font-fredoka text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#ff2a85]" />
              <span>Record Educational Observation</span>
            </h3>
            <p className="text-xs text-purple-200/80">
              Record objective observations of learner engagement, tactile strategies tried, and pedagogical follow-ups.
            </p>

            {obsSubmitSuccess && (
              <div className="p-3 rounded-xl bg-[#00f5ff]/15 border border-[#00f5ff]/60 text-[#00f5ff] text-xs font-bold">
                ✓ Educational observation saved securely!
              </div>
            )}

            <form onSubmit={handleAddObservation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Observation Date</label>
                  <input
                    type="date"
                    required
                    value={obsDate}
                    onChange={(e) => setObsDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Activity Context / Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Writing World: Level 2 Tracing & Blends"
                    value={newObsContext}
                    onChange={(e) => setNewObsContext(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Directly Observed Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe factual actions and behaviors (e.g. 'Paused on similar letter shapes b vs d; tried sound clue twice before choosing correctly.')"
                  value={newObsContent}
                  onChange={(e) => setNewObsContent(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Pedagogical Strategy Tried (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Provided sandpaper letters and enabled large font"
                    value={newObsStrategy}
                    onChange={(e) => setNewObsStrategy(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Follow-up Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Revisit tactile phonics pairing tomorrow morning"
                    value={newObsFollowUp}
                    onChange={(e) => setNewObsFollowUp(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-neon-pink min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm"
                >
                  Save Educational Observation
                </button>
              </div>
            </form>
          </div>

          {/* Observations List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Recorded Observations ({observations.length})
            </h4>

            {observations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0e0520] border border-[#a855f7]/30 text-center text-xs text-purple-300">
                No observations recorded yet.
              </div>
            ) : (
              observations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-5 rounded-2xl bg-[#0e0520] border border-[#a855f7]/35 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#a855f7]/20 pb-2">
                    <span className="font-extrabold text-sm text-white">
                      {obs.activityContext}
                    </span>
                    <span className="text-xs font-mono text-purple-300 font-semibold">
                      {obs.observationDate}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                    {obs.observedContent}
                  </p>

                  {(obs.strategyTried || obs.followUpNotes) && (
                    <div className="pt-2 flex flex-wrap gap-4 text-xs">
                      {obs.strategyTried && (
                        <div>
                          <strong className="text-[#00f5ff]">Strategy:</strong> {obs.strategyTried}
                        </div>
                      )}
                      {obs.followUpNotes && (
                        <div>
                          <strong className="text-pink-300">Follow-up:</strong> {obs.followUpNotes}
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
          <div className="p-4 rounded-2xl bg-[#0e0520] border border-[#00f5ff]/40 text-xs text-cyan-200 flex items-start gap-3 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
            <Lightbulb className="w-5 h-5 text-[#00f5ff] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Non-Diagnostic Support Suggestions:</strong> These strategies are actionable educational suggestions grounded directly in recorded task activities. They are designed to support universal learning access and are never clinical or psychological classifications.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-5 rounded-2xl bg-[#0e0520] border-2 border-[#a855f7]/30 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40">
                    {sug.activityArea}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {sug.suggestion}
                  </h4>
                  <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
                    <strong className="text-white">Evidence:</strong> {sug.evidence}
                  </p>
                  <p className="text-xs text-[#00f5ff] mt-1 leading-relaxed">
                    <strong>Pedagogical Rationale:</strong> {sug.strategyRationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SENSITIVE DOCUMENTED SUPPORT RECORDS & ACCOMMODATIONS */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          {/* Statutory & Privacy Notice */}
          <div className="p-5 rounded-2xl bg-[#0e0520] border-2 border-[#a855f7]/40 text-xs text-purple-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40 font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Protected Confidential Record
              </span>
              <strong className="text-white text-sm font-fredoka">Strict Lawful Basis &amp; Guardian Consent Policy</strong>
            </div>
            <p className="text-purple-200/80 leading-relaxed">
              These records reflect documented learning accommodations, communication preferences, and school support plans provided by authorized guardians or certified school specialists.
            </p>
            <div className="p-3 rounded-xl bg-[#160a33] border border-[#a855f7]/30 text-[11px] text-pink-300 font-medium">
              <strong>Non-Diagnostic Commitment:</strong> BLOOMI strictly never diagnoses medical conditions or developmental disorders from student gameplay, task speeds, or interaction choices. Documented records are maintained solely to deliver agreed-upon classroom accommodations.
            </div>
          </div>

          {/* Add Documented Support Entry Form */}
          <div className="p-6 rounded-2xl bg-[#0e0520] border-2 border-[#a855f7]/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold font-fredoka text-base text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#ff2a85]" />
                <span>Log Authorized Support Accommodation</span>
              </h3>
              {suppSubmitSuccess && (
                <span className="text-xs font-bold text-[#00f5ff] bg-[#00f5ff]/20 px-3 py-1 rounded-full border border-[#00f5ff]/50">
                  ✓ Support accommodation saved!
                </span>
              )}
            </div>

            <form onSubmit={handleAddSupportRecord} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">
                    Documented By (Authorised Source)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Helen Rostova (School Psychologist)"
                    value={suppDocBy}
                    onChange={(e) => setSuppDocBy(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">
                    Lawful Basis / Authority
                  </label>
                  <select
                    value={suppLawfulBasis}
                    onChange={(e) => setSuppLawfulBasis(e.target.value as any)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  >
                    <option value="IEP Education Plan">IEP Education Plan</option>
                    <option value="Parent Consent">Parent / Guardian Consent on File</option>
                    <option value="Specialist Assessment">Specialist Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">
                    Accommodation Category
                  </label>
                  <select
                    value={suppCategory}
                    onChange={(e) => setSuppCategory(e.target.value as any)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  >
                    <option value="Accommodations">Accommodations</option>
                    <option value="Communication Preferences">Communication Preferences</option>
                    <option value="Sensory Needs">Sensory Needs</option>
                    <option value="Documented Educational Support">Documented Educational Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">
                  Accommodation &amp; Support Plan Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe authorized classroom support (e.g. 'Allow read-aloud option, tactile letter prompts, and calm presentation mode during quiet focus.')"
                  value={suppDetails}
                  onChange={(e) => setSuppDetails(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">
                    Scheduled Review Date
                  </label>
                  <input
                    type="date"
                    required
                    value={suppReviewDate}
                    onChange={(e) => setSuppReviewDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#a855f7]/40 bg-[#160a33] text-white focus:outline-none focus:border-[#ff2a85]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-neon-pink min-h-[44px] w-full px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm"
                  >
                    Save Authorized Record
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* List of Existing Support Records */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Active Protected Accommodations ({supportRecords.length})
            </h4>

            {supportRecords.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0e0520] border border-[#a855f7]/30 text-center text-xs text-purple-300">
                No protected support records on file for this learner.
              </div>
            ) : (
              supportRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-[#0e0520] border-2 border-[#a855f7]/30 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#a855f7]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40">
                        {rec.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40 font-bold">
                        {rec.lawfulBasis}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-purple-300">
                      Recorded: <strong className="text-white">{rec.recordedAt}</strong> &bull; Next Review: <strong className="text-white">{rec.reviewDate}</strong>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-medium">
                    {rec.details}
                  </p>

                  <div className="text-xs text-purple-300 pt-1">
                    <strong className="text-white">Documented By:</strong> {rec.documentedBy}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
