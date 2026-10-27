import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { authService } from '../services/auth.service'
import { sessionTrackingService } from '../services/sessionTracking.service'
import type { Profile } from '../types/database.types'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  role: 'student' | 'teacher' | 'admin' | null
  isLoading: boolean
  error: string | null
  isConfigured: boolean
  loginTeacher: (email: string, password: string) => Promise<void>
  loginStudent: (registrationNumber: string, password: string) => Promise<void>
  signUpStudent: (
    displayName: string,
    registrationNumber: string,
    password: string,
    classCode: string,
    avatarId?: string
  ) => Promise<void>
  signUpTeacher: (
    email: string,
    password: string,
    displayName: string,
    schoolName: string,
    invitationCode: string
  ) => Promise<void>
  loginDemoStudent: () => void
  loginDemoTeacher: () => void
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Initialize session and auth state listener
  useEffect(() => {
    const client = supabase
    if (!isSupabaseConfigured || !client) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    const initializeAuth = async () => {
      try {
        const { data } = await client.auth.getSession()
        if (isMounted) {
          setSession(data.session)
          if (data.session?.user) {
            const userProfile = await authService.getProfile(data.session.user.id)
            if (isMounted && userProfile) {
              setProfile(userProfile)
              if (userProfile.role === 'student') {
                void sessionTrackingService.startSession(userProfile.id)
              }
            }
          }
        }
      } catch (err: any) {
        console.error('Error initializing authentication session:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      if (newSession?.user) {
        const userProfile = await authService.getProfile(newSession.user.id)
        if (isMounted) {
          if (userProfile) {
            setProfile(userProfile)
          } else {
            // Keep existing profile if it belongs to the same user
            setProfile((prev) => (prev && prev.id === newSession.user.id ? prev : null))
          }
        }
      } else {
        if (isMounted) setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loginTeacher = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { profile: educatorProfile, session: newSession } = await authService.signInTeacher(
        email,
        password
      )
      setSession(newSession)
      setProfile(educatorProfile)
    } catch (err: any) {
      const msg = err.message || 'Failed to authenticate educator.'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginStudent = async (registrationNumber: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { profile: studentProfile, session: newSession } = await authService.signInStudent(
        registrationNumber,
        password
      )
      setSession(newSession)
      setProfile(studentProfile)
      void sessionTrackingService.startSession(studentProfile.id)
    } catch (err: any) {
      const msg = err.message || 'Failed to authenticate student.'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signUpStudent = async (
    displayName: string,
    registrationNumber: string,
    password: string,
    classCode: string,
    avatarId?: string
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const { profile: studentProfile, session: newSession } = await authService.signUpStudent(
        displayName,
        registrationNumber,
        password,
        classCode,
        avatarId
      )
      setSession(newSession)
      setProfile(studentProfile)
      void sessionTrackingService.startSession(studentProfile.id)
    } catch (err: any) {
      const msg = err.message || 'Failed to register student account.'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginDemoStudent = () => {
    const demoProfile: Profile = {
      id: 'demo_student',
      role: 'student',
      display_name: 'Leo M. (Demo)',
      registration_number: 'BLOOMI-3A-01',
      grade_level: 3,
      avatar_id: 'panda',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const demoSession: Session = {
      access_token: 'bloomi_offline_demo_student_token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'bloomi_offline_demo_refresh_token',
      user: {
        id: 'demo_student',
        app_metadata: { provider: 'bloomi_offline_demo' },
        user_metadata: { displayName: 'Leo M. (Demo)' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
    }
    setSession(demoSession)
    setProfile(demoProfile)
  }

  const loginDemoTeacher = () => {
    const demoProfile: Profile = {
      id: 'demo_teacher_id',
      role: 'teacher',
      display_name: 'Ms. Clara Vance (Demo)',
      registration_number: null,
      grade_level: 0,
      avatar_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const demoSession: Session = {
      access_token: 'bloomi_offline_demo_teacher_token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'bloomi_offline_demo_refresh_token',
      user: {
        id: 'demo_teacher_id',
        email: 'teacher@school.edu',
        app_metadata: { provider: 'bloomi_offline_demo' },
        user_metadata: { displayName: 'Ms. Clara Vance (Demo)' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
    }
    setSession(demoSession)
    setProfile(demoProfile)
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await sessionTrackingService.endSession('completed')
      await authService.signOut()
      setSession(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signUpTeacher = async (
    email: string,
    password: string,
    displayName: string,
    schoolName: string,
    invitationCode: string
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const { profile: teacherProfile, session: newSession } = await authService.signUpTeacher(
        email,
        password,
        displayName,
        schoolName,
        invitationCode
      )
      setSession(newSession)
      setProfile(teacherProfile)
    } catch (err: any) {
      const msg = err.message || 'Failed to complete educator onboarding.'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const role = useMemo(() => profile?.role ?? null, [profile])

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    role,
    isLoading,
    error,
    isConfigured: isSupabaseConfigured,
    loginTeacher,
    loginStudent,
    signUpStudent,
    signUpTeacher,
    loginDemoStudent,
    loginDemoTeacher,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
