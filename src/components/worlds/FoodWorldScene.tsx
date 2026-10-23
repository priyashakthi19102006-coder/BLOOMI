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
      aria-label="Magic Food World: Enchanted bakery, glowing candy architecture, lollipop trees, and Pip the Baker Bunny"
    >
      <defs>
        {/* Deep Cosmos/Food World Sky */}
        <linearGradient id="neonFoodSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080112" />
          <stop offset="45%" stopColor="#1a0429" />
          <stop offset="100%" stopColor="#0a0218" />
        </linearGradient>

        {/* Gingerbread Wall Gradient */}
        <linearGradient id="gingerWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a044e" />
          <stop offset="50%" stopColor="#2e0854" />
          <stop offset="100%" stopColor="#18042b" />
        </linearGradient>

        {/* Hot Pink Icing Roof */}
        <linearGradient id="pinkIcing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="50%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#ff70a6" />
        </linearGradient>

        {/* Glowing Confection River */}
        <linearGradient id="magentaRiver" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a85" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>

        {/* Candy Land Ground */}
        <linearGradient id="candyGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#20053b" />
          <stop offset="50%" stopColor="#130324" />
          <stop offset="100%" stopColor="#07010e" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="foodGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="candySoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Midnight Purple/Black Sky */}
      <rect width="800" height="450" fill="url(#neonFoodSky)" />

      {/* Confectionary Nebula Glows */}
      <ellipse cx="250" cy="150" rx="220" ry="90" fill="#ff2a85" opacity="0.14" filter="url(#candySoftGlow)" />
      <ellipse cx="580" cy="120" rx="240" ry="110" fill="#a855f7" opacity="0.18" filter="url(#candySoftGlow)" />

      {/* Giant Macaron Moon */}
      <circle cx="680" cy="85" r="40" fill="#ff2a85" opacity="0.3" filter="url(#candySoftGlow)" />
      <ellipse cx="680" cy="76" rx="36" ry="14" fill="#f472b6" stroke="#ff2a85" strokeWidth="2" />
      <ellipse cx="680" cy="85" rx="38" ry="8" fill="#fdf4ff" filter="url(#foodGlow)" />
      <ellipse cx="680" cy="94" rx="36" ry="14" fill="#c084fc" stroke="#a855f7" strokeWidth="2" />

      {/* Twinkling Sugar Crystal Stars */}
      <g opacity="0.8">
        <circle cx="100" cy="80" r="2" fill="#ffd700" />
        <circle cx="190" cy="60" r="2.5" fill="#00f5ff" filter="url(#foodGlow)" />
        <circle cx="340" cy="50" r="1.5" fill="#ff70a6" />
        <circle cx="480" cy="70" r="2" fill="#ffd700" />
        <circle cx="560" cy="40" r="2" fill="#00f5ff" />
      </g>

      {/* 2. Background Sugar Ridge & Waffle Mountains */}
      <path
        d="M 0 250 Q 200 180 400 230 T 800 220 L 800 450 L 0 450 Z"
        fill="url(#candyGround)"
        stroke="#ff2a85"
        strokeWidth="1.5"
      />

      {/* 3. Enchanted Gingerbread Bakery Cottage */}
      <g id="bakeryCottage" transform="translate(180, 160)">
        {/* Chimney */}
        <rect x="130" y="20" width="28" height="60" rx="4" fill="#3b0764" stroke="#ff2a85" strokeWidth="2" />
        {/* Glowing Marshmallow Puffs */}
        <circle cx="144" cy="10" r="12" fill="#fdf4ff" opacity="0.85" filter="url(#foodGlow)" />
        <circle cx="152" cy="-8" r="16" fill="#f5d0fe" opacity="0.75" filter="url(#foodGlow)" />
        <circle cx="160" cy="-30" r="20" fill="#f472b6" opacity="0.6" filter="url(#candySoftGlow)" />

        {/* Main Bakery House */}
        <rect x="20" y="70" width="160" height="120" rx="10" fill="url(#gingerWall)" stroke="#c084fc" strokeWidth="2" />

        {/* Hot Pink Neon Icing Roof */}
        <polygon points="10,75 100,-5 190,75" fill="url(#pinkIcing)" stroke="#ff007f" strokeWidth="2.5" filter="url(#foodGlow)" />
        {/* Dripping Icing Accents */}
        <path
          d="M 10 75 Q 25 90 40 75 Q 55 95 70 75 Q 85 90 100 75 Q 115 95 130 75 Q 145 90 160 75 Q 175 95 190 75"
          fill="#fdf4ff"
          stroke="#ff2a85"
          strokeWidth="2"
        />

        {/* Giant Strawberry Crest on Roof */}
        <circle cx="100" cy="18" r="12" fill="#ff007f" stroke="#ffd700" strokeWidth="2" filter="url(#foodGlow)" />

        {/* Glowing Stained Glass Caramel Window */}
        <circle cx="100" cy="115" r="26" fill="#ffd700" stroke="#ff2a85" strokeWidth="2.5" filter="url(#foodGlow)" opacity="0.9" />
        <line x1="100" y1="89" x2="100" y2="141" stroke="#18042b" strokeWidth="2" />
        <line x1="74" y1="115" x2="126" y2="115" stroke="#18042b" strokeWidth="2" />

        {/* Wafer Door */}
        <rect x="82" y="145" width="36" height="45" rx="4" fill="#581c87" stroke="#00f5ff" strokeWidth="2" />
        <circle cx="110" cy="170" r="3" fill="#ffd700" filter="url(#foodGlow)" />
      </g>

      {/* 4. Giant Neon Lollipop Trees */}
      <g id="lollipopForest">
        {/* Lollipop 1 (Left) */}
        <g transform="translate(110, 220)">
          <rect x="-4" y="0" width="8" height="90" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
          <circle cx="0" cy="0" r="32" fill="#a855f7" stroke="#ff2a85" strokeWidth="3" filter="url(#foodGlow)" />
          {/* Swirl Spiral */}
          <path d="M 0 0 C 10 -15 25 -5 20 15 C 15 30 -10 25 -20 10 C -25 -5 -10 -25 15 -20" stroke="#00f5ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* Lollipop 2 (Right Behind Bakery) */}
        <g transform="translate(420, 210)">
          <rect x="-3" y="0" width="6" height="85" fill="#ffffff" stroke="#ff2a85" strokeWidth="1" />
          <circle cx="0" cy="0" r="26" fill="#ff007f" stroke="#ffd700" strokeWidth="3" filter="url(#foodGlow)" />
          <path d="M 0 0 C 8 -12 20 -4 16 12 C 12 24 -8 20 -16 8 C -20 -4 -8 -20 12 -16" stroke="#ffffff" strokeWidth="2" fill="none" />
        </g>

        {/* Lollipop 3 (Far Right) */}
        <g transform="translate(680, 240)">
          <rect x="-4" y="0" width="8" height="95" fill="#ffffff" stroke="#00f5ff" strokeWidth="1" />
          <circle cx="0" cy="0" r="36" fill="#00f5ff" stroke="#a855f7" strokeWidth="3" filter="url(#foodGlow)" />
          <path d="M 0 0 C 12 -18 30 -6 24 18 C 18 36 -12 30 -24 12 C -30 -6 -12 -30 18 -24" stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* 5. Glowing Magenta Chocolate River & Waffle Bridge */}
      <g id="magentaRiverSection">
        <path
          d="M 380 450 C 460 380 500 340 560 310 C 620 280 700 270 800 270 L 800 340 C 720 340 650 350 580 390 C 520 420 460 450 440 450 Z"
          fill="url(#magentaRiver)"
          opacity="0.85"
          filter="url(#foodGlow)"
        />
        {/* River Flow Highlights */}
        <path
          d="M 400 440 C 480 375 520 340 580 320 T 780 290"
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="14 18"
          opacity="0.9"
        />

        {/* Waffle Stepping Stone Bridge */}
        <g transform="translate(520, 360)">
          <rect x="-24" y="-12" width="48" height="24" rx="6" fill="#d97706" stroke="#ffd700" strokeWidth="2" filter="url(#foodGlow)" />
          <line x1="-12" y1="-12" x2="-12" y2="12" stroke="#78350f" strokeWidth="1.5" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#78350f" strokeWidth="1.5" />
          <line x1="12" y1="-12" x2="12" y2="12" stroke="#78350f" strokeWidth="1.5" />
        </g>
      </g>

      {/* 6. Pip the Baker Bunny Companion (Holding Star Cookie) */}
      <g id="pipBunny" transform="translate(480, 260)">
        {/* Bunny Soft Glow Aura */}
        <circle cx="50" cy="70" r="50" fill="#a855f7" opacity="0.18" filter="url(#candySoftGlow)" />

        {/* Long Bunny Ears */}
        {/* Left Ear */}
        <ellipse cx="38" cy="18" rx="8" ry="32" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" transform="rotate(-10 38 18)" />
        <ellipse cx="38" cy="18" rx="4" ry="24" fill="#ff70a6" transform="rotate(-10 38 18)" />
        {/* Right Ear */}
        <ellipse cx="62" cy="18" rx="8" ry="32" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" transform="rotate(12 62 18)" />
        <ellipse cx="62" cy="18" rx="4" ry="24" fill="#ff70a6" transform="rotate(12 62 18)" />

        {/* Chef Toque Hat */}
        <ellipse cx="50" cy="38" rx="20" ry="8" fill="#ffffff" stroke="#ff2a85" strokeWidth="1.5" />
        <path d="M 34 38 Q 30 20 50 16 Q 70 20 66 38 Z" fill="#ffffff" stroke="#ff2a85" strokeWidth="1.5" />
        <line x1="36" y1="36" x2="64" y2="36" stroke="#ff2a85" strokeWidth="2.5" />

        {/* Head */}
        <circle cx="50" cy="58" r="24" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
        {/* Snout & Whiskers */}
        <ellipse cx="50" cy="64" rx="10" ry="7" fill="#fdf4ff" />
        <polygon points="48,60 52,60 50,63" fill="#ff2a85" />
        <path d="M 46 66 Q 50 70 54 66" stroke="#18042b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="38" y1="63" x2="28" y2="61" stroke="#a855f7" strokeWidth="1.2" />
        <line x1="38" y1="66" x2="28" y2="68" stroke="#a855f7" strokeWidth="1.2" />
        <line x1="62" y1="63" x2="72" y2="61" stroke="#a855f7" strokeWidth="1.2" />
        <line x1="62" y1="66" x2="72" y2="68" stroke="#a855f7" strokeWidth="1.2" />
        {/* Big Curious Eyes */}
        <circle cx="42" cy="54" r="3.5" fill="#18042b" />
        <circle cx="43" cy="53" r="1.2" fill="#ffffff" />
        <circle cx="58" cy="54" r="3.5" fill="#18042b" />
        <circle cx="59" cy="53" r="1.2" fill="#ffffff" />

        {/* Bunny Body with Chef Apron */}
        <ellipse cx="50" cy="98" rx="28" ry="32" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
        {/* Hot Pink Apron */}
        <rect x="34" y="82" width="32" height="40" rx="4" fill="#ff2a85" stroke="#ff007f" strokeWidth="1.5" />
        <circle cx="50" cy="94" r="3" fill="#ffd700" />
        <circle cx="50" cy="106" r="3" fill="#ffd700" />

        {/* Glowing Golden Star Cookie in Paws */}
        <polygon
          points="80,82 84,91 94,91 86,97 89,106 80,100 71,106 74,97 66,91 76,91"
          fill="#ffd700"
          stroke="#ff2a85"
          strokeWidth="1.5"
          filter="url(#foodGlow)"
        />
      </g>
    </svg>
  )
}
