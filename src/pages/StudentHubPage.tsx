import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { progressionService } from '../services/progression.service'
import { sessionTrackingService } from '../services/sessionTracking.service'
import { curriculumService, curriculumWorlds } from '../data/curriculum/curriculumGenerator'
import { BadgeCard } from '../components/BadgeCard'
import type { AccessibilityContextType } from '../layouts/RootLayout'
import type { WorldId, StudentCurriculumProgress } from '../types/curriculum.types'
import {
  Sparkles,
  LogOut,
  ArrowRight,
  BookOpen,
  Mic,
  Eye,
  HeartHandshake,
  MapPin,
  Trophy,
  Star,
  Award,
  Play,
  Compass,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

interface ResumeTarget {
  worldId: WorldId
  levelNumber: number
  levelTitle: string
  levelObjective: string
  worldTitle: string
  isReplay: boolean
}

function calculateResumeTarget(progress: StudentCurriculumProgress): ResumeTarget {
  const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
  let mostRecentAttempt: { worldId: WorldId; levelNumber: number; date: Date } | null = null

  // 1. Scan for the most recently attempted level across all worlds
  for (const wId of worldIds) {
    const worldProg = progress.worlds?.[wId]
    if (worldProg?.levelRecords) {
      for (const [lvlStr, rec] of Object.entries(worldProg.levelRecords)) {
        if (rec.lastAttemptAt) {
          const attemptDate = new Date(rec.lastAttemptAt)
          if (
            !mostRecentAttempt ||
            attemptDate > mostRecentAttempt.date ||
            (attemptDate.getTime() === mostRecentAttempt.date.getTime() && Number(lvlStr) > mostRecentAttempt.levelNumber)
          ) {
            mostRecentAttempt = {
              worldId: wId,
              levelNumber: Number(lvlStr),
              date: attemptDate,
            }
          }
        }
      }
    }
  }

  let targetWorld: WorldId = 'writing'
  let targetLevel = 1
  let isReplay = false

  if (mostRecentAttempt) {
    targetWorld = mostRecentAttempt.worldId
    const rec = progress.worlds[targetWorld]?.levelRecords?.[mostRecentAttempt.levelNumber]
    if (rec && !rec.completed) {
      targetLevel = mostRecentAttempt.levelNumber
    } else {
      const current = progress.worlds[targetWorld]?.currentLevelNumber || 1
      targetLevel = Math.min(50, Math.max(1, current))
      if (progress.worlds[targetWorld]?.completedLevelNumbers?.includes(targetLevel)) {
        isReplay = true
      }
    }
  } else {
    // If no attempts, pick the first world that has unfinished levels
    for (const wId of worldIds) {
      const wProg = progress.worlds?.[wId]
      const completed = wProg?.completedLevelNumbers?.length || 0
      if (completed < 50) {
        targetWorld = wId
        targetLevel = wProg?.currentLevelNumber || 1
        break
      }
    }
  }

  const worldMeta = curriculumWorlds[targetWorld]
  const levelMeta = curriculumService.getLevel(targetWorld, targetLevel)

  return {
    worldId: targetWorld,
    levelNumber: targetLevel,
    levelTitle: levelMeta?.title || `Level ${targetLevel}`,
    levelObjective: levelMeta?.objective || 'Explore magical challenges and light up your realm!',
    worldTitle: worldMeta?.title || 'Learning World',
    isReplay,
  }
}

export const StudentHubPage: React.FC = () => {
  const { profile, user, logout } = useAuth()
  const navigate = useNavigate()

  // Safely read accessibility settings
  const accessibility = useOutletContext<AccessibilityContextType | undefined>()
  const highContrast = accessibility?.highContrast ?? false
  const reducedMotion = accessibility?.reducedMotion ?? false

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [_refreshCount, setRefreshCount] = useState<number>(0)

  // Badge filter tab state: 'all' | 'earned' | 'in_progress'
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'in_progress'>('all')

  const studentId = user?.id || 'demo_student'
  const progress = progressionService.getProgress(studentId)
  const rewardSummary = progressionService.getRewardSummary(studentId)

  const writingSummary = progressionService.getWorldSummary('writing', progress)
  const speakingSummary = progressionService.getWorldSummary('speaking', progress)
  const visualSummary = progressionService.getWorldSummary('visual', progress)
  const socialSummary = progressionService.getWorldSummary('social', progress)

  const resumeTarget = calculateResumeTarget(progress)

  useEffect(() => {
    sessionTrackingService.setActivityMode('portal')
  }, [])

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  const handleRefreshGarden = () => {
    setIsLoading(true)
    setHasError(false)
    setTimeout(() => {
      setRefreshCount((c) => c + 1)
      setIsLoading(false)
    }, 400)
  }

  const avatarMap: Record<string, string> = {
    lion: '🦁',
    panda: '🐼',
    fox: '🦊',
    dolphin: '🐬',
  }

  const avatarEmoji = profile?.avatar_id ? avatarMap[profile.avatar_id] || '🌟' : '🌟'

  // Filtered badges count
  const displayedBadgesCount =
    badgeFilter === 'all'
      ? rewardSummary.earnedBadges.length + rewardSummary.lockedBadges.length
      : badgeFilter === 'earned'
      ? rewardSummary.earnedBadges.length
      : rewardSummary.lockedBadges.length

  const worldCards = [
    {
      id: 'writing' as WorldId,
      title: 'Magic Amusement Park',
      subtitle: 'Letters, spelling & roller coaster tracks',
      icon: BookOpen,
      summary: writingSummary,
      accentBorder: 'border-[#ff2a85]/50',
      accentGlow: 'shadow-[0_0_20px_rgba(255,42,133,0.15)]',
      accentBg: 'bg-[#ff2a85]/20',
      accentText: 'text-[#ff2a85]',
      progressBarColor: 'bg-gradient-to-r from-[#ff2a85] to-[#f43f5e]',
      btnClass: 'btn-neon-pink',
    },
    {
      id: 'speaking' as WorldId,
      title: 'Magic Food World',
      subtitle: 'Sounds, recipes & candy bakery kitchens',
      icon: Mic,
      summary: speakingSummary,
      accentBorder: 'border-[#a855f7]/50',
      accentGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      accentBg: 'bg-[#a855f7]/20',
      accentText: 'text-[#c084fc]',
      progressBarColor: 'bg-gradient-to-r from-[#a855f7] to-[#c084fc]',
      btnClass: 'btn-neon-purple',
    },
    {
      id: 'visual' as WorldId,
      title: 'Magic Space World',
      subtitle: 'Planets, nebulae & telescope missions',
      icon: Eye,
      summary: visualSummary,
      accentBorder: 'border-[#00f5ff]/50',
      accentGlow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]',
      accentBg: 'bg-[#00f5ff]/20',
      accentText: 'text-[#00f5ff]',
      progressBarColor: 'bg-gradient-to-r from-[#00f5ff] to-[#38bdf8]',
      btnClass: 'bg-[#00f5ff] text-[#06020e] hover:bg-[#38bdf8] shadow-[0_0_15px_#00f5ff]',
    },
    {
      id: 'social' as WorldId,
      title: 'Magic Animal World',
      subtitle: 'Bioluminescent forest, emotions & teamwork',
      icon: HeartHandshake,
      summary: socialSummary,
      accentBorder: 'border-[#ffd700]/50',
      accentGlow: 'shadow-[0_0_20px_rgba(255,215,0,0.15)]',
      accentBg: 'bg-[#ffd700]/20',
      accentText: 'text-[#ffd700]',
      progressBarColor: 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b]',
      btnClass: 'bg-[#ffd700] text-[#06020e] hover:bg-[#f59e0b] shadow-[0_0_15px_#ffd700]',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Live accessibility status for assistive technologies */}
      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? 'Refreshing your learning progress...'
          : `Student Hub loaded. You have ${rewardSummary.totalStars} stars and ${rewardSummary.totalCompletedLevels} levels completed.`}
      </div>

      {/* Error / Retry Banner if garden refresh failed */}
      {hasError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#160a33] border-2 border-[#ff2a85] text-pink-200 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(255,42,133,0.3)]"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff2a85] shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-semibold">
              We had trouble synchronising your progress. Your stars and levels are safe!
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefreshGarden}
            className="btn-neon-pink min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Student Greeting Banner - Dark Neon */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-black border-pink-400 text-white'
            : 'bg-[#0e0520] border-[#ff2a85]/40 text-white shadow-[0_0_35px_rgba(255,42,133,0.15)]'
        }`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff2a85]/15 via-[#a855f7]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2 border-[#ff2a85]/60 bg-[#160a33] shadow-[0_0_20px_rgba(255,42,133,0.35)]">
              {avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40">
                  Grade 3 Explorer
                </span>
                {profile?.registration_number && (
                  <span className="text-xs font-mono font-bold bg-[#00f5ff]/15 border border-[#00f5ff]/40 px-2 py-0.5 rounded text-[#00f5ff]">
                    {profile.registration_number}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-fredoka mt-1 text-white flex items-center gap-2">
                <span>Welcome back, {profile?.display_name || 'Explorer'}!</span>
                <Sparkles className="w-6 h-6 text-[#ffd700]" />
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-purple-200/80">
                Every star shines with your unique curiosity. Explore the realms and illuminate your path! ✨
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefreshGarden}
              disabled={isLoading}
              title="Refresh adventure progress"
              aria-label="Refresh adventure progress"
              className="min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#160a33] border border-[#a855f7]/40 hover:border-[#ff2a85] text-purple-200 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#ff2a85]' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/student/map"
              className="btn-neon-pink min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold"
            >
              <MapPin className="w-4 h-4 text-white" aria-hidden="true" />
              <span>Adventure Map</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#160a33] border border-[#a855f7]/40 hover:border-[#ff2a85] text-purple-200 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Rewards Metric Banner */}
        <div className="mt-8 pt-6 border-t border-[#a855f7]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <div className="p-4 rounded-2xl border border-[#ffd700]/50 bg-[#160a33] flex items-center gap-3.5 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 text-[#ffd700] flex items-center justify-center shrink-0 border border-[#ffd700]/50 shadow-[0_0_10px_#ffd700]">
              <Star className="w-6 h-6 fill-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#ffd700]">
                {rewardSummary.totalStars}
              </div>
              <div className="text-xs font-bold text-amber-200/80">
                Bloom Stars Earned
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#00f5ff]/50 bg-[#160a33] flex items-center gap-3.5 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-[#00f5ff]/20 text-[#00f5ff] flex items-center justify-center shrink-0 border border-[#00f5ff]/50 shadow-[0_0_10px_#00f5ff]">
              <Trophy className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#00f5ff]">
                {rewardSummary.totalCompletedLevels} / 200
              </div>
              <div className="text-xs font-bold text-cyan-200/80">
                Adventure Levels Conquered
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#ff2a85]/50 bg-[#160a33] flex items-center gap-3.5 shadow-[0_0_20px_rgba(255,42,133,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-[#ff2a85]/20 text-[#ff2a85] flex items-center justify-center shrink-0 border border-[#ff2a85]/50 shadow-[0_0_10px_#ff2a85]">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#ff2a85]">
                {rewardSummary.earnedBadges.length} /{' '}
                {rewardSummary.earnedBadges.length + rewardSummary.lockedBadges.length}
              </div>
              <div className="text-xs font-bold text-pink-200/80">
                Milestones &amp; Badges
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Learning / Continue Adventure Hero Banner */}
      <section
        aria-labelledby="resume-heading"
        className={`border-2 rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all ${
          highContrast
            ? 'bg-black border-[#ffd700] text-white'
            : 'bg-gradient-to-r from-[#0e0520] via-[#160a33] to-[#0e0520] border-[#a855f7]/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/50">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Resume Journey</span>
              </span>
              <span className="text-xs font-bold text-pink-300 bg-[#ff2a85]/20 border border-[#ff2a85]/40 px-2.5 py-0.5 rounded-full">
                {resumeTarget.worldTitle} • Level {resumeTarget.levelNumber}
              </span>
            </div>

            <h2
              id="resume-heading"
              className="text-2xl sm:text-3xl font-extrabold font-fredoka text-white"
            >
              {resumeTarget.levelTitle}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-purple-200/90 leading-relaxed">
              {resumeTarget.levelObjective}
            </p>

            <p className="text-xs text-[#00f5ff] flex items-center gap-1.5 pt-1">
              <span>🌸</span>
              <span>Take your time! Learning is an adventure you can pause anytime.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to={`/student/play/${resumeTarget.worldId}/${resumeTarget.levelNumber}`}
              className="btn-neon-pink min-h-[48px] px-6 py-3 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2"
              aria-label={`Continue playing ${resumeTarget.worldTitle} Level ${resumeTarget.levelNumber}`}
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>{resumeTarget.isReplay ? 'Play Again' : 'Continue Playing'}</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>

            <Link
              to={`/student/map?world=${resumeTarget.worldId}`}
              className="min-h-[48px] px-5 py-3 rounded-2xl border-2 border-[#a855f7]/50 text-purple-200 hover:text-white hover:border-[#ff2a85] bg-[#160a33] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>View World Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Consistent World Progress Summaries Grid */}
      <section aria-labelledby="worlds-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="worlds-heading"
            className="text-xl sm:text-2xl font-extrabold font-fredoka text-white flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span>Your Four Magical Realms</span>
          </h2>
          <span className="text-xs text-purple-300 font-bold">50 Levels Per World</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {worldCards.map(
            ({ id, title, subtitle, icon: Icon, summary, accentBorder, accentGlow, accentBg, accentText, progressBarColor, btnClass }) => (
              <div
                key={id}
                className={`p-5 rounded-2xl bg-[#0e0520] border-2 ${accentBorder} ${accentGlow} flex flex-col justify-between gap-4 transition-all`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl ${accentBg} ${accentText} border ${accentBorder}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{title}</h3>
                      <p className="text-xs text-purple-200/80 font-medium">{subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${accentBg} ${accentText} border ${accentBorder}`}
                  >
                    Level {summary.currentLevelNumber}
                  </span>
                </div>

                {/* Progress Bar & Summary */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                    <span>{summary.completedLevels} of 50 Levels Conquered</span>
                    <span className={accentText}>{summary.percentage}% Complete</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={summary.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${title} progress: ${summary.percentage}%`}
                    className="w-full h-3 rounded-full bg-[#06020e] overflow-hidden border border-[#a855f7]/30"
                  >
                    <div
                      className={`h-full rounded-full ${
                        reducedMotion ? 'transition-none' : 'transition-all duration-500'
                      } ${progressBarColor}`}
                      style={{ width: `${Math.max(summary.completedLevels > 0 ? 5 : 0, summary.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#a855f7]/20">
                  <Link
                    to={`/student/play/${id}/${summary.currentLevelNumber}`}
                    className={`min-h-[44px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-colors ${btnClass}`}
                    aria-label={`Jump into ${title} Level ${summary.currentLevelNumber}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Play Level {summary.currentLevelNumber}</span>
                  </Link>

                  <Link
                    to={`/student/map?world=${id}`}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#a855f7]/40 hover:border-[#ff2a85] bg-[#160a33] text-purple-200 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    aria-label={`View map for ${title}`}
                  >
                    <span>Map</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Badges & Achievements Gallery */}
      <section aria-labelledby="badges-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2
              id="badges-heading"
              className="text-xl sm:text-2xl font-extrabold font-fredoka text-white flex items-center gap-2"
            >
              <Award className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
              <span>Your Bloom Achievements</span>
            </h2>
            <p className="text-xs text-purple-200/80 font-semibold mt-0.5">
              Badges celebrate your unique curiosity, practice, and adventure steps!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#160a33] border border-[#a855f7]/30">
            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                badgeFilter === 'all'
                  ? 'bg-[#ff2a85] text-white shadow-[0_0_10px_#ff2a85]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              All Badges ({rewardSummary.earnedBadges.length + rewardSummary.lockedBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('earned')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                badgeFilter === 'earned'
                  ? 'bg-[#ffd700] text-[#06020e] shadow-[0_0_10px_#ffd700]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Unlocked ({rewardSummary.earnedBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('in_progress')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                badgeFilter === 'in_progress'
                  ? 'bg-[#00f5ff] text-[#06020e] shadow-[0_0_10px_#00f5ff]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              In Progress ({rewardSummary.lockedBadges.length})
            </button>
          </div>
        </div>

        {/* Friendly Empty State when no badges match the filter */}
        {displayedBadgesCount === 0 && (
          <div className="p-8 rounded-3xl border-2 border-dashed border-[#a855f7]/40 bg-[#0e0520] text-center space-y-3">
            <div className="text-4xl" aria-hidden="true">
              🌱
            </div>
            <h3 className="text-lg font-extrabold text-white font-fredoka">
              {badgeFilter === 'earned' ? 'Your First Badge Is Waiting!' : 'All Badges Blossomed!'}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-purple-200/80 max-w-md mx-auto">
              {badgeFilter === 'earned'
                ? 'Explore any learning world above to complete your first task and earn your very first flower badge!'
                : 'Incredible work! You have blossomed through every milestone in the kingdom!'}
            </p>
            <div className="pt-2">
              <Link
                to={`/student/play/${resumeTarget.worldId}/${resumeTarget.levelNumber}`}
                className="btn-neon-pink inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Start Your Adventure</span>
              </Link>
            </div>
          </div>
        )}

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Earned Badges */}
          {(badgeFilter === 'all' || badgeFilter === 'earned') &&
            rewardSummary.earnedBadges.map(({ badge, unlockedAt }) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={true}
                unlockedAt={unlockedAt}
                highContrast={highContrast}
              />
            ))}

          {/* Locked / In Progress Badges */}
          {(badgeFilter === 'all' || badgeFilter === 'in_progress') &&
            rewardSummary.lockedBadges.map(({ badge, progressCount, targetCount, percentage }) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={false}
                progressCount={progressCount}
                targetCount={targetCount}
                percentage={percentage}
                highContrast={highContrast}
              />
            ))}
        </div>
      </section>
    </div>
  )
}

export default StudentHubPage
