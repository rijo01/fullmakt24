'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Mallar', href: '/mallar' },
  { label: 'Priser', href: '/priser' },
  { label: 'Blogg', href: '/blogg' },
  { label: 'API', href: '/api-docs' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-navy-100/50">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-navy-500 rounded-xl flex items-center justify-center shadow-lg shadow-navy-500/20 group-hover:shadow-navy-500/40 transition-shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3c-1.2 0-2.4.6-3 1.5A3.5 3.5 0 004 8v9a4 4 0 004 4h8a4 4 0 004-4V8a3.5 3.5 0 00-5-3.5A3.5 3.5 0 0012 3z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-heading font-bold text-navy-500">Fullmakt</span>
              <span className="text-lg font-heading font-bold text-gold-500">24</span>
              <span className="text-[10px] text-navy-300 block -mt-1 font-body">.se</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-navy-400 hover:text-navy-600 rounded-lg hover:bg-navy-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/mina-dokument" className="px-4 py-2 text-sm font-medium text-navy-400 hover:text-navy-600 transition-colors">
              Mina dokument
            </Link>
            <Link href="/mallar" className="btn-primary text-sm !py-2.5 !px-5">
              Skapa fullmakt →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2 text-navy-400 hover:text-navy-600"
            aria-label="Meny"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              ) : (
                <>
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white">
          <nav className="section-padding py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-navy-500 rounded-xl hover:bg-navy-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-navy-100 mt-2 pt-2">
              <Link href="/mina-dokument" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-navy-400">
                Mina dokument
              </Link>
              <Link href="/mallar" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-2 text-sm">
                Skapa fullmakt →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
