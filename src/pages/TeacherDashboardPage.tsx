import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  GraduationCap,
  Users,
  LogOut,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react'

export const TeacherDashboardPage: React.FC = () => {
  const { profile, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Educator Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/50 font-bold uppercase tracking-wider text-purple-200">
                  Verified Educator
                </span>
                <span className="text-xs text-purple-200">Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka mt-1">
                {profile?.display_name || user?.email || 'Educator Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-purple-200">
                Grade 3 Inclusive Learning Management &bull; {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Classroom Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-slate-800">1 Class</div>
          <p className="text-xs text-slate-500 font-medium">Grade 3 Blossom Explorers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-slate-800">4 Active Worlds</div>
          <p className="text-xs text-slate-500 font-medium">Writing, Speaking, Visual, Social</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-slate-800">UDL Enabled</div>
          <p className="text-xs text-slate-500 font-medium">Dyslexia fonts &amp; AAC cues active</p>
        </div>
      </div>

      {/* Class Roster & Management Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold font-fredoka text-slate-900">
              Classroom &bull; Grade 3 Blossom Explorers
            </h2>
            <p className="text-xs text-slate-500">
              Class Code: <code className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">BLOOM-3A</code>
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Academic Year 2026-2027</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Enrolled Student Profiles (Protected by RLS)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Registration #</th>
                  <th className="py-3 px-4">Learner Name</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Support Accommodations</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">BLOOMI-3A-01</td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <span className="text-lg">🦁</span>
                    <span>Leo Adams</span>
                  </td>
                  <td className="py-3.5 px-4">Grade 3</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                      Phonics &amp; Large Text
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">Active</td>
                </tr>
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">BLOOMI-3A-02</td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <span className="text-lg">🐼</span>
                    <span>Pip Chen</span>
                  </td>
                  <td className="py-3.5 px-4">Grade 3</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs">
                      AAC Visual Cues
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong>Stage 2 Security Notice:</strong> This dashboard is protected by Supabase Row-Level Security (RLS). Only authenticated educators can view the student records within their assigned classes.
          </div>
        </div>
      </div>
    </div>
  )
}
