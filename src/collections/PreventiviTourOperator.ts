import type { CollectionConfig } from 'payload'

export const PreventiviTourOperator: CollectionConfig = {
  slug: 'preventivi-tour-operator',
  admin: {
    useAsTitle: 'riepilogo',
    defaultColumns: ['riepilogo', 'tipologia', 'emailCliente', 'statoPagamento', 'createdAt'],
    description: 'Richieste di preventivo da catalogo Tour Operator (a pagamento via Stripe).',
  },
  access: {
    // Solo admin/staff in lettura; creazione anche via API pubblica
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'riepilogo',
      type: 'text',
      admin: { readOnly: true, description: 'Generato automaticamente (es. "Vietnam · 4 adulti · 12-19 giu 2026").' },
    },
    // ─── Contatti cliente ────────────────────────────────────────
    {
      name: 'nomeCliente',
      type: 'text',
      required: true,
    },
    {
      name: 'cognomeCliente',
      type: 'text',
      required: true,
    },
    {
      name: 'emailCliente',
      type: 'email',
      required: true,
    },
    {
      name: 'telefonoCliente',
      type: 'text',
    },
    // ─── Specifiche viaggio ──────────────────────────────────────
    {
      name: 'tipologia',
      type: 'select',
      required: true,
      options: [
        { label: 'Lungo Raggio', value: 'lungo-raggio' },
        { label: 'Medio Raggio', value: 'medio-raggio' },
        { label: 'Italia Mare', value: 'italia-mare' },
        { label: 'Crociere', value: 'crociere' },
      ],
    },
    {
      name: 'sottocategoria',
      type: 'text',
      admin: {
        condition: (data) =>
          data?.tipologia === 'lungo-raggio' || data?.tipologia === 'medio-raggio',
      },
    },
    {
      name: 'luogo',
      type: 'relationship',
      relationTo: 'luoghi',
      required: true,
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
        { name: 'numBambini04', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%', description: 'Bambini 0–4' } },
        { name: 'numBambini512', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%', description: 'Bambini 5–12' } },
        { name: 'numRagazzi1317', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%', description: 'Ragazzi 13–17' } },
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
    {
      name: 'importoPagatoCent',
      type: 'number',
      label: 'Importo pagato (centesimi)',
      admin: { readOnly: true },
    },
    {
      name: 'scontoApplicato',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sconto fedeltà 10% applicato',
      admin: { readOnly: true },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Genera un riepilogo leggibile per la lista admin
        if (data && data.dataPartenza && data.dataRitorno) {
          const tot = (data.numAdulti || 0) + (data.numBambini04 || 0) + (data.numBambini512 || 0) + (data.numRagazzi1317 || 0)
          data.riepilogo = `${data.tipologia || ''} · ${tot} pax · ${data.dataPartenza} → ${data.dataRitorno}`
        }
        return data
      },
    ],
  },
}
