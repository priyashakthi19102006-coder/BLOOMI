import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface StudentClassroomInfo {
  enrolled: boolean
  classId?: string
  className?: string
  classCode?: string
  teacherName?: string
  teacherId?: string
  gradeLevel?: number
  enrolledAt?: string
}

export interface JoinClassroomResult {
  success: boolean
  className?: string
  classCode?: string
  teacherName?: string
  error?: string
}

export const classroomService = {
  /**
   * Fetch the student's active classroom enrollment.
   * Enforces single active classroom design.
   */
  async getStudentClassroom(studentId: string): Promise<StudentClassroomInfo> {
    if (!studentId) {
      return { enrolled: false }
    }

    // Demo student fallback
    if (studentId === 'demo_student') {
      return {
        enrolled: true,
        classId: 'demo_class_3a',
        className: 'Grade 3 Blossom Explorers',
        classCode: 'BLOOM-3A',
        teacherName: 'Ms. Clara Vance',
        teacherId: 'demo_teacher_id',
        gradeLevel: 3,
        enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      return { enrolled: false }
    }

    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          class_id,
          created_at,
          classes (
            id,
            name,
            class_code,
            grade_level,
            teacher_id,
            profiles:teacher_id (
              display_name
            )
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error || !data || !data.classes) {
        return { enrolled: false }
      }

      const cls = data.classes as any
      const teacherProfile = Array.isArray(cls.profiles) ? cls.profiles[0] : cls.profiles

      return {
        enrolled: true,
        classId: cls.id,
        className: cls.name,
        classCode: cls.class_code,
        teacherName: teacherProfile?.display_name || 'Your Teacher',
        teacherId: cls.teacher_id,
        gradeLevel: cls.grade_level,
        enrolledAt: data.created_at,
      }
    } catch (err) {
      console.warn('Failed to load student classroom membership:', err)
      return { enrolled: false }
    }
  },

  /**
   * Atomically enroll student into a classroom using joining code.
   * Validates code against active classes, protects against duplicate memberships.
   */
  async joinClassroom(studentId: string, classCode: string): Promise<JoinClassroomResult> {
    if (!studentId || !classCode.trim()) {
      return { success: false, error: 'Please enter a valid classroom joining code.' }
    }

    const trimmedCode = classCode.trim().toUpperCase()

    // Demo student fallback
    if (studentId === 'demo_student') {
      if (trimmedCode === 'BLOOM-3A' || trimmedCode.startsWith('BLOOM')) {
        return {
          success: true,
          className: 'Grade 3 Blossom Explorers',
          classCode: trimmedCode,
          teacherName: 'Ms. Clara Vance',
        }
      }
      return { success: false, error: 'The classroom code is invalid or expired. Please verify the code with your teacher.' }
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Database connection is not configured in this environment.',
      }
    }

    try {
      // 1. Try secure RPC join_classroom_by_code first
      const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('join_classroom_by_code', {
        p_class_code: trimmedCode,
      })

      if (!rpcError && rpcData && (rpcData as any).success) {
        return {
          success: true,
          className: (rpcData as any).class_name,
          classCode: (rpcData as any).class_code,
          teacherName: (rpcData as any).teacher_name,
        }
      }

      // If RPC returned an explicit error message, report it
      if (rpcError && rpcError.message && !rpcError.message.includes('function') && !rpcError.message.includes('does not exist')) {
        return { success: false, error: rpcError.message }
      }

      // 2. Direct resilient fallback: Lookup class by uppercase code
      const { data: matchedClass, error: findError } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          class_code,
          grade_level,
          teacher_id,
          profiles:teacher_id (display_name)
        `)
        .ilike('class_code', trimmedCode)
        .maybeSingle()

      if (findError || !matchedClass) {
        return {
          success: false,
          error: 'The classroom code is invalid or expired. Please verify the code with your teacher.',
        }
      }

      // 3. Atomically upsert single enrollment
      const { error: upsertError } = await supabase
        .from('class_students')
        .upsert(
          { class_id: matchedClass.id, student_id: studentId },
          { onConflict: 'student_id' }
        )

      if (upsertError) {
        // Fallback for compound constraint
        const { error: fallbackError } = await supabase
          .from('class_students')
          .upsert(
            { class_id: matchedClass.id, student_id: studentId },
            { onConflict: 'class_id,student_id' }
          )

        if (fallbackError) {
          return {
            success: false,
            error: 'Failed to join classroom. Please check your connection and try again.',
          }
        }
      }

      const teacherProfile = Array.isArray(matchedClass.profiles)
        ? matchedClass.profiles[0]
        : matchedClass.profiles

      return {
        success: true,
        className: matchedClass.name,
        classCode: matchedClass.class_code,
        teacherName: teacherProfile?.display_name || 'Your Teacher',
      }
    } catch (err: any) {
      console.error('Unhandled error in joinClassroom:', err)
      return {
        success: false,
        error: err?.message || 'An unexpected error occurred while joining the classroom.',
      }
    }
  },

  /**
   * Regenerate classroom code securely for authorized teacher.
   */
  async regenerateClassCode(teacherId: string, classId: string): Promise<{ success: boolean; newCode?: string; error?: string }> {
    if (!teacherId || !classId) {
      return { success: false, error: 'Teacher ID and Classroom ID are required.' }
    }

    if (teacherId === 'demo_teacher_id') {
      const demoNewCode = `BLOOM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      return { success: true, newCode: demoNewCode }
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Database is not configured.' }
    }

    try {
      // 1. Try secure RPC regenerate_classroom_code first
      const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('regenerate_classroom_code', {
        p_class_id: classId,
      })

      if (!rpcError && rpcData && (rpcData as any).success && (rpcData as any).class_code) {
        return { success: true, newCode: (rpcData as any).class_code }
      }

      // 2. Direct resilient fallback: generate and update
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
      let candidate = ''
      for (let i = 0; i < 4; i++) {
        candidate += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      const newCode = `BLOOM-${candidate}`

      const { data: updated, error: updateError } = await supabase
        .from('classes')
        .update({ class_code: newCode, updated_at: new Date().toISOString() })
        .eq('id', classId)
        .eq('teacher_id', teacherId)
        .select('class_code')
        .single()

      if (updateError || !updated) {
        return { success: false, error: updateError?.message || 'Failed to regenerate classroom code.' }
      }

      return { success: true, newCode: updated.class_code }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to regenerate code.' }
    }
  },
}
