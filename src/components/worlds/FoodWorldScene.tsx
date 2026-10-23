import React from 'react'

interface SceneProps {
  className?: string
  animated?: boolean
}

export const FoodWorldScene: React.FC<SceneProps> = ({ className = 'w-full h-full', animated: _animated = true }) => {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Magic Food World: Whimsical candy cottage, cupcake hills, lollipop trees, and Pip the Baker Bunny"
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="foodSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8BBD0" />
          <stop offset="40%" stopColor="#FFE0B2" />
          <stop offset="80%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#E1F5FE" />
        </linearGradient>

        {/* Gingerbread Wall Gradient */}
        <linearGradient id="gingerbread" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A16239" />
          <stop offset="50%" stopColor="#8D4925" />
          <stop offset="100%" stopColor="#6D3416" />
        </linearGradient>

        {/* Frosting White Roof */}
        <linearGradient id="frostingRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FFF0F5" />
          <stop offset="100%" stopColor="#F8BBD0" />
        </linearGradient>

        {/* Chocolate River Gradient */}
        <linearGradient id="chocoRiver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>

        {/* Cupcake Hill 1 */}
        <linearGradient id="cupcakePink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="50%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C51162" />
        </linearGradient>

        {/* Marshmallow Hill 2 */}
        <linearGradient id="marshmallowMint" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B2DFDB" />
          <stop offset="50%" stopColor="#80CBC4" />
          <stop offset="100%" stopColor="#4DB6AC" />
        </linearGradient>

        {/* Glow */}
        <filter id="foodGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Sky Backdrop */}
      <rect width="800" height="450" fill="url(#foodSky)" />

      {/* Cotton Candy Clouds */}
      <g opacity="0.9">
        <path
          d="M 80 80 Q 95 55 125 60 Q 155 50 175 75 Q 195 80 205 100 Q 205 120 180 125 L 75 125 Q 55 110 65 90 Q 75 80 80 80 Z"
          fill="#FCE4EC"
        />
        <path
          d="M 540 60 Q 560 35 590 40 Q 620 35 635 60 Q 655 65 665 85 Q 660 108 635 110 L 530 110 Q 515 95 525 75 Z"
          fill="#E1F5FE"
        />
        <path
          d="M 330 90 Q 345 70 370 70 Q 395 70 405 85 Q 420 88 425 105 L 320 105 Z"
          fill="#FFF9C4"
          opacity="0.8"
        />
      </g>

      {/* 2. Background Cupcake & Pudding Hills */}
      <path d="M 0 320 Q 180 220 380 280 Q 580 320 800 240 L 800 450 L 0 450 Z" fill="url(#marshmallowMint)" />
      <path d="M 0 350 Q 220 280 440 330 Q 660 290 800 340 L 800 450 L 0 450 Z" fill="#FFE082" opacity="0.8" />

      {/* Giant Lollipop Trees in Distance */}
      <g>
        {/* Lollipop 1 - Left Pink Swirl */}
        <rect x="75" y="190" width="8" height="120" rx="3" fill="#FFF" stroke="#FFCDD2" strokeWidth="1.5" />
        <circle cx="79" cy="190" r="32" fill="#FF4081" stroke="#C51162" strokeWidth="2.5" />
        <path d="M 79 162 C 60 162 60 218 79 218 C 95 218 95 175 79 175 C 68 175 68 205 79 205" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="79" cy="190" r="4" fill="#FFEB3B" />

        {/* Lollipop 2 - Right Lime Swirl */}
        <rect x="710" y="210" width="8" height="100" rx="3" fill="#FFF" stroke="#C8E6C9" strokeWidth="1.5" />
        <circle cx="714" cy="210" r="26" fill="#00E676" stroke="#00C853" strokeWidth="2" />
        <path d="M 714 188 C 698 188 698 232 714 232 C 726 232 726 198 714 198 C 706 198 706 220 714 220" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Lollipop 3 - Mid Blue Swirl */}
        <rect x="630" y="235" width="6" height="85" rx="2" fill="#FFF" stroke="#BBDEFB" strokeWidth="1.5" />
        <circle cx="633" cy="235" r="22" fill="#00B0FF" stroke="#0091EA" strokeWidth="2" />
        <path d="M 633 216 C 620 216 620 254 633 254 C 642 254 642 226 633 226" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* 3. Chocolate River with Strawberry Cream Swirls */}
      <path
        d="M 280 450 C 310 390 260 350 320 310 C 370 280 450 300 520 260 L 580 270 C 510 320 440 310 380 340 C 330 380 390 410 370 450 Z"
        fill="url(#chocoRiver)"
      />
      {/* Cream Foam waves */}
      <path
        d="M 300 440 Q 320 420 310 400 Q 285 365 330 330"
        stroke="#FFF0F5"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 345 375 Q 390 340 435 325"
        stroke="#FFF0F5"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Waffle Bridge Crossing River */}
      <g transform="translate(325, 335) rotate(-12)">
        <rect x="0" y="0" width="70" height="20" rx="3" fill="#FFCA28" stroke="#FFA000" strokeWidth="2" />
        {/* Waffle grid */}
        <line x1="14" y1="0" x2="14" y2="20" stroke="#FF8F00" strokeWidth="1.5" />
        <line x1="28" y1="0" x2="28" y2="20" stroke="#FF8F00" strokeWidth="1.5" />
        <line x1="42" y1="0" x2="42" y2="20" stroke="#FF8F00" strokeWidth="1.5" />
        <line x1="56" y1="0" x2="56" y2="20" stroke="#FF8F00" strokeWidth="1.5" />
        <line x1="0" y1="10" x2="70" y2="10" stroke="#FF8F00" strokeWidth="1.5" />
        {/* Sugar pearls on bridge rail */}
        <circle cx="10" cy="-3" r="3" fill="#FFF" />
        <circle cx="35" cy="-3" r="3" fill="#FFF" />
        <circle cx="60" cy="-3" r="3" fill="#FFF" />
      </g>

      {/* 4. Whimsical Gingerbread Bakery Cottage (Focal building) */}
      <g transform="translate(430, 160)">
        {/* Cottage Shadow */}
        <ellipse cx="100" cy="175" rx="110" ry="16" fill="#3E2723" opacity="0.3" />

        {/* Gingerbread Wall */}
        <rect x="30" y="70" width="140" height="95" rx="6" fill="url(#gingerbread)" stroke="#4E342E" strokeWidth="2.5" />

        {/* White Icing Wall Trim */}
        <path
          d="M 32 72 Q 45 82 58 72 Q 71 82 84 72 Q 97 82 110 72 Q 123 82 136 72 Q 149 82 168 72"
          stroke="#FFFFFF"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Roof Base & Fluffy Icing Droops */}
        <polygon points="100,10 15,75 185,75" fill="url(#frostingRoof)" stroke="#F8BBD0" strokeWidth="2" />
        {/* Dripping Icing */}
        <path
          d="M 15 75 Q 30 92 45 75 Q 60 96 75 75 Q 90 92 105 75 Q 120 98 135 75 Q 150 92 165 75 Q 175 88 185 75"
          fill="#FFFFFF"
        />

        {/* Candy Cane Chimney */}
        <rect x="135" y="12" width="22" height="42" rx="3" fill="#FF1744" stroke="#B71C1C" strokeWidth="1.5" />
        <path d="M 135 20 L 157 28 M 135 32 L 157 40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        {/* Fluffy Marshmallow Smoke Puff */}
        <circle cx="146" cy="-2" r="9" fill="#FFFFFF" opacity="0.9" />
        <circle cx="152" cy="-16" r="13" fill="#FFFFFF" opacity="0.85" />
        <circle cx="160" cy="-32" r="16" fill="#FFFFFF" opacity="0.7" />

        {/* Chocolate Cookie Door */}
        <path d="M 80 165 L 80 115 C 80 102 120 102 120 115 L 120 165 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="2" />
        <circle cx="112" cy="138" r="3.5" fill="#FFD54F" />
        {/* Door Icing outline */}
        <path d="M 84 163 L 84 116 C 84 107 116 107 116 116 L 116 163" stroke="#FFF" strokeWidth="2" fill="none" strokeDasharray="4 3" />

        {/* Sweet Cinnamon Roll Windows */}
        <g transform="translate(46, 105)">
          <circle cx="16" cy="16" r="15" fill="#FFE082" stroke="#FF8F00" strokeWidth="2" />
          <path d="M 16 4 C 8 4 4 10 4 16 C 4 23 10 27 16 27 C 22 27 26 21 26 16 C 26 12 21 9 16 9 C 13 9 10 12 10 16" stroke="#8D4925" strokeWidth="2.5" fill="none" />
        </g>
        <g transform="translate(138, 105)">
          <circle cx="16" cy="16" r="15" fill="#FFE082" stroke="#FF8F00" strokeWidth="2" />
          <path d="M 16 4 C 8 4 4 10 4 16 C 4 23 10 27 16 27 C 22 27 26 21 26 16 C 26 12 21 9 16 9 C 13 9 10 12 10 16" stroke="#8D4925" strokeWidth="2.5" fill="none" />
        </g>

        {/* Gumdrop Roof Decorations */}
        <circle cx="100" cy="8" r="8" fill="#E91E63" filter="url(#foodGlow)" />
        <circle cx="70" cy="35" r="6" fill="#00E676" />
        <circle cx="130" cy="35" r="6" fill="#FFC107" />
        <circle cx="45" cy="58" r="5.5" fill="#00B0FF" />
        <circle cx="155" cy="58" r="5.5" fill="#FF9100" />
      </g>

      {/* 5. Cookie Stepping Stones (Foreground path) */}
      <g>
        {/* Cookie Stone 1 */}
        <ellipse cx="250" cy="405" rx="30" ry="14" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <circle cx="240" cy="402" r="3" fill="#4E342E" />
        <circle cx="258" cy="406" r="3" fill="#4E342E" />
        <circle cx="250" cy="410" r="2.5" fill="#4E342E" />

        {/* Cookie Stone 2 */}
        <ellipse cx="200" cy="375" rx="25" ry="12" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <circle cx="192" cy="372" r="2.5" fill="#4E342E" />
        <circle cx="206" cy="376" r="2.5" fill="#4E342E" />

        {/* Cookie Stone 3 */}
        <ellipse cx="160" cy="345" rx="22" ry="10" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <circle cx="155" cy="343" r="2" fill="#4E342E" />
        <circle cx="165" cy="347" r="2" fill="#4E342E" />
      </g>

      {/* 6. Companion: Pip the Baker Bunny */}
      <g transform="translate(180, 245)">
        {/* Shadow */}
        <ellipse cx="36" cy="142" rx="32" ry="9" fill="#3E2723" opacity="0.3" />

        {/* Bunny Body */}
        <ellipse cx="36" cy="100" rx="24" ry="30" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
        {/* Soft Pink Tummy */}
        <ellipse cx="36" cy="104" rx="14" ry="18" fill="#FCE4EC" />

        {/* Baker Apron */}
        <path d="M 22 88 L 50 88 L 48 122 L 24 122 Z" fill="#FF80AB" stroke="#F50057" strokeWidth="1.5" rx="2" />
        <line x1="28" y1="88" x2="24" y2="76" stroke="#F50057" strokeWidth="1.5" />
        <line x1="44" y1="88" x2="48" y2="76" stroke="#F50057" strokeWidth="1.5" />
        <path d="M 33 100 Q 36 104 39 100" stroke="#FFF" strokeWidth="1.5" fill="none" />

        {/* Bunny Long Ears */}
        {/* Left Ear */}
        <path d="M 24 45 C 10 10 20 -15 28 -15 C 34 -15 36 15 32 45 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
        <path d="M 24 38 C 18 12 24 -6 28 -6 C 31 -6 32 15 30 38 Z" fill="#F8BBD0" />
        {/* Right Ear (Cheerfully bent tip) */}
        <path d="M 46 45 C 42 15 50 -10 60 -10 C 66 -10 65 0 58 15 L 52 45 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
        <path d="M 48 38 C 46 16 52 -2 58 -2 C 61 -2 60 5 54 18 L 50 38 Z" fill="#F8BBD0" />

        {/* Bunny Head */}
        <circle cx="36" cy="56" r="22" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />

        {/* Baker Chef Toque (Hat) */}
        <g transform="translate(18, 18)">
          <path d="M 8 20 Q 0 10 10 0 Q 20 -8 28 0 Q 38 10 30 20 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1.5" />
          <rect x="7" y="16" width="24" height="6" rx="2" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="1.5" />
          <line x1="7" y1="19" x2="31" y2="19" stroke="#FF80AB" strokeWidth="1" />
        </g>

        {/* Snout & Whiskers */}
        <ellipse cx="36" cy="62" rx="4" ry="3" fill="#FF80AB" />
        <path d="M 33 65 Q 36 68 39 65" stroke="#424242" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Whiskers */}
        <line x1="16" y1="60" x2="26" y2="61" stroke="#BDBDBD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="15" y1="65" x2="25" y2="64" stroke="#BDBDBD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="46" y1="61" x2="56" y2="60" stroke="#BDBDBD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="47" y1="64" x2="57" y2="65" stroke="#BDBDBD" strokeWidth="1.2" strokeLinecap="round" />

        {/* Large Sparkly Cartoon Eyes */}
        <circle cx="28" cy="52" r="3.8" fill="#3E2723" />
        <circle cx="27" cy="50.5" r="1.4" fill="#FFF" />
        <circle cx="44" cy="52" r="3.8" fill="#3E2723" />
        <circle cx="43" cy="50.5" r="1.4" fill="#FFF" />
        {/* Rosy Cheeks */}
        <circle cx="22" cy="59" r="4.5" fill="#FF80AB" opacity="0.6" />
        <circle cx="50" cy="59" r="4.5" fill="#FF80AB" opacity="0.6" />

        {/* Arms holding a Golden Pretzel / Cookie */}
        <path d="M 16 92 Q 22 108 30 102" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 56 92 Q 50 108 42 102" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Golden Frosted Star Cookie in hands */}
        <g transform="translate(36, 102)">
          <polygon
            points="0,-12 4,-4 12,-3 6,3 8,11 0,6 -8,11 -6,3 -12,-3 -4,-4"
            fill="#FFCA28"
            stroke="#FFA000"
            strokeWidth="1.5"
            filter="url(#foodGlow)"
          />
          <circle cx="0" cy="0" r="3" fill="#E91E63" />
        </g>
      </g>

      {/* Floating Candy Sparkles */}
      <g fill="#FFF" opacity="0.85">
        <polygon points="120,230 122,234 126,235 123,237 124,241 120,239 116,241 117,237 114,235 118,234" filter="url(#foodGlow)" />
        <polygon points="620,150 622,154 626,155 623,157 624,161 620,159 616,161 617,157 614,155 618,154" filter="url(#foodGlow)" />
        <polygon points="480,280 482,284 486,285 483,287 484,291 480,289 476,291 477,287 474,285 478,284" filter="url(#foodGlow)" />
      </g>
    </svg>
  )
}
