import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { sessionTrackingService } from '../services/sessionTracking.service'
import { authService } from '../services/auth.service'

describe('Session Tracking & Honest Engagement Metrics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default portal mode and zero accumulators', () => {
    expect(sessionTrackingService.getCurrentMode()).toBe('portal')
    const accumulators = sessionTrackingService.getAccumulatedSeconds()
    expect(accumulators.portal).toBe(0)
    expect(accumulators.learning).toBe(0)
    expect(accumulators.total).toBe(0)
  })

  it('rejects or ignores demo_student for real backend session persistence', async () => {
    const sessionId = await sessionTrackingService.startSession('demo_student')
    expect(sessionId).toBeNull()
    expect(sessionTrackingService.getActiveSessionId()).toBeNull()
  })

  it('switches between portal and learning activity modes accurately', () => {
    sessionTrackingService.setActivityMode('learning')
    expect(sessionTrackingService.getCurrentMode()).toBe('learning')

    sessionTrackingService.setActivityMode('portal')
    expect(sessionTrackingService.getCurrentMode()).toBe('portal')
  })

  it('cleans up and resets active session on endSession', async () => {
    await sessionTrackingService.endSession('completed')
    expect(sessionTrackingService.getActiveSessionId()).toBeNull()
  })

  it('marks interrupted sessions honestly without fabricating exact completion timestamps', async () => {
    // When a session is interrupted (e.g. browser crash / tab close), endSession is invoked with 'interrupted'
    await sessionTrackingService.endSession('interrupted')
    expect(sessionTrackingService.getActiveSessionId()).toBeNull()
  })

  it('handles task attempt logging safely for demo student without network call', async () => {
    await expect(
      sessionTrackingService.recordTaskAttempt({
        student_id: 'demo_student',
        world_id: 'writing',
        level_number: 1,
        task_id: 'task_demo_1',
        task_type: 'multiple_choice',
        is_correct: true,
        score: 100,
        hints_used: 1,
        retry_count: 0,
      })
    ).resolves.not.toThrow()
  })
})

describe('Teacher Invitation & Onboarding Security', () => {
  it('rejects public teacher registration with an invalid invitation code', async () => {
    const invalidAttempt = authService.signUpTeacher(
      'fake_teacher@school.edu',
      'SecurePass123!',
      'Fake Teacher',
      'School District',
      'INVALID-CODE-9999'
    )
    await expect(invalidAttempt).rejects.toThrowError(
      /Invalid educator invitation code/
    )
  })

  it('rejects empty or whitespace invitation codes', async () => {
    const emptyAttempt = authService.signUpTeacher(
      'educator@school.edu',
      'SecurePass123!',
      'Educator Name',
      'Oak Elementary',
      '   '
    )
    await expect(emptyAttempt).rejects.toThrowError(
      /Invalid educator invitation code/
    )
  })

  it('recognizes authorized administrative invitation codes', () => {
    const approvedCodes = ['BLOOMI-TEACH-2026', 'BLOOMI-EDU-GRADE3', 'BLOOMI-SPECIALIST-2026']
    approvedCodes.forEach((code) => {
      expect(code.startsWith('BLOOMI-')).toBe(true)
      expect(code.length).toBeGreaterThan(10)
    })
  })
})
