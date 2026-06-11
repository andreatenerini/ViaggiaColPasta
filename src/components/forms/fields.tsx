'use client'
import { useState, type ReactNode } from 'react'

/* ─── Icone ────────────────────────────────────────────────────────────── */
function ErrorIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )
}

/* ─── Header di sezione (badge numerato) ──────────────────────────────── */
export function SectionHeader({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white font-display font-bold text-sm flex items-center justify-center shadow-brand-sm">
        {n}
      </span>
      <div>
        <h3 className="font-display font-bold text-brand-deeper leading-none text-lg">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="field-error">
      <ErrorIcon />
      {msg}
    </p>
  )
}

/* ─── Text / email / tel / date ───────────────────────────────────────── */
export function TextField({
  label, name, type = 'text', required, placeholder, hint, error,
  defaultValue, onBlur, autoComplete, min,
}: {
  label: string; name: string; type?: string; required?: boolean
  placeholder?: string; hint?: string; error?: string
  defaultValue?: string | number; onBlur?: (name: string) => void
  autoComplete?: string; min?: string | number
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}{required && <span className="text-brand-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        onBlur={() => onBlur?.(name)}
        className={`field-input${error ? ' field-invalid' : ''}`}
      />
      {error ? <FieldError id={`${name}-err`} msg={error} /> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

/* ─── Select ──────────────────────────────────────────────────────────── */
export function SelectField({
  label, name, required, error, hint, value, defaultValue, onChange, onBlur, disabled, children,
}: {
  label: string; name: string; required?: boolean; error?: string; hint?: string
  value?: string; defaultValue?: string; onChange?: (v: string) => void
  onBlur?: (name: string) => void; disabled?: boolean; children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}{required && <span className="text-brand-accent"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => onBlur?.(name)}
        className={`field-select${error ? ' field-invalid' : ''}`}
      >
        {children}
      </select>
      {error ? <FieldError id={`${name}-err`} msg={error} /> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

/* ─── Textarea ────────────────────────────────────────────────────────── */
export function TextareaField({
  label, name, required, rows = 4, placeholder, hint, error, onBlur,
}: {
  label: string; name: string; required?: boolean; rows?: number
  placeholder?: string; hint?: string; error?: string; onBlur?: (name: string) => void
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}{required && <span className="text-brand-accent"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        onBlur={() => onBlur?.(name)}
        className={`field-input resize-none${error ? ' field-invalid' : ''}`}
      />
      {error ? <FieldError id={`${name}-err`} msg={error} /> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

/* ─── Number stepper (persone) ────────────────────────────────────────── */
export function NumberStepper({
  label, name, defaultValue = 0, min = 0, max = 20,
}: {
  label: string; name: string; defaultValue?: number; min?: number; max?: number
}) {
  const [val, setVal] = useState(defaultValue)
  const clamp = (n: number) => Math.max(min, Math.min(max, n))
  return (
    <div>
      <label className="field-label text-xs">{label}</label>
      <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setVal((v) => clamp(v - 1))}
          disabled={val <= min}
          aria-label={`Diminuisci ${label}`}
          className="w-9 h-11 flex items-center justify-center text-brand text-lg font-bold hover:bg-brand/5 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
        >
          −
        </button>
        <input
          type="number"
          name={name}
          value={val}
          min={min}
          max={max}
          readOnly
          tabIndex={-1}
          className="w-full min-w-0 text-center font-semibold text-brand-deeper border-0 focus:ring-0 bg-transparent p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => setVal((v) => clamp(v + 1))}
          disabled={val >= max}
          aria-label={`Aumenta ${label}`}
          className="w-9 h-11 flex items-center justify-center text-brand text-lg font-bold hover:bg-brand/5 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

/* ─── Hook: gestione errori + touched ─────────────────────────────────── */
export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const visible = (name: string) => ((touched[name] || submitted) ? errors[name] : undefined)
  const markTouched = (name: string) => setTouched((t) => ({ ...t, [name]: true }))

  return { errors, setErrors, touched, markTouched, submitted, setSubmitted, visible }
}
