'use client'
import { useState, useRef, useEffect } from 'react'
import { STATI_CATALOGO } from '@/lib/stati-catalogo'

export function FormPreventivoLibero() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tipo: 'itinerario-libero', ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore durante il pagamento')
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-brand uppercase tracking-wide">I tuoi contatti</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Nome *</label>
            <input name="nomeCliente" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Cognome *</label>
            <input name="cognomeCliente" required className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label">Email *</label>
          <input name="emailCliente" type="email" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Telefono</label>
          <input name="telefonoCliente" type="tel" className="field-input" />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-brand uppercase tracking-wide">Il tuo itinerario</legend>
        <div>
          <label className="field-label">Descrivimi il percorso *</label>
          <textarea
            name="percorso"
            required
            rows={5}
            className="field-input"
            placeholder='Es. "Viaggio in ex Jugoslavia di 10 giorni, città da visitare: Lubiana, Zagabria, Belgrado, Podgorica, Skopje."'
          />
        </div>
        <StatiMultiSelect />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-brand uppercase tracking-wide">Quando e con chi</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Dal *</label>
            <input name="dataPartenza" type="date" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Al *</label>
            <input name="dataRitorno" type="date" required className="field-input" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="field-label">Adulti</label>
            <input name="numAdulti" type="number" defaultValue={2} min={0} className="field-input" />
          </div>
          <div>
            <label className="field-label">0–4 anni</label>
            <input name="numBambini04" type="number" defaultValue={0} min={0} className="field-input" />
          </div>
          <div>
            <label className="field-label">5–12 anni</label>
            <input name="numBambini512" type="number" defaultValue={0} min={0} className="field-input" />
          </div>
          <div>
            <label className="field-label">13–17 anni</label>
            <input name="numRagazzi1317" type="number" defaultValue={0} min={0} className="field-input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-brand uppercase tracking-wide">Dettagli</legend>
        <div>
          <label className="field-label">Tipo struttura</label>
          <select name="tipoStruttura" className="field-input">
            <option value="">— Indifferente —</option>
            <option value="hotel">Hotel</option>
            <option value="residence">Residence</option>
            <option value="appartamenti">Appartamenti</option>
            <option value="campeggio">Campeggio</option>
          </select>
        </div>
        <div>
          <label className="field-label">Budget indicativo (€)</label>
          <input name="budget" type="number" min={0} className="field-input" />
        </div>
        <div>
          <label className="field-label">Note</label>
          <textarea name="note" rows={4} className="field-input" />
        </div>
      </fieldset>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Vado al pagamento…' : 'Prosegui al pagamento'}
      </button>
      <p className="text-xs text-gray-500 text-center">
        Pagamento sicuro tramite Stripe.
      </p>
    </form>
  )
}

function StatiMultiSelect() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = search.trim()
    ? STATI_CATALOGO
        .map(g => ({ ...g, stati: g.stati.filter(s => s.toLowerCase().includes(search.toLowerCase())) }))
        .filter(g => g.stati.length > 0)
    : STATI_CATALOGO

  const toggle = (stato: string) =>
    setSelected(prev => prev.includes(stato) ? prev.filter(s => s !== stato) : [...prev, stato])

  return (
    <div>
      <div className="field-label flex items-center gap-2">
        <span>Stati / destinazioni di interesse</span>
        <span className="text-gray-400 font-normal text-xs">(opzionale)</span>
        {selected.length > 0 && (
          <span className="ml-auto bg-brand/10 text-brand text-xs font-semibold px-2 py-0.5 rounded-full">
            {selected.length} selezionati
          </span>
        )}
      </div>

      <input type="hidden" name="statiInteresse" value={selected.join(', ')} />

      <div ref={containerRef} className="relative">
        <input
          type="text"
          placeholder="Cerca un paese, regione o destinazione…"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className="field-input"
        />

        {open && (
          <div className="absolute z-50 mt-1 w-full border border-gray-200 rounded-xl bg-white shadow-card-hover max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">Nessun risultato per &ldquo;{search}&rdquo;</p>
            ) : (
              filtered.map(group => (
                <div key={group.tipologia}>
                  <div className="sticky top-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-sand border-b border-gray-100">
                    {group.label}
                  </div>
                  {group.stati.map(stato => (
                    <label
                      key={stato}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 cursor-pointer text-sm transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(stato)}
                        onChange={() => toggle(stato)}
                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0"
                      />
                      <span className={selected.includes(stato) ? 'text-brand font-medium' : 'text-gray-700'}>
                        {stato}
                      </span>
                    </label>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(s => (
            <span key={s} className="inline-flex items-center gap-1 bg-brand/10 text-brand text-xs font-medium px-2.5 py-1 rounded-full">
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="text-brand/50 hover:text-brand ml-0.5 leading-none"
                aria-label={`Rimuovi ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
