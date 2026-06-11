import type { CollectionConfig } from 'payload'

export const Clienti: CollectionConfig = {
  slug: 'clienti',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'nome', 'cognome', 'numPreventiviTotali', 'updatedAt'],
    description:
      'Anagrafica clienti unificata (riconosciuti via email). Usata per calcolare lo sconto fedeltà 10% oltre i 5 preventivi.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    { name: 'nome', type: 'text' },
    { name: 'cognome', type: 'text' },
    { name: 'telefono', type: 'text' },
    {
      name: 'numPreventiviTotali',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Aggiornato automaticamente al pagamento di ogni preventivo.' },
    },
    {
      name: 'note',
      type: 'textarea',
    },
    // ─── Accesso area riservata (OTP) — campi tecnici, nascosti in admin ──
    { name: 'otpHash', type: 'text', admin: { hidden: true } },
    { name: 'otpScadenza', type: 'date', admin: { hidden: true } },
    { name: 'otpTentativi', type: 'number', defaultValue: 0, admin: { hidden: true } },
  ],
}
