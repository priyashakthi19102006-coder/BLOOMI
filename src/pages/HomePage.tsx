import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Smile, BookOpen, Volume2 } from 'lucide-react'
import { AccessibilityBar } from '../components/AccessibilityBar'
import { WorldCard } from '../components/WorldCard'
import { learningWorldsService } from '../services/learningWorlds.service'

interface LayoutContext {
  highContrast: boolean
  toggleHighContrast: () => void
  largeFont: boolean
  toggleLargeFont: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

export const HomePage: React.FC = () => {
  const {
    highContrast,
    toggleHighContrast,
    largeFont,
    toggleLargeFont,
    reducedMotion,
    toggleReducedMotion,
  } = useOutletContext<LayoutContext>()

  const worlds = learningWorldsService.getAllWorlds()

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Accessibility Bar */}
      <AccessibilityBar
        highContrast={highContrast}
        toggleHighContrast={toggleHighContrast}
        largeFont={largeFont}
        toggleLargeFont={toggleLargeFont}
        reducedMotion={reducedMotion}
        toggleReducedMotion={toggleReducedMotion}
      />

      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 transition-all border ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 text-white shadow-xl'
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Inclusive Learning Adventure &bull; Grade 3</span>
          </div>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-fredoka leading-tight"
          >
            Where Every Learner Blooms at Their Own Pace.
          </h1>

          <p className="text-base sm:text-xl text-purple-100 font-medium max-w-2xl leading-relaxed">
            Welcome to <strong className="text-white font-bold">BLOOMI</strong> — an educational universe designed with neurodiverse learners, AAC communicators, and Grade 3 adventurers at heart.
          </p>

          {/* Quick Hub Portals */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              to="/login/student"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-base sm:text-lg bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              <Smile className="w-5 h-5" />
              <span>Start My Adventure</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link
              to="/login/teacher"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <BookOpen className="w-5 h-5" />
              <span>Educator &amp; Therapist Portal</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow circle */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* Four Learning Worlds Section */}
      <section aria-labelledby="worlds-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2
              id="worlds-heading"
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-fredoka ${
                highContrast ? 'text-yellow-300' : 'text-slate-900'
              }`}
            >
              Four Magical Learning Worlds
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              Select a world to discover customized activities, sensory-friendly pacing, and multimodal learning tools.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 self-start sm:self-auto">
            Universal Design for Learning (UDL)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {worlds.map((world) => (
            <WorldCard
              key={world.id}
              world={world}
              reducedMotion={reducedMotion}
              highContrast={highContrast}
            />
          ))}
        </div>
      </section>

      {/* Inclusive Pillars */}
      <section
        aria-labelledby="inclusive-pillars"
        className={`rounded-3xl p-6 sm:p-10 border ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2
            id="inclusive-pillars"
            className="text-2xl sm:text-3xl font-extrabold font-fredoka text-slate-900"
          >
            Built With Every Child in Mind
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            BLOOMI adapts to different reading, communication, and sensory processing preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Accessible Typography</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lexend and Fredoka font scales provide open letter spacing and clear differentiation to ease dyslexia and visual fatigue.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/60 space-y-2">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 w-fit">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multimodal Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visual symbol cards, voice interaction, and AAC communication cues allow non-speaking or emerging speakers to thrive.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Calm &amp; Paced</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No sudden loud buzzers, no stressful timers. Encouraging positive reinforcement keeps confidence soaring high.
            </p>
          </div>
        </div>

        {/* Stage 1 Foundation Notice */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>Stage 1 (Foundation):</strong> Verified architecture, responsive layout, and routing. Ready for Stage 2 backend integration.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px]">
            Frontend MVP Foundation
          </span>
        </div>
      </section>
    </div>
  )
}
