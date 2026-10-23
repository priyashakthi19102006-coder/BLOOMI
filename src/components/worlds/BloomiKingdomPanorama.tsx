import React from 'react'

interface PanoramaProps {
  className?: string
}

export const BloomiKingdomPanorama: React.FC<PanoramaProps> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 1200 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="BLOOMI Cyber-Magical Kingdom: Four floating neon worlds connected by luminous hot-pink and cyan light trails"
    >
      <defs>
        {/* Deep Cosmos Background Gradient */}
        <linearGradient id="neonSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05010c" />
          <stop offset="35%" stopColor="#0d041e" />
          <stop offset="70%" stopColor="#180634" />
          <stop offset="100%" stopColor="#060111" />
        </linearGradient>

        {/* Hot Pink Light Trails */}
        <linearGradient id="hotPinkTrail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="50%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Electric Purple Energy */}
        <linearGradient id="electricPurple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>

        {/* Cyan Neon Glow */}
        <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Floating Island Rock */}
        <linearGradient id="islandRock" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2e1065" />
          <stop offset="50%" stopColor="#1e0b3b" />
          <stop offset="100%" stopColor="#0d031c" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="neonGlowPink" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" result="bigBlur" />
          <feGaussianBlur stdDeviation="6" result="sharpBlur" />
          <feMerge>
            <feMergeNode in="bigBlur" />
            <feMergeNode in="sharpBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Deep Space Void with Rounded Border */}
      <rect width="1200" height="480" rx="28" fill="url(#neonSky)" stroke="rgba(255,42,133,0.3)" strokeWidth="2" />

      {/* Cosmic Nebula Clouds */}
      <ellipse cx="600" cy="180" rx="380" ry="140" fill="#ff2a85" opacity="0.12" filter="url(#superGlow)" />
      <ellipse cx="280" cy="220" rx="240" ry="110" fill="#a855f7" opacity="0.16" filter="url(#superGlow)" />
      <ellipse cx="920" cy="200" rx="260" ry="120" fill="#00f5ff" opacity="0.1" filter="url(#superGlow)" />

      {/* Distant Twinkling Stars */}
      <g opacity="0.85">
        <circle cx="120" cy="60" r="1.5" fill="#fff" />
        <circle cx="210" cy="90" r="2" fill="#ff70a6" />
        <circle cx="340" cy="45" r="1.5" fill="#c084fc" />
        <circle cx="480" cy="80" r="2.5" fill="#00f5ff" />
        <circle cx="680" cy="50" r="1.5" fill="#fff" />
        <circle cx="790" cy="95" r="2" fill="#ffd700" />
        <circle cx="940" cy="40" r="2.5" fill="#ff2a85" />
        <circle cx="1060" cy="75" r="1.5" fill="#fff" />
        <circle cx="1130" cy="110" r="2" fill="#c084fc" />
        <circle cx="160" cy="150" r="1.5" fill="#00f5ff" />
        <circle cx="1020" cy="160" r="1.5" fill="#ffd700" />
      </g>

      {/* Luminous Core Galaxy Flare in Center */}
      <circle cx="600" cy="150" r="90" fill="#ff2a85" opacity="0.25" filter="url(#superGlow)" />
      <circle cx="600" cy="150" r="45" fill="#c084fc" opacity="0.4" filter="url(#superGlow)" />
      <circle cx="600" cy="150" r="18" fill="#ffffff" filter="url(#neonGlowPink)" />

      {/* 2. Pulsing Neon Light Bridges Connecting Floating Worlds */}
      {/* Bridge 1: Center to Amusement Park (Top-Left) */}
      <path
        d="M 600 240 Q 420 180 260 210"
        stroke="url(#hotPinkTrail)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#neonGlowPink)"
      />
      <path
        d="M 600 240 Q 420 180 260 210"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
      />

      {/* Bridge 2: Center to Food World (Bottom-Left) */}
      <path
        d="M 600 270 Q 450 360 280 340"
        stroke="url(#hotPinkTrail)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#neonGlowPink)"
      />
      <path
        d="M 600 270 Q 450 360 280 340"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
      />

      {/* Bridge 3: Center to Space World (Top-Right) */}
      <path
        d="M 600 240 Q 780 180 940 200"
        stroke="url(#cyanNeon)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#neonGlowPink)"
      />
      <path
        d="M 600 240 Q 780 180 940 200"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
      />

      {/* Bridge 4: Center to Animal World (Bottom-Right) */}
      <path
        d="M 600 270 Q 760 360 930 340"
        stroke="url(#hotPinkTrail)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#neonGlowPink)"
      />
      <path
        d="M 600 270 Q 760 360 930 340"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
      />

      {/* 3. CENTRAL CITADEL: Bloom Spire Island */}
      <g id="centerCitadel">
        {/* Floating Under-Island */}
        <path d="M 500 260 L 600 370 L 700 260 Z" fill="url(#islandRock)" stroke="#a855f7" strokeWidth="2" />
        <ellipse cx="600" cy="260" rx="110" ry="26" fill="#1e0b3b" stroke="#ff2a85" strokeWidth="3" filter="url(#neonGlowPink)" />
        <ellipse cx="600" cy="258" rx="90" ry="18" fill="#3b0764" />

        {/* Levitating Crystal Spire */}
        <path d="M 600 130 L 618 240 L 582 240 Z" fill="url(#cyanNeon)" filter="url(#superGlow)" opacity="0.9" />
        <path d="M 600 130 L 608 240 L 600 246 Z" fill="#ffffff" opacity="0.8" />

        {/* Orbiting Energy Rings */}
        <ellipse cx="600" cy="210" rx="42" ry="12" fill="none" stroke="#ffd700" strokeWidth="3" transform="rotate(-15 600 210)" filter="url(#neonGlowPink)" />
        <ellipse cx="600" cy="180" rx="28" ry="8" fill="none" stroke="#ff2a85" strokeWidth="2.5" transform="rotate(18 600 180)" filter="url(#neonGlowPink)" />
      </g>

      {/* 4. WORLD 1 (TOP-LEFT): Magic Amusement Park */}
      <g id="worldAmusementPark">
        {/* Floating Island Rock */}
        <path d="M 170 230 L 260 320 L 340 230 Z" fill="url(#islandRock)" stroke="#ff2a85" strokeWidth="1.5" />
        <ellipse cx="255" cy="228" rx="88" ry="22" fill="#190634" stroke="#ff2a85" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Neon Castle Spires */}
        <rect x="240" y="165" width="30" height="55" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
        <path d="M 235 165 L 255 125 L 275 165 Z" fill="#ff2a85" filter="url(#neonGlowPink)" />
        <circle cx="255" cy="122" r="4" fill="#ffd700" filter="url(#neonGlowPink)" />

        {/* Side Spires */}
        <rect x="215" y="180" width="18" height="40" fill="#2e1065" stroke="#ff2a85" strokeWidth="1.5" />
        <path d="M 212 180 L 224 150 L 236 180 Z" fill="#a855f7" />

        <rect x="277" y="180" width="18" height="40" fill="#2e1065" stroke="#ff2a85" strokeWidth="1.5" />
        <path d="M 274 180 L 286 150 L 298 180 Z" fill="#a855f7" />

        {/* Glowing Roller Coaster Loop */}
        <path
          d="M 180 220 Q 210 130 230 190 T 290 220"
          stroke="#00f5ff"
          strokeWidth="3.5"
          fill="none"
          filter="url(#neonGlowPink)"
        />

        {/* Label Badge */}
        <rect x="180" y="240" width="150" height="24" rx="12" fill="#0d041e" stroke="#ff2a85" strokeWidth="1.5" />
        <text x="255" y="256" fill="#fdf4ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          🎡 AMUSEMENT PARK
        </text>
      </g>

      {/* 5. WORLD 2 (BOTTOM-LEFT): Magic Food World */}
      <g id="worldFood">
        {/* Floating Island Rock */}
        <path d="M 190 355 L 275 440 L 360 355 Z" fill="url(#islandRock)" stroke="#a855f7" strokeWidth="1.5" />
        <ellipse cx="275" cy="355" rx="88" ry="22" fill="#240742" stroke="#ff007f" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Glowing Candy Bakery Cottage */}
        <rect x="250" y="305" width="48" height="42" rx="6" fill="#4c0519" stroke="#ff2a85" strokeWidth="2" />
        {/* Glowing Icing Roof */}
        <path d="M 240 308 Q 274 275 308 308 Z" fill="#ff2a85" filter="url(#neonGlowPink)" />
        <circle cx="274" cy="275" r="7" fill="#ffd700" filter="url(#neonGlowPink)" />

        {/* Lollipop Candy Trees */}
        <line x1="225" y1="350" x2="225" y2="320" stroke="#fff" strokeWidth="2.5" />
        <circle cx="225" cy="315" r="14" fill="#a855f7" stroke="#00f5ff" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        <line x1="325" y1="350" x2="325" y2="325" stroke="#fff" strokeWidth="2.5" />
        <circle cx="325" cy="320" r="12" fill="#ff2a85" stroke="#ffd700" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Label Badge */}
        <rect x="200" y="370" width="150" height="24" rx="12" fill="#0d041e" stroke="#ff007f" strokeWidth="1.5" />
        <text x="275" y="386" fill="#fdf4ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          🍬 MAGIC FOOD WORLD
        </text>
      </g>

      {/* 6. WORLD 3 (TOP-RIGHT): Magic Space World */}
      <g id="worldSpace">
        {/* Floating Asteroid Island */}
        <path d="M 850 215 L 945 305 L 1030 215 Z" fill="url(#islandRock)" stroke="#00f5ff" strokeWidth="1.5" />
        <ellipse cx="940" cy="214" rx="92" ry="22" fill="#091b34" stroke="#00f5ff" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Moon Base Biome Dome */}
        <ellipse cx="940" cy="205" rx="36" ry="24" fill="rgba(0,245,255,0.25)" stroke="#00f5ff" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Launch Tower & Rocket */}
        <rect x="910" y="160" width="8" height="42" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
        <path d="M 935 140 L 945 185 L 925 185 Z" fill="#ffffff" stroke="#ff2a85" strokeWidth="1.5" />
        <polygon points="930,185 940,185 935,198" fill="#ff007f" filter="url(#neonGlowPink)" />

        {/* Orbiting Ringed Planet */}
        <circle cx="995" cy="160" r="18" fill="#701a75" stroke="#c084fc" strokeWidth="1.5" />
        <ellipse cx="995" cy="160" rx="32" ry="7" fill="none" stroke="#ffd700" strokeWidth="2" transform="rotate(-20 995 160)" filter="url(#neonGlowPink)" />

        {/* Label Badge */}
        <rect x="865" y="228" width="150" height="24" rx="12" fill="#0d041e" stroke="#00f5ff" strokeWidth="1.5" />
        <text x="940" y="244" fill="#fdf4ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          🚀 MAGIC SPACE WORLD
        </text>
      </g>

      {/* 7. WORLD 4 (BOTTOM-RIGHT): Magic Animal World */}
      <g id="worldAnimal">
        {/* Floating Enchanted Island */}
        <path d="M 845 355 L 935 440 L 1025 355 Z" fill="url(#islandRock)" stroke="#a855f7" strokeWidth="1.5" />
        <ellipse cx="935" cy="354" rx="90" ry="22" fill="#1b0838" stroke="#a855f7" strokeWidth="2.5" filter="url(#neonGlowPink)" />

        {/* Bioluminescent Great Blossom Tree */}
        <path d="M 930 350 L 940 350 L 938 290 L 932 290 Z" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
        {/* Glowing Canopy */}
        <circle cx="935" cy="275" r="32" fill="#a855f7" opacity="0.8" filter="url(#neonGlowPink)" />
        <circle cx="915" cy="285" r="22" fill="#ff2a85" opacity="0.85" filter="url(#neonGlowPink)" />
        <circle cx="955" cy="285" r="22" fill="#ff007f" opacity="0.85" filter="url(#neonGlowPink)" />
        <circle cx="935" cy="265" r="16" fill="#fdf4ff" filter="url(#superGlow)" />

        {/* Floating Glowing Fireflies */}
        <circle cx="890" cy="335" r="3" fill="#00f5ff" filter="url(#neonGlowPink)" />
        <circle cx="975" cy="330" r="3" fill="#ffd700" filter="url(#neonGlowPink)" />
        <circle cx="955" cy="315" r="2.5" fill="#ff2a85" filter="url(#neonGlowPink)" />

        {/* Label Badge */}
        <rect x="860" y="370" width="150" height="24" rx="12" fill="#0d041e" stroke="#a855f7" strokeWidth="1.5" />
        <text x="935" y="386" fill="#fdf4ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          🐾 MAGIC ANIMAL WORLD
        </text>
      </g>
    </svg>
  )
}
