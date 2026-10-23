import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { LearningWorld } from '../types'
import { WorldScene } from './worlds/WorldScene'
import { CompanionAvatar } from './worlds/CompanionAvatar'

interface WorldCardProps {
  world: LearningWorld
  reducedMotion: boolean
  highContrast: boolean
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, reducedMotion, highContrast }) => {
  // Companion mappings
  const companionMap: Record<string, { id: string; name: string; title: string }> = {
    writing: { id: 'bear', name: 'Barnaby', title: 'Carnival Ringmaster Bear' },
    speaking: { id: 'bunny', name: 'Pip', title: 'Bakery Chef Bunny' },
    social: { id: 'panda', name: 'Koa', title: 'Wildlife Explorer Panda' },
    visual: { id: 'fox', name: 'Nova', title: 'Cosmic Star Fox' },
  }

  const companion = companionMap[world.id] || { id: 'panda', name: 'Bloom Guide', title: 'Explorer' }

  // Color mappings
  const colorStyles: Record<
    string,
    { badgeBg: string; badgeText: string; borderColor: string; portalGlow: string }
  > = {
    writing: {
      badgeBg: 'bg-[#FFE0CC]',
      badgeText: 'text-[#7A3300]',
      borderColor: 'border-[#F8D2B8]',
      portalGlow: 'hover:shadow-[0_12px_28px_rgba(255,112,67,0.25)]',
    },
    speaking: {
      badgeBg: 'bg-[#E8DEFF]',
      badgeText: 'text-[#4A248A]',
      borderColor: 'border-[#D5C2FE]',
      portalGlow: 'hover:shadow-[0_12px_28px_rgba(126,87,194,0.25)]',
    },
    visual: {
      badgeBg: 'bg-[#CDEFE0]',
      badgeText: 'text-[#16563F]',
      borderColor: 'border-[#B2E6CE]',
      portalGlow: 'hover:shadow-[0_12px_28px_rgba(38,166,154,0.25)]',
    },
    social: {
      badgeBg: 'bg-[#FFF0B3]',
      badgeText: 'text-[#664B00]',
      borderColor: 'border-[#FCE58D]',
      portalGlow: 'hover:shadow-[0_12px_28px_rgba(255,179,0,0.25)]',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  const cardContent = (
    <article
      className={`relative h-full flex flex-col rounded-3xl overflow-hidden transition-all border-2 ${
        highContrast
          ? 'bg-[#15221E] text-[#FFFDF7] border-[#FFF0B3] shadow-md'
          : `bg-[#FFFFFF] ${activeStyle.borderColor} text-[#24483D] shadow-sm ${activeStyle.portalGlow}`
      }`}
    >
      {/* 1. Realistic Illustrated World Scene Banner */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
        <WorldScene worldId={world.id} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-sm ${
              highContrast
                ? 'bg-[#FFF0B3] text-[#24483D]'
                : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{world.badge}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
            50 Adventure Levels
          </span>
        </div>

        {/* Companion Avatar Floating Badge */}
        <div className="absolute -bottom-3 right-4 z-10">
          <CompanionAvatar id={companion.id} size="md" className="ring-3 ring-white shadow-md" />
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 pt-5">
        <div className="mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3D6355]">
            Companion: {companion.name}
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight font-fredoka text-[#24483D] group-hover:text-[#16563F] transition-colors">
            {world.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#3D6355]/90 mt-0.5">
            {world.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#24483D]/90 leading-relaxed mb-4 font-medium line-clamp-2">
          {world.description}
        </p>

        {/* Core Practice Areas Chips */}
        <div className="space-y-1.5 mb-5 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {world.targetSkills.map((skill, index) => (
              <span
                key={index}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold ${
                  highContrast
                    ? 'bg-[#0C1210] text-[#FFF0B3] border border-[#FFF0B3]'
                    : 'bg-[#F2FAF6] text-[#24483D] border border-[rgba(36,72,61,0.12)]'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-3 border-t border-[rgba(36,72,61,0.08)] flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#3D6355]">
            Grade 3 Curriculum
          </span>
          <div className="min-h-[44px] inline-flex items-center gap-1.5 font-black text-sm text-[#24483D] group-hover:translate-x-1 transition-transform">
            <span>Enter Kingdom</span>
            <ArrowRight className="w-4 h-4 text-[#24483D]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <Link
      to={`/worlds/${world.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#24483D]"
      aria-label={`Enter ${world.title} - ${world.subtitle}`}
    >
      {reducedMotion ? (
        <div className="h-full">{cardContent}</div>
      ) : (
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="h-full"
        >
          {cardContent}
        </motion.div>
      )}
    </Link>
  )
}
