import React from 'react'
import { motion } from 'framer-motion'

interface BloomiMascotProps {
  size?: number
  className?: string
  reducedMotion?: boolean
}

export const BloomiMascot: React.FC<BloomiMascotProps> = ({
  size = 72,
  className = '',
  reducedMotion = false,
}) => {
  const content = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_12px_rgba(255,42,133,0.4)]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mascotCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#160a33" stopOpacity="0.9" />
        </radialGradient>
        <filter id="neonMascotGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Soft Neon Glow Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="#0e0520"
        stroke="#ff2a85"
        strokeWidth="2"
        strokeOpacity="0.6"
      />

      {/* Flower Petals in Neon Palette */}
      {/* Top Petal - Hot-Pink Neon */}
      <circle cx="50" cy="24" r="13" fill="#ff2a85" stroke="#ff80bf" strokeWidth="1.5" />
      {/* Right Petal - Electric-Purple */}
      <circle cx="74" cy="40" r="13" fill="#a855f7" stroke="#c084fc" strokeWidth="1.5" />
      {/* Bottom Right Petal - Electric-Cyan */}
      <circle cx="68" cy="68" r="13" fill="#00f5ff" stroke="#70f8ff" strokeWidth="1.5" />
      {/* Bottom Left Petal - Radiant-Gold */}
      <circle cx="32" cy="68" r="13" fill="#ffd700" stroke="#ffe766" strokeWidth="1.5" />
      {/* Left Petal - Magenta Glow */}
      <circle cx="26" cy="40" r="13" fill="#f43f5e" stroke="#fb7185" strokeWidth="1.5" />

      {/* Core Head - Deep Midnight with Gold Glow */}
      <circle cx="50" cy="50" r="19" fill="url(#mascotCoreGlow)" stroke="#ffd700" strokeWidth="2.5" />

      {/* Magical Star Sprouts on top */}
      <path d="M 50 31 C 47 25 43 23 39 24 C 38 29 42 33 50 31 Z" fill="#00f5ff" stroke="#70f8ff" strokeWidth="1.5" />
      <path d="M 50 31 C 53 25 57 23 61 24 C 62 29 58 33 50 31 Z" fill="#ff2a85" stroke="#ff80bf" strokeWidth="1.5" />

      {/* Luminous Starlight Eyes */}
      <circle cx="44" cy="48" r="2.5" fill="#ffffff" />
      <circle cx="56" cy="48" r="2.5" fill="#ffffff" />
      {/* Eye twinkle highlights */}
      <circle cx="45" cy="47" r="1" fill="#00f5ff" />
      <circle cx="57" cy="47" r="1" fill="#00f5ff" />

      {/* Cheerful Smile */}
      <path d="M 43 54 Q 50 60 57 54" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Glowing Cheeks */}
      <circle cx="39" cy="53" r="2.5" fill="#ff2a85" opacity="0.8" />
      <circle cx="61" cy="53" r="2.5" fill="#ff2a85" opacity="0.8" />
    </svg>
  )

  if (reducedMotion) {
    return <div className={`inline-block ${className}`}>{content}</div>
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
    >
      {content}
    </motion.div>
  )
}
