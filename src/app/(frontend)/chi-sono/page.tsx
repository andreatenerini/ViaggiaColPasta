import Link from 'next/link'
import Image from 'next/image'

export const metadata = { title: 'Chi sono' }

export default function ChiSonoPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-deeper py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-accent/8 blur-[80px] pointer-events-none" />
        <div className="container-app relative z-10">
          <div className="max-w-2xl">
            <span className="section-label text-white/50 mb-4 block">Travel Designer</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ciao, sono<br />
              <span className="text-brand-accent">Moreno</span>.
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              Agente di viaggio e Travel Designer con sede a Perugia. La mia missione è
              rendere il turismo di qualità accessibile a tutti — senza pacchetti standard,
              senza scorciatoie, con una consulenza vera.
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { n: '22+', label: 'Crociere organizzate' },
              { n: '500+', label: 'Clienti soddisfatti' },
              { n: '142', label: 'Destinazioni attive' },
              { n: '2', label: 'Guesthouse proprie' },
            ].map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <div className="font-display text-3xl font-bold text-brand mb-1">{s.n}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BIO ──────────────────────────────────────────────────────── */}
      <section className="container-app py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Avatar / foto */}
          <div className="lg:col-span-2">
            <div className="aspect-square rounded-3xl relative overflow-hidden shadow-brand-md max-w-sm mx-auto lg:max-w-none">
              <Image
                src="/moreno.jpg"
                alt="Moreno Maitini — Travel Designer"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 24rem, 40vw"
                priority
              />
            </div>
            <div className="mt-6 card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-base">
                  📍
                </span>
                Via R. Greco 4 · Ponte San Giovanni (PG)
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-base">
                  ✉️
                </span>
                <a href="mailto:moreno.maitini@sitravelperugia.it" className="text-brand hover:text-brand-dark transition-colors break-all">
                  moreno.maitini@sitravelperugia.it
                </a>
              </div>
              {wa && wa !== '39000000000' && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#25D366] transition-colors">
                    +39 342 343 1817
                  </a>
                </div>
              )}
              {wa && wa !== '39000000000' && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20B858] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
                >
                  Scrivimi su WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-3 space-y-6 text-gray-700 leading-relaxed">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-deeper">
              Travel Designer · Perugia
            </h2>

            <p className="text-lg">
              Ho fondato la mia attività con una sfida precisa: dimostrare che il turismo
              di qualità — quello vero, fatto di esperienze autentiche e destinazioni esotiche —
              è accessibile anche alla classe media, non solo a chi ha budget illimitati.
            </p>

            <p>
              Ho organizzato oltre <strong className="text-brand-deeper">22 crociere</strong> su
              rotte internazionali, dai fiordi norvegesi ai Caraibi, dal Mediterraneo Orientale
              al Giro del Mondo. Nel tempo ho costruito rapporti diretti con le comunità locali
              alle <strong className="text-brand-deeper">Maldive</strong> e alle{' '}
              <strong className="text-brand-deeper">Seychelles</strong>, dove gestisco due
              guesthouse di proprietà per offrire esperienze fuori dai circuiti di massa.
            </p>

            <p>
              Lavoro con i principali tour operator italiani e ho accesso a un catalogo di oltre
              142 destinazioni: lungo raggio, medio raggio, crociere e destinazioni balneari in
              Italia. Ma la differenza non sta nel catalogo — sta nella consulenza personalizzata
              che costruisco intorno a te.
            </p>

            <p>
              Ogni viaggio nasce da una conversazione. Mi dici dove vuoi andare, con chi, in che
              periodo e il tuo budget. Io costruisco la proposta. Se la accetti, il costo del
              preventivo viene <strong className="text-brand-deeper">scontato dal prezzo finale
              del viaggio</strong>.
            </p>

            {/* Guesthouse highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { dest: 'Maldive', desc: 'Guesthouse di proprietà tra gli atolli — vita autentica lontano dai resort di lusso', emoji: '🌊' },
                { dest: 'Seychelles', desc: 'Guesthouse a La Digue — spiagge tra le più belle al mondo, ritmo locale', emoji: '🐢' },
              ].map(g => (
                <div key={g.dest} className="bg-brand-sand rounded-2xl p-5 border border-brand-sand-dark">
                  <div className="text-2xl mb-2">{g.emoji}</div>
                  <div className="font-display font-bold text-brand-deeper mb-1">{g.dest}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/preventivo-tour-operator" className="btn-primary">
                Richiedi un preventivo
              </Link>
              <Link href="/preventivo-itinerario-libero" className="btn-outline">
                Itinerario libero
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── APPROCCIO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="container-app relative z-10">
          <div className="text-center mb-14">
            <span className="text-brand-accent uppercase tracking-[0.2em] text-xs font-bold block mb-3">Il mio metodo</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Turismo di qualità, prezzi giusti
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🤝', title: 'Rispetto locale', desc: 'Ogni destinazione viene vissuta con rispetto per le tradizioni e le comunità locali, non come palcoscenico per turisti.' },
              { icon: '🎯', title: 'Personalizzazione totale', desc: 'Nessun pacchetto preconfezionato. Ogni viaggio è costruito intorno alle tue date, al tuo gruppo e ai tuoi desideri.' },
              { icon: '💶', title: 'Trasparenza sui costi', desc: 'Il costo della consulenza viene scontato dal prezzo del viaggio. Paghi una volta sola, per un lavoro reale.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
