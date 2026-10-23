import React from 'react'

interface SceneProps {
  className?: string
  animated?: boolean
}

export const AnimalWorldScene: React.FC<SceneProps> = ({ className = 'w-full h-full', animated: _animated = true }) => {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Magic Animal World: Bioluminescent enchanted forest, Great Treehouse, crystal stream, and Koa the Explorer Panda"
    >
      <defs>
        {/* Forest Night Cosmos */}
        <linearGradient id="neonForestSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#05010f" />
          <stop offset="50%" stopColor="#12042b" />
          <stop offset="100%" stopColor="#090118" />
        </linearGradient>

        {/* Tree Trunk */}
        <linearGradient id="treeTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="50%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>

        {/* Bioluminescent Canopy */}
        <linearGradient id="pinkCanopy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="50%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Forest Ground */}
        <linearGradient id="forestFloor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0b3b" />
          <stop offset="60%" stopColor="#110324" />
          <stop offset="100%" stopColor="#06010d" />
        </linearGradient>

        {/* Crystal Stream */}
        <linearGradient id="crystalStream" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#ff2a85" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="forestGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="natureSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Midnight Forest Sky */}
      <rect width="800" height="450" fill="url(#neonForestSky)" />

      {/* Atmospheric Bioluminescent Glow */}
      <ellipse cx="400" cy="160" rx="320" ry="130" fill="#a855f7" opacity="0.16" filter="url(#natureSoftGlow)" />
      <ellipse cx="620" cy="180" rx="200" ry="90" fill="#ff2a85" opacity="0.14" filter="url(#natureSoftGlow)" />

      {/* Giant Luminous Night Moon */}
      <circle cx="680" cy="80" r="42" fill="#ffd700" opacity="0.25" filter="url(#natureSoftGlow)" />
      <circle cx="680" cy="80" r="28" fill="#fdf4ff" stroke="#ffd700" strokeWidth="2" filter="url(#forestGlow)" />

      {/* Distant Forest Fireflies */}
      <g opacity="0.85">
        <circle cx="120" cy="120" r="2.5" fill="#00f5ff" filter="url(#forestGlow)" />
        <circle cx="210" cy="85" r="2" fill="#ffd700" filter="url(#forestGlow)" />
        <circle cx="350" cy="140" r="2" fill="#ff2a85" filter="url(#forestGlow)" />
        <circle cx="510" cy="90" r="2.5" fill="#00f5ff" filter="url(#forestGlow)" />
        <circle cx="580" cy="130" r="2" fill="#ffd700" filter="url(#forestGlow)" />
      </g>

      {/* 2. Layered Night Canopy Hills */}
      <path
        d="M 0 240 Q 220 180 440 220 T 800 210 L 800 450 L 0 450 Z"
        fill="url(#forestFloor)"
        stroke="#a855f7"
        strokeWidth="1.5"
      />

      {/* 3. The Great Bioluminescent Blossom Tree */}
      <g id="greatTree" transform="translate(380, 70)">
        {/* Massive Trunk */}
        <path
          d="M -30 220 Q -40 140 -20 80 Q 0 40 20 80 Q 40 140 30 220 Z"
          fill="url(#treeTrunk)"
          stroke="#c084fc"
          strokeWidth="2"
        />

        {/* Treehouse Balcony & Rope Bridge */}
        <rect x="-42" y="110" width="84" height="20" rx="4" fill="#1e0b3b" stroke="#ff2a85" strokeWidth="2" />
        <line x1="-36" y1="110" x2="-36" y2="95" stroke="#ffd700" strokeWidth="2" />
        <line x1="36" y1="110" x2="36" y2="95" stroke="#ffd700" strokeWidth="2" />
        <line x1="-38" y1="95" x2="38" y2="95" stroke="#ffd700" strokeWidth="2" />

        {/* Little Treehouse Cabin */}
        <rect x="-24" y="65" width="48" height="45" rx="4" fill="#3b0764" stroke="#00f5ff" strokeWidth="1.5" />
        <polygon points="-30,65 0,38 30,65" fill="#ff2a85" stroke="#ff007f" strokeWidth="2" filter="url(#forestGlow)" />
        <circle cx="0" cy="85" r="8" fill="#ffd700" filter="url(#forestGlow)" />

        {/* Glowing Neon Blossom Canopy */}
        <circle cx="0" cy="30" r="68" fill="url(#pinkCanopy)" opacity="0.85" filter="url(#forestGlow)" />
        <circle cx="-55" cy="50" r="48" fill="#a855f7" opacity="0.8" filter="url(#forestGlow)" />
        <circle cx="55" cy="50" r="48" fill="#ff007f" opacity="0.8" filter="url(#forestGlow)" />
        <circle cx="-25" cy="-10" r="42" fill="#c084fc" opacity="0.75" />
        <circle cx="25" cy="-10" r="42" fill="#ff70a6" opacity="0.75" />

        {/* Hanging Neon Lanterns */}
        <line x1="-45" y1="95" x2="-45" y2="125" stroke="#00f5ff" strokeWidth="1.5" />
        <circle cx="-45" cy="130" r="7" fill="#00f5ff" filter="url(#forestGlow)" />

        <line x1="45" y1="95" x2="45" y2="125" stroke="#ffd700" strokeWidth="1.5" />
        <circle cx="45" cy="130" r="7" fill="#ffd700" filter="url(#forestGlow)" />
      </g>

      {/* 4. Crystal Stream with Glowing Water Lilies */}
      <g id="crystalStreamGroup">
        <path
          d="M 120 450 C 220 370 280 340 340 310 C 400 280 480 270 560 270 L 620 270 C 540 280 460 300 400 340 C 320 390 220 440 180 450 Z"
          fill="url(#crystalStream)"
          opacity="0.85"
          filter="url(#forestGlow)"
        />
        {/* Stream Current Ripple */}
        <path
          d="M 140 440 C 240 365 300 335 360 305 T 580 275"
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="14 18"
          opacity="0.9"
        />

        {/* Glowing Water Lilies */}
        <circle cx="280" cy="350" r="9" fill="#ff2a85" filter="url(#forestGlow)" />
        <circle cx="280" cy="350" r="4" fill="#ffffff" />

        <circle cx="420" cy="310" r="8" fill="#ffd700" filter="url(#forestGlow)" />
        <circle cx="420" cy="310" r="3.5" fill="#ffffff" />
      </g>

      {/* 5. Glowing Magic Mushroom Cluster */}
      <g transform="translate(130, 320)">
        {/* Large Mushroom */}
        <path d="M 10 30 L 16 30 L 14 10 L 12 10 Z" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
        <path d="M 0 10 Q 13 -8 26 10 Z" fill="#ff2a85" stroke="#ff007f" strokeWidth="1.5" filter="url(#forestGlow)" />
        <circle cx="8" cy="4" r="2" fill="#fff" />
        <circle cx="18" cy="4" r="2" fill="#fff" />

        {/* Small Mushroom */}
        <path d="M 32 30 L 36 30 L 35 18 L 33 18 Z" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
        <path d="M 26 18 Q 34 6 42 18 Z" fill="#00f5ff" stroke="#38bdf8" strokeWidth="1.5" filter="url(#forestGlow)" />
        <circle cx="34" cy="14" r="1.5" fill="#fff" />
      </g>

      {/* 6. Koa the Explorer Panda Companion (Holding Glowing Compass) */}
      <g id="koaPanda" transform="translate(520, 260)">
        {/* Koa Soft Glow Aura */}
        <circle cx="50" cy="65" r="48" fill="#00f5ff" opacity="0.18" filter="url(#natureSoftGlow)" />

        {/* Panda Body */}
        <ellipse cx="50" cy="85" rx="34" ry="40" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
        {/* Black V-Vest Patches */}
        <path d="M 18 65 Q 50 82 82 65 L 75 115 Q 50 110 25 115 Z" fill="#180424" stroke="#a855f7" strokeWidth="1" />
        {/* Hot Pink Explorer Scarf */}
        <path d="M 30 58 Q 50 68 70 58 L 74 72 Q 50 80 26 72 Z" fill="#ff2a85" stroke="#ff007f" strokeWidth="1.5" filter="url(#forestGlow)" />
        <circle cx="68" cy="78" r="4" fill="#ffd700" />

        {/* Panda Head */}
        <circle cx="50" cy="40" r="28" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
        {/* Round Black Ears */}
        <circle cx="28" cy="20" r="11" fill="#180424" stroke="#ff2a85" strokeWidth="1.5" />
        <circle cx="28" cy="20" r="6" fill="#a855f7" />
        <circle cx="72" cy="20" r="11" fill="#180424" stroke="#ff2a85" strokeWidth="1.5" />
        <circle cx="72" cy="20" r="6" fill="#a855f7" />

        {/* Iconic Eye Patches */}
        <ellipse cx="38" cy="38" rx="8" ry="11" fill="#180424" transform="rotate(-15 38 38)" />
        <circle cx="39" cy="38" r="3.2" fill="#ffffff" />
        <circle cx="40" cy="37" r="1.2" fill="#00f5ff" />

        <ellipse cx="62" cy="38" rx="8" ry="11" fill="#180424" transform="rotate(15 62 38)" />
        <circle cx="61" cy="38" r="3.2" fill="#ffffff" />
        <circle cx="60" cy="37" r="1.2" fill="#00f5ff" />

        {/* Snout & Smiling Mouth */}
        <ellipse cx="50" cy="46" rx="9" ry="6" fill="#fdf4ff" />
        <polygon points="47,44 53,44 50,47" fill="#180424" />
        <path d="M 46 48 Q 50 53 54 48" stroke="#180424" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Glowing Cyan Compass in Hands */}
        <circle cx="85" cy="82" r="14" fill="#0e0520" stroke="#00f5ff" strokeWidth="2.5" filter="url(#forestGlow)" />
        {/* Compass Needle */}
        <polygon points="85,72 88,82 85,85 82,82" fill="#ff2a85" filter="url(#forestGlow)" />
        <polygon points="85,92 88,82 85,85 82,82" fill="#ffffff" />
        <circle cx="85" cy="82" r="2.5" fill="#ffd700" />
      </g>
    </svg>
  )
}
