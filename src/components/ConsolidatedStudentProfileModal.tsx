import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  BookOpen,
  Mic,
  Eye,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ExternalLink,
  Lightbulb,
} from 'lucide-react'
import { CompanionAvatar } from './worlds/CompanionAvatar'
import {
  teacherService,
  type StudentLearningReport,
} from '../services/teacher.service'
import type { WorldId } from '../types/curriculum.types'
import { curriculumWorlds, curriculumService } from '../data/curriculum/curriculumGenerator'

interface ConsolidatedStudentProfileModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string | null
  teacherId: string
  onObservationAdded?: () => void
}

export const ConsolidatedStudentProfileModal: React.FC<ConsolidatedStudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId,
  teacherId,
  onObservationAdded,
}) => {
  const [report, setReport] = useState<StudentLearningReport | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'progress' | 'levels' | 'tasks' | 'sessions' | 'observations' | 'recommendations'
  >('progress')

  // New observation state
  const [newObsContext, setNewObsContext] = useState<string>('General Classroom Learning')
  const [newObsContent, setNewObsContent] = useState<string>('')
  const [newObsStrategy, setNewObsStrategy] = useState<string>('')
  const [newObsFollowUp, setNewObsFollowUp] = useState<string>('')
  const [obsDate, setObsDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isSubmittingObs, setIsSubmittingObs] = useState<boolean>(false)
  const [obsSuccess, setObsSuccess] = useState<boolean>(false)

  const loadData = async () => {
    if (!studentId) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const result = await teacherService.getStudentLearningReport(teacherId, studentId)
      if (result.authorized && result.report) {
        setReport(result.report)
      } else {
        setLoadError(result.error || 'Unable to authorize access to student records.')
      }
    } catch (err: any) {
      setLoadError(err?.message || 'Failed to load consolidated student profile.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && studentId) {
      loadData()
    }
  }, [isOpen, studentId, teacherId])

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !newObsContent.trim()) return

    setIsSubmittingObs(true)
    try {
      const res = teacherService.addStudentObservation(teacherId, studentId, {
        observationDate: obsDate,
        activityContext: newObsContext,
        observedContent: newObsContent.trim(),
        strategyTried: newObsStrategy.trim(),
        followUpNotes: newObsFollowUp.trim(),
      })

      if (res.success) {
        setObsSuccess(true)
        setNewObsContent('')
        setNewObsStrategy('')
        setNewObsFollowUp('')
        await loadData()
        onObservationAdded?.()
        setTimeout(() => setObsSuccess(false), 3000)
      }
    } finally {
      setIsSubmittingObs(false)
    }
  }

  if (!isOpen || !studentId) return null

  const student = report?.student
  const progress = report?.progress

  // Calculate Level Statuses: Completed, In-Progress, Not-Yet-Started
  const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
  let completedLevelsTotal = 0
  let inProgressLevelsTotal = 0
  let notStartedLevelsTotal = 0

  const levelDetailsByWorld: Record<
    WorldId,
    {
      completed: Array<{ levelNumber: number; title: string; stars: number; date?: string }>
      inProgress: Array<{ levelNumber: number; title: string; completedTasks: number }>
      notStarted: Array<{ levelNumber: number; title: string }>
    }
  > = {
    writing: { completed: [], inProgress: [], notStarted: [] },
    speaking: { completed: [], inProgress: [], notStarted: [] },
    visual: { completed: [], inProgress: [], notStarted: [] },
    social: { completed: [], inProgress: [], notStarted: [] },
  }

  if (progress) {
    worldIds.forEach((wId) => {
      const wProg = progress.worlds?.[wId]
      const records = wProg?.levelRecords || {}
      for (let lvl = 1; lvl <= 50; lvl++) {
        const rec = records[lvl]
        const lvlMeta = curriculumService.getLevel(wId, lvl)
        const lvlTitle = lvlMeta?.title || `Level ${lvl}`

        if (rec && rec.completed) {
          levelDetailsByWorld[wId].completed.push({
            levelNumber: lvl,
            title: lvlTitle,
            stars: rec.starsEarned || 3,
            date: rec.completedAt || rec.lastAttemptAt,
          })
          completedLevelsTotal++
        } else if (rec && (rec.completedTasks > 0 || (rec.completedTaskIds && rec.completedTaskIds.length > 0))) {
          levelDetailsByWorld[wId].inProgress.push({
            levelNumber: lvl,
            title: lvlTitle,
            completedTasks: rec.completedTasks || rec.completedTaskIds?.length || 1,
          })
          inProgressLevelsTotal++
        } else {
          levelDetailsByWorld[wId].notStarted.push({
            levelNumber: lvl,
            title: lvlTitle,
          })
          notStartedLevelsTotal++
        }
      }
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consolidated-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl my-6 bg-[#0e0520] border-2 border-[#ff2a85]/60 rounded-3xl shadow-[0_0_50px_rgba(255,42,133,0.25)] text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#a855f7]/30 bg-[#160a33] flex items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#0e0520] border-2 border-[#ff2a85]/60 flex items-center justify-center shrink-0 p-1 shadow-[0_0_15px_rgba(255,42,133,0.35)]">
              <CompanionAvatar id={student?.avatarId || 'panda'} size="md" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="consolidated-profile-title" className="text-xl sm:text-2xl font-extrabold font-fredoka text-white">
                  {student?.displayName || 'Student Profile'}
                </h2>
                <span className="font-mono text-xs font-bold bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40 px-2 py-0.5 rounded">
                  {student?.registrationNumber || 'ID'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#10b981]/20 px-2 py-0.5 rounded-full border border-[#10b981]/40">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Enrolled &amp; Active</span>
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-1">
                Classroom: <span className="text-white font-bold">{student?.className || 'Grade 3 Classroom'}</span> ({student?.classCode}) &bull; Last Activity: {student?.lastActiveAt ? new Date(student.lastActiveAt).toLocaleString() : 'Recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/teacher/students/${studentId}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#160a33] border border-[#a855f7]/40 text-[#f5d0fe] hover:text-white hover:border-[#ff2a85] transition-all"
              title="Open full page student report"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#160a33] border border-[#a855f7]/40 text-purple-200 hover:text-white hover:bg-[#ff2a85]/20 transition-all"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-[#a855f7]/25 bg-[#120729] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'progress', label: '4 Worlds Progress' },
            { id: 'levels', label: `Levels Breakdown (${completedLevelsTotal}/200)` },
            { id: 'tasks', label: `Task Attempts (${report?.taskAttempts?.length || 0})` },
            { id: 'sessions', label: `Sessions (${report?.sessions?.length || 0})` },
            { id: 'observations', label: `Observations (${report?.observations?.length || 0})` },
            { id: 'recommendations', label: 'Recommendations' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#ff2a85] text-white bg-[#ff2a85]/10 shadow-[0_0_10px_rgba(255,42,133,0.2)]'
                  : 'border-transparent text-purple-200/70 hover:text-white hover:border-[#a855f7]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#ff2a85] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-purple-200">Loading student curriculum records...</p>
            </div>
          ) : loadError ? (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <p className="text-sm font-bold">{loadError}</p>
              <button
                type="button"
                onClick={loadData}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Retry
              </button>
            </div>
          ) : report ? (
            <>
              {/* TAB 1: 4 WORLDS PROGRESS */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  {/* Top Aggregate Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#ffd700]/40 text-center">
                      <div className="text-2xl font-extrabold text-[#ffd700]">
                        {report.rewardSummary.totalStars}
                      </div>
                      <div className="text-[11px] font-bold text-amber-200/80">Bloom Stars</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#00f5ff]/40 text-center">
                      <div className="text-2xl font-extrabold text-[#00f5ff]">
                        {report.rewardSummary.totalCompletedLevels} / 200
                      </div>
                      <div className="text-[11px] font-bold text-cyan-200/80">Completed Levels</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#ff2a85]/40 text-center">
                      <div className="text-2xl font-extrabold text-[#ff2a85]">
                        {inProgressLevelsTotal}
                      </div>
                      <div className="text-[11px] font-bold text-pink-200/80">In-Progress Levels</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#a855f7]/40 text-center">
                      <div className="text-2xl font-extrabold text-[#c084fc]">
                        {report.rewardSummary.earnedBadges.length}
                      </div>
                      <div className="text-[11px] font-bold text-purple-200/80">Earned Badges</div>
                    </div>
                  </div>

                  {/* 4 World Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {worldIds.map((wId) => {
                      const summary = report.worldSummaries[wId]
                      const meta = curriculumWorlds[wId]
                      const pct = Math.round((summary.completedLevels / 50) * 100)
                      return (
                        <div
                          key={wId}
                          className="p-4 rounded-2xl border border-[#a855f7]/40 bg-[#160a33] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {wId === 'writing' && <BookOpen className="w-5 h-5 text-[#ff2a85]" />}
                              {wId === 'speaking' && <Mic className="w-5 h-5 text-[#ff007f]" />}
                              {wId === 'visual' && <Eye className="w-5 h-5 text-[#00f5ff]" />}
                              {wId === 'social' && <HeartHandshake className="w-5 h-5 text-[#ffd700]" />}
                              <span className="font-extrabold text-sm text-white">{meta.title}</span>
                            </div>
                            <span className="text-xs font-bold text-[#ffd700]">
                              {summary.completedLevels}/50 Levels ({pct}%)
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-[#0e0520] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00f5ff] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-purple-200/80">
                            <span>Current: Level {summary.currentLevelNumber}</span>
                            <span>{summary.completedLevels * 3} Stars</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Demonstrated Successes */}
                  <div className="p-4 rounded-2xl bg-[#160a33] border border-[#10b981]/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#10b981] uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Demonstrated Learning Successes</span>
                    </div>
                    <ul className="space-y-1 text-xs text-purple-200/90 list-disc list-inside">
                      {report.demonstratedSuccesses.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: LEVELS BREAKDOWN (COMPLETED, IN-PROGRESS, NOT-STARTED) */}
              {activeTab === 'levels' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 text-center">
                      <span className="text-lg font-black text-[#10b981]">{completedLevelsTotal}</span>
                      <p className="text-[11px] font-bold text-emerald-200">Completed Levels</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/40 text-center">
                      <span className="text-lg font-black text-[#ffd700]">{inProgressLevelsTotal}</span>
                      <p className="text-[11px] font-bold text-amber-200">In-Progress</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center">
                      <span className="text-lg font-black text-purple-200">{notStartedLevelsTotal}</span>
                      <p className="text-[11px] font-bold text-purple-300">Not Yet Started</p>
                    </div>
                  </div>

                  {worldIds.map((wId) => {
                    const data = levelDetailsByWorld[wId]
                    const meta = curriculumWorlds[wId]
                    return (
                      <div key={wId} className="p-4 rounded-2xl border border-[#a855f7]/30 bg-[#160a33] space-y-3">
                        <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
                          <span>{meta.title}</span>
                          <span className="text-xs text-[#00f5ff] font-mono">
                            {data.completed.length} completed &bull; {data.inProgress.length} in progress
                          </span>
                        </h3>

                        {/* Completed badges */}
                        {data.completed.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                              Completed:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {data.completed.map((c) => (
                                <span
                                  key={c.levelNumber}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#10b981]/20 border border-[#10b981]/40 text-emerald-300"
                                >
                                  <span>L{c.levelNumber}: {c.title}</span>
                                  <span className="text-[#ffd700]">★{c.stars}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* In-progress badges */}
                        {data.inProgress.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd700]">
                              In Progress:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {data.inProgress.map((ip) => (
                                <span
                                  key={ip.levelNumber}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ffd700]/20 border border-[#ffd700]/40 text-amber-300"
                                >
                                  <span>L{ip.levelNumber}: {ip.title}</span>
                                  <span className="text-xs">({ip.completedTasks}/5 tasks)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 3: TASK ATTEMPTS & ANSWERS */}
              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
                      Recorded Task Attempts &amp; Modal Responses ({report.taskAttempts?.length || 0})
                    </h3>
                  </div>

                  {report.taskAttempts?.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 text-center text-xs text-purple-200">
                      No granular task attempts logged yet for this learner.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#a855f7]/30">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#160a33] text-purple-200 border-b border-[#a855f7]/30 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Task ID</th>
                            <th className="p-3">World &amp; Level</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Result</th>
                            <th className="p-3">Hints</th>
                            <th className="p-3">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#a855f7]/20 bg-[#0e0520]">
                          {report.taskAttempts.map((attempt) => (
                            <tr key={attempt.id} className="hover:bg-[#160a33]/60">
                              <td className="p-3 font-mono font-bold text-white">{attempt.task_id}</td>
                              <td className="p-3 uppercase text-[#00f5ff]">{attempt.world_id} L{attempt.level_number}</td>
                              <td className="p-3 capitalize">{attempt.task_type.replace('_', ' ')}</td>
                              <td className="p-3">
                                {attempt.is_correct ? (
                                  <span className="text-[#10b981] font-bold">Correct</span>
                                ) : (
                                  <span className="text-[#ff2a85] font-bold">Needs Review</span>
                                )}
                              </td>
                              <td className="p-3">{attempt.hints_used || 0}</td>
                              <td className="p-3 text-purple-200/80 font-mono text-[11px]">
                                {new Date(attempt.created_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SESSIONS & TIME SPENT */}
              {activeTab === 'sessions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
                      Verified Learning Sessions ({report.sessions?.length || 0})
                    </h3>
                  </div>

                  {report.sessions?.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 text-center text-xs text-purple-200">
                      No explicit session records logged yet. Sessions track active learning vs portal time automatically.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {report.sessions.map((sess) => {
                        const activeMins = Math.round(sess.active_learning_seconds / 60)
                        const portalMins = Math.round(sess.portal_seconds / 60)
                        return (
                          <div
                            key={sess.id}
                            className="p-3.5 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {new Date(sess.session_start).toLocaleDateString()} at{' '}
                                  {new Date(sess.session_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff]">
                                  {sess.status}
                                </span>
                              </div>
                              <p className="text-purple-200/70 text-[11px] mt-0.5">
                                Duration: {Math.round(sess.duration_seconds / 60)} mins &bull; Device: {sess.device_info || 'Web browser'}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 font-semibold">
                              <span className="text-emerald-400">Active: {activeMins}m</span>
                              <span className="text-purple-300">Portal: {portalMins}m</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: OBSERVATIONS & SUPPORT */}
              {activeTab === 'observations' && (
                <div className="space-y-6">
                  {/* Observation Form */}
                  <form
                    onSubmit={handleAddObservation}
                    className="p-4 rounded-2xl bg-[#160a33] border border-[#a855f7]/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-[#ff2a85]" />
                        <span>Record Pedagogical Observation</span>
                      </h4>
                      <input
                        type="date"
                        value={obsDate}
                        onChange={(e) => setObsDate(e.target.value)}
                        className="text-xs bg-[#0e0520] border border-[#a855f7]/40 rounded-lg px-2 py-1 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-purple-200 mb-1">
                          Activity Context
                        </label>
                        <input
                          type="text"
                          value={newObsContext}
                          onChange={(e) => setNewObsContext(e.target.value)}
                          placeholder="e.g. Writing World - Letter Tracing"
                          className="w-full text-xs p-2 rounded-xl bg-[#0e0520] border border-[#a855f7]/40 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-purple-200 mb-1">
                          Strategy Tested (Optional)
                        </label>
                        <input
                          type="text"
                          value={newObsStrategy}
                          onChange={(e) => setNewObsStrategy(e.target.value)}
                          placeholder="e.g. Visual card cueing"
                          className="w-full text-xs p-2 rounded-xl bg-[#0e0520] border border-[#a855f7]/40 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-purple-200 mb-1">
                        Factual Observation Notes
                      </label>
                      <textarea
                        value={newObsContent}
                        onChange={(e) => setNewObsContent(e.target.value)}
                        placeholder="Direct factual observations of student activity (non-diagnostic)..."
                        rows={2}
                        className="w-full text-xs p-2 rounded-xl bg-[#0e0520] border border-[#a855f7]/40 text-white"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {obsSuccess ? (
                        <span className="text-xs text-[#10b981] font-bold">Observation saved!</span>
                      ) : <span />}
                      <button
                        type="submit"
                        disabled={isSubmittingObs || !newObsContent.trim()}
                        className="btn-neon-pink min-h-[36px] px-4 py-1.5 rounded-xl text-xs font-bold"
                      >
                        {isSubmittingObs ? 'Saving...' : 'Save Observation'}
                      </button>
                    </div>
                  </form>

                  {/* Past Observations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
                      Documented Observations ({report.observations.length})
                    </h4>
                    {report.observations.length === 0 ? (
                      <p className="text-xs text-purple-200/70 p-4 rounded-xl bg-[#160a33] text-center">
                        No observations recorded yet. Use the form above to add an observation.
                      </p>
                    ) : (
                      report.observations.map((obs) => (
                        <div
                          key={obs.id}
                          className="p-4 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between text-purple-200/80">
                            <span className="font-bold text-white">{obs.activityContext}</span>
                            <span className="font-mono text-[11px]">{obs.observationDate}</span>
                          </div>
                          <p className="text-purple-100">{obs.observedContent}</p>
                          {obs.strategyTried && (
                            <p className="text-amber-300 font-medium">
                              Strategy: {obs.strategyTried}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: RECOMMENDATIONS */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  {report.primaryAdaptiveRecommendation ? (
                    <div className="p-4 rounded-2xl bg-[#160a33] border-2 border-[#ffd700]/50 space-y-2 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
                      <div className="flex items-center gap-2 text-xs font-black text-[#ffd700] uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4" />
                        <span>Adaptive Recommendation ({report.primaryAdaptiveRecommendation.skillTitle})</span>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {report.primaryAdaptiveRecommendation.recommendationText}
                      </p>
                      <p className="text-xs text-purple-200/80">
                        Evidence: {report.primaryAdaptiveRecommendation.triggeringEvidence}
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
                      Grounded Support Suggestions
                    </h4>
                    {report.suggestions.map((sug) => (
                      <div
                        key={sug.id}
                        className="p-3.5 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 space-y-1.5 text-xs"
                      >
                        <div className="font-bold text-white">{sug.activityArea}</div>
                        <p className="text-purple-200">{sug.suggestion}</p>
                        <p className="text-[11px] text-purple-300/70">
                          Rationale: {sug.strategyRationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#a855f7]/30 bg-[#160a33] flex items-center justify-between gap-4 shrink-0">
          <Link
            to={`/teacher/students/${studentId}`}
            className="text-xs font-bold text-[#00f5ff] hover:underline flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Dedicated Student Report Page</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold btn-neon-purple"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  )
}
