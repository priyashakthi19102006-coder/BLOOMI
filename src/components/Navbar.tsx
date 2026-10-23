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
      className={`sticky top-0 z-50 transition-colors backdrop-blur-xl border-b ${
        highContrast
          ? 'bg-black/95 text-white border-[#00f5ff]'
          : 'bg-[#070212]/90 text-[#fdf4ff] border-[#ff2a85]/25 shadow-[0_4px_30px_rgba(255,42,133,0.15)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-3 focus:ring-[#ff2a85] rounded-2xl p-1"
            aria-label="BLOOMI - Home & Learning Worlds"
          >
            <div className="shrink-0 transition-transform group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(255,42,133,0.7)]">
              <BloomiMascot size={46} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight font-fredoka neon-text-pink"
                >
                  BLOOMI
                </span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                >
                  Grade 3
                </span>
              </div>
              <p className="text-xs font-medium text-[#d8b4fe] hidden sm:block">
                Magical Learning Adventure
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Contrast / Text Sizing helpers */}
            <div className="flex items-center rounded-xl p-1 border border-[#a855f7]/30 bg-[#0e0520]/80 backdrop-blur-md">
              <button
                type="button"
                onClick={toggleHighContrast}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#d8b4fe] hover:text-white hover:bg-[#ff2a85]/20 focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                aria-pressed={highContrast}
                title="Toggle High Contrast"
              >
                {highContrast ? (
                  <Sun className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 text-[#c084fc]" aria-hidden="true" />
                )}
                <span>{highContrast ? 'Cyber Soft' : 'Ultra Contrast'}</span>
              </button>

              <button
                type="button"
                onClick={toggleLargeFont}
                className="min-h-[40px] flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#d8b4fe] hover:text-white hover:bg-[#ff2a85]/20 focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                aria-pressed={largeFont}
                title="Toggle Text Sizing"
              >
                <span className="font-extrabold text-xs text-[#00f5ff]">A+</span>
                <span>{largeFont ? 'Normal Text' : 'Larger Text'}</span>
              </button>
            </div>

            {/* Navigation links & entry points */}
            <nav className="flex items-center gap-3" aria-label="Main Navigation">
              <Link
                to="/"
                className={`min-h-[44px] flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === '/'
                    ? 'text-white bg-[#ff2a85]/20 border border-[#ff2a85]/60 shadow-[0_0_15px_rgba(255,42,133,0.4)]'
                    : 'text-[#d8b4fe] hover:text-white hover:bg-[#a855f7]/15'
                }`}
              >
                Learning Worlds
              </Link>

              {session && profile ? (
                /* Authenticated User View */
                <div className="flex items-center gap-2 pl-3 border-l border-[#ff2a85]/30">
                  {role === 'teacher' ? (
                    <Link
                      to="/teacher/dashboard"
                      className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#a855f7]/25 text-[#f5d0fe] border border-[#a855f7]/60 hover:bg-[#a855f7]/35 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                      <GraduationCap className="w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
                      <span>{profile.display_name || 'Educator Portal'}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/student/hub"
                      className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#ff2a85]/25 text-white border border-[#ff2a85]/60 hover:bg-[#ff2a85]/35 transition-all shadow-[0_0_15px_rgba(255,42,133,0.3)]"
                    >
                      <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                      <span>{profile.display_name || 'Student Hub'}</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl text-[#d8b4fe] hover:text-[#ff2a85] hover:bg-[#ff2a85]/15 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
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
                    className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold btn-neon-pink focus:outline-none focus:ring-3 focus:ring-[#ff2a85]"
                  >
                    <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                    <span>Student Sign-In</span>
                  </Link>

                  <Link
                    to="/login/teacher"
                    className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#0e0520] hover:bg-[#160a33] text-[#c084fc] border border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all focus:outline-none focus:ring-3 focus:ring-[#a855f7]"
                  >
                    <GraduationCap className="w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
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
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#0e0520] border border-[#a855f7]/40 text-[#c084fc]"
              aria-label="Toggle contrast"
            >
              {highContrast ? (
                <Sun className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-[#c084fc]" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/40 focus:outline-none focus:ring-3 focus:ring-[#ff2a85]"
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
        <div className="md:hidden border-t border-[#ff2a85]/25 bg-[#0a0319] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-4 py-2.5 rounded-xl font-bold text-[#fdf4ff] hover:bg-[#ff2a85]/20"
          >
            ✨ Explore Learning Worlds
          </Link>

          {session && profile ? (
            <div className="space-y-2 pt-2 border-t border-[#ff2a85]/20">
              {role === 'teacher' ? (
                <Link
                  to="/teacher/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-[#a855f7]/20 text-[#f5d0fe] border border-[#a855f7]/40"
                >
                  <GraduationCap className="w-5 h-5 text-[#00f5ff]" aria-hidden="true" />
                  <span>Educator Portal ({profile.display_name})</span>
                </Link>
              ) : (
                <Link
                  to="/student/hub"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-[#ff2a85]/20 text-white border border-[#ff2a85]/40"
                >
                  <Sparkles className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  <span>Student Hub ({profile.display_name})</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl"
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
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold btn-neon-pink"
              >
                <User className="w-5 h-5" aria-hidden="true" />
                <span>Student Sign-In</span>
              </Link>
              <Link
                to="/login/teacher"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-[#0e0520] text-[#c084fc] border border-[#a855f7]/40"
              >
                <GraduationCap className="w-5 h-5 text-[#00f5ff]" aria-hidden="true" />
                <span>Teacher &amp; Specialist Portal</span>
              </Link>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={toggleLargeFont}
              className="w-full min-h-[44px] text-center py-2.5 text-xs font-bold text-[#d8b4fe] border border-[#a855f7]/30 rounded-xl bg-[#0e0520]"
            >
              {largeFont ? 'Switch to Standard Text Size' : 'Switch to Larger Text (Accessible)'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
