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

  // Color styles mapped to Cyber-Neon aesthetic
  const colorStyles: Record<
    string,
    { badgeBg: string; badgeText: string; borderColor: string; portalGlow: string }
  > = {
    writing: {
      badgeBg: 'bg-[#ff2a85]/20',
      badgeText: 'text-[#ff70a6]',
      borderColor: 'border-[#ff2a85]/40',
      portalGlow: 'hover:shadow-[0_0_30px_rgba(255,42,133,0.4)] hover:border-[#ff2a85]',
    },
    speaking: {
      badgeBg: 'bg-[#ff007f]/20',
      badgeText: 'text-[#f472b6]',
      borderColor: 'border-[#ff007f]/40',
      portalGlow: 'hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] hover:border-[#ff007f]',
    },
    visual: {
      badgeBg: 'bg-[#00f5ff]/20',
      badgeText: 'text-[#00f5ff]',
      borderColor: 'border-[#00f5ff]/40',
      portalGlow: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:border-[#00f5ff]',
    },
    social: {
      badgeBg: 'bg-[#a855f7]/20',
      badgeText: 'text-[#c084fc]',
      borderColor: 'border-[#a855f7]/40',
      portalGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-[#a855f7]',
    },
  }

  const activeStyle = colorStyles[world.id] || colorStyles.writing

  const cardContent = (
    <article
      className={`relative h-full flex flex-col rounded-3xl overflow-hidden transition-all border-2 ${
        highContrast
          ? 'bg-black text-white border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.3)]'
          : `bg-[#0e0520] ${activeStyle.borderColor} text-[#fdf4ff] shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${activeStyle.portalGlow}`
      }`}
    >
      {/* 1. Realistic Illustrated World Scene Banner */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#06020e]">
        <WorldScene worldId={world.id} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0520] via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase border border-current shadow-sm ${
              highContrast
                ? 'bg-black text-[#00f5ff]'
                : `${activeStyle.badgeBg} ${activeStyle.badgeText}`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{world.badge}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#ffd700] border border-[#ffd700]/40 text-[11px] font-bold shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            50 Adventure Levels
          </span>
        </div>

        {/* Companion Avatar Floating Badge */}
        <div className="absolute -bottom-3 right-4 z-10">
          <CompanionAvatar id={companion.id} size="md" className="ring-3 ring-[#0e0520] shadow-[0_0_15px_rgba(255,42,133,0.5)]" />
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 pt-5">
        <div className="mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#d8b4fe]">
            Guide: {companion.name}
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight font-fredoka text-[#fdf4ff] group-hover:text-[#ff2a85] transition-colors">
            {world.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#d8b4fe] mt-0.5">
            {world.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#fdf4ff]/80 leading-relaxed mb-4 font-medium line-clamp-2">
          {world.description}
        </p>

        {/* Core Practice Areas Chips */}
        <div className="space-y-1.5 mb-5 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {world.targetSkills.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] px-2.5 py-1 rounded-lg font-bold bg-[#180633] text-[#f5d0fe] border border-[#a855f7]/40 shadow-[0_0_8px_rgba(168,85,247,0.15)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-3 border-t border-[#ff2a85]/20 flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#d8b4fe]">
            Grade 3 Curriculum
          </span>
          <div className="min-h-[44px] inline-flex items-center gap-1.5 font-black text-sm text-[#ff2a85] group-hover:translate-x-1 transition-transform filter drop-shadow-[0_0_8px_rgba(255,42,133,0.7)]">
            <span>Enter Kingdom</span>
            <ArrowRight className="w-4 h-4 text-[#ff2a85]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <Link
      to={`/worlds/${world.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#ff2a85]"
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
