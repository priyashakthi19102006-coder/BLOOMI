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
      <div className="bg-[#FFFFFF] border-2 border-[#F8D2B8] rounded-3xl p-6 sm:p-10 text-[#24483D] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-[#FFF5EE] shadow-xs flex items-center justify-center text-4xl border-2 border-[#F8D2B8]">
              {avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFE0CC] text-[#7A3300] font-bold uppercase tracking-wider">
                  Grade 3 Explorer
                </span>
                {profile?.registration_number && (
                  <span className="text-xs font-mono font-bold bg-[#F2FAF6] border border-[#B2E6CE] px-2 py-0.5 rounded text-[#16563F]">
                    {profile.registration_number}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-fredoka text-[#24483D] mt-1">
                Welcome back, {profile?.display_name || 'Explorer'}!
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#3D6355]">
                Pick a learning world below to continue your journey!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFDF7] hover:bg-[#F2FAF6] border border-[rgba(36,72,61,0.2)] text-[#24483D] text-xs sm:text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Finish Adventure &bull; Sign Out</span>
          </button>
        </div>
      </div>

      {/* World Selection Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#24483D] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8A6400]" aria-hidden="true" />
          <span>Your Four Learning Worlds</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/worlds/writing"
            className="group min-h-[96px] p-5 rounded-2xl bg-white border-2 border-[#F8D2B8] hover:border-[#24483D] shadow-xs hover:shadow-md transition-all flex items-center justify-between focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#FFF5EE] text-[#7A3300] border border-[#F8D2B8]">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#24483D] group-hover:underline">
                  Writing World
                </h3>
                <p className="text-xs text-[#3D6355] font-medium">Letter tracing, spelling &amp; word garden</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#7A3300] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            to="/worlds/speaking"
            className="group min-h-[96px] p-5 rounded-2xl bg-white border-2 border-[#D5C2FE] hover:border-[#24483D] shadow-xs hover:shadow-md transition-all flex items-center justify-between focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE]">
                <Mic className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#24483D] group-hover:underline">
                  Speaking World
                </h3>
                <p className="text-xs text-[#3D6355] font-medium">Listening games, sound clues &amp; echo rhymes</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#4A248A] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            to="/worlds/visual"
            className="group min-h-[96px] p-5 rounded-2xl bg-white border-2 border-[#B2E6CE] hover:border-[#24483D] shadow-xs hover:shadow-md transition-all flex items-center justify-between focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE]">
                <Eye className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#24483D] group-hover:underline">
                  Visual Discovery
                </h3>
                <p className="text-xs text-[#3D6355] font-medium">Matching, sequences &amp; prism puzzles</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#16563F] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            to="/worlds/social"
            className="group min-h-[96px] p-5 rounded-2xl bg-white border-2 border-[#FCE58D] hover:border-[#24483D] shadow-xs hover:shadow-md transition-all flex items-center justify-between focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D]">
                <HeartHandshake className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#24483D] group-hover:underline">
                  Social Adventure
                </h3>
                <p className="text-xs text-[#3D6355] font-medium">Feelings detective &amp; everyday cooperation</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#664B00] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
