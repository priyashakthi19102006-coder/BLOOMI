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
      aria-label="Magic Amusement Park: Fantasy castle, roller coaster, carousel, and glowing carnival pathways"
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="parkSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9E7D" />
          <stop offset="45%" stopColor="#FFC896" />
          <stop offset="85%" stopColor="#FFECCC" />
          <stop offset="100%" stopColor="#D4F0FF" />
        </linearGradient>

        {/* Castle Gradient */}
        <linearGradient id="castleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E57C2" />
          <stop offset="50%" stopColor="#5E35B1" />
          <stop offset="100%" stopColor="#4527A0" />
        </linearGradient>

        {/* Castle Roof Gradient */}
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>

        {/* Coaster Track */}
        <linearGradient id="coasterTrack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="50%" stopColor="#FF7B7B" />
          <stop offset="100%" stopColor="#FF1744" />
        </linearGradient>

        {/* Ground Hill */}
        <linearGradient id="parkGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="60%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* Path Gradient */}
        <linearGradient id="parkPath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Sky Backdrop */}
      <rect width="800" height="450" fill="url(#parkSky)" />

      {/* Distant Sun & Glow */}
      <circle cx="680" cy="110" r="60" fill="#FFF8E1" opacity="0.8" filter="url(#softGlow)" />
      <circle cx="680" cy="110" r="38" fill="#FFF9C4" />

      {/* Fluffy Cartoon Clouds */}
      <g fill="#FFFFFF" opacity="0.85">
        <path d="M 60 90 Q 75 70 100 70 Q 125 70 140 85 Q 160 85 170 100 Q 170 115 150 120 L 50 120 Q 35 110 45 95 Q 55 90 60 90 Z" />
        <path d="M 320 60 Q 340 38 370 40 Q 400 40 415 58 Q 435 58 445 75 Q 445 95 420 100 L 310 100 Q 295 85 305 70 Q 315 60 320 60 Z" opacity="0.7" />
        <path d="M 520 120 Q 535 105 555 105 Q 575 105 585 118 Q 600 118 608 130 Q 608 145 590 148 L 510 148 Q 498 138 506 126 Z" opacity="0.8" />
      </g>

      {/* Hot Air Balloons in Distance */}
      <g opacity="0.9">
        {/* Balloon 1 */}
        <path d="M 120 140 C 105 140 100 160 110 175 L 118 190 L 122 190 L 130 175 C 140 160 135 140 120 140 Z" fill="#E91E63" />
        <path d="M 115 142 C 110 155 113 175 120 190 C 127 175 130 155 125 142 Z" fill="#FFC107" />
        <rect x="116" y="193" width="8" height="6" rx="1.5" fill="#795548" />
        <line x1="117" y1="190" x2="117" y2="193" stroke="#424242" strokeWidth="0.8" />
        <line x1="123" y1="190" x2="123" y2="193" stroke="#424242" strokeWidth="0.8" />

        {/* Balloon 2 */}
        <path d="M 710 180 C 698 180 694 196 702 208 L 708 220 L 712 220 L 718 208 C 726 196 722 180 710 180 Z" fill="#00BCD4" />
        <rect x="707" y="222" width="6" height="5" rx="1" fill="#795548" />
      </g>

      {/* 2. Distant Hills */}
      <path d="M 0 320 Q 200 240 450 280 Q 650 310 800 260 L 800 450 L 0 450 Z" fill="#81C784" opacity="0.6" />
      <path d="M 0 340 Q 250 280 500 320 Q 700 340 800 300 L 800 450 L 0 450 Z" fill="url(#parkGround)" />

      {/* 3. Roller Coaster Track (Sweeping loops) */}
      <g>
        {/* Support Pillars */}
        <line x1="180" y1="210" x2="180" y2="330" stroke="#FFCDD2" strokeWidth="4" />
        <line x1="260" y1="140" x2="260" y2="320" stroke="#FFCDD2" strokeWidth="4" />
        <line x1="340" y1="180" x2="340" y2="310" stroke="#FFCDD2" strokeWidth="4" />
        <line x1="420" y1="110" x2="420" y2="300" stroke="#FFCDD2" strokeWidth="4" />
        <line x1="490" y1="160" x2="490" y2="310" stroke="#FFCDD2" strokeWidth="4" />

        {/* Rail Ties */}
        <path
          d="M 120 280 C 180 180 230 110 300 130 C 370 150 380 250 450 150 C 510 60 600 120 680 260"
          stroke="#D32F2F"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 120 280 C 180 180 230 110 300 130 C 370 150 380 250 450 150 C 510 60 600 120 680 260"
          stroke="url(#coasterTrack)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Coaster Train Cart */}
        <g transform="translate(435, 128) rotate(-15)">
          <rect x="-14" y="-8" width="28" height="16" rx="5" fill="#FFEB3B" stroke="#F57F17" strokeWidth="2" />
          <circle cx="-8" cy="8" r="4" fill="#424242" />
          <circle cx="8" cy="8" r="4" fill="#424242" />
          <circle cx="-5" cy="-2" r="3" fill="#E91E63" />
          <circle cx="5" cy="-2" r="3" fill="#00BCD4" />
        </g>
      </g>

      {/* 4. Magic Fantasy Castle (Central focal landmark) */}
      <g transform="translate(480, 160)">
        {/* Castle Shadow */}
        <ellipse cx="90" cy="170" rx="95" ry="18" fill="#1B5E20" opacity="0.3" />

        {/* Main Castle Body */}
        <rect x="35" y="65" width="110" height="95" rx="4" fill="url(#castleGrad)" />
        <rect x="25" y="80" width="30" height="80" rx="4" fill="#5E35B1" />
        <rect x="125" y="80" width="30" height="80" rx="4" fill="#5E35B1" />

        {/* Battlements */}
        <rect x="35" y="55" width="16" height="14" fill="#7E57C2" />
        <rect x="60" y="55" width="16" height="14" fill="#7E57C2" />
        <rect x="85" y="55" width="16" height="14" fill="#7E57C2" />
        <rect x="110" y="55" width="16" height="14" fill="#7E57C2" />
        <rect x="129" y="55" width="16" height="14" fill="#7E57C2" />

        {/* Castle Door */}
        <path d="M 75 160 L 75 125 C 75 116 105 116 105 125 L 105 160 Z" fill="#FFE082" stroke="#FFA000" strokeWidth="2" />
        <circle cx="98" cy="142" r="2" fill="#795548" />

        {/* Stained Glass Window */}
        <circle cx="90" cy="85" r="14" fill="#FFF9C4" stroke="#FFD54F" strokeWidth="2" />
        <line x1="90" y1="71" x2="90" y2="99" stroke="#FFA000" strokeWidth="1.5" />
        <line x1="76" y1="85" x2="104" y2="85" stroke="#FFA000" strokeWidth="1.5" />

        {/* Left Spire */}
        <polygon points="40,25 22,80 58,80" fill="url(#roofGrad)" />
        <polygon points="40,25 31,80 40,80" fill="#FFC107" />
        {/* Right Spire */}
        <polygon points="140,25 122,80 158,80" fill="url(#roofGrad)" />
        <polygon points="140,25 131,80 140,80" fill="#FFC107" />
        {/* Center Grand Spire */}
        <polygon points="90,0 65,65 115,65" fill="url(#roofGrad)" />
        <polygon points="90,0 77,65 90,65" fill="#FFC107" />

        {/* Golden Orbs & Flags */}
        <circle cx="90" cy="0" r="4" fill="#FFF176" filter="url(#starGlow)" />
        <path d="M 90 0 L 108 5 L 90 10 Z" fill="#FF1744" />
        <path d="M 40 25 L 54 29 L 40 33 Z" fill="#00E676" />
        <path d="M 140 25 L 154 29 L 140 33 Z" fill="#00B0FF" />
      </g>

      {/* 5. Whimsical Glowing Carousel (Left attraction) */}
      <g transform="translate(140, 220)">
        <ellipse cx="60" cy="110" rx="70" ry="14" fill="#1B5E20" opacity="0.3" />
        {/* Base */}
        <path d="M 10 100 L 110 100 L 105 115 L 15 115 Z" fill="#FF8A65" stroke="#D84315" strokeWidth="2" />
        {/* Carousel Poles */}
        <line x1="28" y1="45" x2="28" y2="100" stroke="#FFD54F" strokeWidth="3" />
        <line x1="60" y1="35" x2="60" y2="100" stroke="#FFD54F" strokeWidth="4" />
        <line x1="92" y1="45" x2="92" y2="100" stroke="#FFD54F" strokeWidth="3" />
        {/* Carousel Horses */}
        <g transform="translate(24, 65)">
          <ellipse cx="6" cy="4" rx="8" ry="5" fill="#FFFFFF" />
          <circle cx="12" cy="0" r="4" fill="#FFFFFF" />
          <rect x="2" y="8" width="2" height="8" fill="#FFFFFF" />
          <rect x="8" y="8" width="2" height="8" fill="#FFFFFF" />
          <path d="M 3 2 L 9 2 L 7 6 L 1 6 Z" fill="#FF4081" />
        </g>
        <g transform="translate(88, 68)">
          <ellipse cx="6" cy="4" rx="8" ry="5" fill="#FFFFFF" />
          <circle cx="12" cy="0" r="4" fill="#FFFFFF" />
          <rect x="2" y="8" width="2" height="8" fill="#FFFFFF" />
          <rect x="8" y="8" width="2" height="8" fill="#FFFFFF" />
          <path d="M 3 2 L 9 2 L 7 6 L 1 6 Z" fill="#00E5FF" />
        </g>
        {/* Striped Canopy */}
        <polygon points="60,10 0,50 120,50" fill="#E91E63" />
        <polygon points="60,10 24,50 48,50" fill="#FFFFFF" />
        <polygon points="60,10 72,50 96,50" fill="#FFFFFF" />
        <circle cx="60" cy="10" r="5" fill="#FFD54F" filter="url(#starGlow)" />
        {/* Glow Canopy Lights */}
        <circle cx="10" cy="50" r="3" fill="#FFF9C4" />
        <circle cx="35" cy="50" r="3" fill="#FFF9C4" />
        <circle cx="60" cy="50" r="3" fill="#FFF9C4" />
        <circle cx="85" cy="50" r="3" fill="#FFF9C4" />
        <circle cx="110" cy="50" r="3" fill="#FFF9C4" />
      </g>

      {/* 6. Glowing Winding Carnival Path */}
      <path
        d="M 400 450 C 420 380 340 370 330 330 C 320 295 480 310 520 270"
        stroke="url(#parkPath)"
        strokeWidth="56"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 400 450 C 420 380 340 370 330 330 C 320 295 480 310 520 270"
        stroke="#FFF"
        strokeWidth="8"
        strokeDasharray="14 16"
        fill="none"
        opacity="0.85"
      />

      {/* Glowing Path Lanterns */}
      <g>
        {/* Lantern 1 */}
        <line x1="285" y1="380" x2="285" y2="425" stroke="#3E2723" strokeWidth="4" />
        <circle cx="285" cy="375" r="14" fill="#FFD54F" opacity="0.4" filter="url(#softGlow)" />
        <circle cx="285" cy="375" r="8" fill="#FFF59D" stroke="#FFA000" strokeWidth="2" />
        {/* Lantern 2 */}
        <line x1="475" y1="365" x2="475" y2="410" stroke="#3E2723" strokeWidth="4" />
        <circle cx="475" cy="360" r="14" fill="#FFD54F" opacity="0.4" filter="url(#softGlow)" />
        <circle cx="475" cy="360" r="8" fill="#FFF59D" stroke="#FFA000" strokeWidth="2" />
      </g>

      {/* 7. Companion: Barnaby the Carnival Bear */}
      <g transform="translate(330, 315)">
        {/* Shadow */}
        <ellipse cx="40" cy="98" rx="34" ry="10" fill="#1B5E20" opacity="0.4" />

        {/* Bear Body */}
        <ellipse cx="40" cy="65" rx="28" ry="32" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />
        {/* Cream Belly */}
        <ellipse cx="40" cy="68" rx="18" ry="20" fill="#D7CCC8" />

        {/* Bear Head */}
        <circle cx="40" cy="28" r="24" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />
        {/* Bear Ears */}
        <circle cx="20" cy="12" r="9" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
        <circle cx="20" cy="12" r="5" fill="#FFAB91" />
        <circle cx="60" cy="12" r="9" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
        <circle cx="60" cy="12" r="5" fill="#FFAB91" />

        {/* Snout */}
        <ellipse cx="40" cy="33" rx="11" ry="8" fill="#D7CCC8" />
        <ellipse cx="40" cy="29" rx="5" ry="3.5" fill="#3E2723" />
        <path d="M 37 34 Q 40 37 43 34" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Eyes with sparkle */}
        <circle cx="32" cy="23" r="3.5" fill="#212121" />
        <circle cx="31" cy="21.5" r="1.2" fill="#FFF" />
        <circle cx="48" cy="23" r="3.5" fill="#212121" />
        <circle cx="47" cy="21.5" r="1.2" fill="#FFF" />
        {/* Rosy Cheeks */}
        <circle cx="25" cy="31" r="4" fill="#FF8A80" opacity="0.6" />
        <circle cx="55" cy="31" r="4" fill="#FF8A80" opacity="0.6" />

        {/* Conductor / Ringmaster Hat */}
        <ellipse cx="40" cy="8" rx="18" ry="4" fill="#C2185B" stroke="#880E4F" strokeWidth="1.5" />
        <rect x="29" y="-6" width="22" height="14" rx="2" fill="#E91E63" stroke="#880E4F" strokeWidth="1.5" />
        <rect x="29" y="3" width="22" height="4" fill="#FFD54F" />
        <circle cx="40" cy="-6" r="3" fill="#FFD54F" />

        {/* Arms (Left arm waving cheerfully) */}
        <path d="M 14 55 Q 0 40 8 30 Q 18 32 20 48" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />
        <circle cx="6" cy="30" r="5" fill="#D7CCC8" />
        <path d="M 64 55 Q 78 65 72 75 Q 64 74 60 62" fill="#8D6E63" stroke="#5D4037" strokeWidth="2.5" />

        {/* Festive Golden Star Wand in right hand */}
        <line x1="72" y1="70" x2="86" y2="45" stroke="#FFA000" strokeWidth="3" strokeLinecap="round" />
        <polygon
          points="86,35 89,42 96,43 91,48 93,55 86,51 79,55 81,48 76,43 83,42"
          fill="#FFD54F"
          stroke="#FFA000"
          strokeWidth="1.5"
          filter="url(#starGlow)"
        />
      </g>

      {/* Colourful Carnival Balloons Floating Right */}
      <g transform="translate(680, 260)">
        <line x1="0" y1="40" x2="-20" y2="90" stroke="#BDBDBD" strokeWidth="1.2" />
        <line x1="18" y1="35" x2="-18" y2="90" stroke="#BDBDBD" strokeWidth="1.2" />
        <line x1="-12" y1="32" x2="-20" y2="90" stroke="#BDBDBD" strokeWidth="1.2" />

        {/* Balloon 1 - Red */}
        <ellipse cx="0" cy="18" rx="15" ry="19" fill="#FF5252" />
        <ellipse cx="-4" cy="12" rx="4" ry="7" fill="#FF8A80" opacity="0.6" />
        {/* Balloon 2 - Yellow */}
        <ellipse cx="22" cy="12" rx="14" ry="18" fill="#FFD740" />
        <ellipse cx="18" cy="8" rx="3.5" ry="6" fill="#FFF59D" opacity="0.6" />
        {/* Balloon 3 - Blue */}
        <ellipse cx="-16" cy="10" rx="14" ry="18" fill="#448AFF" />
        <ellipse cx="-20" cy="6" rx="3.5" ry="6" fill="#82B1FF" opacity="0.6" />
      </g>

      {/* Floating Sparkles */}
      <g fill="#FFFDE7" opacity="0.85">
        <polygon points="260,180 263,186 270,187 265,191 266,198 260,194 254,198 255,191 250,187 257,186" filter="url(#starGlow)" />
        <polygon points="560,90 562,94 567,95 563,98 564,103 560,100 556,103 557,98 553,95 558,94" filter="url(#starGlow)" />
        <polygon points="410,240 412,243 416,244 413,246 414,250 410,248 406,250 407,246 404,244 408,243" filter="url(#starGlow)" />
      </g>
    </svg>
  )
}
