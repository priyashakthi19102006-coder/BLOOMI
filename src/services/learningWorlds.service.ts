import { learningWorlds } from '../data/learningWorlds'
import type { LearningWorld, WorldId } from '../types'

/**
 * Service to retrieve Learning Worlds.
 * In Stage 1, this reads from structured local static data.
 * In Stage 2+, this will sync with Supabase and teacher curriculum configs.
 */
export const learningWorldsService = {
  getAllWorlds(): LearningWorld[] {
    return learningWorlds
  },

  getWorldById(id: WorldId | string): LearningWorld | undefined {
    return learningWorlds.find((w) => w.id === id)
  },
}
