import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import {
  prezzoPreventivoTOCent,
  prezzoPreventivoLiberoCent,
  applicaSconto,
  type TipologiaTO,
} from '@/lib/prices'

/**
 * Crea un preventivo "in attesa" nel DB e apre una sessione Stripe Checkout.
 * Body: { tipo: 'tour-operator' | 'itinerario-libero', ...campi form }
 */
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('PLACEHOLDER')) {
    return NextResponse.json(
      { error: 'Pagamenti non ancora configurati. Riprova fra poco o contattaci su WhatsApp.' },
      { status: 503 },
    )
  }

  const body = await req.json()
  const { tipo, ...campi } = body
  const payload = await getPayload({ config })

  // Email cliente normalizzata
  const email = String(campi.emailCliente || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  // Conta i preventivi già pagati dal cliente (per sconto fedeltà)
  const { totalDocs: paidTO } = await payload.find({
    collection: 'preventivi-tour-operator',
    where: {
      and: [
        { emailCliente: { equals: email } },
        { statoPagamento: { equals: 'pagato' } },
      ],
    },
    limit: 0,
  })
  const { totalDocs: paidLib } = await payload.find({
    collection: 'preventivi-itinerario-libero',
    where: {
      and: [
        { emailCliente: { equals: email } },
        { statoPagamento: { equals: 'pagato' } },
      ],
    },
    limit: 0,
  })
  const preventiviGiaPagati = (paidTO || 0) + (paidLib || 0)

  // Calcolo prezzo base
  let prezzoBaseCent = 0
  let nomeProdotto = ''
  if (tipo === 'tour-operator') {
    const tipologia = campi.tipologia as TipologiaTO
    if (!tipologia) return NextResponse.json({ error: 'Tipologia mancante' }, { status: 400 })
    prezzoBaseCent = prezzoPreventivoTOCent(tipologia)
    nomeProdotto = `Preventivo Tour Operator — ${tipologia.replace('-', ' ')}`
  } else if (tipo === 'itinerario-libero') {
    prezzoBaseCent = prezzoPreventivoLiberoCent()
    nomeProdotto = 'Preventivo Itinerario Libero'
  } else {
    return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
  }

  const { finaleCent, scontoApplicato } = applicaSconto(prezzoBaseCent, preventiviGiaPagati)

  // Crea il record preventivo in "in attesa"
  const baseFields: any = {
    nomeCliente: campi.nomeCliente,
    cognomeCliente: campi.cognomeCliente,
    emailCliente: email,
    telefonoCliente: campi.telefonoCliente,
    budget: campi.budget ? Number(campi.budget) : undefined,
    tipoStruttura: campi.tipoStruttura || undefined,
    dataPartenza: campi.dataPartenza,
    dataRitorno: campi.dataRitorno,
    numAdulti: Number(campi.numAdulti || 0),
    numBambini04: Number(campi.numBambini04 || 0),
    numBambini512: Number(campi.numBambini512 || 0),
    numRagazzi1317: Number(campi.numRagazzi1317 || 0),
    note: campi.note,
    statoPagamento: 'in-attesa',
    scontoApplicato,
  }

  let collection: 'preventivi-tour-operator' | 'preventivi-itinerario-libero'
  let preventivo: any
  if (tipo === 'tour-operator') {
    collection = 'preventivi-tour-operator'
    preventivo = await payload.create({
      collection,
      data: {
        ...baseFields,
        tipologia: campi.tipologia,
        sottocategoria: campi.sottocategoria,
        luogo: campi.luogoId,
      },
    })
  } else {
    collection = 'preventivi-itinerario-libero'
    const stati = String(campi.statiInteresse || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    preventivo = await payload.create({
      collection,
      data: {
        ...baseFields,
        percorso: campi.percorso,
        statiInteresse: stati,
      },
    })
  }

  // Apri sessione Stripe Checkout
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || `${new URL(req.url).origin}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: finaleCent,
          product_data: {
            name: nomeProdotto + (scontoApplicato ? ' (sconto fedeltà 10%)' : ''),
            description: 'L\'importo del preventivo viene scontato dal prezzo finale del viaggio.',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      collection,
      preventivoId: String(preventivo.id),
      scontoApplicato: String(scontoApplicato),
    },
    success_url: `${serverUrl}/grazie?id=${preventivo.id}`,
    cancel_url: `${serverUrl}/${tipo === 'tour-operator' ? 'preventivo-tour-operator' : 'preventivo-itinerario-libero'}?cancelled=1`,
  })

  // Salva l'id sessione
  await payload.update({
    collection,
    id: preventivo.id,
    data: { stripeSessionId: session.id },
  })

  return NextResponse.json({ url: session.url })
}
