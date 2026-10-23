import { describe, it, expect } from 'vitest'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import type {
  WorldId,
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../types/curriculum.types'

describe('Curriculum Content Validation & Anti-Placeholder Integrity', () => {
  const worlds: WorldId[] = ['writing', 'speaking', 'visual', 'social']

  it('contains exactly 4 worlds, 50 levels per world, and 5 tasks per level (1,000 tasks total)', () => {
    expect(curriculumService.getAllWorlds().length).toBe(4)
    expect(curriculumService.getTotalLevelCount()).toBe(200)
    expect(curriculumService.getTotalTaskCount()).toBe(1000)
  })

  it('guarantees unique IDs for all 1,000 tasks', () => {
    const taskIds = new Set<string>()
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          expect(taskIds.has(task.id)).toBe(false)
          taskIds.add(task.id)
        })
      })
    })
    expect(taskIds.size).toBe(1000)
  })

  it('verifies ZERO placeholder phrases across all 1,000 tasks in every world', () => {
    const bannedPlaceholders = [
      'primary choice',
      'alternative letter pattern',
      'contrast practice tile',
      'sound match a',
      'sound match b',
      'star pattern alpha',
      'constellation alpha',
      'the accurate spoken word',
      'starting letter',
      'vowel center',
      'ending sound',
      'matching symmetry or pattern piece',
      'a respectful, kind action offering choice',
      'forcing one specific response',
    ]

    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          // Extract student-facing interaction choices
          const choices: string[] = []
          if (task.data.type === 'multiple_choice') {
            ;(task.data as MultipleChoiceTaskData).options.forEach((o) => choices.push(o.text))
          } else if (task.data.type === 'matching') {
            ;(task.data as MatchingTaskData).pairs.forEach((p) => {
              choices.push(p.left)
              choices.push(p.right)
            })
          } else if (task.data.type === 'ordering') {
            ;(task.data as OrderingTaskData).items.forEach((i) => choices.push(i.text))
          }

          const combinedChoices = choices.join(' ').toLowerCase()
          bannedPlaceholders.forEach((banned) => {
            expect(
              combinedChoices.includes(banned),
              `Found placeholder "${banned}" in interactive choice of task ${task.id} (${lvl.title})`
            ).toBe(false)
          })
        })
      })
    })
  })

  it('validates all multiple choice tasks have >=3 options and exactly one correct answer', () => {
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          if (task.data.type === 'multiple_choice') {
            const mcData = task.data as MultipleChoiceTaskData
            expect(mcData.question.trim().length).toBeGreaterThan(5)
            expect(mcData.options.length).toBeGreaterThanOrEqual(3)

            const correctOptions = mcData.options.filter((o) => o.isCorrect)
            expect(
              correctOptions.length,
              `Task ${task.id} must have exactly one correct option`
            ).toBe(1)

            // Verify distinct option texts
            const texts = new Set(mcData.options.map((o) => o.text.trim()))
            expect(texts.size).toBe(mcData.options.length)
          }
        })
      })
    })
  })

  it('validates all matching tasks have >=2 pairs with non-empty left and right values', () => {
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          if (task.data.type === 'matching') {
            const mData = task.data as MatchingTaskData
            expect(mData.prompt.trim().length).toBeGreaterThan(5)
            expect(mData.pairs.length).toBeGreaterThanOrEqual(2)
            mData.pairs.forEach((pair) => {
              expect(pair.left.trim().length).toBeGreaterThan(0)
              expect(pair.right.trim().length).toBeGreaterThan(0)
            })
          }
        })
      })
    })
  })

  it('validates all ordering tasks have exactly 3 items with sequential correctOrder 1, 2, 3', () => {
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          if (task.data.type === 'ordering') {
            const oData = task.data as OrderingTaskData
            expect(oData.prompt.trim().length).toBeGreaterThan(5)
            expect(oData.items.length).toBe(3)
            const orders = oData.items.map((i) => i.correctOrder).sort()
            expect(orders).toEqual([1, 2, 3])
          }
        })
      })
    })
  })

  it('validates all letter input tasks have valid prompt, wordWithBlank, and expectedLetter', () => {
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          if (task.data.type === 'letter_input') {
            const lData = task.data as LetterInputTaskData
            expect(lData.prompt.trim().length).toBeGreaterThan(5)
            expect(lData.wordWithBlank.includes('_')).toBe(true)
            expect(lData.expectedLetter.length).toBe(1)
            expect(lData.acceptableAlternatives?.length ?? 1).toBeGreaterThanOrEqual(1)
          }
        })
      })
    })
  })

  it('verifies accessibility and scoring rubric presence on all tasks', () => {
    worlds.forEach((wId) => {
      const world = curriculumService.getWorld(wId)
      world.levels.forEach((lvl) => {
        lvl.tasks.forEach((task) => {
          expect(task.instruction.length).toBeGreaterThan(5)
          expect(task.audioPromptText?.length).toBeGreaterThan(5)
          expect(task.hint?.length).toBeGreaterThan(5)
          expect(task.scoringRubric?.length).toBeGreaterThan(10)
          expect(task.targetSkillId).toBeDefined()
        })
      })
    })
  })
})
