import type {
  WorldId,
  StudentCurriculumProgress,
  RewardSummary,
  WorldProgressSummary,
} from '../types/curriculum.types'
import { progressionService } from './progression.service'
import { curriculumService } from '../data/curriculum/curriculumGenerator'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface EnrolledStudent {
  id: string
  displayName: string
  registrationNumber: string
  gradeLevel: number
  avatarId: string
  className: string
  classCode: string
  teacherId: string
  lastActiveAt?: string
  totalStars: number
  completedLevelsCount: number
  earnedBadgesCount: number
  worldProgress: Record<WorldId, { completedLevels: number; currentLevel: number }>
  supportAccommodations: string[]
  isDemo: boolean
}

export interface TeacherClass {
  id: string
  name: string
  classCode: string
  gradeLevel: number
  teacherId: string
  studentCount: number
  isDemo: boolean
}

export interface TeacherObservation {
  id: string
  teacherId: string
  studentId: string
  observationDate: string
  activityContext: string
  observedContent: string
  strategyTried?: string
  followUpNotes?: string
  createdAt: string
  isDemo: boolean
}

export interface SupportSuggestion {
  id: string
  activityArea: string
  evidence: string
  suggestion: string
  strategyRationale: string
}

export interface SensitiveSupportRecord {
  id: string
  studentId: string
  documentedBy: string
  recordedAt: string
  lawfulBasis: 'Parent Consent' | 'IEP Education Plan' | 'Specialist Assessment'
  category: 'Accommodations' | 'Communication Preferences' | 'Sensory Needs' | 'Documented Educational Support'
  details: string
  reviewDate: string
}

export interface StudentLearningReport {
  student: EnrolledStudent
  progress: StudentCurriculumProgress
  rewardSummary: RewardSummary
  worldSummaries: Record<WorldId, WorldProgressSummary>
  demonstratedSuccesses: string[]
  areasForGrowth: string[]
  timeline: {
    date: string
    worldId: WorldId
    levelNumber: number
    levelTitle: string
    tasksCompleted: number
    stars: number
  }[]
  observations: TeacherObservation[]
  suggestions: SupportSuggestion[]
  supportRecords: SensitiveSupportRecord[]
}

const DEMO_TEACHER_ID = 'demo_teacher_id'
const DEMO_CLASS_ID = 'demo_class_3a'
const DEMO_OBSERVATIONS_KEY = 'bloomi_demo_teacher_observations_'
const DEMO_SUPPORT_RECORDS_KEY = 'bloomi_demo_support_records_'

const DEFAULT_DEMO_SUPPORT_RECORDS: SensitiveSupportRecord[] = [
  {
    id: 'supp_alex_1',
    studentId: 'demo_student',
    documentedBy: 'Dr. Helen Rostova (School Educational Specialist)',
    recordedAt: '2026-09-15',
    lawfulBasis: 'IEP Education Plan',
    category: 'Accommodations',
    details: 'Visual clarity accommodation: Provide soft high contrast, large text option, and unlimited processing time without countdown timers.',
    reviewDate: '2027-01-15',
  },
  {
    id: 'supp_alex_2',
    studentId: 'demo_student',
    documentedBy: 'Maria Rivers (Parent/Guardian Consent on file)',
    recordedAt: '2026-09-02',
    lawfulBasis: 'Parent Consent',
    category: 'Communication Preferences',
    details: 'Learner responds well to spoken audio instructions alongside visual demonstration cards.',
    reviewDate: '2027-06-01',
  },
]

// Resilient memory store when running in Node.js test environments or SSR
const inMemoryObservationsStorage = new Map<string, string>()

function getObservationsStorage(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch {
    // fallback to memory
  }
  return inMemoryObservationsStorage.get(key) || null
}

function setObservationsStorage(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
      return
    }
  } catch {
    // fallback to memory
  }
  inMemoryObservationsStorage.set(key, value)
}

