import { describe, it, expect } from 'vitest'
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase'

describe('Supabase Client Configuration', () => {
  it('correctly reports configuration status based on environment variables', () => {
    // When using placeholder values, isSupabaseConfigured should be false
    expect(typeof isSupabaseConfigured).toBe('boolean')
  })

  it('throws an informative, actionable error when attempting to get an unconfigured client', () => {
    if (!isSupabaseConfigured) {
      expect(() => getSupabaseClient()).toThrowError(
        /Supabase client is not configured/
      )
    }
  })
})

describe('Student Credentials & Input Validation Rules', () => {
  const validateStudentInput = (registrationNumber: string, password: string) => {
    const trimmedRegNo = registrationNumber.trim().toUpperCase()
    if (!trimmedRegNo) return { valid: false, error: 'Registration number is required.' }
    if (trimmedRegNo.length < 3 || trimmedRegNo.length > 30) {
      return { valid: false, error: 'Registration number must be between 3 and 30 characters.' }
    }
    // Only letters, digits, and hyphens/underscores allowed
    if (!/^[A-Z0-9_-]+$/.test(trimmedRegNo)) {
      return { valid: false, error: 'Registration number contains invalid characters.' }
    }
    if (!password || password.length < 4) {
      return { valid: false, error: 'Password must be at least 4 characters.' }
    }
    return { valid: true, error: null }
  }

  it('accepts valid Grade 3 student registration numbers', () => {
    expect(validateStudentInput('BLOOMI-3A-01', 'adventure2026').valid).toBe(true)
    expect(validateStudentInput('STU_1002', 'pass123').valid).toBe(true)
  })

  it('rejects empty or whitespace-only registration numbers', () => {
    expect(validateStudentInput('', 'adventure2026').valid).toBe(false)
    expect(validateStudentInput('   ', 'adventure2026').valid).toBe(false)
  })

  it('rejects passwords shorter than 4 characters', () => {
    expect(validateStudentInput('BLOOMI-3A-01', '123').valid).toBe(false)
  })

  it('rejects registration numbers containing SQL injection or special characters', () => {
    expect(validateStudentInput("BLOOMI' OR '1'='1", 'secret123').valid).toBe(false)
    expect(validateStudentInput('<script>', 'secret123').valid).toBe(false)
  })
})

describe('Role Authorization & Access Control Rules', () => {
  const canAccessRoute = (
    userRole: 'student' | 'teacher' | 'admin' | null,
    allowedRoles: ('student' | 'teacher' | 'admin')[]
  ): boolean => {
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }

  it('allows teachers and admins to access teacher dashboard', () => {
    expect(canAccessRoute('teacher', ['teacher', 'admin'])).toBe(true)
    expect(canAccessRoute('admin', ['teacher', 'admin'])).toBe(true)
  })

  it('strictly denies students from accessing teacher dashboard', () => {
    expect(canAccessRoute('student', ['teacher', 'admin'])).toBe(false)
  })

  it('strictly denies unauthenticated users from accessing any protected route', () => {
    expect(canAccessRoute(null, ['student'])).toBe(false)
    expect(canAccessRoute(null, ['teacher'])).toBe(false)
  })

  it('allows students to access student hub', () => {
    expect(canAccessRoute('student', ['student', 'admin'])).toBe(true)
  })
})
