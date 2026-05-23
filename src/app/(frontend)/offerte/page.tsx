import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'

export const metadata = { title: 'Offerte' }
export const dynamic = 'force-dynamic'

export default async function OffertePage() {
  const payload = await getPayload({ config })
  const { docs: offerte } = await payload.find({
    collection: 'offerte',
    where: { attiva: { equals: true } },
    sort: 'ordine',
    limit: 50,
  })

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-accent/8 blur-[80px] pointer-events-none" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Selezione curata</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Offerte del momento
          </h1>
          <p className="text-white/60 max-w-xl leading-relaxed">
            Le proposte più interessanti della settimana. Per prezzi aggiornati e disponibilità
            contattami su WhatsApp: ogni viaggio è ricalcolato sulla tua data e sul numero di persone.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container-app py-16">
        {offerte.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="font-display text-2xl font-bold text-brand-deeper mb-2">
              Nessuna offerta al momento
            </h2>
            <p className="text-gray-500 mb-8">Torna presto — aggiorgiamo le proposte ogni settimana.</p>
            <a
              href={wa ? `https://wa.me/${wa}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Chiedi su WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerte.map((o: any) => {
              const img = typeof o.immagine === 'object' ? o.immagine : null
              const msg = encodeURIComponent(`${o.testoWhatsapp || 'Ciao Moreno!'} ${o.titolo}`)
              const waLink = wa ? `https://wa.me/${wa}?text=${msg}` : '#'

              return (
                <article key={o.id} className="card-hover group flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-brand-light overflow-hidden">
                    {img?.url ? (
                      <Image
                        src={img.url}
                        alt={img.alt || o.titolo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                        <span className="text-white/30 text-5xl">✈️</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-display font-bold text-lg text-brand-deeper mb-2 leading-snug">
                      {o.titolo}
                    </h2>
                    <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-6">
                      {o.descrizioneBreve}
                    </p>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20B858] text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chiedi su WhatsApp
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
