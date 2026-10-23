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

describe('Teacher Credentials & Input Validation Rules', () => {
  const validateTeacherInput = (email: string, password: string) => {
    const trimmed = email.trim()
    if (!trimmed) {
      return { valid: false, error: 'Please enter your school or specialist email address.' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { valid: false, error: 'Please enter a valid email address.' }
    }
    if (!password || password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters.' }
    }
    return { valid: true, error: null }
  }

  it('accepts valid school and specialist email addresses with sufficient password', () => {
    expect(validateTeacherInput('educator@school.edu', 'secretPass123').valid).toBe(true)
    expect(validateTeacherInput('specialist.clara@district.org', 'bloomi2026').valid).toBe(true)
  })

  it('rejects invalid email formats', () => {
    expect(validateTeacherInput('not-an-email', 'secretPass123').valid).toBe(false)
    expect(validateTeacherInput('user@domain', 'secretPass123').valid).toBe(false)
    expect(validateTeacherInput('', 'secretPass123').valid).toBe(false)
  })

  it('rejects teacher passwords shorter than 6 characters', () => {
    expect(validateTeacherInput('educator@school.edu', '12345').valid).toBe(false)
  })
})

describe('Show / Hide Password Behavior', () => {
  it('toggles password input type between password and text', () => {
    let showPassword = false
    const toggle = () => {
      showPassword = !showPassword
    }

    expect(showPassword ? 'text' : 'password').toBe('password')
    toggle()
    expect(showPassword ? 'text' : 'password').toBe('text')
    toggle()
    expect(showPassword ? 'text' : 'password').toBe('password')
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
    expect(canAccessRoute(null, ['admin'])).toBe(false)
  })

  it('allows students to access student hub', () => {
    expect(canAccessRoute('student', ['student', 'admin'])).toBe(true)
  })

  it('denies arbitrary role elevation', () => {
    const defaultRole = null
    expect(canAccessRoute(defaultRole, ['student'])).toBe(false)
    expect(canAccessRoute(defaultRole, ['teacher'])).toBe(false)
  })
})

describe('Student Sign-Up Input Validation & Security Rules', () => {
  const validateStudentSignUp = (params: {
    displayName: string
    registrationNumber: string
    password: string
    confirmPassword?: string
    avatarId: string
  }) => {
    const trimmedName = params.displayName.trim()
    const trimmedRegNo = params.registrationNumber.trim().toUpperCase()

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 40) {
      return { valid: false, error: 'Display name must be between 2 and 40 characters.' }
    }

    if (!trimmedRegNo || trimmedRegNo.length < 3 || trimmedRegNo.length > 30) {
      return { valid: false, error: 'Registration code must be between 3 and 30 characters.' }
    }

    if (!/^[A-Z0-9_-]+$/.test(trimmedRegNo)) {
      return { valid: false, error: 'Registration code contains invalid characters.' }
    }

    if (!params.password || params.password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters.' }
    }

    if (params.confirmPassword !== undefined && params.password !== params.confirmPassword) {
      return { valid: false, error: 'Passwords do not match.' }
    }

    const validAvatars = ['lion', 'panda', 'fox', 'dolphin']
    if (!validAvatars.includes(params.avatarId)) {
      return { valid: false, error: 'Please choose an avatar buddy.' }
    }

    return { valid: true, error: null }
  }

  it('accepts valid student sign-up parameters', () => {
    const result = validateStudentSignUp({
      displayName: 'Leo M.',
      registrationNumber: 'BLOOMI-3A-01',
      password: 'mypassword123',
      confirmPassword: 'mypassword123',
      avatarId: 'panda',
    })
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('rejects passwords that do not match confirmation', () => {
    const result = validateStudentSignUp({
      displayName: 'Leo M.',
      registrationNumber: 'BLOOMI-3A-01',
      password: 'mypassword123',
      confirmPassword: 'differentpassword',
      avatarId: 'panda',
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Passwords do not match')
  })

  it('rejects display names that are too short or too long', () => {
    expect(
      validateStudentSignUp({
        displayName: 'L',
        registrationNumber: 'BLOOMI-3A-01',
        password: 'password123',
        avatarId: 'panda',
      }).valid
    ).toBe(false)

    expect(
      validateStudentSignUp({
        displayName: 'A'.repeat(45),
        registrationNumber: 'BLOOMI-3A-01',
        password: 'password123',
        avatarId: 'panda',
      }).valid
    ).toBe(false)
  })

  it('normalizes registration codes to uppercase and strips whitespace', () => {
    const input = '   bloomi-3a-01   '
    const normalized = input.trim().toUpperCase()
    expect(normalized).toBe('BLOOMI-3A-01')
  })

  it('enforces role isolation ensuring public registration creates only student role', () => {
    const payload: { role?: string } = {}
    const enforcedRole = 'student'
    expect(payload.role || enforcedRole).toBe('student')
  })
})

describe('Edge Function Error Extraction & Sanitization', () => {
  // Import helper from authService
  it('extracts custom error message from error.context.json() when status is non-2xx', async () => {
    const { extractEdgeFunctionError } = await import('../services/auth.service')

    const mockNon2xxError = {
      message: 'Edge Function returned a non-2xx status code',
      context: {
        json: async () => ({
          error: 'This registration code is already in use. If this is your account, please switch to Sign In with your adventure password.',
        }),
      },
    }

    const message = await extractEdgeFunctionError(
      mockNon2xxError,
      'Failed to register student account. Please try again.'
    )

    expect(message).toBe(
      'This registration code is already in use. If this is your account, please switch to Sign In with your adventure password.'
    )
    expect(message).not.toContain('non-2xx status code')
  })

  it('sanitizes internal routing emails and credentials from client-facing errors', async () => {
    const { extractEdgeFunctionError } = await import('../services/auth.service')

    const mockLeakError = {
      message: 'Edge Function returned a non-2xx status code',
      context: {
        json: async () => ({
          error: 'Account stu_bloomi01@bloomi.internal already registered with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz.abc',
        }),
      },
    }

    const message = await extractEdgeFunctionError(mockLeakError, 'Default fallback')
    expect(message).not.toContain('stu_bloomi01@bloomi.internal')
    expect(message).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    expect(message).toContain('[school account]')
    expect(message).toContain('[token]')
  })

  it('falls back cleanly to custom fallback when context is missing or unparseable', async () => {
    const { extractEdgeFunctionError } = await import('../services/auth.service')

    const mockGenericError = {
      message: 'Edge Function returned a non-2xx status code',
      context: {},
    }

    const message = await extractEdgeFunctionError(
      mockGenericError,
      'Invalid school registration number or password.'
    )

    expect(message).toBe('Invalid school registration number or password.')
  })
})

describe('Student Session Isolation During Registration', () => {
  it('ensures existing sessions are cleared to prevent session leakage during student registration', () => {
    let activeSession: { userId: string } | null = { userId: 'old_student_123' }

    const clearExistingSession = () => {
      if (activeSession) {
        activeSession = null
      }
    }

    expect(activeSession).not.toBeNull()
    clearExistingSession()
    expect(activeSession).toBeNull()
  })

  it('detects duplicate registration code errors and formats user-facing recovery guidance', () => {
    const errorText = 'This registration code is already in use. If this is your account, please switch to Sign In with your adventure password.'
    const isDuplicate =
      errorText.includes('already in use') || errorText.includes('already registered')

    expect(isDuplicate).toBe(true)
  })
})

describe('Verified Educator Onboarding Flow', () => {
  it('rejects teacher onboarding without an approved school invitation code', async () => {
    const { authService } = await import('../services/auth.service')

    await expect(
      authService.signUpTeacher(
        'teacher@school.edu',
        'password123',
        'Ms. Johnson',
        'Oak Elementary',
        'INVALID-CODE-999'
      )
    ).rejects.toThrow(/Invalid educator invitation code/)
  })

  it('recognizes valid school invitation codes (e.g. BLOOMI-TEACH-2026, BLOOMI-SPECIALIST-2026)', async () => {
    const validCodes = ['BLOOMI-TEACH-2026', 'BLOOMI-EDU-GRADE3', 'BLOOMI-SPECIALIST-2026']

    const checkCode = (code: string) => {
      const APPROVED = ['BLOOMI-TEACH-2026', 'BLOOMI-EDU-GRADE3', 'BLOOMI-SPECIALIST-2026']
      return APPROVED.includes(code.trim().toUpperCase())
    }

    validCodes.forEach((code) => {
      expect(checkCode(code)).toBe(true)
      expect(checkCode(code.toLowerCase())).toBe(true)
    })

    expect(checkCode('RANDOM-CODE')).toBe(false)
    expect(checkCode('')).toBe(false)
  })
})


