import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenTool, Mic, Eye, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react'
import type { LearningWorld } from '../types'

interface WorldCardProps {
  world: LearningWorld
  reducedMotion: boolean
  highContrast: boolean
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, reducedMotion, highContrast }) => {
  const getIcon = () => {
    const iconProps = { className: 'w-7 h-7 sm:w-8 sm:h-8', 'aria-hidden': true }
    switch (world.iconName) {
      case 'PenTool':
        return <PenTool {...iconProps} />
      case 'Mic':
        return <Mic {...iconProps} />
      case 'Eye':
        return <Eye {...iconProps} />
      case 'HeartHandshake':
        return <HeartHandshake {...iconProps} />
      default:
        return <Sparkles {...iconProps} />
    }
  }

  // Color mappings for accessible contrast
  const colorStyles: Record<
    string,
    { iconBg: string; iconColor: string; badgeBg: string; badgeText: string; borderColor: string }
  > = {
    writing: {
      iconBg: 'bg-[#FFE0CC]',
      iconColor: 'text-[#7A3300]',
      badgeBg: 'bg-[#FFE0CC]',
      badgeText: 'text-[#7A3300]',
      borderColor: 'border-[#F8D2B8]',
    },
    speaking: {
      iconBg: 'bg-[#E8DEFF]',
      iconColor: 'text-[#4A248A]',
      badgeBg: 'bg-[#E8DEFF]',
      badgeText: 'text-[#4A248A]',
      borderColor: 'border-[#D5C2FE]',
    },
    visual: {
      iconBg: 'bg-[#CDEFE0]',
      iconColor: 'text-[#16563F]',
      badgeBg: 'bg-[#CDEFE0]',
      badgeText: 'text-[#16563F]',
      borderColor: 'border-[#B2E6CE]',
    },
    social: {
      iconBg: 'bg-[#FFF0B3]',
      iconColor: 'text-[#664B00]',
      badgeBg: 'bg-[#FFF0B3]',
      badgeText: 'text-[#664B00]',
      borderColor: 'border-[#FCE58D]',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  const cardContent = (
    <article
      className={`relative h-full flex flex-col rounded-3xl p-6 sm:p-7 transition-all border-2 ${
        highContrast
          ? 'bg-[#15221E] text-[#FFFDF7] border-[#FFF0B3] shadow-md'
          : `bg-[#FFFFFF] ${activeStyle.borderColor} text-[#24483D] shadow-xs hover:shadow-md`
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
            highContrast
              ? 'bg-[#FFF0B3] text-[#24483D]'
              : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
          }`}
        >
          {world.badge}
        </span>
        <span
          className={`text-xs font-bold ${
            highContrast ? 'text-[#D3E5DC]' : 'text-[#3D6355]'
          }`}
        >
          Grade 3 Focus
        </span>
      </div>

      {/* World Icon & Title */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`p-3.5 rounded-2xl border ${activeStyle.borderColor} ${activeStyle.iconBg} ${activeStyle.iconColor} shrink-0`}
        >
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-fredoka text-[#24483D] group-hover:underline">
            {world.title}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[#3D6355]">
            {world.subtitle}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-[#24483D] leading-relaxed mb-6 font-medium">
        {world.description}
      </p>

      {/* Target Skills Tags */}
      <div className="space-y-2 mb-6">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#3D6355]">
          Core Practice Areas
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {world.targetSkills.map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                highContrast
                  ? 'bg-[#0C1210] text-[#FFF0B3] border border-[#FFF0B3]'
                  : 'bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.1)]'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-auto pt-4 border-t border-[rgba(36,72,61,0.08)] flex items-center justify-between">
        <span className="text-xs font-bold text-[#3D6355]">
          Explore &amp; Play
        </span>
        <div className="min-h-[44px] inline-flex items-center gap-1.5 font-extrabold text-sm text-[#24483D] group-hover:translate-x-1 transition-transform">
          <span>Enter World</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </article>
  )

  return (
    <Link
      to={`/worlds/${world.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus:ring-3 focus:ring-[#24483D]"
      aria-label={`Enter ${world.title} - ${world.subtitle}`}
    >
      {reducedMotion ? (
        <div className="h-full">{cardContent}</div>
      ) : (
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="h-full"
        >
          {cardContent}
        </motion.div>
      )}
    </Link>
  )
}
