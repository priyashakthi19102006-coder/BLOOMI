import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Star, RefreshCw, CloudCheck, HardDrive } from 'lucide-react'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import { progressionService } from '../services/progression.service'
import { TaskPlayer } from '../components/TaskPlayer'
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

  if (!level) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-fredoka text-[#24483D]">Level Not Found</h2>
        <p className="text-sm text-[#3D6355]">This adventure level is not available yet.</p>
        <Link
          to={`/student/map?world=${parsedWorldId}`}
          className="min-h-[48px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] font-bold text-sm"
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
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to={`/student/map?world=${parsedWorldId}`}
          className="min-h-[46px] inline-flex items-center gap-2 text-sm font-extrabold text-[#24483D] hover:text-[#16563F] bg-white border border-[rgba(36,72,61,0.15)] px-4 py-2 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Exit to Map</span>
        </Link>

        {/* Persistence Indicator */}
        <div className="flex items-center gap-3">
          <div
            title={persistenceInfo.description}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              persistenceInfo.isCloudSynced
                ? 'bg-[#CDEFE0] text-[#16563F] border border-[#B2E6CE]'
                : 'bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D]'
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
                      ? 'bg-[#CDEFE0] text-[#16563F] font-bold shadow-xs'
                      : isCurrent
                      ? 'bg-[#24483D] text-[#FFFDF7] ring-2 ring-[#CDEFE0]'
                      : 'bg-white border border-[rgba(36,72,61,0.2)] text-[#3D6355]'
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
        className={`p-5 sm:p-7 rounded-3xl border-2 shadow-xs space-y-2 ${
          highContrast
            ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-white border-[rgba(36,72,61,0.12)] text-[#24483D]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-0.5 rounded-full font-extrabold uppercase tracking-wide ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#0C1210]'
                : 'bg-[#E8DEFF] text-[#4A248A]'
            }`}
          >
            Level {level.levelNumber} &bull; {level.bandTitle}
          </span>
          <span className="text-xs text-[#3D6355] font-semibold dark:text-[#D3E5DC]">
            Task {currentTaskIndex + 1} of 5
          </span>
        </div>
        <h1
          className={`font-extrabold font-fredoka ${
            largeFont ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          {level.title}
        </h1>
        <p className={`font-medium ${largeFont ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'} opacity-90`}>
          {level.objective}
        </p>
      </div>

      {/* Interactive Task Player or Celebratory Level Completion Card */}
      {!isLevelFinished && currentTask ? (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xs ${
            highContrast
              ? 'bg-[#0C1210] border-[#3D6355]'
              : 'bg-white border-[rgba(36,72,61,0.12)]'
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
        /* Celebratory Completion Screen */
        <div
          className={`p-8 sm:p-12 rounded-3xl border-2 text-center space-y-6 shadow-sm ${
            highContrast
              ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
              : 'bg-white border-[#B2E6CE] text-[#24483D]'
          }`}
        >
          <div className="flex justify-center">
            <CompanionAvatar id={parsedWorldId} size="lg" className="ring-4 ring-amber-300 shadow-lg scale-110" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-center gap-1.5 text-[#8A6400]">
              <Star className="w-9 h-9 fill-[#FFF0B3] text-[#8A6400]" />
              <Star className="w-9 h-9 fill-[#FFF0B3] text-[#8A6400]" />
              <Star className="w-9 h-9 fill-[#FFF0B3] text-[#8A6400]" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFBE6] border border-[#FCE58D] text-xs font-extrabold text-[#664B00]">
              <Star className="w-4 h-4 fill-[#FCE58D]" aria-hidden="true" />
              <span>3 Bloom Stars Earned &bull; Total: {totalStars} Stars</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka">
              Level {level.levelNumber} Complete!
            </h2>
            <p className="text-sm sm:text-base font-medium max-w-md mx-auto opacity-90">
              Outstanding work! You completed all 5 tasks and helped your learning garden grow. Every flower blooms in its own time! 🌸
            </p>
          </div>

          {/* Newly Unlocked Milestone Badge Showcase */}
          {newlyUnlockedBadges.length > 0 && (
            <div
              role="status"
              className={`p-4 sm:p-5 rounded-2xl border-2 max-w-md mx-auto text-left flex items-start gap-3.5 shadow-xs ${
                highContrast
                  ? 'bg-[#152E26] border-[#FFF0B3] text-[#FFFDF7]'
                  : 'bg-[#FFF9F5] border-[#F8D2B8] text-[#24483D]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFE0CC] text-[#7A3300] flex items-center justify-center shrink-0 text-2xl font-bold border border-[#F8D2B8]">
                🌸
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A3300] bg-[#FFF0B3] px-2.5 py-0.5 rounded-full">
                  Achievement Unlocked!
                </span>
                <h3 className="font-extrabold text-base text-[#24483D] dark:text-[#FFFDF7]">
                  {newlyUnlockedBadges[0].title}
                </h3>
                <p className="text-xs text-[#3D6355] dark:text-[#D3E5DC] font-medium">
                  {newlyUnlockedBadges[0].description}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {parsedLevelNum < 50 ? (
              <button
                type="button"
                onClick={handleNextLevel}
                className="min-h-[48px] px-8 py-3.5 rounded-2xl font-extrabold text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
              >
                Next Level →
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-[#FFFBE6] text-[#664B00] text-xs font-bold">
                🎉 You have reached the pinnacle of this World!
              </div>
            )}

            <button
              type="button"
              onClick={handleReplay}
              className="min-h-[48px] px-6 py-3.5 rounded-2xl font-bold text-sm bg-white text-[#24483D] border-2 border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6] transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
            >
              <RefreshCw className="w-4 h-4 inline-block mr-1.5" />
              <span>Replay Level</span>
            </button>

            <Link
              to={`/student/map?world=${parsedWorldId}`}
              className="min-h-[48px] inline-flex items-center px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#FFFDF7] text-[#3D6355] border border-[rgba(36,72,61,0.15)] hover:bg-[#F2FAF6] transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
            >
              Back to Map
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
