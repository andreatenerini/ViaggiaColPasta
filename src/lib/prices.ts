// Tariffario dei preventivi, in centesimi. I valori sono in .env.local
// (PREZZO_PREVENTIVO_TO_* / PREZZO_PREVENTIVO_ITINERARIO_LIBERO).

export type TipologiaTO = 'lungo-raggio' | 'medio-raggio' | 'italia-mare' | 'crociere'

const parseCent = (v: string | undefined, fallback: number): number => {
  if (!v) return fallback
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}

export function prezzoPreventivoTOCent(tipologia: TipologiaTO): number {
  switch (tipologia) {
    case 'lungo-raggio':
      return parseCent(process.env.PREZZO_PREVENTIVO_TO_LUNGO_RAGGIO, 5000)
    case 'medio-raggio':
      return parseCent(process.env.PREZZO_PREVENTIVO_TO_MEDIO_RAGGIO, 4000)
    case 'italia-mare':
      return parseCent(process.env.PREZZO_PREVENTIVO_TO_ITALIA_MARE, 3000)
    case 'crociere':
      return parseCent(process.env.PREZZO_PREVENTIVO_TO_CROCIERE, 4000)
  }
}

export function prezzoPreventivoLiberoCent(): number {
  return parseCent(process.env.PREZZO_PREVENTIVO_ITINERARIO_LIBERO, 5000)
}

export const sogliaSconto = (): number =>
  parseCent(process.env.SCONTO_FEDELTA_SOGLIA, 5)

export const percentualeSconto = (): number =>
  parseCent(process.env.SCONTO_FEDELTA_PERCENTUALE, 10)

/**
 * Calcola il prezzo finale applicando lo sconto fedeltà se applicabile.
 * Lo sconto si applica dal preventivo n. (soglia + 1) in poi.
 */
export function applicaSconto(prezzoCent: number, preventiviGiaPagati: number): {
  finaleCent: number
  scontoApplicato: boolean
} {
  if (preventiviGiaPagati >= sogliaSconto()) {
    const sconto = Math.round(prezzoCent * (percentualeSconto() / 100))
    return { finaleCent: prezzoCent - sconto, scontoApplicato: true }
  }
  return { finaleCent: prezzoCent, scontoApplicato: false }
}
