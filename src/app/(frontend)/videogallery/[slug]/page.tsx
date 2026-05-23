import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function VideogalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: luoghi } = await payload.find({
    collection: 'luoghi',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const luogo = luoghi[0]
  if (!luogo) notFound()

  const { docs: video } = await payload.find({
    collection: 'video',
    where: {
      and: [
        { luogo: { equals: luogo.id } },
        { pubblicato: { equals: true } },
      ],
    },
    sort: '-updatedAt',
    limit: 50,
    depth: 1,
  })

  return (
    <section className="container-app py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-brand mb-3">
        Video · {luogo.nome}
      </h1>
      {video.length === 0 ? (
        <p className="text-gray-500 mt-8">Nessun video pubblicato per questa destinazione.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {video.map((v: any) => (
            <article key={v.id} className="card">
              <div className="aspect-video bg-black">
                {v.tipoSorgente === 'youtube' && v.urlEsterno && (
                  <iframe
                    src={toYouTubeEmbed(v.urlEsterno)}
                    title={v.titolo}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
                {v.tipoSorgente === 'vimeo' && v.urlEsterno && (
                  <iframe
                    src={toVimeoEmbed(v.urlEsterno)}
                    title={v.titolo}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
                {v.tipoSorgente === 'upload' && typeof v.fileVideo === 'object' && v.fileVideo?.url && (
                  <video src={v.fileVideo.url} controls className="w-full h-full" />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{v.titolo}</h2>
                {v.descrizione && <p className="text-sm text-gray-600 mt-1">{v.descrizione}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function toYouTubeEmbed(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url
}
function toVimeoEmbed(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? `https://player.vimeo.com/video/${m[1]}` : url
}
