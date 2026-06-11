import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generaCodice, hashCodice, OTP_TTL_MS } from '@/lib/cliente-auth'
import { inviaCodiceAccesso } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * Richiede un codice di accesso all'area riservata.
 * Body: { email }. Per non rivelare quali email sono registrate,
 * risponde sempre { ok: true } — il codice parte solo se l'email ha preventivi.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const [to, lib] = await Promise.all([
    payload.find({ collection: 'preventivi-tour-operator', where: { emailCliente: { equals: email } }, limit: 0 }),
    payload.find({ collection: 'preventivi-itinerario-libero', where: { emailCliente: { equals: email } }, limit: 0 }),
  ])
  const haPreventivi = (to.totalDocs || 0) + (lib.totalDocs || 0) > 0

  let devCodice: string | undefined
  if (haPreventivi) {
    const codice = generaCodice()
    const data = {
      otpHash: hashCodice(email, codice),
      otpScadenza: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      otpTentativi: 0,
    }
    const { docs } = await payload.find({ collection: 'clienti', where: { email: { equals: email } }, limit: 1 })
    if (docs.length > 0) {
      await payload.update({ collection: 'clienti', id: docs[0].id, data })
    } else {
      await payload.create({ collection: 'clienti', data: { email, ...data } })
    }
    try {
      await inviaCodiceAccesso({ to: email, codice })
    } catch (err) {
      console.error('[area-riservata] invio codice fallito:', err)
    }
    // In sviluppo restituiamo il codice per poter testare senza email reale.
    if (process.env.NODE_ENV !== 'production') devCodice = codice
  }

  return NextResponse.json({ ok: true, ...(devCodice ? { devCodice } : {}) })
}
