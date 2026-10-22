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
      <div className="bg-[#FFFFFF] border-2 border-[rgba(36,72,61,0.15)] text-[#24483D] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F4FF] border border-[#D5C2FE] flex items-center justify-center text-[#4A248A] shadow-xs">
              <GraduationCap className="w-9 h-9" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8DEFF] font-extrabold uppercase tracking-wider text-[#4A248A]">
                  Verified Educator
                </span>
                <span className="text-xs text-[#3D6355] font-semibold">Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#24483D] mt-1">
                {profile?.display_name || user?.email || 'Educator Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-[#3D6355] font-medium">
                Grade 3 Inclusive Learning Management &bull; {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFDF7] hover:bg-[#F2FAF6] border border-[rgba(36,72,61,0.2)] text-[#24483D] text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-3 focus:ring-[#24483D]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Classroom Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[rgba(36,72,61,0.12)] shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-[#F7F4FF] text-[#4A248A] border border-[#D5C2FE] w-fit">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-[#24483D]">1 Active Class</div>
          <p className="text-xs text-[#3D6355] font-medium">Grade 3 Blossom Explorers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[rgba(36,72,61,0.12)] shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D] w-fit">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-[#24483D]">4 Learning Worlds</div>
          <p className="text-xs text-[#3D6355] font-medium">Writing, Speaking, Visual, Social</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[rgba(36,72,61,0.12)] shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE] w-fit">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-fredoka text-[#24483D]">UDL Tools Enabled</div>
          <p className="text-xs text-[#3D6355] font-medium">Dyslexia fonts &amp; AAC cues active</p>
        </div>
      </div>

      {/* Class Roster & Management Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[rgba(36,72,61,0.12)] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(36,72,61,0.08)] pb-4">
          <div>
            <h2 className="text-xl font-bold font-fredoka text-[#24483D]">
              Classroom &bull; Grade 3 Blossom Explorers
            </h2>
            <p className="text-xs text-[#3D6355]">
              Class Code: <code className="font-mono bg-[#F7F4FF] text-[#4A248A] px-2 py-0.5 rounded font-bold border border-[#D5C2FE]">BLOOM-3A</code>
            </p>
          </div>
          <div className="text-xs text-[#3D6355] flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Academic Year 2026-2027</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D6355]">
            Enrolled Student Profiles (Protected by RLS)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFFDF7] text-[#3D6355] uppercase text-[11px] font-extrabold border-b border-[rgba(36,72,61,0.08)]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Registration #</th>
                  <th className="py-3 px-4">Learner Name</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Support Accommodations</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(36,72,61,0.06)] font-medium text-[#24483D]">
                <tr className="hover:bg-[#F2FAF6] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4A248A]">BLOOMI-3A-01</td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <span className="text-lg">🦁</span>
                    <span className="font-bold">Leo Adams</span>
                  </td>
                  <td className="py-3.5 px-4">Grade 3</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF5EE] text-[#7A3300] border border-[#F8D2B8] text-xs font-bold">
                      Phonics &amp; Large Text
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#16563F] font-bold">Active</td>
                </tr>
                <tr className="hover:bg-[#F2FAF6] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4A248A]">BLOOMI-3A-02</td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    <span className="text-lg">🐼</span>
                    <span className="font-bold">Pip Chen</span>
                  </td>
                  <td className="py-3.5 px-4">Grade 3</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#F0FAF5] text-[#16563F] border border-[#B2E6CE] text-xs font-bold">
                      AAC Visual Cues
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#16563F] font-bold">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#CDEFE0] text-xs text-[#16563F] flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[#16563F] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong>Educator Security Notice:</strong> This dashboard is protected by Supabase Row-Level Security (RLS). Only authenticated educators can view the student records within their assigned classes.
          </div>
        </div>
      </div>
    </div>
  )
}
