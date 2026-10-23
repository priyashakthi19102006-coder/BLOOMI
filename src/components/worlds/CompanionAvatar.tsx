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
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="100%" stopColor="#140326" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bearBg)" stroke="#ff2a85" strokeWidth="2.5" />
            {/* Bear Ears */}
            <circle cx="22" cy="24" r="14" fill="#78350f" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="22" cy="24" r="7" fill="#ff2a85" />
            <circle cx="78" cy="24" r="14" fill="#78350f" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="78" cy="24" r="7" fill="#ff2a85" />
            {/* Bear Head */}
            <circle cx="50" cy="54" r="36" fill="#78350f" stroke="#b45309" strokeWidth="3" />
            {/* Snout */}
            <ellipse cx="50" cy="62" rx="16" ry="12" fill="#fef3c7" />
            <ellipse cx="50" cy="56" rx="7" ry="5" fill="#180424" />
            <path d="M 45 64 Q 50 68 55 64" stroke="#180424" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="37" cy="48" r="5" fill="#180424" />
            <circle cx="35.5" cy="46" r="1.8" fill="#FFF" />
            <circle cx="63" cy="48" r="5" fill="#180424" />
            <circle cx="61.5" cy="46" r="1.8" fill="#FFF" />
            {/* Mini Top Hat */}
            <rect x="40" y="8" width="20" height="15" rx="2" fill="#1e0b3b" stroke="#a855f7" strokeWidth="1.5" />
            <rect x="34" y="21" width="32" height="4" rx="2" fill="#ff2a85" />
          </svg>
        )

      case 'bunny':
      case 'speaking':
      case 'dolphin':
        // Pip the Baker Bunny
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="bunnyBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#4a044e" />
                <stop offset="100%" stopColor="#1a021f" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bunnyBg)" stroke="#ff007f" strokeWidth="2.5" />
            {/* Bunny Ears */}
            <ellipse cx="36" cy="22" rx="9" ry="24" fill="#FFFFFF" stroke="#c084fc" strokeWidth="2" transform="rotate(-8 36 22)" />
            <ellipse cx="36" cy="22" rx="4.5" ry="18" fill="#ff2a85" transform="rotate(-8 36 22)" />
            <ellipse cx="64" cy="22" rx="9" ry="24" fill="#FFFFFF" stroke="#c084fc" strokeWidth="2" transform="rotate(8 64 22)" />
            <ellipse cx="64" cy="22" rx="4.5" ry="18" fill="#ff2a85" transform="rotate(8 64 22)" />
            {/* Chef Toque Hat */}
            <ellipse cx="50" cy="36" rx="18" ry="8" fill="#FFFFFF" stroke="#ff2a85" strokeWidth="1.5" />
            <path d="M 36 36 Q 32 18 50 16 Q 68 18 64 36 Z" fill="#FFFFFF" stroke="#ff2a85" strokeWidth="1.5" />
            {/* Bunny Head */}
            <circle cx="50" cy="60" r="32" fill="#FFFFFF" stroke="#c084fc" strokeWidth="2.5" />
            {/* Snout */}
            <ellipse cx="50" cy="68" rx="14" ry="10" fill="#fdf4ff" />
            <polygon points="46,64 54,64 50,68" fill="#ff2a85" />
            <path d="M 44 71 Q 50 76 56 71" stroke="#180424" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="38" cy="54" r="5" fill="#180424" />
            <circle cx="36.5" cy="52" r="1.8" fill="#FFF" />
            <circle cx="62" cy="54" r="5" fill="#180424" />
            <circle cx="60.5" cy="52" r="1.8" fill="#FFF" />
          </svg>
        )

      case 'fox':
      case 'visual':
        // Nova the Star Fox
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="foxBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#031320" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#foxBg)" stroke="#00f5ff" strokeWidth="2.5" />
            {/* Fox Ears */}
            <polygon points="18,32 32,8 44,36" fill="#ea580c" stroke="#ff2a85" strokeWidth="2" />
            <polygon points="22,30 32,14 40,32" fill="#FFFFFF" />
            <polygon points="82,32 68,8 56,36" fill="#ea580c" stroke="#ff2a85" strokeWidth="2" />
            <polygon points="78,30 68,14 60,32" fill="#FFFFFF" />
            {/* Fox Head */}
            <circle cx="50" cy="54" r="32" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
            {/* White Fur Mask */}
            <polygon points="24,56 50,78 18,72" fill="#FFFFFF" />
            <polygon points="76,56 50,78 82,72" fill="#FFFFFF" />
            {/* Snout */}
            <polygon points="46,66 54,66 50,71" fill="#180424" />
            <path d="M 45 74 Q 50 78 55 74" stroke="#180424" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="36" cy="48" r="4.5" fill="#180424" />
            <circle cx="35" cy="46.5" r="1.8" fill="#00f5ff" />
            <circle cx="64" cy="48" r="4.5" fill="#180424" />
            <circle cx="63" cy="46.5" r="1.8" fill="#00f5ff" />
            {/* Astronaut Visor Glint */}
            <ellipse cx="50" cy="50" rx="42" ry="42" fill="none" stroke="#00f5ff" strokeWidth="2" opacity="0.6" />
          </svg>
        )

      case 'panda':
      case 'social':
      case 'lion':
      default:
        // Koa the Explorer Panda
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="pandaBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="100%" stopColor="#0d031c" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#pandaBg)" stroke="#a855f7" strokeWidth="2.5" />
            {/* Panda Ears */}
            <circle cx="22" cy="26" r="14" fill="#180424" stroke="#ff2a85" strokeWidth="2" />
            <circle cx="78" cy="26" r="14" fill="#180424" stroke="#ff2a85" strokeWidth="2" />
            {/* Head */}
            <circle cx="50" cy="54" r="34" fill="#FFFFFF" stroke="#a855f7" strokeWidth="2.5" />
            {/* Eye Patches */}
            <ellipse cx="36" cy="48" rx="10" ry="13" fill="#180424" transform="rotate(-15 36 48)" />
            <circle cx="37" cy="48" r="3.5" fill="#FFFFFF" />
            <circle cx="38" cy="47" r="1.5" fill="#00f5ff" />
            <ellipse cx="64" cy="48" rx="10" ry="13" fill="#180424" transform="rotate(15 64 48)" />
            <circle cx="63" cy="48" r="3.5" fill="#FFFFFF" />
            <circle cx="62" cy="47" r="1.5" fill="#00f5ff" />
            {/* Snout */}
            <ellipse cx="50" cy="62" rx="11" ry="8" fill="#fdf4ff" />
            <polygon points="46,59 54,59 50,63" fill="#180424" />
            <path d="M 45 65 Q 50 69 55 65" stroke="#180424" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Explorer Scarf */}
            <path d="M 32 80 Q 50 90 68 80 L 72 92 Q 50 98 28 92 Z" fill="#ff2a85" stroke="#ff007f" strokeWidth="1.5" />
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
          ? 'ring-4 ring-[#ff2a85] scale-105 shadow-[0_0_25px_rgba(255,42,133,0.7)]'
          : 'hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
      } ${className}`}
      title={companionNames[normalized] || 'Companion Mascot'}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#ff2a85]/40 shadow-[0_0_15px_rgba(255,42,133,0.3)] bg-[#0e0520]">
        {renderGraphic()}
      </div>

      {showBadge && (
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#ff2a85] text-white text-[10px] font-extrabold border border-white/30 shadow-[0_0_10px_rgba(255,42,133,0.8)]">
          Guide
        </span>
      )}
    </div>
  )
}
