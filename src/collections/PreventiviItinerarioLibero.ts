import type { CollectionConfig } from 'payload'

export const PreventiviItinerarioLibero: CollectionConfig = {
  slug: 'preventivi-itinerario-libero',
  admin: {
    useAsTitle: 'riepilogo',
    defaultColumns: ['riepilogo', 'emailCliente', 'statoPagamento', 'createdAt'],
    description: 'Richieste di preventivo per itinerari liberi (a pagamento, prezzo fisso).',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'riepilogo',
      type: 'text',
      admin: { readOnly: true },
    },
    // ─── Contatti cliente ────────────────────────────────────────
    { name: 'nomeCliente', type: 'text', required: true },
    { name: 'cognomeCliente', type: 'text', required: true },
    { name: 'emailCliente', type: 'email', required: true },
    { name: 'telefonoCliente', type: 'text' },
    // ─── Specifiche itinerario ───────────────────────────────────
    {
      name: 'percorso',
      type: 'textarea',
      required: true,
      label: 'Descrizione percorso',
      admin: {
        description: 'Es. "Viaggio in ex-Jugoslavia 10 giorni, città: Lubiana, Zagabria, Belgrado, Podgorica, Skopje".',
      },
    },
    {
      name: 'statiInteresse',
      type: 'text',
      hasMany: true,
      label: 'Stati di interesse (opzionale)',
      admin: { description: 'Per ricerche e filtri lato admin.' },
    },
    {
      name: 'budget',
      type: 'number',
      label: 'Budget indicativo (€)',
    },
    {
      name: 'tipoStruttura',
      type: 'select',
      options: [
        { label: 'Hotel', value: 'hotel' },
        { label: 'Residence', value: 'residence' },
        { label: 'Appartamenti', value: 'appartamenti' },
        { label: 'Campeggio', value: 'campeggio' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'dataPartenza', type: 'date', required: true, admin: { width: '50%' } },
        { name: 'dataRitorno', type: 'date', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'numAdulti', type: 'number', required: true, defaultValue: 2, min: 0, admin: { width: '25%' } },
        { name: 'numBambini04', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%' } },
        { name: 'numBambini512', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%' } },
        { name: 'numRagazzi1317', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%' } },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
    },
    // ─── Stato pagamento ─────────────────────────────────────────
    {
      name: 'statoPagamento',
      type: 'select',
      defaultValue: 'in-attesa',
      options: [
        { label: 'In attesa', value: 'in-attesa' },
        { label: 'Pagato', value: 'pagato' },
        { label: 'Fallito', value: 'fallito' },
        { label: 'Rimborsato', value: 'rimborsato' },
      ],
    },
    { name: 'importoPagatoCent', type: 'number', admin: { readOnly: true } },
    { name: 'scontoApplicato', type: 'checkbox', defaultValue: false, admin: { readOnly: true } },
    { name: 'stripeSessionId', type: 'text', admin: { readOnly: true } },
    { name: 'stripePaymentIntentId', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && data.dataPartenza && data.dataRitorno) {
          const tot = (data.numAdulti || 0) + (data.numBambini04 || 0) + (data.numBambini512 || 0) + (data.numRagazzi1317 || 0)
          const percorsoBreve = (data.percorso || '').slice(0, 40)
          data.riepilogo = `${percorsoBreve}… · ${tot} pax · ${data.dataPartenza} → ${data.dataRitorno}`
        }
        return data
      },
    ],
  },
}
