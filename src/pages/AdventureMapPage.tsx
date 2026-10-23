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
import { WorldScene } from '../components/worlds/WorldScene'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
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
  const persistenceInfo = progressionService.getPersistenceInfo(studentId)
  const totalStars = progressionService.getTotalStars(studentId)

  const handleSelectWorld = (wId: WorldId) => {
    setSearchParams({ world: wId })
  }

  // World color styling map with neon accents
  const worldTabStyles: Record<
    WorldId,
    { activeBg: string; activeText: string; activeBorder: string; icon: React.ReactNode; glowColor: string }
  > = {
    writing: {
      activeBg: 'bg-[#ff2a85]/20',
      activeText: 'text-[#ff2a85]',
      activeBorder: 'border-[#ff2a85] shadow-[0_0_20px_rgba(255,42,133,0.35)]',
      icon: <BookOpen className="w-4 h-4 text-[#ff2a85]" aria-hidden="true" />,
      glowColor: '#ff2a85',
    },
    speaking: {
      activeBg: 'bg-[#a855f7]/20',
      activeText: 'text-[#c084fc]',
      activeBorder: 'border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      icon: <Mic className="w-4 h-4 text-[#c084fc]" aria-hidden="true" />,
      glowColor: '#a855f7',
    },
    visual: {
      activeBg: 'bg-[#00f5ff]/20',
      activeText: 'text-[#00f5ff]',
      activeBorder: 'border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.35)]',
      icon: <Eye className="w-4 h-4 text-[#00f5ff]" aria-hidden="true" />,
      glowColor: '#00f5ff',
    },
    social: {
      activeBg: 'bg-[#ffd700]/20',
      activeText: 'text-[#ffd700]',
      activeBorder: 'border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)]',
      icon: <HeartHandshake className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />,
      glowColor: '#ffd700',
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

  const activeStyle = worldTabStyles[activeWorldId]

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Top Navigation & Hub Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/student/hub"
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-extrabold text-pink-300 hover:text-white bg-[#0e0520] border border-[#a855f7]/40 hover:border-[#ff2a85]/60 px-4 py-2.5 rounded-2xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Student Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#160a33] border border-[#ffd700]/60 text-xs font-extrabold text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Star className="w-3.5 h-3.5 fill-[#ffd700]" aria-hidden="true" />
            <span>{totalStars} Bloom Stars</span>
          </div>

          {/* Persistence Indicator */}
          <div
            title={persistenceInfo.description}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
              persistenceInfo.isCloudSynced
                ? 'bg-[#00f5ff]/15 border-[#00f5ff]/50 text-[#00f5ff]'
                : 'bg-[#ffd700]/15 border-[#ffd700]/50 text-[#ffd700]'
            }`}
          >
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{persistenceInfo.statusLabel}</span>
          </div>
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
                className={`min-h-[64px] p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                  isCurrent
                    ? `${style.activeBg} ${style.activeText} ${style.activeBorder} scale-[1.02]`
                    : 'bg-[#0e0520] border-[#a855f7]/30 text-purple-200 hover:border-[#ff2a85]/50 hover:bg-[#160a33]'
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

      {/* Active World Overview Banner with Illustrated World Artwork */}
      <section
        aria-labelledby="world-banner-title"
        className={`rounded-3xl bg-[#0e0520] border-2 ${activeStyle.activeBorder} shadow-xs overflow-hidden`}
      >
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/6] bg-[#06020e] overflow-hidden">
          <WorldScene worldId={activeWorldId} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0520] via-transparent to-transparent pointer-events-none" />

          {/* Floating Companion Avatar in Banner */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-[#160a33]/90 backdrop-blur-md p-2 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#ff2a85]/40">
            <CompanionAvatar id={activeWorldId} size="md" />
            <div className="pr-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-300 block">
                Guide Companion
              </span>
              <span className="text-xs font-black text-white">
                {activeWorldId === 'writing' && 'Barnaby Bear'}
                {activeWorldId === 'speaking' && 'Pip Bunny'}
                {activeWorldId === 'social' && 'Koa Panda'}
                {activeWorldId === 'visual' && 'Nova Star Fox'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40 font-extrabold uppercase">
                  50 Adventure Levels
                </span>
                <span className="text-xs text-purple-200/80 font-semibold">5 Tasks Per Level</span>
              </div>
              <h1 id="world-banner-title" className="text-2xl sm:text-3xl font-extrabold font-fredoka text-white mt-1">
                {currentWorld.title} &bull; {currentWorld.subtitle}
              </h1>
              <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
                {currentWorld.description}
              </p>
            </div>

            <div className="w-full sm:w-64 bg-[#160a33] p-4 rounded-2xl border border-[#a855f7]/40 space-y-2 shrink-0">
              <div className="flex justify-between text-xs font-bold text-white">
                <span className="text-purple-200">World Progress</span>
                <span className="font-mono text-[#00f5ff]">
                  {worldSummary.completedLevels} / {worldSummary.totalLevels} ({worldSummary.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#06020e] rounded-full overflow-hidden border border-[#a855f7]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00f5ff] transition-all duration-500 rounded-full shadow-[0_0_10px_#ff2a85]"
                  style={{ width: `${worldSummary.percentage}%` }}
                />
              </div>
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
              className="p-6 sm:p-8 rounded-3xl bg-[#0e0520] border-2 border-[#a855f7]/30 shadow-xs space-y-5"
            >
              <div className="border-b border-[#a855f7]/20 pb-3 flex items-center justify-between">
                <div>
                  <h2
                    id={`band-${band.key}-title`}
                    className="text-lg sm:text-xl font-extrabold font-fredoka text-white"
                  >
                    {band.title}
                  </h2>
                  <p className="text-xs text-purple-200/70 font-medium">
                    Sequential mastery path for Grade 3 learners
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
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
                      className={`min-h-[96px] p-3 rounded-2xl border-2 flex flex-col justify-between text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                        isCompleted
                          ? 'bg-[#160a33] border-[#ffd700]/60 hover:border-[#ffd700] cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.15)]'
                          : isAvailable
                          ? 'bg-[#ff2a85]/15 border-[#ff2a85] hover:bg-[#ff2a85]/25 cursor-pointer shadow-[0_0_20px_rgba(255,42,133,0.35)] scale-102 ring-2 ring-[#ff2a85]/40'
                          : 'bg-[#06020e]/80 border-[#a855f7]/20 text-purple-300/40 cursor-not-allowed opacity-50'
                      }`}
                      aria-label={`Level ${level.levelNumber}: ${level.title}. Status: ${status}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center font-mono ${
                            isCompleted
                              ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/60'
                              : isAvailable
                              ? 'bg-[#ff2a85] text-white shadow-[0_0_8px_#ff2a85]'
                              : 'bg-[#160a33] text-purple-400'
                          }`}
                        >
                          {level.levelNumber}
                        </span>

                        {isCompleted && (
                          <div className="flex items-center text-[#ffd700]" title="3 Stars Earned">
                            <Star className="w-4 h-4 fill-[#ffd700]" />
                          </div>
                        )}

                        {isAvailable && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#ff2a85] text-white shadow-[0_0_6px_#ff2a85]">
                            Play
                          </span>
                        )}

                        {isLocked && (
                          <Lock className="w-3.5 h-3.5 text-purple-400/50" aria-hidden="true" />
                        )}
                      </div>

                      <div className="mt-2">
                        <h3 className={`font-extrabold text-xs line-clamp-1 ${isLocked ? 'text-purple-300/40' : 'text-white'}`}>
                          {level.title}
                        </h3>
                        <p className="text-[10px] text-purple-200/70 line-clamp-1 font-medium mt-0.5">
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
