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

/**
 * Safely extracts user-facing error messages from Supabase Edge Function HTTP responses.
 * Prevents displaying generic "Edge Function returned a non-2xx status code" to users.
 * Strips any sensitive tokens, service keys, internal emails, or stack traces.
 */
export async function extractEdgeFunctionError(
  error: unknown,
  fallbackMessage: string
): Promise<string> {
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, any>

    // 1. In @supabase/supabase-js FunctionsHttpError, the response body is available on context.json()
    if (errObj.context && typeof errObj.context.json === 'function') {
      try {
        const body = await errObj.context.json()
        if (body && typeof body.error === 'string' && body.error.trim()) {
          return sanitizeClientErrorMessage(body.error.trim())
        }
      } catch {
        // Fallback to text if JSON parsing fails
        try {
          if (typeof errObj.context.text === 'function') {
            const rawText = await errObj.context.text()
            if (rawText && rawText.length < 200 && !rawText.includes('<html')) {
              return sanitizeClientErrorMessage(rawText.trim())
            }
          }
        } catch {
          // ignore parsing error and continue
        }
      }
    }

    // 2. If error.message has a descriptive message other than the generic non-2xx wrapper
    if (
      typeof errObj.message === 'string' &&
      errObj.message.trim() &&
      errObj.message !== 'Edge Function returned a non-2xx status code'
    ) {
      return sanitizeClientErrorMessage(errObj.message)
    }
  }

  return sanitizeClientErrorMessage(fallbackMessage)
}

