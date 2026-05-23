'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const navItems = [
  { href: '/chi-sono', label: 'Chi sono' },
  { href: '/preventivo-tour-operator', label: 'Tour Operator' },
  { href: '/preventivo-itinerario-libero', label: 'Itinerario Libero' },
  { href: '/offerte', label: 'Offerte' },
  { href: '/videogallery', label: 'Videogallery' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const waLink = wa ? `https://wa.me/${wa}` : '#'

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container-app flex items-center justify-between py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.jpeg"
              alt="Si Travel Perugia"
              width={40}
              height={40}
              className="rounded-xl object-contain"
              priority
            />
            <div className="leading-none hidden sm:block">
              <span className="text-lg font-bold text-brand font-display block">Si Travel</span>
              <span className="text-[11px] text-gray-400 tracking-wide">Perugia</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-brand hover:bg-brand/5 rounded-lg transition-all duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: WhatsApp + hamburger */}
          <div className="flex items-center gap-3">
            {wa && wa !== '39000000000' && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20B858] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5"
              >
                <WaIcon className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Apri menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-deeper/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <Image src="/logo.jpeg" alt="Si Travel Perugia" width={32} height={32} className="rounded-lg object-contain" />
                <span className="font-display font-bold text-brand text-lg">Si Travel</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Chiudi menu"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {[{ href: '/', label: 'Home' }, ...navItems].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-brand hover:bg-brand/5 rounded-xl transition-colors font-medium text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {wa && wa !== '39000000000' && (
              <div className="p-4 border-t border-gray-100">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20B858] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  <WaIcon className="w-5 h-5" />
                  Scrivimi su WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
