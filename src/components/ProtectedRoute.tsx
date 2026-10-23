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
        <div className="w-12 h-12 rounded-full border-4 border-[#ff2a85]/20 border-t-[#ff2a85] animate-spin shadow-[0_0_20px_rgba(255,42,133,0.5)]" />
        <p className="text-pink-300 font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffd700]" />
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
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#160a33] text-[#ff2a85] border-2 border-[#ff2a85]/50 flex items-center justify-center shadow-[0_0_25px_rgba(255,42,133,0.3)]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-fredoka text-white">
          Access Restricted
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          Your current account role (<strong className="text-[#00f5ff]">{role}</strong>) does not have authorization to view this area.
        </p>
        <div className="pt-2">
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
