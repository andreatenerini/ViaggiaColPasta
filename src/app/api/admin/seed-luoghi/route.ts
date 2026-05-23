import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { STATI_CATALOGO } from '@/lib/stati-catalogo'

/**
 * Popola la collection Luoghi con tutte le destinazioni dal catalogo xlsx.
 * Richiede il PAYLOAD_SECRET come query param per sicurezza.
 *
 * Uso: GET /api/admin/seed-luoghi?secret=<PAYLOAD_SECRET>
 * (il secret si trova in .env.local)
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const gruppo of STATI_CATALOGO) {
    for (const nome of gruppo.stati) {
      const slug = nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      try {
        const { docs } = await payload.find({
          collection: 'luoghi',
          where: { slug: { equals: slug } },
          limit: 1,
        })

        if (docs.length > 0) {
          skipped++
          continue
        }

        await payload.create({
          collection: 'luoghi',
          data: {
            nome,
            slug,
            tipologia: gruppo.tipologia,
            attivo: true,
          },
        })
        created++
      } catch (err: any) {
        errors.push(`${nome}: ${err.message}`)
      }
    }
  }

  return NextResponse.json({ ok: true, created, skipped, errors })
}
