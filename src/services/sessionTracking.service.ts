import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { StudentSessionRecord } from '../types/database.types'

const CURRENT_SESSION_KEY = 'bloomi_current_session_id'
const IDLE_TIMEOUT_MS = 3 * 60 * 1000 // 3 minutes of inactivity = idle
const HEARTBEAT_INTERVAL_MS = 30 * 1000 // 30 seconds sync interval

class SessionTrackingService {
  private activeSessionId: string | null = null
  private activeStudentId: string | null = null
  private sessionStartTime: number = 0
  private lastActivityTime: number = 0
  private portalSecondsAccumulator: number = 0
  private activeLearningSecondsAccumulator: number = 0
  private currentMode: 'portal' | 'learning' = 'portal'
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private isIdle: boolean = false
  private idleCheckTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    this.setupBrowserEventListeners()
  }

  private setupBrowserEventListeners() {
    if (typeof window === 'undefined') return

    // Track user presence
    const resetIdle = () => {
      this.lastActivityTime = Date.now()
      if (this.isIdle) {
        this.isIdle = false
      }
      if (this.idleCheckTimer) clearTimeout(this.idleCheckTimer)
      this.idleCheckTimer = setTimeout(() => {
        this.isIdle = true
      }, IDLE_TIMEOUT_MS)
    }

    window.addEventListener('pointerdown', resetIdle, { passive: true })
    window.addEventListener('keydown', resetIdle, { passive: true })
    window.addEventListener('touchstart', resetIdle, { passive: true })

    // Honest handling of tab/window closure: mark as interrupted or save last activity
    window.addEventListener('beforeunload', () => {
      this.handleBeforeUnload()
    })

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.syncSessionHeartbeat('interrupted')
      } else {
        resetIdle()
      }
    })
  }

  /**
   * Start tracking a new authenticated student session.
   */
  async startSession(studentId: string): Promise<string | null> {
    if (!studentId || studentId === 'demo_student') {
      return null
    }

    // End previous session cleanly if still marked active
    if (this.activeSessionId) {
      await this.endSession('interrupted')
    }

    const now = Date.now()
    this.activeStudentId = studentId
    this.sessionStartTime = now
    this.lastActivityTime = now
    this.portalSecondsAccumulator = 0
    this.activeLearningSecondsAccumulator = 0
    this.currentMode = 'portal'
    this.isIdle = false

    if (!isSupabaseConfigured || !supabase) {
      return null
    }

    try {
      const { data, error } = await (supabase.from('student_sessions') as any)
        .insert({
          student_id: studentId,
          session_start: new Date(now).toISOString(),
          last_activity_at: new Date(now).toISOString(),
          status: 'active',
          duration_seconds: 0,
          portal_seconds: 0,
          active_learning_seconds: 0,
          device_info: typeof navigator !== 'undefined' ? `${navigator.platform} | ${navigator.userAgent.slice(0, 100)}` : null,
        })
        .select('id')
        .single()

      if (!error && data?.id) {
        this.activeSessionId = data.id
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(CURRENT_SESSION_KEY, data.id)
          }
        } catch {
          // ignore storage error
        }
      }
    } catch (err) {
      console.warn('Session start note:', err)
    }

    this.startHeartbeat()
    return this.activeSessionId
  }

  /**
   * Set activity context: 'learning' when inside a level/task player, 'portal' in hub/map.
   */
  setActivityMode(mode: 'portal' | 'learning') {
    this.currentMode = mode
    this.lastActivityTime = Date.now()
  }

  /**
   * Heartbeat to accumulate active vs portal seconds and update Supabase.
   */
  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)

    this.heartbeatTimer = setInterval(() => {
      if (!this.activeSessionId || !this.activeStudentId) return

      // Only increment seconds if user is not idle
      if (!this.isIdle) {
        const delta = Math.round(HEARTBEAT_INTERVAL_MS / 1000)
        if (this.currentMode === 'learning') {
          this.activeLearningSecondsAccumulator += delta
        } else {
          this.portalSecondsAccumulator += delta
        }
      }

      this.syncSessionHeartbeat('active')
    }, HEARTBEAT_INTERVAL_MS)
  }

  /**
   * Sync active session duration to database.
   */
  async syncSessionHeartbeat(status: 'active' | 'completed' | 'interrupted' | 'idle_timeout' = 'active') {
    if (!this.activeSessionId || !isSupabaseConfigured || !supabase) return

    const totalSeconds = this.portalSecondsAccumulator + this.activeLearningSecondsAccumulator
    const updatePayload: Record<string, any> = {
      last_activity_at: new Date(this.lastActivityTime).toISOString(),
      duration_seconds: totalSeconds,
      portal_seconds: this.portalSecondsAccumulator,
      active_learning_seconds: this.activeLearningSecondsAccumulator,
      status: this.isIdle && status === 'active' ? 'idle_timeout' : status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'completed' || status === 'interrupted') {
      updatePayload.session_end = new Date().toISOString()
    }

    try {
      await (supabase.from('student_sessions') as any)
        .update(updatePayload)
        .eq('id', this.activeSessionId)
    } catch (err) {
      console.warn('Session sync note:', err)
    }
  }

  /**
   * Explicit logout or session termination.
   */
  async endSession(status: 'completed' | 'interrupted' | 'idle_timeout' = 'completed'): Promise<void> {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    if (!this.activeSessionId) return

    await this.syncSessionHeartbeat(status)

    this.activeSessionId = null
    this.activeStudentId = null
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CURRENT_SESSION_KEY)
      }
    } catch {
      // ignore
    }
  }

  /**
   * Browser unload handler using sendBeacon for guaranteed delivery.
   */
  private handleBeforeUnload() {
    if (!this.activeSessionId || !isSupabaseConfigured || !supabase) return

    const totalSeconds = this.portalSecondsAccumulator + this.activeLearningSecondsAccumulator
    const payload = JSON.stringify({
      last_activity_at: new Date().toISOString(),
      session_end: new Date().toISOString(),
      duration_seconds: totalSeconds,
      portal_seconds: this.portalSecondsAccumulator,
      active_learning_seconds: this.activeLearningSecondsAccumulator,
      status: 'interrupted',
      updated_at: new Date().toISOString(),
    })

    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://nowgnsyimuibrzeqkfuh.supabase.co'
    const endpoint = `${supabaseUrl}/rest/v1/student_sessions?id=eq.${this.activeSessionId}`

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(endpoint, blob)
    }
  }

  /**
   * Get active session ID.
   */
  getActiveSessionId(): string | null {
    return this.activeSessionId
  }

  /**
   * Get session start timestamp.
   */
  getSessionStartTime(): number {
    return this.sessionStartTime
  }

  /**
   * Get current activity mode ('portal' vs 'learning').
   */
  getCurrentMode(): 'portal' | 'learning' {
    return this.currentMode
  }

  /**
   * Get accumulated tracked seconds.
   */
  getAccumulatedSeconds(): { portal: number; learning: number; total: number } {
    return {
      portal: this.portalSecondsAccumulator,
      learning: this.activeLearningSecondsAccumulator,
      total: this.portalSecondsAccumulator + this.activeLearningSecondsAccumulator,
    }
  }

  /**
   * Query recent sessions for a student (for teacher view or student history).
   */
  async getStudentSessions(studentId: string): Promise<StudentSessionRecord[]> {
    if (!isSupabaseConfigured || !supabase || !studentId || studentId === 'demo_student') {
      return []
    }

    try {
      const { data, error } = await (supabase.from('student_sessions') as any)
        .select('*')
        .eq('student_id', studentId)
        .order('session_start', { ascending: false })
        .limit(20)

      if (error || !data) return []
      return data as StudentSessionRecord[]
    } catch {
      return []
    }
  }

  /**
   * Log an individual task attempt to the database for learning analytics.
   */
  async recordTaskAttempt(input: {
    student_id: string
    session_id?: string | null
    world_id: string
    level_number: number
    task_id: string
    task_type: string
    is_correct: boolean
    score?: number
    hints_used?: number
    retry_count?: number
    time_spent_seconds?: number
    response_data?: Record<string, any>
  }): Promise<void> {
    if (!isSupabaseConfigured || !supabase || !input.student_id || input.student_id === 'demo_student') {
      return
    }

    try {
      await (supabase.from('student_task_attempts') as any).insert({
        student_id: input.student_id,
        session_id: input.session_id || this.activeSessionId,
        world_id: input.world_id,
        level_number: input.level_number,
        task_id: input.task_id,
        task_type: input.task_type,
        is_correct: input.is_correct,
        score: input.score ?? (input.is_correct ? 100 : 0),
        hints_used: input.hints_used ?? 0,
        attempts_count: (input.retry_count ?? 0) + 1,
        time_spent_seconds: input.time_spent_seconds ?? null,
        response_data: input.response_data ?? null,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('Record task attempt note:', err)
    }
  }
}

export const sessionTrackingService = new SessionTrackingService()

