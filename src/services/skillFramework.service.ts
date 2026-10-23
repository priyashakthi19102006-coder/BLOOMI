import type {
  EducationalSkillId,
  EducationalSkillDefinition,
  SkillStage,
  StudentSkillStageEvaluation,
  WorldId,
} from '../types/curriculum.types'
import type { StudentTaskAttemptRecord } from '../types/database.types'

export const EDUCATIONAL_SKILLS: Record<EducationalSkillId, EducationalSkillDefinition> = {
  letter_recognition: {
    id: 'letter_recognition',
    title: 'Letter Recognition & Directional Orientation',
    domain: 'Phonics & Literacy Foundation',
    description: 'Recognizing uppercase and lowercase letterforms, ascenders, descenders, and distinguishing visually similar letters (such as b/d and p/q).',
    observableCriteria: 'Student accurately identifies letter shape, matches upper/lowercase pairs, and distinguishes mirror-reversed orientations without direction confusion.',
    gradeTarget: 3,
    worldId: 'writing',
    sampleActivity: 'Teasing b and d apart along carnival rollercoaster tracks with directional cues.',
  },
  phonological_awareness: {
    id: 'phonological_awareness',
    title: 'Phonological Awareness & Sound Discrimination',
    domain: 'Auditory & Oral Language',
    description: 'Hearing, identifying, and manipulating individual units of sound (phonemes, onsets, rimes, and rhyming patterns) in spoken words.',
    observableCriteria: 'Student distinguishes target consonant/vowel sounds, identifies rhyming endings, and isolates initial/final sounds in familiar words.',
    gradeTarget: 3,
    worldId: 'writing',
    sampleActivity: 'Matching rhyming word flowers and isolating initial consonants in the amusement park.',
  },
  word_decoding: {
    id: 'word_decoding',
    title: 'Word Decoding, Blends & Spelling',
    domain: 'Reading Mechanics',
    description: 'Blending consonants and vowels into recognizable CVC patterns, consonant blends (bl, cl, sp, st), and common digraphs (sh, ch).',
    observableCriteria: 'Student blends letter-sounds into whole words, arranges letter tiles into correct spelling order, and chooses correct missing vowels.',
    gradeTarget: 3,
    worldId: 'writing',
    sampleActivity: 'Building short -at/-an word families and assembling word tiles to open carnival games.',
  },
  vocabulary_sentence: {
    id: 'vocabulary_sentence',
    title: 'Vocabulary & Sentence Construction',
    domain: 'Language Comprehension & Expression',
    description: 'Understanding functional descriptive vocabulary, action words, recipe terms, and assembling words into meaningful sentence order.',
    observableCriteria: 'Student connects descriptive terms with visual meanings, orders multi-word sentence ingredients, and selects contextually accurate words.',
    gradeTarget: 3,
    worldId: 'speaking',
    sampleActivity: 'Arranging recipe words to bake magic cakes and matching culinary action words with ingredient pictures.',
  },
  listening_comprehension: {
    id: 'listening_comprehension',
    title: 'Listening Comprehension & Story Sequencing',
    domain: 'Receptive Language & Sequential Memory',
    description: 'Listening to short, predictable spoken descriptions and sequencing narrative events, recipes, or multi-step procedures in order.',
    observableCriteria: 'Student follows 3-step auditory instructions, sequences story panels chronologically, and identifies central story events.',
    gradeTarget: 3,
    worldId: 'speaking',
    sampleActivity: 'Ordering multi-step baking recipe steps and sequencing animal behavior stories.',
  },
  visual_pattern_planning: {
    id: 'visual_pattern_planning',
    title: 'Visual Pattern Recognition & Task Planning',
    domain: 'Visual-Spatial & Cognitive Organisation',
    description: 'Observing geometric, color, and size sequences (AB, AAB, ABB), spatial directions (inside/outside, above/below), and matrix puzzles.',
    observableCriteria: 'Student completes repeating visual pattern strips, identifies spatial positions accurately, and solves part-to-whole puzzles.',
    gradeTarget: 3,
    worldId: 'visual',
    sampleActivity: 'Aligning constellation stars in space world and ordering planetary orbit progressions.',
  },
  functional_communication: {
    id: 'functional_communication',
    title: 'Functional Communication & Social Understanding',
    domain: 'Social-Emotional & Self-Advocacy',
    description: 'Identifying facial/body emotional cues, using AAC picture communication cards, choosing respectful greetings, and asking for support or sensory breaks.',
    observableCriteria: 'Student identifies primary emotions from contextual story cues, selects appropriate AAC cards to express needs, and demonstrates turn-taking concepts.',
    gradeTarget: 3,
    worldId: 'social',
    sampleActivity: 'Choosing AAC emotion symbol cards and selecting sensory-break choices in the wildlife animal sanctuary.',
  },
}

