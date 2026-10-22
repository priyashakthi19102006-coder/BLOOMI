import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, GraduationCap, User, Menu, X, Sun, Moon } from 'lucide-react'

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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors backdrop-blur-md border-b ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white/90 text-slate-800 border-purple-100 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-4 focus:ring-purple-400 rounded-xl p-1"
            aria-label="BLOOMI Home - Inclusive Learning Adventure"
          >
            <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-2xl" role="img" aria-label="Bloomi Flower">🌸</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-fredoka bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  BLOOMI
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700 hidden sm:inline-block">
                  Grade 3
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Inclusive Learning Adventure
              </p>
            </div>
          </Link>

          {/* Accessibility Quick Controls & Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {/* Accessibility helpers */}
            <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200">
              <button
                type="button"
                onClick={toggleHighContrast}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white transition-all text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-pressed={highContrast}
                title="Toggle High Contrast for Visual Support"
              >
                {highContrast ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-purple-600" />}
                <span>{highContrast ? 'Standard Mode' : 'High Contrast'}</span>
              </button>

              <button
                type="button"
                onClick={toggleLargeFont}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white transition-all text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-pressed={largeFont}
                title="Toggle Text Sizing"
              >
                <span className="font-bold text-sm">A+</span>
                <span>{largeFont ? 'Default Text' : 'Larger Text'}</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2" aria-label="Main Navigation">
              <Link
                to="/"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/'
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                Learning Worlds
              </Link>

              {/* Student Entry */}
              <Link
                to="/login/student"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 hover:brightness-105 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Student Hub</span>
              </Link>

              {/* Teacher Entry */}
              <Link
                to="/login/teacher"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Educator Portal</span>
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Toggle contrast"
            >
              {highContrast ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            🏠 Learning Worlds
          </Link>
          <Link
            to="/login/student"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 shadow-xs"
          >
            <User className="w-5 h-5" />
            <span>Student Hub Entry</span>
          </Link>
          <Link
            to="/login/teacher"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-purple-700 border border-purple-200 hover:bg-purple-50"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Educator & Therapist Portal</span>
          </Link>
          <button
            type="button"
            onClick={toggleLargeFont}
            className="w-full text-center py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg"
          >
            {largeFont ? 'Switch to Normal Text' : 'Switch to Larger Text (Accessible)'}
          </button>
        </div>
      )}
    </header>
  )
}
