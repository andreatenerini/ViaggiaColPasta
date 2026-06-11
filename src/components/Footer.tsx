import Link from 'next/link'

export function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <footer className="bg-brand-deeper text-white mt-24">
      {/* Main footer */}
      <div className="container-app pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="inline-flex bg-white rounded-xl px-4 py-2.5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-perugia.png" alt="SiTravel Perugia" className="h-9 w-auto object-contain" />
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-4">
              Travel Designer. Preventivi personalizzati per viaggi di lungo raggio,
              crociere, itinerari liberi e pacchetti su misura.
            </p>
            <div className="text-white/40 text-xs space-y-1 mb-5">
              <p>Moreno Maitini · P.IVA 03837370547</p>
              <p>Via R. Greco 4 · 06135 Ponte San Giovanni (PG)</p>
            </div>
            {wa && wa !== '39000000000' && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#4ADE80] text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +39 342 343 1817
              </a>
            )}
          </div>

          {/* Navigazione */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">
              Navigazione
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/chi-sono', label: 'Chi sono' },
                { href: '/preventivo-tour-operator', label: 'Preventivo Tour Operator' },
                { href: '/preventivo-itinerario-libero', label: 'Itinerario Libero' },
                { href: '/offerte', label: 'Offerte' },
                { href: '/videogallery', label: 'Videogallery' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">
              Contatti
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-white/40 text-xs block mb-0.5">Email</span>
                <a
                  href="mailto:moreno.maitini@sitravelperugia.it"
                  className="text-white/70 hover:text-brand-accent transition-colors break-all"
                >
                  moreno.maitini@sitravelperugia.it
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block mb-0.5">Telefono / WhatsApp</span>
                <a
                  href={wa && wa !== '39000000000' ? `https://wa.me/${wa}` : 'tel:+393423431817'}
                  className="text-white/70 hover:text-brand-accent transition-colors"
                >
                  +39 342 343 1817
                </a>
              </li>
              <li className="pt-2">
                <span className="text-white/40 text-xs block mb-2">Seguimi</span>
                <div className="flex gap-3">
                  {[
                    { href: 'https://www.instagram.com/viaggiacolpasta/', label: 'Instagram', icon: 'IG' },
                    { href: 'https://www.facebook.com/profile.php?id=100088273813196', label: 'Facebook', icon: 'FB' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-accent/20 hover:text-brand-accent flex items-center justify-center text-white/60 text-xs font-bold transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-app py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Moreno Maitini · Si Travel Perugia · P.IVA 03837370547</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
