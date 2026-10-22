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
            ? 'bg-[#152E26] border-[#FFF0B3] text-[#FFFDF7] shadow-xs'
            : 'bg-white border-[#B2E6CE] text-[#24483D] shadow-xs hover:border-[#24483D]'
          : highContrast
          ? 'bg-[#0C1210] border-[#3D6355] text-[#D3E5DC] opacity-75'
          : 'bg-[#FFFDF7] border-[rgba(36,72,61,0.12)] text-[#3D6355] opacity-85'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isUnlocked
                ? highContrast
                  ? 'bg-[#FFF0B3] text-[#0C1210] border-[#FFF0B3]'
                  : 'bg-[#CDEFE0] text-[#16563F] border-[#B2E6CE]'
                : highContrast
                ? 'bg-[#152E26] text-[#3D6355] border-[#3D6355]'
                : 'bg-[#F2FAF6] text-[#3D6355] border-[rgba(36,72,61,0.15)]'
            }`}
          >
            {getBadgeIcon(badge.iconName)}
          </div>

          {isUnlocked ? (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                highContrast
                  ? 'bg-[#FFF0B3] text-[#0C1210]'
                  : 'bg-[#CDEFE0] text-[#16563F]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              <span>Unlocked {formattedDate && `(${formattedDate})`}</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                highContrast
                  ? 'bg-[#152E26] text-[#D3E5DC]'
                  : 'bg-[#FFFBE6] text-[#664B00] border border-[#FCE58D]'
              }`}
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>In Progress</span>
            </span>
          )}
        </div>

        <div>
          <h4
            className={`font-extrabold text-sm sm:text-base font-fredoka ${
              isUnlocked ? (highContrast ? 'text-[#FFFDF7]' : 'text-[#24483D]') : ''
            }`}
          >
            {badge.title}
          </h4>
          <p className="text-xs font-medium opacity-90 mt-0.5 leading-relaxed">
            {badge.description}
          </p>
        </div>
      </div>

      {/* Progress meter for locked badges */}
      {!isUnlocked && (
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>{badge.criteriaDescription}</span>
            <span>
              {progressCount} / {targetCount}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-[rgba(36,72,61,0.1)] overflow-hidden"
            role="progressbar"
            aria-valuenow={progressCount}
            aria-valuemin={0}
            aria-valuemax={targetCount}
            aria-label={`${badge.title} progress`}
          >
            <div
              className={`h-full rounded-full transition-all ${
                highContrast ? 'bg-[#FFF0B3]' : 'bg-[#16563F]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
