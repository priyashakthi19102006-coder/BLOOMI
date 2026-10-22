import { describe, it, expect, beforeEach } from 'vitest'
import { teacherService } from '../services/teacher.service'
import { progressionService } from '../services/progression.service'

describe('BLOOMI Teacher Portal & Student Management (Stage 07)', () => {
  const TEACHER_ID = 'demo_teacher_id'
  const AUTHORIZED_STUDENT_ID = 'demo_student'
  const UNAUTHORIZED_STUDENT_ID = 'student_unauthorized_room_4b'

  beforeEach(() => {
    // Reset any local storage or in-memory progression records
    progressionService.resetProgress(AUTHORIZED_STUDENT_ID)
  })

  describe('Teacher Classroom Roster & Aggregate Metrics', () => {
    it('retrieves teacher classrooms with class code and student count', async () => {
      const classes = await teacherService.getTeacherClasses(TEACHER_ID)
      expect(classes.length).toBeGreaterThanOrEqual(1)
      const primaryClass = classes[0]
      expect(primaryClass.classCode).toBe('BLOOM-3A')
      expect(primaryClass.gradeLevel).toBe(3)
      expect(primaryClass.isDemo).toBe(true)
    })

    it('retrieves enrolled students with progress metrics', async () => {
      const students = await teacherService.getTeacherStudents(TEACHER_ID)
      expect(students.length).toBeGreaterThanOrEqual(4)

      const alex = students.find((s) => s.id === AUTHORIZED_STUDENT_ID)
      expect(alex).toBeDefined()
      expect(alex?.displayName).toBe('Alex Rivers')
      expect(alex?.registrationNumber).toBe('BLOOM-3A-01')
      expect(alex?.supportAccommodations.length).toBeGreaterThan(0)
    })

    it('filters students by search query (name or registration number)', async () => {
      const students = await teacherService.getTeacherStudents(TEACHER_ID)

      // Search by display name substring
      const filteredByName = students.filter((s) =>
        s.displayName.toLowerCase().includes('maya')
      )
      expect(filteredByName).toHaveLength(1)
      expect(filteredByName[0].displayName).toBe('Maya Patel')

      // Search by registration number
      const filteredByReg = students.filter((s) =>
        s.registrationNumber.includes('02')
      )
      expect(filteredByReg).toHaveLength(1)
      expect(filteredByReg[0].displayName).toBe('Leo Adams')

      // Empty state for non-matching query
      const nonExistent = students.filter((s) =>
        s.displayName.toLowerCase().includes('unknown_person_xyz')
      )
      expect(nonExistent).toHaveLength(0)
    })
  })

  describe('Authorization & Security Enforcement', () => {
    it('authorizes access to students enrolled in the teachers classroom', () => {
      const isAuth = teacherService.isTeacherAuthorizedForStudent(TEACHER_ID, AUTHORIZED_STUDENT_ID)
      expect(isAuth).toBe(true)
    })

    it('DENIES access to unauthorized students not enrolled in the teachers class', async () => {
      // 1. Authorization check returns false
      const isAuth = teacherService.isTeacherAuthorizedForStudent(TEACHER_ID, UNAUTHORIZED_STUDENT_ID)
      expect(isAuth).toBe(false)

      // 2. Learning report retrieval rejects unauthorized student ID
      const result = await teacherService.getStudentLearningReport(TEACHER_ID, UNAUTHORIZED_STUDENT_ID)
      expect(result.authorized).toBe(false)
      expect(result.report).toBeUndefined()
      expect(result.error).toContain('Authorization Denied')
    })

    it('rejects adding observations for unauthorized students', () => {
      const result = teacherService.addStudentObservation(TEACHER_ID, UNAUTHORIZED_STUDENT_ID, {
        observationDate: '2026-10-22',
        activityContext: 'Visual Discovery',
        observedContent: 'Attempted unauthorized record insertion.',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized')
    })
  })

  describe('Student Learning Report & Non-Diagnostic Observations', () => {
    it('generates a comprehensive learning report for authorized student', async () => {
      // Complete level 1 in writing for test student
      progressionService.completeLevel('writing', 1, 5, 3, AUTHORIZED_STUDENT_ID)

      const result = await teacherService.getStudentLearningReport(TEACHER_ID, AUTHORIZED_STUDENT_ID)
      expect(result.authorized).toBe(true)
      expect(result.report).toBeDefined()

      const report = result.report!
      expect(report.student.id).toBe(AUTHORIZED_STUDENT_ID)
      expect(report.worldSummaries.writing.completedLevels).toBe(1)
      expect(report.rewardSummary.totalStars).toBe(3)
      expect(report.timeline.length).toBeGreaterThanOrEqual(1)
      expect(report.demonstratedSuccesses.length).toBeGreaterThan(0)
    })

    it('uses neutral observed facts and avoids clinical diagnostic labels', async () => {
      const result = await teacherService.getStudentLearningReport(TEACHER_ID, AUTHORIZED_STUDENT_ID)
      const report = result.report!

      const allReportText = [
        ...report.demonstratedSuccesses,
        ...report.areasForGrowth,
        ...report.suggestions.map((s) => `${s.suggestion} ${s.strategyRationale}`),
      ]
        .join(' ')
        .toLowerCase()

      // Must never clinically classify or diagnose the child
      expect(allReportText).not.toContain('autism')
      expect(allReportText).not.toContain('autistic')
      expect(allReportText).not.toContain('dyslexia')
      expect(allReportText).not.toContain('dyslexic')
      expect(allReportText).not.toContain('adhd')
      expect(allReportText).not.toContain('disorder')
      expect(allReportText).not.toContain('delayed')
    })

    it('keeps teacher observations completely separate from computed progress metrics', async () => {
      // Get initial stars count
      const initialStars = progressionService.getTotalStars(AUTHORIZED_STUDENT_ID)

      // Add a pedagogical observation
      const obsResult = teacherService.addStudentObservation(TEACHER_ID, AUTHORIZED_STUDENT_ID, {
        observationDate: '2026-10-22',
        activityContext: 'Writing World: Letter Tracing',
        observedContent: 'Paused on letter curves; engaged with tactile sandpaper cards.',
        strategyTried: 'Provided multi-sensory tracing cue.',
        followUpNotes: 'Revisit with paired phonics cards tomorrow.',
      })

      expect(obsResult.success).toBe(true)
      expect(obsResult.observation?.observedContent).toContain('sandpaper cards')

      // Verify that progress, stars, and level counts remain completely unaltered
      const starsAfterObservation = progressionService.getTotalStars(AUTHORIZED_STUDENT_ID)
      expect(starsAfterObservation).toBe(initialStars)

      // Verify observation is saved and retrievable
      const observations = teacherService.getStudentObservations(TEACHER_ID, AUTHORIZED_STUDENT_ID)
      expect(observations.some((o) => o.observedContent.includes('sandpaper cards'))).toBe(true)
    })

    it('generates grounded, non-judgmental educational support suggestions', async () => {
      const result = await teacherService.getStudentLearningReport(TEACHER_ID, AUTHORIZED_STUDENT_ID)
      const report = result.report!

      expect(report.suggestions.length).toBeGreaterThanOrEqual(2)
      report.suggestions.forEach((sug) => {
        expect(sug.activityArea).toBeTruthy()
        expect(sug.evidence).toBeTruthy()
        expect(sug.suggestion).toBeTruthy()
        expect(sug.strategyRationale).toBeTruthy()
      })
    })
  })
})
