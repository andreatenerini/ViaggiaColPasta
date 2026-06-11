import { z } from 'zod'

/**
 * Schemi di validazione condivisi tra form (client) e, all'occorrenza, API.
 * I valori arrivano dal form come stringhe: usiamo coercizioni e refine mirati.
 */

const oggiISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const nome = z
  .string({ required_error: 'Campo obbligatorio' })
  .trim()
  .min(2, 'Minimo 2 caratteri')
  .max(60, 'Troppo lungo')

const email = z
  .string({ required_error: 'Email obbligatoria' })
  .trim()
  .min(1, 'Email obbligatoria')
  .email('Email non valida')

// Telefono opzionale: se compilato, formato plausibile (8-15 cifre, +, spazi, /, -)
const telefono = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => !v || /^[+]?[\d\s/.-]{8,20}$/.test(v),
    'Numero di telefono non valido',
  )

const dataObbligatoria = z
  .string({ required_error: 'Data obbligatoria' })
  .min(1, 'Data obbligatoria')

const interoNonNegativo = (label: string) =>
  z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || /^\d+$/.test(v), `${label}: solo numeri`)

const budget = z
  .string()
  .optional()
  .refine((v) => !v || (/^\d+$/.test(v) && Number(v) >= 0), 'Budget non valido')

/** Campi comuni a entrambi i preventivi */
const baseObject = {
  nomeCliente: nome,
  cognomeCliente: nome,
  emailCliente: email,
  telefonoCliente: telefono,
  dataPartenza: dataObbligatoria,
  dataRitorno: dataObbligatoria,
  numAdulti: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || (/^\d+$/.test(v) && Number(v) >= 1), 'Serve almeno 1 adulto'),
  numBambini04: interoNonNegativo('Bambini 0–4'),
  numBambini512: interoNonNegativo('Bambini 5–12'),
  numRagazzi1317: interoNonNegativo('Ragazzi 13–17'),
  tipoStruttura: z.string().optional(),
  budget,
  note: z.string().max(2000, 'Note troppo lunghe').optional(),
}

/** Refine cross-field su date: partenza non passata, ritorno ≥ partenza */
const conDate = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object(shape)
    .superRefine((data, ctx) => {
      const dp = (data as any).dataPartenza as string
      const dr = (data as any).dataRitorno as string
      if (dp) {
        const p = new Date(dp)
        if (!Number.isNaN(p.getTime()) && p < oggiISO()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dataPartenza'], message: 'La data non può essere nel passato' })
        }
      }
      if (dp && dr) {
        const p = new Date(dp)
        const r = new Date(dr)
        if (!Number.isNaN(p.getTime()) && !Number.isNaN(r.getTime()) && r < p) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dataRitorno'], message: 'Il ritorno deve essere dopo la partenza' })
        }
      }
    })

export const schemaPreventivoTO = conDate({
  ...baseObject,
  tipologia: z
    .string({ required_error: 'Seleziona una tipologia' })
    .min(1, 'Seleziona una tipologia'),
  luogoId: z
    .string({ required_error: 'Seleziona una destinazione' })
    .min(1, 'Seleziona una destinazione'),
})

export const schemaPreventivoLibero = conDate({
  ...baseObject,
  percorso: z
    .string({ required_error: 'Descrivi il percorso' })
    .trim()
    .min(10, 'Descrivi il percorso (almeno 10 caratteri)')
    .max(2000, 'Descrizione troppo lunga'),
  statiInteresse: z.string().optional(),
})

export type ErroriForm = Record<string, string>

/** Esegue la validazione e restituisce mappa campo→messaggio (vuota se valido). */
export function validaForm(
  schema: z.ZodTypeAny,
  valori: Record<string, unknown>,
): ErroriForm {
  const res = schema.safeParse(valori)
  if (res.success) return {}
  const errori: ErroriForm = {}
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? '_form')
    if (!errori[key]) errori[key] = issue.message
  }
  return errori
}
