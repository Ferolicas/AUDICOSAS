"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useModal } from './ModalContext'

const NAV_LINKS = [
  { href: '#soluciones', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#casos', label: 'Casos de Éxito' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacto', label: 'Contacto' },
  { href: '#contacto', label: 'Web + SEO' },
]

export default function Header() {
  const { setOpen } = useModal()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function handleNavClick() {
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-lg backdrop-blur-md bg-[#1B2A4A]/95'
          : 'bg-[#1B2A4A]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#inicio" onClick={handleNavClick}>
          <Image src="/logoaudico.png" alt="AUDICO S.A.S." width={160} height={43} priority />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setOpen(true)}
            className="ml-3 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer text-sm animate-pulse-glow"
          >
            Diagnóstico Gratis
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1B2A4A] border-t border-white/10 animate-fade-in">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="px-4 py-3 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2">
              <button
                onClick={() => { setOpen(true); setMobileOpen(false) }}
                className="w-full px-5 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Diagnóstico Gratis
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
