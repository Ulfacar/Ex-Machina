'use client'

import './landing.css'
import { useEffect } from 'react'
import Lenis from 'lenis'
import {
  Navbar,
  Hero,
  Problem,
  HowItWorks,
  LiveDemo,
  WizardPreview,
  ROICalculator,
  Features,
  CaseStudy,
  Pricing,
  Roadmap,
  FAQ,
  CTABanner,
  Footer,
  useReveal,
} from '@/components/landing-v2'

export default function LandingPage() {
  useReveal()

  // Lenis smooth scroll (Dropbox-style buttery inertia)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      lerp: 0.09,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Smooth anchor scrolling
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const el = document.querySelector(href)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.5 })
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <LiveDemo />
        <WizardPreview />
        <ROICalculator />
        <Features />
        <CaseStudy />
        <Pricing />
        <Roadmap />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
