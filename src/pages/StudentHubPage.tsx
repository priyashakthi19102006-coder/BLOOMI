import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { progressionService } from '../services/progression.service'
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
    levelObjective: levelMeta?.objective || 'Explore fun tasks and bloom your garden!',
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
      title: 'Writing World',
      subtitle: 'Letters, spelling & word garden',
      icon: BookOpen,
      summary: writingSummary,
      accentBorder: 'border-[#F8D2B8]',
      accentBg: 'bg-[#FFF5EE]',
      accentText: 'text-[#7A3300]',
      progressBarColor: 'bg-[#7A3300]',
    },
    {
      id: 'speaking' as WorldId,
      title: 'Speaking World',
      subtitle: 'Sounds, listening & echo rhymes',
      icon: Mic,
      summary: speakingSummary,
      accentBorder: 'border-[#D5C2FE]',
      accentBg: 'bg-[#F7F4FF]',
      accentText: 'text-[#4A248A]',
      progressBarColor: 'bg-[#4A248A]',
    },
    {
      id: 'visual' as WorldId,
      title: 'Visual Discovery',
      subtitle: 'Matching, sequences & prism puzzles',
      icon: Eye,
      summary: visualSummary,
      accentBorder: 'border-[#B2E6CE]',
      accentBg: 'bg-[#F0FAF5]',
      accentText: 'text-[#16563F]',
      progressBarColor: 'bg-[#16563F]',
    },
    {
      id: 'social' as WorldId,
      title: 'Social Adventure',
      subtitle: 'Emotions, cooperation & choices',
      icon: HeartHandshake,
      summary: socialSummary,
      accentBorder: 'border-[#FCE58D]',
      accentBg: 'bg-[#FFFBE6]',
      accentText: 'text-[#664B00]',
      progressBarColor: 'bg-[#664B00]',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Live accessibility status for assistive technologies */}
      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? 'Refreshing your learning garden...'
          : `Student Hub loaded. You have ${rewardSummary.totalStars} stars and ${rewardSummary.totalCompletedLevels} levels completed.`}
      </div>

      {/* Error / Retry Banner if garden refresh failed */}
      {hasError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FFF5EE] border-2 border-[#F8D2B8] text-[#7A3300] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-semibold">
              We had trouble loading your garden. No worries — your stars and levels are safe!
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefreshGarden}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#7A3300] text-white text-xs font-bold hover:bg-[#5C2700] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#7A3300]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Student Greeting Banner */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors ${
          highContrast
            ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFFFF] border-[#F8D2B8] text-[#24483D]'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-3xl shadow-xs flex items-center justify-center text-4xl border-2 ${
                highContrast
                  ? 'bg-[#152E26] border-[#FFF0B3]'
                  : 'bg-[#FFF5EE] border-[#F8D2B8]'
              }`}
            >
              {avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    highContrast
                      ? 'bg-[#FFF0B3] text-[#0C1210]'
                      : 'bg-[#FFE0CC] text-[#7A3300]'
                  }`}
                >
                  Grade 3 Explorer
                </span>
                {profile?.registration_number && (
                  <span className="text-xs font-mono font-bold bg-[#F2FAF6] border border-[#B2E6CE] px-2 py-0.5 rounded text-[#16563F]">
                    {profile.registration_number}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-fredoka mt-1">
                Welcome back, {profile?.display_name || 'Explorer'}!
              </h1>
              <p
                className={`text-xs sm:text-sm font-semibold ${
                  highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
                }`}
              >
                Every flower blooms in its own time. Explore your worlds and watch your garden grow! 🌸
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefreshGarden}
              disabled={isLoading}
              title="Refresh garden progress"
              aria-label="Refresh garden progress"
              className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#24483D] ${
                highContrast
                  ? 'bg-[#152E26] border border-[#3D6355] text-[#FFFDF7] hover:bg-[#24483D]'
                  : 'bg-[#FFFDF7] hover:bg-[#F2FAF6] border border-[rgba(36,72,61,0.2)] text-[#24483D]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/student/map"
              className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] text-xs sm:text-sm font-extrabold shadow-xs transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CDEFE0]"
            >
              <MapPin className="w-4 h-4 text-[#CDEFE0]" aria-hidden="true" />
              <span>Adventure Map</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#24483D] ${
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

        {/* Rewards Metric Banner */}
        <div className="mt-8 pt-6 border-t border-[rgba(36,72,61,0.12)] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              highContrast
                ? 'bg-[#152E26] border-[#3D6355]'
                : 'bg-[#FFFBE6] border-[#FCE58D]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF0B3] text-[#8A6400] flex items-center justify-center shrink-0 shadow-xs">
              <Star className="w-6 h-6 fill-[#FFF0B3]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#664B00] dark:text-[#FFF0B3]">
                {rewardSummary.totalStars}
              </div>
              <div className="text-xs font-bold text-[#8A6400] dark:text-[#D3E5DC]">
                Bloom Stars Earned
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              highContrast
                ? 'bg-[#152E26] border-[#3D6355]'
                : 'bg-[#F0FAF5] border-[#B2E6CE]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#CDEFE0] text-[#16563F] flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#16563F] dark:text-[#CDEFE0]">
                {rewardSummary.totalCompletedLevels} / 200
              </div>
              <div className="text-xs font-bold text-[#3D6355] dark:text-[#D3E5DC]">
                Adventure Levels Blossomed
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              highContrast
                ? 'bg-[#152E26] border-[#3D6355]'
                : 'bg-[#FFF5EE] border-[#F8D2B8]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFE0CC] text-[#7A3300] flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#7A3300] dark:text-[#FFE0CC]">
                {rewardSummary.earnedBadges.length} /{' '}
                {rewardSummary.earnedBadges.length + rewardSummary.lockedBadges.length}
              </div>
              <div className="text-xs font-bold text-[#7A3300] dark:text-[#D3E5DC]">
                Milestones &amp; Badges
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 08: Resume Learning / Continue Adventure Hero Banner */}
      <section
        aria-labelledby="resume-heading"
        className={`border-2 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all ${
          highContrast
            ? 'bg-[#152E26] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-gradient-to-r from-[#F0FAF5] via-[#FFFDF7] to-[#FFF5EE] border-[#B2E6CE] text-[#24483D]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider ${
                  highContrast
                    ? 'bg-[#FFF0B3] text-[#0C1210]'
                    : 'bg-[#CDEFE0] text-[#16563F]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Resume Learning</span>
              </span>
              <span className="text-xs font-bold text-[#7A3300] bg-[#FFE0CC] px-2.5 py-0.5 rounded-full">
                {resumeTarget.worldTitle} • Level {resumeTarget.levelNumber}
              </span>
            </div>

            <h2
              id="resume-heading"
              className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D] dark:text-[#FFFDF7]"
            >
              {resumeTarget.levelTitle}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-[#3D6355] dark:text-[#D3E5DC]">
              {resumeTarget.levelObjective}
            </p>

            <p className="text-xs italic text-[#16563F] dark:text-[#CDEFE0] flex items-center gap-1.5 pt-1">
              <span>🌸</span>
              <span>Take your time! Learning is an adventure you can pause anytime.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to={`/student/play/${resumeTarget.worldId}/${resumeTarget.levelNumber}`}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#24483D] hover:bg-[#152E26] text-[#FFFDF7] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#24483D] focus-visible:ring-offset-2"
              aria-label={`Continue playing ${resumeTarget.worldTitle} Level ${resumeTarget.levelNumber}`}
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>{resumeTarget.isReplay ? 'Play Again' : 'Continue Playing'}</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>

            <Link
              to={`/student/map?world=${resumeTarget.worldId}`}
              className={`min-h-[48px] px-5 py-3 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#24483D] focus-visible:ring-offset-2 ${
                highContrast
                  ? 'border-[#FFF0B3] text-[#FFF0B3] hover:bg-[#0C1210]'
                  : 'border-[#24483D] text-[#24483D] bg-white hover:bg-[#F2FAF6]'
              }`}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>View World Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STAGE 08: Consistent World Progress Summaries Grid */}
      <section aria-labelledby="worlds-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="worlds-heading"
            className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#24483D] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#8A6400]" aria-hidden="true" />
            <span>Your Four Learning Worlds</span>
          </h2>
          <span className="text-xs text-[#3D6355] font-bold">50 Levels Per World</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {worldCards.map(
            ({ id, title, subtitle, icon: Icon, summary, accentBorder, accentBg, accentText, progressBarColor }) => (
              <div
                key={id}
                className={`p-5 rounded-2xl bg-white border-2 ${accentBorder} shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl ${accentBg} ${accentText} border ${accentBorder}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#24483D]">{title}</h3>
                      <p className="text-xs text-[#3D6355] font-medium">{subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accentBg} ${accentText} border ${accentBorder}`}
                  >
                    Level {summary.currentLevelNumber}
                  </span>
                </div>

                {/* Progress Bar & Summary */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3D6355]">
                    <span>{summary.completedLevels} of 50 Levels Blossomed</span>
                    <span className={accentText}>{summary.percentage}% Complete</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={summary.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${title} progress: ${summary.percentage}%`}
                    className="w-full h-3 rounded-full bg-[rgba(36,72,61,0.08)] overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full ${
                        reducedMotion ? 'transition-none' : 'transition-all duration-500'
                      } motion-reduce:transition-none ${progressBarColor}`}
                      style={{ width: `${Math.max(summary.completedLevels > 0 ? 5 : 0, summary.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center gap-2 pt-2 border-t border-[rgba(36,72,61,0.08)]">
                  <Link
                    to={`/student/play/${id}/${summary.currentLevelNumber}`}
                    className="min-h-[44px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#24483D] hover:bg-[#152E26] text-[#FFFDF7] text-xs font-extrabold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#24483D]"
                    aria-label={`Jump into ${title} Level ${summary.currentLevelNumber}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Play Level {summary.currentLevelNumber}</span>
                  </Link>

                  <Link
                    to={`/student/map?world=${id}`}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border border-[rgba(36,72,61,0.2)] text-[#24483D] hover:bg-[#F2FAF6] text-xs font-bold flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#24483D]`}
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
              className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#24483D] flex items-center gap-2"
            >
              <Award className="w-6 h-6 text-[#7A3300]" aria-hidden="true" />
              <span>Your Bloom Achievements</span>
            </h2>
            <p className="text-xs text-[#3D6355] font-semibold mt-0.5">
              Badges celebrate your unique curiosity, practice, and adventure steps!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(36,72,61,0.08)]">
            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24483D] ${
                badgeFilter === 'all'
                  ? 'bg-white text-[#24483D] shadow-xs'
                  : 'text-[#3D6355] hover:text-[#24483D]'
              }`}
            >
              All Badges ({rewardSummary.earnedBadges.length + rewardSummary.lockedBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('earned')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24483D] ${
                badgeFilter === 'earned'
                  ? 'bg-white text-[#24483D] shadow-xs'
                  : 'text-[#3D6355] hover:text-[#24483D]'
              }`}
            >
              Unlocked ({rewardSummary.earnedBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('in_progress')}
              className={`min-h-[40px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24483D] ${
                badgeFilter === 'in_progress'
                  ? 'bg-white text-[#24483D] shadow-xs'
                  : 'text-[#3D6355] hover:text-[#24483D]'
              }`}
            >
              In Progress ({rewardSummary.lockedBadges.length})
            </button>
          </div>
        </div>

        {/* STAGE 08: Friendly Empty State when no badges match the filter */}
        {displayedBadgesCount === 0 && (
          <div className="p-8 rounded-3xl border-2 border-dashed border-[#B2E6CE] bg-[#F0FAF5]/70 text-center space-y-3">
            <div className="text-4xl" aria-hidden="true">
              🌱
            </div>
            <h3 className="text-lg font-extrabold text-[#24483D] font-fredoka">
              {badgeFilter === 'earned' ? 'Your First Badge Is Waiting!' : 'All Badges Blossomed!'}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#3D6355] max-w-md mx-auto">
              {badgeFilter === 'earned'
                ? 'Explore any learning world above to complete your first task and earn your very first flower badge!'
                : 'Incredible work! You have blossomed through every milestone in the kingdom!'}
            </p>
            <div className="pt-2">
              <Link
                to={`/student/play/${resumeTarget.worldId}/${resumeTarget.levelNumber}`}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] text-xs font-bold hover:bg-[#152E26] shadow-xs transition-colors"
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
