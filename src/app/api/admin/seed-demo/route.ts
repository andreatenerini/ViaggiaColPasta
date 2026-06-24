import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Il seed scarica immagini + 4 video da URL remoti: alza il limite della
// function serverless (max consentito dal piano) per evitare il timeout.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

/**
 * Popola il sito con contenuti DEMO realistici (tema viaggiacolpasta.it):
 * Media + Luoghi con copertina + Offerte + Video, così videogallery e
 * offerte appaiono "piene" durante il controllo visivo.
 *
 * Le immagini sono royalty-free (Unsplash) a tema delle destinazioni reali:
 * vanno sostituite con le foto/video reali di Moreno in produzione.
 * I video YouTube sono placeholder dimostrativi.
 *
 * Uso: GET /api/admin/seed-demo?secret=<PAYLOAD_SECRET>
 */

type SeedLuogo = {
  nome: string
  slug: string
  tipologia: 'lungo-raggio' | 'medio-raggio' | 'italia-mare' | 'crociere'
  sottocategoria?: string
  immagineUrl: string
}

type SeedOfferta = {
  titolo: string
  descrizioneBreve: string
  immagineUrl: string
  ordine: number
}

type SeedVideo = {
  titolo: string
  luogoSlug: string
  mp4Url: string
  descrizione: string
}

// Titoli dei vecchi video demo YouTube da rimuovere (rimpiazzati dai mp4 reali)
const VIDEO_DA_RIMUOVERE = [
  'Maldive — Snorkeling e atolli',
  'Maldive — Pranzo in spiaggia',
  'Seychelles — Tra le isole',
  'Vietnam — Baia di Ha Long',
]

// Immagini stock royalty-free (Unsplash) — placeholder per destinazioni non viaggiacolpasta
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`

// Foto reali di Moreno (viaggiacolpasta.it) — disponibili solo per Maldive e Seychelles
const VCP = (path: string) => `https://www.viaggiacolpasta.it/wp-content/uploads/${path}`
const IMG_MALDIVE = VCP('2023/08/maldive-hp.jpg')
const IMG_SEYCHELLES = VCP('2023/08/seychelles-hp.jpg')

const LUOGHI: SeedLuogo[] = [
  { nome: 'Maldive', slug: 'maldive', tipologia: 'lungo-raggio', sottocategoria: 'Oceano Indiano', immagineUrl: IMG_MALDIVE },
  { nome: 'Seychelles', slug: 'seychelles', tipologia: 'lungo-raggio', sottocategoria: 'Oceano Indiano', immagineUrl: IMG_SEYCHELLES },
  { nome: 'Vietnam', slug: 'vietnam', tipologia: 'lungo-raggio', sottocategoria: 'Sud-Est Asiatico', immagineUrl: U('1528127269322-539801943592') },
  { nome: 'Caraibi e Antille', slug: 'caraibi-e-antille', tipologia: 'crociere', immagineUrl: U('1505881502353-a1986add3762') },
  { nome: 'Liguria', slug: 'liguria', tipologia: 'italia-mare', immagineUrl: U('1516483638261-f4dbaf036963') },
]

const OFFERTE: SeedOfferta[] = [
  { titolo: 'Maldive — Pensione completa tra gli atolli', descrizioneBreve: 'Soggiorno in guesthouse con gestione italiana: snorkeling, escursioni in barca, pranzi in spiaggia e pesca al tramonto. Mare cristallino e tradizioni locali.', immagineUrl: IMG_MALDIVE, ordine: 1 },
  { titolo: 'Seychelles — Natura incontaminata', descrizioneBreve: 'Spiagge da cartolina, granito rosa e foresta tropicale. Un itinerario tra le isole più belle dell’Oceano Indiano, con un occhio alla sostenibilità.', immagineUrl: IMG_SEYCHELLES, ordine: 2 },
  { titolo: 'Crociera Caraibi e Antille', descrizioneBreve: 'Antille e mar dei Caraibi in crociera: isole diverse ogni giorno, spiagge bianche e relax a bordo. Esperienza basata su 22 crociere realizzate.', immagineUrl: U('1505881502353-a1986add3762'), ordine: 3 },
  { titolo: 'Vietnam — Cultura e sapori', descrizioneBreve: 'Dalla baia di Ha Long ai mercati di Hanoi: un viaggio tra paesaggi, storia e cucina del Sud-Est asiatico, costruito su misura sulle tue date.', immagineUrl: U('1528127269322-539801943592'), ordine: 4 },
]

