'use client'
import { useState, useRef, useEffect } from 'react'
import { STATI_CATALOGO } from '@/lib/stati-catalogo'
import { schemaPreventivoLibero, validaForm } from '@/lib/validation'
import { SectionHeader, TextField, SelectField, TextareaField, NumberStepper, useFormErrors } from '@/components/forms/fields'

export function FormPreventivoLibero() {
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { setErrors, markTouched, setSubmitted, visible } = useFormErrors()

  function valoriCorrenti() {
    if (!formRef.current) return {}
    return Object.fromEntries(new FormData(formRef.current).entries())
  }
  function revalida() {
    setErrors(validaForm(schemaPreventivoLibero, valoriCorrenti()))
  }
  function handleBlur(name: string) {
    markTouched(name)
    revalida()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setApiError(null)
    setSubmitted(true)
    const valori = valoriCorrenti()
    const errori = validaForm(schemaPreventivoLibero, valori)
    setErrors(errori)
    if (Object.keys(errori).length > 0) {
      const first = Object.keys(errori)[0]
      const el = formRef.current?.querySelector(`[name="${first}"]`) as HTMLElement | null
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tipo: 'itinerario-libero', ...valori }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore durante il pagamento')
      window.location.href = data.url
    } catch (err: any) {
      setApiError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8 space-y-9">
      {/* 1. Contatti */}
      <fieldset className="space-y-4">
        <SectionHeader n={1} title="I tuoi contatti" subtitle="Per inviarti la proposta e la conferma" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Nome" name="nomeCliente" required autoComplete="given-name" error={visible('nomeCliente')} onBlur={handleBlur} />
          <TextField label="Cognome" name="cognomeCliente" required autoComplete="family-name" error={visible('cognomeCliente')} onBlur={handleBlur} />
        </div>
        <TextField label="Email" name="emailCliente" type="email" required autoComplete="email" placeholder="nome@esempio.it" error={visible('emailCliente')} onBlur={handleBlur} />
        <TextField label="Telefono" name="telefonoCliente" type="tel" autoComplete="tel" placeholder="+39 …" hint="Facoltativo, ma utile per i dettagli del viaggio" error={visible('telefonoCliente')} onBlur={handleBlur} />
      </fieldset>

      <hr className="border-gray-100" />

      {/* 2. Itinerario */}
      <fieldset className="space-y-4">
        <SectionHeader n={2} title="Il tuo itinerario" subtitle="Raccontami il viaggio che hai in mente" />
        <TextareaField
          label="Descrivimi il percorso" name="percorso" required rows={5}
          placeholder='Es. "Viaggio in ex Jugoslavia di 10 giorni: Lubiana, Zagabria, Belgrado, Podgorica, Skopje."'
          error={visible('percorso')} onBlur={handleBlur}
        />
        <StatiMultiSelect />
      </fieldset>

      <hr className="border-gray-100" />

      {/* 3. Quando e con chi */}
      <fieldset className="space-y-4">
        <SectionHeader n={3} title="Quando e con chi" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Dal" name="dataPartenza" type="date" required error={visible('dataPartenza')} onBlur={handleBlur} />
          <TextField label="Al" name="dataRitorno" type="date" required error={visible('dataRitorno')} onBlur={handleBlur} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NumberStepper label="Adulti" name="numAdulti" defaultValue={2} min={1} />
          <NumberStepper label="0–4 anni" name="numBambini04" />
          <NumberStepper label="5–12 anni" name="numBambini512" />
          <NumberStepper label="13–17 anni" name="numRagazzi1317" />
        </div>
        {visible('numAdulti') && <p className="field-error">{visible('numAdulti')}</p>}
      </fieldset>

      <hr className="border-gray-100" />

      {/* 4. Dettagli */}
      <fieldset className="space-y-4">
        <SectionHeader n={4} title="Dettagli" subtitle="Facoltativi — aiutano a costruire la proposta" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Tipo struttura" name="tipoStruttura">
            <option value="">— Indifferente —</option>
            <option value="hotel">Hotel</option>
            <option value="residence">Residence</option>
            <option value="appartamenti">Appartamenti</option>
            <option value="campeggio">Campeggio</option>
          </SelectField>
          <TextField label="Budget indicativo (€)" name="budget" type="number" min={0} placeholder="es. 2500" error={visible('budget')} onBlur={handleBlur} />
        </div>
        <TextareaField label="Note" name="note" rows={4} placeholder="Esigenze particolari, occasioni speciali, preferenze…" />
      </fieldset>

      {apiError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {apiError}
        </div>
      )}

      <div className="pt-1">
        <button type="submit" disabled={submitting} className="btn-primary w-full text-base py-4 disabled:opacity-70 disabled:cursor-wait">
          {submitting ? 'Vado al pagamento…' : 'Prosegui al pagamento →'}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          Pagamento sicuro con Stripe · l&apos;importo è scontato dal prezzo del viaggio
        </p>
      </div>
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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = search.trim()
    ? STATI_CATALOGO
        .map((g) => ({ ...g, stati: g.stati.filter((s) => s.toLowerCase().includes(search.toLowerCase())) }))
        .filter((g) => g.stati.length > 0)
    : STATI_CATALOGO

  const toggle = (stato: string) =>
    setSelected((prev) => (prev.includes(stato) ? prev.filter((s) => s !== stato) : [...prev, stato]))

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
          onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className="field-input"
        />

        {open && (
          <div className="absolute z-50 mt-1 w-full border border-gray-200 rounded-xl bg-white shadow-card-hover max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">Nessun risultato per &ldquo;{search}&rdquo;</p>
            ) : (
              filtered.map((group) => (
                <div key={group.tipologia}>
                  <div className="sticky top-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-sand border-b border-gray-100">
                    {group.label}
                  </div>
                  {group.stati.map((stato) => (
                    <label key={stato} className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 cursor-pointer text-sm transition-colors">
                      <input
                        type="checkbox"
                        checked={selected.includes(stato)}
                        onChange={() => toggle(stato)}
                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0"
                      />
                      <span className={selected.includes(stato) ? 'text-brand font-medium' : 'text-gray-700'}>{stato}</span>
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
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-brand/10 text-brand text-xs font-medium px-2.5 py-1 rounded-full">
              {s}
              <button type="button" onClick={() => toggle(s)} className="text-brand/50 hover:text-brand ml-0.5 leading-none" aria-label={`Rimuovi ${s}`}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
