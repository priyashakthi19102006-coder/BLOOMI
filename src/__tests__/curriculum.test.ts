import { describe, it, expect, beforeEach } from 'vitest'
import {
  curriculumWorlds,
  curriculumService,
  getBandForLevel,
} from '../data/curriculum/curriculumGenerator'
import {
  progressionService,
  createInitialProgress,
} from '../services/progression.service'
import type { WorldId, TaskType } from '../types/curriculum.types'

describe('Curriculum Data Model & Structure Validation', () => {
  it('contains exactly four learning worlds with correct identifiers', () => {
    const worldKeys = Object.keys(curriculumWorlds) as WorldId[]
    expect(worldKeys).toHaveLength(4)
    expect(worldKeys).toEqual(
      expect.arrayContaining(['writing', 'speaking', 'visual', 'social'])
    )
  })

  it('contains exactly 50 levels per world (200 levels total)', () => {
    const worlds = curriculumService.getAllWorlds()
    expect(worlds).toHaveLength(4)

    worlds.forEach((world) => {
      expect(world.levels).toHaveLength(50)
      // Check sequential level numbers 1 to 50
      world.levels.forEach((lvl, idx) => {
        expect(lvl.levelNumber).toBe(idx + 1)
        expect(lvl.worldId).toBe(world.id)
      })
    })

    expect(curriculumService.getTotalLevelCount()).toBe(200)
  })

  it('contains exactly five tasks per level (1,000 tasks total)', () => {
    const worlds = curriculumService.getAllWorlds()

    worlds.forEach((world) => {
      world.levels.forEach((lvl) => {
        expect(lvl.tasks).toHaveLength(5)
        lvl.tasks.forEach((task, tIdx) => {
          expect(task.taskNumber).toBe(tIdx + 1)
          expect(task.levelId).toBe(lvl.id)
          expect(task.title).toBeTruthy()
          expect(task.instruction).toBeTruthy()
        })
      })
    })

    expect(curriculumService.getTotalTaskCount()).toBe(1000)
  })

  it('has stable and unique identifiers across all 200 levels and 1,000 tasks', () => {
    const levelIdSet = new Set<string>()
    const taskIdSet = new Set<string>()

    const worlds = curriculumService.getAllWorlds()
    worlds.forEach((world) => {
      world.levels.forEach((lvl) => {
        expect(levelIdSet.has(lvl.id)).toBe(false)
        levelIdSet.add(lvl.id)

        lvl.tasks.forEach((task) => {
          expect(taskIdSet.has(task.id)).toBe(false)
          taskIdSet.add(task.id)
        })
      })
    })

    expect(levelIdSet.size).toBe(200)
    expect(taskIdSet.size).toBe(1000)
  })

  it('ensures all tasks use valid task types and valid completion rules', () => {
    const validTaskTypes: TaskType[] = [
      'multiple_choice',
      'matching',
      'ordering',
      'letter_input',
    ]

    const worlds = curriculumService.getAllWorlds()
    worlds.forEach((world) => {
      world.levels.forEach((lvl) => {
        expect(lvl.completionRule.type).toBe('all_tasks_completed')

        lvl.tasks.forEach((task) => {
          expect(validTaskTypes).toContain(task.taskType)
          expect(task.data.type).toBe(task.taskType)
        })
      })
    })
  })

  it('maps level numbers to correct instructional bands', () => {
    expect(getBandForLevel(1).band).toBe('explore')
    expect(getBandForLevel(10).band).toBe('explore')
    expect(getBandForLevel(11).band).toBe('connect')
    expect(getBandForLevel(20).band).toBe('connect')
    expect(getBandForLevel(21).band).toBe('build')
    expect(getBandForLevel(30).band).toBe('build')
    expect(getBandForLevel(31).band).toBe('apply')
    expect(getBandForLevel(40).band).toBe('apply')
    expect(getBandForLevel(41).band).toBe('master')
    expect(getBandForLevel(50).band).toBe('master')
  })
})

