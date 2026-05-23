import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { inviaEmailRingraziamento } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * Webhook Stripe.
 * Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *   URL: https://TUO-DOMINIO/api/webhook/stripe
 *   Eventi: checkout.session.completed
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !whSecret) {
    return NextResponse.json({ error: 'Webhook non configurato' }, { status: 400 })
  }

  const rawBody = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Firma webhook non valida: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { collection, preventivoId } = (session.metadata || {}) as Record<string, string>
    if (!collection || !preventivoId) {
      return NextResponse.json({ received: true, warning: 'metadata mancanti' })
    }

    const payload = await getPayload({ config })
    const updated: any = await payload.update({
      collection: collection as any,
      id: preventivoId,
      data: {
        statoPagamento: 'pagato',
        importoPagatoCent: session.amount_total || 0,
        stripePaymentIntentId: (session.payment_intent as string) || undefined,
      },
    })

    // Aggiorna anagrafica cliente (upsert) e conta preventivi
    const email = String(updated.emailCliente).toLowerCase()
    const { docs: clientiTrovati } = await payload.find({
      collection: 'clienti',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (clientiTrovati.length === 0) {
      await payload.create({
        collection: 'clienti',
        data: {
          email,
          nome: updated.nomeCliente,
          cognome: updated.cognomeCliente,
          telefono: updated.telefonoCliente,
          numPreventiviTotali: 1,
        },
      })
    } else {
      const c: any = clientiTrovati[0]
      await payload.update({
        collection: 'clienti',
        id: c.id,
        data: { numPreventiviTotali: (c.numPreventiviTotali || 0) + 1 },
      })
    }

    // Email di ringraziamento
    try {
      await inviaEmailRingraziamento({
        to: email,
        nomeCliente: updated.nomeCliente || '',
        riepilogo: updated.riepilogo || '',
        importoPagatoCent: session.amount_total || 0,
        scontoApplicato: !!updated.scontoApplicato,
      })
    } catch (err) {
      console.error('[webhook] errore invio email:', err)
    }
  }

  return NextResponse.json({ received: true })
}
