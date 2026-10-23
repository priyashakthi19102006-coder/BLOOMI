export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'student' | 'teacher' | 'admin'
          display_name: string
          registration_number: string | null
          grade_level: number
          avatar_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'student' | 'teacher' | 'admin'
          display_name: string
          registration_number?: string | null
          grade_level?: number
          avatar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'teacher' | 'admin'
          display_name?: string
          registration_number?: string | null
          grade_level?: number
          avatar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          id: string
          name: string
          grade_level: number
          teacher_id: string
          class_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          grade_level?: number
          teacher_id: string
          class_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          grade_level?: number
          teacher_id?: string
          class_code?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      class_students: {
        Row: {
          id: string
          class_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      student_level_progress: {
        Row: {
          id: string
          student_id: string
          world_id: 'writing' | 'speaking' | 'visual' | 'social'
          level_number: number
          completed: boolean
          completed_tasks: number
          stars_earned: number
          completed_task_ids: Json
          last_attempt_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          world_id: 'writing' | 'speaking' | 'visual' | 'social'
          level_number: number
          completed?: boolean
          completed_tasks?: number
          stars_earned?: number
          completed_task_ids?: Json
          last_attempt_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          world_id?: 'writing' | 'speaking' | 'visual' | 'social'
          level_number?: number
          completed?: boolean
          completed_tasks?: number
          stars_earned?: number
          completed_task_ids?: Json
          last_attempt_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_level_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_observations: {
        Row: {
          id: string
          teacher_id: string
          student_id: string
          observation_date: string
          activity_context: string
          observed_content: string
          strategy_tried: string | null
          follow_up_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          student_id: string
          observation_date?: string
          activity_context: string
          observed_content: string
          strategy_tried?: string | null
          follow_up_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          student_id?: string
          observation_date?: string
          activity_context?: string
          observed_content?: string
          strategy_tried?: string | null
          follow_up_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_observations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_observations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sensitive_support_records: {
        Row: {
          id: string
          student_id: string
          documented_by: string
          recorded_at: string
          lawful_basis: string
          category: string
          details: string
          review_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          documented_by: string
          recorded_at?: string
          lawful_basis: string
          category: string
          details: string
          review_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          documented_by?: string
          recorded_at?: string
          lawful_basis?: string
          category?: string
          details?: string
          review_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensitive_support_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      student_sessions: {
        Row: {
          id: string
          student_id: string
          session_start: string
          last_activity_at: string
          session_end: string | null
          duration_seconds: number
          portal_seconds: number
          active_learning_seconds: number
          status: 'active' | 'completed' | 'interrupted' | 'idle_timeout'
          device_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          session_start?: string
          last_activity_at?: string
          session_end?: string | null
          duration_seconds?: number
          portal_seconds?: number
          active_learning_seconds?: number
          status?: 'active' | 'completed' | 'interrupted' | 'idle_timeout'
          device_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          session_start?: string
          last_activity_at?: string
          session_end?: string | null
          duration_seconds?: number
          portal_seconds?: number
          active_learning_seconds?: number
          status?: 'active' | 'completed' | 'interrupted' | 'idle_timeout'
          device_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      student_task_attempts: {
        Row: {
          id: string
          student_id: string
          session_id: string | null
          world_id: 'writing' | 'speaking' | 'visual' | 'social'
          level_number: number
          task_id: string
          task_type: string
          is_correct: boolean
          attempts_count: number
          hints_used: number
          response_method: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          session_id?: string | null
          world_id: 'writing' | 'speaking' | 'visual' | 'social'
          level_number: number
          task_id: string
          task_type: string
          is_correct?: boolean
          attempts_count?: number
          hints_used?: number
          response_method?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          session_id?: string | null
          world_id?: 'writing' | 'speaking' | 'visual' | 'social'
          level_number?: number
          task_id?: string
          task_type?: string
          is_correct?: boolean
          attempts_count?: number
          hints_used?: number
          response_method?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_task_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_invitations: {
        Row: {
          id: string
          invitation_code: string
          school_name: string
          used_by: string | null
          used_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          invitation_code: string
          school_name: string
          used_by?: string | null
          used_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          invitation_code?: string
          school_name?: string
          used_by?: string | null
          used_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ClassRecord = Database['public']['Tables']['classes']['Row']
export type ClassStudentRecord = Database['public']['Tables']['class_students']['Row']
export type StudentSessionRecord = Database['public']['Tables']['student_sessions']['Row']
export type StudentTaskAttemptRecord = Database['public']['Tables']['student_task_attempts']['Row']
export type TeacherInvitationRecord = Database['public']['Tables']['teacher_invitations']['Row']
