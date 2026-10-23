import React from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Play, Sparkles } from 'lucide-react'
import { learningWorldsService } from '../services/learningWorlds.service'
import { WorldScene } from '../components/worlds/WorldScene'
import { CompanionAvatar } from '../components/worlds/CompanionAvatar'
import type { AccessibilityContextType } from '../layouts/RootLayout'

export const WorldDetailsPage: React.FC = () => {
  const { worldId } = useParams<{ worldId: string }>()
  const { highContrast } = useOutletContext<AccessibilityContextType>()
  const world = learningWorldsService.getWorldById(worldId || '')

  if (!world) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold font-fredoka text-white">World Not Found</h2>
        <p className="text-sm text-purple-200/80">This magical realm has not opened its portal yet.</p>
        <Link
          to="/"
          className="btn-neon-pink min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          Return to Bloom Kingdoms
        </Link>
      </div>
    )
  }

  // Active theme based on world
  const colorStyles: Record<
    string,
    { badgeBg: string; badgeText: string; borderColor: string; glowShadow: string; companionId: string; btnClass: string }
  > = {
    writing: {
      badgeBg: 'bg-[#ff2a85]/20',
      badgeText: 'text-[#ff2a85]',
      borderColor: 'border-[#ff2a85]/50',
      glowShadow: 'shadow-[0_0_35px_rgba(255,42,133,0.25)]',
      companionId: 'bear',
      btnClass: 'btn-neon-pink',
    },
    speaking: {
      badgeBg: 'bg-[#a855f7]/20',
      badgeText: 'text-[#c084fc]',
      borderColor: 'border-[#a855f7]/50',
      glowShadow: 'shadow-[0_0_35px_rgba(168,85,247,0.25)]',
      companionId: 'bunny',
      btnClass: 'btn-neon-purple',
    },
    visual: {
      badgeBg: 'bg-[#00f5ff]/20',
      badgeText: 'text-[#00f5ff]',
      borderColor: 'border-[#00f5ff]/50',
      glowShadow: 'shadow-[0_0_35px_rgba(0,245,255,0.25)]',
      companionId: 'fox',
      btnClass: 'bg-[#00f5ff] text-[#06020e] hover:bg-[#38bdf8] shadow-[0_0_20px_#00f5ff]',
    },
    social: {
      badgeBg: 'bg-[#ffd700]/20',
      badgeText: 'text-[#ffd700]',
      borderColor: 'border-[#ffd700]/50',
      glowShadow: 'shadow-[0_0_35px_rgba(255,215,0,0.25)]',
      companionId: 'panda',
      btnClass: 'bg-[#ffd700] text-[#06020e] hover:bg-[#f59e0b] shadow-[0_0_20px_#ffd700]',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Accessible Back Link */}
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-pink-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2a85] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Bloom Kingdoms</span>
      </Link>

      <div
        className={`rounded-3xl overflow-hidden border-2 transition-all ${
          highContrast
            ? 'bg-black border-pink-400 text-white'
            : `bg-[#0e0520] ${activeStyle.borderColor} ${activeStyle.glowShadow} text-white`
        }`}
      >
        {/* Full-width Illustrated World Scene Banner */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-[#06020e]">
          <WorldScene worldId={world.id} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0520] via-transparent to-transparent pointer-events-none" />

          {/* Floating Companion Avatar with Neon Glow */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 bg-[#160a33]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#ff2a85]/40">
            <CompanionAvatar id={activeStyle.companionId} size="md" />
            <div className="pr-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-300 block">
                Kingdom Companion
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                {world.companionName || 'Adventure Guide'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* World Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-current ${activeStyle.badgeBg} ${activeStyle.badgeText}`}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{world.badge}</span>
              </span>
              <span className="text-xs font-bold text-purple-200 px-3 py-1 rounded-full bg-[#160a33] border border-[#a855f7]/30">
                50 Interactive Levels (5 Tasks Each)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-fredoka text-white mb-2 tracking-wide">
              {world.title}
            </h1>
            <p className="text-base sm:text-lg font-bold text-pink-300 mb-4">
              {world.subtitle}
            </p>
            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-medium">
              {world.description}
            </p>
          </div>

          {/* Target Competencies */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-pink-300">
              Target Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {world.targetSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#a855f7]/30 bg-[#160a33] text-xs sm:text-sm font-bold text-white shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00f5ff] shrink-0" aria-hidden="true" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Response Methods */}
          {world.supportedResponseMethods && (
            <div className="p-5 rounded-2xl border border-[#a855f7]/30 bg-[#160a33] space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#ffd700]">
                Supported Inclusive Response Methods
              </h3>
              <p className="text-xs text-purple-200/80">
                Learners can respond with whichever method feels most comfortable:
              </p>
              <div className="flex flex-wrap gap-2">
                {world.supportedResponseMethods.map((method, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-xl font-bold bg-[#ff2a85]/15 text-pink-200 border border-[#ff2a85]/40"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Start Adventure Action */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              to={`/student/map?world=${world.id}`}
              className={`min-h-[50px] inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-base transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${activeStyle.btnClass}`}
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>Enter {world.title} Adventure Map</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
