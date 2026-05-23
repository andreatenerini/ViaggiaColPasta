import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'luoghi',
      where: { attivo: { equals: true } },
      sort: 'nome',
      limit: 500,
      depth: 0,
    })
    return NextResponse.json({
      docs: docs.map((l: any) => ({
        id: l.id,
        nome: l.nome,
        tipologia: l.tipologia,
        sottocategoria: l.sottocategoria,
        slug: l.slug,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, docs: [] }, { status: 500 })
  }
}
