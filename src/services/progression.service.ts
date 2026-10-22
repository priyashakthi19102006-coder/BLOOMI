import type {
  WorldId,
  LevelStatus,
  StudentCurriculumProgress,
  WorldProgressSummary,
  LevelProgressRecord,
} from '../types/curriculum.types'
import { curriculumWorlds } from '../data/curriculum/curriculumGenerator'

const DEMO_STORAGE_KEY_PREFIX = 'bloomi_curriculum_progress_'

// Resilient memory store when running in Node.js test environments or SSR
const inMemoryStorage = new Map<string, string>()

function getStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch {
    // fallback to memory
  }
  return inMemoryStorage.get(key) || null
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
      return
    }
  } catch {
    // fallback to memory
  }
  inMemoryStorage.set(key, value)
}

function removeStorageItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
      return
    }
  } catch {
    // fallback to memory
  }
  inMemoryStorage.delete(key)
}

// Default initial state where Level 1 is available for all 4 worlds, rest are locked
export function createInitialProgress(userId: string = 'demo_student', isDemo: boolean = true): StudentCurriculumProgress {
  const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
  const worlds = {} as StudentCurriculumProgress['worlds']

  worldIds.forEach((wId) => {
    worlds[wId] = {
      completedLevelNumbers: [],
      currentLevelNumber: 1,
      levelRecords: {
        1: {
          levelNumber: 1,
          worldId: wId,
          completed: false,
          completedTasks: 0,
          starsEarned: 0,
        },
      },
    }
  })

  return {
    userId,
    isDemo,
    worlds,
  }
}

export const progressionService = {
  /**
   * Retrieve current curriculum progress for student.
   * Handles missing, corrupted, or incomplete records safely.
   */
  getProgress(userId: string = 'demo_student'): StudentCurriculumProgress {
    try {
      const storageKey = `${DEMO_STORAGE_KEY_PREFIX}${userId}`
      const saved = getStorageItem(storageKey)
      if (!saved) {
        const initial = createInitialProgress(userId)
        this.saveProgress(initial)
        return initial
      }

      const parsed: StudentCurriculumProgress = JSON.parse(saved)

      // Ensure all 4 worlds exist in parsed object
      const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
      let needsResave = false

      worldIds.forEach((wId) => {
        if (!parsed.worlds || !parsed.worlds[wId]) {
          if (!parsed.worlds) parsed.worlds = {} as any
          parsed.worlds[wId] = {
            completedLevelNumbers: [],
            currentLevelNumber: 1,
            levelRecords: {
              1: {
                levelNumber: 1,
                worldId: wId,
                completed: false,
                completedTasks: 0,
                starsEarned: 0,
              },
            },
          }
          needsResave = true
        }
      })

      if (needsResave) {
        this.saveProgress(parsed)
      }

      return parsed
    } catch (e) {
      console.warn('Error reading curriculum progress, falling back to clean initial progress:', e)
      const fallback = createInitialProgress(userId)
      this.saveProgress(fallback)
      return fallback
    }
  },

  /**
   * Persist progress to local or in-memory storage adapter.
   */
  saveProgress(progress: StudentCurriculumProgress): void {
    try {
      const storageKey = `${DEMO_STORAGE_KEY_PREFIX}${progress.userId}`
      setStorageItem(storageKey, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to persist student curriculum progress:', e)
    }
  },

  /**
   * Determine whether a level is 'locked', 'available', or 'completed'.
   * - Level 1 of any world is always unlocked ('available' or 'completed').
   * - Level N is available only if Level N-1 is completed.
   * - Progress in one world NEVER unlocks levels in another world.
   */
  getLevelStatus(
    worldId: WorldId,
    levelNumber: number,
    progress?: StudentCurriculumProgress
  ): LevelStatus {
    const currentProg = progress || this.getProgress()
    const worldProg = currentProg.worlds[worldId]

    if (!worldProg) {
      return levelNumber === 1 ? 'available' : 'locked'
    }

    if (worldProg.completedLevelNumbers.includes(levelNumber)) {
      return 'completed'
    }

    // Level 1 is always available if not yet completed
    if (levelNumber === 1) {
      return 'available'
    }

    // Level N is available if level N-1 is completed
    const previousLevelCompleted = worldProg.completedLevelNumbers.includes(levelNumber - 1)
    if (previousLevelCompleted) {
      return 'available'
    }

    return 'locked'
  },

  /**
   * Complete a level. Requires all 5 tasks to be completed.
   * Completing unlocks level N+1 within this world only.
   */
  completeLevel(
    worldId: WorldId,
    levelNumber: number,
    completedTasksCount: number,
    starsEarned: number = 3,
    userId: string = 'demo_student'
  ): { success: boolean; progress: StudentCurriculumProgress; message: string } {
    const progress = this.getProgress(userId)
    const worldProg = progress.worlds[worldId]

    // Rule: Completing a level requires ALL five tasks to be completed
    if (completedTasksCount < 5) {
      return {
        success: false,
        progress,
        message: `Incomplete: Level requires all 5 tasks to be finished. Current: ${completedTasksCount}/5`,
      }
    }

    // Record completion
    if (!worldProg.completedLevelNumbers.includes(levelNumber)) {
      worldProg.completedLevelNumbers.push(levelNumber)
      worldProg.completedLevelNumbers.sort((a, b) => a - b)
    }

    const record: LevelProgressRecord = {
      levelNumber,
      worldId,
      completed: true,
      completedTasks: 5,
      starsEarned: Math.min(3, Math.max(1, starsEarned)),
      completedAt: new Date().toISOString(),
    }

    worldProg.levelRecords[levelNumber] = record

    // Advance current level pointer if needed
    if (levelNumber < 50) {
      worldProg.currentLevelNumber = Math.max(worldProg.currentLevelNumber, levelNumber + 1)
    }

    this.saveProgress(progress)

    return {
      success: true,
      progress,
      message: `Level ${levelNumber} in ${worldId} completed!`,
    }
  },

  /**
   * Get progress metrics for a world (e.g. 12/50 levels completed)
   */
  getWorldSummary(
    worldId: WorldId,
    progress?: StudentCurriculumProgress
  ): WorldProgressSummary {
    const currentProg = progress || this.getProgress()
    const worldProg = currentProg.worlds[worldId]
    const worldData = curriculumWorlds[worldId]
    const totalLevels = worldData?.levels.length || 50

    const completedLevels = worldProg?.completedLevelNumbers.length || 0
    const currentLevelNumber = worldProg?.currentLevelNumber || 1
    const percentage = Math.round((completedLevels / totalLevels) * 100)

    return {
      worldId,
      title: worldData?.title || worldId,
      totalLevels,
      completedLevels,
      currentLevelNumber,
      percentage,
    }
  },

  /**
   * Clear progress for testing
   */
  resetProgress(userId: string = 'demo_student'): void {
    const storageKey = `${DEMO_STORAGE_KEY_PREFIX}${userId}`
    removeStorageItem(storageKey)
  },
}
