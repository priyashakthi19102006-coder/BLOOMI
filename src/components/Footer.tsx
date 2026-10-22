import React from 'react'
import { Heart, Sparkles, ShieldCheck } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-8 text-center text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Designed for Grade 3 Learners
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500" />
            Neurodiverse & AAC Support Ready
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            COPPA & Inclusive Privacy Conscious
          </span>
        </div>

        <p className="text-xs text-slate-400">
          BLOOMI Educational Adventure &bull; Stage 1 Foundation &bull; Built with React, TypeScript &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
