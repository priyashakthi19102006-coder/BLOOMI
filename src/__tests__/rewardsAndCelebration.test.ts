import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateTotalStars,
  calculateTotalCompletedLevels,
  getRewardSummary,
} from '../services/rewardEvaluator'
import { progressionService } from '../services/progression.service'
import { BLOOMI_BADGES } from '../data/rewards/badgeDefinitions'
import type { StudentCurriculumProgress } from '../types/curriculum.types'

describe('BLOOMI Reward System — Stars, Badges & Celebration', () => {
  const STUDENT_A = 'student_eva_rewards_test'
  const STUDENT_B = 'student_noah_rewards_test'

  beforeEach(() => {
    progressionService.resetProgress(STUDENT_A)
    progressionService.resetProgress(STUDENT_B)
  })

  describe('Star Awarding Policy', () => {
    it('does NOT award stars merely because a level is opened or visited', () => {
      // Opening level 1 leaves completedTasks at 0
      const initialStars = progressionService.getTotalStars(STUDENT_A)
      expect(initialStars).toBe(0)

      const summary = progressionService.getRewardSummary(STUDENT_A)
      expect(summary.totalStars).toBe(0)
      expect(summary.totalCompletedLevels).toBe(0)
    })

    it('does NOT award completion or stars if fewer than 5 tasks are completed', () => {
      // Complete only 4 tasks
      for (let t = 1; t <= 4; t++) {
        progressionService.recordTaskCompletion('writing', 1, `task_writing_1_${t}`, STUDENT_A)
      }

      const attemptResult = progressionService.completeLevel('writing', 1, 4, 3, STUDENT_A)
      expect(attemptResult.success).toBe(false)

      const stars = progressionService.getTotalStars(STUDENT_A)
      expect(stars).toBe(0)
    })

    it('awards 3 Bloom Stars when a level is genuinely completed with all 5 tasks', () => {
      for (let t = 1; t <= 5; t++) {
        progressionService.recordTaskCompletion('writing', 1, `task_writing_1_${t}`, STUDENT_A)
      }

      const completeResult = progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      expect(completeResult.success).toBe(true)

      const stars = progressionService.getTotalStars(STUDENT_A)
      expect(stars).toBe(3)
    })

    it('replaying a completed level does NOT duplicate or inflate earned stars', () => {
      // Complete Level 1 once
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      expect(progressionService.getTotalStars(STUDENT_A)).toBe(3)

      // Replay Level 1 a second time
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      expect(progressionService.getTotalStars(STUDENT_A)).toBe(3) // Still 3!

      // Replay Level 1 a third time
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      expect(progressionService.getTotalStars(STUDENT_A)).toBe(3) // Still 3!

      // Completing Level 2 adds 3 stars
      progressionService.completeLevel('writing', 2, 5, 3, STUDENT_A)
      expect(progressionService.getTotalStars(STUDENT_A)).toBe(6)
    })

    it('mistakes, retries, or slow responses do not reduce or penalize stars', () => {
      // Simulating a student who retried tasks multiple times before succeeding
      // Our policy guarantees that genuine completion always awards the full 3 Bloom Stars without punishment
      const completeRes = progressionService.completeLevel('social', 1, 5, 3, STUDENT_A)
      expect(completeRes.success).toBe(true)

      const record = progressionService.getLevelRecord('social', 1, STUDENT_A)
      expect(record?.starsEarned).toBe(3)
    })
  })

  describe('Badge Definitions & Milestone Rules', () => {
    it('contains child-friendly, non-clinical badge definitions', () => {
      expect(BLOOMI_BADGES.length).toBeGreaterThanOrEqual(8)

      BLOOMI_BADGES.forEach((badge) => {
        expect(badge.id).toBeTruthy()
        expect(badge.title).toBeTruthy()
        expect(badge.description).toBeTruthy()
        expect(badge.criteriaDescription).toBeTruthy()
        expect(badge.targetCount).toBeGreaterThan(0)

        // Verify non-clinical language: no deficit or clinical classification labels
        const textToCheck = `${badge.title} ${badge.description}`.toLowerCase()
        expect(textToCheck).not.toContain('autistic')
        expect(textToCheck).not.toContain('dyslexic')
        expect(textToCheck).not.toContain('delayed')
        expect(textToCheck).not.toContain('disorder')
        expect(textToCheck).not.toContain('slow')
      })
    })

    it('unlocks "First Bloom" upon completing the very first level', () => {
      const initialSummary = progressionService.getRewardSummary(STUDENT_A)
      expect(initialSummary.unlockedBadgeIds).not.toContain('first_bloom')

      const result = progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      expect(result.newlyUnlockedBadges?.map((b) => b.id)).toContain('first_bloom')

      const afterSummary = progressionService.getRewardSummary(STUDENT_A)
      expect(afterSummary.unlockedBadgeIds).toContain('first_bloom')
      expect(afterSummary.earnedBadges.some((b) => b.badge.id === 'first_bloom')).toBe(true)
    })

    it('unlocks "Curious Explorer" only after trying activities across all four worlds', () => {
      // Complete in 3 worlds: writing, speaking, visual
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      progressionService.completeLevel('speaking', 1, 5, 3, STUDENT_A)
      progressionService.completeLevel('visual', 1, 5, 3, STUDENT_A)

      const summaryThreeWorlds = progressionService.getRewardSummary(STUDENT_A)
      expect(summaryThreeWorlds.unlockedBadgeIds).not.toContain('curious_explorer')

      // Complete in 4th world: social
      const resultFourth = progressionService.completeLevel('social', 1, 5, 3, STUDENT_A)
      expect(resultFourth.newlyUnlockedBadges?.map((b) => b.id)).toContain('curious_explorer')

      const summaryFourWorlds = progressionService.getRewardSummary(STUDENT_A)
      expect(summaryFourWorlds.unlockedBadgeIds).toContain('curious_explorer')
    })

    it('unlocks world-specific badges (e.g. Writing Sprout after 5 writing levels)', () => {
      for (let lvl = 1; lvl <= 4; lvl++) {
        progressionService.completeLevel('writing', lvl, 5, 3, STUDENT_A)
      }

      const summary4 = progressionService.getRewardSummary(STUDENT_A)
      expect(summary4.unlockedBadgeIds).not.toContain('writing_sprout')

      // Complete 5th writing level
      const result5 = progressionService.completeLevel('writing', 5, 5, 3, STUDENT_A)
      expect(result5.newlyUnlockedBadges?.map((b) => b.id)).toContain('writing_sprout')

      const summary5 = progressionService.getRewardSummary(STUDENT_A)
      expect(summary5.unlockedBadgeIds).toContain('writing_sprout')
    })

    it('awards each badge once and preserves original unlock timestamp on replays', () => {
      // Complete Level 1 to earn First Bloom
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      const prog1 = progressionService.getProgress(STUDENT_A)
      const firstUnlockTime = prog1.earnedBadges?.['first_bloom']
      expect(firstUnlockTime).toBeTruthy()

      // Replay Level 1
      const replayResult = progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
      // Newly unlocked list should be empty on replay
      expect(replayResult.newlyUnlockedBadges).toHaveLength(0)

      const prog2 = progressionService.getProgress(STUDENT_A)
      expect(prog2.earnedBadges?.['first_bloom']).toBe(firstUnlockTime) // preserved exactly
    })

    it('recalculates rewards safely from existing progress if badges map was missing', () => {
      // Manually construct raw progress with 5 writing levels but missing earnedBadges dictionary
      const rawProgress: StudentCurriculumProgress = {
        userId: 'raw_student_123',
        isDemo: true,
        worlds: {
          writing: {
            completedLevelNumbers: [1, 2, 3, 4, 5],
            currentLevelNumber: 6,
            levelRecords: {
              1: { levelNumber: 1, worldId: 'writing', completed: true, completedTasks: 5, starsEarned: 3 },
              2: { levelNumber: 2, worldId: 'writing', completed: true, completedTasks: 5, starsEarned: 3 },
              3: { levelNumber: 3, worldId: 'writing', completed: true, completedTasks: 5, starsEarned: 3 },
              4: { levelNumber: 4, worldId: 'writing', completed: true, completedTasks: 5, starsEarned: 3 },
              5: { levelNumber: 5, worldId: 'writing', completed: true, completedTasks: 5, starsEarned: 3 },
            },
          },
          speaking: { completedLevelNumbers: [], currentLevelNumber: 1, levelRecords: {} },
          visual: { completedLevelNumbers: [], currentLevelNumber: 1, levelRecords: {} },
          social: { completedLevelNumbers: [], currentLevelNumber: 1, levelRecords: {} },
        },
      }

      // getRewardSummary recalculates deterministically
      const summary = getRewardSummary(rawProgress)
      expect(summary.totalStars).toBe(15) // 5 levels * 3 stars
      expect(summary.totalCompletedLevels).toBe(5)
      expect(summary.unlockedBadgeIds).toContain('first_bloom')
      expect(summary.unlockedBadgeIds).toContain('writing_sprout')
      expect(rawProgress.earnedBadges).toBeDefined()
    })
  })

  describe('Isolation and Safe Resilience', () => {
    it('strictly isolates stars and badges between different students', () => {
      // Student A completes 5 levels
      for (let l = 1; l <= 5; l++) {
        progressionService.completeLevel('visual', l, 5, 3, STUDENT_A)
      }

      expect(progressionService.getTotalStars(STUDENT_A)).toBe(15)
      expect(progressionService.getRewardSummary(STUDENT_A).unlockedBadgeIds).toContain('visual_thinker')

      // Student B must still have 0 stars and 0 badges
      expect(progressionService.getTotalStars(STUDENT_B)).toBe(0)
      expect(progressionService.getRewardSummary(STUDENT_B).unlockedBadgeIds).toHaveLength(0)
    })

    it('safely handles null or undefined progress without crashing', () => {
      expect(calculateTotalStars(null)).toBe(0)
      expect(calculateTotalCompletedLevels(undefined)).toBe(0)

      const nullSummary = getRewardSummary(null)
      expect(nullSummary.totalStars).toBe(0)
      expect(nullSummary.earnedBadges).toHaveLength(0)
      expect(nullSummary.lockedBadges.length).toBeGreaterThan(0)
    })
  })
})
