import type {
  CurriculumTask,
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../types/curriculum.types'

export interface TaskEvaluationResult {
  isValid: boolean
  isCorrect: boolean
  feedback: string
  hint?: string
  detailedExplanation?: string
  error?: string
}

export interface TaskValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates task definitions to ensure curriculum data is safe to render
 * and won't throw runtime exceptions.
 */
export function validateTaskDefinition(task: CurriculumTask | null | undefined): TaskValidationResult {
  if (!task) {
    return { isValid: false, error: 'Task definition is null or missing.' }
  }

  if (!task.id || !task.instruction || !task.taskType || !task.data) {
    return { isValid: false, error: `Task '${task?.id || 'unknown'}' has incomplete root properties.` }
  }

  const { data } = task

  switch (task.taskType) {
    case 'multiple_choice': {
      const mcData = data as MultipleChoiceTaskData
      if (!mcData.options || !Array.isArray(mcData.options) || mcData.options.length < 2) {
        return { isValid: false, error: 'Multiple choice task requires at least 2 options.' }
      }
      const hasCorrect = mcData.options.some((o) => o.isCorrect)
      if (!hasCorrect) {
        return { isValid: false, error: 'Multiple choice task has no correct option configured.' }
      }
      return { isValid: true }
    }

    case 'matching': {
      const matchData = data as MatchingTaskData
      if (!matchData.pairs || !Array.isArray(matchData.pairs) || matchData.pairs.length < 1) {
        return { isValid: false, error: 'Matching task requires at least 1 pair.' }
      }
      const hasInvalidPairs = matchData.pairs.some((p) => !p.id || !p.left || !p.right)
      if (hasInvalidPairs) {
        return { isValid: false, error: 'Matching task has one or more incomplete pairs.' }
      }
      return { isValid: true }
    }

    case 'ordering': {
      const orderData = data as OrderingTaskData
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length < 2) {
        return { isValid: false, error: 'Ordering task requires at least 2 sequence items.' }
      }
      const hasInvalidItems = orderData.items.some((i) => !i.id || !i.text || typeof i.correctOrder !== 'number')
      if (hasInvalidItems) {
        return { isValid: false, error: 'Ordering task has one or more incomplete sequence items.' }
      }
      return { isValid: true }
    }

    case 'letter_input': {
      const letterData = data as LetterInputTaskData
      if (!letterData.expectedLetter || typeof letterData.expectedLetter !== 'string') {
        return { isValid: false, error: 'Letter input task requires an expectedLetter string.' }
      }
      if (!letterData.wordWithBlank) {
        return { isValid: false, error: 'Letter input task requires a wordWithBlank prompt.' }
      }
      return { isValid: true }
    }

    default:
      return { isValid: false, error: `Unrecognised task type '${(task as any).taskType}'.` }
  }
}

/**
 * Pure evaluator for Multiple Choice tasks.
 */
export function evaluateMultipleChoice(
  data: MultipleChoiceTaskData,
  selectedOptionId: string | null
): TaskEvaluationResult {
  if (!selectedOptionId) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'Please choose an option to check your answer.',
    }
  }

  const option = data.options.find((o) => o.id === selectedOptionId)
  if (!option) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'The selected option could not be found.',
      error: `Option ID ${selectedOptionId} is not in options list.`,
    }
  }

  if (option.isCorrect) {
    return {
      isValid: true,
      isCorrect: true,
      feedback: 'Spot on! Great thinking! 🌟',
      detailedExplanation: data.explanation || `You correctly identified: "${option.text}"`,
    }
  }

  return {
    isValid: true,
    isCorrect: false,
    feedback: 'Good try! Look at the hints and give it another go.',
    hint: data.explanation ? 'Review the clue carefully and try again.' : undefined,
  }
}

/**
 * Pure evaluator for Matching tasks.
 * Validates that every configured pair has been matched correctly.
 */
