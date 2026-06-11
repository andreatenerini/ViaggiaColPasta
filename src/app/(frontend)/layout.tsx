import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Si Travel Perugia — Tour Operator',
    template: '%s · Si Travel Perugia',
  },
  description:
    'Si Travel Perugia: agenzia tour operator. Preventivi su misura per viaggi lunghi, crociere e itinerari liberi.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-body antialiased">
        <Header />
        <Breadcrumbs />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
