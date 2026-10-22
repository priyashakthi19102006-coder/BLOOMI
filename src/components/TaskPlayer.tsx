import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Volume2,
  AlertTriangle,
} from 'lucide-react'
import type {
  CurriculumTask,
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../types/curriculum.types'
import {
  validateTaskDefinition,
  evaluateMultipleChoice,
  evaluateMatching,
  evaluateOrdering,
  evaluateLetterInput,
} from '../services/taskEvaluator'

interface TaskPlayerProps {
  task: CurriculumTask
  onTaskCompleted: (taskId: string) => void
  soundEnabled?: boolean
  highContrast?: boolean
  largeFont?: boolean
  reducedMotion?: boolean
}

export const TaskPlayer: React.FC<TaskPlayerProps> = ({
  task,
  onTaskCompleted,
  soundEnabled = true,
  highContrast = false,
  largeFont = false,
  reducedMotion = false,
}) => {
  // Validate task definition early
  const validation = validateTaskDefinition(task)

  // Task-specific state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({})
  const [orderedItems, setOrderedItems] = useState<string[]>([])
  const [enteredLetter, setEnteredLetter] = useState<string>('')

  // Evaluation & Feedback state
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [detailedExplanation, setDetailedExplanation] = useState<string | undefined>()
  const [showHint, setShowHint] = useState<boolean>(false)
  const [hasCompletedCurrentTask, setHasCompletedCurrentTask] = useState<boolean>(false)

  // Reset state on task transition
  useEffect(() => {
    setSelectedOptionId(null)
    setMatchingSelections({})
    setIsAnswerSubmitted(false)
    setIsCorrect(false)
    setFeedbackMessage('')
    setDetailedExplanation(undefined)
    setShowHint(false)
    setEnteredLetter('')
    setHasCompletedCurrentTask(false)

    if (task?.data?.type === 'ordering') {
      const data = task.data as OrderingTaskData
      if (Array.isArray(data.items)) {
        // Scramble initially deterministically or pseudo-randomly
        const scrambled = [...data.items].sort(() => 0.5 - Math.random()).map((i) => i.id)
        setOrderedItems(scrambled)
      }
    }
  }, [task?.id])

  // Fallback UI for incomplete or invalid task definitions
  if (!validation.isValid) {
    console.error(`[BLOOMI Curriculum Error] Invalid task data for task '${task?.id}':`, validation.error)
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBE6] border-2 border-[#FCE58D] text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0B3] text-[#664B00] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-extrabold font-fredoka text-[#664B00]">
          Activity Card Under Bloom Care
        </h3>
        <p className="text-sm text-[#7A3300] max-w-md mx-auto">
          This learning activity is receiving a quick update. You can safely continue to the next task in your adventure.
        </p>
        <button
          type="button"
          onClick={() => onTaskCompleted(task.id)}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#24483D] text-[#FFFDF7] font-bold text-sm shadow-xs hover:bg-[#152E26] focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
        >
          Skip to Next Task →
        </button>
      </div>
    )
  }

  // --- Handlers for Multiple Choice ---
  const handleCheckMultipleChoice = () => {
    if (isAnswerSubmitted) return
    const data = task.data as MultipleChoiceTaskData
    const result = evaluateMultipleChoice(data, selectedOptionId)
    setIsAnswerSubmitted(true)
    setIsCorrect(result.isCorrect)
    setFeedbackMessage(result.feedback)
    setDetailedExplanation(result.detailedExplanation)
  }

  // --- Handlers for Matching ---
  const handleSelectMatchingPair = (leftId: string, rightText: string) => {
    if (isAnswerSubmitted) return
    setMatchingSelections((prev) => ({
      ...prev,
      [leftId]: rightText,
    }))
  }

  const handleCheckMatching = () => {
    if (isAnswerSubmitted) return
    const data = task.data as MatchingTaskData
    const result = evaluateMatching(data, matchingSelections)
    setIsAnswerSubmitted(true)
    setIsCorrect(result.isCorrect)
    setFeedbackMessage(result.feedback)
    setDetailedExplanation(result.detailedExplanation)
  }

  const handleResetMatching = () => {
    setMatchingSelections({})
    setIsAnswerSubmitted(false)
    setIsCorrect(false)
    setFeedbackMessage('')
    setDetailedExplanation(undefined)
  }

  // --- Handlers for Ordering ---
  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswerSubmitted) return
    const newOrder = [...orderedItems]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newOrder.length) return
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIdx]
    newOrder[targetIdx] = temp
    setOrderedItems(newOrder)
  }

  const handleCheckOrdering = () => {
    if (isAnswerSubmitted) return
    const data = task.data as OrderingTaskData
    const result = evaluateOrdering(data, orderedItems)
    setIsAnswerSubmitted(true)
    setIsCorrect(result.isCorrect)
    setFeedbackMessage(result.feedback)
    setDetailedExplanation(result.detailedExplanation)
  }

  // --- Handlers for Letter Input ---
  const handleCheckLetter = () => {
    if (isAnswerSubmitted) return
    const data = task.data as LetterInputTaskData
    const result = evaluateLetterInput(data, enteredLetter)
    setIsAnswerSubmitted(true)
    setIsCorrect(result.isCorrect)
    setFeedbackMessage(result.feedback)
    setDetailedExplanation(result.detailedExplanation)
  }

  // --- Advance to next task (with duplicate submission guard) ---
  const handleAdvance = () => {
    if (hasCompletedCurrentTask) return
    setHasCompletedCurrentTask(true)
    onTaskCompleted(task.id)
  }

  const handleRetry = () => {
    setIsAnswerSubmitted(false)
    setIsCorrect(false)
    setFeedbackMessage('')
    setDetailedExplanation(undefined)
  }

  return (
    <div className={`space-y-6 ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Task Header & Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#0C1210]'
                : 'bg-[#CDEFE0] text-[#16563F]'
            }`}
          >
            {task.title}
          </span>
          {soundEnabled && (
            <span
              className={`text-xs flex items-center gap-1.5 font-semibold ${
                highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
              }`}
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>Voice Guidance Ready</span>
            </span>
          )}
        </div>

        <h3
          className={`font-extrabold font-fredoka leading-snug ${
            largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          } ${highContrast ? 'text-[#FFFDF7]' : 'text-[#24483D]'}`}
        >
          {task.instruction}
        </h3>
      </div>

      {/* Interactive Activity Card */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.15)] text-[#24483D]'
        }`}
      >
        {/* TYPE 1: MULTIPLE CHOICE */}
        {task.data.type === 'multiple_choice' && (
          <div className="space-y-4">
            <p className={`font-bold ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as MultipleChoiceTaskData).question}
            </p>

            <div className="space-y-3" role="radiogroup" aria-label="Multiple choice options">
              {(task.data as MultipleChoiceTaskData).options.map((option) => {
                const isSelected = selectedOptionId === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => !isAnswerSubmitted && setSelectedOptionId(option.id)}
                    className={`w-full min-h-[52px] p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-[#CDEFE0] ${
                      isSelected
                        ? highContrast
                          ? 'border-[#FFF0B3] bg-[#24483D] text-[#FFF0B3] shadow-xs'
                          : 'border-[#24483D] bg-[#E8DEFF] text-[#4A248A] shadow-xs'
                        : highContrast
                        ? 'border-[#3D6355] bg-[#152E26] text-[#FFFDF7] hover:border-[#FFF0B3]'
                        : 'border-[rgba(36,72,61,0.15)] bg-white text-[#24483D] hover:bg-[#F2FAF6]'
                    } ${largeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}
                  >
                    <span>{option.text}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? highContrast
                            ? 'border-[#FFF0B3] bg-[#FFF0B3] text-[#0C1210]'
                            : 'border-[#4A248A] bg-[#4A248A] text-white'
                          : 'border-[#24483D]/40'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleCheckMultipleChoice}
                  className="min-h-[48px] px-7 py-3 rounded-2xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Answer
                </button>
              </div>
            )}
          </div>
        )}

        {/* TYPE 2: MATCHING */}
        {task.data.type === 'matching' && (
          <div className="space-y-4">
            <p className={`font-bold ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as MatchingTaskData).prompt}
            </p>

            <div className="space-y-3.5">
              {(task.data as MatchingTaskData).pairs.map((pair) => (
                <div
                  key={pair.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    highContrast
                      ? 'bg-[#152E26] border-[#3D6355]'
                      : 'bg-white border-[rgba(36,72,61,0.12)]'
                  }`}
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#24483D] dark:text-[#FFFDF7]">
                    {pair.left}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(task.data as MatchingTaskData).pairs.map((opt) => {
                      const isChosen = matchingSelections[pair.id] === opt.right
                      return (
                        <button
                          key={opt.right}
                          type="button"
                          aria-pressed={isChosen}
                          onClick={() => handleSelectMatchingPair(pair.id, opt.right)}
                          className={`min-h-[46px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                            isChosen
                              ? highContrast
                                ? 'bg-[#FFF0B3] text-[#0C1210] border-[#FFF0B3] shadow-xs'
                                : 'bg-[#FFE0CC] text-[#7A3300] border-[#F8D2B8] shadow-xs'
                              : highContrast
                              ? 'bg-[#0C1210] text-[#FFFDF7] border-[#3D6355] hover:bg-[#24483D]'
                              : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.15)] hover:bg-[#F2FAF6]'
                          }`}
                        >
                          {opt.right}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheckMatching}
                  className="min-h-[48px] px-7 py-3 rounded-2xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Matches
                </button>
                {Object.keys(matchingSelections).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetMatching}
                    className="min-h-[48px] px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-[#7A3300] bg-[#FFF5EE] border border-[#F8D2B8] hover:bg-[#FFE0CC] transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TYPE 3: ORDERING */}
        {task.data.type === 'ordering' && (
          <div className="space-y-4">
            <p className={`font-bold ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as OrderingTaskData).prompt}
            </p>

            <div className="space-y-3">
              {orderedItems.map((itemId, idx) => {
                const item = (task.data as OrderingTaskData).items.find((i) => i.id === itemId)
                if (!item) return null
                return (
                  <div
                    key={itemId}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-xs ${
                      highContrast
                        ? 'bg-[#152E26] border-[#3D6355]'
                        : 'bg-white border-[rgba(36,72,61,0.15)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                          highContrast
                            ? 'bg-[#FFF0B3] text-[#0C1210]'
                            : 'bg-[#CDEFE0] text-[#16563F]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className={`font-extrabold text-sm sm:text-base ${
                          highContrast ? 'text-[#FFFDF7]' : 'text-[#24483D]'
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>

                    {!isAnswerSubmitted && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveOrderItem(idx, 'up')}
                          aria-label={`Move ${item.text} up`}
                          className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.2)] rounded-xl disabled:opacity-30 hover:bg-[#CDEFE0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          disabled={idx === orderedItems.length - 1}
                          onClick={() => moveOrderItem(idx, 'down')}
                          aria-label={`Move ${item.text} down`}
                          className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.2)] rounded-xl disabled:opacity-30 hover:bg-[#CDEFE0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                        >
                          ↓ Down
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCheckOrdering}
                  className="min-h-[48px] px-7 py-3 rounded-2xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Sequence
                </button>
              </div>
            )}
          </div>
        )}

        {/* TYPE 4: LETTER INPUT */}
        {task.data.type === 'letter_input' && (
          <div className="space-y-4">
            <p className={`font-bold ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as LetterInputTaskData).prompt}
            </p>

            <div className="py-4 text-center">
              <span
                className={`text-3xl sm:text-4xl font-extrabold tracking-widest font-mono px-7 py-3.5 rounded-2xl border-2 shadow-xs ${
                  highContrast
                    ? 'bg-[#152E26] border-[#FFF0B3] text-[#FFF0B3]'
                    : 'bg-white border-[rgba(36,72,61,0.15)] text-[#24483D]'
                }`}
              >
                {(task.data as LetterInputTaskData).wordWithBlank}
              </span>
            </div>

            <div className="max-w-xs mx-auto space-y-1.5">
              <label
                htmlFor="letter-input-field"
                className={`block text-xs font-bold text-center ${
                  highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
                }`}
              >
                Type the missing letter:
              </label>
              <input
                id="letter-input-field"
                type="text"
                maxLength={4}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={enteredLetter}
                onChange={(e) => setEnteredLetter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnswerSubmitted && enteredLetter.trim()) {
                    handleCheckLetter()
                  }
                }}
                disabled={isAnswerSubmitted}
                placeholder="e.g. e"
                className={`w-full min-h-[50px] text-center text-2xl font-extrabold rounded-2xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0] ${
                  highContrast
                    ? 'bg-[#152E26] border-[#3D6355] text-[#FFFDF7]'
                    : 'bg-white border-[rgba(36,72,61,0.25)] text-[#24483D]'
                }`}
              />
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={!enteredLetter.trim()}
                  onClick={handleCheckLetter}
                  className="min-h-[48px] px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Letter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Immediate, Gentle Feedback Area */}
        {isAnswerSubmitted && (
          <div
            role="alert"
            className={`mt-6 p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${
              isCorrect
                ? highContrast
                  ? 'bg-[#152E26] border-[#CDEFE0] text-[#FFFDF7]'
                  : 'bg-[#CDEFE0] border-[#B2E6CE] text-[#16563F]'
                : highContrast
                ? 'bg-[#241A00] border-[#FFF0B3] text-[#FFF0B3]'
                : 'bg-[#FFFBE6] border-[#FCE58D] text-[#664B00]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="flex-1 space-y-2">
              <p className={`font-extrabold ${largeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                {feedbackMessage}
              </p>

              {isCorrect && detailedExplanation && (
                <p className="text-xs sm:text-sm font-medium opacity-90">
                  {detailedExplanation}
                </p>
              )}

              <div className="pt-2 flex flex-wrap gap-3">
                {isCorrect ? (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    disabled={hasCompletedCurrentTask}
                    className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm bg-[#16563F] text-white hover:bg-[#114331] shadow-xs transition-colors focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                  >
                    <span>Complete &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#664B00] border-2 border-[#FCE58D] hover:bg-[#FFFDF7] transition-colors focus:outline-none focus:ring-3 focus:ring-[#FCE58D]"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    <span>Try Again Without Worry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gentle Hint Section */}
      {task.hint && (
        <div className="pt-1">
          {showHint ? (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-2.5 ${
                highContrast
                  ? 'bg-[#152E26] border-[#3D6355] text-[#FFFDF7]'
                  : 'bg-[#FFF9F5] border-[#F8D2B8] text-[#7A3300]'
              } ${largeFont ? 'text-sm' : 'text-xs'}`}
            >
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-[#7A3300]" aria-hidden="true" />
              <div>
                <span className="font-extrabold">Gentle Hint: </span>
                <span>{task.hint}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#7A3300] bg-[#FFF5EE] border border-[#F8D2B8] hover:bg-[#FFE0CC] transition-colors focus:outline-none focus:ring-3 focus:ring-[#7A3300]"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              <span>Need a Gentle Hint?</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
