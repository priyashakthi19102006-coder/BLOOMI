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
      aria-label="Magic Animal World: Enchanted forest with giant glowing blossom tree, treehouses, and Koa the Explorer Panda"
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A7FFEB" />
          <stop offset="30%" stopColor="#C8E6C9" />
          <stop offset="70%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#E8F5E9" />
        </linearGradient>

        {/* Great Blossom Tree Canopy */}
        <linearGradient id="blossomCanopy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="40%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* Glowing Blossom Cluster */}
        <linearGradient id="magicPinkBlossom" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F48FB1" />
          <stop offset="60%" stopColor="#EC407A" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>

        {/* Tree Trunk Gradient */}
        <linearGradient id="treeTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4E342E" />
          <stop offset="50%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Crystal Stream */}
        <linearGradient id="crystalStream" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DD0E1" />
          <stop offset="50%" stopColor="#00BCD4" />
          <stop offset="100%" stopColor="#0097A7" />
        </linearGradient>

        {/* Forest Ground */}
        <linearGradient id="forestGrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="60%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>

        {/* Glow */}
        <filter id="animalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="fireflyGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Sky Backdrop */}
      <rect width="800" height="450" fill="url(#forestSky)" />

      {/* Distant Sunbeams / God Rays */}
      <polygon points="200,0 280,0 450,450 320,450" fill="#FFFDE7" opacity="0.3" />
      <polygon points="400,0 460,0 600,450 510,450" fill="#FFFDE7" opacity="0.25" />

      {/* Distant Misty Forest Ridges */}
      <path d="M 0 260 Q 200 180 440 220 Q 640 190 800 240 L 800 450 L 0 450 Z" fill="#80CBC4" opacity="0.5" />
      <path d="M 0 290 Q 180 230 400 260 Q 620 230 800 280 L 800 450 L 0 450 Z" fill="#A5D6A7" opacity="0.7" />
      <path d="M 0 330 Q 240 280 480 310 Q 680 270 800 320 L 800 450 L 0 450 Z" fill="url(#forestGrass)" />

      {/* 2. Sparkling Crystal River */}
      <path
        d="M 500 450 C 470 380 540 340 480 300 C 430 260 380 280 310 240 L 350 235 C 430 270 480 250 530 290 C 590 330 540 370 580 450 Z"
        fill="url(#crystalStream)"
      />
      {/* Sparkles on stream */}
      <path d="M 490 340 Q 520 325 505 310" stroke="#E0F7FA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 525 390 Q 550 370 530 350" stroke="#E0F7FA" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* 3. The Giant Enchanted Blossom Tree (Majestic Centerpiece) */}
      <g transform="translate(160, 50)">
        {/* Shadow */}
        <ellipse cx="140" cy="360" rx="130" ry="20" fill="#1B5E20" opacity="0.4" />

        {/* Mighty Trunk & Roots */}
        <path
          d="M 115 170 Q 110 240 70 340 Q 100 360 135 345 Q 165 290 175 170 Z"
          fill="url(#treeTrunk)"
          stroke="#3E2723"
          strokeWidth="2.5"
        />
        {/* Right Root Arch */}
        <path
          d="M 155 270 Q 205 320 220 355 Q 195 360 160 340"
          fill="url(#treeTrunk)"
          stroke="#3E2723"
          strokeWidth="2"
        />

        {/* Treehouse on Lower Branch */}
        <g transform="translate(60, 185)">
          {/* Wooden Platform */}
          <rect x="-10" y="24" width="70" height="8" rx="2" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.5" />
          {/* House Body */}
          <rect x="0" y="-8" width="50" height="32" rx="3" fill="#D7CCC8" stroke="#5D4037" strokeWidth="2" />
          {/* Leaf Thatched Roof */}
          <polygon points="25,-26 -8,-6 58,-6" fill="#43A047" stroke="#2E7D32" strokeWidth="2" />
          {/* Round Window */}
          <circle cx="16" cy="8" r="8" fill="#FFF9C4" stroke="#FFA000" strokeWidth="1.5" />
          <line x1="16" y1="0" x2="16" y2="16" stroke="#FFA000" strokeWidth="1" />
          <line x1="8" y1="8" x2="24" y2="8" stroke="#FFA000" strokeWidth="1" />
          {/* Little Door */}
          <rect x="30" y="4" width="14" height="20" rx="2" fill="#795548" stroke="#4E342E" strokeWidth="1" />
          {/* Rope Ladder Hanging Down */}
          <line x1="8" y1="32" x2="8" y2="65" stroke="#8D6E63" strokeWidth="1.2" />
          <line x1="18" y1="32" x2="18" y2="65" stroke="#8D6E63" strokeWidth="1.2" />
          <line x1="8" y1="40" x2="18" y2="40" stroke="#8D6E63" strokeWidth="1.5" />
          <line x1="8" y1="48" x2="18" y2="48" stroke="#8D6E63" strokeWidth="1.5" />
          <line x1="8" y1="56" x2="18" y2="56" stroke="#8D6E63" strokeWidth="1.5" />
        </g>

        {/* Lush Green Foliage Puffs */}
        <circle cx="90" cy="90" r="60" fill="url(#blossomCanopy)" opacity="0.95" />
        <circle cx="170" cy="70" r="75" fill="url(#blossomCanopy)" />
        <circle cx="230" cy="110" r="65" fill="url(#blossomCanopy)" />
        <circle cx="140" cy="30" r="70" fill="url(#blossomCanopy)" />

        {/* Magic Glowing Pink Blossom Clusters */}
        <circle cx="80" cy="65" r="28" fill="url(#magicPinkBlossom)" filter="url(#animalGlow)" opacity="0.85" />
        <circle cx="185" cy="45" r="32" fill="url(#magicPinkBlossom)" filter="url(#animalGlow)" opacity="0.85" />
        <circle cx="240" cy="85" r="26" fill="url(#magicPinkBlossom)" filter="url(#animalGlow)" opacity="0.85" />
        <circle cx="130" cy="120" r="24" fill="url(#magicPinkBlossom)" filter="url(#animalGlow)" opacity="0.8" />

        {/* Hanging Crystal Fruit / Lanterns */}
        <g>
          <line x1="120" y1="130" x2="120" y2="155" stroke="#FFD54F" strokeWidth="1.5" />
          <circle cx="120" cy="158" r="6" fill="#FFF9C4" filter="url(#fireflyGlow)" />

          <line x1="205" y1="125" x2="205" y2="150" stroke="#FFD54F" strokeWidth="1.5" />
          <circle cx="205" cy="153" r="6" fill="#FFF9C4" filter="url(#fireflyGlow)" />

          <line x1="65" y1="120" x2="65" y2="145" stroke="#FFD54F" strokeWidth="1.5" />
          <circle cx="65" cy="148" r="5" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        </g>
      </g>

      {/* 4. Second Treehouse with Rope Suspension Bridge */}
      <g transform="translate(600, 160)">
        {/* Tree Trunk */}
        <rect x="50" y="80" width="28" height="150" rx="4" fill="url(#treeTrunk)" stroke="#3E2723" strokeWidth="2" />
        {/* Foliage */}
        <circle cx="64" cy="50" r="55" fill="url(#blossomCanopy)" />
        {/* Little Watchtower */}
        <rect x="40" y="55" width="48" height="30" rx="3" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1.8" />
        <polygon points="64,25 32,55 96,55" fill="#43A047" stroke="#2E7D32" strokeWidth="1.8" />
        <rect x="56" y="65" width="16" height="20" rx="2" fill="#795548" />
      </g>
      {/* Rope Bridge Connecting the Trees */}
      <path
        d="M 370 240 Q 510 270 640 225"
        stroke="#8D6E63"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 370 230 Q 510 260 640 215"
        stroke="#8D6E63"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Bridge Slats */}
      <line x1="430" y1="243" x2="430" y2="253" stroke="#4E342E" strokeWidth="2" />
      <line x1="480" y1="248" x2="480" y2="258" stroke="#4E342E" strokeWidth="2" />
      <line x1="530" y1="246" x2="530" y2="256" stroke="#4E342E" strokeWidth="2" />
      <line x1="580" y1="238" x2="580" y2="248" stroke="#4E342E" strokeWidth="2" />

      {/* 5. Stepping Stones across the Grass */}
      <g>
        <ellipse cx="610" cy="385" rx="28" ry="12" fill="#90A4AE" stroke="#607D8B" strokeWidth="2" />
        <ellipse cx="660" cy="410" rx="32" ry="14" fill="#90A4AE" stroke="#607D8B" strokeWidth="2" />
        <ellipse cx="560" cy="365" rx="22" ry="10" fill="#90A4AE" stroke="#607D8B" strokeWidth="2" />
      </g>

      {/* 6. Companion: Koa the Explorer Panda */}
      <g transform="translate(360, 290)">
        {/* Shadow */}
        <ellipse cx="40" cy="115" rx="36" ry="10" fill="#1B5E20" opacity="0.4" />

        {/* Panda Body (Plump & White with black shoulders) */}
        <ellipse cx="40" cy="80" rx="30" ry="34" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2.5" />
        {/* Black Shoulder / Chest Vest */}
        <path
          d="M 12 70 C 14 55 66 55 68 70 C 66 84 14 84 12 70 Z"
          fill="#263238"
        />

        {/* Explorer Backpack */}
        <rect x="66" y="65" width="16" height="26" rx="4" fill="#795548" stroke="#4E342E" strokeWidth="1.5" />
        <rect x="68" y="70" width="12" height="4" fill="#FFC107" />
        {/* Bedroll on backpack */}
        <rect x="64" y="58" width="20" height="7" rx="3" fill="#00E676" stroke="#00C853" strokeWidth="1" />

        {/* Panda Head */}
        <circle cx="40" cy="38" r="26" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2.5" />

        {/* Big Black Panda Ears */}
        <circle cx="18" cy="20" r="10" fill="#263238" />
        <circle cx="62" cy="20" r="10" fill="#263238" />

        {/* Famous Black Eye Patches */}
        <ellipse cx="28" cy="36" rx="8" ry="10" fill="#263238" transform="rotate(-15, 28, 36)" />
        <ellipse cx="52" cy="36" rx="8" ry="10" fill="#263238" transform="rotate(15, 52, 36)" />

        {/* Sparkly Eyes inside patches */}
        <circle cx="29" cy="35" r="3.2" fill="#FFFFFF" />
        <circle cx="30" cy="34" r="1.3" fill="#212121" />
        <circle cx="51" cy="35" r="3.2" fill="#FFFFFF" />
        <circle cx="50" cy="34" r="1.3" fill="#212121" />

        {/* Snout & Smiling Mouth */}
        <ellipse cx="40" cy="44" rx="8" ry="5.5" fill="#FFFFFF" />
        <ellipse cx="40" cy="42" rx="4.5" ry="3" fill="#263238" />
        <path d="M 37 46 Q 40 49 43 46" stroke="#263238" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <circle cx="18" cy="44" r="4.5" fill="#FF80AB" opacity="0.6" />
        <circle cx="62" cy="44" r="4.5" fill="#FF80AB" opacity="0.6" />

        {/* Safari Explorer Pith Helmet (Hat) */}
        <ellipse cx="40" cy="18" rx="28" ry="7" fill="#FFE082" stroke="#FFB300" strokeWidth="2" />
        <path d="M 22 18 C 22 4 58 4 58 18 Z" fill="#FFD54F" stroke="#FFB300" strokeWidth="2" />
        <rect x="22" y="14" width="36" height="4" fill="#8D6E63" />
        <circle cx="40" cy="8" r="3" fill="#FFB300" />

        {/* Arms & Hands */}
        {/* Left Arm waving with friendship */}
        <path d="M 16 68 Q 2 52 10 42 Q 20 44 22 60" fill="#263238" />
        <circle cx="8" cy="42" r="5" fill="#263238" />
        {/* Right Arm holding Explorer Compass */}
        <path d="M 62 68 Q 72 80 64 88 Q 54 86 52 72" fill="#263238" />

        {/* Golden Explorer Compass */}
        <g transform="translate(62, 88)">
          <circle cx="0" cy="0" r="10" fill="#FFD54F" stroke="#FFA000" strokeWidth="2" filter="url(#fireflyGlow)" />
          <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
          <polygon points="0,-6 2,0 0,6 -2,0" fill="#E53935" />
          <polygon points="0,6 2,0 0,-6 -2,0" fill="#1E88E5" />
          <circle cx="0" cy="0" r="1.5" fill="#FFA000" />
        </g>
      </g>

      {/* 7. Magical Floating Fireflies / Forest Wisps */}
      <g>
        <circle cx="220" cy="230" r="4" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        <circle cx="310" cy="180" r="3" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        <circle cx="480" cy="220" r="4.5" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        <circle cx="560" cy="280" r="3.5" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        <circle cx="700" cy="310" r="4" fill="#FFF9C4" filter="url(#fireflyGlow)" />
        <circle cx="120" cy="320" r="3.5" fill="#FFF9C4" filter="url(#fireflyGlow)" />
      </g>

      {/* Friendly Forest Flowers */}
      <g>
        {/* Flower 1 */}
        <circle cx="290" cy="410" r="6" fill="#FF4081" />
        <circle cx="290" cy="410" r="2.5" fill="#FFEB3B" />
        {/* Flower 2 */}
        <circle cx="330" cy="425" r="5" fill="#00E5FF" />
        <circle cx="330" cy="425" r="2" fill="#FFF" />
        {/* Flower 3 */}
        <circle cx="450" cy="415" r="6" fill="#FFD740" />
        <circle cx="450" cy="415" r="2.5" fill="#E91E63" />
      </g>
    </svg>
  )
}
