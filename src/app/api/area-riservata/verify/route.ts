import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verificaCodice, firmaSessione, COOKIE_NAME, SESSION_TTL_S, OTP_MAX_TENTATIVI } from '@/lib/cliente-auth'

export const dynamic = 'force-dynamic'

/** Verifica il codice OTP e, se valido, imposta il cookie di sessione cliente. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const codice = String(body.codice || '').trim()

  if (!email || !/^\d{6}$/.test(codice)) {
    return NextResponse.json({ error: 'Inserisci il codice a 6 cifre' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'clienti', where: { email: { equals: email } }, limit: 1 })
  const c = docs[0] as any

  if (!c || !c.otpHash || !c.otpScadenza) {
    return NextResponse.json({ error: 'Nessun codice attivo. Richiedine uno nuovo.' }, { status: 400 })
  }
  if (new Date(c.otpScadenza).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Codice scaduto. Richiedine uno nuovo.' }, { status: 400 })
  }
  if ((c.otpTentativi || 0) >= OTP_MAX_TENTATIVI) {
    return NextResponse.json({ error: 'Troppi tentativi. Richiedi un nuovo codice.' }, { status: 429 })
  }

  if (!verificaCodice(c.otpHash, email, codice)) {
    await payload.update({ collection: 'clienti', id: c.id, data: { otpTentativi: (c.otpTentativi || 0) + 1 } })
    return NextResponse.json({ error: 'Codice errato. Riprova.' }, { status: 400 })
  }

  // Successo: invalida il codice e apri la sessione
  await payload.update({ collection: 'clienti', id: c.id, data: { otpHash: null, otpScadenza: null, otpTentativi: 0 } })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, firmaSessione(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_S,
  })
  return res
}
