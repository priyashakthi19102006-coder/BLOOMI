import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Star,
  Info,
  BookOpen,
  Mic,
  Eye,
  HeartHandshake,
} from 'lucide-react'
import { curriculumWorlds } from '../data/curriculum/curriculumGenerator'
import { progressionService } from '../services/progression.service'
import { useAuth } from '../contexts/AuthContext'
import type { WorldId, InstructionalBand, LevelStatus } from '../types/curriculum.types'

export const AdventureMapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Active world from URL query or default to 'writing'
  const activeWorldId = (searchParams.get('world') as WorldId) || 'writing'
  const currentWorld = curriculumWorlds[activeWorldId] || curriculumWorlds.writing

  // Active student progress
  const studentId = user?.id || 'demo_student'
  const progress = progressionService.getProgress(studentId)
  const worldSummary = progressionService.getWorldSummary(activeWorldId, progress)

  const handleSelectWorld = (wId: WorldId) => {
    setSearchParams({ world: wId })
  }

  // World color styling map
  const worldTabStyles: Record<
    WorldId,
    { activeBg: string; activeText: string; borderColor: string; icon: React.ReactNode }
  > = {
    writing: {
      activeBg: 'bg-[#FFE0CC]',
      activeText: 'text-[#7A3300]',
      borderColor: 'border-[#F8D2B8]',
      icon: <BookOpen className="w-4 h-4" aria-hidden="true" />,
    },
    speaking: {
      activeBg: 'bg-[#E8DEFF]',
      activeText: 'text-[#4A248A]',
      borderColor: 'border-[#D5C2FE]',
      icon: <Mic className="w-4 h-4" aria-hidden="true" />,
    },
    visual: {
      activeBg: 'bg-[#CDEFE0]',
      activeText: 'text-[#16563F]',
      borderColor: 'border-[#B2E6CE]',
      icon: <Eye className="w-4 h-4" aria-hidden="true" />,
    },
    social: {
      activeBg: 'bg-[#FFF0B3]',
      activeText: 'text-[#664B00]',
      borderColor: 'border-[#FCE58D]',
      icon: <HeartHandshake className="w-4 h-4" aria-hidden="true" />,
    },
  }

  // Group levels into 5 bands
  const bands: { key: InstructionalBand; title: string; range: [number, number] }[] = [
    { key: 'explore', title: 'Band 1: Explore (Levels 1–10)', range: [1, 10] },
    { key: 'connect', title: 'Band 2: Connect (Levels 11–20)', range: [11, 20] },
    { key: 'build', title: 'Band 3: Build (Levels 21–30)', range: [21, 30] },
    { key: 'apply', title: 'Band 4: Apply (Levels 31–40)', range: [31, 40] },
    { key: 'master', title: 'Band 5: Master & Generalise (Levels 41–50)', range: [41, 50] },
  ]

  const handleLevelClick = (levelNumber: number, status: LevelStatus) => {
    if (status === 'locked') return
    navigate(`/student/play/${activeWorldId}/${levelNumber}`)
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Top Navigation & Hub Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/student/hub"
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-extrabold text-[#24483D] hover:text-[#16563F] bg-white border border-[rgba(36,72,61,0.15)] px-4 py-2.5 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-3 focus:ring-[#24483D]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Student Hub</span>
        </Link>

        {/* Demo Mode or Sync Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFFBE6] border border-[#FCE58D] text-xs font-bold text-[#664B00]">
          <Info className="w-4 h-4 text-[#8A6400] shrink-0" aria-hidden="true" />
          <span>
            {progress.isDemo ? 'Demo Mode (Session Progress Active)' : 'Cloud Progress Synced'}
          </span>
        </div>
      </div>

      {/* World Selector Tabs */}
      <nav aria-label="Learning Worlds Map Navigation">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(curriculumWorlds) as WorldId[]).map((wId) => {
            const world = curriculumWorlds[wId]
            const summary = progressionService.getWorldSummary(wId, progress)
            const style = worldTabStyles[wId]
            const isCurrent = activeWorldId === wId

            return (
              <button
                key={wId}
                type="button"
                onClick={() => handleSelectWorld(wId)}
                className={`min-h-[64px] p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                  isCurrent
                    ? `${style.activeBg} ${style.activeText} ${style.borderColor} shadow-xs scale-[1.02]`
                    : 'bg-white border-[rgba(36,72,61,0.12)] text-[#24483D] hover:bg-[#F2FAF6]'
                }`}
                aria-pressed={isCurrent}
                aria-label={`${world.title}: ${summary.completedLevels} of 50 levels completed`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{world.title}</span>
                  {style.icon}
                </div>
                <div className="text-[11px] font-bold opacity-80 mt-1">
                  {summary.completedLevels} / 50 Completed
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Active World Overview Banner */}
      <section
        aria-labelledby="world-banner-title"
        className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[rgba(36,72,61,0.15)] shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#16563F] font-extrabold uppercase">
                50 Adventure Levels
              </span>
              <span className="text-xs text-[#3D6355] font-semibold">5 Tasks Per Level</span>
            </div>
            <h1 id="world-banner-title" className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D] mt-1">
              {currentWorld.title} &bull; {currentWorld.subtitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#3D6355] font-medium">
              {currentWorld.description}
            </p>
          </div>

          <div className="w-full sm:w-64 bg-[#FFFDF7] p-4 rounded-2xl border border-[rgba(36,72,61,0.12)] space-y-1.5 shrink-0">
            <div className="flex justify-between text-xs font-bold text-[#24483D]">
              <span>Progress</span>
              <span>
                {worldSummary.completedLevels} of {worldSummary.totalLevels} ({worldSummary.percentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-[rgba(36,72,61,0.1)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#24483D] transition-all duration-500 rounded-full"
                style={{ width: `${worldSummary.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 50 Levels Grouped into 5 Instructional Bands */}
      <div className="space-y-8">
        {bands.map((band) => {
          const bandLevels = currentWorld.levels.filter(
            (lvl) => lvl.levelNumber >= band.range[0] && lvl.levelNumber <= band.range[1]
          )

          return (
            <section
              key={band.key}
              aria-labelledby={`band-${band.key}-title`}
              className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[rgba(36,72,61,0.12)] shadow-xs space-y-5"
            >
              <div className="border-b border-[rgba(36,72,61,0.08)] pb-3 flex items-center justify-between">
                <div>
                  <h2
                    id={`band-${band.key}-title`}
                    className="text-lg sm:text-xl font-extrabold font-fredoka text-[#24483D]"
                  >
                    {band.title}
                  </h2>
                  <p className="text-xs text-[#3D6355] font-medium">
                    Sequential mastery path for Grade 3 learners
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-[#8A6400]" aria-hidden="true" />
              </div>

              {/* Grid of Level Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {bandLevels.map((level) => {
                  const status = progressionService.getLevelStatus(activeWorldId, level.levelNumber, progress)
                  const isAvailable = status === 'available'
                  const isCompleted = status === 'completed'
                  const isLocked = status === 'locked'

                  return (
                    <button
                      key={level.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleLevelClick(level.levelNumber, status)}
                      className={`min-h-[96px] p-3 rounded-2xl border-2 flex flex-col justify-between text-left transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                        isCompleted
                          ? 'bg-[#F2FAF6] border-[#B2E6CE] hover:border-[#24483D] cursor-pointer shadow-xs'
                          : isAvailable
                          ? 'bg-white border-[#24483D] hover:bg-[#F2FAF6] ring-2 ring-[#CDEFE0] cursor-pointer shadow-xs scale-102'
                          : 'bg-[#F5F4F0] border-[rgba(36,72,61,0.1)] text-[#3D6355]/50 cursor-not-allowed opacity-60'
                      }`}
                      aria-label={`Level ${level.levelNumber}: ${level.title}. Status: ${status}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                            isCompleted
                              ? 'bg-[#CDEFE0] text-[#16563F]'
                              : isAvailable
                              ? 'bg-[#24483D] text-[#FFFDF7]'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {level.levelNumber}
                        </span>

                        {isCompleted && (
                          <div className="flex items-center text-[#8A6400]" title="3 Stars Earned">
                            <Star className="w-4 h-4 fill-[#FFF0B3]" />
                          </div>
                        )}

                        {isAvailable && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#CDEFE0] text-[#16563F]">
                            Play
                          </span>
                        )}

                        {isLocked && (
                          <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        )}
                      </div>

                      <div className="mt-2">
                        <h3 className="font-extrabold text-xs text-[#24483D] line-clamp-1">
                          {level.title}
                        </h3>
                        <p className="text-[10px] text-[#3D6355] line-clamp-1 font-medium mt-0.5">
                          {isCompleted ? 'Replay available' : isAvailable ? 'Current level' : 'Complete previous'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
