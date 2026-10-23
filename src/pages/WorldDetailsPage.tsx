import React from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Play } from 'lucide-react'
import { learningWorldsService } from '../services/learningWorlds.service'
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
    { badgeBg: string; badgeText: string; borderColor: string; heroBg: string }
  > = {
    writing: {
      badgeBg: 'bg-[#FFE0CC]',
      badgeText: 'text-[#7A3300]',
      borderColor: 'border-[#F8D2B8]',
      heroBg: 'bg-[#FFF9F5]',
    },
    speaking: {
      badgeBg: 'bg-[#E8DEFF]',
      badgeText: 'text-[#4A248A]',
      borderColor: 'border-[#D5C2FE]',
      heroBg: 'bg-[#F9F6FF]',
    },
    visual: {
      badgeBg: 'bg-[#CDEFE0]',
      badgeText: 'text-[#16563F]',
      borderColor: 'border-[#B2E6CE]',
      heroBg: 'bg-[#F2FAF6]',
    },
    social: {
      badgeBg: 'bg-[#FFF0B3]',
      badgeText: 'text-[#664B00]',
      borderColor: 'border-[#FCE58D]',
      heroBg: 'bg-[#FFFDF0]',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Accessible Back Link */}
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#24483D] hover:text-[#16563F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D] rounded-xl px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to All Learning Worlds</span>
      </Link>

      <div
        className={`rounded-3xl p-6 sm:p-10 border-2 transition-all ${
          highContrast
            ? 'bg-[#15221E] border-[#FFF0B3] text-[#FFFDF7]'
            : `bg-white ${activeStyle.borderColor} text-[#24483D] shadow-xs`
        }`}
      >
        {/* World Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#24483D]'
                : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
            }`}
          >
            {world.badge}
          </span>
          <span className="text-xs font-bold text-[#3D6355]">
            Grade 3 Universal Curriculum
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#24483D] mb-2">
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
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#3D6355]">
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

        {/* Sample Activities */}
        <div className="mb-8 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#3D6355]">
            Preview Activities
          </h2>
          <div className="space-y-3">
            {world.sampleActivities.map((act, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  highContrast
                    ? 'bg-[#0C1210] border-[#FFF0B3] text-[#FFFDF7]'
                    : `${activeStyle.heroBg} ${activeStyle.borderColor} text-[#24483D]`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                      highContrast
                        ? 'bg-[#FFF0B3] text-[#24483D]'
                        : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-extrabold text-sm sm:text-base">{act}</span>
                </div>
                <button
                  type="button"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[rgba(36,72,61,0.2)] text-xs font-extrabold text-[#24483D] hover:bg-[#F2FAF6] flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#24483D]"
                >
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Preview</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Mapping & Supported Response Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {world.companionName && (
            <div className={`p-4 rounded-2xl border ${highContrast ? 'bg-[#0C1210] border-[#FFF0B3]' : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.12)]'}`}>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-1">
                World Companion
              </h3>
              <p className="text-sm font-bold text-[#24483D]">{world.companionName}</p>
              <p className="text-xs text-[#3D6355] mt-1">Guiding and cheering you on every level with friendly audio cues and demonstrations.</p>
            </div>
          )}

          {world.supportedResponseMethods && (
            <div className={`p-4 rounded-2xl border ${highContrast ? 'bg-[#0C1210] border-[#FFF0B3]' : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.12)]'}`}>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#3D6355] mb-1">
                Supported Response Methods
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {world.supportedResponseMethods.map((method, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg font-bold bg-[#E8DEFF] text-[#4A248A] border border-[#D5C2FE]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Start Adventure Action */}
        <div className="pt-2 flex flex-wrap gap-4 items-center">
          <Link
            to={`/student/map?world=${world.id}`}
            className="min-h-[48px] inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-extrabold text-base bg-[#FFE0CC] hover:bg-[#FFCFB0] text-[#7A3300] border-2 border-[#F8D2B8] shadow-sm transition-all cartoon-btn-3d focus:outline-none focus:ring-4 focus:ring-[#7A3300]"
          >
            <Play className="w-5 h-5 text-[#7A3300]" aria-hidden="true" />
            <span>Enter {world.title} Levels</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
