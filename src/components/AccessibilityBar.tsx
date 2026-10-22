import React from 'react'
import { Volume2, Eye, Sparkles } from 'lucide-react'

interface AccessibilityBarProps {
  highContrast: boolean
  toggleHighContrast: () => void
  largeFont: boolean
  toggleLargeFont: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  highContrast,
  toggleHighContrast,
  largeFont,
  toggleLargeFont,
  reducedMotion,
  toggleReducedMotion,
}) => {
  return (
    <aside
      aria-label="Accessibility settings bar"
      className={`rounded-2xl p-4 sm:p-5 transition-all shadow-sm border ${
        highContrast
          ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
          : 'bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-purple-200/70 text-slate-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-200/60 text-purple-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-2">
              Learning Support &amp; Accessibility Tools
            </h3>
            <p className="text-xs text-slate-500">
              Customize contrast, typography, and motion for your learning comfort.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:border-purple-400'
            }`}
            aria-pressed={highContrast}
          >
            <Eye className="w-3.5 h-3.5" />
            {highContrast ? 'High Contrast: ON' : 'High Contrast'}
          </button>

          <button
            type="button"
            onClick={toggleLargeFont}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              largeFont
                ? 'bg-purple-600 text-white border-purple-700 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:border-purple-400'
            }`}
            aria-pressed={largeFont}
          >
            <span className="font-bold text-xs">A+</span>
            {largeFont ? 'Large Text: ON' : 'Large Text'}
          </button>

          <button
            type="button"
            onClick={toggleReducedMotion}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              reducedMotion
                ? 'bg-teal-600 text-white border-teal-700 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:border-teal-400'
            }`}
            aria-pressed={reducedMotion}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {reducedMotion ? 'Calm Motion: ON' : 'Calm Motion'}
          </button>
        </div>
      </div>
    </aside>
  )
}
