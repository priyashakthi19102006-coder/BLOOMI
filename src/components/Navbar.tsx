import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, GraduationCap, User, Menu, X, Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BloomiMascot } from './BloomiMascot'

interface NavbarProps {
  highContrast: boolean
  toggleHighContrast: () => void
  largeFont: boolean
  toggleLargeFont: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  highContrast,
  toggleHighContrast,
  largeFont,
  toggleLargeFont,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { session, profile, role, logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors backdrop-blur-md border-b ${
        highContrast
          ? 'bg-[#0C1210]/95 text-[#FFFDF7] border-[#FFF0B3]'
          : 'bg-[#FFFDF7]/95 text-[#24483D] border-[rgba(36,72,61,0.12)] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-3 focus:ring-[#24483D] rounded-2xl p-1"
            aria-label="BLOOMI - Home & Learning Worlds"
          >
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <BloomiMascot size={46} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-fredoka ${
                    highContrast ? 'text-[#FFF0B3]' : 'text-[#24483D]'
                  }`}
                >
                  BLOOMI
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block ${
                    highContrast
                      ? 'bg-[#FFF0B3] text-[#24483D]'
                      : 'bg-[#CDEFE0] text-[#16563F]'
                  }`}
                >
                  Grade 3
                </span>
              </div>
              <p
                className={`text-xs font-medium hidden sm:block ${
                  highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
                }`}
              >
                Every child blooms in their own way
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Contrast / Text Sizing helpers */}
            <div className="flex items-center rounded-xl p-1 border border-[rgba(36,72,61,0.15)] bg-white/70">
              <button
                type="button"
                onClick={toggleHighContrast}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#24483D] hover:bg-[#F2FAF6] focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                aria-pressed={highContrast}
                title="Toggle High Contrast"
              >
                {highContrast ? (
                  <Sun className="w-4 h-4 text-[#8A6400]" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 text-[#4A248A]" aria-hidden="true" />
                )}
                <span>{highContrast ? 'Soft Mode' : 'High Contrast'}</span>
              </button>

              <button
                type="button"
                onClick={toggleLargeFont}
                className="min-h-[40px] flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#24483D] hover:bg-[#F2FAF6] focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                aria-pressed={largeFont}
                title="Toggle Text Sizing"
              >
                <span className="font-extrabold text-xs">A+</span>
                <span>{largeFont ? 'Normal' : 'Larger'}</span>
              </button>
            </div>

            {/* Navigation links & entry points */}
            <nav className="flex items-center gap-2.5" aria-label="Main Navigation">
              <Link
                to="/"
                className={`min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === '/'
                    ? 'text-[#24483D] bg-[#CDEFE0]'
                    : 'text-[#3D6355] hover:text-[#24483D] hover:bg-[#F2FAF6]'
                }`}
              >
                Learning Worlds
              </Link>

              {session && profile ? (
                /* Authenticated User View */
                <div className="flex items-center gap-2 pl-2 border-l border-[rgba(36,72,61,0.15)]">
                  {role === 'teacher' ? (
                    <Link
                      to="/teacher/dashboard"
                      className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E8DEFF] text-[#4A248A] border border-[#D5C2FE] hover:brightness-95 transition-all shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4" aria-hidden="true" />
                      <span>{profile.display_name || 'Educator Portal'}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/student/hub"
                      className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FFE0CC] text-[#7A3300] border border-[#F8D2B8] hover:brightness-95 transition-all shadow-xs"
                    >
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>{profile.display_name || 'Student Hub'}</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl text-[#3D6355] hover:text-[#24483D] hover:bg-[#F2FAF6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                /* Unauthenticated View: Clearly Separated Entry Points */
                <>
                  <Link
                    to="/login/student"
                    className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border border-[#F8D2B8] shadow-xs transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-[#7A3300]"
                  >
                    <Sparkles className="w-4 h-4 text-[#7A3300]" aria-hidden="true" />
                    <span>Student Hub</span>
                  </Link>

                  <Link
                    to="/login/teacher"
                    className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white hover:bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE] shadow-xs transition-colors focus:outline-none focus:ring-3 focus:ring-[#4A248A]"
                  >
                    <GraduationCap className="w-4 h-4 text-[#4A248A]" aria-hidden="true" />
                    <span>Teacher Portal</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[rgba(36,72,61,0.15)] text-[#24483D]"
              aria-label="Toggle contrast"
            >
              {highContrast ? (
                <Sun className="w-5 h-5 text-[#8A6400]" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-[#4A248A]" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#CDEFE0] text-[#16563F] focus:outline-none focus:ring-3 focus:ring-[#24483D]"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(36,72,61,0.12)] bg-[#FFFDF7] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-4 py-2.5 rounded-xl font-bold text-[#24483D] hover:bg-[#CDEFE0]"
          >
            🌸 Explore Learning Worlds
          </Link>

          {session && profile ? (
            <div className="space-y-2 pt-2 border-t border-[rgba(36,72,61,0.12)]">
              {role === 'teacher' ? (
                <Link
                  to="/teacher/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-[#E8DEFF] text-[#4A248A]"
                >
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                  <span>Educator Portal ({profile.display_name})</span>
                </Link>
              ) : (
                <Link
                  to="/student/hub"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-[#FFE0CC] text-[#7A3300]"
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span>Student Hub ({profile.display_name})</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              <Link
                to="/login/student"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold bg-[#FFE0CC] text-[#7A3300] border border-[#F8D2B8] shadow-xs"
              >
                <User className="w-5 h-5" aria-hidden="true" />
                <span>Student Hub Sign-In</span>
              </Link>
              <Link
                to="/login/teacher"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-white text-[#4A248A] border border-[#D5C2FE]"
              >
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
                <span>Teacher &amp; Specialist Portal</span>
              </Link>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={toggleLargeFont}
              className="w-full min-h-[44px] text-center py-2.5 text-xs font-bold text-[#3D6355] border border-[rgba(36,72,61,0.2)] rounded-xl bg-white"
            >
              {largeFont ? 'Switch to Standard Text Size' : 'Switch to Larger Text (Accessible)'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
