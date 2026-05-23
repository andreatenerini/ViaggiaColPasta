'use client'
import { useEffect, useState } from 'react'

type Luogo = { id: string; nome: string; tipologia: string; sottocategoria?: string }

export function FormPreventivoTO() {
  const [luoghi, setLuoghi] = useState<Luogo[]>([])
  const [tipologia, setTipologia] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/luoghi')
      .then((r) => r.json())
      .then((d) => setLuoghi(d.docs || []))
      .catch(() => setLuoghi([]))
  }, [])

  const luoghiFiltrati = tipologia
    ? luoghi.filter((l) => l.tipologia === tipologia)
    : luoghi

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
        body: JSON.stringify({ tipo: 'tour-operator', ...payload }),
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
      <Section title="I tuoi contatti">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome" name="nomeCliente" required />
          <Field label="Cognome" name="cognomeCliente" required />
        </div>
        <Field label="Email" name="emailCliente" type="email" required />
        <Field label="Telefono" name="telefonoCliente" type="tel" />
      </Section>

      <Section title="Dove vuoi andare">
        <div>
          <label className="field-label">Tipologia</label>
          <select
            name="tipologia"
            required
            className="field-input"
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
          >
            <option value="">— Seleziona —</option>
            <option value="lungo-raggio">Lungo Raggio</option>
            <option value="medio-raggio">Medio Raggio</option>
            <option value="italia-mare">Italia Mare</option>
            <option value="crociere">Crociere</option>
          </select>
        </div>
        <div>
          <label className="field-label">Destinazione</label>
          <select name="luogoId" required className="field-input" disabled={!tipologia}>
            <option value="">— Seleziona una destinazione —</option>
            {luoghiFiltrati.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome}
                {l.sottocategoria ? ` · ${l.sottocategoria}` : ''}
              </option>
            ))}
          </select>
          {tipologia && luoghiFiltrati.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Nessuna destinazione attiva per questa tipologia. Contatta Moreno via WhatsApp.
            </p>
          )}
        </div>
      </Section>

      <Section title="Quando e con chi">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dal" name="dataPartenza" type="date" required />
          <Field label="Al" name="dataRitorno" type="date" required />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Adulti" name="numAdulti" type="number" defaultValue={2} min={0} />
          <Field label="0–4 anni" name="numBambini04" type="number" defaultValue={0} min={0} />
          <Field label="5–12 anni" name="numBambini512" type="number" defaultValue={0} min={0} />
          <Field label="13–17 anni" name="numRagazzi1317" type="number" defaultValue={0} min={0} />
        </div>
      </Section>

      <Section title="Dettagli">
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
        <Field label="Budget indicativo (€)" name="budget" type="number" min={0} />
        <div>
          <label className="field-label">Note</label>
          <textarea name="note" rows={4} className="field-input" />
        </div>
      </Section>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Vado al pagamento…' : 'Prosegui al pagamento'}
      </button>
      <p className="text-xs text-gray-500 text-center">
        Pagamento sicuro tramite Stripe. Riceverai una mail di conferma e la proposta entro pochi giorni.
      </p>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-brand uppercase tracking-wide">{title}</legend>
      {children}
    </fieldset>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  defaultValue,
  min,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string | number
  min?: number
}) {
  return (
    <div>
      <label className="field-label">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        min={min}
        className="field-input"
      />
    </div>
  )
}