// Default demo classroom roster for local demo testing
const DEMO_STUDENT_ROSTER: EnrolledStudent[] = [
  {
    id: 'demo_student',
    displayName: 'Alex Rivers',
    registrationNumber: 'BLOOM-3A-01',
    gradeLevel: 3,
    avatarId: 'panda',
    className: 'Grade 3 Blossom Explorers',
    classCode: 'BLOOM-3A',
    teacherId: DEMO_TEACHER_ID,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    totalStars: 9,
    completedLevelsCount: 3,
    earnedBadgesCount: 1,
    worldProgress: {
      writing: { completedLevels: 2, currentLevel: 3 },
      speaking: { completedLevels: 1, currentLevel: 2 },
      visual: { completedLevels: 0, currentLevel: 1 },
      social: { completedLevels: 0, currentLevel: 1 },
    },
    supportAccommodations: ['Soft High Contrast', 'Large Text', 'Voice Guidance'],
    isDemo: true,
  },
  {
    id: 'demo_student_leo',
    displayName: 'Leo Adams',
    registrationNumber: 'BLOOM-3A-02',
    gradeLevel: 3,
    avatarId: 'lion',
    className: 'Grade 3 Blossom Explorers',
    classCode: 'BLOOM-3A',
    teacherId: DEMO_TEACHER_ID,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    totalStars: 15,
    completedLevelsCount: 5,
    earnedBadgesCount: 2,
    worldProgress: {
      writing: { completedLevels: 3, currentLevel: 4 },
      speaking: { completedLevels: 1, currentLevel: 2 },
      visual: { completedLevels: 1, currentLevel: 2 },
      social: { completedLevels: 0, currentLevel: 1 },
    },
    supportAccommodations: ['Phonics Cards', 'Calm Motion'],
    isDemo: true,
  },
  {
    id: 'demo_student_maya',
    displayName: 'Maya Patel',
    registrationNumber: 'BLOOM-3A-03',
    gradeLevel: 3,
    avatarId: 'dolphin',
    className: 'Grade 3 Blossom Explorers',
    classCode: 'BLOOM-3A',
    teacherId: DEMO_TEACHER_ID,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    totalStars: 21,
    completedLevelsCount: 7,
    earnedBadgesCount: 3,
    worldProgress: {
      writing: { completedLevels: 2, currentLevel: 3 },
      speaking: { completedLevels: 2, currentLevel: 3 },
      visual: { completedLevels: 2, currentLevel: 3 },
      social: { completedLevels: 1, currentLevel: 2 },
    },
    supportAccommodations: ['Visual Cues', 'Audio Mute Option'],
    isDemo: true,
  },
  {
    id: 'demo_student_sam',
    displayName: 'Sam Chen',
    registrationNumber: 'BLOOM-3A-04',
    gradeLevel: 3,
    avatarId: 'fox',
    className: 'Grade 3 Blossom Explorers',
    classCode: 'BLOOM-3A',
    teacherId: DEMO_TEACHER_ID,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    totalStars: 6,
    completedLevelsCount: 2,
    earnedBadgesCount: 1,
    worldProgress: {
      writing: { completedLevels: 1, currentLevel: 2 },
      speaking: { completedLevels: 0, currentLevel: 1 },
      visual: { completedLevels: 1, currentLevel: 2 },
      social: { completedLevels: 0, currentLevel: 1 },
    },
    supportAccommodations: ['Tactile Letter Scaffolding', 'Extra Processing Time'],
    isDemo: true,
  },
]

// Unauthorized student belonging to another teacher (to test isolation)
const EXTERNAL_STUDENT_ID = 'student_unauthorized_room_4b'

