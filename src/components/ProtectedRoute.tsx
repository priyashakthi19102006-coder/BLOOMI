import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldAlert, Sparkles } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('student' | 'teacher' | 'admin')[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { session, role, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        className="min-h-[50vh] flex flex-col items-center justify-center space-y-4"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
        <p className="text-slate-600 font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Securing your adventure portal...</span>
        </p>
      </div>
    )
  }

  // Not signed in -> redirect to appropriate portal
  if (!session) {
    const targetRedirect = allowedRoles?.includes('teacher')
      ? '/login/teacher'
      : '/login/student'
    return <Navigate to={targetRedirect} state={{ from: location }} replace />
  }

  // Signed in, but role does not match requirements
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-fredoka text-slate-900">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your current account role (<strong>{role}</strong>) does not have authorization to view this area.
        </p>
        <div className="pt-2">
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
