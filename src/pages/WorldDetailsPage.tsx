import React from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Play, Sparkles } from 'lucide-react'
import { learningWorldsService } from '../services/learningWorlds.service'

interface LayoutContext {
  highContrast: boolean
}

export const WorldDetailsPage: React.FC = () => {
  const { worldId } = useParams<{ worldId: string }>()
  const { highContrast } = useOutletContext<LayoutContext>()
  const world = learningWorldsService.getWorldById(worldId || '')

  if (!world) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold">World not found</h2>
        <Link to="/" className="text-purple-600 font-semibold underline">
          Return to All Learning Worlds
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Learning Worlds</span>
      </Link>

      <div
        className={`rounded-3xl p-6 sm:p-10 border transition-all ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-purple-100 shadow-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {world.badge}
          </span>
          <span className="text-xs font-medium text-slate-500">Grade 3 Universal Curriculum</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-slate-900 mb-2">
          {world.title}
        </h1>
        <p className="text-lg font-medium text-purple-600 mb-4">{world.subtitle}</p>
        <p className="text-base text-slate-600 leading-relaxed mb-8">{world.description}</p>

        {/* Target Skills */}
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Target Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {world.targetSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Activities */}
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Preview Activities (Stage 1 Prototype)
          </h2>
          <div className="space-y-2.5">
            {world.sampleActivities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{act}</span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-100 flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Next step hint */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Activity engines and interactive games for {world.title} will be created in future project stages.
          </span>
        </div>
      </div>
    </div>
  )
}
