import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verificaSessione, COOKIE_NAME } from '@/lib/cliente-auth'
import { LogoutButton } from '@/components/forms/LogoutButton'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'I miei preventivi' }

type Riga = {
  id: string | number
  tipo: 'Tour Operator' | 'Itinerario Libero'
  titolo: string
  riepilogo?: string
  dataPartenza?: string
  dataRitorno?: string
  statoPagamento?: string
  importoPagatoCent?: number
  scontoApplicato?: boolean
  createdAt?: string
}

const STATO: Record<string, { label: string; cls: string }> = {
  pagato: { label: 'Pagato', cls: 'bg-green-100 text-green-700' },
  'in-attesa': { label: 'In attesa', cls: 'bg-amber-100 text-amber-700' },
  fallito: { label: 'Fallito', cls: 'bg-red-100 text-red-700' },
  rimborsato: { label: 'Rimborsato', cls: 'bg-gray-100 text-gray-600' },
}

function fmtData(d?: string) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export default async function OrdiniPage() {
  const jar = await cookies()
  const email = verificaSessione(jar.get(COOKIE_NAME)?.value)
  if (!email) redirect('/area-riservata')

  const payload = await getPayload({ config })
  const [to, lib] = await Promise.all([
    payload.find({ collection: 'preventivi-tour-operator', where: { emailCliente: { equals: email } }, sort: '-createdAt', limit: 100, depth: 1 }),
    payload.find({ collection: 'preventivi-itinerario-libero', where: { emailCliente: { equals: email } }, sort: '-createdAt', limit: 100, depth: 0 }),
  ])

  const righe: Riga[] = [
    ...to.docs.map((d: any) => ({
      id: d.id,
      tipo: 'Tour Operator' as const,
      titolo: (typeof d.luogo === 'object' && d.luogo?.nome) || d.tipologia || 'Tour Operator',
      riepilogo: d.riepilogo,
      dataPartenza: d.dataPartenza, dataRitorno: d.dataRitorno,
      statoPagamento: d.statoPagamento, importoPagatoCent: d.importoPagatoCent,
      scontoApplicato: d.scontoApplicato, createdAt: d.createdAt,
    })),
    ...lib.docs.map((d: any) => ({
      id: d.id,
      tipo: 'Itinerario Libero' as const,
      titolo: 'Itinerario libero',
      riepilogo: (d.percorso || '').slice(0, 120),
      dataPartenza: d.dataPartenza, dataRitorno: d.dataRitorno,
      statoPagamento: d.statoPagamento, importoPagatoCent: d.importoPagatoCent,
      scontoApplicato: d.scontoApplicato, createdAt: d.createdAt,
    })),
  ].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  const pagati = righe.filter((r) => r.statoPagamento === 'pagato').length
  const totaleSpeso = righe.reduce((s, r) => s + (r.statoPagamento === 'pagato' ? r.importoPagatoCent || 0 : 0), 0)

  return (
    <section className="container-app py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <span className="section-label mb-2 block">Area riservata</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-deeper">I miei preventivi</h1>
          <p className="text-gray-500 text-sm mt-1">{email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <div className="font-display text-3xl font-bold text-brand">{righe.length}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Preventivi totali</div>
        </div>
        <div className="card p-5">
          <div className="font-display text-3xl font-bold text-brand">{pagati}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Pagati</div>
        </div>
        <div className="card p-5 col-span-2 sm:col-span-1">
          <div className="font-display text-3xl font-bold text-brand">€ {(totaleSpeso / 100).toFixed(2).replace('.', ',')}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Totale versato</div>
        </div>
      </div>

      {/* Lista */}
      {righe.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="text-5xl mb-4">🧭</div>
          <h2 className="font-display text-xl font-bold text-brand-deeper mb-2">Nessun preventivo</h2>
          <p className="text-gray-500 mb-6">Non risultano preventivi associati a questa email.</p>
          <Link href="/preventivo-tour-operator" className="btn-primary">Richiedi un preventivo</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {righe.map((r) => {
            const stato = STATO[r.statoPagamento || 'in-attesa'] || STATO['in-attesa']
            return (
              <div key={`${r.tipo}-${r.id}`} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{r.tipo}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stato.cls}`}>{stato.label}</span>
                    {r.scontoApplicato && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">Sconto 10%</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-brand-deeper truncate">{r.titolo}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {fmtData(r.dataPartenza)} → {fmtData(r.dataRitorno)} · richiesto il {fmtData(r.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display font-bold text-brand-deeper text-lg">
                    {r.importoPagatoCent ? `€ ${(r.importoPagatoCent / 100).toFixed(2).replace('.', ',')}` : '—'}
                  </div>
                  <div className="text-[11px] text-gray-400">importo preventivo</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10 flex items-start gap-3 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl px-5 py-4">
        <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        <p className="text-sm text-gray-700">
          L&apos;importo di ogni preventivo pagato viene <strong className="text-brand-deeper">scontato dal prezzo finale del viaggio</strong> se accetti la proposta di Moreno.
        </p>
      </div>
    </section>
  )
}
