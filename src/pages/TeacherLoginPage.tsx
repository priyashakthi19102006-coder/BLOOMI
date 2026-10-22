import React, { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Lock, Mail, Info, CheckCircle2 } from 'lucide-react'

interface LayoutContext {
  highContrast: boolean
}

export const TeacherLoginPage: React.FC = () => {
  const { highContrast } = useOutletContext<LayoutContext>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [demoMessage, setDemoMessage] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoMessage(true)
  }

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
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
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-slate-900">
            Educator &amp; Therapist Portal
          </h1>
          <p className="text-sm text-slate-500">
            Manage classroom profiles, customize accessibility levels, and view analytics.
          </p>
        </div>

        {/* Prototype Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3 text-xs text-purple-900">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Stage 1 Foundation Interface:</span> Teacher authentication and analytics dashboards will connect to Supabase Auth and database tables in Stage 2.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="teacher-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
            >
              School or Specialist Email
            </label>
            <div className="relative">
              <input
                id="teacher-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="educator@school.edu"
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="teacher-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="teacher-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Educator Dashboard</span>
          </button>
        </form>

        {demoMessage && (
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Interface verified. Supabase educator authentication will be hooked up in Stage 2.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
