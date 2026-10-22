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

  const cardContent = (
    <article
      className={`relative h-full flex flex-col rounded-3xl p-6 sm:p-7 transition-all border-2 ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : `bg-white ${world.borderColor} shadow-sm hover:shadow-xl`
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
            highContrast
              ? 'bg-yellow-400 text-black'
              : 'bg-purple-100/90 text-purple-800'
          }`}
        >
          {world.badge}
        </span>
        <span className="text-xs font-semibold text-slate-400">Grade 3 Focus</span>
      </div>

      {/* World Icon & Title */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`p-3.5 rounded-2xl text-white shadow-md bg-gradient-to-br ${world.accentColor}`}
        >
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-fredoka text-slate-900 group-hover:text-purple-600 transition-colors">
            {world.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-purple-600">
            {world.subtitle}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
        {world.description}
      </p>

      {/* Target Skills Tags */}
      <div className="space-y-2 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Core Focus Areas
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {world.targetSkills.map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                highContrast
                  ? 'bg-neutral-800 text-yellow-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">Interactive Preview</span>
        <div className="flex items-center gap-1.5 font-bold text-sm text-purple-600 group-hover:translate-x-1 transition-transform">
          <span>Explore World</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </article>
  )

  return (
    <Link
      to={`/worlds/${world.id}`}
      className="group block h-full focus:outline-none focus:ring-4 focus:ring-purple-400 rounded-3xl"
    >
      {reducedMotion ? (
        <div>{cardContent}</div>
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