export const STAGE_TITLES: Record<SkillStage, string> = {
  exploring: 'Exploring (Initial Exposure)',
  developing: 'Developing (Gaining Familiarity)',
  practising_supported: 'Practising with Support (Consistent with Cues)',
  applying_independent: 'Applying Independently (Fluent & Confident)',
  ready_for_challenge: 'Ready for Next Challenge (Advanced Mastery)',
  insufficient_data: 'Not Enough Information Yet',
}

class SkillFrameworkService {
  /**
   * Get all registered educational skill definitions.
   */
  getAllSkills(): EducationalSkillDefinition[] {
    return Object.values(EDUCATIONAL_SKILLS)
  }

  /**
   * Get single skill definition.
   */
  getSkill(id: EducationalSkillId): EducationalSkillDefinition | undefined {
    return EDUCATIONAL_SKILLS[id]
  }

  /**
   * Map world ID and task context to target educational skill.
   */
  inferSkillFromTask(worldId: WorldId, levelNumber: number, taskType: string): EducationalSkillId {
    if (worldId === 'writing') {
      if (levelNumber <= 10) return 'letter_recognition'
      if (levelNumber <= 20) return 'phonological_awareness'
      return 'word_decoding'
    }

    if (worldId === 'speaking') {
      if (taskType === 'ordering' || levelNumber > 25) return 'listening_comprehension'
      return 'vocabulary_sentence'
    }

    if (worldId === 'visual') {
      return 'visual_pattern_planning'
    }

    // social
    return 'functional_communication'
  }

  /**
   * Evaluate educational skill stages across a student's actual persisted task attempts.
   * Completely transparent, non-diagnostic, and rooted in observable learning evidence.
   */
  evaluateStudentSkills(attempts: StudentTaskAttemptRecord[] = []): StudentSkillStageEvaluation[] {
    const allSkills = this.getAllSkills()

    return allSkills.map((skillDef) => {
      // Find all attempts matching this skill
      const skillAttempts = attempts.filter((att) => {
        const inferred = this.inferSkillFromTask(
          (att.world_id as WorldId) || 'writing',
          att.level_number || 1,
          att.task_type || 'multiple_choice'
        )
        return inferred === skillDef.id
      })

      const attemptsCount = skillAttempts.length

      // Rule: If fewer than 2 attempts, do NOT guess.
      if (attemptsCount < 2) {
        return {
          skillId: skillDef.id,
          skillTitle: skillDef.title,
          domain: skillDef.domain,
          stage: 'insufficient_data',
          stageTitle: STAGE_TITLES.insufficient_data,
          confidenceScore: 0,
          attemptsEvaluated: attemptsCount,
          accuracyPercentage: 0,
          averageHintsUsed: 0,
          averageRetries: 0,
          evidenceSummary: attemptsCount === 0
            ? 'No task attempts recorded for this skill yet.'
            : 'Only 1 recorded task attempt. Minimum 2 attempts required for reliable educational assessment.',
          dataLimitationNote: 'Formative educational observation only. Not a clinical assessment or developmental diagnostic.',
          suggestedNextStep: `Introduce initial Band 1 exploration activities in ${skillDef.domain}.`,
          recommendedLevel: {
            worldId: skillDef.worldId,
            levelNumber: 1,
            title: `Introduction to ${skillDef.title}`,
          },
        }
      }

      // Calculate transparent metrics
      const correctCount = skillAttempts.filter((a) => a.is_correct).length
      const accuracy = Math.round((correctCount / attemptsCount) * 100)
      const totalHints = skillAttempts.reduce((sum, a) => sum + (a.hints_used || 0), 0)
      const avgHints = Math.round((totalHints / attemptsCount) * 10) / 10
      const totalRetries = skillAttempts.reduce((sum, a) => sum + Math.max(0, (a.attempts_count || 1) - 1), 0)
      const avgRetries = Math.round((totalRetries / attemptsCount) * 10) / 10

      // Compute Confidence Score based on sample size (2 attempts = 40%, 5+ attempts = 85-95%)
      const confidence = Math.min(95, Math.max(30, 30 + attemptsCount * 12))

      // Stage criteria
      let stage: SkillStage = 'developing'
      if (accuracy < 50) {
        stage = 'exploring'
      } else if (accuracy < 75 || avgHints >= 1.5) {
        stage = 'developing'
      } else if (accuracy < 85) {
        stage = 'practising_supported'
      } else if (accuracy < 90 || attemptsCount < 4) {
        stage = 'applying_independent'
      } else {
        stage = 'ready_for_challenge'
      }

      const evidenceSummary = `Observed ${attemptsCount} attempts: ${accuracy}% accuracy, averaging ${avgHints} hints and ${avgRetries} retries per task.`
      const dataLimitationNote = `Based on ${attemptsCount} platform task attempts. Intended solely to inform classroom differentiated instruction, not medical evaluation.`

      // Recommended next step & level
      let suggestedNextStep = ''
      let recLevelNumber = 1

      switch (stage) {
        case 'exploring':
          suggestedNextStep = 'Review foundational visual and auditory cues with guided educator support.'
          recLevelNumber = 2
          break
        case 'developing':
          suggestedNextStep = 'Offer additional multi-sensory practice cards and untimed picture choices.'
          recLevelNumber = 12
          break
        case 'practising_supported':
          suggestedNextStep = 'Gradually fade hints while maintaining encouraging companion feedback.'
          recLevelNumber = 22
          break
        case 'applying_independent':
          suggestedNextStep = 'Consolidate fluency with varied vocabulary and multi-step tasks.'
          recLevelNumber = 32
          break
        case 'ready_for_challenge':
          suggestedNextStep = 'Ready for complex narrative sequences or higher-tier problem solving.'
          recLevelNumber = 42
          break
        default:
          suggestedNextStep = 'Continue exploring at learner-paced comfort.'
          recLevelNumber = 1
      }

      return {
        skillId: skillDef.id,
        skillTitle: skillDef.title,
        domain: skillDef.domain,
        stage,
        stageTitle: STAGE_TITLES[stage],
        confidenceScore: confidence,
        attemptsEvaluated: attemptsCount,
        accuracyPercentage: accuracy,
        averageHintsUsed: avgHints,
        averageRetries: avgRetries,
        evidenceSummary,
        dataLimitationNote,
        suggestedNextStep,
        recommendedLevel: {
          worldId: skillDef.worldId,
          levelNumber: recLevelNumber,
          title: `Differentiated Level ${recLevelNumber} in ${skillDef.title}`,
        },
      }
    })
  }

