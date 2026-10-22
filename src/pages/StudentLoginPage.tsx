import React, { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Sparkles, User, Info, CheckCircle2 } from 'lucide-react'

interface LayoutContext {
  highContrast: boolean
}

export const StudentLoginPage: React.FC = () => {
  const { highContrast } = useOutletContext<LayoutContext>()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [studentCode, setStudentCode] = useState('')
  const [demoMessage, setDemoMessage] = useState(false)

  const avatars = [
    { id: 'lion', emoji: '🦁', name: 'Leo the Lion' },
    { id: 'panda', emoji: '🐼', name: 'Pip the Panda' },
    { id: 'fox', emoji: '🦊', name: 'Felix the Fox' },
    { id: 'dolphin', emoji: '🐬', name: 'Dara the Dolphin' },
  ]

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoMessage(true)
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Worlds</span>
      </Link>

      <div
        className={`rounded-3xl p-6 sm:p-10 border transition-all ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-purple-100 shadow-md'
        }`}
      >
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shadow-xs">
            🎒
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-slate-900">
            Student Adventure Hub
          </h1>
          <p className="text-sm text-slate-500">
            Pick your adventure avatar and enter your classroom code to play!
          </p>
        </div>

        {/* Prototype Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Stage 1 Foundation Interface:</span> This is a frontend layout entry point. Full student authentication, picture-passcodes, and personalized learner profiles will be connected to Supabase in Stage 2.
          </div>
        </div>

        <form onSubmit={handleSimulate} className="space-y-6">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Choose Your Adventure Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    selectedAvatar === av.id
                      ? 'border-purple-600 bg-purple-50 scale-105'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="text-3xl" role="img" aria-label={av.name}>
                    {av.emoji}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Simple Classroom Passcode */}
          <div>
            <label
              htmlFor="student-code"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
            >
              2. Classroom Passcode / Name
            </label>
            <div className="relative">
              <input
                id="student-code"
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="e.g. STAR-3B"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <User className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-extrabold text-base sm:text-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-amber-950 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Enter the Adventure</span>
          </button>
        </form>

        {demoMessage && (
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Interface ready! Supabase authentication backend will activate in Stage 2.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
