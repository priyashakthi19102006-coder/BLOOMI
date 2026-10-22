import React from 'react'
import { Eye, Type, Activity, Volume2, VolumeX, Sparkles } from 'lucide-react'

interface AccessibilityBarProps {
  highContrast: boolean
  toggleHighContrast: () => void
  largeFont: boolean
  toggleLargeFont: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  soundEnabled?: boolean
  toggleSound?: () => void
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  highContrast,
  toggleHighContrast,
  largeFont,
  toggleLargeFont,
  reducedMotion,
  toggleReducedMotion,
  soundEnabled = true,
  toggleSound,
}) => {
  return (
    <aside
      aria-label="Inclusive learning accessibility tools"
      className={`rounded-2xl p-4 sm:p-5 transition-all border ${
        highContrast
          ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
          : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.12)] text-[#24483D] shadow-xs'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              highContrast ? 'bg-[#FFF0B3] text-[#24483D]' : 'bg-[#CDEFE0] text-[#16563F]'
            }`}
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight font-fredoka">
              Comfort &amp; Accessibility Options
            </h2>
            <p
              className={`text-xs ${
                highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
              }`}
            >
              Choose text sizing, sensory contrast, and calm motion to suit your learning style.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#24483D] border-[#FFF0B3] shadow-xs'
                : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6]'
            }`}
            aria-pressed={highContrast}
            title="Toggle high contrast colors for easier reading"
          >
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{highContrast ? 'Contrast: High' : 'Contrast: Soft'}</span>
          </button>

          {/* Large Text Toggle */}
          <button
            type="button"
            onClick={toggleLargeFont}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
              largeFont
                ? 'bg-[#E8DEFF] text-[#4A248A] border-[#D5C2FE] shadow-xs'
                : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6]'
            }`}
            aria-pressed={largeFont}
            title="Toggle larger, dyslexia-friendly text scale"
          >
            <Type className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{largeFont ? 'Text: Larger (A+)' : 'Text: Regular'}</span>
          </button>

          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={toggleReducedMotion}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
              reducedMotion
                ? 'bg-[#CDEFE0] text-[#16563F] border-[#B2E6CE] shadow-xs'
                : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6]'
            }`}
            aria-pressed={reducedMotion}
            title="Toggle calm, minimal motion for sensory ease"
          >
            <Activity className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{reducedMotion ? 'Motion: Calm' : 'Motion: Standard'}</span>
          </button>

          {/* Sound Controls Toggle */}
          {toggleSound && (
            <button
              type="button"
              onClick={toggleSound}
              className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D] ${
                soundEnabled
                  ? 'bg-[#FFE0CC] text-[#7A3300] border-[#F8D2B8] shadow-xs'
                  : 'bg-[#FFFDF7] text-[#24483D] border-[rgba(36,72,61,0.2)] hover:bg-[#F2FAF6]'
              }`}
              aria-pressed={soundEnabled}
              title="Toggle interactive audio feedback"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{soundEnabled ? 'Audio: On' : 'Audio: Muted'}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