describe('Progression Rules & Level Access Engine', () => {
  const TEST_USER = 'test_student_user_123'

  beforeEach(() => {
    progressionService.resetProgress(TEST_USER)
  })

  it('makes Level 1 available by default for newly enrolled students in all worlds', () => {
    const progress = createInitialProgress(TEST_USER)

    const worlds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
    worlds.forEach((wId) => {
      expect(progressionService.getLevelStatus(wId, 1, progress)).toBe('available')
      // Levels 2 to 50 must start locked
      expect(progressionService.getLevelStatus(wId, 2, progress)).toBe('locked')
      expect(progressionService.getLevelStatus(wId, 50, progress)).toBe('locked')
    })
  })

  it('does NOT mark a level complete if fewer than five tasks are finished', () => {
    // Attempting completion with 4 of 5 tasks completed
    const result = progressionService.completeLevel('writing', 1, 4, 3, TEST_USER)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Incomplete')

    const status = progressionService.getLevelStatus('writing', 1, result.progress)
    expect(status).toBe('available') // not completed!
    expect(progressionService.getLevelStatus('writing', 2, result.progress)).toBe('locked')
  })

  it('unlocks Level N+1 only after all five tasks in Level N are completed', () => {
    // Complete Level 1 with all 5 tasks
    const resLevel1 = progressionService.completeLevel('writing', 1, 5, 3, TEST_USER)
    expect(resLevel1.success).toBe(true)

    // Level 1 is now completed
    expect(progressionService.getLevelStatus('writing', 1, resLevel1.progress)).toBe('completed')
    // Level 2 is now unlocked and available
    expect(progressionService.getLevelStatus('writing', 2, resLevel1.progress)).toBe('available')
    // Level 3 remains locked
    expect(progressionService.getLevelStatus('writing', 3, resLevel1.progress)).toBe('locked')
  })

  it('permits a student to replay completed levels without resetting status', () => {
    // Complete Level 1
    progressionService.completeLevel('writing', 1, 5, 3, TEST_USER)

    // Check status is completed
    const progress = progressionService.getProgress(TEST_USER)
    expect(progressionService.getLevelStatus('writing', 1, progress)).toBe('completed')

    // Replay level 1 again
    const replayResult = progressionService.completeLevel('writing', 1, 5, 3, TEST_USER)
    expect(replayResult.success).toBe(true)
    expect(progressionService.getLevelStatus('writing', 1, replayResult.progress)).toBe('completed')
  })

  it('strictly isolates progression between worlds (advancing in one world never unlocks another)', () => {
    // Complete Levels 1 and 2 in Writing World
    progressionService.completeLevel('writing', 1, 5, 3, TEST_USER)
    const prog = progressionService.completeLevel('writing', 2, 5, 3, TEST_USER).progress

    // In Writing World, Level 3 is now available
    expect(progressionService.getLevelStatus('writing', 3, prog)).toBe('available')

    // In Speaking, Visual, and Social worlds, Level 2 must STILL be locked
    expect(progressionService.getLevelStatus('speaking', 2, prog)).toBe('locked')
    expect(progressionService.getLevelStatus('visual', 2, prog)).toBe('locked')
    expect(progressionService.getLevelStatus('social', 2, prog)).toBe('locked')
  })

  it('safely handles missing, corrupted, or incomplete progress records', () => {
    // Null or undefined progress passed
    const statusNull = progressionService.getLevelStatus('writing', 1, undefined)
    expect(statusNull).toBe('available')

    // Incomplete worlds dictionary
    const corrupted: any = { userId: TEST_USER, worlds: {} }
    const statusCorrupted = progressionService.getLevelStatus('writing', 1, corrupted)
    expect(statusCorrupted).toBe('available')
  })
})

describe('Four Magical Worlds Thematic Mapping & Accessible Accommodations', () => {
  it('maps the four educational skill domains to the four 3D-cartoon magical worlds', () => {
    const writingWorld = curriculumWorlds.writing
    expect(writingWorld.title).toBe('Magic Amusement Park')
    expect(writingWorld.magicalWorldName).toBe('Magic Amusement Park')
    expect(writingWorld.companionName).toContain('Barnaby')
    expect(writingWorld.supportedResponseMethods?.length).toBeGreaterThan(0)

    const speakingWorld = curriculumWorlds.speaking
    expect(speakingWorld.title).toBe('Magic Food World')
    expect(speakingWorld.magicalWorldName).toBe('Magic Food World')
    expect(speakingWorld.companionName).toContain('Pip')

    const visualWorld = curriculumWorlds.visual
    expect(visualWorld.title).toBe('Magic Space World')
    expect(visualWorld.magicalWorldName).toBe('Magic Space World')
    expect(visualWorld.companionName).toContain('Nova')

    const socialWorld = curriculumWorlds.social
    expect(socialWorld.title).toBe('Magic Animal World')
    expect(socialWorld.magicalWorldName).toBe('Magic Animal World')
    expect(socialWorld.companionName).toContain('Koa')
  })

  it('provides spoken instructions and visual demonstrations across curriculum tasks', () => {
    const writingLvl1 = curriculumService.getLevel('writing', 1)
    expect(writingLvl1).toBeDefined()
    expect(writingLvl1?.tasks).toHaveLength(5)

    writingLvl1?.tasks.forEach((task) => {
      expect(task.spokenInstruction).toBeTruthy()
      expect(task.visualDemonstration).toBeTruthy()
      expect(task.encouragementTip).toBeTruthy()
      expect(task.supportedResponseMethods?.length).toBeGreaterThan(0)
    })
  })
})

