import React from 'react'

export type CompanionId = 'bear' | 'bunny' | 'panda' | 'fox' | 'lion' | 'dolphin' | 'default'

interface CompanionAvatarProps {
  id: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBadge?: boolean
  selected?: boolean
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  id,
  size = 'md',
  className = '',
  showBadge = false,
  selected = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }

  // Normalize ID
  const normalized = id.toLowerCase()

  const renderGraphic = () => {
    switch (normalized) {
      case 'bear':
      case 'writing':
        // Barnaby the Carnival Bear
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="bearBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFE0B2" />
                <stop offset="100%" stopColor="#FFB74D" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bearBg)" />
            {/* Bear Ears */}
            <circle cx="22" cy="24" r="14" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
            <circle cx="22" cy="24" r="7" fill="#FFAB91" />
            <circle cx="78" cy="24" r="14" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
            <circle cx="78" cy="24" r="7" fill="#FFAB91" />
            {/* Bear Head */}
            <circle cx="50" cy="54" r="36" fill="#8D6E63" stroke="#5D4037" strokeWidth="3.5" />
            {/* Snout */}
            <ellipse cx="50" cy="62" rx="16" ry="12" fill="#D7CCC8" />
            <ellipse cx="50" cy="56" rx="7" ry="5" fill="#3E2723" />
            <path d="M 45 64 Q 50 68 55 64" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="37" cy="48" r="5" fill="#212121" />
            <circle cx="35.5" cy="46" r="1.8" fill="#FFF" />
            <circle cx="63" cy="48" r="5" fill="#212121" />
            <circle cx="61.5" cy="46" r="1.8" fill="#FFF" />
            {/* Rosy Cheeks */}
            <circle cx="28" cy="60" r="6" fill="#FF8A80" opacity="0.6" />
            <circle cx="72" cy="60" r="6" fill="#FF8A80" opacity="0.6" />
            {/* Carnival Hat */}
            <polygon points="50,6 38,24 62,24" fill="#E91E63" stroke="#C2185B" strokeWidth="2" />
            <rect x="36" y="22" width="28" height="6" rx="2" fill="#FFD54F" />
            <circle cx="50" cy="6" r="3.5" fill="#FFD54F" />
          </svg>
        )

      case 'bunny':
      case 'speaking':
      case 'dolphin': // Maps gracefully to speaking
        // Pip the Baker Bunny
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="bunnyBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#F8BBD0" />
                <stop offset="100%" stopColor="#F48FB1" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bunnyBg)" />
            {/* Bunny Long Ears */}
            <path d="M 32 40 C 14 10 24 -6 34 -6 C 42 -6 44 20 40 40 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="3" />
            <path d="M 32 34 C 24 12 28 2 34 2 C 37 2 38 18 36 34 Z" fill="#F8BBD0" />
            <path d="M 68 40 C 62 10 70 -6 80 -6 C 88 -6 86 10 76 22 L 72 40 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="3" />
            <path d="M 70 34 C 67 14 74 2 80 2 C 83 2 82 8 76 18 L 74 34 Z" fill="#F8BBD0" />
            {/* Head */}
            <circle cx="50" cy="58" r="34" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="3.5" />
            {/* Chef Hat */}
            <path d="M 38 28 Q 28 14 40 4 Q 50 -6 60 4 Q 72 14 62 28 Z" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="2" />
            <rect x="36" y="24" width="28" height="6" rx="2" fill="#FF80AB" />
            {/* Eyes */}
            <circle cx="38" cy="52" r="5" fill="#3E2723" />
            <circle cx="36.5" cy="50" r="1.8" fill="#FFF" />
            <circle cx="62" cy="52" r="5" fill="#3E2723" />
            <circle cx="60.5" cy="50" r="1.8" fill="#FFF" />
            {/* Nose & Mouth */}
            <ellipse cx="50" cy="64" rx="5" ry="4" fill="#FF80AB" />
            <path d="M 46 68 Q 50 72 54 68" stroke="#424242" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Rosy Cheeks */}
            <circle cx="30" cy="62" r="6" fill="#FF80AB" opacity="0.6" />
            <circle cx="70" cy="62" r="6" fill="#FF80AB" opacity="0.6" />
          </svg>
        )

      case 'fox':
      case 'visual':
        // Nova the Star Fox
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="foxBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#D1C4E9" />
                <stop offset="100%" stopColor="#7E57C2" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#foxBg)" />
            {/* Fox Ears */}
            <polygon points="26,42 16,10 42,28" fill="#FF7043" stroke="#E64A19" strokeWidth="2.5" />
            <polygon points="26,38 20,18 36,28" fill="#37474F" />
            <polygon points="74,42 84,10 58,28" fill="#FF7043" stroke="#E64A19" strokeWidth="2.5" />
            <polygon points="74,38 80,18 64,28" fill="#37474F" />
            {/* Head */}
            <ellipse cx="50" cy="56" rx="34" ry="28" fill="#FF7043" stroke="#E64A19" strokeWidth="3" />
            <polygon points="18,65 6,68 18,54" fill="#FFFFFF" />
            <polygon points="82,65 94,68 82,54" fill="#FFFFFF" />
            {/* Snout */}
            <polygon points="42,56 58,56 50,68" fill="#FFFFFF" />
            <circle cx="50" cy="66" r="4" fill="#212121" />
            {/* Eyes */}
            <circle cx="36" cy="48" r="4.8" fill="#212121" />
            <circle cx="34.5" cy="46" r="1.8" fill="#FFF" />
            <circle cx="64" cy="48" r="4.8" fill="#212121" />
            <circle cx="62.5" cy="46" r="1.8" fill="#FFF" />
            {/* Space Star Badge */}
            <polygon
              points="50,18 53,24 60,25 55,29 57,36 50,32 43,36 45,29 40,25 47,24"
              fill="#FFD54F"
              stroke="#FFA000"
              strokeWidth="1.5"
            />
          </svg>
        )

      case 'panda':
      case 'social':
      case 'lion': // Lion / Panda mapped to social
      default:
        // Koa the Explorer Panda
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="pandaBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#C8E6C9" />
                <stop offset="100%" stopColor="#81C784" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#pandaBg)" />
            {/* Panda Big Black Ears */}
            <circle cx="22" cy="24" r="14" fill="#263238" stroke="#102027" strokeWidth="2.5" />
            <circle cx="78" cy="24" r="14" fill="#263238" stroke="#102027" strokeWidth="2.5" />
            {/* Head */}
            <circle cx="50" cy="54" r="36" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="3.5" />
            {/* Eye Patches */}
            <ellipse cx="35" cy="50" rx="11" ry="13" fill="#263238" transform="rotate(-15, 35, 50)" />
            <ellipse cx="65" cy="50" rx="11" ry="13" fill="#263238" transform="rotate(15, 65, 50)" />
            {/* Eyes */}
            <circle cx="36" cy="49" r="4.5" fill="#FFFFFF" />
            <circle cx="37.5" cy="48" r="1.8" fill="#212121" />
            <circle cx="64" cy="49" r="4.5" fill="#FFFFFF" />
            <circle cx="62.5" cy="48" r="1.8" fill="#212121" />
            {/* Snout */}
            <ellipse cx="50" cy="62" rx="10" ry="7" fill="#FFFFFF" />
            <ellipse cx="50" cy="59" rx="6" ry="4" fill="#263238" />
            <path d="M 46 64 Q 50 68 54 64" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Explorer Pith Helmet */}
            <ellipse cx="50" cy="26" rx="34" ry="9" fill="#FFE082" stroke="#FFB300" strokeWidth="2" />
            <path d="M 28 26 C 28 8 72 8 72 26 Z" fill="#FFD54F" stroke="#FFB300" strokeWidth="2" />
            <circle cx="50" cy="14" r="3" fill="#FFB300" />
            {/* Rosy Cheeks */}
            <circle cx="24" cy="62" r="6" fill="#FF80AB" opacity="0.6" />
            <circle cx="76" cy="62" r="6" fill="#FF80AB" opacity="0.6" />
          </svg>
        )
    }
  }

  const companionNames: Record<string, string> = {
    bear: 'Barnaby (Carnival Bear)',
    writing: 'Barnaby (Carnival Bear)',
    bunny: 'Pip (Baker Bunny)',
    speaking: 'Pip (Baker Bunny)',
    dolphin: 'Pip (Baker Bunny)',
    fox: 'Nova (Star Fox)',
    visual: 'Nova (Star Fox)',
    panda: 'Koa (Explorer Panda)',
    social: 'Koa (Explorer Panda)',
    lion: 'Koa (Explorer Panda)',
    default: 'Koa (Explorer Panda)',
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-3xl transition-all ${sizeMap[size]} ${
        selected
          ? 'ring-4 ring-[#24483D] scale-105 shadow-md'
          : 'hover:scale-102'
      } ${className}`}
      title={companionNames[normalized] || 'Companion Mascot'}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-xs border-2 border-white/60">
        {renderGraphic()}
      </div>

      {showBadge && (
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#24483D] text-white text-[10px] font-extrabold shadow-xs">
          Guide
        </span>
      )}
    </div>
  )
}
