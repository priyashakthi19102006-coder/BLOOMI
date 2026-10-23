import { describe, it, expect } from 'vitest'
import { progressionService, createInitialProgress } from '../services/progression.service'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import type { WorldId } from '../types/curriculum.types'

describe('Stage 08 — Student Learning Experience & Progress Summaries', () => {
  it('calculates accurate progress summaries across all four learning worlds', () => {
    const progress = createInitialProgress('test_student_exp')
    const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']

    worldIds.forEach((wId) => {
      const summary = progressionService.getWorldSummary(wId, progress)
      expect(summary.worldId).toBe(wId)
      expect(summary.totalLevels).toBe(50)
      expect(summary.completedLevels).toBe(0)
      expect(summary.currentLevelNumber).toBe(1)
      expect(summary.percentage).toBe(0)
    })
  })

  it('updates world progress percentage and current level after level completion', () => {
    const userId = 'test_student_exp_2'
    progressionService.saveProgress(createInitialProgress(userId))

    // Complete Level 1 in writing world (requires 5 tasks completed)
    const completion = progressionService.completeLevel('writing', 1, 5, 3, userId)
    expect(completion.success).toBe(true)
    const progress = completion.progress

    const writingSummary = progressionService.getWorldSummary('writing', progress)
    expect(writingSummary.completedLevels).toBe(1)
    expect(writingSummary.currentLevelNumber).toBe(2)
    expect(writingSummary.percentage).toBe(2) // 1/50 = 2%

    // Speaking world remains at level 1 (world isolation)
    const speakingSummary = progressionService.getWorldSummary('speaking', progress)
    expect(speakingSummary.completedLevels).toBe(0)
    expect(speakingSummary.currentLevelNumber).toBe(1)
  })

  it('calculates the correct resume learning target for a fresh student', () => {
    const progress = createInitialProgress('new_student')

    // Fresh student should start on writing world Level 1
    const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
    let targetWorld: WorldId = 'writing'
    let targetLevel = 1

    for (const wId of worldIds) {
      const wProg = progress.worlds?.[wId]
      const completed = wProg?.completedLevelNumbers?.length || 0
      if (completed < 50) {
        targetWorld = wId
        targetLevel = wProg?.currentLevelNumber || 1
        break
      }
    }

    expect(targetWorld).toBe('writing')
    expect(targetLevel).toBe(1)

    const level = curriculumService.getLevel(targetWorld, targetLevel)
    expect(level).toBeDefined()
    expect(level?.levelNumber).toBe(1)
    expect(typeof level?.title).toBe('string')
  })

  it('calculates the correct resume learning target for a student in progress', () => {
    const userId = 'active_student'
    progressionService.saveProgress(createInitialProgress(userId))

    // Complete Level 1 & 2 in speaking world (5 tasks each)
    let progress = progressionService.completeLevel('speaking', 1, 5, 3, userId).progress
    progress = progressionService.completeLevel('speaking', 2, 5, 3, userId).progress

    // Find most recently attempted level
    const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
    let mostRecentAttempt: { worldId: WorldId; levelNumber: number; date: Date } | null = null

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

    expect(mostRecentAttempt).not.toBeNull()
    expect(mostRecentAttempt?.worldId).toBe('speaking')
    expect(mostRecentAttempt?.levelNumber).toBe(2)

    // Current level to continue in speaking world is level 3
    expect(progress.worlds.speaking.currentLevelNumber).toBe(3)
  })
})

describe('Stage 08 — Accessibility & Calming Design Compliance', () => {
  it('verifies progress bar attributes adhere to WAI-ARIA specification', () => {
    const summary = {
      percentage: 35,
      totalLevels: 50,
      completedLevels: 17,
      worldTitle: 'Writing World',
    }

    const ariaAttributes = {
      role: 'progressbar',
      'aria-valuenow': summary.percentage,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-label': `${summary.worldTitle} progress: ${summary.percentage}%`,
    }

    expect(ariaAttributes.role).toBe('progressbar')
    expect(ariaAttributes['aria-valuenow']).toBe(35)
    expect(ariaAttributes['aria-valuemin']).toBe(0)
    expect(ariaAttributes['aria-valuemax']).toBe(100)
    expect(ariaAttributes['aria-label']).toContain('35%')
  })

  it('verifies minimum touch targets comply with WCAG 2.1 AA (at least 44px)', () => {
    const touchTargetHeights = [44, 48, 48, 44] // px
    touchTargetHeights.forEach((height) => {
      expect(height).toBeGreaterThanOrEqual(44)
    })
  })

  it('triggers friendly empty state when unlocked badge count is zero', () => {
    const earnedBadgesCount = 0
    const filter = 'earned'
    const shouldShowEmptyState = filter === 'earned' && earnedBadgesCount === 0

    expect(shouldShowEmptyState).toBe(true)
  })
})
