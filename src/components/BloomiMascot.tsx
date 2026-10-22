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
      className="drop-shadow-xs"
      aria-hidden="true"
    >
      {/* Background Soft Glow Ring */}
      <circle cx="50" cy="50" r="46" fill="#FFFDF7" stroke="#24483D" strokeWidth="2.5" strokeOpacity="0.15" />

      {/* Flower Petals in BLOOMI palette */}
      {/* Top Petal - Lavender */}
      <circle cx="50" cy="24" r="13" fill="#E8DEFF" stroke="#5B32A8" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Right Petal - Peach */}
      <circle cx="74" cy="40" r="13" fill="#FFE0CC" stroke="#A34812" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Bottom Right Petal - Mint */}
      <circle cx="68" cy="68" r="13" fill="#CDEFE0" stroke="#1E6B4F" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Bottom Left Petal - Soft Yellow */}
      <circle cx="32" cy="68" r="13" fill="#FFF0B3" stroke="#8A6400" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Left Petal - Mint Light */}
      <circle cx="26" cy="40" r="13" fill="#CDEFE0" stroke="#1E6B4F" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Core Head - Soft Warm Yellow */}
      <circle cx="50" cy="50" r="19" fill="#FFF0B3" stroke="#24483D" strokeWidth="2" />

      {/* Sprout Leaves on top */}
      <path d="M 50 31 C 47 25 43 23 39 24 C 38 29 42 33 50 31 Z" fill="#CDEFE0" stroke="#24483D" strokeWidth="1.5" />
      <path d="M 50 31 C 53 25 57 23 61 24 C 62 29 58 33 50 31 Z" fill="#CDEFE0" stroke="#24483D" strokeWidth="1.5" />

      {/* Deep Forest Eyes */}
      <circle cx="44" cy="48" r="2.5" fill="#24483D" />
      <circle cx="56" cy="48" r="2.5" fill="#24483D" />
      {/* Eye twinkle highlights */}
      <circle cx="45" cy="47" r="0.8" fill="#FFFFFF" />
      <circle cx="57" cy="47" r="0.8" fill="#FFFFFF" />

      {/* Cheerful Smile */}
      <path d="M 43 54 Q 50 60 57 54" stroke="#24483D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Cheeks in Peach */}
      <circle cx="39" cy="53" r="2.5" fill="#FFE0CC" stroke="#A34812" strokeWidth="0.5" />
      <circle cx="61" cy="53" r="2.5" fill="#FFE0CC" stroke="#A34812" strokeWidth="0.5" />
    </svg>
  )

  if (reducedMotion) {
    return <div className={`inline-block ${className}`}>{content}</div>
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
    >
      {content}
    </motion.div>
  )
}
