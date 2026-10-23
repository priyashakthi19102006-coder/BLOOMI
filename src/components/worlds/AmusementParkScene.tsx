import React from 'react'

interface SceneProps {
  className?: string
  animated?: boolean
}

export const AmusementParkScene: React.FC<SceneProps> = ({ className = 'w-full h-full', animated: _animated = true }) => {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Magic Amusement Park: Glowing hot-pink rollercoasters, electric-purple castle, carnival attractions, and Barnaby Bear"
    >
      <defs>
        {/* Midnight Purple/Black Sky */}
        <linearGradient id="neonParkSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080214" />
          <stop offset="50%" stopColor="#15062b" />
          <stop offset="100%" stopColor="#0a0218" />
        </linearGradient>

        {/* Castle Gradients */}
        <linearGradient id="neonCastle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="50%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#1e0b3b" />
        </linearGradient>

        <linearGradient id="neonCastleRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>

        {/* Hot Pink Coaster Track */}
        <linearGradient id="neonTrack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="50%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>

        {/* Ground Hill */}
        <linearGradient id="neonGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1b0838" />
          <stop offset="50%" stopColor="#120524" />
          <stop offset="100%" stopColor="#080214" />
        </linearGradient>

        {/* Pathway */}
        <linearGradient id="neonPath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a85" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>

        {/* Filter Glows */}
        <filter id="parkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Midnight Sky & Neon Moon */}
      <rect width="800" height="450" fill="url(#neonParkSky)" />

      {/* Atmospheric Nebula */}
      <ellipse cx="400" cy="180" rx="300" ry="120" fill="#ff2a85" opacity="0.14" filter="url(#softGlow)" />
      <ellipse cx="650" cy="140" rx="180" ry="90" fill="#a855f7" opacity="0.18" filter="url(#softGlow)" />

      {/* Giant Neon Moon */}
      <circle cx="680" cy="90" r="48" fill="#ffd700" opacity="0.25" filter="url(#softGlow)" />
      <circle cx="680" cy="90" r="32" fill="#fff9c4" stroke="#ffd700" strokeWidth="2" filter="url(#parkGlow)" />

      {/* Distant Carnival Fireworks */}
      <g opacity="0.8">
        <circle cx="160" cy="70" r="2" fill="#00f5ff" />
        <circle cx="170" cy="60" r="1.5" fill="#ff2a85" />
        <circle cx="150" cy="65" r="1.5" fill="#ffd700" />
        <circle cx="160" cy="55" r="2" fill="#c084fc" />
        <circle cx="520" cy="80" r="2.5" fill="#ff2a85" filter="url(#parkGlow)" />
        <circle cx="535" cy="70" r="1.5" fill="#00f5ff" />
      </g>

      {/* 2. Ferris Wheel on Distant Ridge */}
      <g id="ferrisWheel" transform="translate(640, 160)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.7" />
        <circle cx="0" cy="0" r="45" fill="none" stroke="#ff2a85" strokeWidth="1.5" strokeDasharray="4 6" />
        {/* Spokes */}
        <line x1="-58" y1="0" x2="58" y2="0" stroke="#00f5ff" strokeWidth="1.5" opacity="0.8" />
        <line x1="0" y1="-58" x2="0" y2="58" stroke="#00f5ff" strokeWidth="1.5" opacity="0.8" />
        <line x1="-40" y1="-40" x2="40" y2="40" stroke="#ff2a85" strokeWidth="1.5" opacity="0.8" />
        <line x1="-40" y1="40" x2="40" y2="-40" stroke="#ff2a85" strokeWidth="1.5" opacity="0.8" />
        {/* Glowing Gondolas */}
        <circle cx="0" cy="-60" r="5" fill="#ffd700" filter="url(#parkGlow)" />
        <circle cx="60" cy="0" r="5" fill="#ff2a85" filter="url(#parkGlow)" />
        <circle cx="0" cy="60" r="5" fill="#00f5ff" filter="url(#parkGlow)" />
        <circle cx="-60" cy="0" r="5" fill="#a855f7" filter="url(#parkGlow)" />
        {/* Support Legs */}
        <line x1="0" y1="0" x2="-35" y2="90" stroke="#c084fc" strokeWidth="3" />
        <line x1="0" y1="0" x2="35" y2="90" stroke="#c084fc" strokeWidth="3" />
      </g>

      {/* 3. Glowing Fairy-Tale Castle */}
      <g id="castle" transform="translate(360, 140)">
        {/* Main Center Keep */}
        <rect x="-45" y="40" width="90" height="90" fill="url(#neonCastle)" stroke="#ff2a85" strokeWidth="2" />
        {/* Battlement Crests */}
        <rect x="-45" y="32" width="16" height="12" fill="#3b0764" stroke="#ff2a85" strokeWidth="1.5" />
        <rect x="-8" y="32" width="16" height="12" fill="#3b0764" stroke="#ff2a85" strokeWidth="1.5" />
        <rect x="29" y="32" width="16" height="12" fill="#3b0764" stroke="#ff2a85" strokeWidth="1.5" />
        {/* High Center Spire */}
        <rect x="-24" y="-10" width="48" height="50" fill="url(#neonCastle)" stroke="#a855f7" strokeWidth="1.5" />
        <path d="M -30 -10 L 0 -75 L 30 -10 Z" fill="url(#neonCastleRoof)" stroke="#ff007f" strokeWidth="2" filter="url(#parkGlow)" />
        <circle cx="0" cy="-78" r="6" fill="#ffd700" filter="url(#parkGlow)" />

        {/* Left Flanking Tower */}
        <rect x="-95" y="20" width="40" height="110" fill="url(#neonCastle)" stroke="#c084fc" strokeWidth="2" />
        <path d="M -102 20 L -75 -25 L -48 20 Z" fill="url(#neonCastleRoof)" stroke="#ff2a85" strokeWidth="2" />
        <circle cx="-75" cy="-28" r="4" fill="#00f5ff" filter="url(#parkGlow)" />

        {/* Right Flanking Tower */}
        <rect x="55" y="20" width="40" height="110" fill="url(#neonCastle)" stroke="#c084fc" strokeWidth="2" />
        <path d="M 48 20 L 75 -25 L 102 20 Z" fill="url(#neonCastleRoof)" stroke="#ff2a85" strokeWidth="2" />
        <circle cx="75" cy="-28" r="4" fill="#00f5ff" filter="url(#parkGlow)" />

        {/* Castle Arched Gate with Cyber Light */}
        <path d="M -18 130 A 18 18 0 0 1 18 130 Z" fill="#ff2a85" opacity="0.6" filter="url(#parkGlow)" />
        <path d="M -14 130 A 14 14 0 0 1 14 130 Z" fill="#ffd700" />
      </g>

      {/* 4. Glowing Neon Roller Coaster */}
      <g id="rollerCoaster">
        {/* Support Lattice */}
        <path d="M 60 270 L 60 170 M 120 270 L 120 120 M 180 270 L 180 145 M 240 270 L 240 180" stroke="#ff2a85" strokeWidth="2" opacity="0.4" />
        {/* Luminous Track */}
        <path
          d="M 20 230 C 80 80 140 110 200 160 C 260 210 300 240 370 200 C 440 160 480 210 540 240"
          stroke="url(#neonTrack)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#parkGlow)"
        />
        {/* Top Rail Shimmer */}
        <path
          d="M 20 230 C 80 80 140 110 200 160 C 260 210 300 240 370 200 C 440 160 480 210 540 240"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 14"
        />
        {/* Coaster Train */}
        <rect x="110" y="100" width="22" height="12" rx="4" fill="#00f5ff" stroke="#ffffff" strokeWidth="1.5" filter="url(#parkGlow)" />
        <rect x="135" y="110" width="20" height="12" rx="4" fill="#ffd700" stroke="#ffffff" strokeWidth="1.5" />
      </g>

      {/* 5. Rolling Night Hills & Glowing Landscape */}
      <path
        d="M 0 250 Q 220 220 440 250 T 800 250 L 800 450 L 0 450 Z"
        fill="url(#neonGround)"
        stroke="#ff2a85"
        strokeWidth="1.5"
      />

      {/* Glowing Carnival Pathway */}
      <path
        d="M 160 450 C 240 360 300 330 380 300 C 460 270 540 280 620 270"
        stroke="url(#neonPath)"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        filter="url(#parkGlow)"
        opacity="0.85"
      />
      <path
        d="M 160 450 C 240 360 300 330 380 300 C 460 270 540 280 620 270"
        stroke="#ffffff"
        strokeWidth="3"
        fill="none"
        strokeDasharray="16 20"
      />

      {/* 6. Neon Ticket Booth & Carousel Pavilion */}
      <g id="carousel" transform="translate(610, 240)">
        <polygon points="0,-35 45,0 -45,0" fill="#a855f7" stroke="#ff2a85" strokeWidth="2" filter="url(#parkGlow)" />
        <rect x="-40" y="0" width="80" height="30" fill="#1b0838" stroke="#00f5ff" strokeWidth="2" />
        {/* Carousel Poles */}
        <line x1="-25" y1="0" x2="-25" y2="30" stroke="#ffd700" strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="30" stroke="#ffd700" strokeWidth="2" />
        <line x1="25" y1="0" x2="25" y2="30" stroke="#ffd700" strokeWidth="2" />
      </g>

      {/* 7. Barnaby the Carnival Bear Companion (Holding Glowing Neon Wand) */}
      <g id="barnabyBear" transform="translate(240, 290)">
        {/* Bear Aura */}
        <circle cx="60" cy="65" r="50" fill="#ff2a85" opacity="0.15" filter="url(#softGlow)" />

        {/* Bear Body */}
        <ellipse cx="60" cy="80" rx="36" ry="42" fill="#78350f" stroke="#b45309" strokeWidth="2" />
        <ellipse cx="60" cy="85" rx="22" ry="26" fill="#fef3c7" />
        {/* Vest with Hot Pink Lapel */}
        <path d="M 40 65 L 50 110 L 70 110 L 80 65 Z" fill="#ff2a85" stroke="#ff007f" strokeWidth="1.5" />
        <circle cx="60" cy="80" r="3" fill="#ffd700" />
        <circle cx="60" cy="95" r="3" fill="#ffd700" />

        {/* Bear Head */}
        <circle cx="60" cy="40" r="28" fill="#78350f" stroke="#b45309" strokeWidth="2" />
        {/* Ears */}
        <circle cx="38" cy="22" r="10" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="38" cy="22" r="6" fill="#ff70a6" />
        <circle cx="82" cy="22" r="10" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="82" cy="22" r="6" fill="#ff70a6" />

        {/* Snout & Smiling Face */}
        <ellipse cx="60" cy="46" rx="14" ry="11" fill="#fef3c7" />
        <ellipse cx="60" cy="42" rx="5" ry="3.5" fill="#180424" />
        <path d="M 54 48 Q 60 54 66 48" stroke="#180424" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Friendly Eyes */}
        <circle cx="49" cy="36" r="3.5" fill="#180424" />
        <circle cx="50" cy="35" r="1.2" fill="#ffffff" />
        <circle cx="71" cy="36" r="3.5" fill="#180424" />
        <circle cx="72" cy="35" r="1.2" fill="#ffffff" />

        {/* Mini Carnival Top Hat with Neon Band */}
        <rect x="46" y="8" width="28" height="18" rx="2" fill="#1e0b3b" stroke="#a855f7" strokeWidth="1.5" />
        <ellipse cx="60" cy="26" rx="20" ry="4" fill="#1e0b3b" stroke="#ff2a85" strokeWidth="1.5" />
        <rect x="46" y="20" width="28" height="5" fill="#ff2a85" filter="url(#parkGlow)" />

        {/* Magic Star Wand in Hand */}
        <line x1="88" y1="85" x2="115" y2="40" stroke="#00f5ff" strokeWidth="3" filter="url(#parkGlow)" />
        {/* 5-point Star Top */}
        <polygon
          points="115,28 119,37 129,37 121,43 124,52 115,46 106,52 109,43 101,37 111,37"
          fill="#ffd700"
          stroke="#ff2a85"
          strokeWidth="1.5"
          filter="url(#parkGlow)"
        />
      </g>

      {/* Floating Magic Lanterns Along the Path */}
      <g opacity="0.9">
        <circle cx="340" cy="310" r="5" fill="#00f5ff" filter="url(#parkGlow)" />
        <circle cx="440" cy="285" r="5" fill="#ff2a85" filter="url(#parkGlow)" />
        <circle cx="530" cy="275" r="5" fill="#ffd700" filter="url(#parkGlow)" />
      </g>
    </svg>
  )
}
