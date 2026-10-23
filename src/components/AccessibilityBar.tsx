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
          ? 'bg-black border-[#00f5ff] text-white shadow-[0_0_20px_rgba(0,245,255,0.3)]'
          : 'bg-[#0d041e]/90 border-[#ff2a85]/30 text-[#fdf4ff] shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              highContrast ? 'bg-[#00f5ff] text-black' : 'bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/40 shadow-[0_0_12px_rgba(255,42,133,0.5)]'
            }`}
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base tracking-tight font-fredoka neon-text-pink">
              Comfort &amp; Accessibility Tools
            </h2>
            <p className="text-xs text-[#d8b4fe]">
              Personalize text sizing, sensory contrast, and calm motion for your learning style.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#ff2a85] ${
              highContrast
                ? 'bg-[#00f5ff] text-black border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.6)]'
                : 'bg-[#160a33] text-[#d8b4fe] hover:text-white border-[#a855f7]/40 hover:border-[#ff2a85]'
            }`}
            aria-pressed={highContrast}
            title="Toggle high contrast colors for easier reading"
          >
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{highContrast ? 'Contrast: Ultra' : 'Contrast: Cyber'}</span>
          </button>

          {/* Large Text Toggle */}
          <button
            type="button"
            onClick={toggleLargeFont}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#ff2a85] ${
              largeFont
                ? 'bg-[#a855f7] text-white border-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                : 'bg-[#160a33] text-[#d8b4fe] hover:text-white border-[#a855f7]/40 hover:border-[#ff2a85]'
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
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#ff2a85] ${
              reducedMotion
                ? 'bg-[#ff2a85] text-white border-[#ff70a6] shadow-[0_0_15px_rgba(255,42,133,0.6)]'
                : 'bg-[#160a33] text-[#d8b4fe] hover:text-white border-[#a855f7]/40 hover:border-[#ff2a85]'
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
              className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-[#ff2a85] ${
                soundEnabled
                  ? 'bg-[#ffd700] text-black border-[#ffe066] shadow-[0_0_15px_rgba(255,215,0,0.6)]'
                  : 'bg-[#160a33] text-[#d8b4fe] hover:text-white border-[#a855f7]/40 hover:border-[#ff2a85]'
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
