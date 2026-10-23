import React from 'react'

interface SceneProps {
  className?: string
  animated?: boolean
}

export const SpaceWorldScene: React.FC<SceneProps> = ({ className = 'w-full h-full', animated: _animated = true }) => {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Magic Space World: Glowing galaxy, ringed planet, neon moon base, retro rocket, and Nova the Star Fox"
    >
      <defs>
        {/* Deep Galaxy Space Void */}
        <linearGradient id="neonGalaxySky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#04010a" />
          <stop offset="40%" stopColor="#0c031d" />
          <stop offset="75%" stopColor="#1a0633" />
          <stop offset="100%" stopColor="#030008" />
        </linearGradient>

        {/* Ringed Planet Gradient */}
        <linearGradient id="ringedPlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="45%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        {/* Rocket Thruster Plasma */}
        <linearGradient id="plasmaThrust" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="40%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Lunar Surface */}
        <linearGradient id="neonMoonSurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0b3b" />
          <stop offset="60%" stopColor="#110324" />
          <stop offset="100%" stopColor="#06010d" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="spaceGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="cosmicSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Deep Space Void with Cosmic Nebulae */}
      <rect width="800" height="450" fill="url(#neonGalaxySky)" />

      {/* Swirling Cosmic Nebulae */}
      <ellipse cx="260" cy="140" rx="260" ry="100" fill="#ff2a85" opacity="0.16" filter="url(#cosmicSoftGlow)" />
      <ellipse cx="580" cy="180" rx="280" ry="120" fill="#a855f7" opacity="0.18" filter="url(#cosmicSoftGlow)" />
      <ellipse cx="400" cy="80" rx="180" ry="70" fill="#00f5ff" opacity="0.1" filter="url(#cosmicSoftGlow)" />

      {/* Twinkling Star Field */}
      <g opacity="0.9">
        <circle cx="80" cy="60" r="1.5" fill="#fff" />
        <circle cx="160" cy="95" r="2.5" fill="#00f5ff" filter="url(#spaceGlow)" />
        <circle cx="270" cy="40" r="1.5" fill="#ff70a6" />
        <circle cx="390" cy="75" r="2" fill="#ffd700" />
        <circle cx="490" cy="35" r="1.5" fill="#fff" />
        <circle cx="620" cy="65" r="2.5" fill="#ff2a85" filter="url(#spaceGlow)" />
        <circle cx="730" cy="45" r="1.5" fill="#c084fc" />
        <circle cx="760" cy="110" r="2" fill="#00f5ff" />
        <circle cx="120" cy="180" r="1.5" fill="#ffd700" />
      </g>

      {/* 2. Giant Ringed Planet (Top Right) */}
      <g id="giantPlanet" transform="translate(620, 110)">
        {/* Planet Atmosphere Glow */}
        <circle cx="0" cy="0" r="62" fill="#a855f7" opacity="0.25" filter="url(#cosmicSoftGlow)" />

        {/* Back Half of Planet Rings */}
        <ellipse cx="0" cy="0" rx="110" ry="24" fill="none" stroke="#00f5ff" strokeWidth="4" opacity="0.6" transform="rotate(-18)" filter="url(#spaceGlow)" />
        <ellipse cx="0" cy="0" rx="95" ry="18" fill="none" stroke="#ffd700" strokeWidth="2.5" opacity="0.7" transform="rotate(-18)" />

        {/* Planet Sphere */}
        <circle cx="0" cy="0" r="54" fill="url(#ringedPlanetGrad)" stroke="#c084fc" strokeWidth="2" />
        {/* Planet Cloud Bands */}
        <path d="M -48 -14 Q 0 -6 48 -14" stroke="#ff70a6" strokeWidth="3" fill="none" opacity="0.8" />
        <path d="M -52 10 Q 0 20 52 10" stroke="#fdf4ff" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Front Half of Planet Rings */}
        <path
          d="M -104 33 A 110 24 0 0 0 104 -33"
          fill="none"
          stroke="#00f5ff"
          strokeWidth="4"
          filter="url(#spaceGlow)"
        />
        <path
          d="M -90 27 A 95 18 0 0 0 90 -27"
          fill="none"
          stroke="#ffd700"
          strokeWidth="2.5"
        />
      </g>

      {/* 3. Retro Rocket with Hot Pink Plasma Trail */}
      <g id="retroRocket" transform="translate(220, 100) rotate(35)">
        {/* Plasma Flame */}
        <polygon points="-8,45 8,45 0,95" fill="url(#plasmaThrust)" filter="url(#spaceGlow)" />
        <polygon points="-4,45 4,45 0,75" fill="#ffffff" />

        {/* Rocket Body */}
        <path d="M 0 -35 Q 16 0 16 45 L -16 45 Q -16 0 0 -35 Z" fill="#ffffff" stroke="#ff2a85" strokeWidth="2" />
        {/* Nose Cone */}
        <path d="M 0 -35 Q 12 -15 14 0 L -14 0 Q -12 -15 0 -35 Z" fill="#ff007f" filter="url(#spaceGlow)" />
        {/* Fins */}
        <polygon points="-16,20 -30,48 -16,42" fill="#a855f7" stroke="#ff2a85" strokeWidth="1.5" />
        <polygon points="16,20 30,48 16,42" fill="#a855f7" stroke="#ff2a85" strokeWidth="1.5" />
        {/* Porthole */}
        <circle cx="0" cy="15" r="9" fill="#00f5ff" stroke="#ff2a85" strokeWidth="2" filter="url(#spaceGlow)" />
        <circle cx="0" cy="15" r="5" fill="#fdf4ff" />
      </g>

      {/* 4. Lunar Horizon & Craters */}
      <path
        d="M 0 250 Q 220 200 440 240 T 800 220 L 800 450 L 0 450 Z"
        fill="url(#neonMoonSurface)"
        stroke="#00f5ff"
        strokeWidth="1.5"
      />

      {/* Glowing Moon Craters */}
      <ellipse cx="140" cy="290" rx="36" ry="14" fill="#0c031d" stroke="#a855f7" strokeWidth="2" />
      <ellipse cx="140" cy="289" rx="24" ry="8" fill="#180634" />

      <ellipse cx="680" cy="270" rx="42" ry="16" fill="#0c031d" stroke="#ff2a85" strokeWidth="2" />
      <ellipse cx="680" cy="269" rx="28" ry="9" fill="#180634" />

      {/* 5. Moon Base Biome Dome */}
      <g id="moonBiome" transform="translate(280, 210)">
        {/* Outer Forcefield Glow */}
        <ellipse cx="80" cy="60" rx="72" ry="48" fill="rgba(0,245,255,0.18)" stroke="#00f5ff" strokeWidth="2.5" filter="url(#spaceGlow)" />
        <ellipse cx="80" cy="60" rx="60" ry="38" fill="rgba(255,42,133,0.12)" />
        {/* Grid Lattice on Dome */}
        <path d="M 80 12 L 80 60 M 35 25 L 125 25 M 20 42 L 140 42" stroke="#00f5ff" strokeWidth="1.2" opacity="0.6" />

        {/* Internal Mini City Tower */}
        <rect x="74" y="28" width="12" height="32" fill="#ff2a85" filter="url(#spaceGlow)" />
        <circle cx="80" cy="24" r="5" fill="#ffd700" />
      </g>

      {/* 6. Nova the Star Fox Companion (In Astronaut Bubble Helmet) */}
      <g id="novaFox" transform="translate(480, 250)">
        {/* Astronaut Soft Glow Aura */}
        <circle cx="50" cy="65" r="48" fill="#ffd700" opacity="0.18" filter="url(#cosmicSoftGlow)" />

        {/* Space Suit Body */}
        <ellipse cx="50" cy="90" rx="32" ry="38" fill="#ffffff" stroke="#00f5ff" strokeWidth="2" />
        {/* Chest Control Console with Neon Buttons */}
        <rect x="36" y="75" width="28" height="24" rx="4" fill="#0e0520" stroke="#ff2a85" strokeWidth="1.5" />
        <circle cx="43" cy="83" r="2.5" fill="#00f5ff" filter="url(#spaceGlow)" />
        <circle cx="50" cy="83" r="2.5" fill="#ffd700" filter="url(#spaceGlow)" />
        <circle cx="57" cy="83" r="2.5" fill="#ff2a85" filter="url(#spaceGlow)" />
        <line x1="40" y1="92" x2="60" y2="92" stroke="#a855f7" strokeWidth="2" />

        {/* Big Bushy Fox Tail with White Tip */}
        <path
          d="M 18 95 C -10 110 -15 80 -8 60 C -4 48 10 70 20 85 Z"
          fill="#ea580c"
          stroke="#ff2a85"
          strokeWidth="1.5"
        />
        <path d="M -8 60 C -12 70 -5 75 -8 60 Z" fill="#ffffff" />

        {/* Spherical Clear Astronaut Bubble Helmet */}
        <circle cx="50" cy="40" r="34" fill="rgba(0,245,255,0.22)" stroke="#00f5ff" strokeWidth="2.5" filter="url(#spaceGlow)" />
        <ellipse cx="40" cy="28" rx="8" ry="4" fill="#ffffff" opacity="0.6" />

        {/* Fox Head Inside Helmet */}
        <polygon points="26,20 34,4 42,22" fill="#ea580c" stroke="#ff2a85" strokeWidth="1" />
        <polygon points="29,18 34,8 39,20" fill="#fdf4ff" />

        <polygon points="74,20 66,4 58,22" fill="#ea580c" stroke="#ff2a85" strokeWidth="1" />
        <polygon points="71,18 66,8 61,20" fill="#fdf4ff" />

        <circle cx="50" cy="40" r="22" fill="#ea580c" />
        {/* White Fox Cheeks */}
        <polygon points="34,44 50,56 28,52" fill="#fdf4ff" />
        <polygon points="66,44 50,56 72,52" fill="#fdf4ff" />

        {/* Snout & Nose */}
        <polygon points="48,46 52,46 50,49" fill="#180424" />
        <path d="M 46 51 Q 50 55 54 51" stroke="#180424" strokeWidth="1.5" fill="none" />

        {/* Bright Curious Eyes */}
        <circle cx="42" cy="36" r="3.2" fill="#180424" />
        <circle cx="43" cy="35" r="1.2" fill="#ffffff" />
        <circle cx="58" cy="36" r="3.2" fill="#180424" />
        <circle cx="59" cy="35" r="1.2" fill="#ffffff" />

        {/* Floating Glowing Star in Paw */}
        <polygon
          points="84,72 88,81 98,81 90,87 93,96 84,90 75,96 78,87 70,81 80,81"
          fill="#ffd700"
          stroke="#ff2a85"
          strokeWidth="1.5"
          filter="url(#spaceGlow)"
        />
      </g>
    </svg>
  )
}
