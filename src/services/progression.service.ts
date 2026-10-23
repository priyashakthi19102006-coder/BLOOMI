import type {
  WorldId,
  LevelStatus,
  StudentCurriculumProgress,
  WorldProgressSummary,
  LevelProgressRecord,
  BadgeDefinition,
  RewardSummary,
} from '../types/curriculum.types'
import { curriculumWorlds } from '../data/curriculum/curriculumGenerator'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  calculateTotalStars,
  evaluateBadges,
  getRewardSummary,
} from './rewardEvaluator'

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
          completedTaskIds: [],
        },
      },
    }
  })

  return {
    userId,
    isDemo,
    worlds,
    earnedBadges: {},
  }
}

export interface PersistenceInfo {
  isCloudSynced: boolean
  isDemo: boolean
  storageType: 'supabase' | 'localStorage' | 'memory'
  statusLabel: string
  description: string
}

export interface LevelCompletionResult {
  success: boolean
  progress: StudentCurriculumProgress
  message: string
  newlyUnlockedBadges?: BadgeDefinition[]
  totalStars?: number
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

      if (!parsed.worlds) {
        parsed.worlds = {} as any
        needsResave = true
      }

      worldIds.forEach((wId) => {
        if (!parsed.worlds[wId]) {
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
                completedTaskIds: [],
              },
            },
          }
          needsResave = true
        } else if (!parsed.worlds[wId].levelRecords) {
          parsed.worlds[wId].levelRecords = {}
          needsResave = true
        }
      })

      if (!parsed.earnedBadges) {
        parsed.earnedBadges = {}
        needsResave = true
      }

      // Safe recalculation of eligible badges
      const { newlyUnlocked } = evaluateBadges(parsed)
      if (newlyUnlocked.length > 0) {
        needsResave = true
      }

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

      // If Supabase is active and authenticated, trigger an asynchronous cloud sync
      if (isSupabaseConfigured && supabase && progress.userId && progress.userId !== 'demo_student') {
        this.syncToCloud(progress).catch((err) => {
          console.warn('Background Supabase progress sync note:', err?.message || err)
        })
      }
    } catch (e) {
      console.error('Failed to persist student curriculum progress:', e)
    }
  },

  /**
   * Asynchronously sync progress record to Supabase if configured.
   */
  async syncToCloud(progress: StudentCurriculumProgress): Promise<void> {
    if (!isSupabaseConfigured || !supabase || progress.userId === 'demo_student') {
      return
    }

    try {
      for (const worldId of Object.keys(progress.worlds) as WorldId[]) {
        const worldData = progress.worlds[worldId]
        for (const lvlStr of Object.keys(worldData.levelRecords)) {
          const lvlNum = parseInt(lvlStr, 10)
          const record = worldData.levelRecords[lvlNum]
          if (record) {
            await (supabase.from('student_level_progress') as any).upsert(
              {
                student_id: progress.userId,
                world_id: worldId,
                level_number: lvlNum,
                completed: record.completed,
                completed_tasks: record.completedTasks,
                stars_earned: record.starsEarned,
                completed_task_ids: record.completedTaskIds || [],
                completed_at: record.completedAt || null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'student_id,world_id,level_number' }
            )
          }
        }
      }
    } catch (err) {
      console.warn('Supabase sync skipped or failed:', err)
    }
  },

  /**
   * Load student progress directly from Supabase student_level_progress table.
   * Merges cloud data into local storage cache so progress survives across devices.
   */
  async loadFromCloud(userId: string): Promise<StudentCurriculumProgress> {
    const current = this.getProgress(userId)
    if (!isSupabaseConfigured || !supabase || userId === 'demo_student') {
      return current
    }

    try {
      const { data, error } = await supabase
        .from('student_level_progress')
        .select('*')
        .eq('student_id', userId)

      if (error) {
        console.warn('Could not fetch cloud progress (using local cache):', error.message)
        return current
      }

      if (data && data.length > 0) {
        data.forEach((row: any) => {
          const wId = row.world_id as WorldId
          if (!current.worlds[wId]) return

          const lvlNum = row.level_number as number
          current.worlds[wId].levelRecords[lvlNum] = {
            levelNumber: lvlNum,
            worldId: wId,
            completed: Boolean(row.completed),
            completedTasks: row.completed_tasks || 0,
            starsEarned: row.stars_earned || 0,
            completedTaskIds: row.completed_task_ids || [],
            completedAt: row.completed_at || undefined,
          }

          if (row.completed && !current.worlds[wId].completedLevelNumbers.includes(lvlNum)) {
            current.worlds[wId].completedLevelNumbers.push(lvlNum)
            current.worlds[wId].completedLevelNumbers.sort((a, b) => a - b)
          }
        })

        // Recalculate currentLevelNumber for each world
        ;(Object.keys(current.worlds) as WorldId[]).forEach((wId) => {
          const completed = current.worlds[wId].completedLevelNumbers
          if (completed.length > 0) {
            const highestCompleted = Math.max(...completed)
            current.worlds[wId].currentLevelNumber = Math.min(highestCompleted + 1, 50)
          }
        })

        current.isDemo = false
        // Re-evaluate badges
        evaluateBadges(current)
        this.saveProgress(current)
      }
    } catch (err) {
      console.warn('Failed to load cloud progress:', err)
    }

    return current
  },

  /**
   * Get specific progress record for a single level, including completed task IDs.
   */
  getLevelRecord(
    worldId: WorldId,
    levelNumber: number,
    userId: string = 'demo_student'
  ): LevelProgressRecord | null {
    const progress = this.getProgress(userId)
    const worldProg = progress.worlds[worldId]
    if (!worldProg || !worldProg.levelRecords) {
      return null
    }
    return worldProg.levelRecords[levelNumber] || null
  },

  /**
   * Record completion of an individual task inside a level.
   * Guarantees duplicate submission protection and persists completed task IDs.
   * Does NOT mark the entire level complete until all 5 tasks are verified.
   */
  recordTaskCompletion(
    worldId: WorldId,
    levelNumber: number,
    taskId: string,
    userId: string = 'demo_student'
  ): {
    success: boolean
    completedTasksCount: number
    completedTaskIds: string[]
    isLevelComplete: boolean
  } {
    const progress = this.getProgress(userId)
    const worldProg = progress.worlds[worldId]

    if (!worldProg.levelRecords[levelNumber]) {
      worldProg.levelRecords[levelNumber] = {
        levelNumber,
        worldId,
        completed: false,
        completedTasks: 0,
        starsEarned: 0,
        completedTaskIds: [],
        lastAttemptAt: new Date().toISOString(),
      }
    }

    const record = worldProg.levelRecords[levelNumber]
    if (!record.completedTaskIds) {
      record.completedTaskIds = []
    }

    // Protection against duplicate submissions
    if (!record.completedTaskIds.includes(taskId)) {
      record.completedTaskIds.push(taskId)
    }

    record.completedTasks = record.completedTaskIds.length
    record.lastAttemptAt = new Date().toISOString()

    const isLevelComplete = record.completedTasks >= 5

    this.saveProgress(progress)

    return {
      success: true,
      completedTasksCount: record.completedTasks,
      completedTaskIds: [...record.completedTaskIds],
      isLevelComplete,
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
   * - Awards 3 stars upon completion.
   * - Unlocks level N+1 within this world only.
   * - Replaying preserves prior completion and highest stars earned (does NOT duplicate stars).
   * - Evaluates achievement badges and unlocks eligible milestones.
   */
  completeLevel(
    worldId: WorldId,
    levelNumber: number,
    completedTasksCount: number,
    starsEarned: number = 3,
    userId: string = 'demo_student'
  ): LevelCompletionResult {
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

    // Record completion in world list if not present
    if (!worldProg.completedLevelNumbers.includes(levelNumber)) {
      worldProg.completedLevelNumbers.push(levelNumber)
      worldProg.completedLevelNumbers.sort((a, b) => a - b)
    }

    const previousRecord = worldProg.levelRecords[levelNumber]
    const highestStars = previousRecord?.starsEarned
      ? Math.max(previousRecord.starsEarned, starsEarned)
      : Math.min(3, Math.max(1, starsEarned))

    const record: LevelProgressRecord = {
      levelNumber,
      worldId,
      completed: true,
      completedTasks: 5,
      starsEarned: highestStars,
      completedTaskIds: previousRecord?.completedTaskIds || [],
      lastAttemptAt: new Date().toISOString(),
      completedAt: previousRecord?.completedAt || new Date().toISOString(),
    }

    worldProg.levelRecords[levelNumber] = record

    // Advance current level pointer if needed
    if (levelNumber < 50) {
      worldProg.currentLevelNumber = Math.max(worldProg.currentLevelNumber, levelNumber + 1)
    }

    // Evaluate badges and rewards
    const { newlyUnlocked } = evaluateBadges(progress)
    const totalStars = calculateTotalStars(progress)

    this.saveProgress(progress)

    return {
      success: true,
      progress,
      message: `Level ${levelNumber} in ${worldId} completed!`,
      newlyUnlockedBadges: newlyUnlocked,
      totalStars,
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
   * Get total earned Bloom Stars across all unique completed levels.
   */
  getTotalStars(userId: string = 'demo_student'): number {
    const progress = this.getProgress(userId)
    return calculateTotalStars(progress)
  },

  /**
   * Get comprehensive reward summary (stars, earned badges, locked badges with progress).
   */
  getRewardSummary(userId: string = 'demo_student'): RewardSummary {
    const progress = this.getProgress(userId)
    return getRewardSummary(progress)
  },

  /**
   * Clear progress for testing
   */
  resetProgress(userId: string = 'demo_student'): void {
    const storageKey = `${DEMO_STORAGE_KEY_PREFIX}${userId}`
    removeStorageItem(storageKey)
  },

  /**
   * Explicit metadata regarding persistence mode and storage adapter.
   */
  getPersistenceInfo(userId: string = 'demo_student'): PersistenceInfo {
    const hasSupabase = isSupabaseConfigured && Boolean(supabase) && userId !== 'demo_student'

    if (hasSupabase) {
      return {
        isCloudSynced: true,
        isDemo: false,
        storageType: 'supabase',
        statusLabel: 'Cloud Sync Active',
        description: 'Progress is securely saved to your student cloud profile via Supabase.',
      }
    }

    const hasLocalStorage = typeof localStorage !== 'undefined'

    return {
      isCloudSynced: false,
      isDemo: true,
      storageType: hasLocalStorage ? 'localStorage' : 'memory',
      statusLabel: 'Local Demo Storage',
      description: hasLocalStorage
        ? 'Demo mode active: Progress is saved to this browser and will persist across refreshes on this device.'
        : 'Demo mode active: In-memory session store.',
    }
  },
}
