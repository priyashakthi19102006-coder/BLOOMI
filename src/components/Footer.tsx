import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, ShieldCheck, Accessibility, BookOpen } from 'lucide-react'
import { BloomiMascot } from './BloomiMascot'

interface FooterProps {
  highContrast?: boolean
}

export const Footer: React.FC<FooterProps> = ({ highContrast = false }) => {
  return (
    <footer
      className={`mt-auto border-t transition-colors ${
        highContrast
          ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
          : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.12)] text-[#24483D]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Statement */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <BloomiMascot size={36} reducedMotion />
              <span className="text-xl font-extrabold tracking-tight font-fredoka">
                BLOOMI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#3D6355]">
              Every child grows and learns in their own way. Designed with sensory comfort, dyslexia-friendly typography, and multi-modal exploration for Grade 3 learners.
            </p>
          </div>

          {/* Quick Learning Worlds */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24483D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8A6400]" aria-hidden="true" />
              <span>Learning Worlds</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#3D6355]">
              <li>
                <Link to="/worlds/writing" className="hover:text-[#24483D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-sm">
                  Writing World (Word Garden)
                </Link>
              </li>
              <li>
                <Link to="/worlds/speaking" className="hover:text-[#24483D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-sm">
                  Speaking World (Echo Valley)
                </Link>
              </li>
              <li>
                <Link to="/worlds/visual" className="hover:text-[#24483D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-sm">
                  Visual Discovery (Prism Meadow)
                </Link>
              </li>
              <li>
                <Link to="/worlds/social" className="hover:text-[#24483D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-sm">
                  Social Adventure (Kindness Kingdom)
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility & Inclusivity Commitment */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24483D] flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-[#16563F]" aria-hidden="true" />
              <span>Accessibility Commitment</span>
            </h3>
            <p className="text-xs leading-relaxed text-[#3D6355]">
              Built following Universal Design for Learning (UDL) principles. Features high-contrast modes, scalable Lexend typography, calm motion toggles, and AAC visual-speech cues.
            </p>
          </div>

          {/* Privacy Conscious Learning */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24483D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16563F]" aria-hidden="true" />
              <span>Privacy-Conscious Learning</span>
            </h3>
            <p className="text-xs leading-relaxed text-[#3D6355]">
              Strictly non-commercial and child-safe. No advertising, no tracking of personal student identifiers, and protected by server-side Row-Level Security (RLS).
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Link
                to="/login/teacher"
                className="text-[11px] font-bold text-[#4A248A] hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Educator Verification</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(36,72,61,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#3D6355]">
          <p>
            &copy; {new Date().getFullYear()} BLOOMI Educational Adventure &bull; All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#A34812]" aria-hidden="true" />
              <span>Empowering Every Child</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
