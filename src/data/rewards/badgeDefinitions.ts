import type { BadgeDefinition } from '../../types/curriculum.types'

/**
 * Child-friendly, strengths-based, and non-clinical BLOOMI badge definitions.
 *
 * POLICY NOTICE:
 * - Badges celebrate personal curiosity, exploration, and practice milestones.
 * - Badges NEVER label or categorize a child clinically (e.g. autistic, dyslexic, delayed, gifted).
 * - Badges are never tied to response speed, countdown timers, competitive leaderboards, or neurotypical conformity.
 */
export const BLOOMI_BADGES: BadgeDefinition[] = [
  {
    id: 'first_bloom',
    title: 'First Bloom',
    description: 'Blossomed by completing your very first adventure level in BLOOMI!',
    category: 'milestone',
    iconName: 'Flower',
    criteriaDescription: 'Complete 1 level in any world',
    targetCount: 1,
  },
  {
    id: 'curious_explorer',
    title: 'Curious Explorer',
    description: 'Visited all four learning worlds and opened new paths of discovery!',
    category: 'exploration',
    iconName: 'Compass',
    criteriaDescription: 'Complete at least 1 level in all 4 worlds',
    targetCount: 4,
  },
  {
    id: 'writing_sprout',
    title: 'Writing Sprout',
    description: 'Planted 5 seeds of letter and spelling creativity in Writing World!',
    category: 'writing',
    iconName: 'BookOpen',
    criteriaDescription: 'Complete 5 levels in Writing World',
    targetCount: 5,
  },
  {
    id: 'sound_scout',
    title: 'Sound Scout',
    description: 'Tuned into 5 levels of sound discrimination and rhymes in Speaking World!',
    category: 'speaking',
    iconName: 'Mic',
    criteriaDescription: 'Complete 5 levels in Speaking World',
    targetCount: 5,
  },
  {
    id: 'visual_thinker',
    title: 'Visual Thinker',
    description: 'Solved 5 levels of patterns, sequences, and shapes in Visual Discovery!',
    category: 'visual',
    iconName: 'Eye',
    criteriaDescription: 'Complete 5 levels in Visual Discovery',
    targetCount: 5,
  },
  {
    id: 'kind_communicator',
    title: 'Kind Communicator',
    description: 'Practiced 5 levels of feelings, cooperation, and everyday choices in Social Adventure!',
    category: 'social',
    iconName: 'HeartHandshake',
    criteriaDescription: 'Complete 5 levels in Social Adventure',
    targetCount: 5,
  },
  {
    id: 'learning_gardener',
    title: 'Learning Gardener',
    description: 'Nurtured your learning garden by completing 10 levels across your adventure!',
    category: 'milestone',
    iconName: 'Sparkles',
    criteriaDescription: 'Complete 10 levels across any worlds',
    targetCount: 10,
  },
  {
    id: 'bloom_champion',
    title: 'Bloom Champion',
    description: 'A stellar milestone of 25 completed levels across your BLOOMI journey!',
    category: 'milestone',
    iconName: 'Trophy',
    criteriaDescription: 'Complete 25 levels across any worlds',
    targetCount: 25,
  },
]