export const teacherService = {
  /**
   * Check whether a teacher is authorized to access a given student's records.
   * Enforces classroom enrollment security boundary.
   */
  isTeacherAuthorizedForStudent(teacherId: string, studentId: string): boolean {
    if (!teacherId || !studentId) return false

    // Explicit unauthorized check
    if (studentId === EXTERNAL_STUDENT_ID) {
      return false
    }

    // In demo mode, only students in DEMO_STUDENT_ROSTER are authorized
    const isEnrolled = DEMO_STUDENT_ROSTER.some(
      (s) => s.id === studentId && (s.teacherId === teacherId || teacherId === DEMO_TEACHER_ID)
    )

    return isEnrolled
  },

  /**
   * Get all classrooms managed by the authenticated teacher.
   */
  async getTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
    if (!teacherId) return []

    if (isSupabaseConfigured && supabase && teacherId !== DEMO_TEACHER_ID) {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('id, name, class_code, grade_level, teacher_id')
          .eq('teacher_id', teacherId)

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            name: c.name,
            classCode: c.class_code,
            gradeLevel: c.grade_level,
            teacherId: c.teacher_id,
            studentCount: 0,
            isDemo: false,
          }))
        }
      } catch (err) {
        console.warn('Supabase classes query note:', err)
      }
    }

    // Default demo classroom
    return [
      {
        id: DEMO_CLASS_ID,
        name: 'Grade 3 Blossom Explorers',
        classCode: 'BLOOM-3A',
        gradeLevel: 3,
        teacherId: teacherId || DEMO_TEACHER_ID,
        studentCount: DEMO_STUDENT_ROSTER.length,
        isDemo: true,
      },
    ]
  },

  /**
   * Get students authorized for this teacher.
   * In demo mode, synchronizes with the active student's local progress for 'demo_student'.
   */
  async getTeacherStudents(teacherId: string): Promise<EnrolledStudent[]> {
    if (!teacherId) return []

    // Update demo_student with live local progression data if available
    const activeProgress = progressionService.getProgress('demo_student')
    const activeRewards = progressionService.getRewardSummary('demo_student')

    const roster = DEMO_STUDENT_ROSTER.map((student) => {
      if (student.id === 'demo_student') {
        const writingSummary = progressionService.getWorldSummary('writing', activeProgress)
        const speakingSummary = progressionService.getWorldSummary('speaking', activeProgress)
        const visualSummary = progressionService.getWorldSummary('visual', activeProgress)
        const socialSummary = progressionService.getWorldSummary('social', activeProgress)

        return {
          ...student,
          totalStars: activeRewards.totalStars,
          completedLevelsCount: activeRewards.totalCompletedLevels,
          earnedBadgesCount: activeRewards.earnedBadges.length,
          worldProgress: {
            writing: {
              completedLevels: writingSummary.completedLevels,
              currentLevel: writingSummary.currentLevelNumber,
            },
            speaking: {
              completedLevels: speakingSummary.completedLevels,
              currentLevel: speakingSummary.currentLevelNumber,
            },
            visual: {
              completedLevels: visualSummary.completedLevels,
              currentLevel: visualSummary.currentLevelNumber,
            },
            social: {
              completedLevels: socialSummary.completedLevels,
              currentLevel: socialSummary.currentLevelNumber,
            },
          },
        }
      }
      return student
    })

    return roster
  },

  /**
   * Retrieve full student learning report.
   * Enforces backend/service authorization boundary.
   */
  async getStudentLearningReport(
    teacherId: string,
    studentId: string
  ): Promise<{ authorized: boolean; report?: StudentLearningReport; error?: string }> {
    if (!this.isTeacherAuthorizedForStudent(teacherId, studentId)) {
      return {
        authorized: false,
        error: 'Authorization Denied: This learner is not enrolled in your assigned classroom roster.',
      }
    }

    const students = await this.getTeacherStudents(teacherId)
    const student = students.find((s) => s.id === studentId)

    if (!student) {
      return {
        authorized: false,
        error: 'Student record could not be found.',
      }
    }

    const progress = progressionService.getProgress(studentId)
    const rewardSummary = progressionService.getRewardSummary(studentId)

    const worldIds: WorldId[] = ['writing', 'speaking', 'visual', 'social']
    const worldSummaries = {} as Record<WorldId, WorldProgressSummary>

    worldIds.forEach((wId) => {
      worldSummaries[wId] = progressionService.getWorldSummary(wId, progress)
    })

    // Construct activity timeline from completed levels
    const timeline: StudentLearningReport['timeline'] = []
    worldIds.forEach((wId) => {
      const wProg = progress.worlds[wId]
      if (wProg && wProg.levelRecords) {
        Object.values(wProg.levelRecords).forEach((rec) => {
          if (rec.completed) {
            const levelDef = curriculumService.getLevel(wId, rec.levelNumber)
            timeline.push({
              date: rec.completedAt || rec.lastAttemptAt || new Date().toISOString(),
              worldId: wId,
              levelNumber: rec.levelNumber,
              levelTitle: levelDef?.title || `Level ${rec.levelNumber}`,
              tasksCompleted: rec.completedTasks,
              stars: rec.starsEarned,
            })
          }
        })
      }
    })

    // Sort timeline descending by date
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Factual, non-clinical demonstrated successes
    const demonstratedSuccesses: string[] = []
    if (worldSummaries.writing.completedLevels >= 1) {
      demonstratedSuccesses.push(
        `Completed ${worldSummaries.writing.completedLevels} level(s) in Writing World (letter recognition & word patterns).`
      )
    }
    if (worldSummaries.speaking.completedLevels >= 1) {
      demonstratedSuccesses.push(
        `Practiced sound discrimination across ${worldSummaries.speaking.completedLevels} Speaking World activity level(s).`
      )
    }
    if (worldSummaries.visual.completedLevels >= 1) {
      demonstratedSuccesses.push(
        `Successfully solved visual sequencing and pattern matching in ${worldSummaries.visual.completedLevels} level(s).`
      )
    }
    if (worldSummaries.social.completedLevels >= 1) {
      demonstratedSuccesses.push(
        `Explored emotion identification and everyday cooperation across ${worldSummaries.social.completedLevels} level(s).`
      )
    }

    if (demonstratedSuccesses.length === 0) {
      demonstratedSuccesses.push('Learner is currently exploring Level 1 introductory activities across worlds.')
    }

    // Areas that may benefit from additional practice (neutral, factual observations)
    const areasForGrowth: string[] = []
    if (worldSummaries.writing.completedLevels === 0) {
      areasForGrowth.push('Writing World: Has not yet completed introductory letter tracing activity.')
    }
    if (worldSummaries.speaking.completedLevels === 0) {
      areasForGrowth.push('Speaking World: Sound clues activity ready for exploration.')
    }
    if (worldSummaries.visual.completedLevels === 0) {
      areasForGrowth.push('Visual Discovery: Pattern matching tasks ready for practice.')
    }
    if (worldSummaries.social.completedLevels === 0) {
      areasForGrowth.push('Social Adventure: Everyday cooperation scenarios available.')
    }

    // Generate non-diagnostic support suggestions
    const suggestions = this.generateSupportSuggestions(student, progress, worldSummaries)

    // Retrieve recorded teacher observations
    const observations = this.getStudentObservations(teacherId, studentId)

    // Retrieve sensitive support records (accommodations, IEP notes)
    const supportRecords = this.getSensitiveSupportRecords(teacherId, studentId)

    return {
      authorized: true,
      report: {
        student,
        progress,
        rewardSummary,
        worldSummaries,
        demonstratedSuccesses,
        areasForGrowth,
        timeline,
        observations,
        suggestions,
        supportRecords,
      },
    }
  },

  /**
   * Generate non-diagnostic educational support suggestions grounded in recorded activities.
   * Strictly pedagogical; NEVER medical or clinical diagnosis.
   */
  generateSupportSuggestions(
    student: EnrolledStudent,
    _progress: StudentCurriculumProgress,
    worldSummaries: Record<WorldId, WorldProgressSummary>
  ): SupportSuggestion[] {
    const suggestions: SupportSuggestion[] = []

    if (worldSummaries.writing.completedLevels < 2) {
      suggestions.push({
        id: 'sug_writing_scaffold',
        activityArea: 'Writing World',
        evidence: `Learner has completed ${worldSummaries.writing.completedLevels} writing level(s) so far.`,
        suggestion: 'Introduce tactile letter tiles or finger-tracing cards before on-screen spelling tasks.',
        strategyRationale:
          'Multi-sensory tactile reinforcement provides a comfortable bridge into on-screen letter recognition.',
      })
    }

    if (worldSummaries.visual.completedLevels >= 1) {
      suggestions.push({
        id: 'sug_visual_bridge',
        activityArea: 'Visual Discovery',
        evidence: 'Learner demonstrated confidence in visual pattern recognition.',
        suggestion: 'Use visual diagrams and colour cues to scaffold reading and sequencing in other subjects.',
        strategyRationale:
          'Leveraging strong visual pattern recognition builds confidence across text and communication tasks.',
      })
    }

    if (student.supportAccommodations.includes('Large Text')) {
      suggestions.push({
        id: 'sug_pacing_breaks',
        activityArea: 'Learning Pacing',
        evidence: 'Learner benefits from large typography and visual comfort adjustments.',
        suggestion: 'Provide natural breaks between 5-task levels and allow self-paced review.',
        strategyRationale:
          'Reducing visual fatigue maintains positive engagement and sustained attention.',
      })
    }

    // General inclusive encouragement suggestion
    suggestions.push({
      id: 'sug_choice_agency',
      activityArea: 'Learner Agency',
      evidence: 'Student is navigating Grade 3 curriculum choices.',
      suggestion: 'Allow learner to choose which of the 4 worlds to visit first each morning.',
      strategyRationale:
        'Offering autonomy in learning sequence increases intrinsic motivation and emotional readiness.',
    })

    return suggestions
  },

  /**
   * Retrieve teacher observations for a student.
   */
  getStudentObservations(teacherId: string, studentId: string): TeacherObservation[] {
    try {
      const storageKey = `${DEMO_OBSERVATIONS_KEY}${studentId}`
      const raw = getObservationsStorage(storageKey)
      if (raw) {
        const parsed: TeacherObservation[] = JSON.parse(raw)
        // Ensure teacher can only view observations matching teacherId or demo
        return parsed.filter((o) => o.teacherId === teacherId || teacherId === DEMO_TEACHER_ID)
      }
    } catch (e) {
      console.warn('Error reading observations:', e)
    }

    // Default sample observation for demo student
    if (studentId === 'demo_student') {
      return [
        {
          id: 'obs_sample_1',
          teacherId: DEMO_TEACHER_ID,
          studentId: 'demo_student',
          observationDate: '2026-10-20',
          activityContext: 'Writing World: Level 1 Letter Recognition',
          observedContent:
            'Engaged attentively with the sound cues. Paused thoughtfully on similar letter shapes before selecting answer.',
          strategyTried: 'Enabled Soft High Contrast and recommended finger tracing.',
          followUpNotes: 'Demonstrated high enthusiasm upon earning Bloom Stars.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          isDemo: true,
        },
      ]
    }

    return []
  },

  /**
   * Add a new teacher observation note.
   * Separated cleanly from computed progress metrics.
   */
  addStudentObservation(
    teacherId: string,
    studentId: string,
    data: {
      observationDate: string
      activityContext: string
      observedContent: string
      strategyTried?: string
      followUpNotes?: string
    }
  ): { success: boolean; observation?: TeacherObservation; error?: string } {
    if (!this.isTeacherAuthorizedForStudent(teacherId, studentId)) {
      return {
        success: false,
        error: 'Unauthorized: Cannot record observations for students outside your classroom roster.',
      }
    }

    if (!data.activityContext?.trim() || !data.observedContent?.trim()) {
      return {
        success: false,
        error: 'Please provide both activity context and observed notes.',
      }
    }

    const newObservation: TeacherObservation = {
      id: `obs_${Date.now()}`,
      teacherId,
      studentId,
      observationDate: data.observationDate || new Date().toISOString().split('T')[0],
      activityContext: data.activityContext.trim(),
      observedContent: data.observedContent.trim(),
      strategyTried: data.strategyTried?.trim() || undefined,
      followUpNotes: data.followUpNotes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      isDemo: true,
    }

    try {
      const existing = this.getStudentObservations(teacherId, studentId)
      const updated = [newObservation, ...existing]
      const storageKey = `${DEMO_OBSERVATIONS_KEY}${studentId}`
      setObservationsStorage(storageKey, JSON.stringify(updated))

      // If Supabase is configured and authenticated, attempt background insert
      if (isSupabaseConfigured && supabase && teacherId !== DEMO_TEACHER_ID) {
        void Promise.resolve(
          supabase
            .from('teacher_observations')
            .insert({
              teacher_id: teacherId,
              student_id: studentId,
              observation_date: newObservation.observationDate,
              activity_context: newObservation.activityContext,
              observed_content: newObservation.observedContent,
              strategy_tried: newObservation.strategyTried || null,
              follow_up_notes: newObservation.followUpNotes || null,
            })
        ).catch((err: unknown) => {
          console.warn('Supabase observation insert note:', err)
        })
      }

      return {
        success: true,
        observation: newObservation,
      }
    } catch (e) {
      return {
        success: false,
        error: `Failed to save observation: ${String(e)}`,
      }
    }
  },

  getSensitiveSupportRecords(teacherId: string, studentId: string): SensitiveSupportRecord[] {
    if (!this.isTeacherAuthorizedForStudent(teacherId, studentId)) return []

    const storageKey = `${DEMO_SUPPORT_RECORDS_KEY}${studentId}`
    const stored = getObservationsStorage(storageKey)
    if (stored) {
      try {
        return JSON.parse(stored) as SensitiveSupportRecord[]
      } catch {
        // fallback
      }
    }

    if (studentId === 'demo_student') {
      return DEFAULT_DEMO_SUPPORT_RECORDS
    }
    return []
  },

  addSensitiveSupportRecord(
    teacherId: string,
    studentId: string,
    data: Omit<SensitiveSupportRecord, 'id'>
  ): { success: boolean; record?: SensitiveSupportRecord; error?: string } {
    if (!this.isTeacherAuthorizedForStudent(teacherId, studentId)) {
      return { success: false, error: 'Unauthorized to add support records for this student.' }
    }

    const newRecord: SensitiveSupportRecord = {
      id: `supp_${Date.now()}`,
      studentId,
      documentedBy: data.documentedBy.trim(),
      recordedAt: data.recordedAt || new Date().toISOString().split('T')[0],
      lawfulBasis: data.lawfulBasis,
      category: data.category,
      details: data.details.trim(),
      reviewDate: data.reviewDate,
    }

    const existing = this.getSensitiveSupportRecords(teacherId, studentId)
    const updated = [newRecord, ...existing]
    const storageKey = `${DEMO_SUPPORT_RECORDS_KEY}${studentId}`
    setObservationsStorage(storageKey, JSON.stringify(updated))

    return { success: true, record: newRecord }
  },

  exportReportToText(report: StudentLearningReport): string {
    const lines: string[] = [
      `=======================================================`,
      `BLOOMI INCLUSIVE EDUCATIONAL LEARNING REPORT`,
      `=======================================================`,
      `Student Name: ${report.student.displayName}`,
      `Registration ID: ${report.student.registrationNumber}`,
      `Grade Level: Grade ${report.student.gradeLevel}`,
      `Classroom: ${report.student.className} (${report.student.classCode})`,
      `Report Generated: ${new Date().toLocaleDateString()}`,
      `Total Bloom Stars: ${report.rewardSummary.totalStars}`,
      `Levels Completed: ${report.rewardSummary.totalCompletedLevels}`,
      ``,
      `IMPORTANT NOTICE:`,
      `BLOOMI is an educational learning support tool, not a diagnostic medical`,
      `device. All recorded evidence reflects observable task completion and`,
      `pedagogical strategies. It does not infer medical conditions or severity.`,
      ``,
      `--- DEMONSTRATED PROGRESS ACROSS MAGICAL WORLDS ---`,
    ]

    Object.values(report.worldSummaries).forEach((w) => {
      lines.push(`* ${w.title}: Level ${w.currentLevelNumber}/50 (${w.completedLevels} completed, ${w.percentage}%)`)
    })

    lines.push(``, `--- FACTUAL DEMONSTRATED SUCCESSES ---`)
    report.demonstratedSuccesses.forEach((s) => lines.push(`* ${s}`))

    lines.push(``, `--- AREAS FOR ADDITIONAL PRACTICE ---`)
    report.areasForGrowth.forEach((a) => lines.push(`* ${a}`))

    lines.push(``, `--- TEACHER OBSERVATIONS (${report.observations.length}) ---`)
    if (report.observations.length === 0) {
      lines.push(`(No teacher observations recorded yet.)`)
    } else {
      report.observations.forEach((o) => {
        lines.push(`[${o.observationDate}] ${o.activityContext}: ${o.observedContent}`)
        if (o.strategyTried) lines.push(`  Strategy tried: ${o.strategyTried}`)
        if (o.followUpNotes) lines.push(`  Follow-up notes: ${o.followUpNotes}`)
      })
    }

    lines.push(``, `--- SENSITIVE DOCUMENTED SUPPORT & ACCOMMODATIONS ---`)
    if (!report.supportRecords || report.supportRecords.length === 0) {
      lines.push(`(No sensitive support records on file.)`)
    } else {
      report.supportRecords.forEach((r) => {
        lines.push(`* [${r.category}] Basis: ${r.lawfulBasis}`)
        lines.push(`  Documented By: ${r.documentedBy} on ${r.recordedAt}`)
        lines.push(`  Details: ${r.details}`)
        lines.push(`  Next Review Date: ${r.reviewDate}`)
      })
    }

    lines.push(``, `--- NON-DIAGNOSTIC EDUCATIONAL RECOMMENDATIONS ---`)
    report.suggestions.forEach((s) => {
      lines.push(`* ${s.activityArea}: ${s.suggestion}`)
      lines.push(`  Observed Evidence: ${s.evidence}`)
      lines.push(`  Pedagogical Rationale: ${s.strategyRationale}`)
    })

    lines.push(``, `=======================================================`)
    return lines.join('\n')
  },
}
