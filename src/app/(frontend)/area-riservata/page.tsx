'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AreaRiservataPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'codice'>('email')
  const [email, setEmail] = useState('')
  const [codice, setCodice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function richiediCodice(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setInfo(null); setLoading(true)
    try {
      const res = await fetch('/api/area-riservata/login', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore. Riprova.')
      setStep('codice')
      setInfo(
        data.devCodice
          ? `Modalità sviluppo — codice: ${data.devCodice}`
          : 'Se l’email è associata a dei preventivi, riceverai un codice a 6 cifre. Controlla la posta (anche lo spam).',
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function verificaCodice(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const res = await fetch('/api/area-riservata/verify', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, codice }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Codice non valido')
      router.push('/area-riservata/ordini')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand-accent/8 blur-[80px] pointer-events-none" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Clienti Si Travel</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Area riservata</h1>
          <p className="text-white/60 max-w-xl">Accedi con la tua email per vedere lo storico dei preventivi e il loro stato.</p>
        </div>
      </section>

      <section className="container-app py-14">
        <div className="max-w-md mx-auto">
          <div className="card p-6 sm:p-8">
            {/* Icona */}
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            </div>

            {step === 'email' ? (
              <form onSubmit={richiediCodice} className="space-y-4" noValidate>
                <div>
                  <h2 className="font-display font-bold text-brand-deeper text-xl mb-1">Accedi</h2>
                  <p className="text-sm text-gray-500">Ti inviamo un codice di accesso via email.</p>
                </div>
                <div>
                  <label htmlFor="email" className="field-label">Email</label>
                  <input
                    id="email" type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@esempio.it" className="field-input"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
                  {loading ? 'Invio…' : 'Inviami il codice'}
                </button>
              </form>
            ) : (
              <form onSubmit={verificaCodice} className="space-y-4" noValidate>
                <div>
                  <h2 className="font-display font-bold text-brand-deeper text-xl mb-1">Inserisci il codice</h2>
                  <p className="text-sm text-gray-500">Inviato a <strong className="text-brand-deeper">{email}</strong></p>
                </div>
                <div>
                  <label htmlFor="codice" className="field-label">Codice a 6 cifre</label>
                  <input
                    id="codice" inputMode="numeric" maxLength={6} required autoFocus
                    value={codice}
                    onChange={(e) => setCodice(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="field-input text-center text-2xl tracking-[0.5em] font-semibold"
                  />
                </div>
                <button type="submit" disabled={loading || codice.length !== 6} className="btn-primary w-full py-3.5 disabled:opacity-70">
                  {loading ? 'Verifico…' : 'Accedi'}
                </button>
                <button type="button" onClick={() => { setStep('email'); setCodice(''); setError(null); setInfo(null) }} className="w-full text-sm text-gray-500 hover:text-brand transition-colors">
                  ← Usa un’altra email
                </button>
              </form>
            )}

            {info && <p className="mt-4 text-sm text-brand bg-brand/5 border border-brand/15 rounded-xl px-4 py-3">{info}</p>}
            {error && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </p>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            L&apos;area riservata mostra i preventivi associati alla tua email.<br />Non hai ancora un preventivo?{' '}
            <a href="/preventivo-tour-operator" className="text-brand hover:underline">Richiedine uno</a>.
          </p>
        </div>
      </section>
    </>
  )
}
