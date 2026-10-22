import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-6xl" role="img" aria-label="Thinking flower">
        🌸
      </div>
      <h1 className="text-3xl font-extrabold font-fredoka text-slate-900">
        Oops! Page Not Found
      </h1>
      <p className="text-slate-600 max-w-md mx-auto text-sm">
        It looks like this path is still sprouting. Let&apos;s head back to the main learning worlds!
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  )
}
