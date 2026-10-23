import { describe, it, expect } from 'vitest'
import { skillFrameworkService, EDUCATIONAL_SKILLS, STAGE_TITLES } from '../services/skillFramework.service'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import type { StudentTaskAttemptRecord } from '../types/database.types'
import type { WorldId } from '../types/curriculum.types'

describe('BLOOMI Educational Skill Framework & Adaptive Engine', () => {
  describe('Skill Definitions & Non-Diagnostic Transparency', () => {
    it('defines exactly 7 Grade 3 educational skills with observable criteria', () => {
      const skills = skillFrameworkService.getAllSkills()
      expect(skills.length).toBe(7)

      const skillIds = skills.map((s) => s.id)
      expect(skillIds).toContain('letter_recognition')
      expect(skillIds).toContain('phonological_awareness')
      expect(skillIds).toContain('word_decoding')
      expect(skillIds).toContain('vocabulary_sentence')
      expect(skillIds).toContain('listening_comprehension')
      expect(skillIds).toContain('visual_pattern_planning')
      expect(skillIds).toContain('functional_communication')

      skills.forEach((skill) => {
        expect(skill.title).toBeTruthy()
        expect(skill.observableCriteria).toBeTruthy()
        expect(skill.gradeTarget).toBe(3)
        expect(skill.worldId).toBeTruthy()
      })
    })

    it('prohibits clinical/diagnostic vocabulary in all skill definitions and stage titles', () => {
      const allText = [
        ...Object.values(EDUCATIONAL_SKILLS).map(
          (s) => `${s.title} ${s.description} ${s.observableCriteria} ${s.domain}`
        ),
        ...Object.values(STAGE_TITLES),
      ]
        .join(' ')
        .toLowerCase()

      const forbidden = ['autism', 'autistic', 'dyslexia', 'dyslexic', 'adhd', 'disorder', 'severity level', 'pathology']
      forbidden.forEach((term) => {
        expect(allText).not.toContain(term)
      })
    })
  })

  describe('Skill Inference & Task Mapping', () => {
    it('accurately maps writing world tasks based on level difficulty bands', () => {
      expect(skillFrameworkService.inferSkillFromTask('writing', 5, 'multiple_choice')).toBe('letter_recognition')
      expect(skillFrameworkService.inferSkillFromTask('writing', 15, 'matching')).toBe('phonological_awareness')
      expect(skillFrameworkService.inferSkillFromTask('writing', 25, 'letter_input')).toBe('word_decoding')
    })

    it('accurately maps speaking world tasks between vocabulary and listening comprehension', () => {
      expect(skillFrameworkService.inferSkillFromTask('speaking', 5, 'multiple_choice')).toBe('vocabulary_sentence')
      expect(skillFrameworkService.inferSkillFromTask('speaking', 10, 'ordering')).toBe('listening_comprehension')
      expect(skillFrameworkService.inferSkillFromTask('speaking', 30, 'multiple_choice')).toBe('listening_comprehension')
    })

    it('accurately maps visual world to visual_pattern_planning and social world to functional_communication', () => {
      expect(skillFrameworkService.inferSkillFromTask('visual', 10, 'multiple_choice')).toBe('visual_pattern_planning')
      expect(skillFrameworkService.inferSkillFromTask('social', 10, 'multiple_choice')).toBe('functional_communication')
    })
  })

  describe('Skill Stage Transitions & Cold-Start Behavior', () => {
    it('returns "insufficient_data" when fewer than 2 attempts are recorded (honest limitation)', () => {
      const singleAttempt: StudentTaskAttemptRecord[] = [
        {
          id: 'att_1',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 3,
          task_id: 'writing_l3_t1',
          task_type: 'multiple_choice',
          is_correct: true,
          attempts_count: 1,
          hints_used: 0,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
      ]

      const evaluations = skillFrameworkService.evaluateStudentSkills(singleAttempt)
      const letterEval = evaluations.find((e) => e.skillId === 'letter_recognition')!

      expect(letterEval.stage).toBe('insufficient_data')
      expect(letterEval.confidenceScore).toBe(0)
      expect(letterEval.evidenceSummary).toContain('Only 1 recorded task attempt')
    })

    it('assigns "exploring" stage when accuracy is below 50%', () => {
      const attempts: StudentTaskAttemptRecord[] = [
        {
          id: 'att_1',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 5,
          task_id: 'writing_l5_t1',
          task_type: 'multiple_choice',
          is_correct: false,
          attempts_count: 2,
          hints_used: 2,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
        {
          id: 'att_2',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 5,
          task_id: 'writing_l5_t2',
          task_type: 'multiple_choice',
          is_correct: false,
          attempts_count: 1,
          hints_used: 1,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
        {
          id: 'att_3',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 5,
          task_id: 'writing_l5_t3',
          task_type: 'multiple_choice',
          is_correct: true,
          attempts_count: 2,
          hints_used: 1,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
      ]

      const evaluations = skillFrameworkService.evaluateStudentSkills(attempts)
      const letterEval = evaluations.find((e) => e.skillId === 'letter_recognition')!

      expect(letterEval.stage).toBe('exploring')
      expect(letterEval.accuracyPercentage).toBe(33)
      expect(letterEval.suggestedNextStep).toContain('visual and auditory cues')
    })

    it('assigns "ready_for_challenge" when learner demonstrates 90%+ accuracy across 4+ attempts', () => {
      const challengeAttempts: StudentTaskAttemptRecord[] = Array.from({ length: 5 }, (_, i) => ({
        id: `att_c_${i}`,
        student_id: 'test_student',
        session_id: null,
        world_id: 'visual',
        level_number: 10,
        task_id: `visual_l10_t${i + 1}`,
        task_type: 'multiple_choice',
        is_correct: true,
        attempts_count: 1,
        hints_used: 0,
        response_method: 'direct_tap',
        created_at: new Date().toISOString(),
      }))

      const evaluations = skillFrameworkService.evaluateStudentSkills(challengeAttempts)
      const visualEval = evaluations.find((e) => e.skillId === 'visual_pattern_planning')!

      expect(visualEval.stage).toBe('ready_for_challenge')
      expect(visualEval.accuracyPercentage).toBe(100)
      expect(visualEval.confidenceScore).toBeGreaterThanOrEqual(80)
      expect(visualEval.suggestedNextStep).toContain('higher-tier problem solving')
    })
  })

  describe('Adaptive Learning Recommendation Engine', () => {
    it('prioritizes skills in developing or exploring stage for differentiated support', () => {
      const mixedAttempts: StudentTaskAttemptRecord[] = [
        // writing: low accuracy (needs support)
        {
          id: 'att_w1',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 2,
          task_id: 'writing_l2_t1',
          task_type: 'multiple_choice',
          is_correct: false,
          attempts_count: 2,
          hints_used: 2,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
        {
          id: 'att_w2',
          student_id: 'test_student',
          session_id: null,
          world_id: 'writing',
          level_number: 2,
          task_id: 'writing_l2_t2',
          task_type: 'multiple_choice',
          is_correct: false,
          attempts_count: 2,
          hints_used: 1,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
        // visual: high accuracy
        {
          id: 'att_v1',
          student_id: 'test_student',
          session_id: null,
          world_id: 'visual',
          level_number: 5,
          task_id: 'visual_l5_t1',
          task_type: 'multiple_choice',
          is_correct: true,
          attempts_count: 1,
          hints_used: 0,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
        {
          id: 'att_v2',
          student_id: 'test_student',
          session_id: null,
          world_id: 'visual',
          level_number: 5,
          task_id: 'visual_l5_t2',
          task_type: 'multiple_choice',
          is_correct: true,
          attempts_count: 1,
          hints_used: 0,
          response_method: 'direct_tap',
          created_at: new Date().toISOString(),
        },
      ]

      const evaluations = skillFrameworkService.evaluateStudentSkills(mixedAttempts)
      const recommendation = skillFrameworkService.getPrimaryAdaptiveRecommendation(evaluations)

      expect(recommendation).not.toBeNull()
      expect(recommendation!.skillId).toBe('letter_recognition')
      expect(recommendation!.triggeringEvidence).toContain('0% accuracy')
      expect(recommendation!.worldId).toBe('writing')
    })
  })

  describe('Curriculum Task Enrichment Across 4 Worlds', () => {
    it('verifies all 1,000 tasks are equipped with targetSkillId, spoken audio prompts, and scoring rubrics', () => {
      const worlds: WorldId[] = ['writing', 'speaking', 'visual', 'social']

      worlds.forEach((wId) => {
        const world = curriculumService.getWorld(wId)
        expect(world).toBeDefined()
        const levels = world.levels
        expect(levels.length).toBe(50)

        levels.forEach((lvl) => {
          expect(lvl.tasks.length).toBe(5)
          lvl.tasks.forEach((task) => {
            expect(task.targetSkillId).toBeDefined()
            expect(task.audioPromptText).toBeDefined()
            expect(task.scoringRubric).toBeDefined()
            expect((task.supportedResponseMethods?.length ?? 0)).toBeGreaterThan(0)
          })
        })
      })
    })
  })
})
