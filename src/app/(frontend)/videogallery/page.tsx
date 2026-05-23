import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = { title: 'Videogallery' }
export const dynamic = 'force-dynamic'

export default async function VideogalleryPage() {
  const payload = await getPayload({ config })
  const { docs: luoghi } = await payload.find({
    collection: 'luoghi',
    where: { attivo: { equals: true } },
    sort: 'nome',
    limit: 100,
    depth: 1,
  })

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-accent/8 blur-[80px] pointer-events-none" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Esperienze dal vivo</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Videogallery
          </h1>
          <p className="text-white/60 max-w-xl leading-relaxed">
            Scegli una destinazione per guardare i video. Sono raccolti dai viaggi che ho
            organizzato e da quelli che mi inviano i clienti.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container-app py-16">
        {luoghi.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="font-display text-2xl font-bold text-brand-deeper mb-2">
              Galleria in allestimento
            </h2>
            <p className="text-gray-500">I video stanno arrivando — torna presto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {luoghi.map((l: any) => {
              const img = typeof l.immaginiCopertina === 'object' ? l.immaginiCopertina : null
              return (
                <Link
                  key={l.id}
                  href={`/videogallery/${l.slug}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-brand shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt || l.nome}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/80 via-brand-deeper/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display font-semibold text-white text-sm leading-tight">
                      {l.nome}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
