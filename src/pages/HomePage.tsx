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
  Play,
} from 'lucide-react'
import { AccessibilityBar } from '../components/AccessibilityBar'
import { WorldCard } from '../components/WorldCard'
import { BloomiKingdomPanorama } from '../components/worlds/BloomiKingdomPanorama'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
import { learningWorldsService } from '../services/learningWorlds.service'
import { useAuth } from '../contexts/AuthContext'
import { progressionService } from '../services/progression.service'
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

  const { user, profile } = useAuth()
  const activeStudentId = user?.id || (profile?.id && profile.id !== 'demo_student' ? profile.id : 'demo_student')
  const rewards = progressionService.getRewardSummary(activeStudentId)

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

      {/* Hero Section with Bloomi Kingdom Panorama */}
      <section
        aria-labelledby="hero-title"
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-[#FFFFFF] border-[rgba(36,72,61,0.12)] text-[#24483D] shadow-xs'
        }`}
      >
        <div className="space-y-8 relative z-10">
          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CDEFE0] text-[#16563F] border border-[#B2E6CE] text-xs sm:text-sm font-black">
              <Sparkles className="w-4 h-4 text-[#16563F]" aria-hidden="true" />
              <span>Inclusive Grade 3 Cartoon Learning Adventure</span>
            </div>

            {/* Quick Companion Badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#3D6355] hidden sm:inline">Your Guides:</span>
              <div className="flex -space-x-2">
                <CompanionAvatar id="bear" size="sm" className="ring-2 ring-white" />
                <CompanionAvatar id="bunny" size="sm" className="ring-2 ring-white" />
                <CompanionAvatar id="panda" size="sm" className="ring-2 ring-white" />
                <CompanionAvatar id="fox" size="sm" className="ring-2 ring-white" />
              </div>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="max-w-3xl space-y-4">
            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-fredoka leading-tight"
            >
              Every Little Step Helps You Bloom.
            </h1>

            <p className="text-base sm:text-xl leading-relaxed text-[#3D6355] font-semibold">
              Step into the four magical cartoon worlds of <strong className="text-[#24483D] font-black">BLOOMI</strong>! Explore writing, speaking, visual puzzles, and social understanding at your own calm pace with friendly companions by your side.
            </p>
          </div>

          {/* Panoramic Kingdom Artwork Card */}
          <div className="w-full rounded-2xl overflow-hidden shadow-md border-2 border-[rgba(36,72,61,0.15)] bg-slate-900">
            <BloomiKingdomPanorama className="w-full h-auto object-cover" />
          </div>

          {/* Primary Action Buttons & Continue Adventure Card */}
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/login/student"
                className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border-2 border-[#F8D2B8] shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#7A3300]"
              >
                <Smile className="w-5 h-5 text-[#7A3300]" aria-hidden="true" />
                <span>Start Your Adventure</span>
                <ArrowRight className="w-5 h-5 text-[#7A3300]" aria-hidden="true" />
              </Link>

              <Link
                to="/hub"
                className="min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-[#CDEFE0] hover:bg-[#B2E6CE] text-[#16563F] border-2 border-[#B2E6CE] transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#16563F]"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Continue Adventure</span>
              </Link>

              <Link
                to="/login/teacher"
                className="min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-[#FFFDF7] hover:bg-[#F7F4FF] text-[#4A248A] border-2 border-[#D5C2FE] transition-colors focus:outline-none focus:ring-4 focus:ring-[#4A248A]"
              >
                <GraduationCap className="w-5 h-5 text-[#4A248A]" aria-hidden="true" />
                <span>Educator Portal</span>
              </Link>
            </div>

            {/* Quick Live Progress Pill */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[rgba(36,72,61,0.12)]">
              <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                <Trophy className="w-4 h-4 fill-current text-amber-500" />
                <span>{rewards.totalStars} Bloom Stars</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-bold text-[#3D6355]">
                {rewards.totalCompletedLevels} Levels Won
              </span>
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
              className="text-2xl sm:text-4xl font-black tracking-tight font-fredoka text-[#24483D]"
            >
              Explore Your Four Magical Worlds
            </h2>
            <p className="text-sm sm:text-base text-[#3D6355] font-semibold mt-1">
              Each world is an illustrated cartoon realm with 50 levels of self-paced tasks, supportive hints, and joyful milestones.
            </p>
          </div>
          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#E8DEFF] text-[#4A248A] border border-[#D5C2FE] self-start sm:self-auto">
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
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#3D6355]">
            <Sparkles className="w-4 h-4 text-[#8A6400]" aria-hidden="true" />
            <span>Inclusive Learning Experience</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl font-black font-fredoka text-[#24483D]"
          >
            Three Easy Steps to Bloom
          </h2>
          <p className="text-sm text-[#3D6355] font-semibold">
            Learning is an adventure, never a test. Here is how learners explore each day.
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
              <span className="w-9 h-9 rounded-2xl bg-[#CDEFE0] text-[#16563F] font-black text-sm flex items-center justify-center">
                1
              </span>
              <Compass className="w-6 h-6 text-[#16563F]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-[#24483D]">
              1. Choose a Kingdom
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-semibold">
              Enter the Amusement Park, Candy Kingdom, Enchanted Forest, or Cosmic Galaxy with your friendly animal companion guide.
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
              <span className="w-9 h-9 rounded-2xl bg-[#E8DEFF] text-[#4A248A] font-black text-sm flex items-center justify-center">
                2
              </span>
              <Sparkles className="w-6 h-6 text-[#4A248A]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-[#24483D]">
              2. Play &amp; Discover
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-semibold">
              Complete cheerful challenges with read-aloud buttons, visual demonstration cards, and multiple valid ways to answer.
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
              <span className="w-9 h-9 rounded-2xl bg-[#FFF0B3] text-[#664B00] font-black text-sm flex items-center justify-center">
                3
              </span>
              <Trophy className="w-6 h-6 text-[#664B00]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-[#24483D]">
              3. Collect Stars &amp; Badges
            </h3>
            <p className="text-xs sm:text-sm text-[#3D6355] leading-relaxed font-semibold">
              Earn 1 to 3 Bloom Stars for every level completed. Replay anytime without losing stars, and unlock celebration badges!
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#B2E6CE] text-xs font-black text-[#16563F]">
            <Heart className="w-3.5 h-3.5 text-[#16563F]" aria-hidden="true" />
            <span>Child-First Accessibility</span>
          </div>

          <h2
            id="inclusive-title"
            className="text-2xl sm:text-3xl font-black font-fredoka text-[#24483D]"
          >
            Learning That Fits Every Child
          </h2>

          <p className="text-sm sm:text-base text-[#3D6355] leading-relaxed font-semibold">
            Children learn best when they feel confident, supported, and unhurried. BLOOMI is designed to adapt to your child, never the other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#FFF5EE] text-[#7A3300] border border-[#F8D2B8] w-fit">
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-[#24483D] text-sm">
              Unlimited Gentle Retries
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed font-semibold">
              There are no penalties for exploring alternative answers. Making mistakes is simply how our brains grow.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D] w-fit">
              <Lightbulb className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-[#24483D] text-sm">
              Visual &amp; Audio Clues
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed font-semibold">
              Stuck on a tricky word or puzzle? Friendly visual demonstration cards and read-aloud buttons are always one tap away.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE] w-fit">
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-[#24483D] text-sm">
              Multi-Modal Interaction
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed font-semibold">
              Listen, tap, drag, or type. Children can respond using whichever communication method feels most natural and comfortable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(36,72,61,0.12)] space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE] w-fit">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-[#24483D] text-sm">
              Calm, Sensory-Safe Pacing
            </h3>
            <p className="text-xs text-[#3D6355] leading-relaxed font-semibold">
              Zero flashing strobe effects or loud buzzer alarms. Soft high-contrast and reduced-motion controls maintain comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Start Adventure Call to Action */}
      <section
        aria-label="Start adventure call to action"
        className={`rounded-3xl p-8 sm:p-12 text-center border-2 ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : 'bg-gradient-to-br from-[#FFE0CC] via-[#FFFDF7] to-[#E8DEFF] border-[rgba(36,72,61,0.15)] text-[#24483D] shadow-xs'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center -space-x-3 mb-2">
            <CompanionAvatar id="bear" size="md" className="ring-2 ring-white" />
            <CompanionAvatar id="bunny" size="md" className="ring-2 ring-white" />
            <CompanionAvatar id="panda" size="md" className="ring-2 ring-white" />
            <CompanionAvatar id="fox" size="md" className="ring-2 ring-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-fredoka text-[#24483D]">
            Ready to Begin Today&apos;s Adventure?
          </h2>
          <p className="text-sm sm:text-base text-[#3D6355] font-semibold leading-relaxed">
            Jump into writing, speaking, visual discovery, or social stories. All you need is your curiosity.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/login/student"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-base bg-[#24483D] text-[#FFFDF7] hover:bg-[#152E26] shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
            >
              <Smile className="w-5 h-5 text-amber-300" aria-hidden="true" />
              <span>Enter Student Adventure Hub</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
