import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Star, RefreshCw, CloudCheck, HardDrive, Sparkles } from 'lucide-react'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import { progressionService } from '../services/progression.service'
import { sessionTrackingService } from '../services/sessionTracking.service'
import { TaskPlayer } from '../components/TaskPlayer'
import { WorldScene } from '../components/worlds/WorldScene'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
import { useAuth } from '../contexts/AuthContext'
import type { AccessibilityContextType } from '../layouts/RootLayout'
import type { WorldId, BadgeDefinition } from '../types/curriculum.types'

export const LevelPlayerPage: React.FC = () => {
  const { worldId, levelNumber } = useParams<{ worldId: string; levelNumber: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Safely consume accessibility context if available
  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false
  const largeFont = accessibility?.largeFont ?? false
  const reducedMotion = accessibility?.reducedMotion ?? false
  const soundEnabled = accessibility?.soundEnabled ?? true

  const parsedWorldId = (worldId || 'writing') as WorldId
  const parsedLevelNum = parseInt(levelNumber || '1', 10)

  const level = curriculumService.getLevel(parsedWorldId, parsedLevelNum)
  const studentId = user?.id || 'demo_student'
  const persistenceInfo = progressionService.getPersistenceInfo(studentId)

  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false)
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<BadgeDefinition[]>([])
  const [totalStars, setTotalStars] = useState<number>(() => progressionService.getTotalStars(studentId))

  // Restore previously completed tasks if child navigated away and returned
  useEffect(() => {
    if (!level) return

    const record = progressionService.getLevelRecord(parsedWorldId, parsedLevelNum, studentId)
    if (record && record.completedTaskIds && record.completedTaskIds.length > 0) {
      setCompletedTaskIds(record.completedTaskIds)

      // If all 5 were already completed, student is replaying or reviewing
      if (record.completedTaskIds.length >= 5) {
        setIsLevelFinished(false)
        setCurrentTaskIndex(0)
      } else {
        // Resume at first incomplete task
        const nextIncompleteIdx = level.tasks.findIndex(
          (t) => !record.completedTaskIds?.includes(t.id)
        )
        if (nextIncompleteIdx !== -1) {
          setCurrentTaskIndex(nextIncompleteIdx)
        }
      }
    } else {
      setCompletedTaskIds([])
      setCurrentTaskIndex(0)
      setIsLevelFinished(false)
    }
  }, [parsedWorldId, parsedLevelNum, studentId, level])

  // Set active learning session mode while on the level player page
  useEffect(() => {
    sessionTrackingService.setActivityMode('learning')
    return () => {
      sessionTrackingService.setActivityMode('portal')
    }
  }, [])

  if (!level) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-fredoka text-white">Level Not Found</h2>
        <p className="text-sm text-purple-200/80">This adventure level is not available yet.</p>
        <Link
          to={`/student/map?world=${parsedWorldId}`}
          className="btn-neon-pink min-h-[48px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          Return to Adventure Map
        </Link>
      </div>
    )
  }

  const currentTask = level.tasks[currentTaskIndex]

  const handleTaskCompleted = (taskId: string) => {
    // Persist individual task completion with duplicate submission protection
    const recordResult = progressionService.recordTaskCompletion(
      parsedWorldId,
      parsedLevelNum,
      taskId,
      studentId
    )

    setCompletedTaskIds(recordResult.completedTaskIds)

    // Log granular task attempt to database if authenticated
    if (studentId && studentId !== 'demo_student') {
      void sessionTrackingService.recordTaskAttempt({
        student_id: studentId,
        world_id: parsedWorldId,
        level_number: parsedLevelNum,
        task_id: taskId,
        task_type: currentTask?.data?.type || 'multiple_choice',
        is_correct: true,
        score: 100,
        hints_used: 0,
        retry_count: 0,
      })
    }

    if (currentTaskIndex + 1 < level.tasks.length) {
      setCurrentTaskIndex((prev) => prev + 1)
    } else {
      // All 5 tasks completed! Award 3 stars and evaluate milestone badges
      const completionResult = progressionService.completeLevel(parsedWorldId, parsedLevelNum, 5, 3, studentId)
      setNewlyUnlockedBadges(completionResult.newlyUnlockedBadges || [])
      setTotalStars(completionResult.totalStars || progressionService.getTotalStars(studentId))
      setIsLevelFinished(true)
    }
  }

  const handleReplay = () => {
    setCurrentTaskIndex(0)
    setCompletedTaskIds([])
    setNewlyUnlockedBadges([])
    setIsLevelFinished(false)
  }

  const handleNextLevel = () => {
    if (parsedLevelNum < 50) {
      navigate(`/student/play/${parsedWorldId}/${parsedLevelNum + 1}`)
    } else {
      navigate(`/student/map?world=${parsedWorldId}`)
    }
  }

  return (
    <div className="relative min-h-[85vh] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden rounded-3xl">
      {/* Immersive World Scene Background Layer */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none scale-105">
        <WorldScene worldId={parsedWorldId} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#06020e]/95 via-[#0e0520]/90 to-[#06020e]/95 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to={`/student/map?world=${parsedWorldId}`}
            className="min-h-[46px] inline-flex items-center gap-2 text-sm font-extrabold text-pink-300 hover:text-white bg-[#0e0520]/80 border border-[#a855f7]/40 hover:border-[#ff2a85]/60 px-4 py-2 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Exit to Map</span>
          </Link>

          {/* Persistence Indicator & Task Dots */}
          <div className="flex items-center gap-3">
            <div
              title={persistenceInfo.description}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                persistenceInfo.isCloudSynced
                  ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/50'
                  : 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/50'
              }`}
            >
              {persistenceInfo.isCloudSynced ? (
                <CloudCheck className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <HardDrive className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{persistenceInfo.statusLabel}</span>
            </div>

            {/* Task Step Dots */}
            <div className="flex items-center gap-1.5" role="navigation" aria-label="Task progress">
              {level.tasks.map((t, idx) => {
                const isTaskDone = completedTaskIds.includes(t.id)
                const isCurrent = idx === currentTaskIndex && !isLevelFinished
                return (
                  <div
                    key={t.id}
                    className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center transition-all ${
                      isTaskDone
                        ? 'bg-[#00f5ff] text-[#06020e] font-bold shadow-[0_0_10px_#00f5ff]'
                        : isCurrent
                        ? 'bg-[#ff2a85] text-white ring-2 ring-[#ff2a85]/50 shadow-[0_0_12px_#ff2a85]'
                        : 'bg-[#160a33] border border-[#a855f7]/40 text-purple-300'
                    }`}
                    aria-label={`Task ${idx + 1}: ${isTaskDone ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}`}
                  >
                    {isTaskDone ? '✓' : idx + 1}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Level Header Banner */}
        <div
          className={`p-5 sm:p-7 rounded-3xl border-2 space-y-2 relative overflow-hidden ${
            highContrast
              ? 'bg-black border-pink-400 text-white'
              : 'bg-[#0e0520]/90 border-[#a855f7]/40 text-white shadow-[0_0_30px_rgba(168,85,247,0.15)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-0.5 rounded-full font-extrabold uppercase tracking-wide bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/50">
                Level {level.levelNumber} &bull; {level.bandTitle}
              </span>
              <span className="text-xs text-purple-200/80 font-semibold">
                Task {currentTaskIndex + 1} of 5
              </span>
            </div>
            <CompanionAvatar id={parsedWorldId} size="sm" />
          </div>

          <h1
            className={`font-extrabold font-fredoka text-white ${
              largeFont ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {level.title}
          </h1>
          <p className={`font-medium text-purple-200/90 ${largeFont ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
            {level.objective}
          </p>
        </div>

        {/* Interactive Task Player or Celebratory Level Completion Card */}
        {!isLevelFinished && currentTask ? (
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 ${
              highContrast
                ? 'bg-black border-pink-400'
                : 'bg-[#0e0520]/90 border-[#ff2a85]/40 shadow-[0_0_30px_rgba(255,42,133,0.15)]'
            }`}
          >
            <TaskPlayer
              key={currentTask.id}
              task={currentTask}
              onTaskCompleted={handleTaskCompleted}
              soundEnabled={soundEnabled}
              highContrast={highContrast}
              largeFont={largeFont}
              reducedMotion={reducedMotion}
            />
          </div>
        ) : (
          /* Celebratory Completion Screen - Remaining inside the active world scene! */
          <div
            className={`p-8 sm:p-12 rounded-3xl border-2 text-center space-y-6 relative overflow-hidden ${
              highContrast
                ? 'bg-black border-[#ffd700] text-white'
                : 'bg-[#0e0520]/95 border-[#ffd700]/70 text-white shadow-[0_0_50px_rgba(255,215,0,0.25)]'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ffd700]/20 via-[#ff2a85]/15 to-transparent blur-3xl pointer-events-none" />

            <div className="flex justify-center relative z-10">
              <CompanionAvatar id={parsedWorldId} size="lg" className="ring-4 ring-[#ffd700] shadow-[0_0_30px_#ffd700] scale-110" />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-center gap-2 text-[#ffd700]">
                <Star className="w-10 h-10 fill-[#ffd700] drop-shadow-[0_0_12px_#ffd700]" />
                <Star className="w-10 h-10 fill-[#ffd700] drop-shadow-[0_0_12px_#ffd700]" />
                <Star className="w-10 h-10 fill-[#ffd700] drop-shadow-[0_0_12px_#ffd700]" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#160a33] border border-[#ffd700]/60 text-xs font-extrabold text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <span>3 Bloom Stars Earned &bull; Total: {totalStars} Stars</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-white">
                Level {level.levelNumber} Complete!
              </h2>
              <p className="text-sm sm:text-base font-medium max-w-md mx-auto text-purple-200/90 leading-relaxed">
                Outstanding work! You completed all 5 tasks and brought radiant magical bloom to this realm! 🌸
              </p>
            </div>

            {/* Newly Unlocked Milestone Badge Showcase */}
            {newlyUnlockedBadges.length > 0 && (
              <div
                role="status"
                className="p-5 rounded-2xl border-2 border-[#ff2a85]/60 bg-[#160a33] max-w-md mx-auto text-left flex items-start gap-3.5 shadow-[0_0_25px_rgba(255,42,133,0.25)] relative z-10"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ff2a85]/20 text-[#ffd700] flex items-center justify-center shrink-0 text-2xl font-bold border border-[#ff2a85]/50 shadow-[0_0_15px_#ff2a85]">
                  🏆
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/15 px-2.5 py-0.5 rounded-full border border-[#ffd700]/40">
                    Achievement Unlocked!
                  </span>
                  <h3 className="font-extrabold text-base text-white">
                    {newlyUnlockedBadges[0].title}
                  </h3>
                  <p className="text-xs text-purple-200/80 font-medium">
                    {newlyUnlockedBadges[0].description}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-wrap justify-center gap-4 relative z-10">
              {parsedLevelNum < 50 ? (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="btn-neon-pink min-h-[48px] px-8 py-3.5 rounded-2xl font-extrabold text-base"
                >
                  Next Level →
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/50 text-xs font-bold">
                  🎉 You have reached the pinnacle of this World!
                </div>
              )}

              <button
                type="button"
                onClick={handleReplay}
                className="min-h-[48px] px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#160a33] text-purple-200 border-2 border-[#a855f7]/50 hover:border-[#ff2a85] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1.5" />
                <span>Replay Level</span>
              </button>

              <Link
                to={`/student/map?world=${parsedWorldId}`}
                className="min-h-[48px] inline-flex items-center px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#0e0520] text-purple-200 border border-[#a855f7]/40 hover:border-[#ff2a85] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
              >
                Back to Map
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
