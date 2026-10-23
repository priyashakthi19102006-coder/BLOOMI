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
      aria-label="BLOOMI Kingdom: Four floating magical worlds connected by rainbow pathways"
    >
      <defs>
        {/* Sky Panorama */}
        <linearGradient id="panoSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#81D4FA" />
          <stop offset="40%" stopColor="#FFF9C4" />
          <stop offset="70%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#E1F5FE" />
        </linearGradient>

        {/* Central Bloom Island */}
        <linearGradient id="centerIsland" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="60%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* Island Rock Underbelly */}
        <linearGradient id="rockUnder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Rainbow Pathway */}
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="25%" stopColor="#FFD180" />
          <stop offset="50%" stopColor="#FFFF8D" />
          <stop offset="75%" stopColor="#A7FFEB" />
          <stop offset="100%" stopColor="#80D8FF" />
        </linearGradient>

        <filter id="panoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Magical Sky & Sun */}
      <rect width="1200" height="480" rx="28" fill="url(#panoSky)" />

      {/* Distant Golden Sun */}
      <circle cx="600" cy="110" r="70" fill="#FFF8E1" opacity="0.8" filter="url(#panoGlow)" />
      <circle cx="600" cy="110" r="46" fill="#FFF59D" />

      {/* Floating Fluffy Clouds */}
      <g fill="#FFFFFF" opacity="0.85">
        <path d="M 80 80 Q 110 50 145 60 Q 180 50 200 80 Q 230 90 220 120 L 70 120 Q 55 100 80 80 Z" />
        <path d="M 980 60 Q 1010 35 1045 45 Q 1080 35 1100 65 Q 1130 75 1120 105 L 970 105 Q 955 85 980 60 Z" />
        <path d="M 460 70 Q 485 45 520 50 Q 550 45 565 70 L 450 70 Z" opacity="0.6" />
        <path d="M 700 80 Q 725 55 760 60 Q 790 55 805 80 L 690 80 Z" opacity="0.6" />
      </g>

      {/* Rainbow Bridges Connecting All Worlds to Center */}
      <path d="M 170 230 Q 380 200 520 280" stroke="url(#rainbowGrad)" strokeWidth="18" fill="none" opacity="0.85" />
      <path d="M 1030 230 Q 820 200 680 280" stroke="url(#rainbowGrad)" strokeWidth="18" fill="none" opacity="0.85" />
      <path d="M 330 150 Q 460 220 540 280" stroke="url(#rainbowGrad)" strokeWidth="14" fill="none" opacity="0.85" />
      <path d="M 870 150 Q 740 220 660 280" stroke="url(#rainbowGrad)" strokeWidth="14" fill="none" opacity="0.85" />

      {/* 2. Floating Island 1 (Left: Magic Amusement Park) */}
      <g transform="translate(60, 180)">
        {/* Island Rock Underbelly */}
        <polygon points="10,60 110,180 210,60" fill="url(#rockUnder)" />
        {/* Green Island Top */}
        <ellipse cx="110" cy="60" rx="105" ry="32" fill="#81C784" stroke="#43A047" strokeWidth="3" />
        {/* Castle Mini Silhouette */}
        <rect x="85" y="-10" width="50" height="55" rx="3" fill="#673AB7" />
        <polygon points="110,-42 80, -10 140,-10" fill="#FFC107" />
        <line x1="110" y1="-42" x2="110" y2="-52" stroke="#FFC107" strokeWidth="2" />
        <polygon points="110,-52 120,-48 110,-44" fill="#FF1744" />
        {/* Mini Roller Coaster Loop */}
        <path d="M 25 55 Q 50 -10 80 50" stroke="#FF5252" strokeWidth="5" fill="none" />
        {/* Mini Balloons */}
        <circle cx="165" cy="15" r="8" fill="#FF4081" />
        <circle cx="178" cy="10" r="7" fill="#00E5FF" />
        {/* Label Plaque */}
        <rect x="45" y="70" width="130" height="24" rx="8" fill="#FFFFFF" stroke="#FFD54F" strokeWidth="2" />
        <text x="110" y="86" textAnchor="middle" fill="#7A3300" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          Amusement Park
        </text>
      </g>

      {/* 3. Floating Island 2 (Top Left: Magic Food World) */}
      <g transform="translate(240, 60)">
        {/* Underbelly */}
        <polygon points="20,70 100,165 180,70" fill="url(#rockUnder)" />
        <ellipse cx="100" cy="70" rx="85" ry="26" fill="#FFE082" stroke="#FFB300" strokeWidth="3" />
        {/* Gingerbread Bakery */}
        <polygon points="100,10 65,45 135,45" fill="#FFFFFF" stroke="#F8BBD0" strokeWidth="2" />
        <rect x="72" y="45" width="56" height="28" rx="2" fill="#8D4925" />
        <circle cx="100" cy="8" r="6" fill="#E91E63" />
        {/* Lollipops */}
        <circle cx="45" cy="35" r="14" fill="#FF4081" stroke="#FFF" strokeWidth="2" />
        <line x1="45" y1="49" x2="45" y2="72" stroke="#FFF" strokeWidth="2.5" />
        <circle cx="150" cy="40" r="12" fill="#00E676" stroke="#FFF" strokeWidth="2" />
        <line x1="150" y1="52" x2="150" y2="72" stroke="#FFF" strokeWidth="2.5" />
        {/* Label */}
        <rect x="40" y="78" width="120" height="22" rx="8" fill="#FFFFFF" stroke="#FF80AB" strokeWidth="2" />
        <text x="100" y="93" textAnchor="middle" fill="#4A248A" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          Food World
        </text>
      </g>

      {/* 4. Floating Island 3 (Top Right: Magic Animal World) */}
      <g transform="translate(760, 60)">
        {/* Underbelly */}
        <polygon points="20,70 100,165 180,70" fill="url(#rockUnder)" />
        <ellipse cx="100" cy="70" rx="85" ry="26" fill="#81C784" stroke="#388E3C" strokeWidth="3" />
        {/* Great Blossom Tree */}
        <rect x="94" y="25" width="12" height="45" fill="#4E342E" rx="2" />
        <circle cx="100" cy="20" r="30" fill="#4CAF50" />
        <circle cx="85" cy="10" r="14" fill="#EC407A" opacity="0.8" />
        <circle cx="115" cy="12" r="14" fill="#EC407A" opacity="0.8" />
        {/* Treehouse */}
        <rect x="110" y="28" width="22" height="15" rx="2" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1" />
        <polygon points="121,20 106,28 136,28" fill="#388E3C" />
        {/* Label */}
        <rect x="40" y="78" width="120" height="22" rx="8" fill="#FFFFFF" stroke="#81C784" strokeWidth="2" />
        <text x="100" y="93" textAnchor="middle" fill="#16563F" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          Animal World
        </text>
      </g>

      {/* 5. Floating Island 4 (Right: Magic Space World) */}
      <g transform="translate(930, 180)">
        {/* Underbelly */}
        <polygon points="10,60 110,180 210,60" fill="url(#rockUnder)" />
        <ellipse cx="110" cy="60" rx="105" ry="32" fill="#5C6BC0" stroke="#3949AB" strokeWidth="3" />
        {/* Ringed Planet */}
        <circle cx="145" cy="15" r="24" fill="#FF7043" />
        <ellipse cx="145" cy="15" rx="38" ry="8" stroke="#FFD54F" strokeWidth="4" fill="none" transform="rotate(-15, 145, 15)" />
        {/* Cute Rocket */}
        <polygon points="75,-15 62,35 88,35" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.5" />
        <polygon points="75,-15 70,5 80,5" fill="#FF1744" />
        <circle cx="75" cy="15" r="4.5" fill="#00E5FF" />
        {/* Label */}
        <rect x="50" y="70" width="120" height="24" rx="8" fill="#FFFFFF" stroke="#9FA8DA" strokeWidth="2" />
        <text x="110" y="86" textAnchor="middle" fill="#283593" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          Space World
        </text>
      </g>

      {/* 6. Central Grand Bloom Fountain Island (Where everyone meets) */}
      <g transform="translate(420, 240)">
        {/* Mighty Underbelly */}
        <polygon points="30,85 180,230 330,85" fill="url(#rockUnder)" />
        {/* Emerald Island Surface */}
        <ellipse cx="180" cy="85" rx="175" ry="48" fill="url(#centerIsland)" stroke="#2E7D32" strokeWidth="4" />

        {/* Golden Bloom Spire & Crystal Water Fountain */}
        <g transform="translate(180, 50)">
          {/* Base */}
          <ellipse cx="0" cy="20" rx="42" ry="12" fill="#FFE082" stroke="#FFA000" strokeWidth="2.5" />
          <ellipse cx="0" cy="18" rx="32" ry="8" fill="#80D8FF" />
          {/* Fountain Spire */}
          <path d="M -8 18 L -4 -25 Q 0 -45 4 -25 L 8 18 Z" fill="#FFE082" stroke="#FFA000" strokeWidth="2" />
          {/* Spouting Water Arches */}
          <path d="M 0 -35 Q -35 -55 -38 -5" stroke="#E0F7FA" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 0 -35 Q 35 -55 38 -5" stroke="#E0F7FA" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Grand Bloom Star Crystal */}
          <polygon
            points="0,-55 6,-42 18,-40 10,-30 12,-18 0,-25 -12,-18 -10,-30 -18,-40 -6,-42"
            fill="#FFD54F"
            stroke="#FFA000"
            strokeWidth="1.5"
            filter="url(#panoGlow)"
          />
        </g>

        {/* 4 Little Mini Companion Figures Gathered at Fountain */}
        {/* Barnaby Bear */}
        <circle cx="120" cy="65" r="11" fill="#8D6E63" />
        <polygon points="120,48 116,56 124,56" fill="#E91E63" />
        {/* Pip Bunny */}
        <circle cx="150" cy="72" r="10" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
        <circle cx="150" cy="60" r="5" fill="#FFFFFF" />
        {/* Koa Panda */}
        <circle cx="210" cy="72" r="11" fill="#FFFFFF" stroke="#263238" strokeWidth="2" />
        <ellipse cx="210" cy="61" rx="9" ry="3" fill="#FFD54F" />
        {/* Nova Fox */}
        <circle cx="240" cy="65" r="10" fill="#FF7043" />
        <polygon points="234,56 230,48 240,54" fill="#FF7043" />
        <polygon points="246,56 250,48 240,54" fill="#FF7043" />

        {/* Central Welcoming Banner */}
        <g transform="translate(180, 115)">
          <rect x="-115" y="-14" width="230" height="30" rx="15" fill="#24483D" stroke="#FFF" strokeWidth="3" filter="url(#panoGlow)" />
          <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            BLOOMI ADVENTURE REALM
          </text>
        </g>
      </g>
    </svg>
  )
}
