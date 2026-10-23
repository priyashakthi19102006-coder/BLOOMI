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
        <h2 className="text-2xl font-bold font-fredoka text-[#24483D]">World Not Found</h2>
        <p className="text-sm text-[#3D6355]">This learning path has not sprouted yet.</p>
        <Link
          to="/"
          className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] font-bold text-sm hover:bg-[#152E26] transition-colors"
        >
          Return to All Learning Worlds
        </Link>
      </div>
    )
  }

  // Active theme based on world
  const colorStyles: Record<
    string,
    { badgeBg: string; badgeText: string; borderColor: string; heroBg: string; companionId: string }
  > = {
    writing: {
      badgeBg: 'bg-[#FFE0CC]',
      badgeText: 'text-[#7A3300]',
      borderColor: 'border-[#F8D2B8]',
      heroBg: 'bg-[#FFF9F5]',
      companionId: 'bear',
    },
    speaking: {
      badgeBg: 'bg-[#E8DEFF]',
      badgeText: 'text-[#4A248A]',
      borderColor: 'border-[#D5C2FE]',
      heroBg: 'bg-[#F9F6FF]',
      companionId: 'bunny',
    },
    visual: {
      badgeBg: 'bg-[#CDEFE0]',
      badgeText: 'text-[#16563F]',
      borderColor: 'border-[#B2E6CE]',
      heroBg: 'bg-[#F2FAF6]',
      companionId: 'fox',
    },
    social: {
      badgeBg: 'bg-[#FFF0B3]',
      badgeText: 'text-[#664B00]',
      borderColor: 'border-[#FCE58D]',
      heroBg: 'bg-[#FFFDF0]',
      companionId: 'panda',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Accessible Back Link */}
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#24483D] hover:text-[#16563F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to All Learning Worlds</span>
      </Link>

      <div
        className={`rounded-3xl overflow-hidden border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : `bg-white ${activeStyle.borderColor} text-[#24483D] shadow-sm`
        }`}
      >
        {/* Full-width Illustrated World Scene Banner */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-slate-900">
          <WorldScene worldId={world.id} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Floating Companion Avatar */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 bg-white/95 backdrop-blur-xs p-2 sm:p-2.5 rounded-2xl shadow-md border border-white">
            <CompanionAvatar id={activeStyle.companionId} size="md" />
            <div className="pr-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3D6355] block">
                Kingdom Companion
              </span>
              <span className="text-xs sm:text-sm font-black text-[#24483D]">
                {world.companionName || 'Adventure Guide'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10">
          {/* World Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                highContrast
                  ? 'bg-[#FFF0B3] text-[#24483D]'
                  : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{world.badge}</span>
            </span>
            <span className="text-xs font-bold text-[#3D6355] px-3 py-1 rounded-full bg-slate-100">
              50 Interactive Levels (5 Tasks Each)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-fredoka text-[#24483D] mb-2">
            {world.title}
          </h1>
          <p className="text-base sm:text-lg font-bold text-[#3D6355] mb-4">
            {world.subtitle}
          </p>
          <p className="text-sm sm:text-base text-[#24483D] leading-relaxed mb-8 font-medium">
            {world.description}
          </p>

          {/* Target Competencies */}
          <div className="mb-8 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#3D6355]">
              Target Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {world.targetSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold ${
                    highContrast
                      ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
                      : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.15)] text-[#24483D]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16563F] shrink-0" aria-hidden="true" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Response Methods */}
          {world.supportedResponseMethods && (
            <div className="mb-8 p-4 rounded-2xl border border-[rgba(36,72,61,0.12)] bg-[#FFFDF7]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3D6355] mb-2">
                Supported Inclusive Response Methods
              </h3>
              <p className="text-xs text-[#3D6355] mb-2.5">
                Learners can respond with whichever method feels most comfortable:
              </p>
              <div className="flex flex-wrap gap-2">
                {world.supportedResponseMethods.map((method, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-xl font-bold bg-[#E8DEFF] text-[#4A248A] border border-[#D5C2FE]"
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
              className="min-h-[50px] inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-base bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border-2 border-[#F8D2B8] shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#7A3300]"
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
