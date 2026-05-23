import Link from 'next/link'

export const metadata = { title: 'Cookie Policy' }

export default function CookiePage() {
  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Informativa</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-white/60 max-w-xl">
            Come utilizziamo i cookie e le tecnologie di tracciamento su questo sito.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-app py-16">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-12 space-y-8">

            <p className="text-sm text-gray-500">
              Ultimo aggiornamento: maggio 2025
            </p>

            <Section title="Cosa sono i cookie">
              <p>
                I cookie sono piccoli file di testo memorizzati nel tuo browser quando visiti
                un sito web. Servono a far funzionare correttamente il sito e, in alcuni casi,
                a raccogliere informazioni sull'utilizzo.
              </p>
            </Section>

            <Section title="Cookie tecnici (necessari)">
              <p>
                Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Cookie</th>
                    <th>Finalità</th>
                    <th>Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>payload-token</code></td>
                    <td>Autenticazione area admin (solo per Moreno)</td>
                    <td>Sessione</td>
                  </tr>
                  <tr>
                    <td><code>__stripe_mid</code>, <code>__stripe_sid</code></td>
                    <td>Prevenzione frodi Stripe (checkout)</td>
                    <td>1 anno / sessione</td>
                  </tr>
                </tbody>
              </table>
              <p>
                Questi cookie non richiedono consenso in quanto strettamente necessari
                all'erogazione del servizio richiesto (art. 122 D.Lgs. 196/2003).
              </p>
            </Section>

            <Section title="Cookie analitici e di profilazione">
              <p>
                Al momento questo sito <strong>non utilizza</strong> cookie analitici (Google
                Analytics o simili) né cookie di profilazione o remarketing.
              </p>
            </Section>

            <Section title="Cookie di terze parti">
              <p>
                Le pagine della videogallery possono incorporare video da{' '}
                <strong>YouTube</strong> e <strong>Vimeo</strong>. Questi servizi possono
                impostare i propri cookie quando il player viene caricato. Ti invitiamo a
                consultare le rispettive privacy policy:
              </p>
              <ul>
                <li>YouTube: policies.google.com/privacy</li>
                <li>Vimeo: vimeo.com/privacy</li>
              </ul>
            </Section>

            <Section title="Come disabilitare i cookie">
              <p>
                Puoi disabilitare i cookie attraverso le impostazioni del tuo browser. Tieni
                presente che disabilitare i cookie tecnici potrebbe compromettere il
                funzionamento di alcune parti del sito (es. il checkout Stripe).
              </p>
              <p>
                Istruzioni per i principali browser:
              </p>
              <ul>
                <li>Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
                <li>Firefox: Impostazioni → Privacy e sicurezza → Cookie e dati dei siti</li>
                <li>Safari: Preferenze → Privacy → Gestisci dati del sito</li>
              </ul>
            </Section>

            <Section title="Contatti">
              <p>
                Per qualsiasi domanda sui cookie scrivi a{' '}
                <a
                  href="mailto:moreno.maitini@sitravelperugia.it"
                  className="text-brand hover:text-brand-dark transition-colors"
                >
                  moreno.maitini@sitravelperugia.it
                </a>
                . Consulta anche la{' '}
                <Link href="/privacy" className="text-brand hover:text-brand-dark transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

          </div>
        </div>
      </section>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-brand-deeper mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:py-2 [&_th]:pr-4 [&_th]:font-semibold [&_th]:text-gray-700 [&_th]:border-b [&_th]:border-gray-200 [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-gray-100 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  )
}