export function evaluateMatching(
  data: MatchingTaskData,
  selections: Record<string, string>
): TaskEvaluationResult {
  if (!data.pairs || data.pairs.length === 0) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'No matching pairs configured.',
    }
  }

  const totalPairs = data.pairs.length
  let matchedCount = 0
  let missingSelections = 0

  for (const pair of data.pairs) {
    const selectedRight = selections[pair.id]
    if (!selectedRight) {
      missingSelections++
    } else if (selectedRight === pair.right) {
      matchedCount++
    }
  }

  if (missingSelections > 0) {
    return {
      isValid: true,
      isCorrect: false,
      feedback: `Please pair all items before checking (${totalPairs - missingSelections} of ${totalPairs} selected).`,
      hint: 'Tap an option for each row to connect them.',
    }
  }

  if (matchedCount === totalPairs) {
    return {
      isValid: true,
      isCorrect: true,
      feedback: 'Every single pair matched perfectly! 🌸',
      detailedExplanation: `All ${totalPairs} pairs are in harmony!`,
    }
  }

  return {
    isValid: true,
    isCorrect: false,
    feedback: `${matchedCount} of ${totalPairs} pairs are correct. You can adjust and try again!`,
    hint: 'Look closely at the items that are still mismatched.',
  }
}

/**
 * Pure evaluator for Ordering / Sequencing tasks.
 * Validates that the list of item IDs matches the ascending correctOrder property.
 */
export function evaluateOrdering(
  data: OrderingTaskData,
  orderedItemIds: string[]
): TaskEvaluationResult {
  if (!data.items || data.items.length === 0) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'No ordering items configured.',
    }
  }

  if (orderedItemIds.length !== data.items.length) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'Please include all steps in your sequence.',
    }
  }

  let isSequenceCorrect = true
  for (let idx = 0; idx < orderedItemIds.length; idx++) {
    const itemId = orderedItemIds[idx]
    const item = data.items.find((i) => i.id === itemId)
    if (!item || item.correctOrder !== idx + 1) {
      isSequenceCorrect = false
      break
    }
  }

  if (isSequenceCorrect) {
    return {
      isValid: true,
      isCorrect: true,
      feedback: 'Sequence placed in exact harmony! 🎶',
      detailedExplanation: 'Every step is in its right chronological position.',
    }
  }

  return {
    isValid: true,
    isCorrect: false,
    feedback: 'Almost there! The steps are slightly out of order.',
    hint: 'Think about what happens at the very beginning and at the end.',
  }
}

/**
 * Pure evaluator for Letter / Word Input tasks.
 * Handles case-insensitivity, whitespace trimming, and acceptable alternatives.
 */
export function evaluateLetterInput(
  data: LetterInputTaskData,
  enteredInput: string
): TaskEvaluationResult {
  const trimmed = (enteredInput || '').trim().toLowerCase()

  if (!trimmed) {
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'Type a letter or sound to check your answer.',
    }
  }

  const expected = (data.expectedLetter || '').trim().toLowerCase()
  const alternatives = (data.acceptableAlternatives || []).map((alt) => alt.trim().toLowerCase())

  if (trimmed === expected || alternatives.includes(trimmed)) {
    return {
      isValid: true,
      isCorrect: true,
      feedback: `Splendid! '${expected.toUpperCase()}' completes the word! ✨`,
      detailedExplanation: `"${data.wordWithBlank.replace('_', expected.toUpperCase())}" is complete!`,
    }
  }

  return {
    isValid: true,
    isCorrect: false,
    feedback: 'Not quite. Try sounding it out again!',
    hint: 'Listen to the sound in the word or look at the hint below.',
  }
}

/**
 * Master dispatcher function to evaluate any task from its typed definition.
 */
export function evaluateTask(task: CurriculumTask, userInput: any): TaskEvaluationResult {
  const validation = validateTaskDefinition(task)
  if (!validation.isValid) {
    console.error(`Curriculum validation error on task '${task?.id}':`, validation.error)
    return {
      isValid: false,
      isCorrect: false,
      feedback: 'This task definition is incomplete or undergoing maintenance.',
      error: validation.error,
    }
  }

  switch (task.taskType) {
    case 'multiple_choice':
      return evaluateMultipleChoice(task.data as MultipleChoiceTaskData, userInput)

    case 'matching':
      return evaluateMatching(task.data as MatchingTaskData, userInput || {})

    case 'ordering':
      return evaluateOrdering(task.data as OrderingTaskData, userInput || [])

    case 'letter_input':
      return evaluateLetterInput(task.data as LetterInputTaskData, userInput || '')

    default:
      return {
        isValid: false,
        isCorrect: false,
        feedback: 'Unsupported task type.',
        error: `Unknown taskType ${(task as any).taskType}`,
      }
  }
}
