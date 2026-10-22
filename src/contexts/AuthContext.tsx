import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { authService } from '../services/auth.service'
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
            if (isMounted) setProfile(userProfile)
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
        if (isMounted) setProfile(userProfile)
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
    } catch (err: any) {
      const msg = err.message || 'Failed to authenticate student.'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.signOut()
      setSession(null)
      setProfile(null)
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
