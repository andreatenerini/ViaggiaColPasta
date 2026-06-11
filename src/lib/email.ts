import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sitravelperugia.it'
const replyTo = process.env.RESEND_REPLY_TO || 'moreno.maitini@sitravelperugia.it'

const resend = resendKey ? new Resend(resendKey) : null

export async function inviaEmailRingraziamento({
  to,
  nomeCliente,
  riepilogo,
  importoPagatoCent,
  scontoApplicato,
}: {
  to: string
  nomeCliente: string
  riepilogo: string
  importoPagatoCent: number
  scontoApplicato: boolean
}) {
  if (!resend) {
    console.warn('[email] Resend non configurato, skip invio a', to)
    return
  }
  const importo = (importoPagatoCent / 100).toFixed(2).replace('.', ',')
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: auto; color: #1a1a1a;">
      <h1 style="color: #0E5C7A;">Grazie ${nomeCliente}!</h1>
      <p>Ho ricevuto la tua richiesta di preventivo e l'ho già messa in lavorazione.</p>
      <p><strong>Riepilogo:</strong> ${riepilogo}</p>
      <p><strong>Importo pagato:</strong> € ${importo}${scontoApplicato ? ' <em>(sconto fedeltà 10% applicato)</em>' : ''}</p>
      <p>Nei prossimi giorni riceverai una mail da <a href="mailto:${replyTo}">${replyTo}</a> con la
      proposta personalizzata e il prezzo del viaggio. <strong>Dal prezzo del viaggio sarà scontato
      l'importo che hai appena pagato per questo preventivo.</strong></p>
      <p>A presto,<br/>Moreno Maitini · Si Travel Perugia</p>
    </div>
  `
  await resend.emails.send({
    from: `Si Travel Perugia <${fromEmail}>`,
    to,
    replyTo,
    subject: 'Grazie per la tua richiesta di preventivo!',
    html,
  })
}

export async function inviaCodiceAccesso({ to, codice }: { to: string; codice: string }) {
  if (!resend) {
    console.warn('[email] Resend non configurato — codice accesso per', to, '=', codice)
    return
  }
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: auto; color: #1a1a1a;">
      <h1 style="color: #0E5C7A; font-size: 20px;">Il tuo codice di accesso</h1>
      <p>Usa questo codice per accedere alla tua area riservata e vedere lo storico dei preventivi:</p>
      <p style="font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #052530; background: #F7F2EA; border-radius: 12px; padding: 16px 0; text-align: center; margin: 24px 0;">${codice}</p>
      <p style="color: #666; font-size: 14px;">Il codice scade tra 10 minuti. Se non hai richiesto l'accesso, ignora questa email.</p>
      <p style="color: #666; font-size: 14px;">Si Travel Perugia</p>
    </div>
  `
  await resend.emails.send({
    from: `Si Travel Perugia <${fromEmail}>`,
    to,
    replyTo,
    subject: 'Il tuo codice di accesso · Si Travel Perugia',
    html,
  })
}
