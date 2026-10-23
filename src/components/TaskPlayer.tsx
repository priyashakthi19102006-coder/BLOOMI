import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Volume2,
  AlertTriangle,
  Sparkles,
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
  const [showExample, setShowExample] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
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
    setShowExample(false)
    setIsSpeaking(false)
    setEnteredLetter('')
    setHasCompletedCurrentTask(false)

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    if (task?.data?.type === 'ordering') {
      const data = task.data as OrderingTaskData
      if (Array.isArray(data.items)) {
        // Scramble initially
        const scrambled = [...data.items].sort(() => 0.5 - Math.random()).map((i) => i.id)
        setOrderedItems(scrambled)
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [task?.id])

  // Fallback UI for incomplete or invalid task definitions
  if (!validation.isValid) {
    console.error(`[BLOOMI Curriculum Error] Invalid task data for task '${task?.id}':`, validation.error)
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0520] border-2 border-[#ffd700]/50 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#160a33] text-[#ffd700] flex items-center justify-center border border-[#ffd700]/40">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-extrabold font-fredoka text-white">
          Activity Portal Synchronising
        </h3>
        <p className="text-sm text-purple-200/80 max-w-md mx-auto">
          This learning activity is receiving a quick update. You can safely continue your adventure.
        </p>
        <button
          type="button"
          onClick={() => onTaskCompleted(task.id)}
          className="btn-neon-pink min-h-[48px] px-6 py-2.5 rounded-2xl font-bold text-sm"
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

  const handlePlayVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const textToSpeak = task.audioPromptText || task.spokenInstruction || task.instruction
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.9 // gentle, clear pace for Grade 3 learners
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`space-y-6 ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Task Header & Prompt */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#ff2a85]/20 text-pink-300 border border-[#ff2a85]/40"
          >
            {task.title}
          </span>

          <div className="flex items-center gap-2">
            {/* User-initiated audio button (iPad Safari friendly) */}
            {soundEnabled && (
              <button
                type="button"
                onClick={handlePlayVoice}
                aria-label={isSpeaking ? 'Stop spoken voice' : 'Listen to spoken instructions'}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                  isSpeaking
                    ? 'bg-[#ff2a85] text-white border-[#ff2a85] shadow-[0_0_15px_#ff2a85] animate-pulse'
                    : 'bg-[#160a33] text-purple-200 border-[#a855f7]/40 hover:border-[#ff2a85]'
                }`}
              >
                <Volume2 className="w-4 h-4 text-current" aria-hidden="true" />
                <span>{isSpeaking ? 'Reading Aloud...' : 'Read to Me'}</span>
              </button>
            )}

            {task.visualDemonstration && (
              <button
                type="button"
                onClick={() => setShowExample((prev) => !prev)}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                  showExample
                    ? 'bg-[#a855f7] text-white border-[#a855f7] shadow-[0_0_15px_#a855f7]'
                    : 'bg-[#160a33] text-purple-200 border-[#a855f7]/40 hover:border-[#ff2a85]'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-current" aria-hidden="true" />
                <span>{showExample ? 'Hide Example' : 'See Example'}</span>
              </button>
            )}
          </div>
        </div>

        <h3
          className={`font-extrabold font-fredoka leading-snug text-white ${
            largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {task.instruction}
        </h3>

        {/* Visual Demonstration Example Panel */}
        {showExample && task.visualDemonstration && (
          <div
            role="region"
            aria-label="Visual Demonstration Example"
            className="p-4 rounded-2xl border-2 border-[#a855f7]/50 bg-[#160a33] text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-xl" aria-hidden="true">💡</span>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-pink-300">Visual Guide / Example</h4>
                <p className="text-sm font-semibold text-white">{task.visualDemonstration}</p>
              </div>
            </div>
          </div>
        )}

        {/* Supported Response Methods Pill Tags */}
        {task.supportedResponseMethods && task.supportedResponseMethods.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-purple-300">Ways to answer:</span>
            {task.supportedResponseMethods.map((m, idx) => (
              <span
                key={idx}
                className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#160a33] text-[#00f5ff] border border-[#00f5ff]/30"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Activity Card - Dark Neon Container */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-black border-pink-400 text-white'
            : 'bg-[#0e0520] border-[#a855f7]/40 text-white shadow-[0_0_25px_rgba(168,85,247,0.15)]'
        }`}
      >
        {/* TYPE 1: MULTIPLE CHOICE */}
        {task.data.type === 'multiple_choice' && (
          <div className="space-y-4">
            <p className={`font-bold text-purple-100 ${largeFont ? 'text-lg' : 'text-base'}`}>
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
                    className={`w-full min-h-[52px] p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                      isSelected
                        ? 'border-[#ff2a85] bg-[#ff2a85]/20 text-white shadow-[0_0_20px_rgba(255,42,133,0.35)] scale-[1.01]'
                        : 'border-[#a855f7]/30 bg-[#160a33] text-purple-100 hover:border-[#ff2a85]/60 hover:bg-[#1a0c3d]'
                    } ${largeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}
                  >
                    <span>{option.text}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#ff2a85] bg-[#ff2a85] text-white shadow-[0_0_8px_#ff2a85]'
                          : 'border-[#a855f7]/50'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
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
                  className="btn-neon-pink min-h-[48px] px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
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
            <p className={`font-bold text-purple-100 ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as MatchingTaskData).prompt}
            </p>

            <div className="space-y-3.5">
              {(task.data as MatchingTaskData).pairs.map((pair) => (
                <div
                  key={pair.id}
                  className="p-4 rounded-2xl border-2 border-[#a855f7]/30 bg-[#160a33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <span className="font-extrabold text-sm sm:text-base text-white">
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
                          className={`min-h-[46px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2a85] ${
                            isChosen
                              ? 'bg-[#ff2a85] text-white border-[#ff2a85] shadow-[0_0_15px_#ff2a85]'
                              : 'bg-[#0e0520] text-purple-200 border-[#a855f7]/40 hover:border-[#ff2a85]'
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
                  className="btn-neon-pink min-h-[48px] px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base"
                >
                  Check Matches
                </button>
                {Object.keys(matchingSelections).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetMatching}
                    className="min-h-[48px] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-purple-200 bg-[#160a33] border border-[#a855f7]/40 hover:border-[#ff2a85]"
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
            <p className={`font-bold text-purple-100 ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as OrderingTaskData).prompt}
            </p>

            <div className="space-y-3">
              {orderedItems.map((itemId, idx) => {
                const item = (task.data as OrderingTaskData).items.find((i) => i.id === itemId)
                if (!item) return null
                return (
                  <div
                    key={itemId}
                    className="p-4 rounded-2xl border-2 border-[#a855f7]/30 bg-[#160a33] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className="w-8 h-8 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/50 font-mono"
                      >
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-white">
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
                          className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold bg-[#0e0520] text-purple-200 border border-[#a855f7]/40 rounded-xl disabled:opacity-30 hover:border-[#ff2a85] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          disabled={idx === orderedItems.length - 1}
                          onClick={() => moveOrderItem(idx, 'down')}
                          aria-label={`Move ${item.text} down`}
                          className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold bg-[#0e0520] text-purple-200 border border-[#a855f7]/40 rounded-xl disabled:opacity-30 hover:border-[#ff2a85] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
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
                  className="btn-neon-pink min-h-[48px] px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base"
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
            <p className={`font-bold text-purple-100 ${largeFont ? 'text-lg' : 'text-base'}`}>
              {(task.data as LetterInputTaskData).prompt}
            </p>

            <div className="py-4 text-center">
              <span
                className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono px-7 py-3.5 rounded-2xl border-2 border-[#ff2a85]/60 bg-[#160a33] text-white shadow-[0_0_20px_rgba(255,42,133,0.3)] inline-block"
              >
                {(task.data as LetterInputTaskData).wordWithBlank}
              </span>
            </div>

            <div className="max-w-xs mx-auto space-y-1.5">
              <label
                htmlFor="letter-input-field"
                className="block text-xs font-bold text-center text-purple-200"
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
                className="w-full min-h-[50px] text-center text-2xl font-extrabold rounded-2xl border-2 border-[#a855f7]/40 bg-[#160a33] text-white transition-all focus:outline-none focus:border-[#ff2a85] focus:shadow-[0_0_15px_#ff2a85]"
              />
            </div>

            {!isAnswerSubmitted && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={!enteredLetter.trim()}
                  onClick={handleCheckLetter}
                  className="btn-neon-pink min-h-[48px] px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
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
                ? 'bg-[#00f5ff]/15 border-[#00f5ff] text-[#00f5ff] shadow-[0_0_25px_rgba(0,245,255,0.3)]'
                : 'bg-[#ff2a85]/15 border-[#ff2a85] text-pink-200 shadow-[0_0_25px_rgba(255,42,133,0.25)]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-[#00f5ff]" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-[#ff2a85]" aria-hidden="true" />
            )}
            <div className="flex-1 space-y-2">
              <p className={`font-extrabold text-white ${largeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                {feedbackMessage}
              </p>

              {isCorrect && detailedExplanation && (
                <p className="text-xs sm:text-sm font-medium text-cyan-200/90">
                  {detailedExplanation}
                </p>
              )}

              {isCorrect ? (
                <div className="p-2.5 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-xs font-semibold text-cyan-200 flex items-center gap-2">
                  <span className="text-sm">🌟</span>
                  <span>Companion Cheer: Fantastic effort and strategy! Your hard work is blooming.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/30 text-xs font-semibold text-pink-200 flex items-center gap-2">
                  <span className="text-sm">🌱</span>
                  <span>Companion Cheer: Every attempt builds your learning pathway! Take your time, try a hint if helpful, and try again.</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-3">
                {isCorrect ? (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    disabled={hasCompletedCurrentTask}
                    className="btn-neon-pink min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm"
                  >
                    <span>Complete &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#160a33] text-pink-200 border-2 border-[#ff2a85]/60 hover:border-[#ff2a85] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                  >
                    <RefreshCw className="w-4 h-4 text-[#ff2a85]" aria-hidden="true" />
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
              className={`p-4 rounded-2xl border border-[#ffd700]/50 bg-[#160a33] text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-start gap-2.5 ${
                largeFont ? 'text-sm' : 'text-xs'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#ffd700]" aria-hidden="true" />
              <div>
                <span className="font-extrabold">Gentle Hint: </span>
                <span className="text-amber-200/90">{task.hint}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#ffd700] bg-[#160a33] border border-[#ffd700]/40 hover:border-[#ffd700] hover:bg-[#201040] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
            >
              <Lightbulb className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span>Need a Gentle Hint?</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
