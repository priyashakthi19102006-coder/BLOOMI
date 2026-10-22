import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Compass,
  Trophy,
  Smile,
  GraduationCap,
  Volume2,
  RefreshCw,
  Lightbulb,
  Heart,
} from 'lucide-react'
import { AccessibilityBar } from '../components/AccessibilityBar'
import { WorldCard } from '../components/WorldCard'
import { BloomiMascot } from '../components/BloomiMascot'
import { learningWorldsService } from '../services/learningWorlds.service'
import type { AccessibilityContextType } from '../layouts/RootLayout'

export const HomePage: React.FC = () => {
  const {
    highContrast,
    toggleHighContrast,
    largeFont,
    toggleLargeFont,
    reducedMotion,
    toggleReducedMotion,
    soundEnabled,
    toggleSound,
  } = useOutletContext<AccessibilityContextType>()

  const worlds = learningWorldsService.getAllWorlds()

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* Accessibility Toolbar */}
      <AccessibilityBar
        highContrast={highContrast}
        toggleHighContrast={toggleHighContrast}
        largeFont={largeFont}
        toggleLargeFont={toggleLargeFont}
        reducedMotion={reducedMotion}
        toggleReducedMotion={toggleReducedMotion}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Hero Section */}
      <section
        aria-labelledby="hero-title"
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.12)] text-[#24483D] shadow-xs'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Text */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CDEFE0] text-[#16563F] border border-[#B2E6CE] text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-[#16563F]" aria-hidden="true" />
              <span>Inclusive Grade 3 Learning Adventure</span>
            </div>

            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-fredoka leading-tight"
            >
              Every Little Step Helps You Bloom.
            </h1>

            <p className="text-base sm:text-xl leading-relaxed text-[#3D6355] font-medium max-w-2xl">
              Welcome to <strong className="text-[#24483D] font-bold">BLOOMI</strong>! A cheerful, calm world where you can explore reading, speech, puzzles, and friendship at your very own pace — with helpful hints whenever you need them.
            </p>

            {/* Clear Primary & Secondary Actions */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to="/login/student"
                className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-extrabold text-base sm:text-lg bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border-2 border-[#F8D2B8] shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#7A3300]"
              >
                <Smile className="w-5 h-5 text-[#7A3300]" aria-hidden="true" />
                <span>Start Your Adventure</span>
                <ArrowRight className="w-5 h-5 text-[#7A3300]" aria-hidden="true" />
              </Link>

              <Link
                to="/login/teacher"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-[#FFFDF7] hover:bg-[#F7F4FF] text-[#4A248A] border-2 border-[#D5C2FE] transition-colors focus:outline-none focus:ring-4 focus:ring-[#4A248A]"
              >
                <GraduationCap className="w-5 h-5 text-[#4A248A]" aria-hidden="true" />
                <span>Teacher Portal</span>
              </Link>
            </div>
          </div>

          {/* Hero Mascot & Illustration */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div
              className={`relative p-8 rounded-3xl border-2 ${
                highContrast
                  ? 'bg-[#0C1210] border-[#FFF0B3]'
                  : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.1)] shadow-xs'
              }`}
            >
              {/* Friendly Speech Bubble */}
              <div
                className={`mb-4 px-4 py-2 rounded-2xl text-xs font-bold text-center border shadow-xs ${
                  highContrast
                    ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFF0B3]'
                    : 'bg-[#CDEFE0] border-[#B2E6CE] text-[#16563F]'
                }`}
              >
                Hi friend! Ready to bloom today? 🌸
              </div>

              <div className="flex justify-center">
                <BloomiMascot size={140} reducedMotion={reducedMotion} />
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D6355]">
                  Bloomi the Sprout
                </span>
                <p className="text-[11px] text-[#3D6355]/80">Your friendly adventure guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Learning Worlds Section */}
      <section aria-labelledby="worlds-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2
              id="worlds-heading"
              className="text-2xl sm:text-4xl font-extrabold tracking-tight font-fredoka text-[#24483D]"
            >
              Explore Your Four Learning Worlds
            </h2>
            <p className="text-sm sm:text-base text-[#3D6355] font-medium mt-1">
              Every world focuses on a core skill with playful interactive activities, sensory comfort, and gentle pacing.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#E8DEFF] text-[#4A248A] border border-[#D5C2FE] self-start sm:self-auto">
            Grade 3 Curriculum
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

      {/* How BLOOMI Works: 3 Simple Steps */}
      <section
        aria-labelledby="how-it-works-title"
        className={`rounded-3xl p-6 sm:p-10 border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.12)] text-[#24483D] shadow-xs'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3D6355]">
            <Sparkles className="w-4 h-4 text-[#8A6400]" aria-hidden="true" />
            <span>How It Works</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]"
          >
            Three Easy Steps to Bloom
          </h2>
          <p className="text-sm text-[#3D6355] leading-relaxed">
            Learning is an adventure, not a test. Here is how children explore each day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Step 1: Explore */}
          <div
            className={`p-6 rounded-3xl border-2 space-y-3 ${
              highContrast
                ? 'bg-[#0C1210] border-[#FFF0B3]'
                : 'bg-[#FFFDF7] border-[#CDEFE0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#CDEFE0] text-[#16563F] font-extrabold text-sm flex items-center justify-center">
                1
              </span>
              <Compass className="w-6 h-6 text-[#16563F]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-extrabold font-fredoka text-[#24483D]">
              1. Explore
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-medium">
              Choose any of the four learning worlds that interests you today. Wander through word gardens, echo valleys, or kindness kingdoms.
            </p>
          </div>

          {/* Step 2: Practise */}
          <div
            className={`p-6 rounded-3xl border-2 space-y-3 ${
              highContrast
                ? 'bg-[#0C1210] border-[#FFF0B3]'
                : 'bg-[#FFFDF7] border-[#E8DEFF]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#E8DEFF] text-[#4A248A] font-extrabold text-sm flex items-center justify-center">
                2
              </span>
              <Sparkles className="w-6 h-6 text-[#4A248A]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-extrabold font-fredoka text-[#24483D]">
              2. Practise
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-medium">
              Try fun challenges with helpful audio cues, visual hints, and letter tiles. There are no timers, so you can think as long as you like.
            </p>
          </div>

          {/* Step 3: Celebrate Progress */}
          <div
            className={`p-6 rounded-3xl border-2 space-y-3 ${
              highContrast
                ? 'bg-[#0C1210] border-[#FFF0B3]'
                : 'bg-[#FFFDF7] border-[#FFF0B3]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#FFF0B3] text-[#664B00] font-extrabold text-sm flex items-center justify-center">
                3
              </span>
              <Trophy className="w-6 h-6 text-[#664B00]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-extrabold font-fredoka text-[#24483D]">
              3. Celebrate Progress
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-medium">
              Celebrate every small success! Earn cheerful sprout badges, review with teachers, and watch your skills bloom over time.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusive Learning Philosophy Section */}
      <section
        aria-labelledby="inclusive-title"
        className={`rounded-3xl p-6 sm:p-10 border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#F2FAF6] border-[#B2E6CE] text-[#24483D]'
        }`}
      >
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#B2E6CE] text-xs font-bold text-[#16563F]">
            <Heart className="w-3.5 h-3.5 text-[#16563F]" aria-hidden="true" />
            <span>Inclusive Learning Philosophy</span>
          </div>

          <h2
            id="inclusive-title"
            className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]"
          >
            Learning That Fits Every Child
          </h2>

          <p className="text-sm sm:text-base text-[#3D6355] leading-relaxed font-medium">
            Children learn best when they feel confident, supported, and unhurried. BLOOMI is designed to adapt to your child, never the other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#FFF5EE] text-[#7A3300] border border-[#F8D2B8] w-fit">
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-[#24483D] text-sm">
              Unlimited Retries
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed">
              Practise tasks as many times as you like. Making mistakes is simply how our brains explore and learn.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D] w-fit">
              <Lightbulb className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-[#24483D] text-sm">
              Friendly Hints
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed">
              Stuck on a tricky word or puzzle? Friendly visual clues and gentle steps are always one click away.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE] w-fit">
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-[#24483D] text-sm">
              Multi-Modal Ways to Play
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed">
              Listen, speak, tap, or use symbol cards. Children can respond using whatever method feels most natural.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE] w-fit">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-[#24483D] text-sm">
              Comfortable Pacing
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed">
              No stressful countdown timers or flashing alarms. High-contrast and calm-motion modes keep sensory distractions low.
            </p>
          </div>
        </div>
      </section>

      {/* Reassuring Call-to-Action Banner */}
      <section
        aria-label="Start adventure call to action"
        className={`rounded-3xl p-8 sm:p-12 text-center border-2 ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-gradient-to-br from-[#FFE0CC] via-[#FFFDF7] to-[#E8DEFF] border-[rgba(36,72,61,0.15)] text-[#24483D] shadow-xs'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/80 border border-[#24483D]/10 flex items-center justify-center shadow-xs">
            <BloomiMascot size={38} reducedMotion />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D]">
            Ready to Begin Today&apos;s Adventure?
          </h2>
          <p className="text-sm sm:text-base text-[#3D6355] font-medium leading-relaxed">
            Jump into writing, speaking, visual discovery, or social stories. All you need is your curiosity.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/login/student"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-extrabold text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
            >
              <Smile className="w-5 h-5" aria-hidden="true" />
              <span>Enter Student Hub</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
