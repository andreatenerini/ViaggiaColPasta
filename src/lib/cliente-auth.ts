import crypto from 'crypto'

/**
 * Autenticazione cliente "leggera" per l'area riservata.
 * Niente password: codice OTP a 6 cifre via email + cookie di sessione firmato HMAC.
 * Usa PAYLOAD_SECRET come chiave: nessuna dipendenza esterna.
 */

const SECRET = process.env.PAYLOAD_SECRET || 'dev-secret-change-me'
export const COOKIE_NAME = 'sitravel_cliente'
export const SESSION_TTL_S = 60 * 60 * 24 * 7 // 7 giorni
export const OTP_TTL_MS = 10 * 60 * 1000 // 10 minuti
export const OTP_MAX_TENTATIVI = 5

/** Codice OTP a 6 cifre (con zeri iniziali). */
export function generaCodice(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
}

/** Hash del codice legato all'email (non reversibile). */
export function hashCodice(email: string, codice: string): string {
  return crypto.createHmac('sha256', SECRET).update(`otp:${email.toLowerCase()}:${codice}`).digest('hex')
}

/** Confronto timing-safe tra hash atteso e codice ricevuto. */
export function verificaCodice(hashAtteso: string, email: string, codice: string): boolean {
  const got = hashCodice(email, codice)
  if (got.length !== hashAtteso.length) return false
  return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(hashAtteso))
}

/** Token di sessione firmato: payload.signature (base64url). */
export function firmaSessione(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ e: email.toLowerCase(), x: Date.now() + SESSION_TTL_S * 1000 }),
  ).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

/** Verifica il token e ritorna l'email, oppure null se non valido/scaduto. */
export function verificaSessione(token: string | undefined | null): string | null {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.e || !data.x || Date.now() > data.x) return null
    return String(data.e)
  } catch {
    return null
  }
}
