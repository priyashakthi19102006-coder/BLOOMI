import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Profile } from '../types/database.types'
import type { Session, User } from '@supabase/supabase-js'

export interface StudentLoginResponse {
  session?: {
    access_token: string
    refresh_token: string
    expires_at?: number
    expires_in?: number
    token_type: string
  }
  profile?: {
    id: string
    role: 'student'
    displayName: string
    gradeLevel: number
    avatarId: string | null
  }
  error?: string
}

export const authService = {
  /**
   * Educator Sign-In using Supabase Auth with email & password.
   * Verifies against profiles table to enforce server-side role validation.
   */
  async signInTeacher(
    email: string,
    password: string
  ): Promise<{ user: User; profile: Profile; session: Session }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user || !data.session) {
      throw new Error(error?.message || 'Invalid email or password.')
    }

    // Role check: query the user's verified database profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      throw new Error('Failed to retrieve educator profile. Please contact administrator.')
    }

    if (profile.role !== 'teacher' && profile.role !== 'admin') {
      // Immediate revoke to prevent any unauthorized teacher interface access
      await supabase.auth.signOut()
      throw new Error(
        'Access denied: This account does not possess educator privileges. Please use the Student Hub.'
      )
    }

    return { user: data.user, profile, session: data.session }
  },

  /**
   * Student Sign-In using School-Issued Registration Number & Password.
   * Dispatched exclusively through trusted server-side Supabase Edge Function.
   */
  async signInStudent(
    registrationNumber: string,
    password: string
  ): Promise<{ profile: Profile; session: Session }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
      )
    }

    const sanitizedRegNo = registrationNumber.trim().toUpperCase()

    // Dispatch to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<StudentLoginResponse>(
      'student-login',
      {
        body: {
          registrationNumber: sanitizedRegNo,
          password,
        },
      }
    )

    if (error || !data || !data.session) {
      const errorMsg =
        (error as any)?.message ||
        data?.error ||
        'Invalid registration number or password.'
      throw new Error(errorMsg)
    }

    // Set the authenticated session in the client
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })

    if (sessionError || !sessionData.session) {
      throw new Error('Failed to initialize student session.')
    }

    // Retrieve verified profile
    const profile = await this.getProfile(sessionData.session.user.id)
    if (!profile) {
      throw new Error('Failed to load student profile.')
    }

    return { profile, session: sessionData.session }
  },

  /**
   * Retrieve active user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) return null
    return data
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (!supabase) return
    await supabase.auth.signOut()
  },

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session
  },
}
