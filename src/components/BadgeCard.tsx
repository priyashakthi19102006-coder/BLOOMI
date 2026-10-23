import React from 'react'
import {
  Lock,
  Sparkles,
  Trophy,
  BookOpen,
  Mic,
  Eye,
  HeartHandshake,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import type { BadgeDefinition } from '../types/curriculum.types'

interface BadgeCardProps {
  badge: BadgeDefinition
  isUnlocked: boolean
  unlockedAt?: string
  progressCount?: number
  targetCount?: number
  percentage?: number
  highContrast?: boolean
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked,
  unlockedAt,
  progressCount = 0,
  targetCount = 1,
  percentage = 0,
  highContrast = false,
}) => {
  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return <Compass className="w-5 h-5" aria-hidden="true" />
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" aria-hidden="true" />
      case 'Mic':
        return <Mic className="w-5 h-5" aria-hidden="true" />
      case 'Eye':
        return <Eye className="w-5 h-5" aria-hidden="true" />
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" aria-hidden="true" />
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" aria-hidden="true" />
      case 'Trophy':
        return <Trophy className="w-5 h-5" aria-hidden="true" />
      default:
        return <span className="text-xl" aria-hidden="true">🌸</span>
    }
  }

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
        isUnlocked
          ? highContrast
            ? 'bg-black border-[#ffd700] text-white shadow-[0_0_15px_#ffd700]'
            : 'bg-[#160a33] border-[#ffd700]/70 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:border-[#ffd700]'
          : highContrast
          ? 'bg-black border-purple-500/40 text-purple-200 opacity-75'
          : 'bg-[#0e0520] border-[#a855f7]/30 text-purple-200/80 opacity-85 hover:border-[#a855f7]/60'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isUnlocked
                ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/60 shadow-[0_0_10px_#ffd700]'
                : 'bg-[#160a33] text-purple-400 border-[#a855f7]/40'
            }`}
          >
            {getBadgeIcon(badge.iconName)}
          </div>

          {isUnlocked ? (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/50"
            >
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              <span>Unlocked {formattedDate && `(${formattedDate})`}</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ff2a85]/15 text-pink-300 border border-[#ff2a85]/35"
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>In Progress</span>
            </span>
          )}
        </div>

        <div>
          <h4
            className={`font-extrabold text-sm sm:text-base font-fredoka ${
              isUnlocked ? 'text-white' : 'text-purple-100'
            }`}
          >
            {badge.title}
          </h4>
          <p className="text-xs font-medium text-purple-200/80 mt-0.5 leading-relaxed">
            {badge.description}
          </p>
        </div>
      </div>

      {/* Progress meter for locked badges */}
      {!isUnlocked && (
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
            <span>{badge.criteriaDescription}</span>
            <span className="font-mono text-[#00f5ff]">
              {progressCount} / {targetCount}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-[#06020e] overflow-hidden border border-[#a855f7]/30"
            role="progressbar"
            aria-valuenow={progressCount}
            aria-valuemin={0}
            aria-valuemax={targetCount}
            aria-label={`${badge.title} progress`}
          >
            <div
              className="h-full rounded-full transition-all bg-gradient-to-r from-[#ff2a85] to-[#a855f7]"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
