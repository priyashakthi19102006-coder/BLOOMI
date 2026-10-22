import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { BloomiMascot } from '../components/BloomiMascot'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-5">
      <div className="flex justify-center">
        <BloomiMascot size={80} reducedMotion />
      </div>
      <h1 className="text-3xl font-extrabold font-fredoka text-[#24483D]">
        Oops! This Path Hasn&apos;t Sprouted
      </h1>
      <p className="text-[#3D6355] max-w-md mx-auto text-sm leading-relaxed font-medium">
        It looks like this page is still growing. Let&apos;s head back to the main learning worlds!
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#24483D] text-[#FFFDF7] font-extrabold text-sm hover:bg-[#152E26] transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>Back to Learning Worlds</span>
        </Link>
      </div>
    </div>
  )
}
