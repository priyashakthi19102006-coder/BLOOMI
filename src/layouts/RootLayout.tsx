import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export interface AccessibilityContextType {
  highContrast: boolean
  toggleHighContrast: () => void
  largeFont: boolean
  toggleLargeFont: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

export const RootLayout: React.FC = () => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('bloomi_contrast') === 'high'
  })

  const [largeFont, setLargeFont] = useState<boolean>(() => {
    return localStorage.getItem('bloomi_large_font') === 'true'
  })

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return localStorage.getItem('bloomi_reduced_motion') === 'true' || prefersReduced
  })

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('bloomi_sound_enabled') !== 'false'
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

  useEffect(() => {
    localStorage.setItem('bloomi_sound_enabled', String(soundEnabled))
  }, [soundEnabled])

  const toggleHighContrast = () => setHighContrast((prev) => !prev)
  const toggleLargeFont = () => setLargeFont((prev) => !prev)
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev)
  const toggleSound = () => setSoundEnabled((prev) => !prev)

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-[#E8DEFF] selection:text-[#24483D] ${
        highContrast
          ? 'high-contrast bg-[#0C1210] text-[#FFFDF7]'
          : 'bg-[#FFFDF7] text-[#24483D]'
      } ${reducedMotion ? 'reduced-motion' : ''} ${largeFont ? 'text-lg leading-relaxed' : 'text-base'}`}
    >
      {/* Skip to Main Content Link for screen reader & keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2.5 rounded-xl bg-[#24483D] text-[#FFFDF7] font-semibold text-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-[#CDEFE0]"
      >
        Skip to main content
      </a>

      <Navbar
        highContrast={highContrast}
        toggleHighContrast={toggleHighContrast}
        largeFont={largeFont}
        toggleLargeFont={toggleLargeFont}
      />

      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
        tabIndex={-1}
      >
        <Outlet
          context={{
            highContrast,
            toggleHighContrast,
            largeFont,
            toggleLargeFont,
            reducedMotion,
            toggleReducedMotion,
            soundEnabled,
            toggleSound,
          }}
        />
      </main>

      <Footer highContrast={highContrast} />
    </div>
  )
}
