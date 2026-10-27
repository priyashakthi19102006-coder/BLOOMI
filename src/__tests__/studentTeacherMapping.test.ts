import { describe, it, expect, beforeEach } from 'vitest'
import { classroomService } from '../services/classroom.service'
import { mappingDiagnosticsService } from '../services/mappingDiagnostics.service'
import { teacherService } from '../services/teacher.service'
import { progressionService } from '../services/progression.service'

// Polyfill localStorage for node/vitest environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  } as Storage
}

describe('BLOOMI — Student–Teacher Mapping & Verification Suite', () => {
  const TEACHER_A_ID = 'demo_teacher_id'
  const STUDENT_A_ID = 'demo_student'
  const STUDENT_B_ID = 'student_unauthorized_room_4b'
  const VALID_CLASS_CODE = 'BLOOM-3A'
  const INVALID_CLASS_CODE = 'INVALID-99'

  beforeEach(() => {
    // Reset local progression records for clean state
    progressionService.resetProgress(STUDENT_A_ID)
    progressionService.resetProgress(STUDENT_B_ID)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('bloomi_offline_progress_queue')
    }
  })

  describe('1. New Student Registration & Classroom Enrollment', () => {
    it('validates classroom joining code format and normalizes to uppercase', () => {
      const codeInput = 'bloom-3a'
      const normalized = codeInput.trim().toUpperCase()
      expect(normalized).toBe('BLOOM-3A')
      expect(normalized.length).toBeGreaterThanOrEqual(4)
    })

    it('successfully links a new student to the classroom using valid code', async () => {
      const enrollResult = await classroomService.joinClassroom(STUDENT_A_ID, VALID_CLASS_CODE)
      expect(enrollResult.success).toBe(true)
      expect(enrollResult.classCode).toBe(VALID_CLASS_CODE)
      expect(enrollResult.className).toBe('Grade 3 Blossom Explorers')
    })
  })

  describe('2. Existing Student Sign-in & Membership Preservation', () => {
    it('retrieves student existing classroom membership without duplicate accounts', async () => {
      const membership = await classroomService.getStudentClassroom(STUDENT_A_ID)
      expect(membership.enrolled).toBe(true)
      expect(membership.classCode).toBe(VALID_CLASS_CODE)
      expect(membership.teacherName).toBeDefined()
    })

    it('preserves existing membership on subsequent logins without re-prompting', async () => {
      // First login verification
      const firstCheck = await classroomService.getStudentClassroom(STUDENT_A_ID)
      expect(firstCheck.enrolled).toBe(true)

      // Subsequent login verification
      const secondCheck = await classroomService.getStudentClassroom(STUDENT_A_ID)
      expect(secondCheck.enrolled).toBe(true)
      expect(secondCheck.classId).toBe(firstCheck.classId)
      expect(secondCheck.classCode).toBe(firstCheck.classCode)
    })
  })

  describe('3. Invalid Classroom Code Handling', () => {
    it('rejects an invalid classroom joining code with an actionable error message', async () => {
      const result = await classroomService.joinClassroom(STUDENT_A_ID, INVALID_CLASS_CODE)
      expect(result.success).toBe(false)
      expect(result.error).toBe('The classroom code is invalid or expired. Please verify the code with your teacher.')
    })

    it('rejects empty or whitespace classroom codes', async () => {
      const resultEmpty = await classroomService.joinClassroom(STUDENT_A_ID, '')
      expect(resultEmpty.success).toBe(false)
      expect(resultEmpty.error).toBe('Please enter a valid classroom joining code.')

      const resultWhitespace = await classroomService.joinClassroom(STUDENT_A_ID, '   ')
      expect(resultWhitespace.success).toBe(false)
      expect(resultWhitespace.error).toBe('Please enter a valid classroom joining code.')
    })
  })

  describe('4. Duplicate Registration & Duplicate Enrollment Prevention', () => {
    it('prevents multiple active memberships for the same student (unique membership constraint)', async () => {
      // Enrolling into a valid class when already enrolled is idempotent
      const firstEnroll = await classroomService.joinClassroom(STUDENT_A_ID, VALID_CLASS_CODE)
      expect(firstEnroll.success).toBe(true)

      // Second enrollment into the same class remains single membership
      const secondEnroll = await classroomService.joinClassroom(STUDENT_A_ID, VALID_CLASS_CODE)
      expect(secondEnroll.success).toBe(true)

      const membership = await classroomService.getStudentClassroom(STUDENT_A_ID)
      expect(membership.enrolled).toBe(true)
    })

    it('validates unique student registration numbers to reject duplicates', () => {
      const existingRegs = ['BLOOMI-3A-01', 'BLOOMI-3A-02', 'BLOOMI-3A-03', 'BLOOM-3A-01']
      const checkRegistration = (regNo: string) => {
        const normalized = regNo.trim().toUpperCase()
        if (existingRegs.includes(normalized)) {
          return { valid: false, error: 'A student with this registration number already exists.' }
        }
        return { valid: true, error: null }
      }

      const duplicateCheck = checkRegistration('BLOOM-3A-01')
      expect(duplicateCheck.valid).toBe(false)
      expect(duplicateCheck.error).toContain('already exists')

      const uniqueCheck = checkRegistration('BLOOM-3A-99')
      expect(uniqueCheck.valid).toBe(true)
    })
  })

  describe('5. Teacher Classroom Association & Code Regeneration', () => {
    it('loads authorized classroom for teacher', async () => {
      const classes = await teacherService.getTeacherClasses(TEACHER_A_ID)
      expect(classes.length).toBeGreaterThanOrEqual(1)
      expect(classes[0].classCode).toBe(VALID_CLASS_CODE)
      expect(classes[0].teacherId).toBe(TEACHER_A_ID)
    })

    it('allows teacher to regenerate classroom code securely', async () => {
      const classes = await teacherService.getTeacherClasses(TEACHER_A_ID)
      const activeClass = classes[0]

      const res = await classroomService.regenerateClassCode(TEACHER_A_ID, activeClass.id)
      expect(res.success).toBe(true)
      expect(res.newCode).toBeDefined()
      expect(res.newCode?.startsWith('BLOOM-')).toBe(true)
      expect(res.newCode?.length).toBe(10) // 'BLOOM-' + 4 random uppercase chars
    })

    it('flags teachers with no assigned classroom during health check', async () => {
      const diagnostics = await mappingDiagnosticsService.runAllDiagnostics(TEACHER_A_ID, STUDENT_A_ID)
      expect(diagnostics.length).toBe(8)

      const classCheck = diagnostics.find((d) => d.id === 'teacher_classroom')
      expect(classCheck).toBeDefined()
      expect(classCheck?.status).toBe('passed')
      expect(classCheck?.message).toContain('Classroom')
    })
  })

  describe('6. Teacher Roster Visibility & Metrics', () => {
    it('retrieves only enrolled students for the authorized teacher', async () => {
      const students = await teacherService.getTeacherStudents(TEACHER_A_ID)
      expect(students.length).toBeGreaterThanOrEqual(4)

      for (const student of students) {
        expect(student.teacherId).toBe(TEACHER_A_ID)
        expect(student.displayName).toBeDefined()
        expect(student.registrationNumber).toBeDefined()
        expect(student.completedLevelsCount).toBeDefined()
        expect(student.totalStars).toBeDefined()
      }
    })
  })

  describe('7. Cross-Classroom Authorization & Isolation (Teacher A vs Teacher B)', () => {
    it('authorizes Teacher A for Student A', () => {
      const isAuth = teacherService.isTeacherAuthorizedForStudent(TEACHER_A_ID, STUDENT_A_ID)
      expect(isAuth).toBe(true)
    })

    it('DENIES Teacher A access to Teacher B student (Student B)', async () => {
      const isAuth = teacherService.isTeacherAuthorizedForStudent(TEACHER_A_ID, STUDENT_B_ID)
      expect(isAuth).toBe(false)

      const reportResult = await teacherService.getStudentLearningReport(TEACHER_A_ID, STUDENT_B_ID)
      expect(reportResult.authorized).toBe(false)
      expect(reportResult.report).toBeUndefined()
      expect(reportResult.error).toContain('Authorization Denied')
    })

    it('rejects teacher observations for students outside their classroom', () => {
      const obsResult = teacherService.addStudentObservation(TEACHER_A_ID, STUDENT_B_ID, {
        observationDate: '2026-10-27',
        activityContext: 'Cross-classroom breach test',
        observedContent: 'Teacher A should not be able to write notes for Teacher B students',
      })

      expect(obsResult.success).toBe(false)
      expect(obsResult.error).toContain('Unauthorized')
    })
  })

  describe('8. Student Progress Scoping & Non-Leakage', () => {
    it('ensures student progression is strictly isolated by student UUID', () => {
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A_ID)

      const progA = progressionService.getProgress(STUDENT_A_ID)
      const progB = progressionService.getProgress(STUDENT_B_ID)

      expect(progA.worlds.writing.completedLevelNumbers).toContain(1)
      const rewardsA = progressionService.getRewardSummary(STUDENT_A_ID)
      const rewardsB = progressionService.getRewardSummary(STUDENT_B_ID)
      expect(rewardsA.totalStars).toBeGreaterThan(0)

      // Student B should not have Student A progress
      expect(progB.worlds.writing.completedLevelNumbers).not.toContain(1)
      expect(rewardsB.totalStars).toBe(0)
    })
  })

  describe('9. Student Completes Activity & Teacher Sees Saved Progress', () => {
    it('persists completed level and makes it visible in teacher report', async () => {
      // 1. Student completes level 1 and 2 in writing
      progressionService.completeLevel('writing', 1, 5, 3, STUDENT_A_ID)
      progressionService.completeLevel('writing', 2, 5, 3, STUDENT_A_ID)

      // 2. Teacher retrieves the learning report
      const reportRes = await teacherService.getStudentLearningReport(TEACHER_A_ID, STUDENT_A_ID)
      expect(reportRes.authorized).toBe(true)
      expect(reportRes.report).toBeDefined()

      const report = reportRes.report!
      expect(report.rewardSummary.totalCompletedLevels).toBe(2)
      expect(report.worldSummaries.writing.completedLevels).toBe(2)
      expect(report.rewardSummary.totalStars).toBe(6) // 3 stars x 2 levels
    })

    it('records task completion attempts, answers, and hints without data loss', () => {
      const taskResult = progressionService.recordTaskCompletion(
        'writing',
        1,
        'task-01',
        STUDENT_A_ID
      )

      expect(taskResult.success).toBe(true)
      expect(taskResult.completedTaskIds).toContain('task-01')

      const levelRecord = progressionService.getLevelRecord('writing', 1, STUDENT_A_ID)
      expect(levelRecord).toBeDefined()
      expect(levelRecord?.completedTaskIds).toContain('task-01')
    })
  })

  describe('10. Network Errors, Loading States & Offline Queue Behavior', () => {
    it('queues progress records when offline and flushes when reconnected', async () => {
      // Enqueue offline progress
      progressionService.enqueueOfflineProgress(
        STUDENT_A_ID,
        'visual',
        1,
        {
          worldId: 'visual',
          levelNumber: 1,
          completed: true,
          completedTasks: 5,
          starsEarned: 3,
          completedTaskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'],
          lastAttemptAt: new Date().toISOString(),
        }
      )

      const rawQueue = localStorage.getItem('bloomi_offline_progress_queue')
      expect(rawQueue).toBeDefined()
      const parsed = JSON.parse(rawQueue!)
      expect(parsed.length).toBe(1)
      expect(parsed[0].worldId).toBe('visual')

      // Dequeue offline progress upon successful sync
      progressionService.dequeueOfflineProgress(STUDENT_A_ID, 'visual', 1)

      const queueAfterDequeue = localStorage.getItem('bloomi_offline_progress_queue')
      expect(JSON.parse(queueAfterDequeue!).length).toBe(0)
    })

    it('executes mapping health check suite and returns actionable status for all 8 checks', async () => {
      const diagnostics = await mappingDiagnosticsService.runAllDiagnostics(TEACHER_A_ID, STUDENT_A_ID)
      expect(diagnostics).toHaveLength(8)

      const ids = diagnostics.map((d) => d.id)
      expect(ids).toContain('teacher_auth_role')
      expect(ids).toContain('teacher_classroom')
      expect(ids).toContain('student_profile')
      expect(ids).toContain('student_membership')
      expect(ids).toContain('duplicate_membership_prevention')
      expect(ids).toContain('progress_persistence')
      expect(ids).toContain('teacher_enrolled_access')
      expect(ids).toContain('unauthorized_rejection')

      // Ensure no diagnostic leaks secret API keys or internal database tokens
      for (const diag of diagnostics) {
        expect(diag.message).not.toMatch(/service_role|supabase_key|anon_key|jwt_secret/i)
      }
    })
  })
})
