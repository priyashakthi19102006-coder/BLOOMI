import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, LogOut, ArrowRight, BookOpen, Mic, Eye, HeartHandshake } from 'lucide-react'

export const StudentHubPage: React.FC = () => {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  const avatarMap: Record<string, string> = {
    lion: '🦁',
    panda: '🐼',
    fox: '🦊',
    dolphin: '🐬',
  }

  const avatarEmoji = profile?.avatar_id ? avatarMap[profile.avatar_id] || '🌟' : '🌟'

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Student Greeting Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-3xl p-6 sm:p-10 text-amber-950 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/90 shadow-md flex items-center justify-center text-4xl border-2 border-white">
              {avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/60 font-bold uppercase tracking-wider text-amber-900">
                  Grade 3 Explorer
                </span>
                {profile?.registration_number && (
                  <span className="text-xs font-mono font-bold bg-amber-900/10 px-2 py-0.5 rounded text-amber-950">
                    {profile.registration_number}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-fredoka mt-1">
                Welcome back, {profile?.display_name || 'Explorer'}!
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-900/80">
                Pick a world below to continue your learning adventure!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-amber-950 text-xs sm:text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Finish Adventure &bull; Sign Out</span>
          </button>
        </div>
      </div>

      {/* World Selection Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-fredoka text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Your Learning Worlds</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/worlds/writing"
            className="group p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-amber-600 transition-colors">
                  Writing World
                </h3>
                <p className="text-xs text-slate-500">Letter tracing &amp; word garden</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/worlds/speaking"
            className="group p-5 rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-800">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-sky-600 transition-colors">
                  Speaking World
                </h3>
                <p className="text-xs text-slate-500">Voice balloons &amp; echo rhymes</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/worlds/visual"
            className="group p-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Visual Discovery
                </h3>
                <p className="text-xs text-slate-500">Prism puzzles &amp; symbol matching</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/worlds/social"
            className="group p-5 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-800">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-purple-600 transition-colors">
                  Social Adventure
                </h3>
                <p className="text-xs text-slate-500">Feelings detective &amp; sharing</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
