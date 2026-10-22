import React, { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight, RefreshCw, Volume2 } from 'lucide-react'
import type {
  CurriculumTask,
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../types/curriculum.types'

interface TaskPlayerProps {
  task: CurriculumTask
  onTaskCompleted: (taskId: string) => void
  soundEnabled?: boolean
  highContrast?: boolean
}

export const TaskPlayer: React.FC<TaskPlayerProps> = ({
  task,
  onTaskCompleted,
  soundEnabled = true,
  highContrast = false,
}) => {
  // Task specific state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({})
  const [orderedItems, setOrderedItems] = useState<string[]>([])
  const [enteredLetter, setEnteredLetter] = useState<string>('')

  // Evaluation & Feedback state
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [showHint, setShowHint] = useState<boolean>(false)

  // Reset state on task transition
  useEffect(() => {
    setSelectedOptionId(null)
    setMatchingSelections({})
    setIsAnswerSubmitted(false)
    setIsCorrect(false)
    setFeedbackMessage('')
    setShowHint(false)
    setEnteredLetter('')

    if (task.data.type === 'ordering') {
      const data = task.data as OrderingTaskData
      // Scramble initially
      const scrambled = [...data.items].sort(() => 0.5 - Math.random()).map((i) => i.id)
      setOrderedItems(scrambled)
    }
  }, [task.id])

  // --- Handlers for Multiple Choice ---
  const handleCheckMultipleChoice = () => {
    const data = task.data as MultipleChoiceTaskData
    const chosen = data.options.find((o) => o.id === selectedOptionId)
    setIsAnswerSubmitted(true)

    if (chosen && chosen.isCorrect) {
      setIsCorrect(true)
      setFeedbackMessage(data.explanation || 'Spot on! Great thinking! 🌟')
    } else {
      setIsCorrect(false)
      setFeedbackMessage('Good try! Look at the hints and give it another go.')
    }
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
    const data = task.data as MatchingTaskData
    setIsAnswerSubmitted(true)
    let allMatched = true

    data.pairs.forEach((pair) => {
      if (matchingSelections[pair.id] !== pair.right) {
        allMatched = false
      }
    })

    if (allMatched) {
      setIsCorrect(true)
      setFeedbackMessage('Every single pair matched perfectly! 🌸')
    } else {
      setIsCorrect(false)
      setFeedbackMessage('Some pairs need another look. You can tap reset to try again!')
    }
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
    const data = task.data as OrderingTaskData
    setIsAnswerSubmitted(true)

    // Check if current order matches correctOrder sequence
    let isSequenceCorrect = true
    orderedItems.forEach((itemId, idx) => {
      const original = data.items.find((i) => i.id === itemId)
      if (original && original.correctOrder !== idx + 1) {
        isSequenceCorrect = false
      }
    })

    if (isSequenceCorrect) {
      setIsCorrect(true)
      setFeedbackMessage('Sequence placed in exact harmony! 🎶')
    } else {
      setIsCorrect(false)
      setFeedbackMessage('Almost there! Try adjusting the step cards.')
    }
  }

  // --- Handlers for Letter Input ---
  const handleCheckLetter = () => {
    const data = task.data as LetterInputTaskData
    setIsAnswerSubmitted(true)

    const trimmed = enteredLetter.trim().toLowerCase()
    const expected = data.expectedLetter.toLowerCase()
    const alternatives = (data.acceptableAlternatives || []).map((a) => a.toLowerCase())

    if (trimmed === expected || alternatives.includes(trimmed)) {
      setIsCorrect(true)
      setFeedbackMessage(`Splendid! '${data.expectedLetter.toUpperCase()}' completes the word! ✨`)
    } else {
      setIsCorrect(false)
      setFeedbackMessage(`Not quite. Try another sound!`)
    }
  }

  const handleAdvance = () => {
    onTaskCompleted(task.id)
  }

  return (
    <div className="space-y-6">
      {/* Task Header & Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#24483D]'
                : 'bg-[#CDEFE0] text-[#16563F]'
            }`}
          >
            {task.title}
          </span>
          {soundEnabled && (
            <span className="text-xs text-[#3D6355] flex items-center gap-1 font-semibold">
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Voice cues active</span>
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#24483D]">
          {task.instruction}
        </h3>
      </div>

      {/* Interactive Activity Area */}
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
            <p className="text-base font-bold text-[#24483D]">
              {(task.data as MultipleChoiceTaskData).question}
            </p>

            <div className="space-y-2.5">
              {(task.data as MultipleChoiceTaskData).options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => !isAnswerSubmitted && setSelectedOptionId(option.id)}
                  className={`w-full min-h-[48px] p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                    selectedOptionId === option.id
                      ? 'border-[#24483D] bg-[#E8DEFF] text-[#4A248A] shadow-xs'
                      : 'border-[rgba(36,72,61,0.15)] bg-white text-[#24483D] hover:bg-[#F2FAF6]'
                  }`}
                  aria-pressed={selectedOptionId === option.id}
                >
                  <span>{option.text}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedOptionId === option.id
                        ? 'border-[#4A248A] bg-[#4A248A] text-white'
                        : 'border-[#24483D]/30'
                    }`}
                  >
                    {selectedOptionId === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleCheckMultipleChoice}
                  className="min-h-[48px] px-6 py-3 rounded-xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
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
            <p className="text-base font-bold text-[#24483D]">
              {(task.data as MatchingTaskData).prompt}
            </p>

            <div className="space-y-3">
              {(task.data as MatchingTaskData).pairs.map((pair) => (
                <div
                  key={pair.id}
                  className="p-3.5 rounded-2xl bg-white border border-[rgba(36,72,61,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <span className="font-extrabold text-sm text-[#24483D]">{pair.left}</span>
                  <div className="flex flex-wrap gap-2">
                    {(task.data as MatchingTaskData).pairs.map((opt) => (
                      <button
                        key={opt.right}
                        type="button"
                        onClick={() => handleSelectMatchingPair(pair.id, opt.right)}
                        className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          matchingSelections[pair.id] === opt.right
                            ? 'bg-[#FFE0CC] text-[#7A3300] border-[#F8D2B8] shadow-xs'
                            : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.15)] hover:bg-[#F2FAF6]'
                        }`}
                      >
                        {opt.right}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCheckMatching}
                  className="min-h-[48px] px-6 py-3 rounded-xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Matches
                </button>
              </div>
            )}
          </div>
        )}

        {/* TYPE 3: ORDERING */}
        {task.data.type === 'ordering' && (
          <div className="space-y-4">
            <p className="text-base font-bold text-[#24483D]">
              {(task.data as OrderingTaskData).prompt}
            </p>

            <div className="space-y-2.5">
              {orderedItems.map((itemId, idx) => {
                const item = (task.data as OrderingTaskData).items.find((i) => i.id === itemId)
                if (!item) return null
                return (
                  <div
                    key={itemId}
                    className="p-3.5 rounded-2xl bg-white border border-[rgba(36,72,61,0.15)] flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#CDEFE0] text-[#16563F] font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-[#24483D]">
                        {item.text}
                      </span>
                    </div>

                    {!isAnswerSubmitted && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveOrderItem(idx, 'up')}
                          className="min-h-[40px] px-2.5 py-1 text-xs font-bold bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.2)] rounded-lg disabled:opacity-30"
                          title="Move step up"
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          disabled={idx === orderedItems.length - 1}
                          onClick={() => moveOrderItem(idx, 'down')}
                          className="min-h-[40px] px-2.5 py-1 text-xs font-bold bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.2)] rounded-lg disabled:opacity-30"
                          title="Move step down"
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
                  className="min-h-[48px] px-6 py-3 rounded-xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
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
            <p className="text-base font-bold text-[#24483D]">
              {(task.data as LetterInputTaskData).prompt}
            </p>

            <div className="py-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-[#24483D] bg-white px-6 py-3 rounded-2xl border-2 border-[rgba(36,72,61,0.15)] shadow-xs">
                {(task.data as LetterInputTaskData).wordWithBlank}
              </span>
            </div>

            <div className="max-w-xs mx-auto">
              <label htmlFor="letter-input-field" className="block text-xs font-bold text-[#3D6355] mb-1 text-center">
                Type the missing letter:
              </label>
              <input
                id="letter-input-field"
                type="text"
                maxLength={2}
                value={enteredLetter}
                onChange={(e) => setEnteredLetter(e.target.value)}
                disabled={isAnswerSubmitted}
                placeholder="e.g. e"
                className="w-full min-h-[48px] text-center text-xl font-extrabold rounded-xl border border-[rgba(36,72,61,0.25)] text-[#24483D] bg-white focus:outline-none focus:ring-3 focus:ring-[#24483D]"
              />
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={!enteredLetter.trim()}
                  onClick={handleCheckLetter}
                  className="min-h-[48px] px-8 py-3 rounded-xl font-extrabold text-sm sm:text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
                >
                  Check Letter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Evaluation Feedback Message */}
        {isAnswerSubmitted && (
          <div
            role="alert"
            className={`mt-6 p-4 rounded-2xl border flex items-start gap-3 ${
              isCorrect
                ? 'bg-[#CDEFE0] border-[#B2E6CE] text-[#16563F]'
                : 'bg-[#FFFBE6] border-[#FCE58D] text-[#664B00]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="flex-1">
              <p className="font-extrabold text-sm sm:text-base">{feedbackMessage}</p>

              <div className="pt-3 flex flex-wrap gap-3">
                {isCorrect ? (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm bg-[#16563F] text-white hover:bg-[#114331] shadow-xs transition-colors"
                  >
                    <span>Complete &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAnswerSubmitted(false)
                      setFeedbackMessage('')
                    }}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-white text-[#664B00] border border-[#FCE58D] hover:bg-[#FFFDF7]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Try Again</span>
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
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F8D2B8] text-xs text-[#7A3300] flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#7A3300] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-extrabold">Gentle Hint: </span>
                <span>{task.hint}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#7A3300] bg-[#FFF5EE] border border-[#F8D2B8] hover:bg-[#FFE0CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7A3300]"
            >
              <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Need a Gentle Hint?</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
