import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, RefreshCw } from 'lucide-react'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import { progressionService } from '../services/progression.service'
import { TaskPlayer } from '../components/TaskPlayer'
import { useAuth } from '../contexts/AuthContext'
import type { WorldId } from '../types/curriculum.types'

export const LevelPlayerPage: React.FC = () => {
  const { worldId, levelNumber } = useParams<{ worldId: string; levelNumber: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const parsedWorldId = (worldId || 'writing') as WorldId
  const parsedLevelNum = parseInt(levelNumber || '1', 10)

  const level = curriculumService.getLevel(parsedWorldId, parsedLevelNum)
  const studentId = user?.id || 'demo_student'

  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false)

  if (!level) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-fredoka text-[#24483D]">Level Not Found</h2>
        <p className="text-sm text-[#3D6355]">This adventure level is not available yet.</p>
        <Link
          to={`/student/map?world=${parsedWorldId}`}
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] font-bold text-sm"
        >
          Return to Adventure Map
        </Link>
      </div>
    )
  }

  const currentTask = level.tasks[currentTaskIndex]

  const handleTaskCompleted = (taskId: string) => {
    const updated = [...completedTaskIds, taskId]
    setCompletedTaskIds(updated)

    if (currentTaskIndex + 1 < level.tasks.length) {
      setCurrentTaskIndex((prev) => prev + 1)
    } else {
      // All 5 tasks completed!
      progressionService.completeLevel(parsedWorldId, parsedLevelNum, 5, 3, studentId)
      setIsLevelFinished(true)
    }
  }

  const handleReplay = () => {
    setCurrentTaskIndex(0)
    setCompletedTaskIds([])
    setIsLevelFinished(false)
  }

  const handleNextLevel = () => {
    if (parsedLevelNum < 50) {
      navigate(`/student/play/${parsedWorldId}/${parsedLevelNum + 1}`)
      setCurrentTaskIndex(0)
      setCompletedTaskIds([])
      setIsLevelFinished(false)
    } else {
      navigate(`/student/map?world=${parsedWorldId}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/student/map?world=${parsedWorldId}`}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-extrabold text-[#24483D] hover:text-[#16563F] bg-white border border-[rgba(36,72,61,0.15)] px-4 py-2 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Exit to Map</span>
        </Link>

        {/* Task Step Dots */}
        <div className="flex items-center gap-2">
          {level.tasks.map((t, idx) => (
            <div
              key={t.id}
              className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center transition-all ${
                idx < currentTaskIndex || completedTaskIds.includes(t.id)
                  ? 'bg-[#CDEFE0] text-[#16563F] font-bold'
                  : idx === currentTaskIndex
                  ? 'bg-[#24483D] text-[#FFFDF7] ring-2 ring-[#CDEFE0]'
                  : 'bg-white border border-[rgba(36,72,61,0.2)] text-[#3D6355]'
              }`}
              title={`Task ${idx + 1} of 5`}
            >
              {idx < currentTaskIndex || completedTaskIds.includes(t.id) ? '✓' : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Level Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-[rgba(36,72,61,0.12)] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8DEFF] text-[#4A248A] font-extrabold uppercase tracking-wide">
            Level {level.levelNumber} &bull; {level.bandTitle}
          </span>
          <span className="text-xs text-[#3D6355] font-semibold">
            Task {currentTaskIndex + 1} of 5
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
          {level.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#3D6355] font-medium">{level.objective}</p>
      </div>

      {/* Interactive Task Player or Celebratory Level Completion Card */}
      {!isLevelFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[rgba(36,72,61,0.12)] shadow-xs">
          <TaskPlayer
            key={currentTask.id}
            task={currentTask}
            onTaskCompleted={handleTaskCompleted}
          />
        </div>
      ) : (
        /* Celebratory Completion Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#B2E6CE] text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#CDEFE0] text-[#16563F] flex items-center justify-center text-4xl shadow-xs">
            🌸
          </div>

          <div className="space-y-2">
            <div className="flex justify-center gap-1 text-[#8A6400]">
              <Star className="w-8 h-8 fill-[#FFF0B3]" />
              <Star className="w-8 h-8 fill-[#FFF0B3]" />
              <Star className="w-8 h-8 fill-[#FFF0B3]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
              Level {level.levelNumber} Complete!
            </h2>
            <p className="text-sm sm:text-base text-[#3D6355] font-medium max-w-md mx-auto">
              Outstanding work! You finished all 5 tasks and helped your learning garden grow.
            </p>
          </div>

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
              className="min-h-[48px] px-6 py-3.5 rounded-2xl font-bold text-sm bg-white text-[#24483D] border-2 border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6] transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline-block mr-1.5" />
              <span>Replay Level</span>
            </button>

            <Link
              to={`/student/map?world=${parsedWorldId}`}
              className="min-h-[48px] inline-flex items-center px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#FFFDF7] text-[#3D6355] border border-[rgba(36,72,61,0.15)] hover:bg-[#F2FAF6] transition-colors"
            >
              Back to Map
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
