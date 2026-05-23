import { FormPreventivoTO } from '@/components/FormPreventivoTO'

export const metadata = { title: 'Preventivo Tour Operator' }

export default function PreventivoToPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden bg-brand-deeper py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deeper via-brand-dark to-[#0a5568]" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand-accent/8 blur-[80px] pointer-events-none" />
        <div className="container-app relative z-10">
          <span className="section-label text-white/50 mb-4 block">Preventivo</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Tour Operator
          </h1>
          <p className="text-white/60 max-w-xl">
            Scegli la destinazione dal catalogo. Riceverai una proposta personalizzata via email.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="container-app py-14">
        <div className="max-w-3xl mx-auto">
          {/* Trust notice */}
          <div className="flex items-start gap-4 bg-brand-accent/10 border border-brand-accent/25 rounded-2xl px-6 py-4 mb-10">
            <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-gray-700 leading-relaxed">
              L&apos;importo che paghi adesso viene{' '}
              <strong className="text-brand font-semibold">scontato dal prezzo finale del viaggio</strong>
              {' '}se la proposta ti piace.
            </p>
          </div>

          <FormPreventivoTO />
        </div>
      </section>
    </>
  )
}
