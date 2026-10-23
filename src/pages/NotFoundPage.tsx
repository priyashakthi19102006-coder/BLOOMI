import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { BloomiMascot } from '../components/BloomiMascot'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20 space-y-6">
      <div className="flex justify-center">
        <BloomiMascot size={90} reducedMotion />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-white">
        Oops! This Cosmic Path Hasn&apos;t Opened
      </h1>
      <p className="text-purple-200/80 max-w-md mx-auto text-sm leading-relaxed font-medium">
        It looks like this destination is still hidden in the stars. Let&apos;s journey back to the main kingdom portals!
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="btn-neon-pink min-h-[48px] inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-sm"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>Return to Bloom Kingdoms</span>
        </Link>
      </div>
    </div>
  )
}
