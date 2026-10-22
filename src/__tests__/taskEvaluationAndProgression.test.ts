import { describe, it, expect, beforeEach } from 'vitest'
import {
  validateTaskDefinition,
  evaluateMultipleChoice,
  evaluateMatching,
  evaluateOrdering,
  evaluateLetterInput,
  evaluateTask,
} from '../services/taskEvaluator'
import { progressionService } from '../services/progression.service'
import type {
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../types/curriculum.types'

describe('Task Evaluator Engine — All 4 Task Types', () => {
  describe('Multiple Choice Evaluation', () => {
    const mcData: MultipleChoiceTaskData = {
      type: 'multiple_choice',
      question: 'Which word starts with the letter B?',
      explanation: 'Butterfly starts with the letter B.',
      options: [
        { id: 'opt_1', text: 'Butterfly', isCorrect: true },
        { id: 'opt_2', text: 'Apple', isCorrect: false },
        { id: 'opt_3', text: 'Cat', isCorrect: false },
      ],
    }

    it('returns isCorrect=true with detailed explanation for correct choice', () => {
      const result = evaluateMultipleChoice(mcData, 'opt_1')
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
      expect(result.feedback).toContain('Spot on')
      expect(result.detailedExplanation).toContain('Butterfly')
    })

    it('returns isCorrect=false with gentle feedback and retry hint for incorrect choice', () => {
      const result = evaluateMultipleChoice(mcData, 'opt_2')
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(false)
      expect(result.feedback).toContain('Good try')
      expect(result.hint).toBeTruthy()
    })

    it('returns isValid=false when no option has been selected yet', () => {
      const result = evaluateMultipleChoice(mcData, null)
      expect(result.isValid).toBe(false)
      expect(result.isCorrect).toBe(false)
    })
  })

  describe('Matching Evaluation', () => {
    const matchData: MatchingTaskData = {
      type: 'matching',
      prompt: 'Match uppercase letters to lowercase partners',
      pairs: [
        { id: 'pair_1', left: 'A', right: 'a' },
        { id: 'pair_2', left: 'B', right: 'b' },
        { id: 'pair_3', left: 'C', right: 'c' },
      ],
    }

    it('returns isCorrect=true when all pairs are matched accurately', () => {
      const selections = {
        pair_1: 'a',
        pair_2: 'b',
        pair_3: 'c',
      }
      const result = evaluateMatching(matchData, selections)
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
      expect(result.feedback).toContain('Every single pair matched perfectly')
    })

    it('returns isCorrect=false when some pairs are mismatched', () => {
      const selections = {
        pair_1: 'a',
        pair_2: 'c', // incorrect
        pair_3: 'b', // incorrect
      }
      const result = evaluateMatching(matchData, selections)
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(false)
      expect(result.feedback).toContain('1 of 3 pairs are correct')
      expect(result.hint).toBeTruthy()
    })

    it('prompts the child gently if pairs are missing before checking', () => {
      const partialSelections = {
        pair_1: 'a',
      }
      const result = evaluateMatching(matchData, partialSelections)
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(false)
      expect(result.feedback).toContain('Please pair all items before checking')
    })
  })

  describe('Ordering / Sequencing Evaluation', () => {
    const orderData: OrderingTaskData = {
      type: 'ordering',
      prompt: 'Arrange story steps in sequence',
      items: [
        { id: 'item_seed', text: 'Plant the flower seed', correctOrder: 1 },
        { id: 'item_water', text: 'Water the garden soil', correctOrder: 2 },
        { id: 'item_bloom', text: 'Watch the flower bloom', correctOrder: 3 },
      ],
    }

    it('returns isCorrect=true when items are in exact chronological sequence', () => {
      const correctSequence = ['item_seed', 'item_water', 'item_bloom']
      const result = evaluateOrdering(orderData, correctSequence)
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
      expect(result.feedback).toContain('Sequence placed in exact harmony')
    })

    it('returns isCorrect=false when items are out of sequence', () => {
      const wrongSequence = ['item_bloom', 'item_seed', 'item_water']
      const result = evaluateOrdering(orderData, wrongSequence)
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(false)
      expect(result.feedback).toContain('Almost there')
      expect(result.hint).toBeTruthy()
    })

    it('returns isValid=false if sequence length does not match total items', () => {
      const incompleteSequence = ['item_seed']
      const result = evaluateOrdering(orderData, incompleteSequence)
      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain('Please include all steps')
    })
  })

  describe('Letter or Word Input Evaluation', () => {
    const letterData: LetterInputTaskData = {
      type: 'letter_input',
      prompt: 'Find the missing vowel',
      wordWithBlank: 'b_t',
      expectedLetter: 'a',
      acceptableAlternatives: ['e', 'i', 'o', 'u'], // bat, bet, bit, bot, but are all valid words
    }

    it('accepts exact expected letter', () => {
      const result = evaluateLetterInput(letterData, 'a')
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
      expect(result.feedback).toContain('Splendid')
    })

    it('handles uppercase input and extra whitespace with case-insensitivity', () => {
      const result = evaluateLetterInput(letterData, '  A  ')
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
    })

    it('accepts valid phonological alternatives when configured', () => {
      const result = evaluateLetterInput(letterData, 'e') // "bet"
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(true)
    })

    it('returns isCorrect=false with gentle feedback for non-matching input', () => {
      const result = evaluateLetterInput(letterData, 'z')
      expect(result.isValid).toBe(true)
      expect(result.isCorrect).toBe(false)
      expect(result.feedback).toContain('Not quite')
      expect(result.hint).toBeTruthy()
    })

    it('returns isValid=false for empty or whitespace-only input', () => {
      const result = evaluateLetterInput(letterData, '   ')
      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain('Type a letter')
    })
  })

  describe('Task Definition Validation & Resilient Fallback', () => {
    it('detects null or undefined task safely without throwing exceptions', () => {
      const result = validateTaskDefinition(null)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('missing')
    })

    it('detects missing options in multiple choice task', () => {
      const invalidTask: any = {
        id: 'bad_task_1',
        instruction: 'Choose',
        taskType: 'multiple_choice',
        data: { type: 'multiple_choice', options: [] },
      }
      const result = validateTaskDefinition(invalidTask)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('requires at least 2 options')
    })

    it('detects missing expected letter in letter input task', () => {
      const invalidTask: any = {
        id: 'bad_task_2',
        instruction: 'Type letter',
        taskType: 'letter_input',
        data: { type: 'letter_input', wordWithBlank: 'c_t' },
      }
      const result = validateTaskDefinition(invalidTask)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('expectedLetter')
    })

    it('evaluates task safely via master dispatcher and catches invalid definitions gracefully', () => {
      const invalidTask: any = {
        id: 'bad_task_3',
        instruction: 'Broken',
        taskType: 'multiple_choice',
        data: { type: 'multiple_choice', options: [] },
      }
      const evalResult = evaluateTask(invalidTask, 'opt_1')
      expect(evalResult.isValid).toBe(false)
      expect(evalResult.isCorrect).toBe(false)
      expect(evalResult.feedback).toContain('maintenance')
    })
  })
})

describe('Progression Service — Task Completion, Isolation & Persistence', () => {
  const STUDENT_A = 'student_alex_grade3'
  const STUDENT_B = 'student_sam_grade3'

  beforeEach(() => {
    progressionService.resetProgress(STUDENT_A)
    progressionService.resetProgress(STUDENT_B)
  })

  it('opening a level does NOT mark any task complete', () => {
    const record = progressionService.getLevelRecord('writing', 1, STUDENT_A)
    // Initially unrecorded or 0 tasks
    expect(record?.completedTasks || 0).toBe(0)
    expect(record?.completed || false).toBe(false)
  })

  it('records individual task completions without marking the whole level complete', () => {
    // Complete task 1
    const res1 = progressionService.recordTaskCompletion('writing', 1, 'task_writing_1_1', STUDENT_A)
    expect(res1.success).toBe(true)
    expect(res1.completedTasksCount).toBe(1)
    expect(res1.isLevelComplete).toBe(false)

    // Complete task 2
    const res2 = progressionService.recordTaskCompletion('writing', 1, 'task_writing_1_2', STUDENT_A)
    expect(res2.completedTasksCount).toBe(2)
    expect(res2.isLevelComplete).toBe(false)

    // Level status must still be 'available', NOT 'completed'
    expect(progressionService.getLevelStatus('writing', 1, progressionService.getProgress(STUDENT_A))).toBe('available')
  })

  it('protects against duplicate submissions (submitting task 1 twice does not double count)', () => {
    // Record task 1 once
    progressionService.recordTaskCompletion('writing', 1, 'task_writing_1_1', STUDENT_A)

    // Submit task 1 again (e.g. rapid double tap)
    const duplicateRes = progressionService.recordTaskCompletion('writing', 1, 'task_writing_1_1', STUDENT_A)
    expect(duplicateRes.completedTasksCount).toBe(1) // Still 1!
    expect(duplicateRes.completedTaskIds).toHaveLength(1)
  })

  it('restores previously completed tasks when a child navigates away and returns', () => {
    // Child completes tasks 1 and 2, then navigates away
    progressionService.recordTaskCompletion('visual', 1, 'task_visual_1_1', STUDENT_A)
    progressionService.recordTaskCompletion('visual', 1, 'task_visual_1_2', STUDENT_A)

    // Query record upon return
    const restoredRecord = progressionService.getLevelRecord('visual', 1, STUDENT_A)
    expect(restoredRecord).not.toBeNull()
    expect(restoredRecord?.completedTaskIds).toEqual(['task_visual_1_1', 'task_visual_1_2'])
    expect(restoredRecord?.completedTasks).toBe(2)
  })

  it('marks level complete and unlocks Level N+1 only after all five tasks are completed', () => {
    for (let t = 1; t <= 5; t++) {
      const res = progressionService.recordTaskCompletion('speaking', 1, `task_speaking_1_${t}`, STUDENT_A)
      if (t < 5) {
        expect(res.isLevelComplete).toBe(false)
      } else {
        expect(res.isLevelComplete).toBe(true)
      }
    }

    // Explicit level completion with stars
    const completeRes = progressionService.completeLevel('speaking', 1, 5, 3, STUDENT_A)
    expect(completeRes.success).toBe(true)

    // Level 1 is now completed, Level 2 is unlocked
    const currentProg = progressionService.getProgress(STUDENT_A)
    expect(progressionService.getLevelStatus('speaking', 1, currentProg)).toBe('completed')
    expect(progressionService.getLevelStatus('speaking', 2, currentProg)).toBe('available')
    expect(progressionService.getLevelStatus('speaking', 3, currentProg)).toBe('locked')
  })

  it('maintains per-student isolation (Student A progress never leaks to Student B)', () => {
    // Student A completes Level 1 in Social Adventure
    progressionService.completeLevel('social', 1, 5, 3, STUDENT_A)

    // Check Student A: Level 1 completed, Level 2 available
    const progA = progressionService.getProgress(STUDENT_A)
    expect(progressionService.getLevelStatus('social', 1, progA)).toBe('completed')
    expect(progressionService.getLevelStatus('social', 2, progA)).toBe('available')

    // Check Student B: Level 1 still available, Level 2 STILL locked!
    const progB = progressionService.getProgress(STUDENT_B)
    expect(progressionService.getLevelStatus('social', 1, progB)).toBe('available')
    expect(progressionService.getLevelStatus('social', 2, progB)).toBe('locked')
  })

  it('maintains per-world isolation (advancement in Writing never unlocks Speaking)', () => {
    progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
    progressionService.completeLevel('writing', 2, 5, 3, STUDENT_A)

    const prog = progressionService.getProgress(STUDENT_A)
    expect(progressionService.getLevelStatus('writing', 3, prog)).toBe('available')

    // All other worlds remain at Level 1 available, Level 2 locked
    expect(progressionService.getLevelStatus('speaking', 2, prog)).toBe('locked')
    expect(progressionService.getLevelStatus('visual', 2, prog)).toBe('locked')
    expect(progressionService.getLevelStatus('social', 2, prog)).toBe('locked')
  })

  it('replaying a completed level does not erase previous completion or stars', () => {
    // Complete with 3 stars
    progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)

    // Replay level
    const replayRes = progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A)
    expect(replayRes.success).toBe(true)

    const record = progressionService.getLevelRecord('writing', 1, STUDENT_A)
    expect(record?.completed).toBe(true)
    expect(record?.starsEarned).toBe(3)
  })

  it('reports explicit demo persistence mode when cloud backend is unconfigured', () => {
    const info = progressionService.getPersistenceInfo('demo_student')
    expect(info.isDemo).toBe(true)
    expect(info.isCloudSynced).toBe(false)
    expect(['localStorage', 'memory']).toContain(info.storageType)
    expect(info.statusLabel).toContain('Demo')
    expect(info.description).toBeTruthy()
  })
})