// Video reali di Moreno (mp4 self-hosted su viaggiacolpasta.it) — clip leggere.
const VIDEO: SeedVideo[] = [
  { titolo: 'Maldive — Cucina in barca', luogoSlug: 'maldive', mp4Url: 'https://www.viaggiacolpasta.it/wp-content/uploads/2022/08/maldive-video-cucina-in-barca.mp4', descrizione: 'La cucina italiana direttamente a bordo, tra un’escursione e l’altra.' },
  { titolo: 'Maldive — Snorkeling', luogoSlug: 'maldive', mp4Url: 'https://www.viaggiacolpasta.it/wp-content/uploads/2022/10/VID-20221025-WA0013.mp4', descrizione: 'Lo snorkeling maldiviano è diverso: la barriera è a pochi metri dalla riva.' },
  { titolo: 'Maldive — Tra gli atolli', luogoSlug: 'maldive', mp4Url: 'https://www.viaggiacolpasta.it/wp-content/uploads/2022/10/VID-20221025-WA0015.mp4', descrizione: 'Escursione tra gli atolli e le isole dell’arcipelago.' },
  { titolo: 'Maldive — Spiaggia e mare', luogoSlug: 'maldive', mp4Url: 'https://www.viaggiacolpasta.it/wp-content/uploads/2022/10/VID-20221025-WA0016.mp4', descrizione: 'Acque cristalline e sabbia bianca delle Maldive.' },
]

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function fetchImage(url: string, fallbackSeed: number) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1000) throw new Error('immagine vuota')
    return { data: buf, mimetype: res.headers.get('content-type') || 'image/jpeg', size: buf.length }
  } catch {
    const res = await fetch(`https://picsum.photos/seed/sitravel${fallbackSeed}/1600/1000`, {
      signal: AbortSignal.timeout(20000),
    })
    const buf = Buffer.from(await res.arrayBuffer())
    return { data: buf, mimetype: 'image/jpeg', size: buf.length }
  }
}

