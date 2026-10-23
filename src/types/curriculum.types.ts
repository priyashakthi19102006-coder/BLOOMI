export type WorldId = 'writing' | 'speaking' | 'visual' | 'social'

export type InstructionalBand = 'explore' | 'connect' | 'build' | 'apply' | 'master'

export type TaskType = 'multiple_choice' | 'matching' | 'ordering' | 'letter_input'

export interface CompletionRule {
  type: 'all_tasks_completed'
  requiredCorrect?: number
}

export interface MultipleChoiceOption {
  id: string
  text: string
  icon?: string
  isCorrect: boolean
}

export interface MultipleChoiceTaskData {
  type: 'multiple_choice'
  question: string
  options: MultipleChoiceOption[]
  explanation?: string
}

export interface MatchingPair {
  id: string
  left: string
  right: string
  iconLeft?: string
  iconRight?: string
}

export interface MatchingTaskData {
  type: 'matching'
  prompt: string
  pairs: MatchingPair[]
}

export interface OrderingItem {
  id: string
  text: string
  correctOrder: number
  icon?: string
}

export interface OrderingTaskData {
  type: 'ordering'
  prompt: string
  items: OrderingItem[]
}

export interface LetterInputTaskData {
  type: 'letter_input'
  prompt: string
  wordWithBlank: string
  expectedLetter: string
  acceptableAlternatives?: string[]
}

export type TaskData =
  | MultipleChoiceTaskData
  | MatchingTaskData
  | OrderingTaskData
  | LetterInputTaskData

export type EducationalSkillId =
  | 'letter_recognition'
  | 'phonological_awareness'
  | 'word_decoding'
  | 'vocabulary_sentence'
  | 'listening_comprehension'
  | 'visual_pattern_planning'
  | 'functional_communication'

export type SkillStage =
  | 'exploring'
  | 'developing'
  | 'practising_supported'
  | 'applying_independent'
  | 'ready_for_challenge'
  | 'insufficient_data'

export interface EducationalSkillDefinition {
  id: EducationalSkillId
  title: string
  domain: string
  description: string
  observableCriteria: string
  gradeTarget: number
  worldId: WorldId
  sampleActivity: string
}

export interface StudentSkillStageEvaluation {
  skillId: EducationalSkillId
  skillTitle: string
  domain: string
  stage: SkillStage
  stageTitle: string
  confidenceScore: number
  attemptsEvaluated: number
  accuracyPercentage: number
  averageHintsUsed: number
  averageRetries: number
  evidenceSummary: string
  dataLimitationNote: string
  suggestedNextStep: string
  recommendedLevel?: { worldId: WorldId; levelNumber: number; title: string }
  teacherOverride?: {
    stage: SkillStage
    overriddenBy: string
    overrideDate: string
    rationale: string
  }
}

export interface CurriculumTask {
  id: string
  levelId: string
  taskNumber: number // 1 to 5
  title: string
  instruction: string
  taskType: TaskType
  data: TaskData
  targetSkillId?: EducationalSkillId
  skillDifficulty?: number // 1 to 5
  hint?: string
  visualDemonstration?: string
  spokenInstruction?: string
  audioPromptText?: string
  pictureChoiceSupported?: boolean
  aacStyleSupported?: boolean
  scoringRubric?: string
  supportedResponseMethods?: string[]
  skillsPracticed?: string[]
  encouragementTip?: string
  accommodationsAvailable?: string[]
}

export interface CurriculumLevel {
  id: string
  worldId: WorldId
  levelNumber: number // 1 to 50
  band: InstructionalBand
  bandTitle: string
  title: string
  objective: string
  tasks: CurriculumTask[] // exactly 5 tasks
  completionRule: CompletionRule
}

export interface CurriculumWorld {
  id: WorldId
  title: string
  subtitle: string
  description: string
  accentColor: string
  bgLight: string
  borderColor: string
  levels: CurriculumLevel[] // exactly 50 levels
  magicalWorldName?: string
  skillDomains?: string[]
  supportedResponseMethods?: string[]
  sceneTheme?: 'amusement_park' | 'food_world' | 'animal_world' | 'space_world'
  companionName?: string
}

export type LevelStatus = 'locked' | 'available' | 'completed'

export interface LevelProgressRecord {
  levelNumber: number
  worldId: WorldId
  completed: boolean
  completedTasks: number // 0 to 5
  starsEarned: number // 1 to 3
  completedTaskIds?: string[]
  lastAttemptAt?: string
  completedAt?: string
}

export interface StudentCurriculumProgress {
  userId: string
  isDemo: boolean
  worlds: Record<WorldId, {
    completedLevelNumbers: number[]
    currentLevelNumber: number
    levelRecords: Record<number, LevelProgressRecord>
  }>
  earnedBadges?: Record<string, string> // badgeId -> unlockedAt ISO string
}

export interface WorldProgressSummary {
  worldId: WorldId
  title: string
  totalLevels: number
  completedLevels: number
  currentLevelNumber: number
  percentage: number
}

export type BadgeCategory = 'milestone' | 'exploration' | 'writing' | 'speaking' | 'visual' | 'social'

export interface BadgeDefinition {
  id: string
  title: string
  description: string
  category: BadgeCategory
  iconName: string
  criteriaDescription: string
  targetCount: number
}

export interface RewardSummary {
  totalStars: number
  totalCompletedLevels: number
  earnedBadges: {
    badge: BadgeDefinition
    unlockedAt: string
  }[]
  lockedBadges: {
    badge: BadgeDefinition
    progressCount: number
    targetCount: number
    percentage: number
  }[]
  unlockedBadgeIds: string[]
  recentMilestone?: BadgeDefinition | null
}

