import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const RootLayout: React.FC = () => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('bloomi_contrast') === 'high'
  })

  const [largeFont, setLargeFont] = useState<boolean>(() => {
    return localStorage.getItem('bloomi_large_font') === 'true'
  })

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return localStorage.getItem('bloomi_reduced_motion') === 'true' || prefersReduced
  })

  useEffect(() => {
    localStorage.setItem('bloomi_contrast', highContrast ? 'high' : 'normal')
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem('bloomi_large_font', String(largeFont))
  }, [largeFont])

  useEffect(() => {
    localStorage.setItem('bloomi_reduced_motion', String(reducedMotion))
  }, [reducedMotion])

  const toggleHighContrast = () => setHighContrast((prev) => !prev)
  const toggleLargeFont = () => setLargeFont((prev) => !prev)
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev)

  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-[#FAF8F5] text-slate-800'
      } ${largeFont ? 'text-lg' : 'text-base'}`}
    >
      <Navbar
        highContrast={highContrast}
        toggleHighContrast={toggleHighContrast}
        largeFont={largeFont}
        toggleLargeFont={toggleLargeFont}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Outlet
          context={{
            highContrast,
            toggleHighContrast,
            largeFont,
            toggleLargeFont,
            reducedMotion,
            toggleReducedMotion,
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
