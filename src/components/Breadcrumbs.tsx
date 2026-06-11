'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Etichette leggibili per i segmenti noti dell'URL. */
const LABELS: Record<string, string> = {
  'chi-sono': 'Chi sono',
  'preventivo-tour-operator': 'Preventivo Tour Operator',
  'preventivo-itinerario-libero': 'Preventivo Itinerario Libero',
  offerte: 'Offerte',
  videogallery: 'Videogallery',
  grazie: 'Grazie',
  privacy: 'Privacy Policy',
  cookie: 'Cookie Policy',
  'area-riservata': 'Area riservata',
  ordini: 'I miei preventivi',
}

const PAROLE_MINUSCOLE = new Set(['e', 'ed', 'di', 'del', 'della', 'dei', 'delle', 'da', 'a', 'la', 'il', 'lo', 'e-antille'])

function prettify(seg: string): string {
  const known = LABELS[seg]
  if (known) return known
  return decodeURIComponent(seg)
    .replace(/-/g, ' ')
    .split(' ')
    .map((w, i) => (i > 0 && PAROLE_MINUSCOLE.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

export function Breadcrumbs() {
  const pathname = usePathname()
  // Niente breadcrumb sulla home
  if (!pathname || pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  const trail = segments.map((seg, i) => ({
    label: prettify(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    last: i === segments.length - 1,
  }))

  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      ...trail.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        item: `${base}${c.href}`,
      })),
    ],
  }

  return (
    <nav aria-label="Percorso" className="bg-white border-b border-gray-100">
      <div className="container-app">
        <ol className="flex items-center flex-wrap gap-1.5 py-3 text-sm">
          <li>
            <Link href="/" className="text-gray-400 hover:text-brand transition-colors inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          {trail.map((c) => (
            <li key={c.href} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {c.last ? (
                <span className="text-brand-deeper font-medium" aria-current="page">{c.label}</span>
              ) : (
                <Link href={c.href} className="text-gray-400 hover:text-brand transition-colors">{c.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  )
}
