'use client'
import { useEffect, useRef, useState } from 'react'
import { schemaPreventivoTO, validaForm } from '@/lib/validation'
import { SectionHeader, TextField, SelectField, TextareaField, NumberStepper, useFormErrors } from '@/components/forms/fields'

type Luogo = { id: string; nome: string; tipologia: string; sottocategoria?: string }

const TIPOLOGIE = [
  { value: 'lungo-raggio', label: 'Lungo Raggio' },
  { value: 'medio-raggio', label: 'Medio Raggio' },
  { value: 'italia-mare', label: 'Italia Mare' },
  { value: 'crociere', label: 'Crociere' },
]

export function FormPreventivoTO() {
  const [luoghi, setLuoghi] = useState<Luogo[]>([])
  const [tipologia, setTipologia] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { setErrors, markTouched, setSubmitted, visible } = useFormErrors()

  useEffect(() => {
    fetch('/api/luoghi')
      .then((r) => r.json())
      .then((d) => setLuoghi(d.docs || []))
      .catch(() => setLuoghi([]))
  }, [])

  const luoghiFiltrati = tipologia ? luoghi.filter((l) => l.tipologia === tipologia) : luoghi

  function valoriCorrenti() {
    if (!formRef.current) return {}
    return Object.fromEntries(new FormData(formRef.current).entries())
  }
  function revalida() {
    setErrors(validaForm(schemaPreventivoTO, valoriCorrenti()))
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
    const errori = validaForm(schemaPreventivoTO, valori)
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
        body: JSON.stringify({ tipo: 'tour-operator', ...valori }),
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

      {/* 2. Destinazione */}
      <fieldset className="space-y-4">
        <SectionHeader n={2} title="Dove vuoi andare" subtitle="Scegli dal catalogo destinazioni" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Tipologia" name="tipologia" required
            value={tipologia}
            onChange={(v) => setTipologia(v)}
            onBlur={handleBlur}
            error={visible('tipologia')}
          >
            <option value="">— Seleziona —</option>
            {TIPOLOGIE.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </SelectField>
          <SelectField
            label="Destinazione" name="luogoId" required
            disabled={!tipologia}
            onBlur={handleBlur}
            error={visible('luogoId')}
            hint={!tipologia ? 'Scegli prima la tipologia' : undefined}
          >
            <option value="">— Seleziona una destinazione —</option>
            {luoghiFiltrati.map((l) => (
              <option key={l.id} value={l.id}>{l.nome}{l.sottocategoria ? ` · ${l.sottocategoria}` : ''}</option>
            ))}
          </SelectField>
        </div>
        {tipologia && luoghiFiltrati.length === 0 && (
          <p className="text-sm text-gray-500">
            Nessuna destinazione attiva per questa tipologia. Contatta Moreno via WhatsApp.
          </p>
        )}
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

      {/* Errore API */}
      {apiError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {apiError}
        </div>
      )}

      {/* Submit */}
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