  /**
   * Determine primary priority adaptive recommendation for a student.
   */
  getPrimaryAdaptiveRecommendation(evaluations: StudentSkillStageEvaluation[]): {
    skillId: EducationalSkillId
    skillTitle: string
    recommendationText: string
    triggeringEvidence: string
    confidenceScore: number
    worldId: WorldId
    levelNumber: number
  } | null {
    // Priority 1: Skills in 'developing' or 'exploring' with enough data to know support is beneficial
    const needsSupport = evaluations.find(
      (e) => e.stage === 'developing' || e.stage === 'exploring'
    )

    if (needsSupport && needsSupport.recommendedLevel) {
      return {
        skillId: needsSupport.skillId,
        skillTitle: needsSupport.skillTitle,
        recommendationText: `Focus on ${needsSupport.skillTitle}: ${needsSupport.suggestedNextStep}`,
        triggeringEvidence: needsSupport.evidenceSummary,
        confidenceScore: needsSupport.confidenceScore,
        worldId: needsSupport.recommendedLevel.worldId,
        levelNumber: needsSupport.recommendedLevel.levelNumber,
      }
    }

    // Priority 2: Ready for challenge
    const readyForNext = evaluations.find((e) => e.stage === 'ready_for_challenge')
    if (readyForNext && readyForNext.recommendedLevel) {
      return {
        skillId: readyForNext.skillId,
        skillTitle: readyForNext.skillTitle,
        recommendationText: `Advancement Opportunity in ${readyForNext.skillTitle}: ${readyForNext.suggestedNextStep}`,
        triggeringEvidence: readyForNext.evidenceSummary,
        confidenceScore: readyForNext.confidenceScore,
        worldId: readyForNext.recommendedLevel.worldId,
        levelNumber: readyForNext.recommendedLevel.levelNumber,
      }
    }

    // Priority 3: First available skill with recommended level
    const firstActive = evaluations.find((e) => e.recommendedLevel)
    if (firstActive && firstActive.recommendedLevel) {
      return {
        skillId: firstActive.skillId,
        skillTitle: firstActive.skillTitle,
        recommendationText: `Continue steady journey in ${firstActive.skillTitle}: ${firstActive.suggestedNextStep}`,
        triggeringEvidence: firstActive.evidenceSummary,
        confidenceScore: firstActive.confidenceScore,
        worldId: firstActive.recommendedLevel.worldId,
        levelNumber: firstActive.recommendedLevel.levelNumber,
      }
    }

    return null
  }
}

export const skillFrameworkService = new SkillFrameworkService()
