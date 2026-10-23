import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Smile,
  Compass,
  Trophy,
  RefreshCw,
  Lightbulb,
  Volume2,
  Heart,
  Play,
  GraduationCap,
} from 'lucide-react'
import { learningWorldsService } from '../services/learningWorlds.service'
import { progressionService } from '../services/progression.service'
import { WorldCard } from '../components/WorldCard'
import { AccessibilityBar } from '../components/AccessibilityBar'
import { BloomiKingdomPanorama } from '../components/worlds/BloomiKingdomPanorama'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
import { useAuth } from '../contexts/AuthContext'
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
    <div className="space-y-12 sm:space-y-16">
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
            ? 'bg-black border-[#00f5ff] text-white shadow-[0_0_25px_rgba(0,245,255,0.4)]'
            : 'bg-[#0e0520] border-[#ff2a85]/35 text-[#fdf4ff] shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,42,133,0.15)]'
        }`}
      >
        <div className="space-y-8 relative z-10">
          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff2a85]/15 text-[#ff70a6] border border-[#ff2a85]/40 text-xs sm:text-sm font-black shadow-[0_0_12px_rgba(255,42,133,0.3)]">
              <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span>Inclusive Grade 3 Cyber-Magical Learning Adventure</span>
            </div>

            {/* Quick Companion Badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#d8b4fe] hidden sm:inline">Your Guides:</span>
              <div className="flex -space-x-2">
                <CompanionAvatar id="bear" size="sm" className="ring-2 ring-[#0e0520]" />
                <CompanionAvatar id="bunny" size="sm" className="ring-2 ring-[#0e0520]" />
                <CompanionAvatar id="panda" size="sm" className="ring-2 ring-[#0e0520]" />
                <CompanionAvatar id="fox" size="sm" className="ring-2 ring-[#0e0520]" />
              </div>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="max-w-3xl space-y-4">
            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-fredoka leading-tight neon-text-pink"
            >
              Every Little Step Helps You Bloom.
            </h1>

            <p className="text-base sm:text-xl leading-relaxed text-[#d8b4fe] font-semibold">
              Step into the four magical cartoon worlds of <strong className="text-white font-black neon-text-purple">BLOOMI</strong>! Explore writing, speaking, visual discovery, and social understanding at your own calm pace with glowing companions by your side.
            </p>
          </div>

          {/* Panoramic Kingdom Artwork Card */}
          <div className="w-full rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(255,42,133,0.3)] border-2 border-[#ff2a85]/40 bg-[#060111]">
            <BloomiKingdomPanorama className="w-full h-auto object-cover" />
          </div>

          {/* Primary Action Buttons & Continue Adventure Card */}
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/login/student"
                className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg btn-neon-pink focus:outline-none focus:ring-4 focus:ring-[#ff2a85]"
              >
                <Smile className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                <span>Start Your Adventure</span>
                <ArrowRight className="w-5 h-5 text-white" aria-hidden="true" />
              </Link>

              <Link
                to="/student/hub"
                className="min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base btn-neon-purple focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Continue Adventure</span>
              </Link>

              <Link
                to="/login/teacher"
                className="min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-[#160a33] hover:bg-[#230f4f] text-[#c084fc] border-2 border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all focus:outline-none focus:ring-4 focus:ring-[#a855f7]"
              >
                <GraduationCap className="w-5 h-5 text-[#00f5ff]" aria-hidden="true" />
                <span>Educator Portal</span>
              </Link>
            </div>

            {/* Quick Live Progress Pill */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#160a33] border border-[#ff2a85]/30 shadow-[0_0_15px_rgba(255,42,133,0.2)]">
              <div className="flex items-center gap-1.5 text-[#ffd700] font-black text-sm">
                <Trophy className="w-4 h-4 fill-current text-[#ffd700] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]" />
                <span>{rewards.totalStars} Bloom Stars</span>
              </div>
              <span className="text-[#a855f7]/40">|</span>
              <span className="text-xs font-bold text-[#d8b4fe]">
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
              className="text-2xl sm:text-4xl font-black tracking-tight font-fredoka neon-text-pink"
            >
              Explore Your Four Magical Worlds
            </h2>
            <p className="text-sm sm:text-base text-[#d8b4fe] font-semibold mt-1">
              Each world is an illustrated cartoon realm with 50 levels of self-paced tasks, supportive hints, and joyful milestones.
            </p>
          </div>
          <span className="text-xs font-black px-4 py-1.5 rounded-full bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/50 shadow-[0_0_12px_rgba(168,85,247,0.3)] self-start sm:self-auto">
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
            ? 'bg-black border-[#00f5ff] text-white shadow-[0_0_20px_rgba(0,245,255,0.3)]'
            : 'bg-[#0e0520] border-[#a855f7]/30 text-[#fdf4ff] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ff70a6]">
            <Sparkles className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <span>Inclusive Learning Experience</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl font-black font-fredoka neon-text-purple"
          >
            Three Easy Steps to Bloom
          </h2>
          <p className="text-sm text-[#d8b4fe] font-semibold">
            Learning is an adventure, never a test. Here is how learners explore each day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Step 1: Explore */}
          <div className="p-6 rounded-3xl border-2 border-[#ff2a85]/40 bg-[#160a33] space-y-3 shadow-[0_0_20px_rgba(255,42,133,0.15)]">
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-2xl bg-[#ff2a85] text-white font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,42,133,0.8)]">
                1
              </span>
              <Compass className="w-6 h-6 text-[#ff2a85]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-white">
              1. Choose a Kingdom
            </h3>
            <p className="text-xs sm:text-sm text-[#d8b4fe] leading-relaxed font-semibold">
              Enter the Amusement Park, Candy Kingdom, Enchanted Forest, or Cosmic Galaxy with your friendly companion guide.
            </p>
          </div>

          {/* Step 2: Practise */}
          <div className="p-6 rounded-3xl border-2 border-[#a855f7]/40 bg-[#160a33] space-y-3 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-2xl bg-[#a855f7] text-white font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                2
              </span>
              <Sparkles className="w-6 h-6 text-[#a855f7]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-white">
              2. Play &amp; Discover
            </h3>
            <p className="text-xs sm:text-sm text-[#d8b4fe] leading-relaxed font-semibold">
              Complete cheerful challenges with read-aloud buttons, visual demonstration cards, and multiple valid ways to answer.
            </p>
          </div>

          {/* Step 3: Celebrate Progress */}
          <div className="p-6 rounded-3xl border-2 border-[#00f5ff]/40 bg-[#160a33] space-y-3 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-2xl bg-[#00f5ff] text-black font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(0,245,255,0.8)]">
                3
              </span>
              <Trophy className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black font-fredoka text-white">
              3. Collect Stars &amp; Badges
            </h3>
            <p className="text-xs sm:text-sm text-[#d8b4fe] leading-relaxed font-semibold">
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
            ? 'bg-black border-[#00f5ff] text-white shadow-[0_0_20px_rgba(0,245,255,0.3)]'
            : 'bg-[#0e0520] border-[#ff2a85]/30 text-[#fdf4ff] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2a85]/20 border border-[#ff2a85]/40 text-xs font-black text-[#ff70a6]">
            <Heart className="w-3.5 h-3.5 text-[#ff2a85]" aria-hidden="true" />
            <span>Child-First Accessibility</span>
          </div>

          <h2
            id="inclusive-title"
            className="text-2xl sm:text-3xl font-black font-fredoka neon-text-pink"
          >
            Learning That Fits Every Child
          </h2>

          <p className="text-sm sm:text-base text-[#d8b4fe] leading-relaxed font-semibold">
            Children learn best when they feel confident, supported, and unhurried. BLOOMI is designed to adapt to your child, never the other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#160a33] border border-[#ff2a85]/30 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/40 w-fit">
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-white text-sm">
              Unlimited Gentle Retries
            </h3>
            <p className="text-xs text-[#d8b4fe] leading-relaxed font-semibold">
              There are no penalties for exploring alternative answers. Making mistakes is simply how our brains grow.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#160a33] border border-[#a855f7]/30 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40 w-fit">
              <Lightbulb className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-white text-sm">
              Visual &amp; Audio Clues
            </h3>
            <p className="text-xs text-[#d8b4fe] leading-relaxed font-semibold">
              Stuck on a tricky word or puzzle? Friendly visual demonstration cards and read-aloud buttons are always one tap away.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#160a33] border border-[#00f5ff]/30 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40 w-fit">
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-white text-sm">
              Multi-Modal Interaction
            </h3>
            <p className="text-xs text-[#d8b4fe] leading-relaxed font-semibold">
              Listen, tap, drag, or type. Children can respond using whichever communication method feels most natural and comfortable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#160a33] border border-[#ffd700]/30 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 w-fit">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-black text-white text-sm">
              Calm, Sensory-Safe Pacing
            </h3>
            <p className="text-xs text-[#d8b4fe] leading-relaxed font-semibold">
              Zero flashing strobe effects or loud buzzer alarms. Soft high-contrast and reduced-motion controls maintain comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Start Adventure Call to Action */}
      <section
        aria-label="Start adventure call to action"
        className="rounded-3xl p-8 sm:p-12 text-center border-2 border-[#ff2a85]/40 bg-gradient-to-br from-[#1b0533] via-[#0e0520] to-[#12042b] shadow-[0_0_35px_rgba(255,42,133,0.25)] text-[#fdf4ff]"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center -space-x-3 mb-2">
            <CompanionAvatar id="bear" size="md" className="ring-2 ring-[#ff2a85]" />
            <CompanionAvatar id="bunny" size="md" className="ring-2 ring-[#ff2a85]" />
            <CompanionAvatar id="panda" size="md" className="ring-2 ring-[#ff2a85]" />
            <CompanionAvatar id="fox" size="md" className="ring-2 ring-[#ff2a85]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-fredoka neon-text-pink">
            Ready to Begin Today&apos;s Adventure?
          </h2>
          <p className="text-sm sm:text-base text-[#d8b4fe] font-semibold leading-relaxed">
            Jump into writing, speaking, visual discovery, or social stories. All you need is your curiosity.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/login/student"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-base btn-neon-pink focus:outline-none focus:ring-4 focus:ring-[#ff2a85]"
            >
              <Smile className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <span>Enter Student Adventure Hub</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
