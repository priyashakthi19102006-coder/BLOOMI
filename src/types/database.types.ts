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
