import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-deeper min-h-[92vh] flex items-center">
        {/* Sfondo: foto reale Maldive con zoom lento cinematografico */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-maldive.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center animate-hero-zoom motion-reduce:animate-none"
          />
        </div>
        {/* Scrim per la leggibilità del testo (allineato a sinistra) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deeper/95 via-brand-deeper/70 to-brand-deeper/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/85 via-transparent to-brand-deeper/25" />

        {/* Accent glow */}
        <div className="absolute top-[-5rem] right-[-5rem] w-[28rem] h-[28rem] rounded-full bg-brand-accent/15 blur-[90px] pointer-events-none" />

        <div className="container-app relative z-10 py-24 md:py-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse-slow" />
              <span className="text-white/80 text-sm font-medium tracking-wide">
                Si Travel Perugia · Tour Operator
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.04] mb-7 text-white">
              Il tuo prossimo<br />
              <span className="text-brand-accent italic">viaggio</span>,<br />
              pensato su misura.
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Lungo raggio, mediterraneo, crociere o itinerari completamente liberi.
              Ti costruisco l&apos;esperienza che hai sempre sognato.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/preventivo-tour-operator" className="btn-accent text-base px-8 py-4">
                Richiedi un preventivo →
              </Link>
              <Link href="/chi-sono" className="btn-ghost-white text-base px-8 py-4">
                Chi sono
              </Link>
            </div>

            {/* Trust pill */}
            <div className="inline-flex items-start gap-3 bg-white/8 border border-white/15 backdrop-blur-sm rounded-2xl px-5 py-3.5 max-w-md">
              <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white/75 text-sm leading-relaxed">
                Il costo del preventivo viene{' '}
                <strong className="text-white font-semibold">scontato dal prezzo finale</strong>
                {' '}del viaggio se accetti la proposta.
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scopri</span>
          <div className="w-px h-14 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ─── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { n: '500+', label: 'Viaggi organizzati' },
              { n: '15+', label: 'Anni di esperienza' },
              { n: '98%', label: 'Clienti soddisfatti' },
              { n: '50+', label: 'Destinazioni attive' },
            ].map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-brand mb-1">{s.n}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3 SERVIZI ────────────────────────────────────────────────── */}
      <section className="container-app py-24">
        <div className="text-center mb-14">
          <span className="section-label mb-3">Cosa posso fare per te</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-deeper mt-3">
            Scegli come iniziare
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <ServiceCard
            href="/preventivo-tour-operator"
            emoji="✈️"
            title="Preventivo Tour Operator"
            description="Lungo Raggio, Medio Raggio, Italia Mare e Crociere. Scegli la destinazione dal catalogo ufficiale dei migliori tour operator."
            cta="Richiedi preventivo"
            variant="primary"
          />
          <ServiceCard
            href="/preventivo-itinerario-libero"
            emoji="🗺️"
            title="Itinerario Libero"
            description="Hai un sogno nel cassetto? Raccontamelo e costruisco il viaggio perfetto su misura per te, senza pacchetti preconfezionati."
            cta="Disegna il tuo viaggio"
            variant="featured"
          />
          <ServiceCard
            href="/offerte"
            emoji="⭐"
            title="Offerte del momento"
            description="Le proposte più interessanti del mese. Prezzi e disponibilità su richiesta via WhatsApp: ogni viaggio è personalizzato."
            cta="Vedi le offerte"
            variant="outline"
          />
        </div>
      </section>

      {/* ─── COME FUNZIONA ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-deeper py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-accent/5 blur-[100px] pointer-events-none" />

        <div className="container-app relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-accent uppercase tracking-[0.2em] text-xs font-bold block mb-3">
              Il processo
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Come funziona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <ProcessStep
              n="01"
              title="Compili il form"
              description="Mi racconti dove vuoi andare, con chi, in che periodo e il budget indicativo. Tutto online, in pochi minuti."
            />
            <ProcessStep
              n="02"
              title="Paghi il preventivo"
              description="Una piccola somma a copertura della consulenza professionale. Trasparente, una sola volta."
            />
            <ProcessStep
              n="03"
              title="Ricevi la proposta"
              description="In pochi giorni ti arriva la proposta personalizzata. Se la accetti, l'importo è scontato dal prezzo finale."
            />
          </div>
        </div>
      </section>

      {/* ─── GALLERY TEASER ───────────────────────────────────────────── */}
      <section className="container-app py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label mb-3 block">I miei viaggi</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-deeper">
              Guarda dove sono stato
            </h2>
          </div>
          <Link href="/videogallery" className="btn-outline flex-shrink-0 self-start sm:self-auto">
            Esplora la gallery →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🏖️', label: 'Mediterraneo', from: 'from-[#0077B6]', to: 'to-[#023E8A]' },
            { emoji: '🗼', label: 'Europa', from: 'from-[#1B4332]', to: 'to-[#081C15]' },
            { emoji: '🌴', label: 'Lungo Raggio', from: 'from-[#7B2D00]', to: 'to-[#3D0000]' },
            { emoji: '🚢', label: 'Crociere', from: 'from-[#0E5C7A]', to: 'to-[#052530]' },
          ].map((d) => (
            <Link
              key={d.label}
              href="/videogallery"
              className={`relative aspect-square rounded-2xl bg-gradient-to-br ${d.from} ${d.to} overflow-hidden group flex flex-col items-start justify-end p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-4 left-5 text-3xl">{d.emoji}</div>
              <span className="relative text-white font-semibold text-sm leading-tight">{d.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─────────────────────────────────────────────── */}
      <section className="container-app pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-10 md:p-16 text-center text-white">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-brand-accent/10 blur-2xl pointer-events-none" />
          <div className="relative">
            <span className="text-white/50 uppercase tracking-[0.2em] text-xs font-bold block mb-4">
              Hai una domanda?
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Scrivimi su WhatsApp
            </h2>
            <p className="text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
              Rispondo personalmente a ogni messaggio. Nessun bot, nessun call center.
              Solo Moreno, pronto ad ascoltarti.
            </p>
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20B858] text-white font-bold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Scrivimi ora
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function ServiceCard({
  href,
  emoji,
  title,
  description,
  cta,
  variant,
}: {
  href: string
  emoji: string
  title: string
  description: string
  cta: string
  variant: 'primary' | 'featured' | 'outline'
}) {
  const isFeatured = variant === 'featured'

  return (
    <Link
      href={href}
      className={[
        'group relative flex flex-col rounded-2xl p-7 transition-all duration-300 ring-1',
        isFeatured
          ? 'bg-brand-deeper text-white ring-brand hover:ring-brand-accent shadow-brand-md hover:shadow-xl hover:-translate-y-1'
          : 'bg-white text-gray-900 ring-black/5 hover:ring-brand/20 shadow-card hover:shadow-card-hover hover:-translate-y-1',
      ].join(' ')}
    >
      {isFeatured && (
        <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest bg-brand-accent/20 text-brand-accent border border-brand-accent/30 px-2.5 py-1 rounded-full">
          Personalizzato
        </span>
      )}

      <div className={[
        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6',
        isFeatured ? 'bg-white/10' : 'bg-brand-sand',
      ].join(' ')}>
        {emoji}
      </div>

      <h3 className={[
        'font-display text-xl font-bold mb-3',
        isFeatured ? 'text-white' : 'text-brand-deeper',
      ].join(' ')}>
        {title}
      </h3>

      <p className={[
        'text-sm leading-relaxed flex-1 mb-7',
        isFeatured ? 'text-white/65' : 'text-gray-500',
      ].join(' ')}>
        {description}
      </p>

      <span className={[
        'inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200',
        isFeatured
          ? 'text-brand-accent group-hover:gap-3'
          : 'text-brand group-hover:gap-3',
      ].join(' ')}>
        {cta}
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  )
}

function ProcessStep({ n, title, description }: { n: string; title: string; description: string }) {
  return (
    <div className="flex flex-col">
      <div className="font-display text-5xl font-bold text-brand-accent/30 mb-4 leading-none">
        {n}
      </div>
      <div className="w-8 h-px bg-brand-accent/40 mb-4" />
      <h3 className="text-white font-display font-bold text-xl mb-3">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
