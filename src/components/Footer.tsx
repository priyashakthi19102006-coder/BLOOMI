import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, Accessibility, BookOpen } from 'lucide-react'
import { BloomiMascot } from './BloomiMascot'

interface FooterProps {
  highContrast?: boolean
}

export const Footer: React.FC<FooterProps> = ({ highContrast = false }) => {
  return (
    <footer
      className={`mt-auto border-t transition-colors ${
        highContrast
          ? 'bg-black border-[#00f5ff] text-white'
          : 'bg-[#070212] border-[#ff2a85]/20 text-[#fdf4ff]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Statement */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="filter drop-shadow-[0_0_8px_rgba(255,42,133,0.7)]">
                <BloomiMascot size={36} reducedMotion />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-fredoka neon-text-pink">
                BLOOMI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#d8b4fe]">
              Every child grows and learns in their own magical way. Designed with sensory comfort, dyslexia-friendly typography, and multi-modal exploration for Grade 3 learners.
            </p>
          </div>

          {/* Quick Learning Worlds */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#ff2a85] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span>Magical Worlds</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#d8b4fe]">
              <li>
                <Link to="/worlds/writing" className="hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-sm">
                  Magic Amusement Park (Writing)
                </Link>
              </li>
              <li>
                <Link to="/worlds/speaking" className="hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-sm">
                  Magic Food World (Speaking)
                </Link>
              </li>
              <li>
                <Link to="/worlds/visual" className="hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-sm">
                  Magic Space World (Visual Discovery)
                </Link>
              </li>
              <li>
                <Link to="/worlds/social" className="hover:text-[#ff2a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-sm">
                  Magic Animal World (Social Understanding)
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility & Learner Care */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#c084fc] flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
              <span>Inclusive Design</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#d8b4fe]">
              <li>Lexend &amp; Fredoka High-Legibility Fonts</li>
              <li>Comfortable Touch Targets (44px+)</li>
              <li>Calm &amp; Motion-Safe Settings</li>
              <li>Zero Punitive Failure or Timers</li>
            </ul>
          </div>

          {/* Ethical Pedagogical Commitment */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00f5ff] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00f5ff]" aria-hidden="true" />
              <span>Pedagogy First</span>
            </h3>
            <p className="text-xs leading-relaxed text-[#d8b4fe]">
              Non-diagnostic learning engine. Real classroom roster authorization with strict PostgreSQL row-level security.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#ff2a85]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#d8b4fe]/80">
          <p>© {new Date().getFullYear()} BLOOMI. Designed for Grade 3 diverse learners.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-[#d8b4fe]">
              <BookOpen className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
              Grade 3 Aligned
            </span>
            <span className="text-[#00f5ff] font-semibold">
              Cyber-Magical Edition
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