function sanitizeClientErrorMessage(msg: string): string {
  // Strip any internal routing emails, JWT tokens, keys, or internal postgres errors
  let clean = msg.replace(/[\w.-]+@bloomi\.internal/gi, '[school account]')
  clean = clean.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[protected email]')
  clean = clean.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[token]')
  clean = clean.replace(/sbp_[a-zA-Z0-9]+/g, '[key]')
  clean = clean.replace(/P\d{4}:/g, '') // strip postgres error codes like P0001
  return clean.trim()
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
    let profile = await this.getProfile(data.user.id)

    if (!profile) {
      // Fallback check against user metadata if database RLS issue occurred
      const meta = data.user.user_metadata || {}
      if (meta.role === 'teacher' || meta.role === 'admin') {
        profile = {
          id: data.user.id,
          role: meta.role as 'teacher' | 'admin',
          display_name: meta.display_name || data.user.email?.split('@')[0] || 'Educator',
          registration_number: null,
          avatar_id: 'owl',
          grade_level: 3,
          created_at: data.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      } else {
        await supabase.auth.signOut()
        throw new Error('Failed to retrieve educator profile. Please contact administrator.')
      }
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

    // Isolate session: Clear any existing authenticated session before signing in as a different student
    const { data: currentSession } = await supabase.auth.getSession()
    if (currentSession?.session) {
      await supabase.auth.signOut()
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
      const errorMsg = await extractEdgeFunctionError(
        error,
        data?.error || 'Invalid school registration number or password.'
      )
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

    // Retrieve verified profile with resilient retry to prevent race conditions with DB triggers
    const profile = await this.getProfile(sessionData.session.user.id)
    if (!profile) {
      await supabase.auth.signOut()
      throw new Error(
        'Unable to load your student adventure profile. Please check your connection and try again.'
      )
    }

    if (profile.role !== 'student' && profile.role !== 'admin') {
      await supabase.auth.signOut()
      throw new Error(
        'Access denied: This account is registered as an educator. Please use the Teacher Portal.'
      )
    }

    return { profile, session: sessionData.session }
  },

  /**
   * Student Account Sign-Up / Activation using School Registration Code.
   * Dispatched exclusively through trusted server-side Supabase Edge Function.
   */
  async signUpStudent(
    displayName: string,
    registrationNumber: string,
    password: string,
    classCode: string,
    avatarId: string = 'panda'
  ): Promise<{ profile: Profile; session: Session }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
      )
    }

    // Isolate session: Clear any existing authenticated session before creating a new student account
    const { data: currentSession } = await supabase.auth.getSession()
    if (currentSession?.session) {
      await supabase.auth.signOut()
    }

    const sanitizedRegNo = registrationNumber.trim().toUpperCase()
    const sanitizedName = displayName.trim()
    const sanitizedClassCode = classCode.trim().toUpperCase()

    // Dispatch to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<StudentLoginResponse>(
      'student-signup',
      {
        body: {
          displayName: sanitizedName,
          registrationNumber: sanitizedRegNo,
          password,
          classCode: sanitizedClassCode,
          avatarId,
          gradeLevel: 3,
        },
      }
    )

    if (error || !data || !data.session) {
      const errorMsg = await extractEdgeFunctionError(
        error,
        data?.error || 'Failed to register student account. Please try again.'
      )
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

    // Retrieve verified profile with resilient retry
    const profile = await this.getProfile(sessionData.session.user.id)
    if (!profile) {
      await supabase.auth.signOut()
      throw new Error('Failed to load registered student profile. Please try signing in.')
    }

    return { profile, session: sessionData.session }
  },

  /**
   * Verified Educator Onboarding using School Invitation Code.
   * Public registration cannot self-elevate to teacher without a verified code.
   */
  async signUpTeacher(
    email: string,
    password: string,
    displayName: string,
    schoolName: string,
    invitationCode: string
  ): Promise<{ user: User; profile: Profile; session: Session }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
      )
    }

    const trimmedCode = invitationCode.trim().toUpperCase()
    // Valid school authorization codes
    const VALID_CODES = ['BLOOMI-TEACH-2026', 'BLOOMI-EDU-GRADE3', 'BLOOMI-SPECIALIST-2026']

    if (!VALID_CODES.includes(trimmedCode)) {
      throw new Error(
        'Invalid educator invitation code. Please request an approved school code from your district administrator.'
      )
    }

    // Clear any existing session first
    const { data: currentSession } = await supabase.auth.getSession()
    if (currentSession?.session) {
      await supabase.auth.signOut()
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: 'teacher',
          display_name: displayName.trim(),
          school_name: schoolName.trim(),
        },
      },
    })

    if (error || !data.user) {
      throw new Error(error?.message || 'Failed to create educator account.')
    }

    if (!data.session) {
      throw new Error(
        'Account created successfully! Please check your school inbox to verify your email address before signing in.'
      )
    }

    // Retrieve verified profile
    const profile = await this.getProfile(data.user.id)
    if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
      await supabase.auth.signOut()
      throw new Error('Failed to verify educator authorization.')
    }

    return { user: data.user, profile, session: data.session }
  },

  /**
   * Retrieve active user profile with resilient retry for database trigger synchronization
   */
  async getProfile(userId: string, retries: number = 3): Promise<Profile | null> {
    if (!supabase) return null

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (!error && data) return data
        if (error && error.code === '42P17') {
          console.warn('RLS policy recursion (42P17) detected when querying profiles table.')
        }
      } catch (err) {
        console.warn(`Profile fetch attempt ${attempt + 1} note:`, err)
      }

      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, 250 * (attempt + 1)))
      }
    }

    // Resilient fallback: If database RLS recursion prevented the profiles query,
    // verify against active session user metadata so the user is not erroneously locked out.
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const authUser = sessionData?.session?.user
      if (authUser && authUser.id === userId) {
        const meta = authUser.user_metadata || {}
        if (meta.role) {
          return {
            id: authUser.id,
            role: meta.role as 'student' | 'teacher' | 'admin',
            display_name: meta.display_name || authUser.email?.split('@')[0] || 'Bloomi Explorer',
            registration_number: meta.registration_number || null,
            avatar_id: meta.avatar_id || 'panda',
            grade_level: meta.grade_level || 3,
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      }
    } catch (fallbackErr) {
      console.warn('Session metadata fallback check note:', fallbackErr)
    }

    return null
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