export async function GET(req: NextRequest) {
  // In produzione richiede il PAYLOAD_SECRET; in sviluppo è libero (seed demo locale).
  const isDev = process.env.NODE_ENV !== 'production'
  const secret = req.nextUrl.searchParams.get('secret')
  if (!isDev && (!secret || secret !== process.env.PAYLOAD_SECRET)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const report = { media: 0, luoghi: 0, offerte: 0, video: 0, preventivi: 0, removed: 0, skipped: [] as string[], errors: [] as string[] }

  // Modalità reset: svuota i contenuti demo prima di riseminare (?reset=1).
  // Cancella SOLO le collection di contenuto demo, mai utenti/preventivi/clienti.
  if (req.nextUrl.searchParams.get('reset') === '1') {
    for (const collection of ['video', 'preventivi-tour-operator', 'preventivi-itinerario-libero', 'clienti', 'offerte', 'luoghi', 'media'] as const) {
      try {
        const { docs } = await payload.find({ collection, limit: 500, depth: 0 })
        for (const d of docs) {
          await payload.delete({ collection, id: d.id })
          report.removed++
        }
      } catch (err: any) {
        report.errors.push(`reset ${collection}: ${err.message}`)
      }
    }
  }

  // Cache immagini per URL così non scarichiamo due volte la stessa
  const mediaCache = new Map<string, number>()
  let seedCounter = 0

  async function ensureMedia(url: string, alt: string): Promise<number | null> {
    if (mediaCache.has(url)) return mediaCache.get(url)!
    try {
      const ext = url.includes('picsum') ? 'jpg' : 'jpg'
      const name = `demo-${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${++seedCounter}.${ext}`
      const file = await fetchImage(url, seedCounter)
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { ...file, name },
      })
      report.media++
      mediaCache.set(url, doc.id as number)
      return doc.id as number
    } catch (err: any) {
      report.errors.push(`media ${alt}: ${err.message}`)
      return null
    }
  }

  // 1) LUOGHI con immagine di copertina
  const luogoIdBySlug = new Map<string, number>()
  for (const l of LUOGHI) {
    try {
      const { docs } = await payload.find({ collection: 'luoghi', where: { slug: { equals: l.slug } }, limit: 1 })
      if (docs.length > 0) {
        luogoIdBySlug.set(l.slug, docs[0].id as number)
        report.skipped.push(`luogo ${l.slug}`)
        continue
      }
      const mediaId = await ensureMedia(l.immagineUrl, `${l.nome} copertina`)
      const doc = await payload.create({
        collection: 'luoghi',
        data: {
          nome: l.nome,
          slug: l.slug,
          tipologia: l.tipologia,
          sottocategoria: l.sottocategoria,
          attivo: true,
          ...(mediaId ? { immaginiCopertina: mediaId } : {}),
        },
      })
      luogoIdBySlug.set(l.slug, doc.id as number)
      report.luoghi++
    } catch (err: any) {
      report.errors.push(`luogo ${l.slug}: ${err.message}`)
    }
  }

  // 2) OFFERTE con immagine
  for (const o of OFFERTE) {
    try {
      const { docs } = await payload.find({ collection: 'offerte', where: { titolo: { equals: o.titolo } }, limit: 1 })
      if (docs.length > 0) {
        report.skipped.push(`offerta ${o.titolo}`)
        continue
      }
      const mediaId = await ensureMedia(o.immagineUrl, o.titolo)
      if (!mediaId) {
        report.errors.push(`offerta ${o.titolo}: immagine mancante`)
        continue
      }
      await payload.create({
        collection: 'offerte',
        data: {
          titolo: o.titolo,
          descrizioneBreve: o.descrizioneBreve,
          immagine: mediaId,
          attiva: true,
          ordine: o.ordine,
        },
      })
      report.offerte++
    } catch (err: any) {
      report.errors.push(`offerta ${o.titolo}: ${err.message}`)
    }
  }

  // 3a) Rimuovi i vecchi video demo YouTube (sostituiti dai mp4 reali)
  for (const titolo of VIDEO_DA_RIMUOVERE) {
    try {
      const { docs } = await payload.find({ collection: 'video', where: { titolo: { equals: titolo } }, limit: 10 })
      for (const d of docs) {
        await payload.delete({ collection: 'video', id: d.id })
        report.removed++
      }
    } catch (err: any) {
      report.errors.push(`rimozione video ${titolo}: ${err.message}`)
    }
  }

  // 3b) VIDEO reali (mp4 self-hosted viaggiacolpasta) caricati come upload
  for (const v of VIDEO) {
    try {
      const luogoId = luogoIdBySlug.get(v.luogoSlug)
      if (!luogoId) {
        report.errors.push(`video ${v.titolo}: luogo ${v.luogoSlug} non trovato`)
        continue
      }
      const { docs } = await payload.find({ collection: 'video', where: { titolo: { equals: v.titolo } }, limit: 1 })
      if (docs.length > 0) {
        report.skipped.push(`video ${v.titolo}`)
        continue
      }

      // scarica l'mp4 e crea il media
      let mediaId: number
      try {
        const res = await fetch(v.mp4Url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(90000),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        const name = `video-${v.titolo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.mp4`
        const doc = await payload.create({
          collection: 'media',
          data: { alt: v.titolo },
          file: { data: buf, mimetype: 'video/mp4', size: buf.length, name },
        })
        mediaId = doc.id as number
        report.media++
      } catch (err: any) {
        report.errors.push(`video media ${v.titolo}: ${err.message}`)
        continue
      }

      await payload.create({
        collection: 'video',
        data: {
          titolo: v.titolo,
          luogo: luogoId,
          tipoSorgente: 'upload',
          fileVideo: mediaId,
          descrizione: v.descrizione,
          pubblicato: true,
        },
      })
      report.video++
    } catch (err: any) {
      report.errors.push(`video ${v.titolo}: ${err.message}`)
    }
  }

  // 4) PREVENTIVI demo (per testare l'area riservata) — email di esempio
  const EMAIL_DEMO = 'mario.rossi@example.com'
  const PREVENTIVI_TO_DEMO = [
    { luogoSlug: 'maldive', tipologia: 'lungo-raggio', stato: 'pagato', importoCent: 5000, dp: '2026-07-10', dr: '2026-07-20' },
    { luogoSlug: 'seychelles', tipologia: 'lungo-raggio', stato: 'pagato', importoCent: 5000, dp: '2026-09-05', dr: '2026-09-15' },
    { luogoSlug: 'vietnam', tipologia: 'lungo-raggio', stato: 'in-attesa', importoCent: 0, dp: '2026-11-01', dr: '2026-11-14' },
  ]
  let pagatiDemo = 0
  for (const pv of PREVENTIVI_TO_DEMO) {
    try {
      const luogoId = luogoIdBySlug.get(pv.luogoSlug)
      if (!luogoId) continue
      await payload.create({
        collection: 'preventivi-tour-operator',
        data: {
          nomeCliente: 'Mario', cognomeCliente: 'Rossi', emailCliente: EMAIL_DEMO, telefonoCliente: '+39 333 1234567',
          tipologia: pv.tipologia as any, luogo: luogoId,
          dataPartenza: pv.dp, dataRitorno: pv.dr, numAdulti: 2,
          statoPagamento: pv.stato as any,
          importoPagatoCent: pv.importoCent || undefined,
        },
      })
      if (pv.stato === 'pagato') pagatiDemo++
      report.preventivi++
    } catch (err: any) {
      report.errors.push(`preventivo ${pv.luogoSlug}: ${err.message}`)
    }
  }
  try {
    await payload.create({
      collection: 'preventivi-itinerario-libero',
      data: {
        nomeCliente: 'Mario', cognomeCliente: 'Rossi', emailCliente: EMAIL_DEMO, telefonoCliente: '+39 333 1234567',
        percorso: 'Giro dei Balcani in 12 giorni: Lubiana, Zagabria, Sarajevo, Kotor, Belgrado.',
        dataPartenza: '2027-05-02', dataRitorno: '2027-05-14', numAdulti: 2,
        statoPagamento: 'pagato', importoPagatoCent: 5000,
      },
    })
    pagatiDemo++
    report.preventivi++
  } catch (err: any) {
    report.errors.push(`preventivo libero: ${err.message}`)
  }
  // Anagrafica cliente demo
  try {
    const { docs } = await payload.find({ collection: 'clienti', where: { email: { equals: EMAIL_DEMO } }, limit: 1 })
    if (docs.length === 0) {
      await payload.create({
        collection: 'clienti',
        data: { email: EMAIL_DEMO, nome: 'Mario', cognome: 'Rossi', telefono: '+39 333 1234567', numPreventiviTotali: pagatiDemo },
      })
    }
  } catch (err: any) {
    report.errors.push(`cliente demo: ${err.message}`)
  }

  return NextResponse.json({ ok: true, ...report })
}
