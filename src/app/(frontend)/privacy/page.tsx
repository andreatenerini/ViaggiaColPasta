import Link from 'next/link'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Informativa</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60 max-w-xl">
            Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-app py-16">
        <div className="max-w-3xl mx-auto prose prose-gray prose-headings:font-display prose-headings:text-brand-deeper prose-a:text-brand hover:prose-a:text-brand-dark">

          <div className="card p-8 md:p-12 space-y-8">

            <div>
              <p className="text-sm text-gray-500 mb-6">
                Ultimo aggiornamento: maggio 2025
              </p>
              <p>
                La presente informativa descrive le modalità di trattamento dei dati personali
                degli utenti che visitano il sito <strong>sitravelperugia.it</strong> e utilizzano
                i servizi offerti da <strong>Si Travel Perugia — Moreno Maitini</strong>.
              </p>
            </div>

            <Section title="1. Titolare del trattamento">
              <p>
                Moreno Maitini · Si Travel Perugia<br />
                Perugia (PG), Italia<br />
                Email: <a href="mailto:moreno.maitini@sitravelperugia.it">moreno.maitini@sitravelperugia.it</a>
              </p>
            </Section>

            <Section title="2. Dati raccolti">
              <p>Raccogliamo i seguenti dati personali quando compili un modulo di preventivo:</p>
              <ul>
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Numero di telefono (facoltativo)</li>
                <li>Dati relativi al viaggio richiesto (destinazione, date, composizione del gruppo)</li>
                <li>Dati di pagamento — elaborati direttamente da <strong>Stripe</strong> (non conserviamo i dati della carta)</li>
              </ul>
            </Section>

            <Section title="3. Finalità del trattamento">
              <p>I tuoi dati vengono trattati per:</p>
              <ul>
                <li>Elaborare e gestire la tua richiesta di preventivo</li>
                <li>Inviare comunicazioni relative alla tua pratica (email di conferma, proposta di viaggio)</li>
                <li>Riconoscere lo sconto fedeltà ai clienti abituali (tramite indirizzo email)</li>
                <li>Adempiere agli obblighi di legge</li>
              </ul>
              <p>
                Non utilizziamo i tuoi dati per finalità di marketing senza esplicito consenso.
              </p>
            </Section>

            <Section title="4. Base giuridica">
              <p>
                Il trattamento è basato sull'esecuzione del contratto (art. 6 par. 1 lett. b GDPR)
                per la gestione della richiesta di preventivo, e sul legittimo interesse per la
                gestione del programma fedeltà.
              </p>
            </Section>

            <Section title="5. Conservazione dei dati">
              <p>
                I dati relativi ai preventivi sono conservati per <strong>5 anni</strong> dalla
                data dell'ultima transazione, come previsto dagli obblighi fiscali e contabili.
              </p>
            </Section>

            <Section title="6. Terze parti">
              <p>I tuoi dati possono essere condivisi con:</p>
              <ul>
                <li><strong>Stripe Inc.</strong> — processore di pagamenti (Privacy Policy: stripe.com/privacy)</li>
                <li><strong>Resend</strong> — servizio di invio email transazionali</li>
                <li><strong>Neon / Vercel</strong> — hosting e database (infrastruttura cloud)</li>
              </ul>
              <p>Nessun dato viene venduto a terzi.</p>
            </Section>

            <Section title="7. I tuoi diritti">
              <p>
                Ai sensi del GDPR hai il diritto di accedere, rettificare, cancellare o limitare
                il trattamento dei tuoi dati personali, nonché di opporti al trattamento e di
                richiedere la portabilità dei dati. Per esercitare questi diritti scrivi a{' '}
                <a href="mailto:moreno.maitini@sitravelperugia.it">moreno.maitini@sitravelperugia.it</a>.
              </p>
            </Section>

            <Section title="8. Cookie">
              <p>
                Per informazioni sull'uso dei cookie consulta la{' '}
                <Link href="/cookie">Cookie Policy</Link>.
              </p>
            </Section>

            <Section title="9. Modifiche">
              <p>
                Ci riserviamo il diritto di aggiornare questa informativa. Le modifiche saranno
                pubblicate su questa pagina con la data di aggiornamento.
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
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
  )
}
