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
      aria-label="Magic Space World: Cosmic galaxy with colourful ringed planets, glowing rocket, constellations, and Nova the Star Fox"
    >
      <defs>
        {/* Cosmic Deep Sky Gradient */}
        <linearGradient id="cosmicSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B092B" />
          <stop offset="35%" stopColor="#1A1448" />
          <stop offset="70%" stopColor="#2D124D" />
          <stop offset="100%" stopColor="#100C33" />
        </linearGradient>

        {/* Glowing Violet Nebula */}
        <linearGradient id="nebulaPurple" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#E040FB" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </linearGradient>

        {/* Ringed Planet Gradient */}
        <linearGradient id="ringedPlanet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A65" />
          <stop offset="40%" stopColor="#FF7043" />
          <stop offset="80%" stopColor="#D84315" />
          <stop offset="100%" stopColor="#BF360C" />
        </linearGradient>

        {/* Planet Ring Gradient */}
        <linearGradient id="planetRings" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFF59D" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFCA28" stopOpacity="0.85" />
        </linearGradient>

        {/* Rocket Ship Body */}
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ECEFF1" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CFD8DC" />
        </linearGradient>

        {/* Rocket Flame */}
        <linearGradient id="rocketFlame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="40%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#FF3D00" />
        </linearGradient>

        {/* Moon Surface */}
        <linearGradient id="moonSurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5C6BC0" />
          <stop offset="50%" stopColor="#3949AB" />
          <stop offset="100%" stopColor="#1A237E" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="cosmicGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="starlight" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Deep Space Cosmic Canvas */}
      <rect width="800" height="450" fill="url(#cosmicSky)" />

      {/* Glowing Swirling Nebula Clouds */}
      <path
        d="M 120 40 Q 300 -20 480 80 Q 640 180 780 120 L 800 300 Q 600 240 420 320 Q 200 400 40 280 Z"
        fill="url(#nebulaPurple)"
        filter="url(#cosmicGlow)"
      />
      <circle cx="220" cy="180" r="140" fill="#00E5FF" opacity="0.12" filter="url(#cosmicGlow)" />
      <circle cx="620" cy="120" r="120" fill="#FF4081" opacity="0.15" filter="url(#cosmicGlow)" />

      {/* Twinkling Constellations & Stars */}
      <g fill="#FFF">
        {/* Constellation Lines */}
        <g stroke="#90CAF9" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.45">
          <line x1="80" y1="90" x2="140" y2="70" />
          <line x1="140" y1="70" x2="200" y2="110" />
          <line x1="200" y1="110" x2="240" y2="85" />
          <line x1="580" y1="60" x2="640" y2="40" />
          <line x1="640" y1="40" x2="690" y2="80" />
        </g>
        {/* Major Stars */}
        <circle cx="80" cy="90" r="3.5" filter="url(#starlight)" />
        <circle cx="140" cy="70" r="4" filter="url(#starlight)" />
        <circle cx="200" cy="110" r="3.5" filter="url(#starlight)" />
        <circle cx="240" cy="85" r="4.5" filter="url(#starlight)" />
        <circle cx="580" cy="60" r="3" filter="url(#starlight)" />
        <circle cx="640" cy="40" r="4" filter="url(#starlight)" />
        <circle cx="690" cy="80" r="3.5" filter="url(#starlight)" />
        {/* Diamond Stars */}
        <polygon points="340,50 342,56 348,58 342,60 340,66 338,60 332,58 338,56" filter="url(#starlight)" />
        <polygon points="510,130 511,134 515,135 511,136 510,140 509,136 505,135 509,134" filter="url(#starlight)" />
        <polygon points="730,190 732,195 737,196 732,197 730,202 728,197 723,196 728,195" filter="url(#starlight)" />
        {/* Tiny stars */}
        <circle cx="50" cy="200" r="1.5" opacity="0.7" />
        <circle cx="110" cy="150" r="1.8" opacity="0.8" />
        <circle cx="170" cy="30" r="2" opacity="0.6" />
        <circle cx="290" cy="120" r="1.5" opacity="0.7" />
        <circle cx="450" cy="70" r="2.2" opacity="0.9" />
        <circle cx="480" cy="220" r="1.5" opacity="0.7" />
        <circle cx="750" cy="50" r="2" opacity="0.8" />
        <circle cx="770" cy="260" r="1.8" opacity="0.7" />
      </g>

      {/* 2. Giant Ringed Planet (Top Left Marvel) */}
      <g transform="translate(140, 120)">
        {/* Back Ring Half */}
        <path
          d="M -70 -10 C -70 -35 150 -35 150 -10"
          stroke="url(#planetRings)"
          strokeWidth="14"
          fill="none"
          transform="rotate(-20)"
          opacity="0.8"
        />

        {/* Planet Sphere */}
        <circle cx="40" cy="0" r="48" fill="url(#ringedPlanet)" />
        {/* Surface Stripes */}
        <path d="M -6 -15 Q 40 -10 86 -15" stroke="#BF360C" strokeWidth="6" fill="none" opacity="0.6" />
        <path d="M -8 10 Q 40 15 88 10" stroke="#FFE0B2" strokeWidth="8" fill="none" opacity="0.5" />
        <path d="M 0 25 Q 40 30 80 25" stroke="#BF360C" strokeWidth="5" fill="none" opacity="0.6" />

        {/* Front Ring Half (Crosses in front) */}
        <path
          d="M 150 -10 C 150 15 -70 15 -70 -10"
          stroke="url(#planetRings)"
          strokeWidth="14"
          fill="none"
          transform="rotate(-20)"
          filter="url(#cosmicGlow)"
        />
        <path
          d="M 150 -10 C 150 15 -70 15 -70 -10"
          stroke="#FFF"
          strokeWidth="2"
          fill="none"
          transform="rotate(-20)"
          opacity="0.8"
        />
      </g>

      {/* Distant Emerald Planet with Moon */}
      <g transform="translate(710, 100)">
        <circle cx="0" cy="0" r="28" fill="#00E676" stroke="#00B0FF" strokeWidth="2" filter="url(#starlight)" />
        <circle cx="-6" cy="-8" r="8" fill="#69F0AE" opacity="0.6" />
        {/* Tiny Orbiting Moon */}
        <circle cx="34" cy="-18" r="5" fill="#FFF59D" />
      </g>

      {/* 3. Futuristic Retro-Cute Rocket Ship in Flight */}
      <g transform="translate(480, 120) rotate(-35)">
        {/* Flaming Engine Exhaust */}
        <polygon points="-8,70 8,70 0,110" fill="url(#rocketFlame)" filter="url(#cosmicGlow)" />
        <polygon points="-5,70 5,70 0,95" fill="#FFFDE7" />

        {/* Rocket Fins */}
        <polygon points="-24,65 -8,45 -8,70" fill="#FF1744" stroke="#D50000" strokeWidth="1.5" />
        <polygon points="24,65 8,45 8,70" fill="#FF1744" stroke="#D50000" strokeWidth="1.5" />
        <polygon points="0,50 0,72 0,70" stroke="#FF1744" strokeWidth="3" />

        {/* Rocket Fuselage */}
        <path
          d="M 0, -25 C 22,10 18,65 10,70 L -10,70 C -18,65 -22,10 0,-25 Z"
          fill="url(#rocketBody)"
          stroke="#90A4AE"
          strokeWidth="2"
        />

        {/* Nose Cone */}
        <path d="M 0,-25 C 10,-8 14,0 14,8 L -14,8 C -14,0 -10,-8 0,-25 Z" fill="#FF1744" />

        {/* Round Porthole Window with Glass Reflection */}
        <circle cx="0" cy="24" r="12" fill="#00E5FF" stroke="#0288D1" strokeWidth="2" />
        <circle cx="0" cy="24" r="9" fill="#E0F7FA" />
        <path d="M -5 18 Q 2 16 6 22" stroke="#FFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Golden Explorer Star Emblem */}
        <polygon
          points="0,48 2,52 6,53 3,56 4,60 0,58 -4,60 -3,56 -6,53 -2,52"
          fill="#FFD54F"
          stroke="#FFA000"
          strokeWidth="0.8"
        />
      </g>

      {/* 4. Cosmic Moon Base Terrain (Foreground Moon Surface) */}
      <g>
        <path
          d="M 0 350 Q 220 290 440 330 Q 640 280 800 320 L 800 450 L 0 450 Z"
          fill="url(#moonSurface)"
        />
        {/* Craters */}
        <ellipse cx="120" cy="385" rx="34" ry="12" fill="#303F9F" stroke="#7986CB" strokeWidth="2" />
        <ellipse cx="118" cy="384" rx="26" ry="8" fill="#1A237E" />

        <ellipse cx="680" cy="370" rx="42" ry="15" fill="#303F9F" stroke="#7986CB" strokeWidth="2" />
        <ellipse cx="678" cy="369" rx="32" ry="10" fill="#1A237E" />

        <ellipse cx="490" cy="410" rx="28" ry="10" fill="#303F9F" stroke="#7986CB" strokeWidth="1.5" />
      </g>

      {/* Moon Base Glass Dome (Left background on moon) */}
      <g transform="translate(180, 290)">
        <ellipse cx="45" cy="55" rx="55" ry="10" fill="#1A237E" />
        <path d="M 0 52 C 0 10 90 10 90 52 Z" fill="#80D8FF" opacity="0.65" stroke="#00B0FF" strokeWidth="2" />
        <ellipse cx="30" cy="32" rx="12" ry="16" fill="#FFF" opacity="0.3" transform="rotate(-20, 30, 32)" />
        {/* Antennas & Communications Dish */}
        <line x1="45" y1="12" x2="45" y2="-8" stroke="#CFD8DC" strokeWidth="2" />
        <circle cx="45" cy="-8" r="4" fill="#FF5252" filter="url(#starlight)" />
      </g>

      {/* 5. Glowing Star Crystals on Moon Surface */}
      <g>
        {/* Crystal Cluster 1 */}
        <polygon points="560,370 568,340 576,370" fill="#00E5FF" stroke="#00B0FF" strokeWidth="1.5" filter="url(#starlight)" />
        <polygon points="552,375 558,350 565,375" fill="#7C4DFF" opacity="0.8" />
        {/* Crystal Cluster 2 */}
        <polygon points="320,395 327,370 334,395" fill="#FF4081" stroke="#E91E63" strokeWidth="1.5" filter="url(#starlight)" />
        <polygon points="314,400 318,380 324,400" fill="#FFD54F" opacity="0.8" />
      </g>

      {/* 6. Companion: Nova the Star Fox */}
      <g transform="translate(370, 260)">
        {/* Moon Shadow */}
        <ellipse cx="42" cy="148" rx="38" ry="12" fill="#0A0826" opacity="0.6" />

        {/* Fluffy Orange Bushy Tail with White Tip */}
        <path
          d="M 68 110 C 95 100 115 125 110 145 C 95 155 70 140 64 125 Z"
          fill="#FF7043"
          stroke="#E64A19"
          strokeWidth="2"
        />
        <path d="M 104 135 C 112 140 108 148 98 152 C 92 145 98 138 104 135 Z" fill="#FFFFFF" />

        {/* Astronaut Suit Body */}
        <ellipse cx="42" cy="105" rx="28" ry="34" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="2.5" />
        {/* Space Chest Control Panel */}
        <rect x="28" y="92" width="28" height="22" rx="4" fill="#37474F" stroke="#263238" strokeWidth="1.5" />
        <circle cx="35" cy="99" r="2.5" fill="#00E676" />
        <circle cx="43" cy="99" r="2.5" fill="#FF5252" />
        <circle cx="51" cy="99" r="2.5" fill="#00B0FF" />
        <line x1="33" y1="107" x2="53" y2="107" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />

        {/* Fox Head */}
        <ellipse cx="42" cy="58" rx="24" ry="20" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
        {/* White Cheek Tufts */}
        <polygon points="18,65 6,68 16,56" fill="#FFFFFF" />
        <polygon points="66,65 78,68 68,56" fill="#FFFFFF" />

        {/* Pointy Fox Ears */}
        <polygon points="24,42 16,14 36,34" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
        <polygon points="24,38 19,20 32,34" fill="#37474F" />
        <polygon points="60,42 68,14 48,34" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
        <polygon points="60,38 65,20 52,34" fill="#37474F" />

        {/* Snout & Whiskers */}
        <polygon points="36,58 48,58 42,66" fill="#FFFFFF" />
        <circle cx="42" cy="65" r="3" fill="#212121" />
        <path d="M 38 69 Q 42 72 46 69" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Sparkly Eyes */}
        <circle cx="32" cy="52" r="3.5" fill="#212121" />
        <circle cx="31" cy="50.5" r="1.3" fill="#FFF" />
        <circle cx="52" cy="52" r="3.5" fill="#212121" />
        <circle cx="51" cy="50.5" r="1.3" fill="#FFF" />

        {/* Transparent Glowing Astronaut Bubble Helmet */}
        <circle cx="42" cy="52" r="38" fill="#80D8FF" opacity="0.3" stroke="#00E5FF" strokeWidth="2.5" filter="url(#cosmicGlow)" />
        <circle cx="42" cy="52" r="38" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M 22 28 Q 38 20 54 28" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.75" />

        {/* Helmet Neck Collar */}
        <rect x="22" y="80" width="40" height="8" rx="3" fill="#90A4AE" stroke="#607D8B" strokeWidth="1.5" />

        {/* Arms */}
        {/* Left Arm waving warmly */}
        <path d="M 16 95 Q 4 80 12 70 Q 22 72 24 88" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="2" />
        <circle cx="10" cy="70" r="5" fill="#FF7043" />
        {/* Right Arm holding Floating Cosmic Star Wand */}
        <path d="M 68 95 Q 78 110 70 120 Q 60 118 58 102" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="2" />

        {/* Glowing Orbiting Star in Paw */}
        <g transform="translate(74, 118)">
          <polygon
            points="0,-14 4,-4 14,-3 7,4 9,14 0,8 -9,14 -7,4 -14,-3 -4,-4"
            fill="#FFD54F"
            stroke="#FFA000"
            strokeWidth="1.5"
            filter="url(#cosmicGlow)"
          />
          <circle cx="0" cy="0" r="3" fill="#FFF" />
        </g>
      </g>
    </svg>
  )
}
