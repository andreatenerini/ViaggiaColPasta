import Link from 'next/link'

export const metadata = { title: 'Grazie!' }

export default function GraziePage() {
  return (
    <section className="container-app py-24 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sand via-white to-white pointer-events-none" />
          <div className="relative">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-6 shadow-brand-sm">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-deeper mb-3">
              Richiesta inviata!
            </h1>
            <p className="text-gray-600 mb-2 leading-relaxed">
              Ho ricevuto il tuo preventivo. Ti arriverà subito una mail di conferma — nei prossimi
              giorni riceverai la proposta personalizzata da{' '}
              <a href="mailto:moreno.maitini@sitravelperugia.it" className="text-brand hover:text-brand-dark underline underline-offset-2 transition-colors">
                moreno.maitini@sitravelperugia.it
              </a>.
            </p>

            {/* Reminder box */}
            <div className="mt-6 mb-8 flex items-start gap-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl px-5 py-4 text-left">
              <svg className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-gray-600">
                Ricorda: l&apos;importo che hai appena pagato sarà{' '}
                <strong className="text-brand-deeper font-semibold">scontato dal prezzo del viaggio</strong>
                {' '}se accetti la proposta.
              </p>
            </div>

            <Link href="/" className="btn-primary">
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
