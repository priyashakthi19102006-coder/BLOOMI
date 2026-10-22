import type {
  StudentCurriculumProgress,
  BadgeDefinition,
  RewardSummary,
  WorldId,
} from '../types/curriculum.types'
import { BLOOMI_BADGES } from '../data/rewards/badgeDefinitions'

/**
 * Pure calculation of total stars earned by a student.
 * Sums stars across unique completed levels across all 4 worlds.
 * Replaying completed levels does NOT duplicate stars.
 */
export function calculateTotalStars(progress: StudentCurriculumProgress | null | undefined): number {
  if (!progress || !progress.worlds) return 0

  let total = 0
  const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']

  worldIds.forEach((wId) => {
    const worldProg = progress.worlds[wId]
    if (worldProg && Array.isArray(worldProg.completedLevelNumbers)) {
      worldProg.completedLevelNumbers.forEach((lvlNum) => {
        const record = worldProg.levelRecords?.[lvlNum]
        total += record?.starsEarned ? Math.max(1, Math.min(3, record.starsEarned)) : 3
      })
    }
  })

  return total
}

/**
 * Pure calculation of total unique completed levels across all 4 worlds.
 */
export function calculateTotalCompletedLevels(progress: StudentCurriculumProgress | null | undefined): number {
  if (!progress || !progress.worlds) return 0

  let count = 0
  const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']

  worldIds.forEach((wId) => {
    const worldProg = progress.worlds[wId]
    if (worldProg && Array.isArray(worldProg.completedLevelNumbers)) {
      count += worldProg.completedLevelNumbers.length
    }
  })

  return count
}

/**
 * Pure evaluation of badge criteria against current student progress.
 * Awards each badge once and preserves existing unlock timestamps.
 */
export function evaluateBadges(
  progress: StudentCurriculumProgress
): { newlyUnlocked: BadgeDefinition[]; allUnlockedIds: string[] } {
  if (!progress.earnedBadges) {
    progress.earnedBadges = {}
  }

  const newlyUnlocked: BadgeDefinition[] = []
  const allUnlockedIds: string[] = Object.keys(progress.earnedBadges)

  const writingCount = progress.worlds?.writing?.completedLevelNumbers?.length || 0
  const speakingCount = progress.worlds?.speaking?.completedLevelNumbers?.length || 0
  const visualCount = progress.worlds?.visual?.completedLevelNumbers?.length || 0
  const socialCount = progress.worlds?.social?.completedLevelNumbers?.length || 0
  const totalCompleted = writingCount + speakingCount + visualCount + socialCount

  const nowIso = new Date().toISOString()

  BLOOMI_BADGES.forEach((badge) => {
    let isEligible = false

    switch (badge.id) {
      case 'first_bloom':
        isEligible = totalCompleted >= 1
        break

      case 'curious_explorer':
        isEligible = writingCount >= 1 && speakingCount >= 1 && visualCount >= 1 && socialCount >= 1
        break

      case 'writing_sprout':
        isEligible = writingCount >= 5
        break

      case 'sound_scout':
        isEligible = speakingCount >= 5
        break

      case 'visual_thinker':
        isEligible = visualCount >= 5
        break

      case 'kind_communicator':
        isEligible = socialCount >= 5
        break

      case 'learning_gardener':
        isEligible = totalCompleted >= 10
        break

      case 'bloom_champion':
        isEligible = totalCompleted >= 25
        break

      default:
        isEligible = false
    }

    if (isEligible) {
      if (!progress.earnedBadges![badge.id]) {
        progress.earnedBadges![badge.id] = nowIso
        newlyUnlocked.push(badge)
        allUnlockedIds.push(badge.id)
      }
    }
  })

  return { newlyUnlocked, allUnlockedIds }
}

/**
 * Get comprehensive reward summary for a student.
 */
export function getRewardSummary(progress: StudentCurriculumProgress | null | undefined): RewardSummary {
  if (!progress) {
    return {
      totalStars: 0,
      totalCompletedLevels: 0,
      earnedBadges: [],
      lockedBadges: BLOOMI_BADGES.map((b) => ({
        badge: b,
        progressCount: 0,
        targetCount: b.targetCount,
        percentage: 0,
      })),
      unlockedBadgeIds: [],
    }
  }

  // Ensure eligibility is recalculated
  evaluateBadges(progress)

  const totalStars = calculateTotalStars(progress)
  const totalCompleted = calculateTotalCompletedLevels(progress)

  const writingCount = progress.worlds?.writing?.completedLevelNumbers?.length || 0
  const speakingCount = progress.worlds?.speaking?.completedLevelNumbers?.length || 0
  const visualCount = progress.worlds?.visual?.completedLevelNumbers?.length || 0
  const socialCount = progress.worlds?.social?.completedLevelNumbers?.length || 0

  const earnedBadges: RewardSummary['earnedBadges'] = []
  const lockedBadges: RewardSummary['lockedBadges'] = []
  const unlockedBadgeIds: string[] = []

  BLOOMI_BADGES.forEach((badge) => {
    const unlockedAt = progress.earnedBadges?.[badge.id]

    if (unlockedAt) {
      unlockedBadgeIds.push(badge.id)
      earnedBadges.push({
        badge,
        unlockedAt,
      })
    } else {
      // Calculate current progress count for this locked badge
      let currentCount = 0
      switch (badge.id) {
        case 'first_bloom':
          currentCount = Math.min(1, totalCompleted)
          break
        case 'curious_explorer': {
          let worldsTried = 0
          if (writingCount >= 1) worldsTried++
          if (speakingCount >= 1) worldsTried++
          if (visualCount >= 1) worldsTried++
          if (socialCount >= 1) worldsTried++
          currentCount = worldsTried
          break
        }
        case 'writing_sprout':
          currentCount = Math.min(badge.targetCount, writingCount)
          break
        case 'sound_scout':
          currentCount = Math.min(badge.targetCount, speakingCount)
          break
        case 'visual_thinker':
          currentCount = Math.min(badge.targetCount, visualCount)
          break
        case 'kind_communicator':
          currentCount = Math.min(badge.targetCount, socialCount)
          break
        case 'learning_gardener':
          currentCount = Math.min(badge.targetCount, totalCompleted)
          break
        case 'bloom_champion':
          currentCount = Math.min(badge.targetCount, totalCompleted)
          break
        default:
          currentCount = 0
      }

      const percentage = Math.round((currentCount / badge.targetCount) * 100)
      lockedBadges.push({
        badge,
        progressCount: currentCount,
        targetCount: badge.targetCount,
        percentage,
      })
    }
  })

  // Sort earned badges by unlock date descending (most recent first)
  earnedBadges.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())

  return {
    totalStars,
    totalCompletedLevels: totalCompleted,
    earnedBadges,
    lockedBadges,
    unlockedBadgeIds,
    recentMilestone: earnedBadges[0]?.badge || null,
  }
}
